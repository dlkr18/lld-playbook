# Traffic Signal Control — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> This is a **safety-critical** design, and it had a safety defect: no all-red
> clearance interval. Every phase change handed the opposing direction a green in
> the same tick that the previous direction's yellow ended (§7.1). It also carried a
> per-light State machine that nothing called — dead *and* the wrong abstraction
> (§7.2).

---

## 1. Clarifying Questions (first 5 minutes)

1. **What is the actual safety invariant?** Not "N-S and E-W are never green
   together" — that's necessary but insufficient. It's that **a green is never given
   until the conflicting direction has been red long enough for the box to clear.**
   Getting that distinction stated early is the point of the problem.
2. **Fixed timing or sensor-adaptive?** Fixed-cycle here, with the timing policy as a
   seam so adaptive is a substitution rather than a rewrite.
3. **Multiple intersections?** Yes — coordinated as a group, which is what motivates
   the Composite.
4. **Emergency preemption?** Yes: freeze everything to all-red. And critically, the
   *release* from emergency is itself a dangerous transition (§7.1).
5. **Pedestrian phases, turn arrows?** Out of scope, and they're the main reason a
   real controller has more phases.
6. **What drives time?** A scheduler tick, so the cycle is testable without sleeping.

---

## 2. Functional Requirements

- Model a four-way intersection with N/S/E/W lights.
- Cycle phases automatically on a tick.
- Emergency preemption: all-red hold, and a safe release.
- Group intersections and drive them together.
- Start/stop the controller cleanly.

## 3. Non-Functional Requirements

- **Never two conflicting greens** — and never a green without a preceding all-red.
- Opposing approaches (N with S, E with W) always show the same signal.
- The scheduler thread and registration must not race.
- The cycle must be steppable for testing, not wall-clock dependent.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `Signal` | model (enum) | `RED`, `YELLOW`, `GREEN`. |
| `Direction` | model (enum) | `NORTH`, `SOUTH`, `EAST`, `WEST`. |
| `TrafficLight` | model | One approach's lamp: a `Direction` and a `Signal`. Nothing more. |
| `Intersection` | model | Four lights + a **six-phase** cycle + an emergency flag. Leaf of the Composite. `isAllRed()` exposes the clearance state. |
| `TrafficComponent` | service (interface) | `getId`, `tick`, `enterEmergency`, `exitEmergency` — implemented by both a single intersection and a group. |
| `IntersectionGroup` | service/impl | Composite node: fans `tick`/emergency out to children. |
| `TrafficController` / `TrafficControllerImpl` | service | Registry + `ScheduledExecutorService` driving ticks; `tickOnce()` for tests. |
| `TrafficControl` | root | Facade. |

**Deleted as dead code:** `SignalState`, `GreenState`, `YellowState`, `RedState` —
a complete per-light State machine that nothing ever invoked (§7.2).

---

## 5. Relationships

```
TrafficComponent  (tick / enterEmergency / exitEmergency)
      ├── Intersection      (leaf)  ── 4x TrafficLight
      └── IntersectionGroup (composite) ── many TrafficComponent
```

- `TrafficController` holds `TrafficComponent`s and doesn't care whether each is one
  intersection or a whole corridor — that's the Composite paying off.
- `Intersection` **owns** its four lights and is the **only** thing that may change
  them (`setSignal` is package-private). Safety is enforceable precisely because
  there's a single writer that can see all four directions at once.
- Phase is an `int` advanced modulo 6; the lamps are a pure function of it.

---

## 6. Design Patterns (name + why vs alternatives)

- **Composite — `TrafficComponent`.** A single intersection and a coordinated group
  are driven identically, so the controller has no branching. This is the textbook
  case for Composite and it's genuinely earned here.
- **Phase-based state machine on `Intersection`.** The cycle is the state, and it
  lives at the level where conflicting directions are visible together. §7.2 is the
  argument for why this is right and per-light State was wrong.
- **Scheduler injection / `tickOnce`.** The cycle advances on a tick rather than by
  sleeping, so the entire safety property is testable in a tight loop — §7.1's
  60,000-tick check runs in milliseconds.
- *(Considered, deleted)* **State pattern per light.** Present in the code, dead, and
  incapable of expressing the safety invariant — see §7.2.
- *(Considered, not built)* **Strategy for timing policy** — fixed-time vs
  sensor-adaptive vs time-of-day. The seam is "how many ticks does each phase last",
  which is the natural next extension (§8).
- *(Considered, not built)* **Observer** for logging or a monitoring dashboard.

---

## 7. Key Implementation Details

### 7.1 No all-red clearance interval (the headline)

The cycle had four phases:

```
0: NS green,  EW red
1: NS yellow, EW red
2: NS red,    EW green      <-- straight from NS-yellow to EW-green
3: NS red,    EW yellow
```

Phase 1 → 2 ends N-S's yellow and gives E-W a green **in the same tick**. Any vehicle
that entered on the yellow is still in the intersection when cross traffic is
released into it. Measured on the original code:

```
tick  NS      EW
1     YELLOW  RED
2     RED     GREEN    *** yellow -> opposing GREEN with NO all-red interval ***
```

— and the same violation at every single phase change, forever.

This is *the* thing a traffic-control question is testing. "Never two greens at once"
is the invariant people state; it was satisfied here and the design was still
unsafe. The real invariant is **temporal**: a green requires that the conflicting
direction has already been red for a clearance interval.

Fixed by making the cycle six phases:

```
0: NS green      3: EW green
1: NS yellow     4: EW yellow
2: ALL RED       5: ALL RED
```

```
tick  NS      EW
1     YELLOW  RED
2     RED     RED      <- ALL-RED clearance
3     RED     GREEN    <- green, preceded by all-red
```

Verified over 60,000 ticks: **0 conflicting greens, 20,000 all-red intervals**
(exactly one phase in three), and the opposing pairs never drift out of sync.

**The emergency release was the same bug in a different place.** `exitEmergency` set
`phase = 0` and applied it — jumping from all-red straight to N-S green. Coming out
of an emergency hold is precisely when cross traffic may still be crossing the box,
so it now releases into the clearance phase instead:

```java
public synchronized void exitEmergency() {
    emergency = false;
    phase = PHASE_CLEAR_AFTER_EW;   // release into clearance, not into a green
    applyPhase();
}
```

```
held:        allRed=true
on release:  allRed=true   OK — releases into clearance, not straight to green
next tick:   NS=GREEN EW=RED
```

Worth saying explicitly in an interview: **when you add a safety interval, audit
every path that sets the phase**, not just the main cycle. The bug had two sites and
fixing only the loop would have left the dangerous one.

### 7.2 A State pattern that was both dead and wrong

`TrafficLight` held a `SignalState` with a proper transition chain
(`GreenState.next() → YellowState`, each with a `durationMs`). Confirmed by grep:
**`advance()` was never called anywhere, and `durationMs()` was never read.**
`Intersection` drove the lamps through `setSignal`, which replaced the state object
wholesale — bypassing the machine entirely.

The interesting question is *why* it was bypassed, and the answer is that it was the
wrong seam. A per-light state machine can express "green becomes yellow becomes
red". It **cannot** express the safety invariant, because
"N-S may go green only once E-W has been red for the clearance interval" is a
property of the *intersection*, not of any single lamp. A lamp does not know what the
cross street is doing.

So the four state classes were deleted and `TrafficLight` reduced to a `Direction`
and a `Signal`. The real state machine is the phase cycle on `Intersection`, which is
the level where all four directions are visible simultaneously.

**The general principle: put the state machine where the invariant is checkable.** A
pattern applied one level too low doesn't just fail to help — it creates a plausible
place for a future maintainer to add safety logic that cannot possibly work.

### 7.3 Opposing pairs move together

```java
private void setPair(Signal signal, TrafficLight a, TrafficLight b) { ... }
```

N and S are always set together, E and W always together. There is no code path that
can set North without South, which makes "opposing approaches agree" true by
construction rather than by test. The 60,000-tick harness asserts it anyway, since it
is cheap and the property is load-bearing.

### 7.4 The registry raced with the scheduler

`TrafficControllerImpl` kept components in a plain `HashMap`, and `register` wasn't
synchronized — while a `ScheduledExecutorService` thread iterated that same map every
second in `tickOnce()`. Registering an intersection while the controller was running
could throw `ConcurrentModificationException` mid-tick, which in this domain means
the cycle stops advancing. Changed to `ConcurrentHashMap`.

`start()` is idempotent (returns early if a scheduler exists) and `stop()` nulls the
reference after `shutdownNow()`, so restart works — both already correct, and both
worth pointing at as the kind of lifecycle handling a scheduler needs.

---

## 8. Likely Follow-ups (with concise answers)

- **Different phase durations?** Currently every phase is one tick, so a 2-second
  yellow and a 30-second green are indistinguishable. Real controllers hold each
  phase for a configured number of ticks — a `Map<Phase, Integer>` plus a countdown,
  and the natural home for a **timing Strategy** (fixed / time-of-day / adaptive).
- **Sensor-driven adaptive timing?** Extend the green while a loop detector reports
  waiting vehicles, subject to a maximum. The clearance interval must stay
  non-negotiable — that's the point of keeping it structural rather than configurable.
- **How long should all-red actually be?** Derived from intersection width and
  approach speed — typically 1–2 seconds. Naming that it's *computed*, not picked,
  shows the domain is understood.
- **Green waves across a corridor?** Offset each intersection's phase by the travel
  time between them. `IntersectionGroup` is the right place: it already fans ticks
  out and could stagger them.
- **Pedestrian phases?** More phases, plus the walk/flashing-don't-walk clearance —
  the same clearance concept applied to a slower participant.
- **What if a light fails?** Real controllers fail to flashing-red (all-way stop),
  never to dark or to a green. A `FaultState` on the intersection.
- **Left-turn arrows?** Protected turns are additional phases with their own
  conflicts; the phase table grows and is usually generated from a conflict matrix
  rather than hand-written — which is how you'd scale this design.
- **How would you test it?** Exactly the harness used here: step the cycle for tens of
  thousands of ticks and assert (a) no two conflicting greens, (b) every green is
  preceded by an all-red, (c) opposing pairs always agree. Cheap because the design
  ticks rather than sleeps.

---

## 9. Trade-offs

- **Six phases instead of four:** one third of the cycle is clearance, which reduces
  throughput. That is the correct trade — capacity is negotiable, clearance is not.
- **Clearance as a phase rather than a duration:** makes it structurally impossible
  to skip, but ties its length to the tick rate. Configurable per-phase durations
  (§8) is the real answer and the current model is the honest simple version.
- **Phase as an `int` with a `switch`-like chain:** trivially auditable — you can read
  the whole safety property in one method. It doesn't scale to protected turns and
  pedestrian phases, where a conflict matrix is the right representation.
- **Deleting the per-light State classes:** removes a working-looking abstraction that
  couldn't hold the invariant. The cost is that `TrafficLight` is now nearly a value
  object; the benefit is there's exactly one place safety can be reasoned about.
- **Tick-driven rather than wall-clock:** makes the safety property testable in
  milliseconds, at the cost of real timing living outside the model.
- **`synchronized` on `Intersection`:** coarse and correct. Contention is irrelevant —
  one tick per second per intersection.
- **In-memory, single-process:** a real deployment is distributed field controllers
  with a central coordinator, where the clearance interval must be enforced *locally*
  because the network can fail. Worth stating: safety logic must never depend on a
  remote call.

# Elevator System — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a multi-elevator controller that handles hall calls, in-car floor requests, and SCAN/LOOK dispatch with step-based simulation.

---

## 1. Clarifying Questions

- How many elevators and floors? (Configurable; demo uses small set.)
- Scheduling algorithm? (SCAN default; LOOK variant in package.)
- Request types? (External hall up/down, internal car buttons.)
- Simulation vs real-time? (Explicit `step()` tick — no background threads required.)
- Capacity / weight? (Out of scope — mention as extension.)
- Emergency stop? (Extension — priority override queue.)
- Thread-safety? (Concurrent collections for destinations.)

---

## 2. Functional Requirements

1. **Submit request** — hall or car floor button creates `Request`.
2. **Dispatch** — scheduler assigns request to best elevator (SCAN/LOOK).
3. **Move elevators** — each step moves one floor toward next destination.
4. **Direction logic** — elevator continues in direction until no stops ahead (SCAN).
5. **Complete request** — remove floor from destination set when served.
6. **Status** — per-elevator direction, current floor, idle/busy.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Concurrency** | `ConcurrentSkipListSet` for destination floors |
| **Extensibility** | `ElevatorScheduler` strategy interface |
| **Determinism** | Step simulation for reproducible demos |
| **Scale** | O(log n) insert/remove per destination set |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `Elevator` | model | Single car | Current floor, direction, destination set |
| `Request` | model | Service call | Source floor, direction, type |
| `Direction` / `ElevatorStatus` | model | Enums | UP, DOWN, IDLE |
| `ElevatorScheduler` | scheduler | Strategy API | `assign(elevators, request)` |
| `ScanElevatorScheduler` | impl | SCAN algo | Same-direction, moving toward, else nearest idle |
| `LookElevatorScheduler` | impl | LOOK variant | Stops reversing when no ahead requests |
| `ElevatorController` | service | Control API | submit, step, status |
| `OptimalElevatorController` | impl | Controller | Maps elevator id → `Elevator` |
| `ElevatorSystem` | orchestrator | Facade | Wires scheduler + controller |

---

## 5. Relationships

- `ElevatorSystem` **owns** `ElevatorController` and **injects** `ElevatorScheduler`.
- Controller **manages** collection of `Elevator` instances.
- Scheduler **reads** elevator state, **returns** chosen elevator id.
- Each `Elevator` **owns** destination `ConcurrentSkipListSet`.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **Strategy** (`ElevatorScheduler`) | Swap SCAN/LOOK/SSTF without controller rewrite |
| **Facade** (`ElevatorSystem`) | Single interview entry point |
| **State-like behavior** in `Elevator` | Direction persists until destinations cleared — SCAN semantics |

---

## 7. Key Implementation Details

### 7.1 SCAN assignment

Prefer elevator moving toward request on same side; else idle nearest; else any moving that will eventually pass.

### 7.2 Step tick

Each elevator: if destinations non-empty, move one floor toward next stop in current direction; flip direction when no more stops ahead.

### 7.3 Concurrent destinations

`ConcurrentSkipListSet` gives ordered floors and safe concurrent add during `step()`.

---

## 8. Likely Follow-Up Q&A

**Q: SCAN vs LOOK?**  
A: SCAN goes to end then reverses; LOOK reverses early if no requests ahead.

**Q: Starvation of far floors?**  
A: SCAN guarantees eventual service; priority queue for express cars is extension.

**Q: Real threading?**  
A: One thread per elevator + request queue; step() models same logic.

**Q: Weight limit?**  
A: Track load count; reject hall assign if over capacity.

**Q: Fire service mode?**  
A: Clear destinations, force ground floor — overrides scheduler.

**Q: Multiple buildings?**  
A: Controller per shaft group; no cross-assign.

**Q: Optimize for energy?**  
A: Custom scheduler weights idle time and direction changes.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| Step simulation | Testable; not wall-clock accurate |
| SCAN | Fair, predictable; not globally optimal wait time |
| Central scheduler | Simple; distributed assign harder at scale |
| Skip list destinations | Ordered O(log n); array bitmap faster for fixed floors |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.elevator.ElevatorDemo"`

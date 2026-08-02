# Feature Flags — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> The interesting bug is a **validation placed one layer too deep**: an invalid
> rollout percentage was accepted at configuration time and then threw on every
> single evaluation afterwards — turning an operator typo into a hot-path outage
> (§7.1).

---

## 1. Clarifying Questions (first 5 minutes)

1. **What decides a flag: on/off, targeting, or gradual rollout?** All three,
   composed — and the order matters. Here it's kill-switch → targeting → percentage.
2. **Must a user get a stable answer?** Yes, absolutely. A flag that flips between
   requests for the same user is worse than one that's off — the UI flickers and
   A/B metrics become meaningless. That rules out `Random` and mandates hashing.
3. **How hot is evaluation?** Flags are checked on essentially every request, so
   evaluation must be allocation-free and lock-free. Configuration changes are rare.
   That read/write asymmetry drives the whole concurrency design.
4. **What happens on an unknown flag?** Two different answers for two paths: the
   *read* path should fail safe (return off), the *configuration* path should fail
   loudly (§7.2).
5. **Percentage rollout across multiple flags** — should a user in the first 10% of
   flag A also be in the first 10% of flag B? No: bucket on `featureId + userId`, or
   the same unlucky cohort gets every experiment.
6. **Audit trail?** Who turned what on, when — real systems need it. Out of scope
   here, and I removed a stub class that pretended to provide it.

---

## 2. Functional Requirements

- Create a feature; enable/disable it (kill switch).
- Attach targeting rules (group, email domain, extensible).
- Set a percentage rollout, 0–100.
- `isFeatureEnabled(featureId, user)` — composing all of the above.
- List all features.

## 3. Non-Functional Requirements

- **Deterministic per user**: same `(feature, user)` always yields the same answer.
- **Uniform bucketing**: a 50% rollout reaches ~50% of users.
- **0% means nobody; 100% means everybody** — no off-by-one at the boundaries.
- **Allocation-free, lock-free evaluation** — it runs on every request.
- Safe for concurrent reads while an operator flips a flag.
- Invalid configuration rejected **when configured**, not when evaluated.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `Feature` | model | `id`, `name`, `volatile enabled`, `volatile rolloutPercentage`, `CopyOnWriteArrayList<TargetingRule>`. Validates the percentage on set. |
| `User` | model | `id`, `email`, `group` — the evaluation context. |
| `TargetingRule` | targeting (interface) | `boolean matches(User)`. One method, so rules compose and test trivially. |
| `GroupTargetingRule` / `EmailDomainTargetingRule` | targeting | Concrete predicates. |
| `EvaluationStrategy` | service (interface) | `boolean evaluate(Feature, User)`. |
| `PercentageRolloutStrategy` | service/impl | Stable bucketing via `floorMod(hash(featureId + ":" + userId), 100)`. |
| `TargetingEvaluationStrategy` | service/impl | Targeting gate in front of a rollout strategy. |
| `FeatureFlagService` / `FeatureFlagServiceImpl` | service | Registry + the evaluation order. |
| `FeatureFlags` | root | Facade. |

**Deleted as dead code:** `FeatureToggle`, `RolloutStrategy`, `AuditLog` — three
classes with zero references anywhere in the repository.

---

## 5. Relationships

- `FeatureFlagServiceImpl` **owns** a `ConcurrentHashMap<String, Feature>`.
- A `Feature` **has** many `TargetingRule`s and one rollout percentage.
- Evaluation composes three independent gates in a fixed order:

```
enabled?  ──no──▶ false          (kill switch — always wins)
   │yes
targeting rules present?
   │yes ──▶ any rule matches? ──no──▶ false
   │no                │yes
   └────────────────▶ bucket(featureId, userId) < rolloutPercentage
```

- The **kill switch dominating everything** is the important ordering property: an
  operator disabling a flag must turn it off for everyone instantly, regardless of
  targeting or rollout.

---

## 6. Design Patterns (name + why vs alternatives)

- **Strategy — `TargetingRule`.** New targeting dimensions (country, app version,
  account tier) are new classes, no edits to the evaluator. A single-method
  interface, so rules are lambda-able and independently testable.
- **Strategy — `EvaluationStrategy`.** Lets the whole evaluation policy be swapped.
  Retained, but no longer *instantiated per call* (§7.3).
- **Composite-ish composition — `TargetingEvaluationStrategy`.** Wraps a rollout
  strategy behind a targeting gate, so "targeted **and** in the rollout" needs no
  special-case code.
- **Facade — `FeatureFlags`.**
- **Consistent hashing (the idea, not the ring).** Bucketing on
  `hash(featureId + ":" + userId)` is what makes rollout stable and per-flag
  independent. *Alternative:* `Random` — catastrophic (flapping); *alternative:* a
  stored per-user assignment — durable but needs a database read on every check.
- *(Considered, rejected)* **Observer** for flag-change notifications. Real systems
  push config changes to clients, but with no subscriber in scope it would be an
  empty interface — and this codebase already had three such stubs, now deleted.

---

## 7. Key Implementation Details

### 7.1 Validation one layer too deep (the headline)

`Feature.setRolloutPercentage` stored whatever it was given. The 0–100 check lived
in `PercentageRolloutStrategy`'s constructor — which was built *during evaluation*:

```java
public void setRolloutPercentage(int percentage) { this.rolloutPercentage = percentage; }   // no check
...
new PercentageRolloutStrategy(feature.getRolloutPercentage());   // checks here, per call
```

So an operator typo was accepted in silence and detonated later, on every request:

```
setRolloutPercentage("f1", 150) accepted without complaint
*** isFeatureEnabled THREW: IllegalArgumentException: Percentage must be 0-100
    — every evaluation of this flag now fails, on the hot path ***
```

A feature flag system exists to make changes *safe*; this one converted a
mistyped digit into a total outage for that flag, at request time, far from the
action that caused it.

Validation moved to the setter, where the bad input actually arrives:

```
setRolloutPercentage(150) rejected: Rollout percentage must be 0-100, got 150   OK
```

**The general principle: validate at the boundary where the value enters, not at
the point where it's finally used.** The distance between those two points is the
distance between a clear error and a mystery.

### 7.2 Fail loudly when configuring, fail safe when reading

Every configuration method was an `if (feature != null)` no-op:

```java
public void enableFeature(String featureId) {
    Feature feature = features.get(featureId);
    if (feature != null) { feature.enable(); }      // typo -> nothing happens, no signal
}
```

An operator enabling `new-chekout` gets no error, no log, and no feature. The flag
simply never turns on, and the investigation starts hours later.

These now throw. But `isFeatureEnabled` deliberately does **not**:

```java
// Read path: an unknown flag is OFF rather than an error, so a stale client
// asking about a deleted flag degrades gracefully. That is the opposite of
// the configuration path above, deliberately.
```

Worth articulating as a design position, because the asymmetry looks inconsistent
until you name it: **configuration is a human action that should fail loudly; the
read path is a hot path that should fail safe.** A deleted flag shouldn't take down
every client still asking about it.

### 7.3 `Math.abs(hash) % 100` gives a negative bucket

```java
return Math.abs(key.hashCode()) % 100;    // was
return Math.floorMod(key.hashCode(), 100); // now
```

`Math.abs(Integer.MIN_VALUE)` is **still `Integer.MIN_VALUE`** — two's complement has
no positive counterpart for the most negative int. So for one key in 2³², the bucket
is negative:

```
Math.abs(MIN_VALUE) % 100 = -48, and `bucket < percentage` at 0% is true
floorMod alternative      =  52, `< 0%` is false   OK
```

A negative bucket is `< percentage` for **every** percentage including zero — so
that user has the feature permanently on, even for a flag rolled out to nobody. For
a kill switch, that's the one user you can't turn it off for.

Bucketing quality verified rather than assumed:

| check | result |
|---|---|
| distribution over 100k users | 10.0% per decile — uniform |
| min bucket over 500k users | 0 (never negative) |
| 0% rollout | 0 / 20,000 enabled |
| 100% rollout | 20,000 / 20,000 enabled |
| 50% rollout | 49.8% of 20,000 |
| same user, 1000 calls | identical every time |

### 7.4 Two allocations per flag check

`isFeatureEnabled` constructed a `TargetingEvaluationStrategy` **and** a
`PercentageRolloutStrategy` on every call. Flag checks run on every request of every
service — this is garbage generated at request rate for objects that are pure
functions of data already in hand. Replaced with a plain loop and a static call.

The Strategy *interfaces* remain, which is the point worth making: **keeping a
pattern's seam doesn't require allocating its objects in the hot path.**

### 7.5 Read-mostly concurrency

`Feature` had plain `boolean`/`int` fields and an `ArrayList` while the service
advertised itself as thread-safe — the same shape as the `whatsapp` bug: a
`ConcurrentHashMap` registry holding values that aren't safe. A rule added during a
request could be seen half-published or throw
`ConcurrentModificationException` mid-evaluation.

Fixed to match the actual access pattern: `volatile` scalars, and
`CopyOnWriteArrayList` for the rules. COW is usually the wrong default — but flags
are written by an operator occasionally and read millions of times, which is exactly
the workload it's built for. Readers iterate a stable snapshot with no lock at all.

---

## 8. Likely Follow-ups (with concise answers)

- **Rollout ramp 10% → 50%: do the original 10% keep it?** Yes, and that's a
  property of bucketing rather than an accident — a user's bucket doesn't change, so
  raising the threshold only *adds* users. Ramping down likewise only removes the
  top slice. Worth stating explicitly; it's the main reason this scheme is used.
- **Percentage rollout across variants (A/B/C)?** Same bucket, partitioned into
  ranges rather than a single threshold: 0–33 → A, 34–66 → B, 67–99 → C.
- **Overriding a specific user?** An explicit allow/deny list checked before the
  rollout — necessary for "enable it for this one customer complaining".
- **Distributing config to fleets?** Poll or stream a config snapshot; clients
  evaluate locally. Evaluation must stay local — a network call per flag check is
  not viable. Local evaluation also makes the fail-safe read path essential.
- **Audit trail?** The deleted `AuditLog` stub was the right idea: record
  `(who, flag, old → new, when)` on every configuration call — which is now easy
  because they all funnel through `requireFeature`.
- **Flag lifecycle / cleanup?** Flags are the classic source of permanent tech debt.
  Real systems track creation date and last evaluation, and alarm on flags at 100%
  for months — those should be deleted and the branch removed.
- **Dependencies between flags?** Genuinely hard. A DAG with cycle detection at
  configuration time; most systems deliberately refuse to support it.
- **How would you test it?** The harness used here: 0% enables nobody, 100% enables
  everybody, 50% lands near 50%, the same user never flaps across 1000 calls, and a
  non-matching targeting group is excluded even at 100% rollout.

---

## 9. Trade-offs

- **Hash bucketing vs stored assignment:** zero storage, zero lookup, and stable by
  construction — but you cannot *choose* who's in the first 10%, and rebalancing
  isn't possible without changing the key. A stored assignment gives control at the
  cost of a read per check.
- **`CopyOnWriteArrayList` for rules:** lock-free reads on the hot path, at O(n) copy
  per rule addition. Correct here precisely because writes are rare — and the wrong
  choice for something like a chat message list.
- **`volatile` scalars over a lock:** cheapest possible correctness for independent
  flags. It does mean enabling a feature and setting its rollout aren't *atomic
  together* — a request in between sees the flag on at the old percentage. Acceptable
  for flags; would not be for money.
- **Kill switch checked first:** an operator can always turn something off instantly,
  at the cost of one extra branch. Never worth optimizing away.
- **Fail-loud config / fail-safe reads:** the asymmetry is deliberate and needs
  documenting, or the next maintainer will "fix" one side to match the other.
- **No audit trail:** removed rather than left as a stub. Named as a real gap in §8
  instead of implied by a class that does nothing.

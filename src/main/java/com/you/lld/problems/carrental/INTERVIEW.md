# Car Rental System — SDE2/SDE3 Interview Walkthrough (70–100 min)

A full mock-interview script: clarifying questions, requirements, entity model,
relationships, pattern choices with rationale, the three implementation details
that matter, follow-ups with answers, and trade-offs. A note at the end explains
why this is **not** a re-skin of Parking Lot or Hotel Booking.

---

## 1. Clarifying questions (2–5 min)

Before designing I'd pin down scope:

- **Booking granularity?** Whole-day or hourly? → *Assume day-granularity windows
  `[pickup, dropoff)`; the model uses `LocalDate` for the window and
  `LocalDateTime` for the actual pick-up/return instants so late fees can be
  time-precise.*
- **One location or many?** → *Multiple branches; each car has a home location and
  customers search by location.*
- **Can a car be dropped at a different branch?** → *Out of scope v1 (one-way
  rentals); I'll mention how to extend.*
- **Do we model payments/auth holds?** → *Charges are computed and returned;
  payment gateway integration is a downstream concern I'll stub via an observer.*
- **Overbooking allowed?** → *No. Hard invariant: at most one active reservation
  per car per instant.*
- **Scale / concurrency?** → *Single-process, in-memory for this exercise, but the
  reserve path must be correct under concurrent requests for the same car.*
- **Pricing rules?** → *Daily rate by car type; discounts for weekly rentals;
  seasonal surge; late fee for overdue returns. These must be swappable.*

## 2. Functional requirements

1. Maintain a fleet of cars, each with a **type** (economy/SUV/luxury), a
   **home location**, and a service **status**.
2. **Search** available cars filtered by type, location and a date range.
3. **Reserve** a specific car for `[pickup, dropoff)`; reject if it overlaps an
   existing active reservation for that car.
4. **Pick up** (start the rental) and **return** (end it), computing charges =
   base pricing **+ late fee** if returned after the scheduled drop-off.
5. **Cancel** a reservation before pickup; this frees the car.
6. Pricing and late-fee policies are **pluggable**.
7. Send **notifications** (confirmation, reminder, receipt) on lifecycle events.

## 3. Non-functional requirements

- **Correctness under concurrency:** two threads must never both reserve the same
  car over overlapping dates. This is the headline NFR.
- **Extensibility:** new pricing / late-fee / notification rules without editing
  the orchestrator (Open–Closed).
- **Low contention:** unrelated cars must not block each other on the reserve path.
- **Deterministic money:** `BigDecimal`, never `double`.

## 4. Core entities (layer + one-line internal summary)

| Entity | Layer | Summary |
|---|---|---|
| `CarType` | model (enum) | ECONOMY / SUV / LUXURY. Carries **no** rate — pricing is a service concern. |
| `CarStatus` | model (enum) | ACTIVE / MAINTENANCE / RETIRED. Note: no `RENTED` — availability is derived. |
| `Car` | model | id, plate, type, home location; only `status` is mutable. |
| `Location` | model (VO) | A pickup branch; identity by id. |
| `Customer` | model (VO) | Renter; identity by id. |
| `DateRange` | model (VO) | Half-open `[pickup, dropoff)`; `overlaps()` + `days()`. |
| `Reservation` | model (aggregate) | Booking of one car by one customer; holds a `ReservationState`; freezes `baseCost`. |
| `ReservationStatus` | model (enum) | Plain tag mirroring the state objects. |
| `ReservationState` (+4) | model | State pattern; encodes legal transitions. |
| `Charges` | model (VO) | Immutable `baseCost` + `lateFee`. |
| `PricingStrategy` | service | `price(type, period)` — base rental cost. |
| `LateFeePolicy` | service | `lateFee(type, due, actual)`. |
| `ReservationObserver` | service | Lifecycle callbacks. |
| `CarRental` | root | Facade: fleet, reservations, per-car locking, strategy wiring. |

## 5. Relationships

- `CarRental` **owns** the fleet (`Map<carId, Car>`), the customer directory, and
  all reservations, indexed both by id (`reservationsById`) and by car
  (`reservationsByCar`).
- A `Reservation` **references** one `Car`, one `Customer`, one `DateRange`, and
  **has-a** `ReservationState` (composition; the state is swapped as the
  reservation transitions).
- `CarRental` **depends on** the `PricingStrategy`, `LateFeePolicy` and a list of
  `ReservationObserver`s via interfaces (dependency inversion).
- The `model` package has **no** dependency on `service`: the state objects
  receive an already-computed `lateFee` rather than importing `LateFeePolicy`,
  keeping the dependency arrow one-directional (`service → model`).

## 6. Patterns — rationale vs alternatives

### Strategy — pricing and late fees (two independent axes)
- **Why:** the base tariff (daily / weekly / seasonal) and the penalty rule
  (flat / grace-period) change for different reasons and at different times.
  Modeling them as two interfaces lets marketing swap either without a code
  change to reservations.
- **Alternative rejected:** a single `computeCharges()` with `if (type==..)` /
  `if (weekly)` branches — violates Open–Closed and mixes two concerns.

### Decorator — seasonal surge and grace period
- **Why:** `SeasonalPricingStrategy` wraps any `PricingStrategy` and multiplies by
  a peak surcharge; `GracePeriodLateFeePolicy` wraps any `LateFeePolicy` and
  forgives small lateness. Composition avoids a `Daily×Weekly×Seasonal` subclass
  matrix.
- **Alternative rejected:** subclassing `DailyPricingStrategy` for the seasonal
  variant — surge wouldn't compose with the weekly tariff.

### State — reservation lifecycle
- **Why:** four phases with a strict transition matrix. Each state class allows
  only its legal verbs and throws `IllegalStateException` otherwise, so "return a
  car that was never picked up" is impossible rather than a status-field bug. The
  states are stateless singletons.
- **Alternative rejected:** a `switch (status)` in every verb on `CarRental` —
  the transition rules would be smeared across the orchestrator and easy to get
  inconsistent.

### Observer — notifications
- **Why:** confirmations/reminders/receipts are cross-cutting; the orchestrator
  shouldn't know about email vs SMS vs analytics. Observers subscribe to just the
  events they care about via default methods.
- **Alternative rejected:** calling an `EmailService` inline — couples core flow
  to a channel and makes adding push notifications an orchestrator edit.

### Facade — `CarRental`
- Single, readable entry point; hides locking and wiring.

## 7. Key implementation details

### 7a. Date-range overlap (the crux)
`DateRange` is **half-open**: pickup inclusive, dropoff exclusive. Two intervals
overlap iff each starts strictly before the other ends:

```java
boolean overlaps(DateRange o) {
    return this.pickup.isBefore(o.dropoff) && o.pickup.isBefore(this.dropoff);
}
```

The half-open choice is deliberate: it makes **back-to-back rentals legal for
free**. `[10,13)` and `[13,15)` don't overlap, so a car returned on the 13th is
bookable from the 13th — no `+1 day` fudging. `days()` is just
`ChronoUnit.DAYS.between(pickup, dropoff)`, always ≥ 1.

### 7b. Check-then-reserve atomicity with a per-car lock
The invariant "no two overlapping active reservations for one car" requires that
the **overlap check and the insert are one atomic step**. A naive
`if (!hasOverlap()) reservations.add(..)` has a classic check-then-act race: two
threads both pass the check, both insert.

Solution: a **`ReentrantLock` per car** (`Map<carId, ReentrantLock>`), held across
check + insert:

```java
lock.lock();
try {
    if (car.status != ACTIVE)      throw new CarUnavailableException(..);
    if (hasOverlap(carId, period)) throw new CarUnavailableException(..);
    reservationsByCar.get(carId).add(new Reservation(..));  // publish under lock
} finally { lock.unlock(); }
```

Why per-car and not one global lock? **Contention isolation** — customers booking
*different* cars proceed in parallel; only threads racing for the *same* car
serialize. Search, pickUp, returnCar and cancel also take the car's lock so
overlap checks always see a consistent snapshot. Registries are
`ConcurrentHashMap`s for lock-free reads and safe publication; the observer
notifications happen **after** the lock is released so a slow listener never
widens the critical section. The concurrency test fires 64 threads at one
car+window and asserts exactly one wins.

### 7c. Late-fee calculation (return time)
Base cost is **frozen at reservation time** (`reservation.baseCost`) so a
mid-rental tariff change can't alter an existing quote. The late fee is computed
only at return:

```java
long minutesLate = Duration.between(scheduledDropoff, actualReturn).toMinutes();
long lateDays = (minutesLate + 1439) / 1440;           // ceil: any part-day = full day
fee = dailyRate(type).multiply(penaltyMultiplier).multiply(valueOf(lateDays));
```

`scheduledDropoff = dropoff.atStartOfDay()` (the exclusive end day). The
`GracePeriodLateFeePolicy` decorator returns 0 within N hours of the due time and
otherwise delegates — measuring from the original due time, so grace forgives
lateness without shifting the meter. The `PickedUpState` assembles
`new Charges(baseCost, lateFee)` and records it on the reservation.

## 8. Follow-up questions & answers

- **Q: One-way rentals (drop at a different branch)?**
  A: Add a `dropoffLocation` to the reservation and a relocation fee to the
  pricing strategy; the car's home location updates on return. Availability search
  would need to consider in-transit cars.
- **Q: How do you persist this / survive restarts?**
  A: Replace the in-memory maps with a repository interface; move the per-car
  lock into the DB as `SELECT ... FOR UPDATE` on the car row, or an
  `EXCLUDE`/exclusion constraint on `(car_id, tsrange)` in Postgres so the DB
  itself enforces non-overlap. The domain logic is unchanged.
- **Q: Horizontal scale — multiple app servers?**
  A: In-process locks no longer suffice. Use the DB exclusion constraint (single
  source of truth) or a distributed lock (Redis/ZooKeeper) keyed by car id. Prefer
  the DB constraint — it's correct even if the lock service fails.
- **Q: Prevent a customer holding infinite reservations?**
  A: A `ReservationPolicy` strategy checked in `reserve()` (max active per
  customer, blocklist, deposit).
- **Q: No-shows / auto-cancel?**
  A: A scheduled sweeper transitions stale `RESERVED` past a grace window to
  `CANCELLED` — the State pattern already permits `RESERVED → CANCELLED`.
- **Q: Search performance with a huge fleet?**
  A: Current search is O(cars). Index cars by `(type, location)` and keep a
  per-car sorted interval list (or an interval tree) so the overlap probe is
  O(log n) instead of scanning all reservations.
- **Q: Waitlist when nothing is available?**
  A: New observer + a `RESERVED`-on-cancellation hook that offers the freed car to
  the next waitlisted customer.

## 9. Trade-offs (stated deliberately)

- **In-memory + per-car lock** is simple and correct single-process, but not
  multi-node; I'd move the invariant into the DB for real scale (see follow-ups).
- **Linear search over reservations** is fine for interview scale and trivially
  correct; an interval tree is the optimization when the fleet/booking volume
  grows.
- **Availability derived, not cached** avoids a whole class of stale-flag bugs
  (double-book because a `RENTED` boolean wasn't reset) at the cost of computing
  overlaps on each query — acceptable, and cacheable later.
- **Base cost frozen at reserve, late fee at return** matches customer
  expectations (quoted price is honored) but means a separate policy object owns
  the return-time math.
- **State objects in the `model` package:** they carry transition logic (mildly
  beyond "self-validation"), but co-locating them with `Reservation` keeps the
  lifecycle mutators package-private and the state machine encapsulated — a better
  trade than leaking public setters to a separate package.

## 10. How this differs from Parking Lot and Hotel Booking

It **borrows** two familiar sub-problems but the combination and the distinctive
mechanics are new:

- **vs Parking Lot:** parking is *spot allocation for an open-ended present-tense
  stay* — you drive in now, availability is a boolean "is this spot occupied
  right now", and pricing is duration-after-the-fact. Car rental is
  *future-dated, time-boxed booking*: you reserve a window that may start days
  from now, so availability is an **interval-overlap** question, not a boolean,
  and multiple non-overlapping reservations coexist on one car.
- **vs Hotel Booking:** hotel rooms are *fungible within a room type* — you book
  "a deluxe room", and the system hands you any free one. Car rental here reserves
  a **specific identified car** (by plate) at a **specific branch**, so the lock
  granularity is per-car and multi-location inventory matters.
- **What's genuinely this problem's own:** the **pick-up → return lifecycle**
  (a rental isn't done at booking; it's collected then returned) and the
  **return-time late-fee** computed from scheduled-vs-actual timestamps. Neither
  parking (no reservation lifecycle) nor a basic hotel booking (charge fixed at
  booking) has a two-phase collect/return flow with penalty math at the end. That
  lifecycle is exactly why the **State pattern** earns its place here, and the
  future-dated windows are why the **per-car interval lock** is the core
  concurrency story rather than a simple counting semaphore.
```

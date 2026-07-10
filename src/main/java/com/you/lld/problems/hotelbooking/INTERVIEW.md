# Hotel Management / Booking — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a hotel booking system. Hotels have rooms grouped by type. Users search for available rooms over a **date range**, reserve one (rejecting overlaps), check in, check out, cancel; pricing varies by season/occupancy; the total for a stay is computed. Two threads must never double-book the same room over overlapping dates.

> **How this differs from a movie/seat-booking system (BookMyShow):** a movie booking reserves a **discrete seat** on a **single fixed show instant** — availability is a boolean per (show, seat), and concurrency is a per-seat lock with a short TTL hold before payment. A hotel booking reserves a **room across a continuous `[checkIn, checkOut)` interval**, so availability is not a flag but the result of an **interval-overlap check against every existing reservation for that room**. There is no seat map and no show; the distinguishing complexity is (1) date-range overlap arithmetic with an exclusive check-out boundary enabling back-to-back stays, (2) a real **occupancy lifecycle** (check-in / check-out) that a movie ticket does not have, and (3) pricing that varies **per night** across a season boundary rather than a single per-seat price. The locking granularity is also different: per-room (not per-seat), and the critical section is a *range* conflict test, not a set-membership test.

---

## 1. Clarifying Questions

- **Booking unit?** A room over a date range, or a specific seat/instant? → Room over `[checkIn, checkOut)`.
- **Is check-out day billable / blocking?** → No; half-open interval, so checkout day is free for the next guest (back-to-back stays).
- **One hotel or many?** → Catalog of hotels, each with rooms grouped by `RoomType`.
- **Search by?** → Hotel + room type + date range + minimum capacity.
- **Overbooking allowed?** → No; strict — a room can hold at most one blocking reservation per overlapping range.
- **Pricing?** → Pluggable: flat, seasonal (per-night), dynamic by occupancy.
- **Concurrency scale?** → In-memory single process for the exercise; must be correct under many threads; note the distributed extension.
- **Payments?** → Out of scope here; reservation is confirmed synchronously (would slot in before `RESERVED`).
- **Cancellation policy / no-show billing?** → Model the *states*; charging rules are a follow-up.

---

## 2. Functional Requirements

1. Register hotels and their rooms (grouped by `RoomType`, each type has capacity + base rate).
2. **Search** available rooms for `[checkIn, checkOut)` by type and minimum capacity.
3. **Reserve** a specific room (or any room of a type) for a date range; reject if it overlaps an existing reservation for that room.
4. **Check in**, **check out** a reservation.
5. **Cancel** a reservation (frees its dates) and record **no-show**.
6. Compute the **total price** of a stay via a pricing strategy (flat / seasonal / occupancy).
7. Emit **notifications** on lifecycle events (confirmation, cancellation, ...).

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Concurrency safety** | No double-booking of a room over overlapping dates, ever. |
| **Throughput** | Bookings for *different* rooms proceed in parallel (per-room locking). |
| **Extensibility** | Add pricing policies / notification channels without editing core logic. |
| **Correctness of money** | `BigDecimal` with `HALF_UP` scale-2 rounding. |
| **No lock held over I/O** | Notifications fire after the lock is released. |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal summary |
|-------|-------|---------|------------------|
| `DateRange` | model (VO) | Half-open interval | `overlaps()`, `nights()`, `contains()`; validates `in < out`. |
| `RoomType` | model (enum) | Category | `capacity`, `baseRate` (BigDecimal). |
| `Room` | model | Bookable room | id, hotelId, type; immutable; no state. |
| `Hotel` | model | Hotel + rooms | `roomsOfType(type)`; immutable room set. |
| `Guest` | model | Customer | id, name, email. |
| `Reservation` | model | Booking | room + guest + `DateRange` + total + current `ReservationState`; `blocksAvailability()`. |
| `ReservationStatus` | model (enum) | Status label | RESERVED/CHECKED_IN/CHECKED_OUT/CANCELLED/NO_SHOW. |
| `ReservationState` (+5 impls) | model | State pattern | Each state permits/forbids checkIn/checkOut/cancel/markNoShow. |
| `PricingStrategy` (+3 impls) | service | Strategy | `totalFor(room, stay, occupancyRatio)`. |
| `BookingObserver` (+1 impl) | service | Observer | lifecycle callbacks; `default` no-ops. |
| `HotelBooking` | root | Facade/orchestrator | maps, per-room `ReentrantLock`s, atomic reserve, lifecycle. |

## 5. Relationships

- `Hotel` **contains** many `Room`; each `Room` **has a** `RoomType`.
- `Reservation` **references** one `Room`, one `Guest`, one `DateRange`, and **holds** a `ReservationState`.
- `HotelBooking` **owns** the reservation index (`roomId → reservations`), the per-room locks, one `PricingStrategy`, and a list of `BookingObserver`s.
- Availability of a room for a range is **derived**: no reservation with `blocksAvailability()` overlaps the range.

---

## 6. Design Patterns (with rationale vs alternatives)

| Pattern | Rationale | Alternative rejected |
|---------|-----------|----------------------|
| **Strategy** (pricing) | Flat/seasonal/occupancy differ only in the total calc; runtime-swappable and independently testable. | `if (season) … else …` in the service — violates OCP, untestable in isolation. |
| **State** (lifecycle) | Transition rules per status live in one class each; illegal transitions throw uniformly. | `switch (status)` in `Reservation` — every new status touches every method; easy to miss a case. |
| **Observer** (notifications) | Side effects decoupled; add SMS/audit by subscribing. | Calling a mailer inside `reserve()` — couples core logic to I/O, hard to test, holds locks longer. |
| **Value Object** (`DateRange`) | Overlap/nights arithmetic owned by an immutable, equatable type. | Passing raw `LocalDate` pairs everywhere — duplicated, error-prone boundary logic. |
| **Facade** (`HotelBooking`) | One coherent API over catalog + reservations + concurrency. | Exposing repositories/locks to callers — leaks the concurrency contract. |

---

## 7. Key Implementation Details

### 7.1 Date-range overlap (the heart of the problem)

Stays are **half-open** `[checkIn, checkOut)`. Two intervals `[a,b)` and `[c,d)` overlap iff:

```
a < d  AND  c < b
```

Because the check-out boundary is exclusive, adjacency (`b == c`) is **not** overlap — so a guest departing on the 13th and another arriving on the 13th can share the room (the "back-to-back" test). A reservation blocks a room only while its status is `RESERVED` or `CHECKED_IN`; cancel/no-show/checkout flip `blocksAvailability()` to false, which is how a room's dates are freed **without deleting history**.

### 7.2 Atomic check-then-reserve + per-room lock (the concurrency contract)

Each room has its own `ReentrantLock`. The overlap **scan** and the reservation **insert** happen inside one locked section keyed by room id:

```
lock(room)
  if (any blocking reservation overlaps stay) return null   // caller throws / tries next
  create reservation; add to room's list
unlock(room)
```

Two threads targeting the same room serialize on that lock, so they cannot both pass the "is it free?" check — exactly one wins, the loser sees the just-inserted reservation and is rejected. Two threads targeting *different* rooms never contend. This is verified by a 32-thread race test asserting exactly one winner and 31 rejections.

- **Why per-room, not global?** A single lock would serialize the entire hotel, killing throughput. Per-room is the natural granularity because a conflict is always *within one room*.
- **Why not per-date?** Finer, but a stay spans many dates → multi-lock acquisition with ordering rules and deadlock risk; not worth it for this domain.
- **Lifecycle ops take the same room lock** so a status change (which affects `blocksAvailability()`) is serialized with availability checks.
- **Occupancy sampling is lock-free.** Per-room lists are `CopyOnWriteArrayList`, so the advisory occupancy ratio for dynamic pricing is read without locks — and, importantly, it's sampled *before* the room lock is taken, so there is **no lock-ordering hazard** (never "hold room A's lock, then grab room B's").
- **Notifications fire outside the lock** so a slow channel can't stall bookings.

### 7.3 Seasonal pricing across a boundary

`SeasonalPricingStrategy` prices **per night** (`baseRate * monthMultiplier`, summed) rather than once for the whole stay, because a stay can straddle a season boundary (Nov 30 → Dec 1). Peak (Jun–Aug, Dec) ×1.5, shoulder (Mar–May, Sep) ×1.2, else ×1.0. Test: SUITE base 350, Nov 29–Dec 3 = `350+350+350·1.5+350·1.5 = 1750.00`.

---

## 8. Likely Follow-Up Q&A

**Q: How would this work across multiple app instances?**
A: Replace the in-process `ReentrantLock` with a distributed lock keyed by room id (Redis `SET NX PX`), or push correctness into the DB: a table `reservation(room_id, checkin, checkout, status)` with either a `tstzrange` **exclusion constraint** (Postgres `EXCLUDE USING gist (room_id WITH =, daterange WITH &&)`) or a serializable transaction doing the overlap `SELECT … FOR UPDATE` before insert. The exclusion constraint makes the DB itself reject overlaps — the strongest guarantee.

**Q: Hold-before-payment (like a cart)?**
A: Add a `HELD` state with a TTL (as BookMyShow does for seats); a sweeper expires stale holds back to available. Here the hold is over the *range*, not a seat.

**Q: Overbooking on purpose (airlines/hotels do this)?**
A: Allow N concurrent blocking reservations per room-type bucket up to `capacity + overbookMargin`; the overlap check becomes a *count* against a threshold rather than a boolean.

**Q: Group booking (M rooms atomically)?**
A: All-or-nothing across M rooms → acquire the M room locks **in a consistent global order** (sorted by room id) to avoid deadlock, check all, reserve all, else roll back.

**Q: Search performance with many reservations?**
A: Per-room interval tree / segment index keyed by date, or a per-room sorted list with binary search on check-in; for scale, a calendar/bitmap per room per day. In-memory linear scan is fine for the exercise.

**Q: No-show billing?**
A: `NO_SHOW` is a distinct terminal state precisely so billing/analytics can charge it differently from a clean `CANCELLED`.

**Q: Idempotent reserve?**
A: Client-supplied idempotency key → dedupe map returns the same `Reservation` on retry.

**Q: Time zones / DST?**
A: Use `LocalDate` for the hotel's local calendar (a "night" is a calendar date, not an instant), which sidesteps DST entirely; store the hotel's zone for display.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| In-memory per-room `ReentrantLock` | Simple, correct, high concurrency in one process; needs distributed lock / DB constraint for multi-instance. |
| Linear overlap scan per room | Trivial and correct; O(reservations/room) — swap for interval tree at scale. |
| Half-open `[in, out)` | Clean adjacency semantics (back-to-back); everyone on the team must agree checkout is exclusive. |
| Keep cancelled records (soft free via `blocksAvailability()`) | Preserves history/audit; list grows — prune or archive old reservations. |
| Occupancy sampled lock-free (advisory) | No deadlock, cheap; the ratio can be marginally stale — acceptable for pricing, not for the availability decision (which *is* locked). |
| Strategy pricing | Flexible A/B of policies; needs guardrails against pathological multipliers (negative/absurd totals). |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.hotelbooking.HotelBookingDemo"`

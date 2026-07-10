# Airline / Flight Seat Booking — SDE2/SDE3 Interview Walkthrough

**Problem:** Design the seat-booking core of an airline: search flights by route and date, view the aircraft's seat map (seats grouped by cabin class), hold a specific seat for a limited time, confirm the hold into a ticket with a PNR, and cancel bookings — with strong guarantees that two passengers can never book the same seat.

> **How this differs from movie-ticket booking (BookMyShow).** They *look* similar (both hold-then-confirm a seat under contention), but the interesting modelling is different and I lean into that here:
> - **Seat MAP with classes**, not a flat seat grid. Seats are laid out `rows × columns` and grouped into cabins (ECONOMY/BUSINESS/FIRST) with per-class pricing. A movie screen is one homogeneous grid; an aircraft is heterogeneous cabins with very different fares.
> - **PNR issuance.** A booking produces a stable record locator (PNR) at hold time that survives through confirmation — a first-class domain concept. BookMyShow just has a booking id.
> - **Hold-with-TTL is the headline requirement**, and I make its semantics precise: the hold is *both* eagerly swept and *lazily* self-healing (a new booker can CAS over an expired hold before the sweeper runs). BookMyShow treats the lock timeout as a secondary detail.
> - **Single seat per booking + auto-assign strategy** (window vs front-to-back) — airlines commonly auto-assign a seat in a fare class. BookMyShow is all-or-nothing multi-seat selection.
> - **Concurrency angle:** here I use **lock-free per-seat CAS** on an `AtomicReference` rather than a lock-manager registry, which is a cleaner story for "exactly one winner" and needs no lock bookkeeping.

---

## 1. Clarifying Questions

1. **Booking granularity?** One seat per booking, or a party of N? → I'll model one seat per booking (a PNR references one seat); a party is N bookings or an easy extension to a seat list.
2. **Do we assign a specific seat or just a class?** → Both: `holdSeat(flight, "12A")` for manual selection and `holdAnySeat(flight, ECONOMY)` for auto-assign.
3. **What's the hold TTL for?** → Payment window. A held seat is reserved for a few minutes; if the passenger doesn't confirm, it frees automatically.
4. **What must never happen?** → Two confirmed bookings on the same seat. This is the hard invariant.
5. **Multi-leg / connections?** → Out of scope; single-leg flights. (Extension: a Journey = list of Flights, book atomically.)
6. **Overbooking?** → Not in v1 (airlines do overbook, but I'll treat capacity as hard and mention overbooking as a follow-up).
7. **Payments?** → Abstracted: "confirm" is the post-payment step. I won't build a payment gateway; I'll leave a seam.
8. **Scale / distribution?** → Design the in-memory single-node core cleanly; discuss the distributed version (Redis/DB) as a follow-up.
9. **Notifications?** → Email/SMS on confirm/cancel, pluggable.
10. **Cancellations & refunds?** → Cancel frees the seat and is terminal; refund logic is out of scope.

---

## 2. Functional Requirements

1. **Register flights** — origin, destination, departure/arrival times, operated by an aircraft with a seat map.
2. **Search** — flights by (origin, destination, date).
3. **View seat map** — available seats per cabin class.
4. **Hold a seat** — a specific seat, or any seat in a class, reserved with a TTL; issues a PNR.
5. **Confirm** — turn a valid hold into a ticketed booking.
6. **Cancel** — release a held/confirmed seat; terminal.
7. **Expire** — holds that exceed their TTL free their seat automatically.
8. **Price** — per-class fare via a pricing strategy.
9. **Notify** — confirmation/cancellation to the passenger.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Correctness** | No double booking — the single hard invariant. |
| **Concurrency** | Lock-free per-seat reservation; holds on different seats never contend. |
| **Liveness** | Stale holds must not permanently block a seat (TTL + sweep + lazy takeover). |
| **Extensibility** | Pricing, allocation, notification channels all pluggable without touching the orchestrator. |
| **Testability** | Expiry must be drivable deterministically (manual sweep) as well as by a background thread. |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal summary |
|-------|-------|---------|------------------|
| `Airport` | model | Route endpoint | Immutable; IATA code is identity. |
| `SeatClass` | model | Cabin class enum | ECONOMY/BUSINESS/FIRST + fare multiplier. |
| `Seat` | model | Physical position | Immutable `row+column` → number (e.g. `12A`) + class; **no** availability state. |
| `Aircraft` | model | Seat map | Immutable seat list built by `Builder` cabin-by-cabin. |
| `Flight` | model | Scheduled service | Immutable; origin/dest/times + aircraft; stateless re: availability. |
| `Passenger` | model | Traveller | Immutable; id is identity. |
| `Booking` | model | Reservation record | **State context**; holds PNR, seat, fare, hold expiry, current `BookingState`. |
| `BookingStatus` | model | Lifecycle enum | HELD/CONFIRMED/CANCELLED/EXPIRED. |
| `BookingState` (+4 impls) | model | Transition rules | State pattern; one class per state. |
| `FlightSearchService` | service | Read side | register + search + lookup. |
| `FarePricingStrategy` | service | Pricing | `price(flight, class)`. |
| `SeatAllocationStrategy` | service | Auto-assign | `pick(candidates)`. |
| `BookingObserver` | service | Notification | `onConfirmed/onCancelled`. |
| `SeatInventory` | service/impl | **Concurrency core** | Per-seat `AtomicReference<Occupancy>`; CAS hold/confirm/release + TTL sweep. |
| `AirlineBooking` | root | Facade/orchestrator | Wires everything; owns registries, sweeper, PNR generation. |

---

## 5. Relationships

- `Flight` **operated by** one `Aircraft` **which owns** a seat map (`List<Seat>` grouped by `SeatClass`).
- `AirlineBooking` **owns one** `SeatInventory` **per flight** (keyed by flight number).
- `Booking` **references** a `Flight`, a `Seat`, a `Passenger`, and **delegates lifecycle to** a `BookingState`.
- `SeatInventory` **maps** `seatNumber → AtomicReference<Occupancy>`; `Occupancy` records status + owner PNR + hold expiry.
- `AirlineBooking` (subject) **notifies** registered `BookingObserver`s and **uses** the two strategies.

---

## 6. Design Patterns & Rationale (vs alternatives)

### State — booking lifecycle
`Booking` is the context; `HeldState/ConfirmedState/CancelledState/ExpiredState` encode legal transitions.
- **Why:** transition legality is asked in four places (confirm/cancel/expire from each state). One class per state keeps the table cohesive and makes illegal transitions throw at the source.
- **Alternative:** a `switch (status)` in the service — works, but the rules smear across methods and every new status touches every switch. Rejected.

### Strategy — pricing & allocation
`FarePricingStrategy` (class-based flat vs `DynamicPricingStrategy` demand surge) and `SeatAllocationStrategy` (front-to-back vs window-preferred).
- **Why:** pricing and seat-preference policies change independently and often; the orchestrator shouldn't know which is active.
- **Alternative:** flags/if-else in the service — violates OCP; rejected.

### Observer — notifications
`AirlineBooking` is the subject; email/SMS observers subscribe.
- **Why:** adding a channel (push, WhatsApp) shouldn't modify booking logic; fan-out with per-observer failure isolation.
- **Alternative:** direct calls to a notifier — couples the orchestrator to channels. Rejected.

### Builder — aircraft seat map
`Aircraft.builder("A320").addCabin(FIRST,1,4).addCabin(BUSINESS,2,6)...`
- **Why:** a seat map is tedious to hand-construct; the builder numbers rows continuously and enforces column ≤ 26.

### Lock-free CAS (concurrency idiom) — `SeatInventory`
Per-seat `AtomicReference<Occupancy>`; reserve via `compareAndSet`.
- **Why:** the only thing that must be race-free is a single seat's status transition. Per-seat CAS gives "exactly one winner" with no lock, no lock registry to clean up, and no cross-seat contention.
- **Alternative:** a `SeatLockManager` with a `ConcurrentHashMap<seat, lock>` (the BookMyShow approach) — correct, but you carry lock-lifecycle bookkeeping and a coarser mental model. A single global lock — trivially correct but kills concurrency. Rejected in favour of CAS.

---

## 7. Key Implementation Details

### 7.1 Per-seat compare-and-set (the double-booking guard)

Each seat maps to an `AtomicReference<Occupancy>`, where `Occupancy` is an **immutable** snapshot `{status, ownerPnr, holdExpiry}`. Reserving:

```
loop:
  current = ref.get()
  eligible = current.status == AVAILABLE || current.isExpiredHold(now)
  if !eligible: return false                 // BOOKED or someone's live hold
  next = Occupancy.held(pnr, expiry)
  if ref.compareAndSet(current, next): return true   // we won
  // else another thread changed it — re-read and re-check
```

Because `compareAndSet` is atomic and `Occupancy` is never mutated in place, when N threads race the same seat exactly one CAS succeeds; losers observe the changed reference and either back off (seat now taken) or retry (still eligible but the ref moved). Confirm (`HELD→BOOKED`, owner-checked) and release (`HELD/BOOKED→AVAILABLE`, owner-checked) use the same idiom. **Different seats use different references, so they never contend** — throughput scales with seats, not with a single lock.

### 7.2 Hold TTL — eager sweep + lazy takeover

Every hold stores an `expiry` instant. Two mechanisms free a stale hold:
- **Eager:** a daemon `ScheduledExecutorService` calls `sweepExpiredHolds()`, which CASes every expired hold back to AVAILABLE and moves its `Booking` to `EXPIRED` (via State). This guarantees the booking status becomes EXPIRED even if nobody re-requests the seat.
- **Lazy:** `tryHold` treats an expired hold as eligible and CASes straight over it. So a new booker is never blocked by a stale hold even in the window before the next sweep.

The two are consistent: whoever wins the CAS owns the seat; a sweep that loses the CAS simply doesn't free that slot. For **deterministic tests**, the sweeper is optional — the no-arg constructor omits the background thread and tests call `sweepExpiredHolds()` explicitly after advancing wall-clock via a short `Thread.sleep`.

### 7.3 Confirm vs. sweeper race

`confirm(pnr)` does the seat CAS `HELD→BOOKED` **first**; only on success does it advance the booking state and notify. If the CAS fails (hold already expired/released), it reflects EXPIRED on the booking and throws `SeatUnavailableException`. Ordering matters: a booking is registered in the `bookings` map *before* its `tryHold`, so a concurrent sweep can always find the booking it's expiring. Booking state transitions are `synchronized`, but the **authoritative winner is the seat CAS** — state is only ever advanced by the thread that won it, so confirm and sweep can't both "succeed" on the same seat.

---

## 8. Likely Follow-Ups & Answers

**Q: Make it distributed / multi-node.**
A: Replace the in-process `AtomicReference` with an atomic store per seat: Redis `SET seat:{flight}:{seat} {pnr} NX PX {ttl}` gives CAS-hold + TTL in one op (Redis auto-expires the hold — no sweeper needed). Confirmation writes a DB row with a `UNIQUE(flight_id, seat_number) WHERE status='BOOKED'` constraint as the ultimate double-booking backstop.

**Q: Overbooking.**
A: Allow holds/bookings up to `capacity × factor` per class using a per-class atomic counter instead of per-seat status for the *count*, while still assigning concrete seats at check-in. Add a bump/reaccommodation policy.

**Q: Party of N seats atomically.**
A: Extend `holdSeat` to a seat list; acquire all-or-nothing by CAS-ing them in a canonical (sorted) order and rolling back released seats on any failure to avoid deadlock and partial holds.

**Q: Waitlist on a sold-out class.**
A: A queue per (flight, class); on cancel/expire, an Observer pops the next waiter and offers the freed seat with a fresh TTL.

**Q: Seat map with blocked/maintenance seats.**
A: Add an `Occupancy` status `BLOCKED` that `tryHold` treats as ineligible; admin sets it directly.

**Q: Idempotent confirm/hold.**
A: Confirm is already idempotent for an already-CONFIRMED PNR. For hold, accept a client idempotency key and return the existing booking on retry.

**Q: Dynamic pricing on occupancy.**
A: `DynamicPricingStrategy` already surges on time-to-departure; an occupancy variant injects an occupancy provider (`SeatInventory.availableSeats`) and raises price as a class fills.

**Q: Why not just synchronize the whole booking method?**
A: A global lock serialises *all* seats on a flight — a full A380 would bottleneck on one monitor. Per-seat CAS keeps unrelated bookings fully parallel.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| **Per-seat CAS (lock-free)** | Max concurrency, no lock bookkeeping; but the retry loop and "immutable snapshot" discipline are subtle to get right. |
| **PNR issued at hold time** | Matches real reservations and gives a stable handle; means "HELD" bookings exist that may never be paid for (cleaned by expiry). |
| **Eager sweep + lazy takeover** | Robust liveness and testability; slight redundancy (two paths free a hold) — reconciled by CAS. |
| **One seat per booking** | Simple, clean state machine; multi-seat parties need the all-or-nothing extension. |
| **In-memory single node** | Clear core to reason about; production needs Redis/DB for durability + distribution (Section 8). |
| **State pattern for 4 states** | Cohesive, self-validating transitions; a bit of class overhead vs an enum+switch for such a small machine. |

---

## 10. Demo & Tests

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.airlinebooking.AirlineBookingDemo"
mvn -q test -Dtest=AirlineBookingTest
```

The demo proves: search + per-class fares, hold→confirm→PNR with notifications, double-hold rejection (CAS), TTL expiry freeing a seat, and a 20-thread race yielding exactly one winner. Tests add auto-assign distinctness, confirm-after-expiry rejection, cancel-frees-seat + terminal-state enforcement, and a 32-thread race assertion.

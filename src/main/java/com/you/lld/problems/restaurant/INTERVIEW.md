# Restaurant Management — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> The trap is the reservation. "Reserve table T2" sounds like a boolean on the
> table, and modelling it that way collapses the whole problem — §7.1. A
> reservation is a claim on a **time window**, which makes this the same interval
> problem as `meetingscheduler`.

---

## 1. Clarifying Questions (first 5 minutes)

1. **Reservations for a time, or just walk-in seating?** Both — and I'd pin down
   immediately that a reservation is for a **window**, not forever. A booking for
   next Tuesday must not make the table unusable tonight.
2. **How long is a sitting?** Fixed 90 minutes here. Real systems scale it with
   party size; either way you need an *end* time, because without one you can't
   define overlap.
3. **Can two bookings touch?** Half-open `[start, end)` — a table freeing at 20:30
   can be rebooked at 20:30. Confirmed up front, because it's the boundary case
   every interval bug lives in.
4. **Table allocation policy?** Best-fit (smallest table that seats the party) to
   minimize wasted covers. Must be swappable — first-fit, section-balancing, and
   "keep the 6-tops free for walk-ins" are all real policies.
5. **Order lifecycle?** `PENDING → PREPARING → READY → SERVED → PAID`, cancellable
   early. Illegal jumps must be rejected.
6. **Can a table be seated twice?** No. Worth asking, because the failure is silent.
7. **Split bills, tips, taxes?** Tax yes; split bills a follow-up.

---

## 2. Functional Requirements

- Register tables with capacities.
- **Reserve a table for a time window**, rejecting overlaps and over-capacity parties.
- Cancel a reservation.
- Find a table for a party size (best-fit); list tables free right now.
- Seat a party (create an order) — only at a table that is actually free.
- Add items; move the order through its lifecycle.
- Generate a bill after `SERVED`, mark `PAID`, and release the table.

## 3. Non-Functional Requirements

- **Overlap correctness** — no double-booking, and no false clash at a boundary.
- **A future booking must not block the present.**
- **A table can host at most one active order.**
- **Only legal order transitions.**
- Reservation lookup better than O(n) per table — `O(log n)`.
- Allocation policy swappable without touching the service (OCP).

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `Table` | model | `tableId`, `capacity`, `TableStatus`. Status describes the table **right now**, not its future bookings — that separation is the fix in §7.1. |
| `TableStatus` | model (enum) | `AVAILABLE`, `OCCUPIED`, `RESERVED`. |
| `Reservation` | model | `customerId`, `tableId`, **`startTime` + `endTime`**, `partySize`. Owns `overlaps(start,end)` and `coversInstant(t)` — the single source of overlap truth. |
| `Order` / `OrderStatus` | model | Item list + a **guarded** state machine (`transitionTo` rejects illegal jumps). |
| `MenuItem` | model | Id, name, price. |
| `Bill` | model | Id + amount. |
| `Customer` | model | Diner identity. |
| `TableAllocationStrategy` | service (interface) | `allocate(tables, partySize)`. |
| `BestFitTableAllocation` | service/impl | Smallest available table that fits. |
| `RestaurantService` | service (interface) | The contract. |
| `InMemoryRestaurantService` | service/impl | Tables, reservations (indexed by table and start time), orders, and the seating rules. |
| `Restaurant` | root | Facade. |

---

## 5. Relationships

- `InMemoryRestaurantService` **owns** five indexes:
  `tables`, `reservations` (id → reservation), **`bookings`**
  (`tableId → TreeMap<startTime, Reservation>`), `tableToOrder`, and
  `orderToTable`.
- The **`bookings` TreeMap is the important one**: per table, reservations ordered
  by start time, giving `O(log n)` overlap detection.
- `tableToOrder` and `orderToTable` are **inverses of each other**, both maintained
  — so releasing a table at billing time is O(1) rather than a scan (§7.3).
- `Table.status` and `bookings` answer **different questions**: status is "is
  someone sitting here now", bookings is "is this table promised at time T".
  Conflating them is the original bug.

---

## 6. Design Patterns (name + why vs alternatives)

- **Strategy — `TableAllocationStrategy`.** "Which table for this party" is exactly
  the kind of policy a restaurant changes (best-fit, first-fit, keep large tables
  free, balance across sections/servers). *Alternative:* the selection loop inside
  the service — rejected: untestable in isolation, and every new policy edits the
  orchestrator.
- **Guarded state machine — `Order.transitionTo`.** The transition table lives on
  the entity, so `PENDING → PAID` is impossible regardless of caller. Same call as
  `taskmanagement`: legality only, so a table beats State classes.
- **Interval / ordered-map overlap** — the `TreeMap` floor/ceiling technique
  (§7.2). Not GoF, but the algorithmic pattern the interviewer is looking for, and
  identical to `meetingscheduler`.
- **Per-table monitor** — `synchronized (table)` for the check-then-act around
  reserving and seating. The table is the natural contention unit; different tables
  never block each other.
- **Facade — `Restaurant`.**
- *(Considered, not forced)* **Observer** for kitchen display / server notification
  on `READY`. The natural hook is `updateOrderStatus`, and it's the first thing a
  real system needs.

---

## 7. Key Implementation Details

### 7.1 A reservation was a flag, not a time window (the headline)

The original `makeReservation` required the table to be `AVAILABLE` *now*, and set
it to `RESERVED`:

```java
if (table.getStatus() != TableStatus.AVAILABLE) throw new IllegalStateException(...);
...
table.setStatus(TableStatus.RESERVED);
```

`Reservation` stored a single `dateTime` — and, tellingly, exposed **no getter for
it**. The time was written and never read, which is the clearest possible signal
that nothing consulted it. Measured:

```
alice reserved T2 for NEXT WEEK
T2 status right now = RESERVED
available tables now = 0
bob CANNOT reserve for tonight: Table T2 is not available (RESERVED)
*** one future reservation blocks the table for every other time ***
```

One booking a week out took the table out of service permanently — no walk-ins, no
other bookings, and it never recovered.

The fix is to model what a reservation actually is:

```java
public boolean overlaps(LocalDateTime otherStart, LocalDateTime otherEnd) {
    return startTime.isBefore(otherEnd) && otherStart.isBefore(endTime);   // half-open
}
```

and to stop conflating "booked later" with "busy now":

```java
// Deliberately NOT table.setStatus(RESERVED): status describes the table
// RIGHT NOW. A booking for next Tuesday must not make it unusable today.
```

`getAvailableTables()` now means *free at this instant* — status is `AVAILABLE`
**and** no booking covers `now`. Two questions, two mechanisms.

Verified end to end:

| Case | Result |
|---|---|
| Booking next week, table free tonight | free — walk-ins unaffected |
| Second booking tonight | accepted (different window) |
| Booking overlapping alice's 19:00–20:30 | rejected |
| Booking starting exactly at 20:30 | accepted — half-open boundary |
| Party of 5 at a 2-top | rejected on capacity |

### 7.2 O(log n) overlap, not a scan

Reservations for a table are non-overlapping and stored in a
`TreeMap<LocalDateTime, Reservation>` keyed by start. For a candidate `[s, e)` **at
most two** existing bookings can clash:

```java
Map.Entry<LocalDateTime, Reservation> floor = byStart.floorEntry(s);
if (floor != null && floor.getValue().overlaps(s, e)) return floor.getValue();

Map.Entry<LocalDateTime, Reservation> ceiling = byStart.ceilingEntry(s);
if (ceiling != null && ceiling.getValue().overlaps(s, e)) return ceiling.getValue();
return null;
```

- `floorEntry(s)` — the booking with the greatest start `≤ s`; it clashes only if it
  runs past `s`.
- `ceilingEntry(s)` — the least start `≥ s`; it clashes only if it begins before `e`.

Everything else is provably clear, because the stored intervals don't overlap each
other. Both navigations are `O(log n)`. This is the "My Calendar I" insight and it's
worth naming — a linear scan over a table's bookings is the answer that gets you a
follow-up question.

The half-open comparison (`isBefore`, not `!isAfter`) is what makes back-to-back
sittings legal, and it's the single most common place to get an interval check
subtly wrong.

### 7.3 Double-seating, and the orphaned order

`createOrder` set the table to `OCCUPIED` without checking whether it already was:

```
party 1 seated at T1, order ORD-1 (steak)
party 2 ALSO seated at T1, order ORD-2
```

`tableToOrder.put(tableId, orderId)` then **overwrote** the first mapping. Billing
looked the table up by scanning `tableToOrder` for the order id — so `ORD-1` matched
nothing, and its table was never released. A silently orphaned order and a leaked
table, from one missing `if`.

Two changes:

```java
if (table.getStatus() == TableStatus.OCCUPIED) {
    throw new IllegalStateException("Table " + tableId + " is already occupied by order "
            + tableToOrder.get(tableId));
}
```

and an explicit inverse index so the release is O(1) and can't miss:

```java
String tableId = orderToTable.remove(orderId);   // was: scan every entry of tableToOrder
if (tableId != null) { tableToOrder.remove(tableId); ... table.setStatus(AVAILABLE); }
```

The general shape: **when you find yourself scanning a map to reverse a lookup, the
inverse index is missing** — and the scan is usually hiding a correctness bug, not
just a performance one.

### 7.4 The order state machine

`Order.transitionTo` already enforced `PENDING → PREPARING → READY → SERVED → PAID`
with `CANCELLED` available early, and `generateBill` refuses before `SERVED`. That's
the part of this codebase that was already right, and it's worth pointing at in
contrast to §7.1: the *order* lifecycle was modelled properly while the
*reservation* lifecycle wasn't modelled at all.

---

## 8. Likely Follow-ups (with concise answers)

- **Variable sitting length?** `Reservation` already takes an explicit `endTime`
  constructor; the 90-minute default is just a convenience. Scale by party size, or
  let the host set it. No change to the overlap logic — which is the point of
  storing an interval rather than a duration constant.
- **"Find me any table at 8pm on Friday"?** Today's `findTable` only considers
  *now*. Generalize to `findTable(partySize, start, end)`: filter by capacity, then
  reject any table with an overlapping booking — reusing `findOverlap`. Best-fit
  then picks among the survivors.
- **Turning tables / late diners?** The reservation window is an estimate, so a
  table can still be `OCCUPIED` when the next booking starts. Real systems keep a
  buffer between sittings and a waitlist; the buffer is `[start - buffer, end + buffer)`
  in the overlap check, one line.
- **No-shows?** A booking that nobody sits at holds the table. Needs a grace period
  and a sweeper that releases it — the `asynctaskprocessor` machinery again.
- **Money is `double`.** `Bill` and `MenuItem` use `double`, which is the same defect
  fixed in `paymentgateway`: totals won't reconcile to the cent. Should be
  `com.you.lld.common.Money`.
- **Waitlist / walk-in queue?** A priority queue keyed by arrival time and party
  size, drained as tables free — pairs naturally with the allocation Strategy.
- **Split bills?** `Bill` becomes a list of line items with an assignment per diner;
  the order keeps the full list and billing partitions it.
- **Multi-node?** The `synchronized (table)` becomes a row lock or a conditional
  insert with a uniqueness constraint on `(table_id, time_range)` — Postgres
  exclusion constraints do interval overlap natively, which is worth naming.
- **How would you test it?** The §7.1 table, one case per row — especially the
  back-to-back boundary and the "future booking doesn't block now" case. Plus
  concurrent `createOrder` on one table asserting exactly one succeeds.

---

## 9. Trade-offs

- **Interval reservations vs a status flag:** correct, and it costs a `TreeMap` per
  table plus the discipline of keeping `status` and `bookings` answering separate
  questions. The flag was simpler and wrong.
- **Fixed 90-minute sitting:** one constant instead of a duration policy; unrealistic
  for a two-top versus a party of ten, but the model already supports an explicit
  end time so it's a data change, not a design change.
- **`synchronized (table)` per table:** natural contention unit, full parallelism
  across tables; only works because the registry hands back a canonical `Table`
  instance — the moment tables come from a database this must become a row lock.
- **`TreeMap` (not thread-safe) under the table's monitor:** all booking mutations
  for a table go through that monitor, so the map is safe by contract rather than by
  type. A documented invariant, and one worth stating explicitly rather than relying
  on a reader to infer.
- **Two inverse indexes (`tableToOrder` / `orderToTable`):** O(1) both directions, at
  the cost of two structures that must be updated together — mitigated by both writes
  living in exactly one method each.
- **Best-fit allocation:** minimizes wasted seats, but can strand a party of 2 while
  holding a 6-top empty for a walk-in that never comes. Section-balancing is the
  usual real policy — and it's a new Strategy, not a rewrite.
- **`double` money:** inherited, and wrong for the same reason as `paymentgateway`.
  Named in §8 rather than quietly left.

# Inventory Management (multi-warehouse) — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> The answer that scores here is **Reserve–Commit–Release**: stock has *two*
> numbers, not one. Everything else — multi-warehouse, transfers, order
> orchestration — is built on that split.

---

## 1. Clarifying Questions (first 5 minutes)

1. **One warehouse or many?** Many — stock is per **(SKU, warehouse)**, and that
   pair is the unit of both storage and locking. A single global quantity per SKU
   can't answer "can I ship this from the warehouse nearest the customer?"
2. **When is stock actually consumed?** Not at order placement and not at payment —
   at **fulfilment**. Between intent and shipment stock is *reserved*: still
   physically present, no longer available to anyone else. That's the whole design.
3. **What does "available" mean?** `onHand − reserved`. Two numbers, one derived.
   Collapsing them into one is the classic wrong answer.
4. **Can reservations expire?** They should (abandoned checkouts), and I'll flag
   that this implementation has no TTL — an important gap rather than a detail.
5. **Multi-line orders — partial fulfilment?** All-or-nothing. That decision forces
   a compensation path, which is §7.2.
6. **Transfers between warehouses?** Yes, and that means acquiring **two** locks —
   so I need a deadlock story.
7. **Concurrency level?** High. Many orders hitting the same hot SKU is the
   scenario the design must survive.
8. **Audit trail?** Every mutation takes a `reason` string. I'll note honestly that
   nothing currently records it.

---

## 2. Functional Requirements

- `receiveStock(sku, warehouse, qty, reason)` — inbound.
- `reserve(...) → ReservationId` — hold stock without consuming it; fail if
  insufficient **available**.
- `commit(reservationId)` — the goods shipped: reserved and on-hand both drop.
- `release(reservationId)` — the hold is abandoned: reserved drops, on-hand doesn't.
- `adjust(sku, warehouse, delta, reason)` — cycle counts and shrinkage.
- `transfer(sku, from, to, qty)` — move stock between warehouses.
- `getStock` → `StockSnapshot(onHand, reserved, available)`.
- Order orchestration: place → confirm payment (reserve all lines) → deliver
  (commit) / cancel (release).

## 3. Non-Functional Requirements

- **Never oversell**: `reserved ≤ onHand`, always, under any concurrency.
- **Never leak a reservation**: a failed or cancelled order must return its holds.
- **Per-(SKU, warehouse) parallelism** — unrelated SKUs must not contend.
- **No deadlock** on multi-entry operations.
- **No silent overflow** on quantity arithmetic.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `SkuId` / `WarehouseId` / `ReservationId` / `OrderId` / `PaymentId` / `UserId` / `CategoryId` | model (VOs) | Typed ids. With this many id types flying around, `String` everywhere would be an argument-order disaster. |
| `Entry` (private, in the service) | service/impl | `{ long onHand; long reserved; final Object lock; }` — **the lock lives on the data it guards.** That co-location is what makes per-(SKU, warehouse) locking natural rather than bookkeeping. |
| `Key` (private) | service/impl | `(SkuId, WarehouseId)` with `equals`/`hashCode` — the composite map key. |
| `Reservation` (private) | service/impl | `(id, sku, warehouse, quantity)` — enough to reverse the hold without consulting the order. |
| `StockSnapshot` | model | Immutable `(onHand, reserved)` + derived `available()`. Returned by value so a caller can't observe a torn read. |
| `Product` / `ProductStatus` | model | Catalog entry with `Money` unit price. |
| `Order` / `OrderLineItem` / `OrderStatus` | model | Immutable order; each line carries its `ReservationId` **once reserved** — `withReservation` returns a new line. |
| `Payment` / `PaymentStatus` / `PaymentMethod` | model | Payment record. |
| `User` / `Address` | model | Customer and delivery address (with lat/long, used to pick a warehouse). |
| `InventoryService` | service (interface) | The stock contract. |
| `InMemoryInventoryService` | service/impl | Entries, locks, reservations. |
| `OrderService` / `InMemoryOrderService` | service | Orchestration: the saga across inventory + payment. |
| `Inventory` | root | Facade exposing both services. |

---

## 5. Relationships

- `InMemoryOrderService` **depends on** `InventoryService` (constructor-injected) —
  orders drive inventory, never the reverse. That direction keeps inventory
  reusable by any consumer (returns, transfers, manual adjustment).
- `entries` maps **(SKU, warehouse) → Entry**; `reservations` maps
  **ReservationId → Reservation**. The second index exists so `release`/`commit`
  need only the reservation id — the caller doesn't have to remember which
  warehouse it came from.
- An `OrderLineItem` **holds** a `ReservationId` after reservation. This is the
  thread that makes compensation possible, and losing it is exactly the bug in §7.2.
- `Order` is **immutable**: every transition constructs a new `Order` and replaces
  the map entry, so no reader ever sees a half-updated order.

---

## 6. Design Patterns (name + why vs alternatives)

- **Reserve–Commit–Release (two-phase resource allocation).** The central pattern.
  Splitting `onHand` from `reserved` lets stock be *promised* without being
  *consumed*, which is what makes an order pipeline possible at all.
  *Alternative:* decrement on order and increment on cancel — rejected: you can no
  longer distinguish "sold" from "promised", physical counts stop reconciling, and
  a lost cancel silently destroys inventory.
- **Lock striping by domain key.** One monitor per `Entry`, so `(laptop, WH-EAST)`
  and `(phone, WH-EAST)` are fully parallel. *Alternative:* one service-wide lock —
  rejected: a single hot SKU would serialize every warehouse. *Alternative:*
  atomics — rejected: `reserve` compares `onHand − reserved` and then mutates
  `reserved`; that's a two-field invariant, which CAS on one field can't express.
- **Ordered lock acquisition (deadlock avoidance)** in `transfer` — §7.3.
- **Saga with compensation** — `confirmPayment` reserves N lines and must unwind
  on failure (§7.2). Same shape as `amazon`'s checkout and `ministore`'s order saga.
- **Facade — `Inventory`.**
- **Immutable value objects — `StockSnapshot`, `Order`, `Money`.** Snapshot-by-value
  means a reader never holds a reference into live mutable state.

---

## 7. Key Implementation Details

### 7.1 Why the lock lives on the `Entry`

```java
private static final class Entry {
    long onHand;
    long reserved;
    final Object lock = new Object();
}

Entry e = entries.computeIfAbsent(new Key(skuId, warehouseId), k -> new Entry());
synchronized (e.lock) {
    long available = e.onHand - e.reserved;
    if (available < quantity) throw new IllegalArgumentException("Insufficient available");
    e.reserved = Math.addExact(e.reserved, quantity);
    ...
}
```

Three decisions worth defending out loud:

- **The lock is a field of the data it protects.** There's no separate lock map to
  keep in sync with the entry map, and no way to acquire the wrong lock for an
  entry. `computeIfAbsent` guarantees exactly one `Entry` — and therefore exactly
  one monitor — per key, atomically.
- **Locking, not atomics.** `reserve` reads `onHand`, reads `reserved`, compares,
  then writes `reserved`. That is a compound condition over two fields;
  `AtomicLong` would make each field's update atomic and still allow two threads
  to both pass the availability check. (Contrast `amazon`, where stock is a
  *single* field and CAS is strictly better — the right primitive depends on how
  many fields the invariant spans.)
- **`Math.addExact`, not `+`.** A silent `long` overflow on a quantity would turn
  a huge receive into negative stock. Overflow throws instead.

The demo's 10-thread concurrent reservation scenario confirms `reserved` never
exceeds `onHand`.

### 7.2 The reservation leak on a failed multi-line order (the headline)

`confirmPayment` reserves every line, then builds the confirmed order. On failure
it marked the order `FAILED` and rethrew — but **released nothing**:

```java
try {
    List<OrderLineItem> reservedItems = new ArrayList<>();   // <-- scoped INSIDE the try
    for (OrderLineItem item : order.lineItems()) {
        ReservationId id = inventoryService.reserve(...);    // line 1 OK, line 2 throws
        reservedItems.add(item.withReservation(id));
    }
    ...
} catch (IllegalArgumentException e) {
    Order failedOrder = new Order(..., order.lineItems(), ...);   // ORIGINAL items, no reservation ids
    orders.put(orderId, failedOrder);
    throw new IllegalStateException("Insufficient inventory for order: " + e.getMessage());
}
```

Measured — a two-line order where line 1 (10 units) succeeds and line 2 can't be
satisfied:

```
before order  -> plenty={onHand=100, reserved=0,  available=100}
confirmPayment failed as expected: Insufficient inventory for order
after failure -> plenty={onHand=100, reserved=10, available=90}
*** LEAKED: 10 units still reserved for a FAILED order, forever ***
after cancel  -> plenty={onHand=100, reserved=10, available=90}   *** still leaked ***
```

Two compounding mistakes, and the second is the nastier one:

1. **No compensation** — the reserved lines were never released.
2. **The evidence was destroyed.** `reservedItems` was scoped inside the `try`, and
   the `FAILED` order was stored with `order.lineItems()` — the *original*,
   reservation-less lines. So the reservation ids existed nowhere afterwards, and
   `cancelOrder` (which releases `item.isReserved()` lines) had nothing to work
   with. There was **no recovery path at all**; the stock was gone until process
   restart.

The fix hoists the accumulator out of the `try` and compensates:

```java
List<OrderLineItem> reservedItems = new ArrayList<>();   // outside: the catch needs it
try { ... } catch (IllegalArgumentException e) {
    releaseAll(reservedItems, "order_failed:" + orderId);
    ...
}

private void releaseAll(List<OrderLineItem> reserved, String reason) {
    for (OrderLineItem item : reserved) {
        if (item.isReserved()) {
            try { inventoryService.release(item.reservationId(), reason); }
            catch (RuntimeException ignored) { /* keep unwinding the rest */ }
        }
    }
}
```

The `try` inside the compensation loop is deliberate: **one failed release must not
strand the remaining ones.** Compensation is best-effort by nature — that's the
difference between a saga and a transaction, and it's worth saying so explicitly.

`cancelOrder` also gained a guard: cancelling a `DELIVERED` order would `release`
reservations that were already `commit`ted, crediting stock that has physically
left the building. Cancellation after delivery is a *return*, a different operation.

### 7.3 Deadlock avoidance in `transfer`

`transfer` is the only operation touching two entries, so it's the only place a
deadlock is possible: thread A moving `sku1` from `W1→W2` while thread B moves it
`W2→W1` would, with naive `src`-then-`dst` locking, take the locks in opposite
orders and hang.

```java
if (from.toString().compareTo(to.toString()) < 0) { first = src.lock; second = dst.lock; }
else                                              { first = dst.lock; second = src.lock; }
synchronized (first) { synchronized (second) { ... } }
```

Both threads sort by warehouse id, so both take `(sku1, W1)` before `(sku1, W2)`.
A **global total order on lock acquisition** is the standard cure for deadlock, and
this is the textbook shape of it. Two supporting details: `from.equals(to)` returns
early (self-transfer would otherwise try to lock the same monitor twice — harmless
because `synchronized` is reentrant, but the early return states the intent), and
transfers of *different* SKUs never share an `Entry` at all, so they don't interact.

---

## 8. Likely Follow-ups (with concise answers)

- **Reservations need a TTL.** There is none today: an abandoned checkout holds
  stock forever, which is the same leak as §7.2 arriving by a slower route. Add
  `expiresAt` to `Reservation` and a sweeper (`ScheduledExecutorService`) that
  releases expired holds — the `asynctaskprocessor` problem in this repo is exactly
  that machinery.
- **`reason` is accepted everywhere and recorded nowhere.** Every mutation takes a
  `reason` string that is silently dropped, so there is no audit trail despite the
  API implying one. Append an immutable `StockMovement(sku, warehouse, delta, type,
  reason, timestamp)` per operation; on-hand then becomes *derivable* from the
  movement log, which is how real WMS systems reconcile against physical counts.
- **Make it durable / distributed.** The `synchronized` block becomes
  `SELECT ... FOR UPDATE` on the `(sku, warehouse)` row, or better a conditional
  update: `UPDATE stock SET reserved = reserved + ? WHERE sku=? AND wh=? AND onHand - reserved >= ?`
  and check the affected-row count. The invariant moves into the database and the
  application lock disappears — the same idea one layer down.
- **Hot SKU contention.** One monitor per (SKU, warehouse) is already fine-grained,
  but a viral product still serializes. Options: shard the entry into N sub-buckets
  and reserve from one, or admit orders through a queue. Worth naming the scale at
  which this matters (thousands of concurrent reservations per SKU, not tens).
- **`getStock` on an unknown SKU creates an entry.** `getEntry` uses
  `computeIfAbsent`, so a read materializes a zero entry — unbounded growth from
  queries for SKUs that don't exist. Reads should use `get` and return an empty
  snapshot.
- **Which warehouse fulfils the order?** Currently nearest-by-distance. Real answer
  is a cost function over distance, stock availability, and split-shipment penalty —
  and if no single warehouse can serve the whole order, either split it (multiple
  shipments) or reject.
- **Returns / RMA?** The inverse of commit: `receiveStock` with a
  `reason="return:orderId"`, ideally into a quarantine location pending inspection.
- **How would you test it?** N threads reserving 1 unit of an N−1 stock: exactly
  N−1 succeed and `reserved == onHand`. The §7.2 harness: a two-line order whose
  second line fails must leave `reserved == 0`. And a transfer stress test in both
  directions simultaneously to prove no deadlock.

---

## 9. Trade-offs

- **`synchronized` per entry vs atomics:** required here, because `reserve`'s
  invariant spans `onHand` and `reserved`. Costs blocking; buys a compound
  condition CAS can't express. The deliberate contrast with `amazon`'s single-field
  CAS is the point.
- **Lock on the `Entry` vs a separate lock map:** impossible to acquire the wrong
  lock, no second structure to keep consistent; costs 16 bytes per entry for a
  monitor that most entries rarely contend.
- **`reserved` as a number vs a list of reservations per entry:** O(1) availability
  check, but the entry can't tell you *who* holds the stock or *when it expires* —
  which is precisely why the TTL feature in §8 needs the reservation records rather
  than the counter.
- **All-or-nothing multi-line orders:** simple and matches customer expectation,
  at the cost of a compensation path that must be right (and wasn't). Partial
  fulfilment would avoid the unwind but needs a split-shipment model.
- **Best-effort compensation (swallowing release failures):** keeps the unwind
  going past one bad line; means a compensation failure is invisible. In production
  that `catch` block logs and emits a metric — a stranded reservation is exactly
  what the reconciliation job should find.
- **Immutable `Order` rebuilt on every transition:** no torn reads, clean history if
  versions were kept; costs an allocation per transition and a lot of constructor
  noise at each call site.
- **In-memory:** correct scope; §8 covers the durable version, where the conditional
  UPDATE replaces the whole locking scheme.

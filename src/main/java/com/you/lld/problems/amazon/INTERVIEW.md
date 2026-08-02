# Amazon / E-Commerce — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> The whole question is one invariant: **you may not sell what you do not have.**
> Everything else — catalog, cart, reviews, order states — is scaffolding around
> that. §7.1 is the reproduction of getting it wrong.

---

## 1. Clarifying Questions (first 5 minutes)

1. **Where does the boundary sit?** Catalog, cart, checkout, order lifecycle,
   reviews. Not warehousing, not shipping carriers, not recommendations, not the
   seller portal.
2. **When is stock committed — add-to-cart or checkout?** At **checkout**.
   Reserving at add-to-cart means an abandoned cart holds inventory hostage, which
   needs a TTL and a reaper. Amazon reserves at order placement; I'll do the same
   and mention the hold-with-TTL variant.
3. **Can an order partially succeed?** No — all-or-nothing. A customer should not
   get an order confirming 2 of their 3 items. That decision drives the rollback.
4. **Multi-seller?** Products carry a `sellerId`, but I'll keep one order per
   checkout rather than splitting per seller. Splitting is a follow-up.
5. **Payment?** A `PaymentService` seam that always approves; the interesting part
   is the *ordering* of reserve → charge → confirm, which I'll cover.
6. **Money type?** `BigDecimal` throughout, never `double`.
7. **Concurrency?** Yes — flash sales are the canonical case. Many buyers, one
   unit.
8. **Cancellation returns stock?** Yes, and that has to be symmetric with the
   reservation or inventory leaks.

---

## 2. Functional Requirements

- Add/update/search products; browse by category and seller; soft-delete.
- Per-customer cart: add, update quantity, remove, clear; running total.
- **Checkout**: reserve stock for every line atomically, create an order, clear cart.
- Order lifecycle: `PENDING → CONFIRMED → SHIPPED → DELIVERED`, cancellable before
  delivery, with stock returned on cancel.
- Reviews with a running average rating per product.

## 3. Non-Functional Requirements

- **No overselling, ever** — the hard invariant, under any concurrency.
- **All-or-nothing checkout** — no partially-reserved order, no leaked reservation.
- **Exact money** — `BigDecimal`, no floating point.
- **Legal state transitions only** — enforced by the entity, not by callers.
- **Services are silent** — a service layer must not write to stdout.
- **O(1)** product/order/cart lookup by id.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `Product` | model | Catalog entry with `AtomicInteger stockQuantity`, `BigDecimal price`, running `rating`/`reviewCount`, `ProductStatus`. Owns `tryReserve` / `releaseStock` — the inventory invariant lives *in the entity*, not in a service. |
| `ProductStatus` | model (enum) | `ACTIVE` / `OUT_OF_STOCK` / `DISCONTINUED`. |
| `Cart` / `CartItem` | model | One cart per customer, `Map<productId, CartItem>`, running `totalAmount`. All mutators `synchronized` — a cart is single-customer but a customer may have several tabs open. |
| `Order` / `OrderItem` | model | Immutable line snapshots (`price` copied at checkout, so a later price change doesn't rewrite history) + `OrderStatus`, `paymentId`, `trackingNumber`. |
| `OrderStatus` | model (enum) | `PENDING → CONFIRMED → SHIPPED → DELIVERED`, plus `CANCELLED`. |
| `Review` | model | Rating + comment; feeds `Product.updateRating`. |
| `Address`, `Customer`, `Payment`, `PaymentMethod`, `PaymentStatus` | model | Supporting value objects and entities. |
| `ProductService` / `CartService` / `OrderService` / `PaymentService` | service (interfaces) | Four concerns, four seams. |
| `*ServiceImpl` | service/impl | `ConcurrentHashMap`-backed registries. |
| `Amazon` | root | Facade — and, importantly, the **only** place the cross-service checkout saga is orchestrated. |
| `exceptions/*` | exceptions | `InsufficientStockException`, `EmptyCartException`, `ProductNotFoundException`, `OrderNotFoundException`, … |

---

## 5. Relationships

- `Amazon` **has-a** `ProductService`, `CartService`, `OrderService`.
- `CartService` **depends on** `ProductService` to resolve products and prices.
- `Cart` holds `CartItem`s referencing product ids; **checkout converts** them into
  `OrderItem` snapshots. That copy is deliberate: an `Order` must not change when
  the catalog does.
- `Product` **owns** its stock counter. No service reaches in and mutates a raw
  field — they call `tryReserve` / `releaseStock`, so the invariant can't be
  bypassed by a new caller.
- `Order` **references** a `paymentId` rather than embedding a `Payment`, keeping
  the payment lifecycle independent.

---

## 6. Design Patterns (name + why vs alternatives)

- **Facade — `Amazon`.** The checkout saga spans three services; the facade is
  where that orchestration belongs. Pushing it into `CartService` would make the
  cart know about orders and inventory.
- **Service Layer + Dependency Inversion — the four interfaces.** Each concern is
  independently swappable and testable (`InMemoryOrderService` → `JpaOrderService`).
- **Value Object — `Address`, `OrderItem`, `Money` as `BigDecimal`.** `OrderItem`
  snapshotting price at checkout is the one that matters.
- **State (lightweight) — `OrderStatus` + guards on `Order`.** `ship()` requires
  `CONFIRMED`, `confirm()` requires `PENDING`, `cancel()` refuses `DELIVERED`. I
  kept these as guarded methods rather than a `State` class hierarchy: five states
  with no per-state behaviour beyond legality doesn't earn four extra classes.
  (Contrast `vendingmachine` in this repo, where each state *does* behave
  differently and the hierarchy pays for itself.)
- **Compare-and-swap (concurrency pattern) — `Product.tryReserve`.** Named
  explicitly because it's the answer to the central question.
- *(Considered, not forced)* **Observer** for order-status notifications, and
  **Strategy** for pricing/discount rules. Both are the right shape the moment a
  requirement appears; neither has a client today.

---

## 7. Key Implementation Details

### 7.1 Checkout did not touch inventory at all (the headline)

The original `checkout` read the cart, built order items, created the order, and
cleared the cart. It **never consulted or decremented stock**. Measured — 100
concurrent customers each buying the single unit in stock:

```
stock at start = 1
orders placed  = 100          <-- every one succeeded
stock now      = 1            <-- never decremented
*** OVERSOLD: 100 orders for 1 unit ***
```

An empty cart also produced a valid order with 0 items and a total of 0, while
`EmptyCartException` and `InsufficientStockException` sat in the codebase entirely
unreferenced.

Two layers of fix. First, the invariant moves **into the entity** as a CAS loop:

```java
public boolean tryReserve(int quantity) {
    while (true) {
        int current = stockQuantity.get();
        if (current < quantity) return false;                      // not enough
        if (stockQuantity.compareAndSet(current, current - quantity)) return true;
    }                                                              // lost the CAS, re-read and retry
}
```

The old `reduceStock` was `if (quantity > stockQuantity) throw; stockQuantity -= quantity;`
— textbook check-then-act. Every concurrent buyer passes the check against the same
stale read, then all of them decrement. The compare and the decrement must be *one*
atomic step, which is exactly what `compareAndSet` gives. The loop is not a spin
lock: it retries only when another thread has *succeeded*, so the system always
makes progress.

Second, checkout becomes an **all-or-nothing saga with compensation**:

```java
List<CartItem> reserved = new ArrayList<>();
try {
    for (CartItem item : cartItems) {
        Product product = products.getProduct(item.getProductId());
        if (product == null) throw new ProductNotFoundException(...);
        if (!product.tryReserve(item.getQuantity())) throw new InsufficientStockException(...);
        reserved.add(item);                       // remember what to undo
        items.add(new OrderItem(...));            // snapshot price
    }
} catch (RuntimeException e) {
    releaseAll(reserved);                          // compensate, then rethrow
    throw e;
}
String orderId = orders.createOrder(customerId, items, address);
cart.clearCart(customerId);
```

Points worth making out loud:

- **Reserve before the order exists.** If the order were created first, a failed
  reservation would leave a phantom order to clean up.
- **The `reserved` list is the compensation log.** This is the Saga pattern in
  miniature — no distributed transaction, just "record what you did so you can undo
  it". Same shape as the `ministore` order saga in this repo.
- **Cancellation is the symmetric operation.** `cancelOrder` now releases each
  line's quantity back to the catalog; without that, inventory leaks on every
  cancellation and the two paths drift apart.
- **Result after the fix:** `orders placed = 1, stock now = 0`, and the empty cart
  raises `EmptyCartException`.

### 7.2 Where the invariant lives

`tryReserve` is on `Product`, not on `ProductService`. That's the deliberate part:
a service method can be bypassed by the next person who writes a new service, but
an entity that refuses to go negative cannot be. `reduceStock` is kept as a
convenience wrapper that throws `InsufficientStockException` rather than returning
`false`, so callers can choose the style they need — but both funnel through the
same CAS.

### 7.3 The running rating average is a two-field write

```java
public synchronized void updateRating(double newRating) {
    this.rating = ((this.rating * this.reviewCount) + newRating) / (this.reviewCount + 1);
    this.reviewCount++;
}
```

`rating` and `reviewCount` must move together — an atomic per field would not help,
because the average is computed *from both*. This is the case where `synchronized`
is right and atomics are not, and it's worth contrasting with `stockQuantity`,
where a single field made CAS the better tool. The review list itself became a
`CopyOnWriteArrayList` (read-often, written-rarely) — a plain `ArrayList` inside a
`ConcurrentHashMap` loses concurrent adds, which is a mistake that *looks* safe.

### 7.4 Silent no-ops and stdout in the service layer

Every mutating method followed the shape `if (order != null) { ... }` — so
confirming, shipping, or cancelling a nonexistent order did nothing and reported
success. Combined with six unused exception classes, the codebase had an error
vocabulary it never spoke. All of these now go through:

```java
private Order requireOrder(String orderId) {
    Order order = orders.get(orderId);
    if (order == null) throw new OrderNotFoundException("Order not found: " + orderId);
    return order;
}
```

The services also printed to `System.out` on every call (9 statements) — visible in
the oversell reproduction above as 100 lines of `Order created:`. A service layer
that prints is untestable and unusable as a library; that's what a logger or an
Observer is for.

---

## 8. Likely Follow-ups (with concise answers)

- **Do this in a database instead.** The CAS becomes a conditional update:
  `UPDATE product SET stock = stock - ? WHERE id = ? AND stock >= ?` and you check
  the affected-row count. Same algorithm, enforced by the engine — and worth saying
  plainly that `compareAndSet` and the `WHERE stock >= ?` clause are the same idea
  at two layers.
- **Distributed, multi-service?** Inventory becomes its own service and checkout a
  real Saga: `ReserveInventory → ChargePayment → ConfirmOrder`, with a
  compensating action per step and an outbox for reliable event delivery. The
  `reserved` list here is the in-memory version of exactly that.
- **Where does payment go in the order?** Reserve → charge → confirm. Charging
  first can take money for an order you can't fulfil; confirming first can ship
  goods you weren't paid for. If the charge fails, release the reservation.
- **Reservation with a TTL (cart holds)?** Add `expiresAt` to a reservation record
  and a sweeper that releases expired holds. Necessary the moment you reserve at
  add-to-cart rather than checkout.
- **Flash-sale hotspot.** One `AtomicInteger` for a viral product is a contended
  cache line. Shard the counter into N buckets and reserve from a bucket, or put a
  queue in front and admit buyers in order. Say the number: CAS contention starts
  to hurt in the thousands-of-threads range, not at 100.
- **Search at scale?** `searchProducts` is an O(n) scan with `toLowerCase` per
  product per query. Real answer is an inverted index (Elasticsearch); intermediate
  answer is a precomputed lowercase field and a term index.
- **Per-seller order splitting?** Group cart items by `sellerId` at checkout and
  create one `Order` per seller, sharing a `parentOrderId` — reservations still
  happen once, up front, across the whole cart.
- **How would you test it?** Exactly the harness from §7.1: N threads, 1 unit of
  stock, assert `orders == 1 && stock == 0`. Plus a partial-failure test: a
  two-line cart where the second line is short, asserting the first line's
  reservation was released. Both belong as JUnit tests — the current gap.

---

## 9. Trade-offs

- **CAS loop vs `synchronized` on the product:** CAS is lock-free and ideal for a
  single counter, but only covers *one* field. The rating average needed
  `synchronized` for exactly that reason. Choosing per field rather than uniformly
  is the point.
- **Reserve at checkout vs at add-to-cart:** checkout avoids holding inventory for
  abandoned carts and needs no reaper, at the cost of a customer discovering at the
  last step that an item went out of stock. Reserving earlier inverts both.
- **All-or-nothing vs partial fulfilment:** simpler mental model and no partial
  orders, but a 20-item cart fails entirely because one item is short. A real
  system offers "ship what's available" as an explicit customer choice.
- **Compensation list vs a real transaction:** works in-process and is honest about
  being a saga, but compensation is not atomic — a crash between reserve and
  release leaks stock. That's what an outbox and a reconciliation job are for.
- **Soft delete for products:** keeps historical orders resolvable, at the cost of
  a catalog that only grows and needs `status` filtering on every read path.
- **Price snapshot in `OrderItem`:** correct history, at the cost of duplicated
  data that can't be corrected retroactively (which is usually what you want).
- **In-memory registries with O(n) search/filter:** right scope for the exercise;
  §8 covers the index story rather than pretending `stream().filter()` scales.

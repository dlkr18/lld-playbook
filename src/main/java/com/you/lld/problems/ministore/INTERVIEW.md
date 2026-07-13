# INTERVIEW.md — Mini-Store (simplified Shopify, multi-tenant e-commerce)

Full SDE2/SDE3 machine-coding walkthrough for: *"Design a simplified Shopify — multi-tenant
stores, per-store inventory that never oversells, cart, single-store orders that deduct stock,
and a pluggable payment abstraction."*

---

## 0. How to read the question (say this early)

The brief hands you the scope explicitly, so don't burn time re-deriving it. The three parts
that actually carry signal:
1. **Tenant isolation** — products are per-store and never shared. Design this as a hard
   guarantee, not a convention.
2. **The inventory invariant** — "never negative / no overselling" must be *impossible by
   construction*, and stock must stay accurate under the order flow.
3. **Order = a small saga** — validate → deduct → pay → (confirm | roll back). Payment is an
   interface (they said so).

The brief also tells you what to *skip*: no auth, no real payment, concurrency not required
up-front, storage can be in-memory. Say out loud that you'll **design the seams so those can
be added later** — that's what turns "simplified" into "senior".

## 1. Clarifying questions (2–3 min)

| Question | Why | Assumed answer |
|---|---|---|
| Can one order span multiple stores? | Changes cart/order modeling fundamentally | **No** — one order = one store (brief) |
| Are products ever shared between stores? | Tenancy model | **No** — each store has its own catalog |
| Deduct stock at add-to-cart or at order? | Reservation semantics | **At order placement** (brief); cart is a wish-list |
| Is payment sync (charge now) or async? | Order state machine shape | **Sync** for v1; the gateway returns approve/decline |
| Do we need concurrency safety now? | Scope | **No up-front** (brief) — but I'll note where the lock goes |
| Storage — in-memory or DB? | Persistence seam | **In-memory**, behind a Repository so DB is a drop-in |

## 2. Requirements

**Functional:** multiple stores (tenants); per-store catalog (products not shared); products
track inventory; cart (add/merge/view); place an order for ≥1 products from a single store;
validate + deduct inventory on order; inventory never negative; pluggable payment.

**Non-functional (state, then defer per brief):** accurate inventory (atomicity of the
deduct), extensibility (new payment provider / storage = new class), tenant isolation as a
correctness guarantee. Concurrency + auth + scale explicitly deferred.

## 3. Core entities

| Class | Layer | Internals |
|---|---|---|
| `Store` | model | tenant id + name |
| `Product` | model | id, **storeId**, name, `Money` price — immutable; storeId is the isolation key |
| `InventoryItem` | model | mutable `available`; `deduct(qty)` guards ≥0 (the invariant); `restock(qty)` |
| `Cart` / `CartLine` | model | bound to one `storeId`+`customerId`; merges quantities |
| `Order` / `OrderLine` | model | line freezes name+unitPrice at order time; `Order` is a PENDING→CONFIRMED/CANCELLED state machine |
| `Money` | model | BigDecimal, scale 2, value equality, non-negative |
| `Repository<T,ID>` | service | storage seam (`InMemoryRepository` now) |
| `PaymentGateway` | service | **Strategy** — `charge(PaymentRequest) → PaymentResult` |
| `MiniStore` | root | **Facade/orchestrator**; owns repos + inventory + carts; runs `placeOrder` |

## 4. Patterns — and why over alternatives

- **Facade** (`MiniStore`): one readable entry point over a multi-part subsystem. *Not* a
  God object — the real logic (guard, saga) lives in the entities/flow; the facade coordinates.
- **Strategy** (`PaymentGateway`): the brief literally asks for a pluggable payment
  abstraction. The flow depends only on the interface → Stripe/PayPal/test-double are drop-ins;
  I even swap it at runtime in the demo.
- **Repository** (`Repository<T,ID>`): answers "in-memory OR relational, don't worry about
  scale". The seam is there so the answer to "now put it in Postgres" is *one new class*.
- **State (lightweight)** on `Order`: `confirm()`/`cancel()` validate the transition — a
  CONFIRMED order can't be silently re-cancelled. Chose an enum + guarded methods over full
  GoF State because the lifecycle is linear with no per-state behavior.
- **Value Object** (`Money`): correctness (never `double` for money) and value equality so
  `$60.50 == $60.50`.

## 5. Multi-tenancy — the part they're really testing

Three common models — name all three, pick one, justify:
- **Shared-schema, tenant-scoped (chosen):** one set of tables, every row carries `storeId`,
  every query filters by it. Cheapest, simplest; isolation is enforced in code. Best for v1.
- **Schema-per-tenant:** stronger isolation, more ops overhead.
- **Database-per-tenant:** strongest isolation/compliance, heaviest to run.

**How I enforce it:** a single choke point — `MiniStore.requireProduct(storeId, productId)`.
Every product access (cart add, stock check, order line) goes through it, and it rejects any
product whose `storeId` ≠ the caller's store as `NotFound`. So a tenant **cannot even observe**
another tenant's data — cross-tenant access is indistinguishable from "doesn't exist". One
method to audit = the isolation guarantee.

## 6. Key implementation details (the 3 an interviewer probes)

**a) "Never oversell" is an invariant, not a caller check.**
```java
// InventoryItem
public void deduct(int qty, String name) {
    if (qty > available) throw new InsufficientInventoryException(name, qty, available);
    available -= qty;                 // cannot go negative — the guard is here, once
}
```
No caller can bypass it. That's "impossible by construction".

**b) Order placement = validate-all → deduct-all → charge → compensate (the saga).**
```java
// 1. validate EVERY line's stock first — NO mutation yet
for (CartLine cl : cart.lines()) { ...check available >= qty... }
// 2. now deduct all (safe: already validated)
for (OrderLine l : lines) inventory.get(l.productId()).deduct(l.quantity(), l.productName());
// 3. charge via the pluggable gateway
PaymentResult r = paymentGateway.charge(new PaymentRequest(order.id(), total, method));
if (!r.approved()) {                  // 4a. COMPENSATE
    for (OrderLine l : lines) inventory.get(l.productId()).restock(l.quantity());
    order.cancel(); throw new PaymentDeclinedException(...);
}
order.confirm(r.transactionId());     // 4b. success: confirm + clear cart
```
The validate-before-deduct split is what makes a multi-line order atomic single-threaded — a
shortage on the last line never half-commits the earlier ones. Payment decline triggers a
**compensating transaction** (restock) — classic saga rollback.

**c) Catalog vs stock are separate objects.** `Product` (immutable: name, price) vs
`InventoryItem` (mutable: available). A sale changes stock, not the product — so they don't
share a class. Interviewers notice this.

## 7. Likely follow-ups + answers

- **"Now make it concurrent / thread-safe."** (the #1 follow-up) — Under threads, my
  check-then-deduct races: two orders both read available=1, both deduct → oversell. Fixes,
  cheapest first: (i) `synchronized` `deduct`/`restock` on `InventoryItem` (per-item lock —
  fine-grained, different products don't contend); (ii) or `AtomicInteger` with a CAS loop
  `while(!cas(cur, cur-qty))`. For a **multi-line** order, acquire the per-item locks in a
  **consistent global order** (sort by productId) to avoid deadlock — same trick as the
  digital-wallet transfer. The entity boundary is already the lock boundary, so it's a small
  change.
- **"Reserve stock at add-to-cart with a timeout?"** — Add a `RESERVED` bucket to
  `InventoryItem` (available/reserved), reserve on add with a TTL, release on expiry or
  confirm-on-order. Turns overselling-under-slow-checkout into a non-issue. (This is how real
  carts work.)
- **"Payment is actually async (webhook)."** — Order stays `PENDING`; gateway returns a
  pending handle; a webhook later flips it `CONFIRMED`/`CANCELLED`. Add `PENDING_PAYMENT` and
  an idempotent webhook handler keyed by transactionId. Stock stays deducted while pending
  (or use the reservation model).
- **"Move to a real DB."** — Implement `Repository` with JDBC; the deduct becomes a
  **conditional update** `UPDATE inventory SET available=available-? WHERE product_id=? AND
  available>=?` and check rows-affected — the DB enforces the invariant atomically, no app lock.
- **"Multiple orders, partial fulfillment / backorder."** — Split order into per-item
  fulfillment status; allow partial confirm. Bigger model change; note it, don't build it.
- **"Discounts / taxes / shipping."** — A pricing pipeline (Chain/Decorator) over the order
  subtotal — pluggable rules, same shape as everything else here.

## 8. Trade-offs made deliberately

| Chose | Over | Because |
|---|---|---|
| Shared-schema + storeId scoping | schema/DB-per-tenant | simplest correct model for v1; named the upgrade |
| Deduct at order time | reserve at add-to-cart | brief says so; simpler; noted the reservation upgrade |
| Single-threaded v1 | locks up-front | brief defers concurrency; seam (entity = lock boundary) is ready |
| App-level validate+deduct | DB conditional update | no DB in v1; the atomic-update answer is the DB migration path |
| Enum + guarded methods for Order state | full GoF State | lifecycle is linear, states carry no behavior |

## 9. 90-minute pacing (the Harness format)

| Time | Do |
|---|---|
| 0–7 | Clarify (§1); agree scope (single-store orders, deduct-at-order, in-memory) |
| 7–15 | Whiteboard entities + the isolation choke point + the order saga; name the patterns |
| 15–35 | model/: Money, Store, Product, InventoryItem (the guard!), Cart, Order/OrderLine |
| 35–50 | `PaymentGateway` + `Repository` seams; `MiniStore` facade with catalog/cart |
| 50–70 | `placeOrder` — the saga (validate→deduct→charge→rollback) + a running demo |
| 70–80 | Oversell + cross-tenant + decline-rollback scenarios; a few tests |
| 80–90 | Their follow-up (almost always concurrency) — talk through per-item locks / CAS / DB conditional update |

**If time collapses:** keep multi-tenant isolation + the inventory guard + one happy-path
order running. Cut the Repository abstraction (use raw maps) and the threshold gateway before
you cut the runnable demo.

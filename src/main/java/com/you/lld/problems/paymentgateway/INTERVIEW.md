# Payment Gateway — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> The single fastest way to fail this question is to type `double amount`.
> Money is exact, and a gateway's whole job is to agree with a bank's ledger to
> the cent. Section 7.1 shows the concrete failure.

---

## 1. Clarifying Questions (first 5 minutes)

1. **Are we the gateway or the processor?** We're the gateway: we own the
   transaction lifecycle, idempotency, and the refund ledger, and we delegate the
   actual money movement to per-method processors (card network, UPI, wallet,
   bank). The processors are stubs behind an interface.
2. **Auth/capture split, or single-shot charge?** Single-shot for the core; I'll
   note where `authorize` → `capture` → `void` slots into the same state machine.
3. **Partial refunds?** Yes — N refunds against one transaction, never exceeding
   the captured amount in aggregate. This is where the money type bites.
4. **Idempotency?** Yes — clients retry on timeout. Same idempotency key must
   never charge twice, even under concurrent retries.
5. **Multi-currency?** Amounts carry a currency; arithmetic across currencies must
   be rejected, not silently coerced.
6. **Consistency model?** Single-node, in-memory for this exercise. I'll cover the
   distributed/durable version in follow-ups since that's where the real design is.
7. **What must never happen?** (a) double charge, (b) refunding more than captured,
   (c) refunding a failed transaction. Those three are the invariants I'll defend.

---

## 2. Functional Requirements

- Charge a customer for a merchant via one of several payment methods.
- Retry-safe charging through an **idempotency key**.
- Look up a transaction by id.
- **Partial + full refunds**; aggregate refunds may never exceed the captured amount.
- A fully-refunded transaction moves to `REFUNDED` and accepts nothing further.
- Failed and pending transactions are not refundable.
- List all refunds for a transaction, and the refunded total.

## 3. Non-Functional Requirements

- **Exact monetary arithmetic** — integer minor units, no binary floating point.
- **Thread-safety** — concurrent refunds on one transaction must not over-refund;
  concurrent retries on one idempotency key must not double-charge.
- **Extensibility** — a new payment method is a new class, not an edit (OCP).
- **Legal state transitions only** — the lifecycle is enforced by the state
  objects, not by scattered `if (status == ...)` checks.
- **O(1)** transaction and refund lookup.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `Money` (`com.you.lld.common`) | shared VO | Immutable `long minor` + `Currency`. `plus/minus` use `Math.addExact` (overflow throws, never wraps) and reject currency mismatch. The type that makes the refund invariant expressible. |
| `Transaction` | model | `id`, `merchantId`, `customerId`, `Money amount`, `method`, `status`, `createdAt`, and a running `Money refundedAmount`. `remainingRefundable() = amount − refundedAmount`. Mutable, but only under the gateway's monitor. |
| `TransactionStatus` | model (enum) | `PENDING → SUCCESS → REFUNDED`, or `PENDING → FAILED`. |
| `Refund` | model | Immutable `(refundId, transactionId, Money amount)` + `RefundStatus`. One row per refund — the audit trail. |
| `PaymentMethod` | model (enum) | `CARD`, `UPI`, `WALLET`, `BANK_TRANSFER`. |
| `PaymentProcessor` | service (interface) | `boolean charge(Transaction)` — the money-movement seam. |
| `Card/Upi/Wallet/BankTransfer PaymentProcessor` | service/impl | Method-specific rules (UPI per-txn cap, bank minimum, deterministic card decline). |
| `PaymentProcessorFactory` | service/impl | `EnumMap<PaymentMethod, PaymentProcessor>` of stateless singletons. |
| `TransactionState` | service (interface) | `markSuccess`, `markFailed`, `applyRefund` — what's *legal* from a given status. |
| `Pending/Success/Failed/Refunded TransactionState` | service/impl | The four states. Only `SuccessTransactionState.applyRefund` actually refunds; the others throw. |
| `TransactionStateFactory` | service/impl | Maps status → shared stateless state singleton (flyweight). |
| `PaymentGatewayService` | service (interface) | The contract; lets the facade depend on an abstraction. |
| `InMemoryPaymentGatewayService` | service/impl | Engine: transaction registry, refund index, idempotency map, id counters, locking. |
| `PaymentGateway` | root | Thin facade — `pay`, `refund`, `transaction`, `refunds`, `refundedAmount`. |

---

## 5. Relationships

- `PaymentGateway` **has-a** `PaymentGatewayService` (constructor-injected seam).
- `InMemoryPaymentGatewayService` **owns** three indexes:
  `transactions` (`txnId → Transaction`), `refundsByTransaction`
  (`txnId → List<Refund>`), `idempotencyKeys` (`key → txnId`).
- A `Transaction` **aggregates** its refunds two ways: the `Refund` rows (audit
  trail) and the running `refundedAmount` total (the invariant). They are written
  in the same critical section so they cannot diverge.
- `TransactionState` is chosen **from** `Transaction.status` on each call — the
  state objects are stateless flyweights, so the transaction owns the state *value*
  and the state objects own the *behaviour*.
- Processors are stateless and shared; they read a `Transaction` and never mutate it.

---

## 6. Design Patterns (name + why vs alternatives)

- **Strategy — `PaymentProcessor`.** Each method has genuinely different rules
  (UPI caps, bank minimums, card network decline). Behind an interface, adding
  Apple Pay is one class + one `EnumMap` entry. *Alternative:* a `switch (method)`
  inside the gateway — rejected: the gateway would grow a branch per method and
  couldn't be tested per-method.
- **State — `TransactionState`.** The legality of an operation depends on the
  current status. Encoding that in state classes means `applyRefund` on a
  `FAILED` transaction throws *by construction*, not because someone remembered an
  `if`. *Alternative:* status checks scattered in the service — rejected: the
  transition rules end up duplicated at every call site and drift.
- **Flyweight — state + processor singletons.** Both are stateless, so one shared
  instance each; `TransactionStateFactory` and `PaymentProcessorFactory` hand out
  the same objects. No per-transaction allocation.
- **Factory — the two factories above.** Centralize the status→state and
  method→processor mappings so the mapping lives in exactly one place.
- **Facade — `PaymentGateway`.** One front door; pure delegation.
- **Value Object — `Money`.** Immutable, currency-tagged, exact. Reused from
  `com.you.lld.common` rather than reinvented.
- *(Considered, not forced)* **Observer** for webhooks/receipts. Real gateways need
  it, but with no subscriber in scope it would be an empty extension point — I'd add
  it the moment a notification requirement appears, and I say exactly that.

---

## 7. Key Implementation Details

### 7.1 `Money`, not `double` — with the concrete failure

The original version stored `double amount` / `double refundedAmount` and closed
the ledger with `remainingRefundable() <= 0.0`. That is broken, and not
theoretically:

```
amount = 0.08, refunded in three parts: 0.06 + 0.01 + 0.01
  0.06 + 0.01 + 0.01  ==  0.07999999999999999   (binary double)
  remaining  ==  1.3877787807814457E-17         (> 0 !)
```

Consequences, both reproduced against the real gateway before the fix:

1. The transaction **never reached `REFUNDED`** — it sat in `SUCCESS` forever,
   because `remaining <= 0.0` was false.
2. `remainingRefundable()` was positive, so the gateway **accepted a fourth refund**
   on an already fully-refunded transaction.

`Money` stores `long minor` (cents), so `0.06 + 0.01 + 0.01` is `6 + 1 + 1 == 8`
and `remaining` is exactly zero. The fix isn't "round more carefully" — it's using
a type where the invariant is representable. `Money.plus/minus` also use
`Math.addExact`, so an overflow throws instead of silently wrapping to a negative
balance, and mixing currencies throws instead of coercing.

**Interview framing:** "the amount is `long` cents wrapped in a `Money` value
object; the wrapper exists so currency travels with the number and so I can't
accidentally add USD to EUR."

### 7.2 Idempotency: claim the key *before* publishing the transaction

The naive version is check-then-act and leaks:

```java
if (idempotencyKeys.get(key) != null) return existing;   // both threads miss
Transaction txn = new Transaction(...);
transactions.put(txnId, txn);                            // both publish!
idempotencyKeys.putIfAbsent(key, txnId);                 // one loses, but its txn is already live
```

The loser returns the winner's transaction — so no double *charge* — but it has
already published an orphan transaction that is reachable by id and will never be
charged or reconciled. In a real gateway that's a phantom row in the ledger.

The fix inverts the order: **win the key first, then create anything.**

```java
String txnId = "TXN-" + txnCounter.incrementAndGet();
if (idempotent) {
    String owner = idempotencyKeys.putIfAbsent(idempotencyKey, txnId);
    if (owner != null) return getTransaction(owner);   // lost the race, created nothing
}
Transaction txn = new Transaction(txnId, ...);
transactions.put(txnId, txn);
```

`putIfAbsent` on a `ConcurrentHashMap` is an atomic CAS — exactly one thread can
win a given key. The loser exits having allocated only a burnt counter value.

**The honest caveat, stated unprompted:** the loser may observe the transaction
while it is still `PENDING`, because the winner charges after publishing. Real
gateways either return `409 Conflict + retry-after` for an in-flight key, or make
the client poll. Blocking the loser on the winner's charge would be worse — it
couples an inbound request to an outbound network call.

### 7.3 The refund critical section

Over-refunding is a check-then-act race on `remainingRefundable()`: two threads
each refund 60 of a 100 transaction, both see 100 remaining, both pass.

```java
Transaction txn = getTransaction(transactionId);
synchronized (txn) {                       // per-transaction monitor
    if (amount == null || !amount.isPositive()
            || amount.compareTo(txn.remainingRefundable()) > 0) {
        throw new IllegalArgumentException("Refund amount must be positive and at most "
                + txn.remainingRefundable());
    }
    TransactionStateFactory.forStatus(txn.getStatus()).applyRefund(txn, amount);
    // ... append the Refund row, same section
}
```

- The lock is **per transaction**, not global — refunds on different transactions
  never contend. The `Transaction` object itself is the natural monitor since it's
  the unit of mutual exclusion.
- The bound check, the ledger update (`addRefund`), the status flip to `REFUNDED`,
  and the audit row all happen inside one section. Splitting any of them out
  reopens the race.
- `applyRefund` is dispatched through the **state**, so refunding a `FAILED` or
  `PENDING` transaction throws from the state object — the bound check and the
  legality check are separate concerns and stay that way.
- The charge path takes the same monitor, so a status transition is never
  interleaved with a refund's read of that status.

### 7.4 Refund lookup: index, don't scan

`getRefunds` originally scanned every refund in the system and filtered by
transaction id — O(total refunds) per call. It's now a
`ConcurrentHashMap<String, CopyOnWriteArrayList<Refund>>` keyed by transaction:
O(1) lookup, and `CopyOnWriteArrayList` means readers never block writers (refunds
per transaction are few and write-rare, which is exactly COW's sweet spot). The
returned list is a defensive copy so callers can't mutate the ledger.

---

## 8. Likely Follow-ups (with concise answers)

- **Auth / capture / void?** Add `AUTHORIZED` between `PENDING` and `SUCCESS`, plus
  an `AuthorizedTransactionState` allowing `capture` (→ `SUCCESS`) and `void`
  (→ `CANCELLED`) but not `applyRefund`. The state machine absorbs it; no service
  changes.
- **Make it durable and distributed?** The idempotency CAS becomes a **unique index
  on `idempotency_key`** — insert-and-catch-duplicate is the same algorithm at DB
  level. The refund critical section becomes `SELECT ... FOR UPDATE` on the
  transaction row, or a conditional update
  `UPDATE txn SET refunded = refunded + ? WHERE id = ? AND refunded + ? <= amount`
  — which enforces the invariant in the database and needs no application lock at all.
- **What if the processor call times out?** You don't know if the charge landed.
  Persist `PENDING` **before** calling out (write-ahead), then reconcile: query the
  processor by your own reference id, or let their webhook settle it. Never retry a
  charge without an idempotency key on the *outbound* call too.
- **Idempotency key reuse with a different amount?** Store a request fingerprint
  (hash of merchant+customer+amount+method) alongside the key and reject a reuse
  whose fingerprint differs — that's a client bug, not a retry. Stripe returns an
  error here.
- **How long do idempotency keys live?** They can't grow forever. TTL them (24h is
  typical) with a sweeper, or a bounded LRU. Today the map is unbounded — a real leak
  I'd name before being asked.
- **Multi-currency refunds?** `Money.minus` throws on currency mismatch, so a
  EUR refund against a USD transaction fails loudly instead of corrupting the ledger.
  FX conversion belongs in a separate service with its own rate-at-capture record.
- **Receipts / webhooks / fraud checks?** Observer on the transaction lifecycle;
  fire **outside** the `synchronized` block so a slow subscriber can't widen the
  critical section.
- **How would you test the concurrency?** N threads on one `CountDownLatch` start
  gate refunding 1 unit of an N−1 transaction: exactly N−1 succeed, one throws, and
  `refundedAmount == amount` exactly. Same shape for idempotency: N threads, one key,
  assert one distinct transaction id and one charge.

---

## 9. Trade-offs

- **`Money` (long minor units) vs `BigDecimal`:** `long` is faster, allocation-free,
  and makes "exactly zero" trivially checkable; it caps at ~92 quadrillion minor
  units (fine) and can't express sub-cent pricing, which some billing systems need.
  `BigDecimal` would handle sub-cent at the cost of scale-management everywhere.
- **`synchronized (txn)` vs a lock map vs DB-level constraints:** locking the domain
  object is simple and needs no extra structure, but it only works because the
  transaction registry hands back a canonical instance. The moment transactions are
  loaded from a database (fresh object per read) this breaks — and the conditional
  UPDATE in §8 is the right answer there. Worth saying out loud that the in-memory
  lock is a single-node artifact.
- **Mutable `Transaction` vs event-sourced ledger:** mutation is compact and
  readable; a real payments system would append immutable events
  (`Charged`, `Refunded`) and fold them, giving audit and replay for free. Out of
  budget for 90 minutes, but the direction I'd name.
- **Status enum + flyweight states vs a state field holding the object:** storing
  the enum keeps `Transaction` serializable and DB-friendly, at the cost of a
  factory lookup per operation (an `EnumMap` hit — negligible).
- **`CopyOnWriteArrayList` for refunds:** free concurrent reads, O(n) copy per
  write. Correct here (a handful of refunds per transaction); wrong if a transaction
  could accumulate thousands.
- **Stub processors:** keeps the exercise about gateway design rather than network
  I/O, but hides the hardest real problem — partial failure against a remote
  processor, addressed in §8 rather than in code.
- **Unbounded idempotency map:** simple and correct for the demo; a memory leak in
  production. Named rather than hidden.

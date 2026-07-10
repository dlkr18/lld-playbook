# Digital Wallet — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a digital wallet (Paytm/Venmo style): users hold a wallet balance,
can top-up and withdraw, and can send money peer-to-peer. Transfers must be atomic,
concurrency-safe, deadlock-free, idempotent, and fully auditable via a double-entry ledger.

> **How this differs from `paymentgateway` and `splitwise`** (same repo):
> - **Payment gateway** is about *routing* a charge to an external processor (card/UPI/bank),
>   with a class-per-state State machine and refund handling. It does not keep a balance or a ledger.
> - **Splitwise** tracks *who-owes-whom* pairwise balances and a greedy debt *simplifier*; there
>   is no real money movement, no locking, no idempotency.
> - **This** is an in-house *bank ledger*: real balances, a system cash counterparty, a
>   double-entry ledger that nets to zero, ordered two-account locking for atomic transfers,
>   and idempotency keys. The hard parts are **concurrency correctness** and **accounting
>   invariants**, not payment-method routing or debt math.

---

## 1. Clarifying Questions

- Single currency or multi? → Single currency; `Money` on `BigDecimal` (scale 2, HALF_EVEN).
- Can a wallet go negative? → No for user wallets; the internal system cash account may.
- What is "top-up" backed by? → Out of scope to integrate a real bank; we model the outside
  world as a **system cash account** so every movement is a clean double-entry.
- Are transfers between two of *our* accounts, or external? → Internal P2P for this exercise.
- Do we need idempotency? → Yes — mobile clients retry; a retried transfer must not double-charge.
- Concurrency expectations? → Many concurrent transfers; balances must never be lost/corrupted,
  and we must not deadlock.
- Do we need reversals/refunds? → Yes, a completed transaction can be reversed via a
  compensating entry (keeps the ledger balanced).
- Persistence? → In-memory for the exercise; interfaces are drawn so a DB/repo can slot in.

---

## 2. Functional Requirements

1. **Accounts** — create a wallet with zero balance.
2. **Top-up** — credit a wallet (money in from outside world).
3. **Withdraw** — debit a wallet, rejected on insufficient funds.
4. **Transfer** — atomic P2P: debit A and credit B, all-or-nothing.
5. **Idempotent transfer** — replaying an idempotency key returns the original result.
6. **History** — per-account list of transactions (including failed attempts).
7. **Double-entry ledger** — every movement recorded as a balanced DEBIT/CREDIT pair.
8. **Reversal** — undo a completed transaction with a compensating movement.
9. **Limits (Strategy)** — pluggable per-account daily transfer limit / fee policy.
10. **Notifications (Observer)** — fire on terminal transaction events.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Money precision** | `BigDecimal`, scale 2, `HALF_EVEN`; never `double`. |
| **Thread-safe balances** | Per-account `ReentrantLock`; no lost updates. |
| **Deadlock-free** | Two-account operations lock in a global id order. |
| **Atomicity** | Debit + credit + ledger append happen under both locks; failure mutates nothing. |
| **Idempotency** | At-most-once execution per key; replays are free reads. |
| **Auditability** | Append-only ledger; illegal state transitions rejected. |
| **Extensibility** | New limit policy / observer / operation without touching the core. |

---

## 4. Core Entities (layer + one-line internal summary)

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `Money` | model (VO) | Immutable `BigDecimal` at scale 2; arithmetic + sign checks only. |
| `Account` | model | Owner + balance + its own `ReentrantLock`; `credit`/`debit` guarded; system account allows overdraft. |
| `Transaction` | model | Auditable record; mutable `status` with validated transitions; holds its ledger entries. |
| `LedgerEntry` | model | Immutable line: (txn, account, DEBIT/CREDIT, positive amount, time); `signedAmount()`. |
| `TransactionType` | model (enum) | TOP_UP / WITHDRAWAL / TRANSFER / REVERSAL. |
| `TransactionStatus` | model (enum) | PENDING / COMPLETED / FAILED / REVERSED + `canTransitionTo`. |
| `EntryDirection` | model (enum) | DEBIT(−1) / CREDIT(+1) with a `sign()`. |
| `AccountService` | service | Account registry + lookup. |
| `LedgerService` | service | Append balanced pairs; `totalBalance()`, `reconciledBalance()`. |
| `TransactionService` | service | topUp/withdraw/transfer/reverse/history + observers. |
| `TransferPolicy` | service | Strategy: `validate` + `onCompleted` (limits/fees). |
| `TransactionObserver` | service | `onTransaction` callback. |
| `WalletCommand` | service | Command: `execute() → Transaction`. |
| `DefaultTransactionService` | impl | The engine: `performMovement` = ordered-lock + funds check + debit/credit + ledger + state. |
| `DigitalWallet` | root | Facade wiring everything; owns the SYSTEM account. |

---

## 5. Relationships

- `DigitalWallet` **owns** one `AccountService`, one `LedgerService`, one
  `TransactionService`, and the single `SYSTEM` `Account`.
- `DefaultTransactionService` **creates** a `WalletCommand` per request; the command
  **delegates** to the shared `performMovement` core.
- `TransferCommand` **uses** a `TransferPolicy` (Strategy) for pre-checks and usage accrual.
- `DefaultTransactionService` **notifies** registered `TransactionObserver`s.
- Each `Transaction` **aggregates** exactly two `LedgerEntry` rows (the balanced pair).
- Every operation is a movement between two `Account`s; top-up/withdraw use `SYSTEM` as the
  counterparty, so the ledger and the sum of all balances are conserved at zero.

---

## 6. Patterns — rationale vs alternatives

- **Command** (`WalletCommand`): each operation is an object with its own pre-conditions
  (funds check, policy gate, idempotency), yet they all funnel into one atomic movement core.
  *Alternative:* four public methods with inline logic — works, but duplicates the locking/ledger
  dance and is harder to extend (e.g. queue commands, retry, or audit them uniformly).
- **Strategy** (`TransferPolicy`): limit/fee rules vary independently of execution. Swap
  `UnlimitedTransferPolicy` for `DailyLimitTransferPolicy` (or a KYC-tier policy) with no core change.
  *Alternative:* `if/else` on config flags — violates OCP, grows unbounded.
- **Observer** (`TransactionObserver`): notifications/fraud/analytics are cross-cutting and
  should not couple to money movement. *Alternative:* call a notifier inline — couples the core
  to delivery concerns and to every new consumer.
- **State** (`TransactionStatus.canTransitionTo`): a linear lifecycle with no per-state
  *behaviour*, so an enum-encoded transition table is cleaner than GoF class-per-state (which
  `paymentgateway` uses because its states carry behaviour). Illegal transitions throw, protecting
  the audit trail.
- **Facade** (`DigitalWallet`): the one object an interviewer reads first.

---

## 7. Key Implementation Details

### 7.1 Deadlock-free atomic transfer (ordered locking)

A transfer must debit A and credit B as one indivisible step, so we hold *both* account locks.
The classic bug: thread 1 does `transfer(A→B)` and locks A then B, while thread 2 does
`transfer(B→A)` and locks B then A → circular wait → deadlock.

**Fix:** impose a *global total order* on locks and always acquire in that order, regardless of
transfer direction. We order by account id:

```java
ReentrantLock firstLock  = lower(from, to).lock();   // smaller id
ReentrantLock secondLock = higher(from, to).lock();  // larger id
firstLock.lock(); secondLock.lock();
try {
    if (!from.allowsOverdraft() && from.balance().isLessThan(amount))
        throw new InsufficientFundsException(...);    // check BEFORE any mutation
    from.debit(amount);
    to.credit(amount);
    ledger.record(txn.id(), from.id(), to.id(), amount);
    txn.markCompleted(pair);
} finally { secondLock.unlock(); firstLock.unlock(); }
```

Because the funds check runs while both locks are held and *before* any mutation, an
insufficient-funds transfer mutates nothing — both balances are untouched. `Account`'s lock is
reentrant, so the inner `debit`/`credit` (which also lock) are free re-entries.

*Alternatives considered:* one global lock (correct but serializes the whole wallet — no
concurrency); `tryLock` with back-off (livelock risk, more complex); DB row locks / optimistic
version columns (the production answer — noted under follow-ups).

### 7.2 Idempotency

`transfer(from, to, amount, key)` executes at most once per key:

```java
Transaction existing = idempotencyStore.get(key);        // fast path
if (existing != null) return existing;
return idempotencyStore.computeIfAbsent(key, k ->
        new TransferCommand(...).execute());             // execute-once
```

`computeIfAbsent`'s mapping function runs under the map's per-bin lock, and it never touches
`idempotencyStore` again, so there's no re-entrant/lock-ordering hazard with the account locks.
A replay returns the cached `Transaction` **without** moving funds. If the first attempt *throws*
(insufficient funds), `computeIfAbsent` stores nothing → the key stays free for a real retry
(see `failedIdempotentTransferIsRetryable`). *Trade-off:* we cache only successes; caching failures
too would make replays return the failure instead of retrying — a product decision.

### 7.3 Double-entry ledger

Each movement appends a balanced pair: a DEBIT on the payer and a CREDIT on the payee of equal
amount. Signed sum of a pair is zero, so:

- `totalLedgerBalance()` is **always** `0.00` (system-wide invariant, checked in tests + demo).
- an account's live balance equals the signed sum of its entries (`reconciledBalance`), giving a
  cheap consistency audit.

Modelling top-up as `SYSTEM → wallet` and withdraw as `wallet → SYSTEM` means even those net to
zero across all accounts — the system account simply carries the negative of all outstanding
wallet money. Reversal appends the opposite pair and flips the original to `REVERSED`, so the
ledger is never left unbalanced even when undoing.

---

## 8. Follow-ups & Answers

- **Persistence / durability?** Replace `InMemory*` services with DB-backed repos. The ledger
  becomes an append-only table; balances become a row per account. Wrap debit+credit+ledger in a
  single DB transaction; use `SELECT … FOR UPDATE` on the two account rows *in id order* (same
  ordered-locking idea, enforced by the DB) or optimistic locking with a version column + retry.
- **Idempotency across processes?** Move `idempotencyStore` to a shared store (Redis/DB unique
  key). Insert the key in the same transaction that writes the ledger, so "recorded" and
  "de-duplicated" commit atomically.
- **Distributed / sharded accounts?** Two accounts on different shards can't share a local lock →
  use a Saga / two-phase approach: reserve-debit on A, credit B, confirm; compensate on failure.
  The `REVERSAL`/compensating-movement machinery already models the compensation step.
- **Hot account (many concurrent transfers to one wallet)?** The single account lock becomes a
  bottleneck. Options: shard the balance into sub-accounts, or use atomic/striped counters and
  reconcile from the ledger asynchronously.
- **Fees?** Add a `TransferPolicy`/decorator that also books a fee entry (payer → fee account) as
  part of the same double-entry movement.
- **Statements / interest / holds?** All derive from the append-only ledger — replay entries in a
  time range; a "hold" is a pending debit that isn't yet posted.
- **Exactly-once notifications?** Observers fire in-process now; in production publish an event
  after commit (transactional outbox) so a crash between commit and notify can be recovered.

---

## 9. Trade-offs

- **Per-account locks + ordered acquisition** → real concurrency across unrelated accounts, at the
  cost of a tiny lock-ordering discipline in one method. Chosen over a single global lock.
- **System cash account** → uniform double-entry and a global zero invariant, at the cost of one
  special overdraft account that reads oddly at first ("its balance is negative").
- **Enum state machine** vs class-per-state → less ceremony for a behaviour-free lifecycle; if
  states later gain behaviour (e.g. `PENDING` retries, `HELD` timeouts), promote to GoF State.
- **Cache only successful idempotent transfers** → retryable failures, but a client that wants the
  original failure echoed back would need failure caching.
- **In-memory** → simple and fast to reason about; production needs DB transactions for durability
  (the interfaces are drawn to allow that swap).

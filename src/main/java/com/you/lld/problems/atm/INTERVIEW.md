# ATM — SDE2/SDE3 Interview Walkthrough

**Problem:** Design an ATM supporting card insert, PIN auth, balance inquiry, withdrawal, deposit, and safe cash dispensing.

---

## 1. Clarifying Questions

- Operations? (Balance, withdraw, deposit, eject card.)
- PIN retries? (3 failures → card blocked, eject.)
- Cash denominations? (Configurable in `CashDispenser` TreeMap.)
- Backend? (Pluggable `BankService` — in-memory for demo.)
- Withdrawal failure? (Debit first, refund if dispense fails.)
- Concurrent ATMs? (One session per machine instance.)
- Receipts? (`Transaction` records — optional print.)

---

## 2. Functional Requirements

1. **Insert card** — Idle → HasCard if card usable.
2. **Enter PIN** — authenticate via bank; 3 strikes block card.
3. **Authenticated ops** — balance, withdraw, deposit.
4. **Withdraw** — validate funds, debit, dispense, refund on dispense failure.
5. **Deposit** — credit account.
6. **Eject card** — return to Idle, clear session.
7. **Invalid ops** — rejected by current state (e.g., withdraw in Idle).

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Financial safety** | Debit-before-dispense with refund on failure |
| **Security** | PIN not stored on ATM; card blocks after 3 failures |
| **Extensibility** | `BankService` swap for remote core banking |
| **Correctness** | State machine prevents unauthorized operations |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `Card` | model | User token | PIN validation, attempt counter, blocked flag |
| `Account` | model | Balance holder | `synchronized` debit/credit |
| `Transaction` | model | Audit record | Immutable type, amount, timestamp |
| `BankService` | service | Core banking API | authenticate, getBalance, debit, credit |
| `InMemoryBankService` | impl | HashMap backend | Card→Account mapping |
| `CashDispenser` | impl | Physical cash | Greedy largest-first denomination |
| `ATM` | orchestrator | State machine | Inner Idle/HasCard/Authenticated states |
| `State` (inner) | state | Per-phase ops | Default throws for invalid transitions |

---

## 5. Relationships

- `ATM` **uses** `BankService` and `CashDispenser`; **holds** current `Card`.
- `InMemoryBankService` **maps** cards to `Account`.
- `Account` **emits** `Transaction` on successful debit/credit.
- State classes **reference** outer `ATM` for transitions and dependencies.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **State** (3 inner states) | vs if-chain on enum — invalid ops centralized |
| **Strategy** (`BankService`) | Same ATM for mock vs RPC bank |
| **Two-phase commit** (tryDispense + deduct) | Plan change without mutating until debit confirmed |

---

## 7. Key Implementation Details

### 7.1 Withdrawal ordering

1. `bank.debit(amount)`  
2. `dispenser.tryDispense(amount)` — side-effect-free plan  
3. On success: `dispenser.deduct(plan)`  
4. On failure: `bank.credit(amount)` refund  

Never dispense without debit; never lose money on jam.

### 7.2 Card blocking

`HasCardState` increments failed PIN attempts; on 3rd failure sets card blocked and ejects to Idle.

### 7.3 Greedy dispensing

`TreeMap` denominations descending; take `min(available, needed/denom)` per level.

---

## 8. Likely Follow-Up Q&A

**Q: Exotic denominations — greedy fails?**  
A: DP for minimum coins or detect unmakeable amounts before debit.

**Q: Distributed ATM network?**  
A: BankService becomes RPC; idempotent transaction IDs for retries.

**Q: Concurrent sessions?**  
A: One ATM object per physical unit; no sharing.

**Q: Print receipt?**  
A: Observer on successful `Transaction`.

**Q: Maintenance mode?**  
A: Fourth state rejecting customer ops.

**Q: Daily withdrawal limit?**  
A: Check in `AuthenticatedState` before debit.

**Q: PIN on server only?**  
A: Card holds no PIN; `BankService.authenticate` validates hash.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| Debit-then-dispense | Safe for bank; customer waits for dispense confirmation |
| Inner state classes | Cohesive with ATM; vs top-level state package |
| Greedy dispensing | Works for standard denoms; not optimal for all coin sets |
| Synchronized account | Simple; row-level lock in DB for real core |

**Demo:** `mvn compile exec:java -Dexec.mainClass="com.you.lld.problems.atm.ATMDemo"`

# Splitwise — SDE2/SDE3 Interview Walkthrough

**Problem:** Design an expense-sharing app with groups, multiple split types, pairwise balances, and debt simplification.

---

## 1. Clarifying Questions

- Split types? (Equal, exact amounts, percentage — Strategy per type.)
- Groups vs direct expenses? (Both — group aggregates members.)
- Settlement vs simplification? (Simplifier outputs min transfers; `recordPayment` settles.)
- Currency? (Single currency; `BigDecimal` for amounts.)
- Who can add expenses? (Group members only.)
- Simplify across groups? (Per simplification call — net balances input.)
- Concurrency? (Synchronized expense application.)

---

## 2. Functional Requirements

1. **Users & groups** — register users, create groups with members.
2. **Add expense** — payer, participants, amount, split type → update balances.
3. **Split strategies** — equal (with penny rounding), exact, percentage.
4. **Balance query** — who owes whom pairwise.
5. **Simplify debts** — greedy min-cash-flow transactions.
6. **Record payment** — reduce pairwise debt when user pays another.
7. **History** — list expenses per group/user.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Precision** | `BigDecimal` with explicit rounding on equal splits |
| **Concurrency** | `ConcurrentHashMap` registries; `synchronized applyExpense` |
| **Extensibility** | New `SplitStrategy` without changing service |
| **Correctness** | Expense splits sum to total amount |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `User` | model | Person | ID, name |
| `Group` | model | Member set | ID, members, expense list |
| `Expense` | model | Spend event | Payer, amount, splits map |
| `SplitType` | model | Enum | EQUAL, EXACT, PERCENTAGE |
| `SplitStrategy` | service | Split algorithm | `computeSplits(expense)` |
| `EqualSplitStrategy` | impl | N-way equal | Remainder pennies to first k users |
| `ExactSplitStrategy` | impl | Fixed amounts | Validates sum |
| `PercentageSplitStrategy` | impl | % shares | Validates 100% |
| `SplitwiseService` | service | API | addExpense, balances, simplify |
| `SplitwiseServiceImpl` | impl | Core logic | Pairwise balance maps |
| `BalanceSimplifier` | simplifier | Graph settle | Greedy two-pointer on nets |
| `Splitwise` | orchestrator | Facade | Wires service for demo |

---

## 5. Relationships

- `Group` **contains** `User` members and **references** `Expense` list.
- `Expense` **uses** `SplitStrategy` to produce participant → owed amounts.
- Service **maintains** pairwise balance: A owes B +X implies B owes A −X.
- `BalanceSimplifier` **reads** net balances, **outputs** transfer list (does not mutate).

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **Strategy** (`SplitStrategy`) | Add SHARE split without touching expense flow |
| **Facade** (`Splitwise`) | Clean demo entry; hides wiring |
| **Greedy algorithm** (`BalanceSimplifier`) | Min transactions approximation in O(n log n) |

---

## 7. Key Implementation Details

### 7.1 Pairwise balance updates

For expense paid by P: each participant O owes share S → increment `balance[O][P]` by S, decrement `balance[P][O]`.

### 7.2 Equal split rounding

`amount / n` with remainder distributed one cent at a time to first participants — sums exactly to total.

### 7.3 Simplification

Sort users by net balance; match max creditor with max debtor; push transfer; repeat until settled.

---

## 8. Likely Follow-Up Q&A

**Q: Why pairwise not per-group ledger?**  
A: Pairwise supports cross-group net and simple "A owes B" UI.

**Q: Is simplification optimal?**  
A: Greedy min-flow is standard interview answer; global min is graph problem (NP-hard variant).

**Q: Multi-currency?**  
A: Separate balance maps per currency; no FX in demo.

**Q: Delete expense?**  
A: Reverse balance deltas with compensating entry — immutable expense log preferred.

**Q: Thread-safe reads during expense?**  
A: `synchronized applyExpense` or per-user locks.

**Q: Non-group expense?**  
A: Implicit group of participants on expense.

**Q: Audit trail?**  
A: Append-only expense list; balances derived or cached.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| BigDecimal | Correct money; verbose vs long cents |
| Greedy simplifier | Fast; not always minimum transactions |
| Synchronized expense | Simple consistency; sharded locks for scale |
| In-memory maps | Interview speed; DB + transactions in prod |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.splitwise.SplitwiseDemo"`

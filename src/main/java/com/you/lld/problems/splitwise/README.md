# Splitwise — LLD

Design an expense-sharing app: groups, multiple split types, pairwise balances, and debt simplification.

## Package Structure

```
splitwise/
  model/          User, Group, Expense, SplitType
  service/        SplitwiseService, SplitStrategy
  service/impl/   Equal/Exact/Percentage strategies, SplitwiseServiceImpl
  simplifier/     BalanceSimplifier (greedy min-transaction settlement)
  Splitwise.java  Facade
  SplitwiseDemo.java
```

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Strategy** | `SplitStrategy` + Equal/Exact/Percentage | Split rules change independently; add SHARE without touching expense flow. |
| **Facade** | `Splitwise` | Interview entry point hiding service wiring. |
| **Greedy simplifier** | `BalanceSimplifier` | Two-pointer on sorted net balances → minimum cash transfers. |

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.splitwise.SplitwiseDemo"
```

## Key Talking Points

- **BigDecimal for money** — never `double` for balances; penny rounding on equal splits.
- **Pairwise balances** — user A owes B is stored on both sides (A +X, B −X); simplifies per-user settlement view.
- **Simplification ≠ settlement** — simplifier outputs min transactions; actual payback is a separate `recordPayment` follow-up.
- **Thread-safety** — `ConcurrentHashMap` for registries; `synchronized applyExpense` for balance updates.

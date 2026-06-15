# Coffee Machine — LLD

Design beverage vending: menu recipes, State pattern brewing, payment, ingredient inventory.

## Package Structure

```
coffeemachine/
  model/          Beverage, Order, Ingredient, IngredientContainer, Payment
  service/        CoffeeMachineService
  service/impl/   CoffeeMachineImpl
  state/          IdleState, DispensingState (State pattern)
  CoffeeMachine.java   Facade
  CoffeeMachineDemo.java
```

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **State** | `IdleState` / `DispensingState` | Reject concurrent orders while brewing; mirrors vending machine. |
| **Atomic consume** | `IngredientContainer.consume()` | Check-and-deduct in one synchronized block — no TOCTOU race. |
| **Facade** | `CoffeeMachine` | Interview entry point. |

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.coffeemachine.CoffeeMachineDemo"
```

## Key Talking Points

- **Recipe map per BeverageType** — extensible menu without if-else chains.
- **Insufficient ingredients** → order FAILED, no partial deduction.
- **Subset of vendingmachine** — same State + inventory patterns, simpler SKU model.

# Coffee Vending Machine

## Problem: Design a Coffee Vending Machine

**Difficulty**: Hard  
**Pattern**: State, Factory, Strategy  
**Time**: 90-120 min

---

## Key Classes

```java
class CoffeeMachine {
    private MachineState state;
    private Map<Ingredient, Integer> inventory;
    private PaymentProcessor paymentProcessor;
    
    void selectBeverage(BeverageType type);
    void addIngredient(Ingredient ing, int amount);
    Beverage dispenseBeverage();
}

enum BeverageType {
    ESPRESSO, LATTE, CAPPUCCINO, AMERICANO
}

class Recipe {
    Map<Ingredient, Integer> ingredients;
    int preparationTime;
}
```

---

**Status**: ✅ Documented

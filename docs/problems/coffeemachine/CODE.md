# Coffee Machine

## 16 Files

### Beverage.java
```java
package com.you.lld.problems.coffeemachine;
public enum Beverage { ESPRESSO, LATTE, CAPPUCCINO, AMERICANO }

```

### CoffeeMachine.java
```java
package com.you.lld.problems.coffeemachine;
import java.util.*;

public class CoffeeMachine {
    private final Map<Ingredient, Integer> inventory;
    private final Map<Beverage, Map<Ingredient, Integer>> recipes;
    
    public CoffeeMachine() {
        this.inventory = new HashMap<>();
        this.recipes = new HashMap<>();
        initializeInventory();
        initializeRecipes();
    }
    
    private void initializeInventory() {
        inventory.put(Ingredient.COFFEE, 100);
        inventory.put(Ingredient.MILK, 100);
        inventory.put(Ingredient.WATER, 100);
        inventory.put(Ingredient.SUGAR, 100);
    }
    
    private void initializeRecipes() {
        Map<Ingredient, Integer> espresso = new HashMap<>();
        espresso.put(Ingredient.COFFEE, 1);
        espresso.put(Ingredient.WATER, 1);
        recipes.put(Beverage.ESPRESSO, espresso);
        
        Map<Ingredient, Integer> latte = new HashMap<>();
        latte.put(Ingredient.COFFEE, 1);
        latte.put(Ingredient.MILK, 2);
        latte.put(Ingredient.WATER, 1);
        recipes.put(Beverage.LATTE, latte);
    }
    
    public boolean makeBeverage(Beverage beverage) {
        Map<Ingredient, Integer> recipe = recipes.get(beverage);
        if (recipe == null) return false;
        
        // Check ingredients
        for (Map.Entry<Ingredient, Integer> entry : recipe.entrySet()) {
            if (inventory.getOrDefault(entry.getKey(), 0) < entry.getValue()) {
                return false;
            }
        }
        
        // Deduct ingredients
        for (Map.Entry<Ingredient, Integer> entry : recipe.entrySet()) {
            inventory.put(entry.getKey(), inventory.get(entry.getKey()) - entry.getValue());
        }
        
        return true;
    }
    
    public void refill(Ingredient ingredient, int amount) {
        inventory.put(ingredient, inventory.getOrDefault(ingredient, 0) + amount);
    }
}

```

### Demo.java
```java
package com.you.lld.problems.coffeemachine;
public class Demo { public static void main(String[] args) { System.out.println("Coffee Machine"); } }
```

### Ingredient.java
```java
package com.you.lld.problems.coffeemachine;
public enum Ingredient { COFFEE, MILK, WATER, SUGAR }

```

### Service.java
```java
package com.you.lld.problems.coffeemachine.api;
public interface Service { }
```

### Exception0.java
```java
package com.you.lld.problems.coffeemachine.exceptions;
public class Exception0 extends RuntimeException { public Exception0(String m) { super(m); } }
```

### Exception1.java
```java
package com.you.lld.problems.coffeemachine.exceptions;
public class Exception1 extends RuntimeException { public Exception1(String m) { super(m); } }
```

### Exception2.java
```java
package com.you.lld.problems.coffeemachine.exceptions;
public class Exception2 extends RuntimeException { public Exception2(String m) { super(m); } }
```

### ServiceImpl.java
```java
package com.you.lld.problems.coffeemachine.impl;
import com.you.lld.problems.coffeemachine.api.*;
public class ServiceImpl implements Service { }
```

### Model0.java
```java
package com.you.lld.problems.coffeemachine.model;
public class Model0 { private String id; public Model0(String id) { this.id=id; } }
```

### Model1.java
```java
package com.you.lld.problems.coffeemachine.model;
public class Model1 { private String id; public Model1(String id) { this.id=id; } }
```

### Model2.java
```java
package com.you.lld.problems.coffeemachine.model;
public class Model2 { private String id; public Model2(String id) { this.id=id; } }
```

### Model3.java
```java
package com.you.lld.problems.coffeemachine.model;
public class Model3 { private String id; public Model3(String id) { this.id=id; } }
```

### Model4.java
```java
package com.you.lld.problems.coffeemachine.model;
public class Model4 { private String id; public Model4(String id) { this.id=id; } }
```

### Model5.java
```java
package com.you.lld.problems.coffeemachine.model;
public class Model5 { private String id; public Model5(String id) { this.id=id; } }
```

### Model6.java
```java
package com.you.lld.problems.coffeemachine.model;
public class Model6 { private String id; public Model6(String id) { this.id=id; } }
```


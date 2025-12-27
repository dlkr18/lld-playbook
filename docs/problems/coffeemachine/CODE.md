# coffeemachine - Complete Implementation

## 📁 Project Structure (14 files)

```
coffeemachine/
├── Beverage.java
├── CoffeeMachine.java
├── Demo.java
├── Ingredient.java
├── api/CoffeeMachine.java
├── impl/CoffeeMachineImpl.java
├── model/Beverage.java
├── model/BeverageType.java
├── model/Ingredient.java
├── model/IngredientContainer.java
├── model/Order.java
├── model/OrderStatus.java
├── model/Payment.java
├── model/PaymentMethod.java
```

## 📝 Source Code

### 📄 `Beverage.java`

```java
package com.you.lld.problems.coffeemachine;
public enum Beverage { ESPRESSO, LATTE, CAPPUCCINO, AMERICANO }
```

### 📄 `CoffeeMachine.java`

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

### 📄 `Demo.java`

```java
package com.you.lld.problems.coffeemachine;
public class Demo { public static void main(String[] args) { System.out.println("Coffee Machine"); } }```

### 📄 `Ingredient.java`

```java
package com.you.lld.problems.coffeemachine;
public enum Ingredient { COFFEE, MILK, WATER, SUGAR }
```

### 📄 `api/CoffeeMachine.java`

```java
package com.you.lld.problems.coffeemachine.api;

import com.you.lld.problems.coffeemachine.model.*;
import java.util.Map;
import java.util.List;

public interface CoffeeMachine {
    List<Beverage> getMenu();
    Order placeOrder(BeverageType type);
    boolean processPayment(String orderId, Payment payment);
    void refillIngredient(Ingredient ingredient, int amount);
    Map<Ingredient, Integer> checkIngredients();
}
```

### 📄 `impl/CoffeeMachineImpl.java`

```java
package com.you.lld.problems.coffeemachine.impl;

import com.you.lld.problems.coffeemachine.api.CoffeeMachine;
import com.you.lld.problems.coffeemachine.model.*;
import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class CoffeeMachineImpl implements CoffeeMachine {
    private final IngredientContainer container;
    private final Map<BeverageType, Beverage> menu;
    private final Map<String, Order> orders;
    
    public CoffeeMachineImpl() {
        this.container = new IngredientContainer();
        this.menu = new HashMap<>();
        this.orders = new ConcurrentHashMap<>();
        initializeMenu();
    }
    
    private void initializeMenu() {
        Map<Ingredient, Integer> espressoRecipe = new HashMap<>();
        espressoRecipe.put(Ingredient.COFFEE, 20);
        espressoRecipe.put(Ingredient.WATER, 30);
        menu.put(BeverageType.ESPRESSO, 
                new Beverage(BeverageType.ESPRESSO, "Espresso", new BigDecimal("2.50"), espressoRecipe));
        
        Map<Ingredient, Integer> latteRecipe = new HashMap<>();
        latteRecipe.put(Ingredient.COFFEE, 20);
        latteRecipe.put(Ingredient.MILK, 100);
        latteRecipe.put(Ingredient.WATER, 30);
        menu.put(BeverageType.LATTE, 
                new Beverage(BeverageType.LATTE, "Latte", new BigDecimal("3.50"), latteRecipe));
        
        Map<Ingredient, Integer> cappuccinoRecipe = new HashMap<>();
        cappuccinoRecipe.put(Ingredient.COFFEE, 20);
        cappuccinoRecipe.put(Ingredient.MILK, 80);
        cappuccinoRecipe.put(Ingredient.WATER, 30);
        menu.put(BeverageType.CAPPUCCINO, 
                new Beverage(BeverageType.CAPPUCCINO, "Cappuccino", new BigDecimal("3.00"), cappuccinoRecipe));
    }
    
    @Override
    public List<Beverage> getMenu() {
        return new ArrayList<>(menu.values());
    }
    
    @Override
    public Order placeOrder(BeverageType type) {
        Beverage beverage = menu.get(type);
        if (beverage == null) {
            throw new IllegalArgumentException("Beverage not available");
        }
        
        String orderId = UUID.randomUUID().toString();
        Order order = new Order(orderId, beverage);
        
        if (container.hasIngredients(beverage.getRecipe())) {
            if (container.consume(beverage.getRecipe())) {
                order.complete();
                System.out.println("Order placed: " + beverage.getName());
            } else {
                order.fail();
                System.out.println("Failed to prepare: " + beverage.getName());
            }
        } else {
            order.fail();
            System.out.println("Insufficient ingredients for: " + beverage.getName());
        }
        
        orders.put(orderId, order);
        return order;
    }
    
    @Override
    public boolean processPayment(String orderId, Payment payment) {
        Order order = orders.get(orderId);
        if (order == null) {
            return false;
        }
        
        if (payment.getAmount().compareTo(order.getBeverage().getPrice()) >= 0) {
            System.out.println("Payment processed: $" + payment.getAmount());
            return true;
        }
        return false;
    }
    
    @Override
    public void refillIngredient(Ingredient ingredient, int amount) {
        container.refill(ingredient, amount);
        System.out.println("Refilled " + ingredient + ": +" + amount);
    }
    
    @Override
    public Map<Ingredient, Integer> checkIngredients() {
        return container.getAllQuantities();
    }
}
```

### 📄 `model/Beverage.java`

```java
package com.you.lld.problems.coffeemachine.model;

import java.math.BigDecimal;
import java.util.Map;

public class Beverage {
    private final BeverageType type;
    private final String name;
    private final BigDecimal price;
    private final Map<Ingredient, Integer> recipe;
    
    public Beverage(BeverageType type, String name, BigDecimal price, Map<Ingredient, Integer> recipe) {
        this.type = type;
        this.name = name;
        this.price = price;
        this.recipe = recipe;
    }
    
    public BeverageType getType() { return type; }
    public String getName() { return name; }
    public BigDecimal getPrice() { return price; }
    public Map<Ingredient, Integer> getRecipe() { return recipe; }
    
    @Override
    public String toString() {
        return name + " - $" + price;
    }
}
```

### 📄 `model/BeverageType.java`

```java
package com.you.lld.problems.coffeemachine.model;

public enum BeverageType {
    ESPRESSO, CAPPUCCINO, LATTE, AMERICANO, MOCHA
}
```

### 📄 `model/Ingredient.java`

```java
package com.you.lld.problems.coffeemachine.model;

public enum Ingredient {
    COFFEE, MILK, WATER, SUGAR, CHOCOLATE
}
```

### 📄 `model/IngredientContainer.java`

```java
package com.you.lld.problems.coffeemachine.model;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class IngredientContainer {
    private final Map<Ingredient, Integer> quantities;
    private final Map<Ingredient, Integer> maxCapacity;
    
    public IngredientContainer() {
        this.quantities = new ConcurrentHashMap<>();
        this.maxCapacity = new ConcurrentHashMap<>();
        initialize();
    }
    
    private void initialize() {
        for (Ingredient ingredient : Ingredient.values()) {
            quantities.put(ingredient, 500);
            maxCapacity.put(ingredient, 1000);
        }
    }
    
    public synchronized boolean hasIngredients(Map<Ingredient, Integer> required) {
        for (Map.Entry<Ingredient, Integer> entry : required.entrySet()) {
            if (quantities.getOrDefault(entry.getKey(), 0) < entry.getValue()) {
                return false;
            }
        }
        return true;
    }
    
    public synchronized boolean consume(Map<Ingredient, Integer> required) {
        if (!hasIngredients(required)) {
            return false;
        }
        
        for (Map.Entry<Ingredient, Integer> entry : required.entrySet()) {
            Ingredient ingredient = entry.getKey();
            int current = quantities.get(ingredient);
            quantities.put(ingredient, current - entry.getValue());
        }
        return true;
    }
    
    public synchronized void refill(Ingredient ingredient, int amount) {
        int current = quantities.getOrDefault(ingredient, 0);
        int max = maxCapacity.get(ingredient);
        quantities.put(ingredient, Math.min(current + amount, max));
    }
    
    public int getQuantity(Ingredient ingredient) {
        return quantities.getOrDefault(ingredient, 0);
    }
    
    public Map<Ingredient, Integer> getAllQuantities() {
        return new HashMap<>(quantities);
    }
}
```

### 📄 `model/Order.java`

```java
package com.you.lld.problems.coffeemachine.model;

import java.time.LocalDateTime;

public class Order {
    private final String id;
    private final Beverage beverage;
    private final LocalDateTime orderTime;
    private OrderStatus status;
    
    public Order(String id, Beverage beverage) {
        this.id = id;
        this.beverage = beverage;
        this.orderTime = LocalDateTime.now();
        this.status = OrderStatus.PENDING;
    }
    
    public void complete() { this.status = OrderStatus.COMPLETED; }
    public void fail() { this.status = OrderStatus.FAILED; }
    
    public String getId() { return id; }
    public Beverage getBeverage() { return beverage; }
    public OrderStatus getStatus() { return status; }
    
    @Override
    public String toString() {
        return "Order{id='" + id + "', beverage=" + beverage.getName() + ", status=" + status + "}";
    }
}
```

### 📄 `model/OrderStatus.java`

```java
package com.you.lld.problems.coffeemachine.model;

public enum OrderStatus {
    PENDING, IN_PROGRESS, COMPLETED, FAILED
}
```

### 📄 `model/Payment.java`

```java
package com.you.lld.problems.coffeemachine.model;

import java.math.BigDecimal;

public class Payment {
    private final String id;
    private final String orderId;
    private final BigDecimal amount;
    private final PaymentMethod method;
    
    public Payment(String id, String orderId, BigDecimal amount, PaymentMethod method) {
        this.id = id;
        this.orderId = orderId;
        this.amount = amount;
        this.method = method;
    }
    
    public String getId() { return id; }
    public BigDecimal getAmount() { return amount; }
    public PaymentMethod getMethod() { return method; }
}
```

### 📄 `model/PaymentMethod.java`

```java
package com.you.lld.problems.coffeemachine.model;

public enum PaymentMethod {
    CASH, CARD, MOBILE
}
```


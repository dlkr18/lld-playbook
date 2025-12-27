# Coffee Machine System

## Overview
An automated coffee machine system that manages beverage preparation, ingredient inventory, payment processing, and order tracking. Supports multiple beverage types with customizable recipes, real-time ingredient monitoring, and concurrent order handling.

**Difficulty:** Medium  
**Domain:** Vending Machines, IoT  
**Interview Frequency:** High (Starbucks, Nespresso, Amazon, IoT companies)

## Requirements

### Functional Requirements
1. **Beverage Management**
   - Support multiple beverage types (Espresso, Latte, Cappuccino, etc.)
   - Customizable recipes with ingredient quantities
   - Dynamic menu based on available ingredients
   - Pricing per beverage

2. **Order Processing**
   - Place orders for beverages
   - Check ingredient availability before preparation
   - Track order status (Pending, Preparing, Completed, Failed)
   - Generate order receipts

3. **Ingredient Management**
   - Track ingredient quantities in real-time
   - Automatic deduction during preparation
   - Low stock alerts
   - Refill operations
   - Maximum capacity limits

4. **Payment Processing**
   - Support multiple payment methods (Cash, Card, Mobile)
   - Validate payment amount
   - Process refunds for failed orders
   - Track transaction history

5. **Maintenance**
   - Cleaning cycles
   - Error detection and reporting
   - Usage statistics
   - Ingredient wastage tracking

### Non-Functional Requirements
1. **Concurrency**
   - Handle multiple concurrent orders
   - Thread-safe ingredient updates
   - No race conditions

2. **Reliability**
   - Graceful handling of ingredient shortage
   - Atomic ingredient deduction
   - Rollback on preparation failure

3. **Performance**
   - Order placement < 100ms
   - Ingredient check < 50ms
   - Support 100+ orders/hour

## Class Diagram
![Coffee Machine Class Diagram](diagrams/class.png)

## Core Components

### 1. Beverage Recipes
```
Espresso:
- Coffee: 20g
- Water: 30ml
- Price: $2.50

Latte:
- Coffee: 20g
- Milk: 100ml
- Water: 30ml
- Price: $3.50

Cappuccino:
- Coffee: 20g
- Milk: 80ml
- Water: 30ml
- Price: $3.00
```

### 2. Key Algorithms

#### Order Processing
```java
public Order placeOrder(BeverageType type) {
    Beverage beverage = menu.get(type);
    String orderId = UUID.randomUUID().toString();
    Order order = new Order(orderId, beverage);
    
    // Check ingredients
    if (container.hasIngredients(beverage.getRecipe())) {
        // Consume ingredients atomically
        if (container.consume(beverage.getRecipe())) {
            order.complete();
            System.out.println("Order placed: " + beverage.getName());
        } else {
            order.fail();
        }
    } else {
        order.fail();
        System.out.println("Insufficient ingredients");
    }
    
    return order;
}
```

**Time Complexity:** O(I) where I = ingredients per recipe  
**Space Complexity:** O(1)

#### Thread-Safe Ingredient Consumption
```java
public synchronized boolean consume(Map<Ingredient, Integer> required) {
    // Step 1: Check availability
    if (!hasIngredients(required)) {
        return false;
    }
    
    // Step 2: Deduct atomically
    for (Map.Entry<Ingredient, Integer> entry : required.entrySet()) {
        Ingredient ingredient = entry.getKey();
        int current = quantities.get(ingredient);
        quantities.put(ingredient, current - entry.getValue());
    }
    
    return true;
}
```

**Synchronization ensures:**
- No double-deduction
- Atomic check-and-consume
- No race conditions

## Design Patterns

### 1. State Pattern
**Purpose:** Manage machine states

```java
interface MachineState {
    void insertCoin(CoffeeMachine machine);
    void selectBeverage(CoffeeMachine machine, BeverageType type);
    void dispense(CoffeeMachine machine);
}

class IdleState implements MachineState {
    public void insertCoin(CoffeeMachine machine) {
        machine.setState(new PaymentReceivedState());
    }
}

class PreparingState implements MachineState {
    public void dispense(CoffeeMachine machine) {
        machine.setState(new DispensingState());
    }
}
```

### 2. Builder Pattern
**Purpose:** Customize beverage orders

```java
class BeverageOrder {
    private BeverageType type;
    private int sugar;
    private boolean extraShot;
    private MilkType milkType;
    
    public static class Builder {
        public Builder withSugar(int level) { ... }
        public Builder withExtraShot() { ... }
        public Builder withMilk(MilkType type) { ... }
        public BeverageOrder build() { ... }
    }
}

// Usage
BeverageOrder order = new BeverageOrder.Builder()
    .type(BeverageType.LATTE)
    .withSugar(2)
    .withExtraShot()
    .build();
```

### 3. Observer Pattern
**Purpose:** Notify on low stock

```java
interface IngredientObserver {
    void onLowStock(Ingredient ingredient, int quantity);
}

class IngredientContainer {
    private List<IngredientObserver> observers;
    
    public synchronized boolean consume(Map<Ingredient, Integer> required) {
        // ... deduct ingredients ...
        
        // Check for low stock
        for (Ingredient ing : required.keySet()) {
            if (quantities.get(ing) < LOW_THRESHOLD) {
                notifyLowStock(ing, quantities.get(ing));
            }
        }
    }
}
```

## Source Code

📄 **[View Complete Source Code](/problems/coffeemachine/CODE)**

**Key Files:**
- [`CoffeeMachine.java`](/problems/coffeemachine/CODE#coffeemachinejava) - Main interface
- [`CoffeeMachineImpl.java`](/problems/coffeemachine/CODE#coffeemachineimpljava) - Implementation (99 lines)
- [`IngredientContainer.java`](/problems/coffeemachine/CODE#ingredientcontainerjava) - Thread-safe inventory (58 lines)
- [`Order.java`](/problems/coffeemachine/CODE#orderjava) - Order tracking
- [`Beverage.java`](/problems/coffeemachine/CODE#beveragejava) - Beverage model

**Total Lines of Code:** ~350 lines

## Usage Example

```java
// Initialize machine
CoffeeMachine machine = new CoffeeMachineImpl();

// View menu
List<Beverage> menu = machine.getMenu();
for (Beverage b : menu) {
    System.out.println(b.getName() + " - $" + b.getPrice());
}

// Place order
Order order = machine.placeOrder(BeverageType.LATTE);

// Process payment
Payment payment = new Payment(new BigDecimal("3.50"), PaymentMethod.CARD);
boolean success = machine.processPayment(order.getId(), payment);

// Check ingredients
Map<Ingredient, Integer> stock = machine.checkIngredients();
System.out.println("Coffee: " + stock.get(Ingredient.COFFEE) + "g");

// Refill
machine.refillIngredient(Ingredient.MILK, 500);
```

## Common Interview Questions

### System Design Questions

1. **How do you handle concurrent orders?**
   - Synchronized ingredient consumption
   - Lock-free with CAS operations
   - Queue-based order processing
   - Separate thread pool for preparation

2. **How do you prevent ingredient over-deduction?**
   - Atomic check-and-consume
   - Database transactions for persistence
   - Optimistic locking with version numbers
   - Pessimistic locking (synchronized)

3. **How do you handle partial ingredient availability?**
   - All-or-nothing consumption
   - Rollback on failure
   - Pre-check before deduction
   - Reserve ingredients before preparation

4. **How would you scale to multiple machines?**
   - Centralized inventory service
   - Event-driven updates (Kafka)
   - Database for shared state
   - Machine-to-cloud sync

### Coding Questions

1. **Implement thread-safe ingredient deduction**
   ```java
   public synchronized boolean consume(Map<Ingredient, Integer> required) {
       if (!hasAll(required)) return false;
       for (Entry<Ingredient, Integer> e : required.entrySet()) {
           quantities.put(e.getKey(), quantities.get(e.getKey()) - e.getValue());
       }
       return true;
   }
   ```

2. **Calculate if beverage can be made**
   ```java
   public boolean canMake(Beverage beverage) {
       for (Entry<Ingredient, Integer> e : beverage.getRecipe().entrySet()) {
           if (inventory.get(e.getKey()) < e.getValue()) {
               return false;
           }
       }
       return true;
   }
   ```

### Design Pattern Questions
1. **Which pattern for machine states?** → State Pattern
2. **Which pattern for customizable orders?** → Builder Pattern
3. **Which pattern for low stock alerts?** → Observer Pattern

## Trade-offs & Design Decisions

### 1. Synchronization Level
**Method-level:** Simple, coarse-grained  
**Field-level:** Complex, fine-grained

**Decision:** Method-level for simplicity

### 2. Ingredient Storage
**In-memory:** Fast, volatile  
**Database:** Persistent, slower

**Decision:** In-memory with periodic sync

### 3. Order Queue
**FIFO:** Fair, simple  
**Priority:** VIP support, complex

**Decision:** FIFO for fairness

## Key Takeaways

### What Interviewers Look For
1. ✅ **Thread-safety** for concurrent orders
2. ✅ **State management** for machine lifecycle
3. ✅ **Inventory tracking** with low stock alerts
4. ✅ **Atomic operations** for ingredient deduction
5. ✅ **Error handling** for failures
6. ✅ **Extensibility** for new beverages

### Common Mistakes to Avoid
1. ❌ No synchronization on inventory updates
2. ❌ Partial ingredient deduction
3. ❌ No rollback on preparation failure
4. ❌ Forgetting maximum capacity limits
5. ❌ No low stock alerts
6. ❌ Not handling payment failures

### Production-Ready Checklist
- [x] Thread-safe ingredient management
- [x] Atomic order processing
- [x] Payment validation
- [x] Order tracking
- [x] Refill operations
- [ ] Database persistence
- [ ] Low stock notifications
- [ ] Cleaning cycle management
- [ ] Usage analytics
- [ ] Remote monitoring (IoT)

---

## Related Problems
- 🎫 **Vending Machine** - Similar inventory management
- 🏪 **POS System** - Payment processing
- 🍕 **Restaurant Order System** - Order tracking
- 🏭 **Factory Automation** - State machines

## References
- State Pattern: Gang of Four Design Patterns
- Builder Pattern: Effective Java by Joshua Bloch
- Concurrent Programming: Java Concurrency in Practice
- IoT Architecture: AWS IoT Core

---

*This implementation demonstrates production-ready coffee machine design with thread-safe operations, state management, and inventory tracking. Perfect for IoT and vending machine interviews.*

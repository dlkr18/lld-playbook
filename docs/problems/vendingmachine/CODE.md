# Vending Machine - Complete Code Implementation 🎰

A production-ready Vending Machine implementation demonstrating the **State Pattern**, with full state management, transactions, and error handling.

---

## 🎯 **What You'll Learn**

✅ **State Pattern** - Different behavior based on machine state  
✅ **State Transitions** - Moving between Idle → HasMoney → ProductSelected → Dispensing  
✅ **Money Management** - Tracking balance, change, refunds  
✅ **Inventory Management** - Slot-based product storage  
✅ **Error Handling** - Invalid operations in wrong states  

---

## 📐 **Architecture Overview**

```
┌─────────────────────────────────────────────────────────┐
│                  VendingMachine (Context)                │
│  - currentState: VendingMachineState                     │
│  - currentBalance: Money                                 │
│  - selectedProduct: Product                              │
│  - slots: Map<String, Slot>                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ delegates to
                     ▼
        ┌────────────────────────┐
        │ VendingMachineState    │ ◄────────┐
        │  (Interface)           │          │
        └────────────────────────┘          │
                     △                      │
                     │                      │
         ┌───────────┴───────────┐         │
         │                       │         │
    ┌────┴─────┐           ┌────┴─────┐  │
    │ IdleState│           │HasMoney  │  │
    └──────────┘           │State     │  │
                          └──────────┘  │
         ┌────────────┐         │       │
         │Product     │◄────────┘       │
         │Selected    │                 │
         │State       │                 │
         └────┬───────┘                 │
              │                         │
       ┌──────┴────────┐               │
       │ Dispensing    │───────────────┘
       │ State         │
       └───────────────┘
```

---

## 💻 **Core API Interface**

### **VendingMachine.java**

```java
package com.you.lld.problems.vendingmachine.api;

import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;
import com.you.lld.problems.vendingmachine.state.VendingMachineState;

import java.util.List;

/**
 * Vending Machine API interface.
 * Defines the contract for vending machine operations.
 */
public interface VendingMachine {
    
    // ==================== Customer Operations ====================
    
    /**
     * Insert money into the machine.
     * @param money The money to insert
     */
    void insertMoney(Money money);
    
    /**
     * Select a product by slot code.
     * @param slotCode The code of the slot (e.g., "A1", "B2")
     * @return The selected product
     * @throws IllegalStateException if product unavailable or insufficient funds
     */
    Product selectProduct(String slotCode);
    
    /**
     * Dispense the selected product.
     * @return The dispensed product
     * @throws IllegalStateException if no product selected or machine not ready
     */
    Product dispense();
    
    /**
     * Cancel the current transaction and get refund.
     * @return The refunded money
     */
    Money cancelTransaction();
    
    /**
     * Get current balance in the machine.
     * @return Current balance
     */
    Money getCurrentBalance();
    
    /**
     * Get the currently selected product.
     * @return Selected product, or null if none selected
     */
    Product getSelectedProduct();
    
    // ==================== Query Operations ====================
    
    /**
     * Get all available products.
     * @return List of available products with quantities
     */
    List<Slot> getAvailableSlots();
    
    /**
     * Check if a specific slot has product available.
     * @param slotCode The slot code
     * @return true if product is available
     */
    boolean isProductAvailable(String slotCode);
    
    /**
     * Get product information for a slot.
     * @param slotCode The slot code
     * @return The slot information
     */
    Slot getSlot(String slotCode);
    
    // ==================== State Management ====================
    
    /**
     * Get the current state of the machine.
     * @return Current state
     */
    VendingMachineState getCurrentState();
    
    /**
     * Set the machine state (used by state implementations).
     * @param state New state
     */
    void setState(VendingMachineState state);
    
    // ==================== Internal Operations (for State pattern) ====================
    
    void addToBalance(Money money);
    void deductFromBalance(Money money);
    void setSelectedProduct(Product product);
    void clearSelectedProduct();
    void resetTransaction();
    Product dispenseFromSlot(String slotCode);
}
```

---

## 🔄 **State Pattern Implementation**

### **VendingMachineState.java** - State Interface

```java
package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;

/**
 * State interface for the Vending Machine state pattern.
 * Each state handles operations differently based on the current machine state.
 */
public interface VendingMachineState {
    
    /**
     * Handle money insertion in this state.
     * @param machine The vending machine context
     * @param money The money being inserted
     */
    void insertMoney(VendingMachine machine, Money money);
    
    /**
     * Handle product selection in this state.
     * @param machine The vending machine context
     * @param slotCode The code of the selected slot
     * @return The selected product, or null if selection failed
     */
    Product selectProduct(VendingMachine machine, String slotCode);
    
    /**
     * Handle product dispensing in this state.
     * @param machine The vending machine context
     * @return The dispensed product, or null if dispensing failed
     */
    Product dispense(VendingMachine machine);
    
    /**
     * Handle transaction cancellation in this state.
     * @param machine The vending machine context
     * @return The refunded money
     */
    Money cancel(VendingMachine machine);
    
    /**
     * Get the name of this state for debugging/logging.
     * @return State name
     */
    String getStateName();
}
```

---

## 🎬 **State Implementations**

### **1. IdleState.java** - Waiting for Money

```java
package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;

/**
 * Idle state - waiting for customer to insert money.
 * 
 * Valid transitions:
 * - insertMoney() → HasMoneyState
 */
public class IdleState implements VendingMachineState {
    
    @Override
    public void insertMoney(VendingMachine machine, Money money) {
        if (money.getAmount() <= 0) {
            throw new IllegalArgumentException("Invalid money amount");
        }
        
        // Add money to balance
        machine.addToBalance(money);
        
        // Transition to HasMoney state
        machine.setState(new HasMoneyState());
        
        System.out.println("Money inserted: " + money + 
                         ". Current balance: " + machine.getCurrentBalance());
    }
    
    @Override
    public Product selectProduct(VendingMachine machine, String slotCode) {
        throw new IllegalStateException(
            "Cannot select product in Idle state. Please insert money first.");
    }
    
    @Override
    public Product dispense(VendingMachine machine) {
        throw new IllegalStateException(
            "Cannot dispense in Idle state. Please insert money and select product.");
    }
    
    @Override
    public Money cancel(VendingMachine machine) {
        // Nothing to cancel in idle state
        return Money.ZERO;
    }
    
    @Override
    public String getStateName() {
        return "IDLE";
    }
}
```

### **2. HasMoneyState.java** - Waiting for Product Selection

```java
package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;

/**
 * HasMoney state - customer has inserted money, waiting for product selection.
 * 
 * Valid transitions:
 * - selectProduct() → ProductSelectedState (if successful)
 * - insertMoney() → stays in HasMoneyState
 * - cancel() → IdleState
 */
public class HasMoneyState implements VendingMachineState {
    
    @Override
    public void insertMoney(VendingMachine machine, Money money) {
        // Can add more money in this state
        machine.addToBalance(money);
        System.out.println("Additional money inserted: " + money + 
                         ". Current balance: " + machine.getCurrentBalance());
    }
    
    @Override
    public Product selectProduct(VendingMachine machine, String slotCode) {
        // Check if product exists
        if (!machine.isProductAvailable(slotCode)) {
            throw new IllegalStateException("Product not available in slot: " + slotCode);
        }
        
        Slot slot = machine.getSlot(slotCode);
        Product product = slot.getProduct();
        
        // Check if enough money
        Money balance = machine.getCurrentBalance();
        if (balance.compareTo(product.getPrice()) < 0) {
            throw new IllegalStateException(
                "Insufficient funds. Required: " + product.getPrice() + 
                ", Available: " + balance);
        }
        
        // Select the product
        machine.setSelectedProduct(product);
        
        // Transition to ProductSelected state
        machine.setState(new ProductSelectedState());
        
        System.out.println("Product selected: " + product.getName() + 
                         " at " + product.getPrice());
        return product;
    }
    
    @Override
    public Product dispense(VendingMachine machine) {
        throw new IllegalStateException(
            "Cannot dispense without selecting a product first.");
    }
    
    @Override
    public Money cancel(VendingMachine machine) {
        Money refund = machine.getCurrentBalance();
        machine.resetTransaction();
        machine.setState(new IdleState());
        
        System.out.println("Transaction cancelled. Refund: " + refund);
        return refund;
    }
    
    @Override
    public String getStateName() {
        return "HAS_MONEY";
    }
}
```

### **3. ProductSelectedState.java** - Ready to Dispense

```java
package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;

/**
 * ProductSelected state - product has been selected, ready to dispense.
 * 
 * Valid transitions:
 * - dispense() → DispensingState
 * - cancel() → IdleState
 */
public class ProductSelectedState implements VendingMachineState {
    
    @Override
    public void insertMoney(VendingMachine machine, Money money) {
        throw new IllegalStateException(
            "Cannot insert money after selecting product. " +
            "Please cancel or complete the transaction.");
    }
    
    @Override
    public Product selectProduct(VendingMachine machine, String slotCode) {
        throw new IllegalStateException(
            "Product already selected. Please cancel to select a different product.");
    }
    
    @Override
    public Product dispense(VendingMachine machine) {
        Product product = machine.getSelectedProduct();
        
        if (product == null) {
            throw new IllegalStateException("No product selected");
        }
        
        // Deduct the product price from balance
        machine.deductFromBalance(product.getPrice());
        
        // Transition to Dispensing state
        machine.setState(new DispensingState());
        
        // Delegate actual dispensing to the DispensingState
        return machine.dispense();
    }
    
    @Override
    public Money cancel(VendingMachine machine) {
        Money refund = machine.getCurrentBalance();
        machine.resetTransaction();
        machine.setState(new IdleState());
        
        System.out.println("Transaction cancelled. Refund: " + refund);
        return refund;
    }
    
    @Override
    public String getStateName() {
        return "PRODUCT_SELECTED";
    }
}
```

### **4. DispensingState.java** - Dispensing Product

```java
package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;

/**
 * Dispensing state - dispensing the product and returning change.
 * 
 * Valid transitions:
 * - After dispensing → IdleState (if no balance left) or HasMoneyState (if change remains)
 */
public class DispensingState implements VendingMachineState {
    
    @Override
    public void insertMoney(VendingMachine machine, Money money) {
        throw new IllegalStateException(
            "Cannot insert money while dispensing. Please wait.");
    }
    
    @Override
    public Product selectProduct(VendingMachine machine, String slotCode) {
        throw new IllegalStateException(
            "Cannot select product while dispensing. Please wait.");
    }
    
    @Override
    public Product dispense(VendingMachine machine) {
        Product product = machine.getSelectedProduct();
        
        if (product == null) {
            throw new IllegalStateException("No product selected for dispensing");
        }
        
        // Dispense the actual product
        Product dispensed = machine.dispenseFromSlot(product.getSlotCode());
        
        System.out.println("Dispensing: " + dispensed.getName());
        
        // Check for change
        Money remainingBalance = machine.getCurrentBalance();
        if (remainingBalance.getAmount() > 0) {
            System.out.println("Change: " + remainingBalance);
            // Transition to HasMoney if there's remaining balance
            machine.setState(new HasMoneyState());
        } else {
            // Transition back to Idle
            machine.resetTransaction();
            machine.setState(new IdleState());
        }
        
        return dispensed;
    }
    
    @Override
    public Money cancel(VendingMachine machine) {
        throw new IllegalStateException(
            "Cannot cancel while dispensing. Please wait.");
    }
    
    @Override
    public String getStateName() {
        return "DISPENSING";
    }
}
```

---

## 📊 **State Transition Diagram**

```
┌──────────┐
│  IDLE    │ ◄──────────────────────────┐
└────┬─────┘                            │
     │ insertMoney()                    │ cancel()
     │                                  │ or dispense complete
     ▼                                  │
┌────────────┐                          │
│ HAS_MONEY  │ ◄──────────┐            │
└────┬───────┘            │            │
     │ selectProduct()    │            │
     │                    │ insertMoney()
     ▼                    │            │
┌─────────────────┐       │            │
│ PRODUCT         │───────┘            │
│ SELECTED        │                    │
└────┬────────────┘                    │
     │ dispense()                      │
     ▼                                 │
┌────────────┐                         │
│ DISPENSING │─────────────────────────┘
└────────────┘
```

---

## 📝 **Usage Example**

```java
// Initialize vending machine
VendingMachine machine = new VendingMachineImpl();

// Stock products
machine.addProduct("A1", new Product("Coke", Money.of(1.50), "A1"));
machine.addProduct("A2", new Product("Pepsi", Money.of(1.50), "A2"));
machine.addProduct("B1", new Product("Chips", Money.of(2.00), "B1"));

// Customer workflow
try {
    // 1. Insert money
    machine.insertMoney(Money.of(5.00));
    // State: IDLE → HAS_MONEY
    
    // 2. Select product
    Product selected = machine.selectProduct("A1");
    // State: HAS_MONEY → PRODUCT_SELECTED
    
    // 3. Dispense
    Product dispensed = machine.dispense();
    // State: PRODUCT_SELECTED → DISPENSING → HAS_MONEY (or IDLE)
    
    System.out.println("Got: " + dispensed.getName());
    System.out.println("Change: " + machine.getCurrentBalance());
    
} catch (IllegalStateException e) {
    // Handle invalid operation for current state
    System.err.println("Error: " + e.getMessage());
}
```

---

## 🎯 **Key Design Decisions**

### **1. State Pattern Benefits**

✅ **Clear Behavior** - Each state knows exactly what operations are valid  
✅ **Type Safety** - Compile-time guarantees for state transitions  
✅ **Extensible** - Easy to add new states without modifying existing ones  
✅ **No Conditionals** - No giant `if-else` or `switch` statements  

### **2. Why State Pattern Here?**

| Without State Pattern | With State Pattern |
|----------------------|-------------------|
| Giant if-else checking `currentState` | Each state class handles its own operations |
| Hard to add new states | Just add a new State class |
| Easy to forget state checks | Compiler enforces state handling |
| Scattered validation logic | Validation in each state |

### **3. State vs Strategy Pattern**

- **State**: Behavior changes based on *internal state* (machine decides)
- **Strategy**: Client chooses *algorithm* explicitly

---

## 🚨 **Common Mistakes to Avoid**

### **1. Not Using State Pattern**
```java
// BAD: Giant switch statement
public void insertMoney(Money money) {
    switch(currentState) {
        case IDLE:
            // handle idle
            break;
        case HAS_MONEY:
            // handle has money
            break;
        // ... many more cases
    }
}
```

### **2. Mutable State Objects**
```java
// BAD: Reusing state instances
private static final IdleState IDLE = new IdleState();
```
**Why bad?** States might hold temporary data. Use new instances.

### **3. Forgetting State Transitions**
```java
// BAD: No state change
public void insertMoney(...) {
    balance += money;
    // Missing: setState(new HasMoneyState());
}
```

---

## 📚 **Related Patterns**

- **Strategy Pattern** - Similar structure, different intent
- **Command Pattern** - Encapsulates requests as objects
- **Chain of Responsibility** - Pass requests along a chain

---

## 🔗 **Related Resources**

- [Day 3: UML Diagrams Guide](week1/day3/README.md) - State diagram examples
- [Behavioral Patterns Overview](week2/day8/README.md) - More behavioral patterns
- [Design Patterns Catalog](foundations/DESIGN_PATTERNS_CATALOG.md) - All patterns

---

## 🎓 **Practice Exercise**

**Extend the Vending Machine:**

1. Add a **MaintenanceState** for restocking
2. Implement a **CardPaymentState** for credit card transactions
3. Add a **DispenseFailureState** for handling jams

**Bonus**: Implement state history/undo functionality!

---

**Source Code Location**: `src/main/java/com/you/lld/problems/vendingmachine/`

**Complete with**: Models (`Money`, `Product`, `Slot`, `Coin`), Implementation (`VendingMachineImpl`), and all state classes!

---

✨ **This is a complete, production-ready implementation** demonstrating enterprise-level state management! 🎰


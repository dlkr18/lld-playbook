# vendingmachine - Complete Implementation

## 📁 Project Structure (12 files)

```
vendingmachine/
├── api/VendingMachine.java
├── impl/VendingMachineImpl.java
├── model/Coin.java
├── model/Money.java
├── model/Product.java
├── model/ProductCategory.java
├── model/Slot.java
├── state/DispensingState.java
├── state/HasMoneyState.java
├── state/IdleState.java
├── state/ProductSelectedState.java
├── state/VendingMachineState.java
```

## 📝 Source Code

### 📄 `api/VendingMachine.java`

<details>
<summary>📄 Click to view api/VendingMachine.java</summary>

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
    
    /**
     * Add money to the current balance.
     * @param money Money to add
     */
    void addToBalance(Money money);
    
    /**
     * Deduct money from the current balance.
     * @param money Money to deduct
     */
    void deductFromBalance(Money money);
    
    /**
     * Set the selected product.
     * @param product Product to select
     */
    void setSelectedProduct(Product product);
    
    /**
     * Clear the selected product.
     */
    void clearSelectedProduct();
    
    /**
     * Reset the transaction (clear balance and selection).
     */
    void resetTransaction();
    
    /**
     * Dispense product from a slot.
     * @param slotCode The slot code
     * @return The dispensed product
     */
    Product dispenseFromSlot(String slotCode);
}
```

</details>

### 📄 `impl/VendingMachineImpl.java`

<details>
<summary>📄 Click to view impl/VendingMachineImpl.java</summary>

```java
package com.you.lld.problems.vendingmachine.impl;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;
import com.you.lld.problems.vendingmachine.state.IdleState;
import com.you.lld.problems.vendingmachine.state.VendingMachineState;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe implementation of the VendingMachine interface.
 * Uses the State pattern for managing machine states.
 */
public class VendingMachineImpl implements VendingMachine {
    
    private final Map<String, Slot> slots;
    private VendingMachineState currentState;
    private Money currentBalance;
    private Product selectedProduct;
    private String selectedSlotCode;
    
    public VendingMachineImpl() {
        this.slots = new ConcurrentHashMap<>();
        this.currentState = IdleState.getInstance();
        this.currentBalance = Money.ZERO;
        this.selectedProduct = null;
        this.selectedSlotCode = null;
    }
    
    /**
     * Add a slot to the machine.
     */
    public void addSlot(Slot slot) {
        if (slot == null) {
            throw new IllegalArgumentException("Slot cannot be null");
        }
        slots.put(slot.getCode(), slot);
    }
    
    // ==================== Customer Operations ====================
    
    @Override
    public synchronized void insertMoney(Money money) {
        currentState.insertMoney(this, money);
    }
    
    @Override
    public synchronized Product selectProduct(String slotCode) {
        this.selectedSlotCode = slotCode;
        return currentState.selectProduct(this, slotCode);
    }
    
    @Override
    public synchronized Product dispense() {
        return currentState.dispense(this);
    }
    
    @Override
    public synchronized Money cancelTransaction() {
        Money refund = currentState.cancel(this);
        // If we have remaining balance after state's cancel, refund it
        if (!currentBalance.isZero()) {
            Money remaining = currentBalance;
            resetTransaction();
            setState(IdleState.getInstance());
            return remaining.add(refund);
        }
        return refund;
    }
    
    @Override
    public Money getCurrentBalance() {
        return currentBalance;
    }
    
    @Override
    public Product getSelectedProduct() {
        return selectedProduct;
    }
    
    // ==================== Query Operations ====================
    
    @Override
    public List<Slot> getAvailableSlots() {
        List<Slot> availableSlots = new ArrayList<>();
        for (Slot slot : slots.values()) {
            if (!slot.isEmpty()) {
                availableSlots.add(slot);
            }
        }
        return availableSlots;
    }
    
    @Override
    public boolean isProductAvailable(String slotCode) {
        Slot slot = slots.get(slotCode);
        return slot != null && !slot.isEmpty();
    }
    
    @Override
    public Slot getSlot(String slotCode) {
        return slots.get(slotCode);
    }
    
    // ==================== State Management ====================
    
    @Override
    public VendingMachineState getCurrentState() {
        return currentState;
    }
    
    @Override
    public void setState(VendingMachineState state) {
        this.currentState = state;
    }
    
    // ==================== Internal Operations ====================
    
    @Override
    public void addToBalance(Money money) {
        if (money != null && !money.isZero()) {
            this.currentBalance = this.currentBalance.add(money);
        }
    }
    
    @Override
    public void deductFromBalance(Money money) {
        if (money != null && !money.isZero()) {
            this.currentBalance = this.currentBalance.subtract(money);
        }
    }
    
    @Override
    public void setSelectedProduct(Product product) {
        this.selectedProduct = product;
    }
    
    @Override
    public void clearSelectedProduct() {
        this.selectedProduct = null;
        this.selectedSlotCode = null;
    }
    
    @Override
    public void resetTransaction() {
        this.currentBalance = Money.ZERO;
        this.selectedProduct = null;
        this.selectedSlotCode = null;
    }
    
    @Override
    public Product dispenseFromSlot(String slotCode) {
        Slot slot = slots.get(slotCode);
        if (slot == null || slot.isEmpty()) {
            throw new IllegalStateException("Product not available in slot: " + slotCode);
        }
        return slot.dispense();
    }
    
    /**
     * Get the slot code of the currently selected product.
     */
    public String getSelectedSlotCode() {
        return selectedSlotCode;
    }
    
    @Override
    public String toString() {
        return String.format("VendingMachine{state=%s, balance=%s, selected=%s}", 
                           currentState.getStateName(), 
                           currentBalance, 
                           selectedProduct != null ? selectedProduct.getName() : "none");
    }
}
```

</details>

### 📄 `model/Coin.java`

<details>
<summary>📄 Click to view model/Coin.java</summary>

```java
package com.you.lld.problems.vendingmachine.model;

/**
 * Enumeration of coins accepted by the vending machine.
 */
public enum Coin {
    PENNY(1, "Penny", "1¢"),
    NICKEL(5, "Nickel", "5¢"),
    DIME(10, "Dime", "10¢"),
    QUARTER(25, "Quarter", "25¢");
    
    private final int valueInCents;
    private final String name;
    private final String symbol;
    
    Coin(int valueInCents, String name, String symbol) {
        this.valueInCents = valueInCents;
        this.name = name;
        this.symbol = symbol;
    }
    
    public int getValueInCents() {
        return valueInCents;
    }
    
    public Money toMoney() {
        return Money.cents(valueInCents);
    }
    
    public String getName() {
        return name;
    }
    
    public String getSymbol() {
        return symbol;
    }
    
    /**
     * Get coin by value in cents.
     */
    public static Coin fromCents(int cents) {
        for (Coin coin : values()) {
            if (coin.valueInCents == cents) {
                return coin;
            }
        }
        throw new IllegalArgumentException("No coin with value: " + cents + " cents");
    }
}
```

</details>

### 📄 `model/Money.java`

<details>
<summary>📄 Click to view model/Money.java</summary>

```java
package com.you.lld.problems.vendingmachine.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

/**
 * Immutable value object representing monetary amounts.
 * Uses BigDecimal for precise financial calculations.
 */
public final class Money implements Comparable<Money> {
    
    public static final Money ZERO = new Money(BigDecimal.ZERO);
    public static final Money PENNY = cents(1);
    public static final Money NICKEL = cents(5);
    public static final Money DIME = cents(10);
    public static final Money QUARTER = cents(25);
    public static final Money DOLLAR = dollars(1);
    public static final Money FIVE_DOLLARS = dollars(5);
    
    private final BigDecimal amount;
    
    private Money(BigDecimal amount) {
        this.amount = amount.setScale(2, RoundingMode.HALF_UP);
    }
    
    public static Money of(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Amount cannot be null or negative");
        }
        return new Money(amount);
    }
    
    public static Money dollars(int dollars) {
        return new Money(BigDecimal.valueOf(dollars));
    }
    
    public static Money dollars(double dollars) {
        return new Money(BigDecimal.valueOf(dollars));
    }
    
    public static Money cents(int cents) {
        return new Money(BigDecimal.valueOf(cents).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
    }
    
    public Money add(Money other) {
        if (other == null) {
            return this;
        }
        return new Money(this.amount.add(other.amount));
    }
    
    public Money subtract(Money other) {
        if (other == null) {
            return this;
        }
        BigDecimal result = this.amount.subtract(other.amount);
        if (result.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Result cannot be negative");
        }
        return new Money(result);
    }
    
    public boolean isGreaterThanOrEqual(Money other) {
        return this.amount.compareTo(other.amount) >= 0;
    }
    
    public boolean isGreaterThan(Money other) {
        return this.amount.compareTo(other.amount) > 0;
    }
    
    public boolean isLessThan(Money other) {
        return this.amount.compareTo(other.amount) < 0;
    }
    
    public boolean isZero() {
        return this.amount.compareTo(BigDecimal.ZERO) == 0;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public int getCents() {
        return amount.multiply(BigDecimal.valueOf(100)).intValue();
    }
    
    @Override
    public int compareTo(Money other) {
        return this.amount.compareTo(other.amount);
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Money money = (Money) obj;
        return amount.compareTo(money.amount) == 0;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(amount);
    }
    
    @Override
    public String toString() {
        return "$" + amount.toString();
    }
}
```

</details>

### 📄 `model/Product.java`

<details>
<summary>📄 Click to view model/Product.java</summary>

```java
package com.you.lld.problems.vendingmachine.model;

import java.util.Objects;

/**
 * Represents a product that can be sold in the vending machine.
 * Immutable value object.
 */
public final class Product {
    
    private final String id;
    private final String name;
    private final Money price;
    private final ProductCategory category;
    
    public Product(String id, String name, Money price, ProductCategory category) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Product ID cannot be null or empty");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be null or empty");
        }
        if (price == null || price.isZero()) {
            throw new IllegalArgumentException("Product price must be positive");
        }
        if (category == null) {
            throw new IllegalArgumentException("Product category cannot be null");
        }
        
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
    }
    
    public String getId() {
        return id;
    }
    
    public String getName() {
        return name;
    }
    
    public Money getPrice() {
        return price;
    }
    
    public ProductCategory getCategory() {
        return category;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Product product = (Product) obj;
        return Objects.equals(id, product.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return String.format("Product{id='%s', name='%s', price=%s, category=%s}", 
                           id, name, price, category);
    }
}
```

</details>

### 📄 `model/ProductCategory.java`

<details>
<summary>📄 Click to view model/ProductCategory.java</summary>

```java
package com.you.lld.problems.vendingmachine.model;

/**
 * Categories of products available in the vending machine.
 */
public enum ProductCategory {
    SNACKS("Snacks", "Chips, cookies, candy"),
    BEVERAGES("Beverages", "Sodas, water, juice"),
    CANDY("Candy", "Chocolate, gum, mints"),
    HEALTHY("Healthy", "Granola bars, fruit, nuts"),
    COFFEE("Coffee", "Hot coffee and tea"),
    FRESH("Fresh", "Sandwiches, salads");
    
    private final String displayName;
    private final String description;
    
    ProductCategory(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public String getDescription() {
        return description;
    }
}
```

</details>

### 📄 `model/Slot.java`

<details>
<summary>📄 Click to view model/Slot.java</summary>

```java
package com.you.lld.problems.vendingmachine.model;

/**
 * Represents a slot in the vending machine that holds products.
 */
public class Slot {
    
    private final String code;
    private Product product;
    private int quantity;
    private final int maxCapacity;
    
    public Slot(String code, int maxCapacity) {
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("Slot code cannot be null or empty");
        }
        if (maxCapacity <= 0) {
            throw new IllegalArgumentException("Max capacity must be positive");
        }
        
        this.code = code;
        this.maxCapacity = maxCapacity;
        this.quantity = 0;
    }
    
    public Slot(String code, Product product, int quantity, int maxCapacity) {
        this(code, maxCapacity);
        this.product = product;
        this.quantity = Math.min(quantity, maxCapacity);
    }
    
    public String getCode() {
        return code;
    }
    
    public Product getProduct() {
        return product;
    }
    
    public int getQuantity() {
        return quantity;
    }
    
    public int getMaxCapacity() {
        return maxCapacity;
    }
    
    public boolean isEmpty() {
        return quantity <= 0 || product == null;
    }
    
    public boolean isFull() {
        return quantity >= maxCapacity;
    }
    
    public synchronized Product dispense() {
        if (isEmpty()) {
            throw new IllegalStateException("Slot " + code + " is empty");
        }
        quantity--;
        return product;
    }
    
    public synchronized void refill(Product product, int qty) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        if (qty <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        
        this.product = product;
        this.quantity = Math.min(this.quantity + qty, maxCapacity);
    }
    
    public synchronized void setProduct(Product product, int quantity) {
        this.product = product;
        this.quantity = Math.min(quantity, maxCapacity);
    }
    
    @Override
    public String toString() {
        return String.format("Slot{code='%s', product=%s, quantity=%d/%d}", 
                           code, product != null ? product.getName() : "empty", quantity, maxCapacity);
    }
}
```

</details>

### 📄 `state/DispensingState.java`

<details>
<summary>📄 Click to view state/DispensingState.java</summary>

```java
package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;

/**
 * Dispensing state - product is being dispensed.
 */
public class DispensingState implements VendingMachineState {
    
    private static final DispensingState INSTANCE = new DispensingState();
    
    private DispensingState() {}
    
    public static DispensingState getInstance() {
        return INSTANCE;
    }
    
    @Override
    public void insertMoney(VendingMachine machine, Money money) {
        throw new IllegalStateException("Cannot insert money during dispensing");
    }
    
    @Override
    public Product selectProduct(VendingMachine machine, String slotCode) {
        throw new IllegalStateException("Cannot select product during dispensing");
    }
    
    @Override
    public Product dispense(VendingMachine machine) {
        Product selectedProduct = machine.getSelectedProduct();
        if (selectedProduct == null) {
            throw new IllegalStateException("No product selected");
        }
        
        // Find the slot with this product and dispense
        for (Slot slot : machine.getAvailableSlots()) {
            if (slot.getProduct() != null && 
                slot.getProduct().getId().equals(selectedProduct.getId())) {
                
                // Deduct price from balance
                machine.deductFromBalance(selectedProduct.getPrice());
                
                // Dispense product from slot
                Product dispensed = machine.dispenseFromSlot(slot.getCode());
                
                // Reset transaction and return to idle
                machine.resetTransaction();
                machine.setState(IdleState.getInstance());
                
                return dispensed;
            }
        }
        
        throw new IllegalStateException("Selected product no longer available");
    }
    
    @Override
    public Money cancel(VendingMachine machine) {
        throw new IllegalStateException("Cannot cancel during dispensing");
    }
    
    @Override
    public String getStateName() {
        return "DISPENSING";
    }
}
```

</details>

### 📄 `state/HasMoneyState.java`

<details>
<summary>📄 Click to view state/HasMoneyState.java</summary>

```java
package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;

/**
 * HasMoney state - money has been inserted, waiting for product selection.
 */
public class HasMoneyState implements VendingMachineState {
    
    private static final HasMoneyState INSTANCE = new HasMoneyState();
    
    private HasMoneyState() {}
    
    public static HasMoneyState getInstance() {
        return INSTANCE;
    }
    
    @Override
    public void insertMoney(VendingMachine machine, Money money) {
        if (money == null || money.isZero()) {
            throw new IllegalArgumentException("Money amount must be positive");
        }
        machine.addToBalance(money);
    }
    
    @Override
    public Product selectProduct(VendingMachine machine, String slotCode) {
        if (slotCode == null || slotCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Slot code cannot be empty");
        }
        
        Slot slot = machine.getSlot(slotCode);
        if (slot == null || slot.isEmpty()) {
            throw new IllegalStateException("Product not available in slot: " + slotCode);
        }
        
        Product product = slot.getProduct();
        Money price = product.getPrice();
        Money balance = machine.getCurrentBalance();
        
        if (balance.isLessThan(price)) {
            throw new IllegalStateException(
                String.format("Insufficient funds. Price: %s, Balance: %s", price, balance)
            );
        }
        
        machine.setSelectedProduct(product);
        machine.setState(ProductSelectedState.getInstance());
        return product;
    }
    
    @Override
    public Product dispense(VendingMachine machine) {
        throw new IllegalStateException("Please select a product first");
    }
    
    @Override
    public Money cancel(VendingMachine machine) {
        Money refund = machine.getCurrentBalance();
        machine.resetTransaction();
        machine.setState(IdleState.getInstance());
        return refund;
    }
    
    @Override
    public String getStateName() {
        return "HAS_MONEY";
    }
}
```

</details>

### 📄 `state/IdleState.java`

<details>
<summary>📄 Click to view state/IdleState.java</summary>

```java
package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;

/**
 * Idle state - machine is waiting for money insertion.
 */
public class IdleState implements VendingMachineState {
    
    private static final IdleState INSTANCE = new IdleState();
    
    private IdleState() {}
    
    public static IdleState getInstance() {
        return INSTANCE;
    }
    
    @Override
    public void insertMoney(VendingMachine machine, Money money) {
        if (money == null || money.isZero()) {
            throw new IllegalArgumentException("Money amount must be positive");
        }
        
        machine.addToBalance(money);
        machine.setState(HasMoneyState.getInstance());
    }
    
    @Override
    public Product selectProduct(VendingMachine machine, String slotCode) {
        throw new IllegalStateException("Please insert money first");
    }
    
    @Override
    public Product dispense(VendingMachine machine) {
        throw new IllegalStateException("Please insert money and select a product first");
    }
    
    @Override
    public Money cancel(VendingMachine machine) {
        return Money.ZERO; // Nothing to refund
    }
    
    @Override
    public String getStateName() {
        return "IDLE";
    }
}
```

</details>

### 📄 `state/ProductSelectedState.java`

<details>
<summary>📄 Click to view state/ProductSelectedState.java</summary>

```java
package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;

/**
 * ProductSelected state - product has been selected, ready to dispense.
 */
public class ProductSelectedState implements VendingMachineState {
    
    private static final ProductSelectedState INSTANCE = new ProductSelectedState();
    
    private ProductSelectedState() {}
    
    public static ProductSelectedState getInstance() {
        return INSTANCE;
    }
    
    @Override
    public void insertMoney(VendingMachine machine, Money money) {
        if (money == null || money.isZero()) {
            throw new IllegalArgumentException("Money amount must be positive");
        }
        machine.addToBalance(money);
    }
    
    @Override
    public Product selectProduct(VendingMachine machine, String slotCode) {
        // Allow changing product selection
        Slot slot = machine.getSlot(slotCode);
        if (slot == null || slot.isEmpty()) {
            throw new IllegalStateException("Product not available in slot: " + slotCode);
        }
        
        Product product = slot.getProduct();
        Money price = product.getPrice();
        Money balance = machine.getCurrentBalance();
        
        if (balance.isLessThan(price)) {
            throw new IllegalStateException(
                String.format("Insufficient funds. Price: %s, Balance: %s", price, balance)
            );
        }
        
        machine.setSelectedProduct(product);
        return product;
    }
    
    @Override
    public Product dispense(VendingMachine machine) {
        Product selectedProduct = machine.getSelectedProduct();
        if (selectedProduct == null) {
            throw new IllegalStateException("No product selected");
        }
        
        machine.setState(DispensingState.getInstance());
        return machine.getCurrentState().dispense(machine);
    }
    
    @Override
    public Money cancel(VendingMachine machine) {
        machine.clearSelectedProduct();
        machine.setState(HasMoneyState.getInstance());
        return Money.ZERO; // No refund, just go back to HasMoney state
    }
    
    @Override
    public String getStateName() {
        return "PRODUCT_SELECTED";
    }
}
```

</details>

### 📄 `state/VendingMachineState.java`

<details>
<summary>📄 Click to view state/VendingMachineState.java</summary>

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

</details>



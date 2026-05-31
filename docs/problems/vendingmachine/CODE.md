# vendingmachine - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/vendingmachine/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py vendingmachine`.

## Project Structure (12 files)

```
vendingmachine/
├── VendingMachineDemo.java
├── api/VendingMachine.java
├── model/Money.java
├── model/Product.java
├── model/ProductCategory.java
├── model/Slot.java
├── impl/VendingMachineImpl.java
├── state/DispensingState.java
├── state/HasMoneyState.java
├── state/IdleState.java
├── state/ProductSelectedState.java
├── state/VendingMachineState.java
```

## Source Code

### `VendingMachineDemo.java`

<details>
<summary>Click to view VendingMachineDemo.java</summary>

```java
package com.you.lld.problems.vendingmachine;

import com.you.lld.problems.vendingmachine.impl.VendingMachineImpl;
import com.you.lld.problems.vendingmachine.model.*;

/**
 * End-to-end demo of the Vending Machine exercising:
 *
 *   1. State pattern -- Idle -> HasMoney -> ProductSelected -> Dispensing -> Idle
 *   2. State guards -- insert before select, select before dispense, etc.
 *   3. Change handling -- overpayment returned automatically
 *   4. Insufficient funds -- rejected at selection
 *   5. Cancel & refund -- full balance returned in any state
 *   6. Empty slot -- rejected when stock runs out
 *   7. Concurrent thread safety -- synchronized customer operations
 *   8. Encapsulation -- VendingMachine interface hides internal state methods
 */
public class VendingMachineDemo {

    public static void main(String[] args) {
        System.out.println("========================================");
        System.out.println("  Vending Machine -- Full LLD Demo");
        System.out.println("========================================\n");

        VendingMachineImpl machine = setupMachine();

        demoSuccessfulPurchase(machine);
        demoChangeReturn(machine);
        demoInsufficientFunds(machine);
        demoCancelAndRefund(machine);
        demoEmptySlot(machine);
        demoStateGuards(machine);
        demoConcurrency(machine);

        System.out.println("========================================");
        System.out.println("  All demos completed.");
        System.out.println("========================================");
    }

    private static VendingMachineImpl setupMachine() {
        VendingMachineImpl machine = new VendingMachineImpl();

        Product coke   = new Product("P1", "Coca-Cola",     Money.dollars(1.50), ProductCategory.BEVERAGES);
        Product chips  = new Product("P2", "Lay's Chips",   Money.dollars(1.25), ProductCategory.SNACKS);
        Product water  = new Product("P3", "Spring Water",  Money.dollars(1.00), ProductCategory.BEVERAGES);
        Product snickers = new Product("P4", "Snickers Bar", Money.dollars(1.75), ProductCategory.CANDY);

        machine.addSlot(new Slot("A1", coke,     5, 10));
        machine.addSlot(new Slot("A2", chips,    3, 10));
        machine.addSlot(new Slot("B1", water,    8, 10));
        machine.addSlot(new Slot("B2", snickers, 2, 10));

        System.out.println("[Setup] Stocked 4 slots:");
        for (Slot s : machine.getAvailableSlots()) {
            System.out.println("  " + s);
        }
        System.out.println();
        return machine;
    }

    // ──────────── Demo 1: Exact-amount purchase ────────────

    private static void demoSuccessfulPurchase(VendingMachineImpl machine) {
        System.out.println("--- Demo 1: Successful Purchase (Coke $1.50, exact) ---\n");

        machine.insertMoney(Money.DOLLAR);
        System.out.println("Inserted $1.00 -> balance: " + machine.getCurrentBalance()
            + " | state: " + machine.getStateName());

        machine.insertMoney(Money.QUARTER);
        machine.insertMoney(Money.QUARTER);
        System.out.println("Inserted 2 quarters -> balance: " + machine.getCurrentBalance());

        Product selected = machine.selectProduct("A1");
        System.out.println("Selected: " + selected.getName()
            + " | state: " + machine.getStateName());

        Product dispensed = machine.dispense();
        System.out.println("Dispensed: " + dispensed.getName()
            + " | change: " + machine.getLastChange()
            + " | state: " + machine.getStateName());
        System.out.println();
    }

    // ──────────── Demo 2: Overpayment → change ────────────

    private static void demoChangeReturn(VendingMachineImpl machine) {
        System.out.println("--- Demo 2: Overpayment & Change (Water $1.00, pay $2.00) ---\n");

        machine.insertMoney(Money.DOLLAR);
        machine.insertMoney(Money.DOLLAR);
        machine.selectProduct("B1");
        Product p = machine.dispense();
        System.out.println("Dispensed: " + p.getName()
            + " | change returned: " + machine.getLastChange());
        System.out.println();
    }

    // ──────────── Demo 3: Insufficient funds ────────────

    private static void demoInsufficientFunds(VendingMachineImpl machine) {
        System.out.println("--- Demo 3: Insufficient Funds (Snickers $1.75, insert $1.00) ---\n");

        machine.insertMoney(Money.DOLLAR);
        try {
            machine.selectProduct("B2");
        } catch (IllegalStateException e) {
            System.out.println("Blocked: " + e.getMessage());
        }
        machine.cancelTransaction();
        System.out.println("Refunded, state: " + machine.getStateName());
        System.out.println();
    }

    // ──────────── Demo 4: Cancel and refund ────────────

    private static void demoCancelAndRefund(VendingMachineImpl machine) {
        System.out.println("--- Demo 4: Cancel & Refund ---\n");

        machine.insertMoney(Money.DOLLAR);
        machine.insertMoney(Money.QUARTER);
        System.out.println("Balance: " + machine.getCurrentBalance());

        Money refund = machine.cancelTransaction();
        System.out.println("Refund: " + refund + " | state: " + machine.getStateName());
        System.out.println();
    }

    // ──────────── Demo 5: Buy until empty ────────────

    private static void demoEmptySlot(VendingMachineImpl machine) {
        System.out.println("--- Demo 5: Buy Until Empty (Snickers, qty=2) ---\n");

        for (int i = 1; i <= 3; i++) {
            try {
                machine.insertMoney(Money.DOLLAR);
                machine.insertMoney(Money.DOLLAR);
                machine.selectProduct("B2");
                Product p = machine.dispense();
                System.out.println("  Purchase " + i + ": " + p.getName());
            } catch (IllegalStateException e) {
                System.out.println("  Purchase " + i + " failed: " + e.getMessage());
                machine.cancelTransaction();
            }
        }
        System.out.println("Slot B2 available: " + machine.isProductAvailable("B2"));
        System.out.println();
    }

    // ──────────── Demo 6: State guards ────────────

    private static void demoStateGuards(VendingMachineImpl machine) {
        System.out.println("--- Demo 6: State Pattern Guards ---\n");

        try {
            machine.selectProduct("A1");
        } catch (IllegalStateException e) {
            System.out.println("Select without money: " + e.getMessage());
        }

        try {
            machine.dispense();
        } catch (IllegalStateException e) {
            System.out.println("Dispense without money: " + e.getMessage());
        }

        machine.insertMoney(Money.DOLLAR);
        try {
            machine.dispense();
        } catch (IllegalStateException e) {
            System.out.println("Dispense without select: " + e.getMessage());
        }
        machine.cancelTransaction();
        System.out.println();
    }

    // ──────────── Demo 7: Concurrent purchases ────────────

    private static void demoConcurrency(VendingMachineImpl machine) {
        System.out.println("--- Demo 7: Concurrent Purchases (synchronized) ---\n");

        machine.getSlot("B1").refill(
            new Product("P3", "Spring Water", Money.dollars(1.00), ProductCategory.BEVERAGES), 5);

        Thread[] threads = new Thread[5];
        for (int i = 0; i < 5; i++) {
            final int idx = i;
            threads[i] = new Thread(() -> {
                try {
                    machine.insertMoney(Money.DOLLAR);
                    machine.selectProduct("B1");
                    Product p = machine.dispense();
                    System.out.println("  Thread-" + idx + " dispensed: " + p.getName());
                } catch (Exception e) {
                    System.out.println("  Thread-" + idx + " failed: " + e.getMessage());
                    try { machine.cancelTransaction(); } catch (Exception ignored) {}
                }
            });
        }
        for (Thread t : threads) t.start();
        for (Thread t : threads) {
            try { t.join(); } catch (InterruptedException ignored) {}
        }
        System.out.println("Water remaining: " + machine.getSlot("B1").getQuantity());
        System.out.println();
    }
}
```

</details>

### `api/VendingMachine.java`

<details>
<summary>Click to view api/VendingMachine.java</summary>

```java
package com.you.lld.problems.vendingmachine.api;

import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;

import java.util.List;

/**
 * Public API for the Vending Machine.
 *
 * Contains ONLY customer-facing and query operations.
 * Internal methods (setState, addToBalance, resetTransaction, etc.)
 * live on VendingMachineImpl and are accessed directly by State classes.
 * This keeps the public contract clean -- callers cannot break invariants.
 */
public interface VendingMachine {

    void insertMoney(Money money);
    Product selectProduct(String slotCode);
    Product dispense();
    Money cancelTransaction();

    Money getCurrentBalance();
    Product getSelectedProduct();
    String getStateName();

    List<Slot> getAvailableSlots();
    boolean isProductAvailable(String slotCode);
    Slot getSlot(String slotCode);
}
```

</details>

### `model/Money.java`

<details>
<summary>Click to view model/Money.java</summary>

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

### `model/Product.java`

<details>
<summary>Click to view model/Product.java</summary>

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

### `model/ProductCategory.java`

<details>
<summary>Click to view model/ProductCategory.java</summary>

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

### `model/Slot.java`

<details>
<summary>Click to view model/Slot.java</summary>

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

### `impl/VendingMachineImpl.java`

<details>
<summary>Click to view impl/VendingMachineImpl.java</summary>

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
 * Thread-safe Vending Machine implementation using the State pattern.
 *
 * Patterns:
 *   State -- 4 singleton states (Idle, HasMoney, ProductSelected, Dispensing)
 *            manage transitions and validate operations.
 *
 * Encapsulation:
 *   VendingMachine interface = public customer/query API only.
 *   Internal methods (addToBalance, setState, resetTransaction, etc.)
 *   are public on this class but NOT on the interface, so only State
 *   classes (which take VendingMachineImpl as context) can access them.
 *
 * Concurrency:
 *   All customer operations (insertMoney, selectProduct, dispense, cancelTransaction)
 *   are synchronized on this instance. Slot.dispense/refill are independently synchronized.
 */
public class VendingMachineImpl implements VendingMachine {

    private final Map<String, Slot> slots = new ConcurrentHashMap<>();
    private VendingMachineState currentState;
    private Money currentBalance;
    private Product selectedProduct;
    private String selectedSlotCode;
    private Money lastChange;

    public VendingMachineImpl() {
        this.currentState = IdleState.getInstance();
        this.currentBalance = Money.ZERO;
        this.lastChange = Money.ZERO;
    }

    // ======================== Public customer API ========================

    @Override
    public synchronized void insertMoney(Money money) {
        currentState.insertMoney(this, money);
    }

    @Override
    public synchronized Product selectProduct(String slotCode) {
        return currentState.selectProduct(this, slotCode);
    }

    @Override
    public synchronized Product dispense() {
        return currentState.dispense(this);
    }

    @Override
    public synchronized Money cancelTransaction() {
        Money refund = currentState.cancel(this);
        if (!currentBalance.isZero()) {
            Money remaining = currentBalance;
            resetTransaction();
            setState(IdleState.getInstance());
            return remaining.add(refund);
        }
        return refund;
    }

    @Override
    public synchronized Money getCurrentBalance() { return currentBalance; }

    @Override
    public synchronized Product getSelectedProduct() { return selectedProduct; }

    @Override
    public synchronized String getStateName() { return currentState.getStateName(); }

    // ======================== Query API ========================

    @Override
    public List<Slot> getAvailableSlots() {
        List<Slot> available = new ArrayList<>();
        for (Slot slot : slots.values()) {
            if (!slot.isEmpty()) available.add(slot);
        }
        return available;
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

    // ======================== Admin ========================

    public void addSlot(Slot slot) {
        if (slot == null) throw new IllegalArgumentException("Slot cannot be null");
        slots.put(slot.getCode(), slot);
    }

    // ======================== Internal (for State classes) ========================

    public void setState(VendingMachineState state) { this.currentState = state; }
    public VendingMachineState getState()            { return currentState; }

    public void addToBalance(Money money) {
        if (money != null && !money.isZero()) {
            this.currentBalance = this.currentBalance.add(money);
        }
    }

    public void deductFromBalance(Money money) {
        if (money != null && !money.isZero()) {
            this.currentBalance = this.currentBalance.subtract(money);
        }
    }

    public void setSelectedProduct(Product product) { this.selectedProduct = product; }

    public String getSelectedSlotCode() { return selectedSlotCode; }
    public void setSelectedSlotCode(String code) { this.selectedSlotCode = code; }

    public void setLastChange(Money change) { this.lastChange = change; }
    public Money getLastChange() { return lastChange; }

    public void resetTransaction() {
        this.currentBalance = Money.ZERO;
        this.selectedProduct = null;
        this.selectedSlotCode = null;
    }

    @Override
    public String toString() {
        return String.format("VendingMachine{state=%s, balance=%s, selected=%s}",
            currentState.getStateName(), currentBalance,
            selectedProduct != null ? selectedProduct.getName() : "none");
    }
}
```

</details>

### `state/DispensingState.java`

<details>
<summary>Click to view state/DispensingState.java</summary>

```java
package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.impl.VendingMachineImpl;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;

/**
 * Dispensing -- product is being dispensed.
 *
 * FIX: Uses the selected SLOT CODE (not a product-ID search) to dispense
 * from the exact slot the customer chose. This avoids the wrong-slot bug
 * when multiple slots hold the same product.
 */
public class DispensingState implements VendingMachineState {

    private static final DispensingState INSTANCE = new DispensingState();
    private DispensingState() {}
    public static DispensingState getInstance() { return INSTANCE; }

    @Override
    public void insertMoney(VendingMachineImpl machine, Money money) {
        throw new IllegalStateException("Cannot insert money during dispensing");
    }

    @Override
    public Product selectProduct(VendingMachineImpl machine, String slotCode) {
        throw new IllegalStateException("Cannot select product during dispensing");
    }

    @Override
    public Product dispense(VendingMachineImpl machine) {
        Product product = machine.getSelectedProduct();
        String slotCode = machine.getSelectedSlotCode();

        if (product == null || slotCode == null) {
            throw new IllegalStateException("No product selected");
        }

        Slot slot = machine.getSlot(slotCode);
        if (slot == null || slot.isEmpty()) {
            throw new IllegalStateException("Selected slot " + slotCode + " is now empty");
        }

        machine.deductFromBalance(product.getPrice());

        Money change = machine.getCurrentBalance();

        Product dispensed = slot.dispense();

        machine.setLastChange(change);
        machine.resetTransaction();
        machine.setState(IdleState.getInstance());

        if (!change.isZero()) {
            System.out.println("[VendingMachine] Change returned: " + change);
        }

        return dispensed;
    }

    @Override
    public Money cancel(VendingMachineImpl machine) {
        throw new IllegalStateException("Cannot cancel during dispensing");
    }

    @Override
    public String getStateName() { return "DISPENSING"; }
}
```

</details>

### `state/HasMoneyState.java`

<details>
<summary>Click to view state/HasMoneyState.java</summary>

```java
package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.impl.VendingMachineImpl;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;

/**
 * HasMoney -- money inserted, waiting for product selection.
 */
public class HasMoneyState implements VendingMachineState {

    private static final HasMoneyState INSTANCE = new HasMoneyState();
    private HasMoneyState() {}
    public static HasMoneyState getInstance() { return INSTANCE; }

    @Override
    public void insertMoney(VendingMachineImpl machine, Money money) {
        if (money == null || money.isZero()) {
            throw new IllegalArgumentException("Money amount must be positive");
        }
        machine.addToBalance(money);
    }

    @Override
    public Product selectProduct(VendingMachineImpl machine, String slotCode) {
        if (slotCode == null || slotCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Slot code cannot be empty");
        }

        Slot slot = machine.getSlot(slotCode);
        if (slot == null || slot.isEmpty()) {
            throw new IllegalStateException("Product not available in slot: " + slotCode);
        }

        Product product = slot.getProduct();
        if (machine.getCurrentBalance().isLessThan(product.getPrice())) {
            throw new IllegalStateException(
                String.format("Insufficient funds. Price: %s, Balance: %s",
                    product.getPrice(), machine.getCurrentBalance()));
        }

        machine.setSelectedProduct(product);
        machine.setSelectedSlotCode(slotCode);
        machine.setState(ProductSelectedState.getInstance());
        return product;
    }

    @Override
    public Product dispense(VendingMachineImpl machine) {
        throw new IllegalStateException("Please select a product first");
    }

    @Override
    public Money cancel(VendingMachineImpl machine) {
        Money refund = machine.getCurrentBalance();
        machine.resetTransaction();
        machine.setState(IdleState.getInstance());
        return refund;
    }

    @Override
    public String getStateName() { return "HAS_MONEY"; }
}
```

</details>

### `state/IdleState.java`

<details>
<summary>Click to view state/IdleState.java</summary>

```java
package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.impl.VendingMachineImpl;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;

/**
 * Idle -- machine waiting for money. Only insertMoney is valid.
 */
public class IdleState implements VendingMachineState {

    private static final IdleState INSTANCE = new IdleState();
    private IdleState() {}
    public static IdleState getInstance() { return INSTANCE; }

    @Override
    public void insertMoney(VendingMachineImpl machine, Money money) {
        if (money == null || money.isZero()) {
            throw new IllegalArgumentException("Money amount must be positive");
        }
        machine.addToBalance(money);
        machine.setState(HasMoneyState.getInstance());
    }

    @Override
    public Product selectProduct(VendingMachineImpl machine, String slotCode) {
        throw new IllegalStateException("Please insert money first");
    }

    @Override
    public Product dispense(VendingMachineImpl machine) {
        throw new IllegalStateException("Please insert money and select a product first");
    }

    @Override
    public Money cancel(VendingMachineImpl machine) {
        return Money.ZERO;
    }

    @Override
    public String getStateName() { return "IDLE"; }
}
```

</details>

### `state/ProductSelectedState.java`

<details>
<summary>Click to view state/ProductSelectedState.java</summary>

```java
package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.impl.VendingMachineImpl;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;
import com.you.lld.problems.vendingmachine.model.Slot;

/**
 * ProductSelected -- product chosen, ready to dispense.
 * User can re-select, add more money, cancel, or dispense.
 */
public class ProductSelectedState implements VendingMachineState {

    private static final ProductSelectedState INSTANCE = new ProductSelectedState();
    private ProductSelectedState() {}
    public static ProductSelectedState getInstance() { return INSTANCE; }

    @Override
    public void insertMoney(VendingMachineImpl machine, Money money) {
        if (money == null || money.isZero()) {
            throw new IllegalArgumentException("Money amount must be positive");
        }
        machine.addToBalance(money);
    }

    @Override
    public Product selectProduct(VendingMachineImpl machine, String slotCode) {
        Slot slot = machine.getSlot(slotCode);
        if (slot == null || slot.isEmpty()) {
            throw new IllegalStateException("Product not available in slot: " + slotCode);
        }

        Product product = slot.getProduct();
        if (machine.getCurrentBalance().isLessThan(product.getPrice())) {
            throw new IllegalStateException(
                String.format("Insufficient funds. Price: %s, Balance: %s",
                    product.getPrice(), machine.getCurrentBalance()));
        }

        machine.setSelectedProduct(product);
        machine.setSelectedSlotCode(slotCode);
        return product;
    }

    @Override
    public Product dispense(VendingMachineImpl machine) {
        Product product = machine.getSelectedProduct();
        if (product == null) {
            throw new IllegalStateException("No product selected");
        }
        machine.setState(DispensingState.getInstance());
        return machine.getState().dispense(machine);
    }

    @Override
    public Money cancel(VendingMachineImpl machine) {
        Money refund = machine.getCurrentBalance();
        machine.resetTransaction();
        machine.setState(IdleState.getInstance());
        return refund;
    }

    @Override
    public String getStateName() { return "PRODUCT_SELECTED"; }
}
```

</details>

### `state/VendingMachineState.java`

<details>
<summary>Click to view state/VendingMachineState.java</summary>

```java
package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.impl.VendingMachineImpl;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;

/**
 * State interface for the Vending Machine State pattern.
 *
 * Takes VendingMachineImpl (not the interface) as context so states
 * can access internal methods (addToBalance, setState, resetTransaction, etc.)
 * without exposing those methods on the public VendingMachine API.
 */
public interface VendingMachineState {
    void insertMoney(VendingMachineImpl machine, Money money);
    Product selectProduct(VendingMachineImpl machine, String slotCode);
    Product dispense(VendingMachineImpl machine);
    Money cancel(VendingMachineImpl machine);
    String getStateName();
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.vendingmachine.VendingMachineDemo"
```

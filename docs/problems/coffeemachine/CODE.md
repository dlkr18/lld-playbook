# coffeemachine - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/coffeemachine/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py coffeemachine`.

## Project Structure (16 files)

```
coffeemachine/
├── CoffeeMachineDemo.java
├── CoffeeMachine.java
├── model/Beverage.java
├── model/BeverageType.java
├── model/Ingredient.java
├── model/IngredientContainer.java
├── model/Order.java
├── model/OrderStatus.java
├── model/Payment.java
├── model/PaymentMethod.java
├── service/CoffeeMachineService.java
├── service/impl/CoffeeMachineImpl.java
├── state/AwaitingPaymentState.java
├── state/CoffeeMachineState.java
├── state/DispensingState.java
├── state/IdleState.java
```

## Source Code

### `CoffeeMachineDemo.java`

<details>
<summary>Click to view CoffeeMachineDemo.java</summary>

```java
package com.you.lld.problems.coffeemachine;

import com.you.lld.problems.coffeemachine.model.BeverageType;
import com.you.lld.problems.coffeemachine.model.Ingredient;
import com.you.lld.problems.coffeemachine.model.Order;
import com.you.lld.problems.coffeemachine.model.Payment;
import com.you.lld.problems.coffeemachine.model.PaymentMethod;

import java.math.BigDecimal;

/**
 * SDE3 demo: State pattern, menu, payment, ingredient depletion + refill.
 */
public class CoffeeMachineDemo {

    public static void main(String[] args) {
        System.out.println("=== Coffee Machine (SDE3) ===\n");
        CoffeeMachine machine = new CoffeeMachine();

        // 1. Menu
        System.out.println("--- 1. Menu ---");
        for (com.you.lld.problems.coffeemachine.model.Beverage b : machine.getMenu()) {
            System.out.println("  " + b.getName() + " $" + b.getPrice());
        }

        // 2. Select -> pay -> dispense, in that order
        System.out.println("\n--- 2. Select, then pay, then dispense ---");
        System.out.println("  state: " + machine.getStateName());
        Order order = machine.placeOrder(BeverageType.ESPRESSO);
        System.out.println("  after selecting: state=" + machine.getStateName()
                + ", order=" + order.getStatus()
                + ", coffee still " + machine.checkIngredients().get(Ingredient.COFFEE)
                + " (nothing consumed yet)");
        boolean paid = machine.processPayment(order.getId(),
                new Payment("P1", order.getId(), new BigDecimal("3.00"), PaymentMethod.CARD));
        System.out.println("  paid 3.00 for a 2.50 espresso -> " + paid
                + ", order=" + order.getStatus()
                + ", change=" + order.getChangeDue());
        System.out.println("  coffee now " + machine.checkIngredients().get(Ingredient.COFFEE)
                + ", state=" + machine.getStateName());

        // 3. Underpaying gets no drink and the money back
        System.out.println("\n--- 3. Underpayment: no drink, full refund ---");
        int milkBefore = machine.checkIngredients().get(Ingredient.MILK);
        Order shortPaid = machine.placeOrder(BeverageType.LATTE);
        boolean ok = machine.processPayment(shortPaid.getId(),
                new Payment("P2", shortPaid.getId(), new BigDecimal("1.00"), PaymentMethod.CASH));
        System.out.println("  paid 1.00 for a 3.50 latte -> " + ok
                + ", order=" + shortPaid.getStatus()
                + ", refunded=" + shortPaid.getChangeDue() + ", kept=" + shortPaid.getAmountPaid());
        System.out.println("  milk " + milkBefore + " -> " + machine.checkIngredients().get(Ingredient.MILK)
                + " (untouched), state=" + machine.getStateName());

        // 4. The machine refuses a second order mid-transaction, and can be cancelled
        System.out.println("\n--- 4. State guards ---");
        Order pending = machine.placeOrder(BeverageType.CAPPUCCINO);
        System.out.println("  state: " + machine.getStateName());
        try {
            machine.placeOrder(BeverageType.LATTE);
        } catch (IllegalStateException e) {
            System.out.println("  second order refused: " + e.getMessage());
        }
        machine.cancelOrder();
        System.out.println("  after cancel: state=" + machine.getStateName()
                + ", order=" + pending.getStatus());

        // 5. Out of stock is caught at selection, before taking money
        System.out.println("\n--- 5. Out of ingredients ---");
        while (machine.checkIngredients().get(Ingredient.MILK) >= 100) {
            Order l = machine.placeOrder(BeverageType.LATTE);
            machine.processPayment(l.getId(),
                    new Payment("PX", l.getId(), new BigDecimal("3.50"), PaymentMethod.CARD));
        }
        System.out.println("  milk exhausted: " + machine.checkIngredients().get(Ingredient.MILK));
        try {
            machine.placeOrder(BeverageType.LATTE);
        } catch (IllegalStateException e) {
            System.out.println("  refused before any payment: " + e.getMessage());
        }
        machine.refillIngredient(Ingredient.MILK, 500);
        System.out.println("  after refill, milk=" + machine.checkIngredients().get(Ingredient.MILK)
                + ", state=" + machine.getStateName());

        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `CoffeeMachine.java`

<details>
<summary>Click to view CoffeeMachine.java</summary>

```java
package com.you.lld.problems.coffeemachine;

import com.you.lld.problems.coffeemachine.model.Beverage;
import com.you.lld.problems.coffeemachine.model.BeverageType;
import com.you.lld.problems.coffeemachine.model.Ingredient;
import com.you.lld.problems.coffeemachine.model.Order;
import com.you.lld.problems.coffeemachine.model.Payment;
import com.you.lld.problems.coffeemachine.service.CoffeeMachineService;
import com.you.lld.problems.coffeemachine.service.impl.CoffeeMachineImpl;

import java.util.List;
import java.util.Map;

/**
 * Facade for coffee vending.
 *
 * <p>State machine: {@code IDLE -> AWAITING_PAYMENT -> DISPENSING -> IDLE}. Money is
 * taken before ingredients are consumed, and any failure after payment refunds in
 * full.
 */
public class CoffeeMachine {
    private final CoffeeMachineService service;

    public CoffeeMachine() {
        this(new CoffeeMachineImpl());
    }

    public CoffeeMachine(CoffeeMachineService service) {
        this.service = service;
    }

    public List<Beverage> getMenu() {
        return service.getMenu();
    }

    public Order placeOrder(BeverageType type) {
        return service.placeOrder(type);
    }

    public boolean processPayment(String orderId, Payment payment) {
        return service.processPayment(orderId, payment);
    }

    public void refillIngredient(Ingredient ingredient, int amount) {
        service.refillIngredient(ingredient, amount);
    }

    public Map<Ingredient, Integer> checkIngredients() {
        return service.checkIngredients();
    }

    /** Abandon the selected order without paying. */
    public void cancelOrder() {
        service.cancelOrder();
    }

    public String getStateName() {
        return service.getStateName();
    }
}
```

</details>

### `model/Beverage.java`

<details>
<summary>Click to view model/Beverage.java</summary>

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

</details>

### `model/BeverageType.java`

<details>
<summary>Click to view model/BeverageType.java</summary>

```java
package com.you.lld.problems.coffeemachine.model;

public enum BeverageType {
    ESPRESSO, CAPPUCCINO, LATTE, AMERICANO, MOCHA
}
```

</details>

### `model/Ingredient.java`

<details>
<summary>Click to view model/Ingredient.java</summary>

```java
package com.you.lld.problems.coffeemachine.model;

public enum Ingredient {
    COFFEE, MILK, WATER, SUGAR, CHOCOLATE
}
```

</details>

### `model/IngredientContainer.java`

<details>
<summary>Click to view model/IngredientContainer.java</summary>

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

</details>

### `model/Order.java`

<details>
<summary>Click to view model/Order.java</summary>

```java
package com.you.lld.problems.coffeemachine.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * One purchase: selected beverage, what was paid, what is owed back.
 *
 * <p>An order now records {@code amountPaid} and {@code changeDue}. Previously
 * payment was compared against the price and the result thrown away — so an
 * overpayment was simply kept, and a failed payment left an order that had already
 * been marked COMPLETED.
 */
public class Order {

    private final String id;
    private final Beverage beverage;
    private final LocalDateTime orderTime;
    private OrderStatus status;
    private BigDecimal amountPaid = BigDecimal.ZERO;
    private BigDecimal changeDue = BigDecimal.ZERO;

    public Order(String id, Beverage beverage) {
        this.id = id;
        this.beverage = beverage;
        this.orderTime = LocalDateTime.now();
        this.status = OrderStatus.PENDING;
    }

    public void markDispensing() {
        this.status = OrderStatus.IN_PROGRESS;
    }

    public void complete() {
        this.status = OrderStatus.COMPLETED;
    }

    public void fail() {
        this.status = OrderStatus.FAILED;
    }

    public void recordPayment(BigDecimal paid, BigDecimal change) {
        this.amountPaid = paid;
        this.changeDue = change;
    }

    public String getId() {
        return id;
    }

    public Beverage getBeverage() {
        return beverage;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public LocalDateTime getOrderTime() {
        return orderTime;
    }

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    /** Change owed to the customer — also the refund amount when an order fails. */
    public BigDecimal getChangeDue() {
        return changeDue;
    }

    @Override
    public String toString() {
        return "Order{id='" + id + "', beverage=" + beverage.getName() + ", status=" + status
                + ", paid=" + amountPaid + ", change=" + changeDue + "}";
    }
}
```

</details>

### `model/OrderStatus.java`

<details>
<summary>Click to view model/OrderStatus.java</summary>

```java
package com.you.lld.problems.coffeemachine.model;

public enum OrderStatus {
    PENDING, IN_PROGRESS, COMPLETED, FAILED
}
```

</details>

### `model/Payment.java`

<details>
<summary>Click to view model/Payment.java</summary>

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

</details>

### `model/PaymentMethod.java`

<details>
<summary>Click to view model/PaymentMethod.java</summary>

```java
package com.you.lld.problems.coffeemachine.model;

public enum PaymentMethod {
    CASH, CARD, MOBILE
}
```

</details>

### `service/CoffeeMachineService.java`

<details>
<summary>Click to view service/CoffeeMachineService.java</summary>

```java
package com.you.lld.problems.coffeemachine.service;

import com.you.lld.problems.coffeemachine.model.*;
import java.util.Map;
import java.util.List;

public interface CoffeeMachineService {
    List<Beverage> getMenu();
    Order placeOrder(BeverageType type);
    boolean processPayment(String orderId, Payment payment);

    /** Abandon the selected order without paying. */
    void cancelOrder();
    void refillIngredient(Ingredient ingredient, int amount);
    Map<Ingredient, Integer> checkIngredients();

    /** Current lifecycle state: IDLE, AWAITING_PAYMENT or DISPENSING. */
    String getStateName();
}
```

</details>

### `service/impl/CoffeeMachineImpl.java`

<details>
<summary>Click to view service/impl/CoffeeMachineImpl.java</summary>

```java
package com.you.lld.problems.coffeemachine.service.impl;

import com.you.lld.problems.coffeemachine.model.*;
import com.you.lld.problems.coffeemachine.service.CoffeeMachineService;
import com.you.lld.problems.coffeemachine.state.CoffeeMachineState;
import com.you.lld.problems.coffeemachine.state.DispensingState;
import com.you.lld.problems.coffeemachine.state.IdleState;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Coffee machine driven by a real State machine:
 * {@code IDLE -> AWAITING_PAYMENT -> DISPENSING -> IDLE}.
 *
 * <p>Money is taken <b>before</b> ingredients are consumed, and any path that fails
 * after taking money refunds all of it.
 */
public class CoffeeMachineImpl implements CoffeeMachineService {
    private final IngredientContainer container;
    private final Map<BeverageType, Beverage> menu;
    private final Map<String, Order> orders;
    private CoffeeMachineState state;
    private String currentOrderId;

    public CoffeeMachineImpl() {
        this.container = new IngredientContainer();
        this.menu = new HashMap<BeverageType, Beverage>();
        this.orders = new ConcurrentHashMap<String, Order>();
        this.state = IdleState.getInstance();
        initializeMenu();
    }

    private void initializeMenu() {
        Map<Ingredient, Integer> espressoRecipe = new HashMap<Ingredient, Integer>();
        espressoRecipe.put(Ingredient.COFFEE, 20);
        espressoRecipe.put(Ingredient.WATER, 30);
        menu.put(BeverageType.ESPRESSO,
                new Beverage(BeverageType.ESPRESSO, "Espresso", new BigDecimal("2.50"), espressoRecipe));

        Map<Ingredient, Integer> latteRecipe = new HashMap<Ingredient, Integer>();
        latteRecipe.put(Ingredient.COFFEE, 20);
        latteRecipe.put(Ingredient.MILK, 100);
        latteRecipe.put(Ingredient.WATER, 30);
        menu.put(BeverageType.LATTE,
                new Beverage(BeverageType.LATTE, "Latte", new BigDecimal("3.50"), latteRecipe));

        Map<Ingredient, Integer> cappuccinoRecipe = new HashMap<Ingredient, Integer>();
        cappuccinoRecipe.put(Ingredient.COFFEE, 20);
        cappuccinoRecipe.put(Ingredient.MILK, 80);
        cappuccinoRecipe.put(Ingredient.WATER, 30);
        menu.put(BeverageType.CAPPUCCINO,
                new Beverage(BeverageType.CAPPUCCINO, "Cappuccino", new BigDecimal("3.00"), cappuccinoRecipe));
    }

    public synchronized void setState(CoffeeMachineState newState) {
        this.state = newState;
    }

    @Override
    public synchronized String getStateName() {
        return state.getStateName();
    }

    public Beverage getBeverage(BeverageType type) {
        return menu.get(type);
    }

    /**
     * Step 1 — selection. Verifies the beverage can be made, but consumes nothing.
     *
     * <p>Stock is checked here so the customer is told "out of milk" before paying
     * rather than after. It is only a check, not a reservation: with a single-order
     * machine the AWAITING_PAYMENT state already excludes a second order, so nothing
     * can drain the hopper in between.
     */
    public Order doSelect(Beverage beverage) {
        if (!container.hasIngredients(beverage.getRecipe())) {
            throw new IllegalStateException("Out of ingredients for " + beverage.getName());
        }
        String orderId = UUID.randomUUID().toString();
        Order order = new Order(orderId, beverage);
        orders.put(orderId, order);
        currentOrderId = orderId;
        return order;
    }

    /**
     * Step 2 — take the money, then make the drink.
     *
     * <p>This is the ordering the previous version had backwards: it consumed
     * ingredients and marked the order COMPLETED during {@code placeOrder}, then
     * compared the payment afterwards and discarded the result. Underpaying got you
     * a free drink; overpaying kept the difference.
     */
    public boolean doPayAndDispense(String orderId, Payment payment) {
        Order order = orders.get(orderId);
        if (order == null || !orderId.equals(currentOrderId)) {
            throw new IllegalArgumentException("Not the order awaiting payment: " + orderId);
        }
        BigDecimal price = order.getBeverage().getPrice();
        BigDecimal paid = payment.getAmount();

        if (paid.compareTo(price) < 0) {
            // Insufficient: refund everything, make nothing, keep the hopper intact.
            order.recordPayment(BigDecimal.ZERO, paid);
            order.fail();
            finishOrder();
            return false;
        }

        setState(DispensingState.getInstance());
        try {
            if (!container.consume(order.getBeverage().getRecipe())) {
                // Ran dry between selection and payment: full refund, never a
                // half-charge. Every path that takes money must return it.
                order.recordPayment(BigDecimal.ZERO, paid);
                order.fail();
                return false;
            }
            order.markDispensing();
            order.recordPayment(price, paid.subtract(price));
            order.complete();
            return true;
        } finally {
            finishOrder();
        }
    }

    /** Abandon the selection. Nothing was taken, so there is nothing to refund. */
    public void doCancel() {
        Order order = currentOrderId == null ? null : orders.get(currentOrderId);
        if (order != null) {
            order.fail();
        }
        finishOrder();
    }

    private void finishOrder() {
        currentOrderId = null;
        setState(IdleState.getInstance());
    }

    @Override
    public List<Beverage> getMenu() {
        return new ArrayList<Beverage>(menu.values());
    }

    @Override
    public synchronized Order placeOrder(BeverageType type) {
        return state.placeOrder(this, type);
    }

    @Override
    public synchronized boolean processPayment(String orderId, Payment payment) {
        return state.processPayment(this, orderId, payment);
    }

    @Override
    public synchronized void cancelOrder() {
        state.cancelOrder(this);
    }

    public synchronized Order getOrder(String orderId) {
        return orders.get(orderId);
    }

    @Override
    public void refillIngredient(Ingredient ingredient, int amount) {
        container.refill(ingredient, amount);
    }

    @Override
    public Map<Ingredient, Integer> checkIngredients() {
        return container.getAllQuantities();
    }
}
```

</details>

### `state/AwaitingPaymentState.java`

<details>
<summary>Click to view state/AwaitingPaymentState.java</summary>

```java
package com.you.lld.problems.coffeemachine.state;

import com.you.lld.problems.coffeemachine.model.BeverageType;
import com.you.lld.problems.coffeemachine.model.Order;
import com.you.lld.problems.coffeemachine.model.Payment;
import com.you.lld.problems.coffeemachine.service.impl.CoffeeMachineImpl;

/**
 * A beverage is selected and the machine is waiting to be paid.
 *
 * <p>This state is what makes the machine's lifecycle real. Previously the flow was
 * IDLE → (brew, consuming ingredients) → IDLE inside a single call, with payment
 * checked afterwards and ignored — so a customer got the drink whether or not they
 * paid, and no caller could ever observe a state other than IDLE.
 */
public class AwaitingPaymentState implements CoffeeMachineState {

    private static final AwaitingPaymentState INSTANCE = new AwaitingPaymentState();

    private AwaitingPaymentState() {
    }

    public static AwaitingPaymentState getInstance() {
        return INSTANCE;
    }

    @Override
    public Order placeOrder(CoffeeMachineImpl machine, BeverageType type) {
        throw new IllegalStateException(
                "Machine is awaiting payment for the current order — pay or cancel first");
    }

    @Override
    public boolean processPayment(CoffeeMachineImpl machine, String orderId, Payment payment) {
        return machine.doPayAndDispense(orderId, payment);
    }

    @Override
    public void cancelOrder(CoffeeMachineImpl machine) {
        machine.doCancel();
    }

    @Override
    public String getStateName() {
        return "AWAITING_PAYMENT";
    }
}
```

</details>

### `state/CoffeeMachineState.java`

<details>
<summary>Click to view state/CoffeeMachineState.java</summary>

```java
package com.you.lld.problems.coffeemachine.state;

import com.you.lld.problems.coffeemachine.service.impl.CoffeeMachineImpl;
import com.you.lld.problems.coffeemachine.model.BeverageType;
import com.you.lld.problems.coffeemachine.model.Order;
import com.you.lld.problems.coffeemachine.model.Payment;

/**
 * State pattern for the machine lifecycle:
 * {@code IDLE -> AWAITING_PAYMENT -> DISPENSING -> IDLE}.
 *
 * <p>The old comment described {@code IDLE -> DISPENSING -> IDLE}, but both
 * transitions happened inside one synchronized call, so no caller could observe
 * anything but IDLE — and payment was checked only after the drink was made.
 */
public interface CoffeeMachineState {
    Order placeOrder(CoffeeMachineImpl machine, BeverageType type);

    boolean processPayment(CoffeeMachineImpl machine, String orderId, Payment payment);

    /** Abandon the selected order. Legal only while awaiting payment. */
    void cancelOrder(CoffeeMachineImpl machine);

    String getStateName();
}
```

</details>

### `state/DispensingState.java`

<details>
<summary>Click to view state/DispensingState.java</summary>

```java
package com.you.lld.problems.coffeemachine.state;

import com.you.lld.problems.coffeemachine.model.BeverageType;
import com.you.lld.problems.coffeemachine.model.Order;
import com.you.lld.problems.coffeemachine.model.Payment;
import com.you.lld.problems.coffeemachine.service.impl.CoffeeMachineImpl;

/**
 * Dispensing — machine is brewing; rejects concurrent orders.
 */
public class DispensingState implements CoffeeMachineState {
    private static final DispensingState INSTANCE = new DispensingState();

    private DispensingState() {}

    public static DispensingState getInstance() {
        return INSTANCE;
    }

    @Override
    public Order placeOrder(CoffeeMachineImpl machine, BeverageType type) {
        throw new IllegalStateException("Machine is dispensing — please wait");
    }

    @Override
    public boolean processPayment(CoffeeMachineImpl machine, String orderId, Payment payment) {
        throw new IllegalStateException("Cannot pay while dispensing");
    }

    @Override
    public void cancelOrder(CoffeeMachineImpl machine) {
        throw new IllegalStateException("Cannot cancel while dispensing");
    }

    @Override
    public String getStateName() {
        return "DISPENSING";
    }
}
```

</details>

### `state/IdleState.java`

<details>
<summary>Click to view state/IdleState.java</summary>

```java
package com.you.lld.problems.coffeemachine.state;

import com.you.lld.problems.coffeemachine.model.Beverage;
import com.you.lld.problems.coffeemachine.model.BeverageType;
import com.you.lld.problems.coffeemachine.model.Order;
import com.you.lld.problems.coffeemachine.model.Payment;
import com.you.lld.problems.coffeemachine.service.impl.CoffeeMachineImpl;

/**
 * Idle — accepts a beverage selection; transitions to AwaitingPayment.
 */
public class IdleState implements CoffeeMachineState {
    private static final IdleState INSTANCE = new IdleState();

    private IdleState() {}

    public static IdleState getInstance() {
        return INSTANCE;
    }

    @Override
    public Order placeOrder(CoffeeMachineImpl machine, BeverageType type) {
        Beverage beverage = machine.getBeverage(type);
        if (beverage == null) {
            throw new IllegalArgumentException("Beverage not available: " + type);
        }
        // Selection only: check stock, reserve nothing, consume nothing. The drink
        // is not made until it has been paid for.
        Order order = machine.doSelect(beverage);
        machine.setState(AwaitingPaymentState.getInstance());
        return order;
    }

    @Override
    public boolean processPayment(CoffeeMachineImpl machine, String orderId, Payment payment) {
        throw new IllegalStateException("No order is awaiting payment — select a beverage first");
    }

    @Override
    public void cancelOrder(CoffeeMachineImpl machine) {
        throw new IllegalStateException("Nothing to cancel");
    }

    @Override
    public String getStateName() {
        return "IDLE";
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.coffeemachine.CoffeeMachineDemo"
```

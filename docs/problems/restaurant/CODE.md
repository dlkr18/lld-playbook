# restaurant - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/restaurant/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py restaurant`.

## Project Structure (17 files)

```
restaurant/
├── RestaurantDemo.java
├── Restaurant.java
├── model/Bill.java
├── model/Customer.java
├── model/MenuItem.java
├── model/Order.java
├── model/OrderStatus.java
├── model/Reservation.java
├── model/Table.java
├── model/TableStatus.java
├── service/RestaurantService.java
├── service/TableAllocationStrategy.java
├── service/impl/BestFitTableAllocation.java
├── service/impl/InMemoryRestaurantService.java
├── exceptions/OrderNotFoundException.java
├── exceptions/ReservationNotFoundException.java
├── exceptions/TableNotFoundException.java
```

## Source Code

### `RestaurantDemo.java`

<details>
<summary>Click to view RestaurantDemo.java</summary>

```java
package com.you.lld.problems.restaurant;

import com.you.lld.problems.restaurant.model.*;
import com.you.lld.problems.restaurant.service.RestaurantService;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Interview-style demo: reservations, best-fit allocation, order state machine, billing.
 */
public class RestaurantDemo {

    private static Order servedOrder;

    public static void main(String[] args) {
        System.out.println("=== Restaurant Management Demo ===\n");

        Restaurant app = new Restaurant();
        RestaurantService service = app.service();

        service.addTable(new Table("T1", 2));
        service.addTable(new Table("T2", 4));
        service.addTable(new Table("T3", 6));
        service.addTable(new Table("T4", 8));

        demoReservations(service);
        demoBestFitAllocation(service);
        demoOrderLifecycle(service);
        demoBillingAndTableRelease(service);
        demoInvalidTransitions(service);

        System.out.println("\n=== Demo complete ===");
    }

    private static void demoReservations(RestaurantService service) {
        System.out.println("--- Demo 1: Reservations ---");
        Reservation res = service.makeReservation("cust-1", "T2",
                LocalDateTime.now().plusHours(2), 3);
        System.out.println("Reserved " + res.getTableId() + ": " + res.getReservationId());
        System.out.println("T2 status: " + service.getTable("T2").getStatus());

        try {
            service.makeReservation("cust-2", "T2", LocalDateTime.now().plusHours(3), 2);
        } catch (IllegalStateException e) {
            System.out.println("Double-reserve blocked: " + e.getMessage());
        }

        service.cancelReservation(res.getReservationId());
        System.out.println("After cancel, T2: " + service.getTable("T2").getStatus());
        System.out.println();
    }

    private static void demoBestFitAllocation(RestaurantService service) {
        System.out.println("--- Demo 2: Best-fit table allocation ---");
        Table best = service.findTable(5);
        System.out.println("Party of 5 → " + (best != null
                ? best.getTableId() + " (" + best.getCapacity() + " seats)"
                : "none"));
        Table tight = service.findTable(2);
        System.out.println("Party of 2 → " + tight.getTableId() + " (smallest fit, not T4)");
        System.out.println();
    }

    private static void demoOrderLifecycle(RestaurantService service) {
        System.out.println("--- Demo 3: Order state machine ---");
        servedOrder = service.createOrder("T3");
        service.addItemToOrder(servedOrder.getOrderId(), new MenuItem("M1", "Margherita Pizza", 12.99));
        service.addItemToOrder(servedOrder.getOrderId(), new MenuItem("M2", "Caesar Salad", 8.99));
        System.out.println("Created order " + servedOrder.getOrderId() + ", status=" + servedOrder.getStatus());

        service.updateOrderStatus(servedOrder.getOrderId(), OrderStatus.PREPARING);
        service.updateOrderStatus(servedOrder.getOrderId(), OrderStatus.READY);
        service.updateOrderStatus(servedOrder.getOrderId(), OrderStatus.SERVED);
        System.out.println("Kitchen flow → " + servedOrder.getStatus());
        System.out.println();
    }

    private static void demoBillingAndTableRelease(RestaurantService service) {
        System.out.println("--- Demo 4: Billing & table release ---");
        Bill bill = service.generateBill(servedOrder.getOrderId());
        System.out.println("Bill total (10% tax): $" + String.format("%.2f", bill.getTotal()));
        System.out.println("Order → " + servedOrder.getStatus() + ", T3 → "
                + service.getTable("T3").getStatus());

        List<Table> available = service.getAvailableTables();
        System.out.println("Available tables: " + available.size());
        System.out.println();
    }

    private static void demoInvalidTransitions(RestaurantService service) {
        System.out.println("--- Demo 5: Invalid transition guard ---");
        Order order = service.createOrder("T1");
        try {
            service.updateOrderStatus(order.getOrderId(), OrderStatus.PAID);
        } catch (IllegalStateException e) {
            System.out.println("Skip-to-PAID blocked: " + e.getMessage());
        }
        try {
            service.generateBill(order.getOrderId());
        } catch (IllegalStateException e) {
            System.out.println("Bill-before-SERVED blocked: " + e.getMessage());
        }
        System.out.println();
    }
}
```

</details>

### `Restaurant.java`

<details>
<summary>Click to view Restaurant.java</summary>

```java
package com.you.lld.problems.restaurant;

import com.you.lld.problems.restaurant.service.RestaurantService;
import com.you.lld.problems.restaurant.service.impl.InMemoryRestaurantService;

/**
 * Facade for restaurant management.
 */
public final class Restaurant {

    private final RestaurantService service;

    public Restaurant() {
        this(new InMemoryRestaurantService());
    }

    public Restaurant(RestaurantService service) {
        this.service = service;
    }

    public RestaurantService service() {
        return service;
    }
}
```

</details>

### `model/Bill.java`

<details>
<summary>Click to view model/Bill.java</summary>

```java
package com.you.lld.problems.restaurant.model;
public
class Bill  {
    private String billId;
    private double amount, tax, total;
    public Bill(String id, double amt)  {
        billId=id;
        amount=amt;
        tax=amt*0.1;
        total=amount+tax;
    }
    public double getTotal()  {
        return total;
    }
}
```

</details>

### `model/Customer.java`

<details>
<summary>Click to view model/Customer.java</summary>

```java
package com.you.lld.problems.restaurant.model;
public
class Customer  {
    private String customerId, name, phone;
    public Customer(String id, String n, String p)  {
        customerId=id;
        name=n;
        phone=p;
    }
    public String getCustomerId()  {
        return customerId;
    }
    public String getName()  {
        return name;
    }
}
```

</details>

### `model/MenuItem.java`

<details>
<summary>Click to view model/MenuItem.java</summary>

```java
package com.you.lld.problems.restaurant.model;
public
class MenuItem  {
    private String itemId, name;
    private double price;
    public MenuItem(String id, String n, double p)  {
        itemId=id;
        name=n;
        price=p;
    }
    public String getItemId()  {
        return itemId;
    }
    public String getName()  {
        return name;
    }
    public double getPrice()  {
        return price;
    }
}
```

</details>

### `model/Order.java`

<details>
<summary>Click to view model/Order.java</summary>

```java
package com.you.lld.problems.restaurant.model;

import java.util.*;

/**
 * Order with explicit state-machine transitions.
 */
public class Order {
    private final String orderId;
    private final List<MenuItem> items = new ArrayList<MenuItem>();
    private OrderStatus status;

    public Order(String id) {
        this.orderId = id;
        this.status = OrderStatus.PENDING;
    }

    public String getOrderId() {
        return orderId;
    }

    public void addItem(MenuItem item) {
        if (status != OrderStatus.PENDING) {
            throw new IllegalStateException("Cannot add items in state: " + status);
        }
        items.add(item);
    }

    public List<MenuItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void transitionTo(OrderStatus next) {
        if (!isValidTransition(status, next)) {
            throw new IllegalStateException("Invalid transition: " + status + " → " + next);
        }
        status = next;
    }

    private static boolean isValidTransition(OrderStatus from, OrderStatus to) {
        if (from == to) {
            return true;
        }
        switch (from) {
            case PENDING:
                return to == OrderStatus.PREPARING || to == OrderStatus.CANCELLED;
            case PREPARING:
                return to == OrderStatus.READY || to == OrderStatus.CANCELLED;
            case READY:
                return to == OrderStatus.SERVED || to == OrderStatus.CANCELLED;
            case SERVED:
                return to == OrderStatus.PAID;
            case PAID:
            case CANCELLED:
                return false;
            default:
                return false;
        }
    }
}
```

</details>

### `model/OrderStatus.java`

<details>
<summary>Click to view model/OrderStatus.java</summary>

```java
package com.you.lld.problems.restaurant.model;
public enum OrderStatus { PENDING, PREPARING, READY, SERVED, PAID, CANCELLED }
```

</details>

### `model/Reservation.java`

<details>
<summary>Click to view model/Reservation.java</summary>

```java
package com.you.lld.problems.restaurant.model;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * A booking of one table for a half-open time window {@code [start, end)}.
 *
 * <p>A reservation is a claim on a <b>time range</b>, not on the table forever.
 * Modelling it as a bare instant (and flipping the table to RESERVED) meant one
 * booking for next Tuesday made the table unbookable and unseatable for every
 * other moment — see the overlap check in the service.
 */
public class Reservation {

    /** How long a table is held for a sitting. Real systems vary this by party size. */
    public static final Duration DEFAULT_SITTING = Duration.ofMinutes(90);

    private final String reservationId;
    private final String customerId;
    private final String tableId;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
    private final int partySize;

    public Reservation(String id, String customerId, String tableId,
                       LocalDateTime startTime, int partySize) {
        this(id, customerId, tableId, startTime, startTime.plus(DEFAULT_SITTING), partySize);
    }

    public Reservation(String id, String customerId, String tableId,
                       LocalDateTime startTime, LocalDateTime endTime, int partySize) {
        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException("Reservation must start before it ends");
        }
        if (partySize <= 0) {
            throw new IllegalArgumentException("Party size must be positive");
        }
        this.reservationId = id;
        this.customerId = customerId;
        this.tableId = tableId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.partySize = partySize;
    }

    /** Half-open overlap: a booking ending at 19:00 does not clash with one starting at 19:00. */
    public boolean overlaps(LocalDateTime otherStart, LocalDateTime otherEnd) {
        return startTime.isBefore(otherEnd) && otherStart.isBefore(endTime);
    }

    public boolean coversInstant(LocalDateTime instant) {
        return !instant.isBefore(startTime) && instant.isBefore(endTime);
    }

    public String getReservationId() {
        return reservationId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public String getTableId() {
        return tableId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public int getPartySize() {
        return partySize;
    }

    @Override
    public String toString() {
        return reservationId + "{table=" + tableId + ", " + startTime + " -> " + endTime
                + ", party=" + partySize + "}";
    }
}
```

</details>

### `model/Table.java`

<details>
<summary>Click to view model/Table.java</summary>

```java
package com.you.lld.problems.restaurant.model;
public
class Table  {
    private String tableId;
    private int capacity;
    private TableStatus status;
    public Table(String id, int cap)  {
        tableId=id;
        capacity=cap;
        status=TableStatus.AVAILABLE;
    }
    public String getTableId()  {
        return tableId;
    }
    public int getCapacity()  {
        return capacity;
    }
    public TableStatus getStatus()  {
        return status;
    }
    public void setStatus(TableStatus s)  {
        status=s;
    }
}
```

</details>

### `model/TableStatus.java`

<details>
<summary>Click to view model/TableStatus.java</summary>

```java
package com.you.lld.problems.restaurant.model;
public enum TableStatus { AVAILABLE, OCCUPIED, RESERVED }
```

</details>

### `service/RestaurantService.java`

<details>
<summary>Click to view service/RestaurantService.java</summary>

```java
package com.you.lld.problems.restaurant.service;

import com.you.lld.problems.restaurant.model.*;

import java.time.LocalDateTime;
import java.util.List;

public interface RestaurantService {

    void addTable(Table table);

    Table getTable(String tableId);

    Reservation makeReservation(String customerId, String tableId, LocalDateTime dateTime, int partySize);

    void cancelReservation(String reservationId);

    Table findTable(int partySize);

    List<Table> getAvailableTables();

    Order createOrder(String tableId);

    void addItemToOrder(String orderId, MenuItem item);

    void updateOrderStatus(String orderId, OrderStatus status);

    Bill generateBill(String orderId);
}
```

</details>

### `service/TableAllocationStrategy.java`

<details>
<summary>Click to view service/TableAllocationStrategy.java</summary>

```java
package com.you.lld.problems.restaurant.service;

import com.you.lld.problems.restaurant.model.Table;

import java.util.Collection;

/**
 * Strategy for selecting a table given party size and availability.
 */
public interface TableAllocationStrategy {

    Table allocate(Collection<Table> tables, int partySize);
}
```

</details>

### `service/impl/BestFitTableAllocation.java`

<details>
<summary>Click to view service/impl/BestFitTableAllocation.java</summary>

```java
package com.you.lld.problems.restaurant.service.impl;

import com.you.lld.problems.restaurant.model.Table;
import com.you.lld.problems.restaurant.model.TableStatus;
import com.you.lld.problems.restaurant.service.TableAllocationStrategy;

import java.util.Collection;

/**
 * Best-fit: smallest available table that fits the party (minimize wasted seats).
 */
public final class BestFitTableAllocation implements TableAllocationStrategy {

    @Override
    public Table allocate(Collection<Table> tables, int partySize) {
        if (partySize <= 0) {
            throw new IllegalArgumentException("Party size must be positive");
        }
        Table best = null;
        for (Table t : tables) {
            if (t.getStatus() == TableStatus.AVAILABLE && t.getCapacity() >= partySize) {
                if (best == null || t.getCapacity() < best.getCapacity()) {
                    best = t;
                }
            }
        }
        return best;
    }
}
```

</details>

### `service/impl/InMemoryRestaurantService.java`

<details>
<summary>Click to view service/impl/InMemoryRestaurantService.java</summary>

```java
package com.you.lld.problems.restaurant.service.impl;

import com.you.lld.problems.restaurant.exceptions.*;
import com.you.lld.problems.restaurant.model.*;
import com.you.lld.problems.restaurant.service.RestaurantService;
import com.you.lld.problems.restaurant.service.TableAllocationStrategy;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Thread-safe restaurant: best-fit table allocation, order state machine, reservations.
 */
public final class InMemoryRestaurantService implements RestaurantService {

    private final Map<String, Table> tables = new ConcurrentHashMap<String, Table>();
    private final Map<String, Reservation> reservations = new ConcurrentHashMap<String, Reservation>();
    private final Map<String, Order> orders = new ConcurrentHashMap<String, Order>();
    private final Map<String, String> tableToOrder = new ConcurrentHashMap<String, String>();
    private final Map<String, String> orderToTable = new ConcurrentHashMap<String, String>();
    /** Per-table bookings ordered by start time — O(log n) overlap check, as in meetingscheduler. */
    private final Map<String, TreeMap<LocalDateTime, Reservation>> bookings =
            new ConcurrentHashMap<String, TreeMap<LocalDateTime, Reservation>>();
    private final TableAllocationStrategy allocationStrategy;
    private final AtomicLong reservationCounter = new AtomicLong(0);
    private final AtomicLong orderCounter = new AtomicLong(0);
    private final AtomicLong billCounter = new AtomicLong(0);

    public InMemoryRestaurantService() {
        this(new BestFitTableAllocation());
    }

    public InMemoryRestaurantService(TableAllocationStrategy allocationStrategy) {
        this.allocationStrategy = allocationStrategy;
    }

    @Override
    public void addTable(Table table) {
        if (table == null) {
            throw new IllegalArgumentException("Table cannot be null");
        }
        tables.put(table.getTableId(), table);
    }

    @Override
    public Table getTable(String tableId) {
        Table table = tables.get(tableId);
        if (table == null) {
            throw new TableNotFoundException("Table not found: " + tableId);
        }
        return table;
    }

    @Override
    public Reservation makeReservation(String customerId, String tableId,
                                       LocalDateTime dateTime, int partySize) {
        if (customerId == null) {
            throw new IllegalArgumentException("Customer ID required");
        }
        Table table = getTable(tableId);
        synchronized (table) {
            if (partySize > table.getCapacity()) {
                throw new IllegalArgumentException("Party size " + partySize
                        + " exceeds table capacity " + table.getCapacity());
            }
            LocalDateTime end = dateTime.plus(Reservation.DEFAULT_SITTING);
            Reservation clash = findOverlap(tableId, dateTime, end);
            if (clash != null) {
                throw new IllegalStateException("Table " + tableId + " is already booked for "
                        + clash.getStartTime() + " - " + clash.getEndTime());
            }

            String resId = "RES-" + reservationCounter.incrementAndGet();
            Reservation res = new Reservation(resId, customerId, tableId, dateTime, partySize);
            reservations.put(resId, res);
            bookingsFor(tableId).put(dateTime, res);
            // Deliberately NOT table.setStatus(RESERVED): status describes the table
            // RIGHT NOW. A booking for next Tuesday must not make it unusable today.
            return res;
        }
    }

    private TreeMap<LocalDateTime, Reservation> bookingsFor(String tableId) {
        TreeMap<LocalDateTime, Reservation> existing = bookings.get(tableId);
        if (existing != null) {
            return existing;
        }
        TreeMap<LocalDateTime, Reservation> created = new TreeMap<LocalDateTime, Reservation>();
        TreeMap<LocalDateTime, Reservation> raced = bookings.putIfAbsent(tableId, created);
        return raced != null ? raced : created;
    }

    /**
     * At most two existing bookings can clash with [start, end): the one starting
     * latest at or before start, and the one starting first at or after it.
     * Both lookups are O(log n) — the "My Calendar I" trick.
     */
    private Reservation findOverlap(String tableId, LocalDateTime start, LocalDateTime end) {
        TreeMap<LocalDateTime, Reservation> byStart = bookings.get(tableId);
        if (byStart == null) {
            return null;
        }
        Map.Entry<LocalDateTime, Reservation> floor = byStart.floorEntry(start);
        if (floor != null && floor.getValue().overlaps(start, end)) {
            return floor.getValue();
        }
        Map.Entry<LocalDateTime, Reservation> ceiling = byStart.ceilingEntry(start);
        if (ceiling != null && ceiling.getValue().overlaps(start, end)) {
            return ceiling.getValue();
        }
        return null;
    }

    /** True if a booking is in force for this table at {@code instant}. */
    private boolean isReservedAt(String tableId, LocalDateTime instant) {
        TreeMap<LocalDateTime, Reservation> byStart = bookings.get(tableId);
        if (byStart == null) {
            return false;
        }
        Map.Entry<LocalDateTime, Reservation> floor = byStart.floorEntry(instant);
        return floor != null && floor.getValue().coversInstant(instant);
    }

    @Override
    public void cancelReservation(String reservationId) {
        Reservation res = reservations.remove(reservationId);
        if (res == null) {
            throw new ReservationNotFoundException("Reservation not found: " + reservationId);
        }
        TreeMap<LocalDateTime, Reservation> byStart = bookings.get(res.getTableId());
        if (byStart != null) {
            byStart.remove(res.getStartTime());
        }
    }

    @Override
    public Table findTable(int partySize) {
        return allocationStrategy.allocate(tables.values(), partySize);
    }

    @Override
    public List<Table> getAvailableTables() {
        LocalDateTime now = LocalDateTime.now();
        List<Table> available = new ArrayList<Table>();
        for (Table t : tables.values()) {
            if (t.getStatus() == TableStatus.AVAILABLE && !isReservedAt(t.getTableId(), now)) {
                available.add(t);
            }
        }
        return available;
    }

    @Override
    public Order createOrder(String tableId) {
        Table table = getTable(tableId);
        synchronized (table) {
            // Without this check a second party could be seated at an occupied table,
            // and tableToOrder.put would overwrite the first order's mapping — leaving
            // that order unbillable and the table never released.
            if (table.getStatus() == TableStatus.OCCUPIED) {
                throw new IllegalStateException("Table " + tableId + " is already occupied by order "
                        + tableToOrder.get(tableId));
            }
            table.setStatus(TableStatus.OCCUPIED);
            String orderId = "ORD-" + orderCounter.incrementAndGet();
            Order order = new Order(orderId);
            orders.put(orderId, order);
            tableToOrder.put(tableId, orderId);
            orderToTable.put(orderId, tableId);
            return order;
        }
    }

    @Override
    public void addItemToOrder(String orderId, MenuItem item) {
        Order order = orders.get(orderId);
        if (order == null) {
            throw new OrderNotFoundException("Order not found: " + orderId);
        }
        order.addItem(item);
    }

    @Override
    public void updateOrderStatus(String orderId, OrderStatus status) {
        Order order = orders.get(orderId);
        if (order == null) {
            throw new OrderNotFoundException("Order not found: " + orderId);
        }
        order.transitionTo(status);
    }

    @Override
    public Bill generateBill(String orderId) {
        Order order = orders.get(orderId);
        if (order == null) {
            throw new OrderNotFoundException("Order not found: " + orderId);
        }
        if (order.getStatus() != OrderStatus.SERVED) {
            throw new IllegalStateException("Bill only after SERVED; current=" + order.getStatus());
        }

        double subtotal = 0;
        for (MenuItem item : order.getItems()) {
            subtotal += item.getPrice();
        }

        String billId = "BILL-" + billCounter.incrementAndGet();
        Bill bill = new Bill(billId, subtotal);
        order.transitionTo(OrderStatus.PAID);

        String tableId = orderToTable.remove(orderId);
        if (tableId != null) {
            tableToOrder.remove(tableId);
            Table table = tables.get(tableId);
            if (table != null) {
                synchronized (table) {
                    table.setStatus(TableStatus.AVAILABLE);
                }
            }
        }
        return bill;
    }
}
```

</details>

### `exceptions/OrderNotFoundException.java`

<details>
<summary>Click to view exceptions/OrderNotFoundException.java</summary>

```java
package com.you.lld.problems.restaurant.exceptions;
public class OrderNotFoundException extends RuntimeException { public OrderNotFoundException(String m) { super(m); } }
```

</details>

### `exceptions/ReservationNotFoundException.java`

<details>
<summary>Click to view exceptions/ReservationNotFoundException.java</summary>

```java
package com.you.lld.problems.restaurant.exceptions;
public class ReservationNotFoundException extends RuntimeException { public ReservationNotFoundException(String m) { super(m); } }
```

</details>

### `exceptions/TableNotFoundException.java`

<details>
<summary>Click to view exceptions/TableNotFoundException.java</summary>

```java
package com.you.lld.problems.restaurant.exceptions;
public class TableNotFoundException extends RuntimeException { public TableNotFoundException(String m) { super(m); } }
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.restaurant.RestaurantDemo"
```

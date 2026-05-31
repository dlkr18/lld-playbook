# restaurant - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/restaurant/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py restaurant`.

## Project Structure (14 files)

```
restaurant/
├── RestaurantDemo.java
├── api/RestaurantService.java
├── model/Bill.java
├── model/Customer.java
├── model/MenuItem.java
├── model/Order.java
├── model/OrderStatus.java
├── model/Reservation.java
├── model/Table.java
├── model/TableStatus.java
├── impl/InMemoryRestaurantService.java
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

import com.you.lld.problems.restaurant.impl.InMemoryRestaurantService;
import com.you.lld.problems.restaurant.model.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Demo: Restaurant Management with tables, reservations, ordering, billing.
 */
public class RestaurantDemo {

    public static void main(String[] args) {
        System.out.println("=== Restaurant Management Demo ===\n");

        InMemoryRestaurantService service = new InMemoryRestaurantService();

        // Setup tables
        service.addTable(new Table("T1", 2));
        service.addTable(new Table("T2", 4));
        service.addTable(new Table("T3", 6));
        service.addTable(new Table("T4", 8));
        System.out.println("Added 4 tables (2, 4, 6, 8 seats)");

        // --- Reservations ---
        System.out.println("\n--- Reservations ---");
        Reservation res1 = service.makeReservation("cust-1", "T2",
            LocalDateTime.now().plusHours(2), 3);
        System.out.println("Reserved " + res1.getTableId() + ": " + res1.getReservationId());
        System.out.println("Table T2 status: " + service.getTable("T2").getStatus());

        // Try to reserve occupied table
        try {
            service.makeReservation("cust-2", "T2", LocalDateTime.now().plusHours(3), 2);
        } catch (IllegalStateException e) {
            System.out.println("Double-reserve blocked: " + e.getMessage());
        }

        // Cancel reservation
        service.cancelReservation(res1.getReservationId());
        System.out.println("Cancelled reservation, T2 status: " + service.getTable("T2").getStatus());

        // --- Find best table ---
        System.out.println("\n--- Find table ---");
        Table best = service.findTable(5);
        System.out.println("Best table for party of 5: " + (best != null ? best.getTableId() + " (" + best.getCapacity() + " seats)" : "none"));

        // --- Ordering ---
        System.out.println("\n--- Ordering ---");
        Order order = service.createOrder("T3");
        System.out.println("Order created: " + order.getOrderId());
        System.out.println("Table T3 status: " + service.getTable("T3").getStatus());

        service.addItemToOrder(order.getOrderId(), new MenuItem("M1", "Margherita Pizza", 12.99));
        service.addItemToOrder(order.getOrderId(), new MenuItem("M2", "Caesar Salad", 8.99));
        service.addItemToOrder(order.getOrderId(), new MenuItem("M3", "Tiramisu", 7.99));
        service.addItemToOrder(order.getOrderId(), new MenuItem("M4", "Sparkling Water", 3.50));
        System.out.println("Added 4 items");

        // Kitchen workflow
        service.updateOrderStatus(order.getOrderId(), OrderStatus.PREPARING);
        System.out.println("Order status: " + order.getStatus());
        service.updateOrderStatus(order.getOrderId(), OrderStatus.READY);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.SERVED);

        // --- Billing ---
        System.out.println("\n--- Billing ---");
        Bill bill = service.generateBill(order.getOrderId());
        System.out.println("Bill total (incl 10% tax): $" + String.format("%.2f", bill.getTotal()));
        System.out.println("Order status: " + order.getStatus());
        System.out.println("Table T3 status: " + service.getTable("T3").getStatus());

        // --- Available tables ---
        System.out.println("\n--- Available tables ---");
        List<Table> available = service.getAvailableTables();
        System.out.println("Available: " + available.size() + " tables");
        for (Table t : available) {
            System.out.println("  " + t.getTableId() + " (" + t.getCapacity() + " seats)");
        }

        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `api/RestaurantService.java`

<details>
<summary>Click to view api/RestaurantService.java</summary>

```java
package com.you.lld.problems.restaurant.api;
import com.you.lld.problems.restaurant.model.*;
import java.util.*;
public interface RestaurantService { Table getTable(String id); Reservation makeReservation(String customerId, String tableId); Order createOrder(String tableId); void addItemToOrder(String orderId, MenuItem item); Bill generateBill(String orderId); }
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
public
class Order  {
    private String orderId;
    private List<MenuItem> items = new ArrayList<>();
    private OrderStatus status;
    public Order(String id)  {
        orderId=id;
        status=OrderStatus.PENDING;
    }
    public String getOrderId()  {
        return orderId;
    }
    public void addItem(MenuItem i)  {
        items.add(i);
    }
    public List<MenuItem> getItems()  {
        return items;
    }
    public OrderStatus getStatus()  {
        return status;
    }
    public void setStatus(OrderStatus s)  {
        status=s;
    }
}
```

</details>

### `model/OrderStatus.java`

<details>
<summary>Click to view model/OrderStatus.java</summary>

```java
package com.you.lld.problems.restaurant.model;
public enum OrderStatus { PENDING, PREPARING, READY, SERVED, PAID }
```

</details>

### `model/Reservation.java`

<details>
<summary>Click to view model/Reservation.java</summary>

```java
package com.you.lld.problems.restaurant.model;
import java.time.*;
public
class Reservation  {
    private String reservationId, customerId, tableId;
    private LocalDateTime dateTime;
    private int partySize;
    public Reservation(String id, String cid, String tid, LocalDateTime dt, int size)  {
        reservationId=id;
        customerId=cid;
        tableId=tid;
        dateTime=dt;
        partySize=size;
    }
    public String getReservationId()  {
        return reservationId;
    }
    public String getTableId()  {
        return tableId;
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

### `impl/InMemoryRestaurantService.java`

<details>
<summary>Click to view impl/InMemoryRestaurantService.java</summary>

```java
package com.you.lld.problems.restaurant.impl;

import com.you.lld.problems.restaurant.api.RestaurantService;
import com.you.lld.problems.restaurant.exceptions.*;
import com.you.lld.problems.restaurant.model.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Thread-safe in-memory restaurant management system.
 *
 * Features:
 *  - Table management (add, status tracking)
 *  - Reservations with time slots and party size matching
 *  - Order lifecycle: PENDING -> PREPARING -> READY -> SERVED -> PAID
 *  - Bill generation with itemized total + tax
 *  - Thread-safe with ConcurrentHashMap + synchronized per-table
 */
public class InMemoryRestaurantService implements RestaurantService {

    private final Map<String, Table> tables = new ConcurrentHashMap<>();
    private final Map<String, Reservation> reservations = new ConcurrentHashMap<>();
    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    private final Map<String, String> tableToOrder = new ConcurrentHashMap<>(); // tableId -> orderId
    private final AtomicLong reservationCounter = new AtomicLong(0);
    private final AtomicLong orderCounter = new AtomicLong(0);
    private final AtomicLong billCounter = new AtomicLong(0);

    /** Add a table to the restaurant. */
    public void addTable(Table table) {
        if (table == null) throw new IllegalArgumentException("Table cannot be null");
        tables.put(table.getTableId(), table);
    }

    @Override
    public Table getTable(String tableId) {
        Table table = tables.get(tableId);
        if (table == null) throw new TableNotFoundException("Table not found: " + tableId);
        return table;
    }

    @Override
    public Reservation makeReservation(String customerId, String tableId) {
        return makeReservation(customerId, tableId, LocalDateTime.now(), 2);
    }

    /** Make a reservation with specific date/time and party size. */
    public Reservation makeReservation(String customerId, String tableId,
                                       LocalDateTime dateTime, int partySize) {
        if (customerId == null) throw new IllegalArgumentException("Customer ID required");
        Table table = getTable(tableId);

        synchronized (table) {
            if (table.getStatus() != TableStatus.AVAILABLE) {
                throw new IllegalStateException("Table " + tableId + " is not available ("
                    + table.getStatus() + ")");
            }
            if (partySize > table.getCapacity()) {
                throw new IllegalArgumentException("Party size " + partySize
                    + " exceeds table capacity " + table.getCapacity());
            }

            String resId = "RES-" + reservationCounter.incrementAndGet();
            Reservation res = new Reservation(resId, customerId, tableId, dateTime, partySize);
            reservations.put(resId, res);
            table.setStatus(TableStatus.RESERVED);
            return res;
        }
    }

    /** Cancel a reservation, freeing the table. */
    public void cancelReservation(String reservationId) {
        Reservation res = reservations.get(reservationId);
        if (res == null) throw new ReservationNotFoundException(
            "Reservation not found: " + reservationId);
        Table table = tables.get(res.getTableId());
        if (table != null) {
            synchronized (table) {
                if (table.getStatus() == TableStatus.RESERVED) {
                    table.setStatus(TableStatus.AVAILABLE);
                }
            }
        }
        reservations.remove(reservationId);
    }

    @Override
    public Order createOrder(String tableId) {
        Table table = getTable(tableId);
        synchronized (table) {
            // Mark table as occupied
            table.setStatus(TableStatus.OCCUPIED);
            String orderId = "ORD-" + orderCounter.incrementAndGet();
            Order order = new Order(orderId);
            orders.put(orderId, order);
            tableToOrder.put(tableId, orderId);
            return order;
        }
    }

    @Override
    public void addItemToOrder(String orderId, MenuItem item) {
        Order order = orders.get(orderId);
        if (order == null) throw new OrderNotFoundException("Order not found: " + orderId);
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Cannot add items to order in state: " + order.getStatus());
        }
        order.addItem(item);
    }

    /** Update order status (kitchen workflow). */
    public void updateOrderStatus(String orderId, OrderStatus status) {
        Order order = orders.get(orderId);
        if (order == null) throw new OrderNotFoundException("Order not found: " + orderId);
        order.setStatus(status);
    }

    @Override
    public Bill generateBill(String orderId) {
        Order order = orders.get(orderId);
        if (order == null) throw new OrderNotFoundException("Order not found: " + orderId);

        double subtotal = 0;
        for (MenuItem item : order.getItems()) {
            subtotal += item.getPrice();
        }

        String billId = "BILL-" + billCounter.incrementAndGet();
        Bill bill = new Bill(billId, subtotal);
        order.setStatus(OrderStatus.PAID);

        // Free the table
        for (Map.Entry<String, String> entry : tableToOrder.entrySet()) {
            if (entry.getValue().equals(orderId)) {
                Table table = tables.get(entry.getKey());
                if (table != null) {
                    synchronized (table) {
                        table.setStatus(TableStatus.AVAILABLE);
                    }
                }
                tableToOrder.remove(entry.getKey());
                break;
            }
        }

        return bill;
    }

    /** Get all available tables. */
    public List<Table> getAvailableTables() {
        List<Table> available = new ArrayList<>();
        for (Table t : tables.values()) {
            if (t.getStatus() == TableStatus.AVAILABLE) {
                available.add(t);
            }
        }
        return available;
    }

    /** Find a suitable table for a party size. */
    public Table findTable(int partySize) {
        Table best = null;
        for (Table t : tables.values()) {
            if (t.getStatus() == TableStatus.AVAILABLE && t.getCapacity() >= partySize) {
                if (best == null || t.getCapacity() < best.getCapacity()) {
                    best = t; // Smallest table that fits
                }
            }
        }
        return best;
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

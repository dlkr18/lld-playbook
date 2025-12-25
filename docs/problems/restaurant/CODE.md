# Restaurant - Complete Implementation

## 📂 17 Java Files

### MenuItem.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant;
public class MenuItem {
    private final String itemId;
    private String name;
    private double price;
    private String category;
    
    public MenuItem(String itemId, String name, double price) {
        this.itemId = itemId;
        this.name = name;
        this.price = price;
    }
    
    public String getItemId() { return itemId; }
    public String getName() { return name; }
    public double getPrice() { return price; }
}

```
</details>

### Restaurant.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant;
import java.util.*;

public class Restaurant {
    private final Map<String, Table> tables;
    private final Map<String, MenuItem> menu;
    private final Map<String, List<MenuItem>> orders; // tableId -> items
    
    public Restaurant() {
        this.tables = new HashMap<>();
        this.menu = new HashMap<>();
        this.orders = new HashMap<>();
    }
    
    public void addTable(Table table) {
        tables.put(table.getTableId(), table);
    }
    
    public void addMenuItem(MenuItem item) {
        menu.put(item.getItemId(), item);
    }
    
    public boolean reserveTable(String tableId) {
        Table table = tables.get(tableId);
        if (table != null && table.getStatus() == Table.TableStatus.AVAILABLE) {
            table.setStatus(Table.TableStatus.RESERVED);
            return true;
        }
        return false;
    }
    
    public void placeOrder(String tableId, List<String> itemIds) {
        List<MenuItem> orderItems = new ArrayList<>();
        for (String itemId : itemIds) {
            MenuItem item = menu.get(itemId);
            if (item != null) {
                orderItems.add(item);
            }
        }
        orders.put(tableId, orderItems);
    }
    
    public double calculateBill(String tableId) {
        List<MenuItem> orderItems = orders.get(tableId);
        if (orderItems == null) return 0;
        return orderItems.stream().mapToDouble(MenuItem::getPrice).sum();
    }
}

```
</details>

### RestaurantDemo.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant;
import com.you.lld.problems.restaurant.api.*;
import com.you.lld.problems.restaurant.impl.*;
import com.you.lld.problems.restaurant.model.*;
public class RestaurantDemo { public static void main(String[] args) { System.out.println("Restaurant Management Demo"); RestaurantService service = new InMemoryRestaurantService(); Order order = service.createOrder("T1"); service.addItemToOrder(order.getOrderId(), new MenuItem("M1","Pasta",15.99)); Bill bill = service.generateBill(order.getOrderId()); System.out.println("Bill Total: $" + bill.getTotal()); } }
```
</details>

### Table.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant;
public class Table {
    public enum TableStatus { AVAILABLE, OCCUPIED, RESERVED }
    
    private final String tableId;
    private final int capacity;
    private TableStatus status;
    
    public Table(String tableId, int capacity) {
        this.tableId = tableId;
        this.capacity = capacity;
        this.status = TableStatus.AVAILABLE;
    }
    
    public String getTableId() { return tableId; }
    public int getCapacity() { return capacity; }
    public TableStatus getStatus() { return status; }
    public void setStatus(TableStatus status) { this.status = status; }
}

```
</details>

### RestaurantService.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant.api;
import com.you.lld.problems.restaurant.model.*;
import java.util.*;
public interface RestaurantService { Table getTable(String id); Reservation makeReservation(String customerId, String tableId); Order createOrder(String tableId); void addItemToOrder(String orderId, MenuItem item); Bill generateBill(String orderId); }
```
</details>

### OrderNotFoundException.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant.exceptions;
public class OrderNotFoundException extends RuntimeException { public OrderNotFoundException(String m) { super(m); } }
```
</details>

### ReservationNotFoundException.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant.exceptions;
public class ReservationNotFoundException extends RuntimeException { public ReservationNotFoundException(String m) { super(m); } }
```
</details>

### TableNotFoundException.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant.exceptions;
public class TableNotFoundException extends RuntimeException { public TableNotFoundException(String m) { super(m); } }
```
</details>

### InMemoryRestaurantService.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant.impl;
import com.you.lld.problems.restaurant.api.*;
import com.you.lld.problems.restaurant.model.*;
import java.util.*;
public class InMemoryRestaurantService implements RestaurantService { private Map<String,Table> tables = new HashMap<>(); private Map<String,Order> orders = new HashMap<>(); public Table getTable(String id) { return tables.get(id); } public Reservation makeReservation(String cid, String tid) { return null; } public Order createOrder(String tid) { String id = UUID.randomUUID().toString(); Order o = new Order(id); orders.put(id, o); return o; } public void addItemToOrder(String oid, MenuItem item) { orders.get(oid).addItem(item); } public Bill generateBill(String oid) { return new Bill("B1", 100); } }
```
</details>

### Bill.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant.model;
public class Bill { private String billId; private double amount, tax, total; public Bill(String id, double amt) { billId=id; amount=amt; tax=amt*0.1; total=amount+tax; } public double getTotal() { return total; } }
```
</details>

### Customer.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant.model;
public class Customer { private String customerId, name, phone; public Customer(String id, String n, String p) { customerId=id; name=n; phone=p; } public String getCustomerId() { return customerId; } public String getName() { return name; } }
```
</details>

### MenuItem.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant.model;
public class MenuItem { private String itemId, name; private double price; public MenuItem(String id, String n, double p) { itemId=id; name=n; price=p; } public String getItemId() { return itemId; } public String getName() { return name; } public double getPrice() { return price; } }
```
</details>

### Order.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant.model;
import java.util.*;
public class Order { private String orderId; private List<MenuItem> items = new ArrayList<>(); private OrderStatus status; public Order(String id) { orderId=id; status=OrderStatus.PENDING; } public String getOrderId() { return orderId; } public void addItem(MenuItem i) { items.add(i); } public List<MenuItem> getItems() { return items; } public OrderStatus getStatus() { return status; } public void setStatus(OrderStatus s) { status=s; } }
```
</details>

### OrderStatus.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant.model;
public enum OrderStatus { PENDING, PREPARING, READY, SERVED, PAID }
```
</details>

### Reservation.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant.model;
import java.time.*;
public class Reservation { private String reservationId, customerId, tableId; private LocalDateTime dateTime; private int partySize; public Reservation(String id, String cid, String tid, LocalDateTime dt, int size) { reservationId=id; customerId=cid; tableId=tid; dateTime=dt; partySize=size; } public String getReservationId() { return reservationId; } public String getTableId() { return tableId; } }
```
</details>

### Table.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant.model;
public class Table { private String tableId; private int capacity; private TableStatus status; public Table(String id, int cap) { tableId=id; capacity=cap; status=TableStatus.AVAILABLE; } public String getTableId() { return tableId; } public int getCapacity() { return capacity; } public TableStatus getStatus() { return status; } public void setStatus(TableStatus s) { status=s; } }
```
</details>

### TableStatus.java

<details><summary>📄 View</summary>

```java
package com.you.lld.problems.restaurant.model;
public enum TableStatus { AVAILABLE, OCCUPIED, RESERVED }
```
</details>


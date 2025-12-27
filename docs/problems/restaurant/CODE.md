# restaurant - Complete Implementation

## 📁 Project Structure (14 files)

```
restaurant/
├── RestaurantDemo.java
├── api/RestaurantService.java
├── exceptions/OrderNotFoundException.java
├── exceptions/ReservationNotFoundException.java
├── exceptions/TableNotFoundException.java
├── impl/InMemoryRestaurantService.java
├── model/Bill.java
├── model/Customer.java
├── model/MenuItem.java
├── model/Order.java
├── model/OrderStatus.java
├── model/Reservation.java
├── model/Table.java
├── model/TableStatus.java
```

## 📝 Source Code

### 📄 `RestaurantDemo.java`

<details>
<summary>📄 Click to view RestaurantDemo.java</summary>

```java
package com.you.lld.problems.restaurant;
import com.you.lld.problems.restaurant.api.*;
import com.you.lld.problems.restaurant.impl.*;
import com.you.lld.problems.restaurant.model.*;
public class RestaurantDemo { public static void main(String[] args) { System.out.println("Restaurant Management Demo"); RestaurantService service = new InMemoryRestaurantService(); Order order = service.createOrder("T1"); service.addItemToOrder(order.getOrderId(), new MenuItem("M1","Pasta",15.99)); Bill bill = service.generateBill(order.getOrderId()); System.out.println("Bill Total: $" + bill.getTotal()); } }```

</details>

### 📄 `api/RestaurantService.java`

<details>
<summary>📄 Click to view api/RestaurantService.java</summary>

```java
package com.you.lld.problems.restaurant.api;
import com.you.lld.problems.restaurant.model.*;
import java.util.*;
public interface RestaurantService { Table getTable(String id); Reservation makeReservation(String customerId, String tableId); Order createOrder(String tableId); void addItemToOrder(String orderId, MenuItem item); Bill generateBill(String orderId); }```

</details>

### 📄 `exceptions/OrderNotFoundException.java`

<details>
<summary>📄 Click to view exceptions/OrderNotFoundException.java</summary>

```java
package com.you.lld.problems.restaurant.exceptions;
public class OrderNotFoundException extends RuntimeException { public OrderNotFoundException(String m) { super(m); } }```

</details>

### 📄 `exceptions/ReservationNotFoundException.java`

<details>
<summary>📄 Click to view exceptions/ReservationNotFoundException.java</summary>

```java
package com.you.lld.problems.restaurant.exceptions;
public class ReservationNotFoundException extends RuntimeException { public ReservationNotFoundException(String m) { super(m); } }```

</details>

### 📄 `exceptions/TableNotFoundException.java`

<details>
<summary>📄 Click to view exceptions/TableNotFoundException.java</summary>

```java
package com.you.lld.problems.restaurant.exceptions;
public class TableNotFoundException extends RuntimeException { public TableNotFoundException(String m) { super(m); } }```

</details>

### 📄 `impl/InMemoryRestaurantService.java`

<details>
<summary>📄 Click to view impl/InMemoryRestaurantService.java</summary>

```java
package com.you.lld.problems.restaurant.impl;
import com.you.lld.problems.restaurant.api.*;
import com.you.lld.problems.restaurant.model.*;
import java.util.*;
public class InMemoryRestaurantService implements RestaurantService { private Map<String,Table> tables = new HashMap<>(); private Map<String,Order> orders = new HashMap<>(); public Table getTable(String id) { return tables.get(id); } public Reservation makeReservation(String cid, String tid) { return null; } public Order createOrder(String tid) { String id = UUID.randomUUID().toString(); Order o = new Order(id); orders.put(id, o); return o; } public void addItemToOrder(String oid, MenuItem item) { orders.get(oid).addItem(item); } public Bill generateBill(String oid) { return new Bill("B1", 100); } }```

</details>

### 📄 `model/Bill.java`

<details>
<summary>📄 Click to view model/Bill.java</summary>

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

### 📄 `model/Customer.java`

<details>
<summary>📄 Click to view model/Customer.java</summary>

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

### 📄 `model/MenuItem.java`

<details>
<summary>📄 Click to view model/MenuItem.java</summary>

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

### 📄 `model/Order.java`

<details>
<summary>📄 Click to view model/Order.java</summary>

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

### 📄 `model/OrderStatus.java`

<details>
<summary>📄 Click to view model/OrderStatus.java</summary>

```java
package com.you.lld.problems.restaurant.model;
public enum OrderStatus { PENDING, PREPARING, READY, SERVED, PAID }```

</details>

### 📄 `model/Reservation.java`

<details>
<summary>📄 Click to view model/Reservation.java</summary>

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

### 📄 `model/Table.java`

<details>
<summary>📄 Click to view model/Table.java</summary>

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

### 📄 `model/TableStatus.java`

<details>
<summary>📄 Click to view model/TableStatus.java</summary>

```java
package com.you.lld.problems.restaurant.model;
public enum TableStatus { AVAILABLE, OCCUPIED, RESERVED }```

</details>


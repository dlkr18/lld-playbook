# Restaurant Management System

## Problem: Design Restaurant Management System

**Difficulty**: Hard  
**Pattern**: Observer, State, Strategy  
**Time**: 90-120 min

---

## Key Classes

```java
class Restaurant {
    private List<Table> tables;
    private Menu menu;
    private KitchenSystem kitchen;
    private ReservationSystem reservations;
    
    Reservation makeReservation(ReservationRequest request);
    Order placeOrder(String tableId, List<MenuItem> items);
}

class Table {
    String id;
    int capacity;
    TableStatus status; // AVAILABLE, OCCUPIED, RESERVED
}

class Order {
    String id;
    Table table;
    List<OrderItem> items;
    OrderStatus status;
    double totalAmount;
}
```

---

**Status**: ✅ Documented

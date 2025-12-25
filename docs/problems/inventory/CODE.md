# E-Commerce Inventory Management - Complete Implementation 📦

Production-ready **end-to-end e-commerce system** with inventory management, product catalog, user management, order processing, and payment handling. Comprehensive domain-driven design example.

---

## 🎯 **System Overview**

This is a **complete e-commerce platform** including:

✅ **Inventory Management** - Stock tracking, reservations, multi-warehouse  
✅ **Product Catalog** - Products, categories, pricing  
✅ **User Management** - Users, addresses, authentication  
✅ **Order Processing** - Order lifecycle, line items, status tracking  
✅ **Payment Processing** - Multiple payment methods, transaction handling  
✅ **Domain-Driven Design** - Value objects, aggregates, services  

---

## 📚 **Complete Documentation**

For full system design, architecture, and diagrams, see:

**[📖 Main Documentation](problems/inventory/README.md)**

Includes:
- System architecture diagrams (Class, Sequence, State)
- Complete API contracts
- NFRs and capacity planning
- Design decisions

---

## 💻 **Implementation Structure**

### **Core Domain Models** (`src/main/java/com/you/lld/problems/inventory/model/`)

#### **Value Objects & Identifiers:**
- `Identifiers.java` - Base identifier traits
- `SkuId.java` - Stock Keeping Unit identifier
- `WarehouseId.java` - Warehouse identifier
- `ReservationId.java` - Reservation identifier
- `ProductId.java`, `UserId.java`, `OrderId.java`, `PaymentId.java`

#### **Inventory Domain:**
- `StockSnapshot.java` - Point-in-time stock state (on-hand, reserved, available)
- `Product.java` - Product entity with SKU, name, category, price
- `CategoryId.java` - Product category identifier
- `ProductStatus.java` - ACTIVE, DISCONTINUED, OUT_OF_STOCK

#### **User Domain:**
- `User.java` - User entity with addresses
- `Address.java` - Shipping/billing address value object
- `UserStatus.java` - ACTIVE, SUSPENDED, DELETED

#### **Order Domain:**
- `Order.java` - Order aggregate root
- `OrderLineItem.java` - Individual order items
- `OrderStatus.java` - PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
- `DeliveryEstimate.java` - Estimated delivery window

#### **Payment Domain:**
- `Payment.java` - Payment entity
- `PaymentMethod.java` - CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING
- `PaymentStatus.java` - PENDING, SUCCESS, FAILED, REFUNDED

---

### **Service Layer** (`src/main/java/com/you/lld/problems/inventory/api/`)

#### **Inventory Service:**
```java
public interface InventoryService {
    // Stock operations
    StockSnapshot getStock(SkuId skuId, WarehouseId warehouseId);
    void receiveStock(SkuId skuId, WarehouseId warehouseId, int quantity);
    
    // Reservation operations
    ReservationId reserve(SkuId skuId, WarehouseId warehouseId, int quantity);
    void commit(ReservationId reservationId);
    void release(ReservationId reservationId);
    
    // Transfer operations
    void transfer(SkuId skuId, WarehouseId from, WarehouseId to, int quantity);
}
```

#### **Order Service:**
```java
public interface OrderService {
    // End-to-end order flow
    OrderId createOrder(UserId userId, List<OrderLineItem> items, Address shippingAddress);
    void confirmOrder(OrderId orderId, PaymentId paymentId);
    void shipOrder(OrderId orderId);
    void deliverOrder(OrderId orderId);
    void cancelOrder(OrderId orderId);
    
    // Query operations
    Order getOrder(OrderId orderId);
    List<Order> getUserOrders(UserId userId);
}
```

---

### **Implementation Layer** (`src/main/java/com/you/lld/problems/inventory/impl/`)

- `InMemoryInventoryService.java` - Thread-safe in-memory inventory with ConcurrentHashMap
- `InMemoryOrderService.java` - Order orchestration with inventory reservation

---

## 📝 **Key Usage Examples**

### **Example 1: Complete Order Flow**

```java
// 1. Create users
User alice = new User(
    new UserId("user-001"),
    "Alice Johnson",
    "alice@example.com",
    Arrays.asList(shippingAddress),
    UserStatus.ACTIVE
);

// 2. Setup inventory
InventoryService inventory = new InMemoryInventoryService();
inventory.receiveStock(sku1, warehouse1, 100);

// 3. Create order
List<OrderLineItem> items = Arrays.asList(
    new OrderLineItem(product1.getId(), 2, product1.getPrice())
);

OrderId orderId = orderService.createOrder(
    alice.getId(),
    items,
    shippingAddress
);

// 4. Process payment
PaymentId paymentId = paymentService.processPayment(
    orderId,
    PaymentMethod.CREDIT_CARD,
    totalAmount
);

// 5. Confirm order (commits inventory reservation)
orderService.confirmOrder(orderId, paymentId);

// 6. Ship and deliver
orderService.shipOrder(orderId);
orderService.deliverOrder(orderId);
```

### **Example 2: Inventory Reservation Pattern**

```java
// Reserve stock for order
ReservationId reservation = inventory.reserve(skuId, warehouseId, quantity);

try {
    // Process payment
    Payment payment = paymentService.charge(amount);
    
    if (payment.getStatus() == PaymentStatus.SUCCESS) {
        // Commit reservation (deduct from on-hand)
        inventory.commit(reservation);
    } else {
        // Release reservation (return to available)
        inventory.release(reservation);
    }
} catch (Exception e) {
    // Release on any error
    inventory.release(reservation);
    throw e;
}
```

### **Example 3: Multi-Warehouse Transfer**

```java
// Transfer stock between warehouses
inventory.transfer(
    skuId,
    warehouseId("WH-NYC"),
    warehouseId("WH-LA"),
    50  // quantity
);

// Check new stock levels
StockSnapshot nycStock = inventory.getStock(skuId, warehouseId("WH-NYC"));
StockSnapshot laStock = inventory.getStock(skuId, warehouseId("WH-LA"));

System.out.println("NYC on-hand: " + nycStock.getOnHand());
System.out.println("LA on-hand: " + laStock.getOnHand());
```

---

## 🎯 **Design Patterns Used**

| Pattern | Where Used | Purpose |
|---------|------------|---------|
| **Value Object** | Money, Address, Identifiers | Immutability, type safety |
| **Builder** | Order, User | Complex object creation |
| **Factory Method** | Identifier generation | Encapsulate creation logic |
| **Service Layer** | InventoryService, OrderService | Business logic encapsulation |
| **Repository** | (Interface defined) | Data access abstraction |
| **Aggregate Root** | Order | Consistency boundaries |

---

## 🔒 **Concurrency & Thread Safety**

### **Thread-Safe Operations:**
```java
// Atomic reservation using synchronized block
public synchronized ReservationId reserve(SkuId skuId, WarehouseId warehouseId, int quantity) {
    StockLevel stock = getStockLevel(skuId, warehouseId);
    
    if (stock.getAvailable() < quantity) {
        throw new InsufficientStockException();
    }
    
    ReservationId reservationId = ReservationId.generate();
    Reservation reservation = new Reservation(reservationId, skuId, warehouseId, quantity);
    
    reservations.put(reservationId, reservation);
    stock.reserve(quantity);  // atomic update
    
    return reservationId;
}
```

---

## 🚨 **Error Handling**

### **Custom Exception Hierarchy:**
```java
// Domain exceptions
public class InsufficientStockException extends RuntimeException { }
public class ReservationNotFoundException extends RuntimeException { }
public class InvalidOrderStateException extends RuntimeException { }
public class PaymentFailedException extends RuntimeException { }

// Usage
try {
    inventory.reserve(skuId, warehouseId, 1000);
} catch (InsufficientStockException e) {
    // Handle out of stock
    notifyUser("Product out of stock");
}
```

---

## 📊 **State Machines**

### **Order State Transitions:**
```
PENDING → CONFIRMED → SHIPPED → DELIVERED
   ↓
CANCELLED (from PENDING or CONFIRMED only)
```

### **Reservation State Transitions:**
```
RESERVED → COMMITTED (order confirmed)
    ↓
RELEASED (order cancelled / payment failed)
```

---

## ⚡ **Performance Characteristics**

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| **Get Stock** | O(1) | HashMap lookup |
| **Reserve** | O(1) | Atomic operation |
| **Create Order** | O(N) | N = line items |
| **List User Orders** | O(M) | M = user's orders |

---

## 🧪 **Testing**

### **Unit Tests** (`src/test/java/com/you/lld/problems/inventory/`)

- `InventoryServiceTest.java` - Inventory operations
- `EndToEndOrderTest.java` - Complete order flow
- Tests cover: happy paths, error cases, concurrency, edge cases

---

## 🔗 **Related Resources**

- [System Architecture](problems/inventory/README.md#architecture)
- [Class Diagrams](problems/inventory/diagrams/class.png)
- [Sequence Diagrams](problems/inventory/diagrams/sequence-order-flow.png)
- [State Diagrams](problems/inventory/diagrams/state-order.png)
- [Domain-Driven Design](week1/day4/README.md)
- [Builder Pattern](week2/day6/README.md)

---

## 📦 **Quick Start**

```bash
# Run tests
mvn test -Dtest="InventoryServiceTest"
mvn test -Dtest="EndToEndOrderTest"

# View implementation
# All code is in: src/main/java/com/you/lld/problems/inventory/
```

---

**Source Code**: View complete implementations in your IDE:
- **Models**: `src/main/java/com/you/lld/problems/inventory/model/`
- **Services**: `src/main/java/com/you/lld/problems/inventory/api/`
- **Implementations**: `src/main/java/com/you/lld/problems/inventory/impl/`
- **Tests**: `src/test/java/com/you/lld/problems/inventory/`

---

✨ **Production-ready e-commerce system with comprehensive domain modeling!** 📦


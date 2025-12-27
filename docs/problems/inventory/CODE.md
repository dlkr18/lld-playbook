# inventory - Complete Implementation

## 📁 Project Structure (25 files)

```
inventory/
├── api/InventoryService.java
├── api/OrderService.java
├── impl/InMemoryInventoryService.java
├── impl/InMemoryOrderService.java
├── model/Address.java
├── model/CategoryId.java
├── model/DeliveryEstimate.java
├── model/Identifiers.java
├── model/Order.java
├── model/OrderId.java
├── model/OrderLineItem.java
├── model/OrderStatus.java
├── model/Payment.java
├── model/PaymentId.java
├── model/PaymentMethod.java
├── model/PaymentStatus.java
├── model/Product.java
├── model/ProductStatus.java
├── model/ReservationId.java
├── model/SkuId.java
├── model/StockSnapshot.java
├── model/User.java
├── model/UserId.java
├── model/UserStatus.java
├── model/WarehouseId.java
```

## 📝 Source Code

### 📄 `api/InventoryService.java`

```java
package com.you.lld.problems.inventory.api;

import com.you.lld.problems.inventory.model.ReservationId;
import com.you.lld.problems.inventory.model.SkuId;
import com.you.lld.problems.inventory.model.StockSnapshot;
import com.you.lld.problems.inventory.model.WarehouseId;

/**
 * Inventory management API for core flows: receive, reserve, release, commit, adjust and transfer.
 * Quantities are non-negative. Invalid operations throw IllegalArgumentException.
 */
public interface InventoryService {
  /**
   * Increases on-hand quantity for a SKU at a warehouse.
   */
  void receiveStock(SkuId skuId, WarehouseId warehouseId, long quantity, String reason);

  /**
   * Creates a reservation that holds quantity from availability. Returns an id to later commit or release.
   */
  ReservationId reserve(SkuId skuId, WarehouseId warehouseId, long quantity, String reference);

  /**
   * Cancels a reservation, returning held quantity to availability.
   */
  void release(ReservationId reservationId, String reason);

  /**
   * Commits a reservation (e.g., when picked/shipped), deducting from on-hand and releasing the hold.
   */
  void commit(ReservationId reservationId, String reason);

  /**
   * Adjusts on-hand by a positive or negative delta (e.g., shrinkage, cycle count). Cannot drop below reserved.
   */
  void adjust(SkuId skuId, WarehouseId warehouseId, long delta, String reason);

  /**
   * Atomically moves available quantity between warehouses. Fails if not enough available at source.
   */
  void transfer(SkuId skuId, WarehouseId from, WarehouseId to, long quantity, String reason);

  /**
   * Returns current quantities for a SKU at a warehouse.
   */
  StockSnapshot getStock(SkuId skuId, WarehouseId warehouseId);
}


```

### 📄 `api/OrderService.java`

```java
package com.you.lld.problems.inventory.api;

import com.you.lld.problems.inventory.model.*;

import java.util.List;

/**
 * Order orchestration service that coordinates inventory, payment, and fulfillment.
 * Handles the complete order lifecycle from placement to delivery.
 */
public interface OrderService {
  
  /**
   * Places an order, validates inventory, creates reservations, and initiates payment.
   * Returns order with CREATED status if successful.
   */
  Order placeOrder(UserId userId, List<OrderLineItem> items, Address deliveryAddress, PaymentMethod paymentMethod);
  
  /**
   * Processes payment and confirms order if successful. Updates inventory reservations.
   */
  Order confirmPayment(OrderId orderId, String gatewayTransactionId);
  
  /**
   * Cancels an order, releases inventory reservations, and initiates refund if needed.
   */
  Order cancelOrder(OrderId orderId, String reason);
  
  /**
   * Updates order status during fulfillment (picking, packing, dispatch, delivery).
   */
  Order updateOrderStatus(OrderId orderId, OrderStatus newStatus);
  
  /**
   * Gets order details including current status and line items.
   */
  Order getOrder(OrderId orderId);
  
  /**
   * Gets all orders for a user with optional status filter.
   */
  List<Order> getUserOrders(UserId userId, OrderStatus statusFilter);
  
  /**
   * Checks product availability at nearest warehouse for given delivery address.
   */
  boolean checkAvailability(SkuId skuId, long quantity, Address deliveryAddress);
  
  /**
   * Gets estimated delivery time for an address based on warehouse proximity.
   */
  DeliveryEstimate getDeliveryEstimate(Address deliveryAddress);
}
```

### 📄 `impl/InMemoryInventoryService.java`

```java
package com.you.lld.problems.inventory.impl;

import com.you.lld.problems.inventory.api.InventoryService;
import com.you.lld.problems.inventory.model.ReservationId;
import com.you.lld.problems.inventory.model.SkuId;
import com.you.lld.problems.inventory.model.StockSnapshot;
import com.you.lld.problems.inventory.model.WarehouseId;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe in-memory implementation with per-(sku,warehouse) locks.
 * Suitable for unit testing and demos; not for production scale.
 */
public final class InMemoryInventoryService implements InventoryService {

  private static final class Key {
    final SkuId skuId; final WarehouseId warehouseId;
    Key(SkuId s, WarehouseId w){ this.skuId = s; this.warehouseId = w; }
    @Override public boolean equals(Object o){
      if(this==o) return true; if(!(o instanceof Key)) return false; Key k=(Key)o; return skuId.equals(k.skuId) && warehouseId.equals(k.warehouseId);
    }
    @Override public int hashCode(){ return Objects.hash(skuId, warehouseId); }
  }

  private static final class Reservation {
    final ReservationId id; final SkuId skuId; final WarehouseId warehouseId; final long quantity;
    Reservation(ReservationId id, SkuId skuId, WarehouseId warehouseId, long quantity){
      this.id=id; this.skuId=skuId; this.warehouseId=warehouseId; this.quantity=quantity;
    }
  }

  private static final class Entry {
    long onHand; long reserved; final Object lock = new Object();
  }

  private final ConcurrentHashMap<Key, Entry> entries = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<ReservationId, Reservation> reservations = new ConcurrentHashMap<>();

  private Entry getEntry(SkuId skuId, WarehouseId warehouseId){
    return entries.computeIfAbsent(new Key(skuId, warehouseId), k -> new Entry());
  }

  private static void requirePositive(long quantity){
    if(quantity <= 0) throw new IllegalArgumentException("Quantity must be positive");
  }

  @Override
  public void receiveStock(SkuId skuId, WarehouseId warehouseId, long quantity, String reason) {
    Objects.requireNonNull(skuId); Objects.requireNonNull(warehouseId);
    requirePositive(quantity);
    Entry e = getEntry(skuId, warehouseId);
    synchronized (e.lock) {
      e.onHand = Math.addExact(e.onHand, quantity);
    }
  }

  @Override
  public ReservationId reserve(SkuId skuId, WarehouseId warehouseId, long quantity, String reference) {
    Objects.requireNonNull(skuId); Objects.requireNonNull(warehouseId);
    requirePositive(quantity);
    Entry e = getEntry(skuId, warehouseId);
    synchronized (e.lock) {
      long available = e.onHand - e.reserved;
      if (available < quantity) throw new IllegalArgumentException("Insufficient available");
      e.reserved = Math.addExact(e.reserved, quantity);
      ReservationId id = ReservationId.random();
      reservations.put(id, new Reservation(id, skuId, warehouseId, quantity));
      return id;
    }
  }

  @Override
  public void release(ReservationId reservationId, String reason) {
    Objects.requireNonNull(reservationId);
    Reservation r = reservations.remove(reservationId);
    if (r == null) throw new IllegalArgumentException("Unknown reservation");
    Entry e = getEntry(r.skuId, r.warehouseId);
    synchronized (e.lock) {
      if (e.reserved < r.quantity) throw new IllegalStateException("Reserved underflow");
      e.reserved -= r.quantity;
    }
  }

  @Override
  public void commit(ReservationId reservationId, String reason) {
    Objects.requireNonNull(reservationId);
    Reservation r = reservations.remove(reservationId);
    if (r == null) throw new IllegalArgumentException("Unknown reservation");
    Entry e = getEntry(r.skuId, r.warehouseId);
    synchronized (e.lock) {
      if (e.reserved < r.quantity) throw new IllegalStateException("Reserved underflow");
      e.reserved -= r.quantity;
      if (e.onHand < r.quantity) throw new IllegalStateException("On-hand underflow");
      e.onHand -= r.quantity;
    }
  }

  @Override
  public void adjust(SkuId skuId, WarehouseId warehouseId, long delta, String reason) {
    Objects.requireNonNull(skuId); Objects.requireNonNull(warehouseId);
    Entry e = getEntry(skuId, warehouseId);
    synchronized (e.lock) {
      long newOnHand = e.onHand + delta;
      if (newOnHand < e.reserved) throw new IllegalArgumentException("Adjustment would violate reserved <= onHand");
      if (newOnHand < 0) throw new IllegalArgumentException("On-hand cannot be negative");
      e.onHand = newOnHand;
    }
  }

  @Override
  public void transfer(SkuId skuId, WarehouseId from, WarehouseId to, long quantity, String reason) {
    Objects.requireNonNull(skuId); Objects.requireNonNull(from); Objects.requireNonNull(to);
    if (from.equals(to)) return;
    requirePositive(quantity);

    // Lock ordering to avoid deadlocks: lock the "smaller" key first by string compare
    Entry src = getEntry(skuId, from);
    Entry dst = getEntry(skuId, to);
    Object firstLock = src.lock;
    Object secondLock = dst.lock;
    if (System.identityHashCode(firstLock) > System.identityHashCode(secondLock)) {
      Object tmp = firstLock; firstLock = secondLock; secondLock = tmp;
    }
    synchronized (firstLock) {
      synchronized (secondLock) {
        long available = src.onHand - src.reserved;
        if (available < quantity) throw new IllegalArgumentException("Insufficient available at source");
        src.onHand -= quantity;
        dst.onHand = Math.addExact(dst.onHand, quantity);
      }
    }
  }

  @Override
  public StockSnapshot getStock(SkuId skuId, WarehouseId warehouseId) {
    Entry e = getEntry(skuId, warehouseId);
    synchronized (e.lock) {
      return new StockSnapshot(e.onHand, e.reserved);
    }
  }
}


```

### 📄 `impl/InMemoryOrderService.java`

```java
package com.you.lld.problems.inventory.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.inventory.api.InventoryService;
import com.you.lld.problems.inventory.api.OrderService;
import com.you.lld.problems.inventory.model.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * In-memory implementation orchestrating inventory, payments, and order fulfillment.
 * Simulates realistic e-commerce flows with proper error handling.
 */
public final class InMemoryOrderService implements OrderService {
  
  private final InventoryService inventoryService;
  private final ConcurrentHashMap<OrderId, Order> orders = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<PaymentId, Payment> payments = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<UserId, User> users = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<SkuId, Product> products = new ConcurrentHashMap<>();
  private final List<WarehouseId> warehouses = Arrays.asList(
    WarehouseId.of("BLR-A"), WarehouseId.of("BLR-B"), WarehouseId.of("MUM-A"), WarehouseId.of("DEL-A")
  );
  
  public InMemoryOrderService(InventoryService inventoryService) {
    this.inventoryService = Objects.requireNonNull(inventoryService);
  }
  
  // For testing - add users and products
  public void addUser(User user) { users.put(user.userId(), user); }
  public void addProduct(Product product) { products.put(product.skuId(), product); }
  
  @Override
  public Order placeOrder(UserId userId, List<OrderLineItem> items, Address deliveryAddress, PaymentMethod paymentMethod) {
    User user = users.get(userId);
    if (user == null || !user.isActive()) {
      throw new IllegalArgumentException("Invalid or inactive user");
    }
    
    if (items.isEmpty()) {
      throw new IllegalArgumentException("Order must have at least one item");
    }
    
    // Validate all products exist and are active
    for (OrderLineItem item : items) {
      Product product = products.get(item.skuId());
      if (product == null || !product.isActive()) {
        throw new IllegalArgumentException("Product not available: " + item.skuId());
      }
    }
    
    // Find nearest warehouse
    WarehouseId nearestWarehouse = findNearestWarehouse(deliveryAddress);
    
    // Calculate totals
    Money subtotal = items.stream()
      .map(OrderLineItem::lineTotal)
      .reduce(Money.ofMinor(0, items.get(0).unitPrice().currency()), Money::plus);
    
    Money deliveryFee = calculateDeliveryFee(deliveryAddress, subtotal);
    Money taxes = subtotal.percent(1800); // 18% GST
    Money total = subtotal.plus(deliveryFee).plus(taxes);
    
    OrderId orderId = OrderId.random();
    Order order = new Order(
      orderId, userId, items, deliveryAddress, OrderStatus.CREATED,
      subtotal, deliveryFee, taxes, total,
      LocalDateTime.now(), calculateDeliveryTime(deliveryAddress), nearestWarehouse
    );
    
    orders.put(orderId, order);
    return order;
  }
  
  @Override
  public Order confirmPayment(OrderId orderId, String gatewayTransactionId) {
    Order order = orders.get(orderId);
    if (order == null) {
      throw new IllegalArgumentException("Order not found");
    }
    
    if (order.status() != OrderStatus.CREATED) {
      throw new IllegalStateException("Order not in CREATED state");
    }
    
    try {
      // Reserve inventory for all items
      List<OrderLineItem> reservedItems = new ArrayList<>();
      for (OrderLineItem item : order.lineItems()) {
        ReservationId reservationId = inventoryService.reserve(
          item.skuId(), order.assignedWarehouse(), item.quantity(), "order:" + orderId
        );
        reservedItems.add(item.withReservation(reservationId));
      }
      
      // Create payment record
      PaymentId paymentId = PaymentId.random();
      Payment payment = new Payment(
        paymentId, orderId, order.userId(), order.total(),
        PaymentMethod.UPI, PaymentStatus.SUCCESS, gatewayTransactionId,
        LocalDateTime.now(), LocalDateTime.now()
      );
      payments.put(paymentId, payment);
      
      // Update order with reservations and confirmed status
      Order confirmedOrder = new Order(
        order.orderId(), order.userId(), reservedItems, order.deliveryAddress(),
        OrderStatus.CONFIRMED, order.subtotal(), order.deliveryFee(), order.taxes(), order.total(),
        order.createdAt(), order.expectedDeliveryAt(), order.assignedWarehouse()
      );
      
      orders.put(orderId, confirmedOrder);
      return confirmedOrder;
      
    } catch (IllegalArgumentException e) {
      // Insufficient inventory - mark order as failed
      Order failedOrder = new Order(
        order.orderId(), order.userId(), order.lineItems(), order.deliveryAddress(),
        OrderStatus.FAILED, order.subtotal(), order.deliveryFee(), order.taxes(), order.total(),
        order.createdAt(), order.expectedDeliveryAt(), order.assignedWarehouse()
      );
      orders.put(orderId, failedOrder);
      throw new IllegalStateException("Insufficient inventory for order: " + e.getMessage());
    }
  }
  
  @Override
  public Order cancelOrder(OrderId orderId, String reason) {
    Order order = orders.get(orderId);
    if (order == null) {
      throw new IllegalArgumentException("Order not found");
    }
    
    // Release any reservations
    for (OrderLineItem item : order.lineItems()) {
      if (item.isReserved()) {
        inventoryService.release(item.reservationId(), "order_cancelled:" + reason);
      }
    }
    
    Order cancelledOrder = new Order(
      order.orderId(), order.userId(), order.lineItems(), order.deliveryAddress(),
      OrderStatus.CANCELLED, order.subtotal(), order.deliveryFee(), order.taxes(), order.total(),
      order.createdAt(), order.expectedDeliveryAt(), order.assignedWarehouse()
    );
    
    orders.put(orderId, cancelledOrder);
    return cancelledOrder;
  }
  
  @Override
  public Order updateOrderStatus(OrderId orderId, OrderStatus newStatus) {
    Order order = orders.get(orderId);
    if (order == null) {
      throw new IllegalArgumentException("Order not found");
    }
    
    // For DELIVERED status, commit all reservations
    if (newStatus == OrderStatus.DELIVERED) {
      for (OrderLineItem item : order.lineItems()) {
        if (item.isReserved()) {
          inventoryService.commit(item.reservationId(), "order_delivered");
        }
      }
    }
    
    Order updatedOrder = new Order(
      order.orderId(), order.userId(), order.lineItems(), order.deliveryAddress(),
      newStatus, order.subtotal(), order.deliveryFee(), order.taxes(), order.total(),
      order.createdAt(), order.expectedDeliveryAt(), order.assignedWarehouse()
    );
    
    orders.put(orderId, updatedOrder);
    return updatedOrder;
  }
  
  @Override
  public Order getOrder(OrderId orderId) {
    Order order = orders.get(orderId);
    if (order == null) {
      throw new IllegalArgumentException("Order not found");
    }
    return order;
  }
  
  @Override
  public List<Order> getUserOrders(UserId userId, OrderStatus statusFilter) {
    return orders.values().stream()
      .filter(order -> order.userId().equals(userId))
      .filter(order -> statusFilter == null || order.status() == statusFilter)
      .sorted((o1, o2) -> o2.createdAt().compareTo(o1.createdAt())) // newest first
      .collect(Collectors.toList());
  }
  
  @Override
  public boolean checkAvailability(SkuId skuId, long quantity, Address deliveryAddress) {
    WarehouseId nearestWarehouse = findNearestWarehouse(deliveryAddress);
    try {
      StockSnapshot stock = inventoryService.getStock(skuId, nearestWarehouse);
      return stock.available() >= quantity;
    } catch (Exception e) {
      return false;
    }
  }
  
  @Override
  public DeliveryEstimate getDeliveryEstimate(Address deliveryAddress) {
    WarehouseId nearest = findNearestWarehouse(deliveryAddress);
    LocalDateTime now = LocalDateTime.now();
    LocalDateTime earliest = now.plusHours(2); // Express delivery
    LocalDateTime latest = now.plusDays(1); // Standard delivery
    
    return new DeliveryEstimate(nearest, earliest, latest, 15, true);
  }
  
  private WarehouseId findNearestWarehouse(Address address) {
    // Simplified: just return first warehouse
    // In real system, would use geospatial queries
    return warehouses.get(0);
  }
  
  private Money calculateDeliveryFee(Address address, Money subtotal) {
    // Free delivery above ₹500
    if (subtotal.compareTo(Money.ofMinor(50000, subtotal.currency())) >= 0) {
      return Money.ofMinor(0, subtotal.currency());
    }
    return Money.ofMinor(4000, subtotal.currency()); // ₹40 delivery fee
  }
  
  private LocalDateTime calculateDeliveryTime(Address address) {
    return LocalDateTime.now().plusHours(4); // 4-hour delivery window
  }
}
```

### 📄 `model/Address.java`

```java
package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * Delivery address with geolocation for warehouse routing.
 */
public final class Address implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final String line1;
  private final String line2;
  private final String city;
  private final String state;
  private final String pincode;
  private final String country;
  private final double latitude;
  private final double longitude;
  private final boolean isDefault;
  
  public Address(String line1, String line2, String city, String state, String pincode, 
                 String country, double latitude, double longitude, boolean isDefault) {
    this.line1 = Objects.requireNonNull(line1);
    this.line2 = line2; // can be null
    this.city = Objects.requireNonNull(city);
    this.state = Objects.requireNonNull(state);
    this.pincode = Objects.requireNonNull(pincode);
    this.country = Objects.requireNonNull(country);
    this.latitude = latitude;
    this.longitude = longitude;
    this.isDefault = isDefault;
  }
  
  public String line1() { return line1; }
  public String line2() { return line2; }
  public String city() { return city; }
  public String state() { return state; }
  public String pincode() { return pincode; }
  public String country() { return country; }
  public double latitude() { return latitude; }
  public double longitude() { return longitude; }
  public boolean isDefault() { return isDefault; }
  
  @Override
  public String toString() {
    return line1 + (line2 != null ? ", " + line2 : "") + ", " + city + ", " + state + " " + pincode;
  }
}
```

### 📄 `model/CategoryId.java`

```java
package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class CategoryId implements Serializable {
  private static final long serialVersionUID = 1L;
  private final String value;
  
  private CategoryId(String value) { 
    this.value = Objects.requireNonNull(value); 
  }
  
  public static CategoryId of(String value) { 
    return new CategoryId(value); 
  }
  
  public static CategoryId random() { 
    return new CategoryId(UUID.randomUUID().toString()); 
  }
  
  public String value() { 
    return value; 
  }
  
  @Override 
  public boolean equals(Object o){
    if(this==o) return true; 
    if(!(o instanceof CategoryId)) return false; 
    CategoryId that=(CategoryId)o; 
    return value.equals(that.value);
  }
  
  @Override 
  public int hashCode(){ 
    return value.hashCode(); 
  }
  
  @Override 
  public String toString(){ 
    return value; 
  }
}
```

### 📄 `model/DeliveryEstimate.java`

```java
package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Delivery time estimate based on warehouse proximity and logistics capacity.
 */
public final class DeliveryEstimate implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final WarehouseId nearestWarehouse;
  private final LocalDateTime earliestDelivery;
  private final LocalDateTime latestDelivery;
  private final int distanceKm;
  private final boolean expressAvailable;
  
  public DeliveryEstimate(WarehouseId nearestWarehouse, LocalDateTime earliestDelivery,
                         LocalDateTime latestDelivery, int distanceKm, boolean expressAvailable) {
    this.nearestWarehouse = Objects.requireNonNull(nearestWarehouse);
    this.earliestDelivery = Objects.requireNonNull(earliestDelivery);
    this.latestDelivery = Objects.requireNonNull(latestDelivery);
    this.distanceKm = distanceKm;
    this.expressAvailable = expressAvailable;
  }
  
  public WarehouseId nearestWarehouse() { return nearestWarehouse; }
  public LocalDateTime earliestDelivery() { return earliestDelivery; }
  public LocalDateTime latestDelivery() { return latestDelivery; }
  public int distanceKm() { return distanceKm; }
  public boolean isExpressAvailable() { return expressAvailable; }
  
  @Override
  public String toString() {
    return "DeliveryEstimate{" +
      "nearestWarehouse=" + nearestWarehouse +
      ", earliestDelivery=" + earliestDelivery +
      ", latestDelivery=" + latestDelivery +
      ", distanceKm=" + distanceKm +
      ", expressAvailable=" + expressAvailable +
      '}';
  }
}
```

### 📄 `model/Identifiers.java`

```java
package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class Identifiers {
  private Identifiers() {}

  public static final class SkuId implements Serializable {
    private static final long serialVersionUID = 1L;
    private final String value;
    private SkuId(String value) { this.value = Objects.requireNonNull(value); }
    public static SkuId of(String value) { return new SkuId(value); }
    public static SkuId random() { return new SkuId(UUID.randomUUID().toString()); }
    public String value() { return value; }
    @Override public boolean equals(Object o){
      if(this==o) return true; if(!(o instanceof SkuId)) return false; SkuId that=(SkuId)o; return value.equals(that.value);
    }
    @Override public int hashCode(){ return value.hashCode(); }
    @Override public String toString(){ return value; }
  }

  public static final class WarehouseId implements Serializable {
    private static final long serialVersionUID = 1L;
    private final String value;
    private WarehouseId(String value) { this.value = Objects.requireNonNull(value); }
    public static WarehouseId of(String value) { return new WarehouseId(value); }
    public static WarehouseId random() { return new WarehouseId(UUID.randomUUID().toString()); }
    public String value() { return value; }
    @Override public boolean equals(Object o){
      if(this==o) return true; if(!(o instanceof WarehouseId)) return false; WarehouseId that=(WarehouseId)o; return value.equals(that.value);
    }
    @Override public int hashCode(){ return value.hashCode(); }
    @Override public String toString(){ return value; }
  }

  public static final class ReservationId implements Serializable {
    private static final long serialVersionUID = 1L;
    private final String value;
    private ReservationId(String value) { this.value = Objects.requireNonNull(value); }
    public static ReservationId of(String value) { return new ReservationId(value); }
    public static ReservationId random() { return new ReservationId(UUID.randomUUID().toString()); }
    public String value() { return value; }
    @Override public boolean equals(Object o){
      if(this==o) return true; if(!(o instanceof ReservationId)) return false; ReservationId that=(ReservationId)o; return value.equals(that.value);
    }
    @Override public int hashCode(){ return value.hashCode(); }
    @Override public String toString(){ return value; }
  }
}


```

### 📄 `model/Order.java`

```java
package com.you.lld.problems.inventory.model;

import com.you.lld.common.Money;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Customer order with line items, delivery details, and fulfillment tracking.
 */
public final class Order implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final OrderId orderId;
  private final UserId userId;
  private final List<OrderLineItem> lineItems;
  private final Address deliveryAddress;
  private final OrderStatus status;
  private final Money subtotal;
  private final Money deliveryFee;
  private final Money taxes;
  private final Money total;
  private final LocalDateTime createdAt;
  private final LocalDateTime expectedDeliveryAt;
  private final WarehouseId assignedWarehouse;
  
  public Order(OrderId orderId, UserId userId, List<OrderLineItem> lineItems, Address deliveryAddress,
               OrderStatus status, Money subtotal, Money deliveryFee, Money taxes, Money total,
               LocalDateTime createdAt, LocalDateTime expectedDeliveryAt, WarehouseId assignedWarehouse) {
    this.orderId = Objects.requireNonNull(orderId);
    this.userId = Objects.requireNonNull(userId);
    this.lineItems = new ArrayList<>(lineItems);
    this.deliveryAddress = Objects.requireNonNull(deliveryAddress);
    this.status = Objects.requireNonNull(status);
    this.subtotal = Objects.requireNonNull(subtotal);
    this.deliveryFee = Objects.requireNonNull(deliveryFee);
    this.taxes = Objects.requireNonNull(taxes);
    this.total = Objects.requireNonNull(total);
    this.createdAt = Objects.requireNonNull(createdAt);
    this.expectedDeliveryAt = expectedDeliveryAt;
    this.assignedWarehouse = assignedWarehouse;
  }
  
  public OrderId orderId() { return orderId; }
  public UserId userId() { return userId; }
  public List<OrderLineItem> lineItems() { return lineItems; }
  public Address deliveryAddress() { return deliveryAddress; }
  public OrderStatus status() { return status; }
  public Money subtotal() { return subtotal; }
  public Money deliveryFee() { return deliveryFee; }
  public Money taxes() { return taxes; }
  public Money total() { return total; }
  public LocalDateTime createdAt() { return createdAt; }
  public LocalDateTime expectedDeliveryAt() { return expectedDeliveryAt; }
  public WarehouseId assignedWarehouse() { return assignedWarehouse; }
  
  @Override
  public String toString() {
    return "Order{" +
      "orderId=" + orderId +
      ", userId=" + userId +
      ", status=" + status +
      ", total=" + total +
      ", itemCount=" + lineItems.size() +
      '}';
  }
}
```

### 📄 `model/OrderId.java`

```java
package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class OrderId implements Serializable {
  private static final long serialVersionUID = 1L;
  private final String value;
  
  private OrderId(String value) { 
    this.value = Objects.requireNonNull(value); 
  }
  
  public static OrderId of(String value) { 
    return new OrderId(value); 
  }
  
  public static OrderId random() { 
    return new OrderId(UUID.randomUUID().toString()); 
  }
  
  public String value() { 
    return value; 
  }
  
  @Override 
  public boolean equals(Object o){
    if(this==o) return true; 
    if(!(o instanceof OrderId)) return false; 
    OrderId that=(OrderId)o; 
    return value.equals(that.value);
  }
  
  @Override 
  public int hashCode(){ 
    return value.hashCode(); 
  }
  
  @Override 
  public String toString(){ 
    return value; 
  }
}
```

### 📄 `model/OrderLineItem.java`

```java
package com.you.lld.problems.inventory.model;

import com.you.lld.common.Money;

import java.io.Serializable;
import java.util.Objects;

/**
 * Individual item in an order with quantity and pricing.
 */
public final class OrderLineItem implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final SkuId skuId;
  private final String productName;
  private final long quantity;
  private final Money unitPrice;
  private final Money lineTotal;
  private final ReservationId reservationId; // null until reserved
  
  public OrderLineItem(SkuId skuId, String productName, long quantity, Money unitPrice, ReservationId reservationId) {
    if (quantity <= 0) throw new IllegalArgumentException("Quantity must be positive");
    this.skuId = Objects.requireNonNull(skuId);
    this.productName = Objects.requireNonNull(productName);
    this.quantity = quantity;
    this.unitPrice = Objects.requireNonNull(unitPrice);
    this.lineTotal = unitPrice.times(quantity);
    this.reservationId = reservationId; // can be null initially
  }
  
  public SkuId skuId() { return skuId; }
  public String productName() { return productName; }
  public long quantity() { return quantity; }
  public Money unitPrice() { return unitPrice; }
  public Money lineTotal() { return lineTotal; }
  public ReservationId reservationId() { return reservationId; }
  
  public boolean isReserved() { return reservationId != null; }
  
  public OrderLineItem withReservation(ReservationId reservationId) {
    return new OrderLineItem(skuId, productName, quantity, unitPrice, reservationId);
  }
  
  @Override
  public String toString() {
    return "OrderLineItem{" +
      "skuId=" + skuId +
      ", productName='" + productName + '\'' +
      ", quantity=" + quantity +
      ", lineTotal=" + lineTotal +
      ", reserved=" + isReserved() +
      '}';
  }
}
```

### 📄 `model/OrderStatus.java`

```java
package com.you.lld.problems.inventory.model;

public enum OrderStatus {
  CREATED,         // Order placed, payment pending
  PAYMENT_PENDING, // Awaiting payment confirmation
  CONFIRMED,       // Payment successful, inventory reserved
  PICKING,         // Being picked from warehouse
  PACKED,          // Ready for dispatch
  OUT_FOR_DELIVERY,// With delivery partner
  DELIVERED,       // Successfully delivered
  CANCELLED,       // Cancelled by user or system
  FAILED           // Failed due to payment/inventory issues
}
```

### 📄 `model/Payment.java`

```java
package com.you.lld.problems.inventory.model;

import com.you.lld.common.Money;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Payment record with method, status, and gateway details.
 */
public final class Payment implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final PaymentId paymentId;
  private final OrderId orderId;
  private final UserId userId;
  private final Money amount;
  private final PaymentMethod method;
  private final PaymentStatus status;
  private final String gatewayTransactionId;
  private final LocalDateTime createdAt;
  private final LocalDateTime processedAt;
  
  public Payment(PaymentId paymentId, OrderId orderId, UserId userId, Money amount,
                 PaymentMethod method, PaymentStatus status, String gatewayTransactionId,
                 LocalDateTime createdAt, LocalDateTime processedAt) {
    this.paymentId = Objects.requireNonNull(paymentId);
    this.orderId = Objects.requireNonNull(orderId);
    this.userId = Objects.requireNonNull(userId);
    this.amount = Objects.requireNonNull(amount);
    this.method = Objects.requireNonNull(method);
    this.status = Objects.requireNonNull(status);
    this.gatewayTransactionId = gatewayTransactionId;
    this.createdAt = Objects.requireNonNull(createdAt);
    this.processedAt = processedAt;
  }
  
  public PaymentId paymentId() { return paymentId; }
  public OrderId orderId() { return orderId; }
  public UserId userId() { return userId; }
  public Money amount() { return amount; }
  public PaymentMethod method() { return method; }
  public PaymentStatus status() { return status; }
  public String gatewayTransactionId() { return gatewayTransactionId; }
  public LocalDateTime createdAt() { return createdAt; }
  public LocalDateTime processedAt() { return processedAt; }
  
  public boolean isSuccessful() { return status == PaymentStatus.SUCCESS; }
  
  @Override
  public String toString() {
    return "Payment{" +
      "paymentId=" + paymentId +
      ", orderId=" + orderId +
      ", amount=" + amount +
      ", method=" + method +
      ", status=" + status +
      '}';
  }
}
```

### 📄 `model/PaymentId.java`

```java
package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class PaymentId implements Serializable {
  private static final long serialVersionUID = 1L;
  private final String value;
  
  private PaymentId(String value) { 
    this.value = Objects.requireNonNull(value); 
  }
  
  public static PaymentId of(String value) { 
    return new PaymentId(value); 
  }
  
  public static PaymentId random() { 
    return new PaymentId(UUID.randomUUID().toString()); 
  }
  
  public String value() { 
    return value; 
  }
  
  @Override 
  public boolean equals(Object o){
    if(this==o) return true; 
    if(!(o instanceof PaymentId)) return false; 
    PaymentId that=(PaymentId)o; 
    return value.equals(that.value);
  }
  
  @Override 
  public int hashCode(){ 
    return value.hashCode(); 
  }
  
  @Override 
  public String toString(){ 
    return value; 
  }
}
```

### 📄 `model/PaymentMethod.java`

```java
package com.you.lld.problems.inventory.model;

public enum PaymentMethod {
  CREDIT_CARD,
  DEBIT_CARD,
  UPI,
  NET_BANKING,
  WALLET,
  CASH_ON_DELIVERY
}
```

### 📄 `model/PaymentStatus.java`

```java
package com.you.lld.problems.inventory.model;

public enum PaymentStatus {
  PENDING,
  SUCCESS,
  FAILED,
  REFUNDED,
  CANCELLED
}
```

### 📄 `model/Product.java`

```java
package com.you.lld.problems.inventory.model;

import com.you.lld.common.Money;

import java.io.Serializable;
import java.util.Objects;

/**
 * Product catalog entry with pricing, categorization, and inventory details.
 */
public final class Product implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final SkuId skuId;
  private final String name;
  private final String description;
  private final CategoryId categoryId;
  private final Money unitPrice;
  private final String brand;
  private final ProductStatus status;
  private final boolean perishable;
  private final Integer shelfLifeDays; // null if not perishable
  
  public Product(SkuId skuId, String name, String description, CategoryId categoryId, 
                 Money unitPrice, String brand, ProductStatus status, boolean perishable, Integer shelfLifeDays) {
    this.skuId = Objects.requireNonNull(skuId);
    this.name = Objects.requireNonNull(name);
    this.description = Objects.requireNonNull(description);
    this.categoryId = Objects.requireNonNull(categoryId);
    this.unitPrice = Objects.requireNonNull(unitPrice);
    this.brand = Objects.requireNonNull(brand);
    this.status = Objects.requireNonNull(status);
    this.perishable = perishable;
    this.shelfLifeDays = perishable ? Objects.requireNonNull(shelfLifeDays) : shelfLifeDays;
  }
  
  public SkuId skuId() { return skuId; }
  public String name() { return name; }
  public String description() { return description; }
  public CategoryId categoryId() { return categoryId; }
  public Money unitPrice() { return unitPrice; }
  public String brand() { return brand; }
  public ProductStatus status() { return status; }
  public boolean isPerishable() { return perishable; }
  public Integer shelfLifeDays() { return shelfLifeDays; }
  
  public boolean isActive() { return status == ProductStatus.ACTIVE; }
  
  @Override
  public String toString() {
    return "Product{" +
      "skuId=" + skuId +
      ", name='" + name + '\'' +
      ", unitPrice=" + unitPrice +
      ", status=" + status +
      '}';
  }
}
```

### 📄 `model/ProductStatus.java`

```java
package com.you.lld.problems.inventory.model;

public enum ProductStatus {
  ACTIVE,
  DISCONTINUED,
  OUT_OF_STOCK,
  SEASONAL
}
```

### 📄 `model/ReservationId.java`

```java
package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class ReservationId implements Serializable {
  private static final long serialVersionUID = 1L;
  private final String value;
  private ReservationId(String value) { this.value = Objects.requireNonNull(value); }
  public static ReservationId of(String value) { return new ReservationId(value); }
  public static ReservationId random() { return new ReservationId(UUID.randomUUID().toString()); }
  public String value() { return value; }
  @Override public boolean equals(Object o){
    if(this==o) return true; if(!(o instanceof ReservationId)) return false; ReservationId that=(ReservationId)o; return value.equals(that.value);
  }
  @Override public int hashCode(){ return value.hashCode(); }
  @Override public String toString(){ return value; }
}


```

### 📄 `model/SkuId.java`

```java
package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class SkuId implements Serializable {
  private static final long serialVersionUID = 1L;
  private final String value;
  private SkuId(String value) { this.value = Objects.requireNonNull(value); }
  public static SkuId of(String value) { return new SkuId(value); }
  public static SkuId random() { return new SkuId(UUID.randomUUID().toString()); }
  public String value() { return value; }
  @Override public boolean equals(Object o){
    if(this==o) return true; if(!(o instanceof SkuId)) return false; SkuId that=(SkuId)o; return value.equals(that.value);
  }
  @Override public int hashCode(){ return value.hashCode(); }
  @Override public String toString(){ return value; }
}


```

### 📄 `model/StockSnapshot.java`

```java
package com.you.lld.problems.inventory.model;

import java.io.Serializable;

/**
 * Snapshot of inventory quantities at a moment.
 */
public final class StockSnapshot implements Serializable {
  private static final long serialVersionUID = 1L;
  private final long onHand;
  private final long reserved;

  public StockSnapshot(long onHand, long reserved) {
    if (onHand < 0 || reserved < 0) throw new IllegalArgumentException("Negative quantities not allowed");
    if (reserved > onHand) throw new IllegalArgumentException("Reserved cannot exceed on-hand");
    this.onHand = onHand;
    this.reserved = reserved;
  }

  public long onHand() { return onHand; }
  public long reserved() { return reserved; }
  public long available() { return onHand - reserved; }

  @Override public String toString() {
    return "StockSnapshot{" +
      "onHand=" + onHand +
      ", reserved=" + reserved +
      ", available=" + available() +
      '}';
  }
}


```

### 📄 `model/User.java`

```java
package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * User profile with delivery addresses and preferences.
 */
public final class User implements Serializable {
  private static final long serialVersionUID = 1L;
  
  private final UserId userId;
  private final String email;
  private final String name;
  private final String phone;
  private final List<Address> addresses;
  private final UserStatus status;
  private final LocalDateTime createdAt;
  
  public User(UserId userId, String email, String name, String phone, 
              List<Address> addresses, UserStatus status, LocalDateTime createdAt) {
    this.userId = Objects.requireNonNull(userId);
    this.email = Objects.requireNonNull(email);
    this.name = Objects.requireNonNull(name);
    this.phone = Objects.requireNonNull(phone);
    this.addresses = new ArrayList<>(addresses);
    this.status = Objects.requireNonNull(status);
    this.createdAt = Objects.requireNonNull(createdAt);
  }
  
  public UserId userId() { return userId; }
  public String email() { return email; }
  public String name() { return name; }
  public String phone() { return phone; }
  public List<Address> addresses() { return addresses; }
  public UserStatus status() { return status; }
  public LocalDateTime createdAt() { return createdAt; }
  
  public boolean isActive() { return status == UserStatus.ACTIVE; }
  
  @Override
  public String toString() {
    return "User{" +
      "userId=" + userId +
      ", email='" + email + '\'' +
      ", name='" + name + '\'' +
      ", status=" + status +
      '}';
  }
}
```

### 📄 `model/UserId.java`

```java
package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class UserId implements Serializable {
  private static final long serialVersionUID = 1L;
  private final String value;
  
  private UserId(String value) { 
    this.value = Objects.requireNonNull(value); 
  }
  
  public static UserId of(String value) { 
    return new UserId(value); 
  }
  
  public static UserId random() { 
    return new UserId(UUID.randomUUID().toString()); 
  }
  
  public String value() { 
    return value; 
  }
  
  @Override 
  public boolean equals(Object o){
    if(this==o) return true; 
    if(!(o instanceof UserId)) return false; 
    UserId that=(UserId)o; 
    return value.equals(that.value);
  }
  
  @Override 
  public int hashCode(){ 
    return value.hashCode(); 
  }
  
  @Override 
  public String toString(){ 
    return value; 
  }
}
```

### 📄 `model/UserStatus.java`

```java
package com.you.lld.problems.inventory.model;

public enum UserStatus {
  ACTIVE,
  SUSPENDED,
  INACTIVE
}
```

### 📄 `model/WarehouseId.java`

```java
package com.you.lld.problems.inventory.model;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public final class WarehouseId implements Serializable {
  private static final long serialVersionUID = 1L;
  private final String value;
  private WarehouseId(String value) { this.value = Objects.requireNonNull(value); }
  public static WarehouseId of(String value) { return new WarehouseId(value); }
  public static WarehouseId random() { return new WarehouseId(UUID.randomUUID().toString()); }
  public String value() { return value; }
  @Override public boolean equals(Object o){
    if(this==o) return true; if(!(o instanceof WarehouseId)) return false; WarehouseId that=(WarehouseId)o; return value.equals(that.value);
  }
  @Override public int hashCode(){ return value.hashCode(); }
  @Override public String toString(){ return value; }
}


```


# inventory - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/inventory/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py inventory`.

## Project Structure (27 files)

```
inventory/
├── InventoryDemo.java
├── Inventory.java
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
├── service/InventoryService.java
├── service/OrderService.java
├── service/impl/InMemoryInventoryService.java
├── service/impl/InMemoryOrderService.java
```

## Source Code

### `InventoryDemo.java`

<details>
<summary>Click to view InventoryDemo.java</summary>

```java
package com.you.lld.problems.inventory;

import com.you.lld.problems.inventory.model.*;
import com.you.lld.problems.inventory.service.InventoryService;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Interview-style demo: multi-warehouse Reserve-Commit-Release lifecycle.
 */
public class InventoryDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Inventory Management Demo ===\n");

        Inventory app = new Inventory();
        InventoryService service = app.inventory();

        SkuId laptop = SkuId.of("SKU-LAPTOP-001");
        SkuId phone = SkuId.of("SKU-PHONE-001");
        WarehouseId whEast = WarehouseId.of("WH-EAST");
        WarehouseId whWest = WarehouseId.of("WH-WEST");

        demoMultiWarehouseReceive(service, laptop, phone, whEast, whWest);
        demoReserveCommitRelease(service, laptop, whEast);
        demoInterWarehouseTransfer(service, laptop, whEast, whWest);
        demoCycleCountAdjust(service, phone, whEast);
        demoConcurrentReservations(service, laptop, whWest);

        System.out.println("\n=== Demo complete ===");
    }

    private static void demoMultiWarehouseReceive(InventoryService service, SkuId laptop, SkuId phone,
                                                    WarehouseId whEast, WarehouseId whWest) {
        System.out.println("--- Demo 1: Multi-warehouse receive ---");
        service.receiveStock(laptop, whEast, 100, "Initial stock");
        service.receiveStock(phone, whEast, 200, "Initial stock");
        service.receiveStock(laptop, whWest, 50, "Initial stock");
        System.out.println("Laptop@East: " + service.getStock(laptop, whEast));
        System.out.println("Phone@East:  " + service.getStock(phone, whEast));
        System.out.println("Laptop@West: " + service.getStock(laptop, whWest));
        System.out.println();
    }

    private static void demoReserveCommitRelease(InventoryService service, SkuId laptop, WarehouseId whEast) {
        System.out.println("--- Demo 2: Reserve → Commit / Release ---");
        ReservationId ship = service.reserve(laptop, whEast, 10, "Order-1001");
        ReservationId cancel = service.reserve(laptop, whEast, 5, "Order-1002");
        System.out.println("After reserve: " + service.getStock(laptop, whEast));

        service.commit(ship, "Shipped Order-1001");
        service.release(cancel, "Order-1002 cancelled");
        System.out.println("After commit+release: " + service.getStock(laptop, whEast));
        System.out.println();
    }

    private static void demoInterWarehouseTransfer(InventoryService service, SkuId laptop,
                                                   WarehouseId whEast, WarehouseId whWest) {
        System.out.println("--- Demo 3: Inter-warehouse transfer ---");
        System.out.println("Before: East=" + service.getStock(laptop, whEast)
                + ", West=" + service.getStock(laptop, whWest));
        service.transfer(laptop, whEast, whWest, 20, "Rebalance");
        System.out.println("After:  East=" + service.getStock(laptop, whEast)
                + ", West=" + service.getStock(laptop, whWest));
        System.out.println();
    }

    private static void demoCycleCountAdjust(InventoryService service, SkuId phone, WarehouseId whEast) {
        System.out.println("--- Demo 4: Cycle-count adjust (shrinkage) ---");
        service.adjust(phone, whEast, -5, "Shrinkage detected");
        System.out.println("Phone@East after adjust: " + service.getStock(phone, whEast));

        try {
            service.reserve(phone, whEast, 10000, "Impossible");
        } catch (IllegalArgumentException e) {
            System.out.println("Over-reserve blocked: " + e.getMessage());
        }
        System.out.println();
    }

    private static void demoConcurrentReservations(InventoryService service, SkuId laptop,
                                                   WarehouseId whWest) throws InterruptedException {
        System.out.println("--- Demo 5: Concurrent reservations (thread-safety) ---");
        StockSnapshot before = service.getStock(laptop, whWest);
        int threads = 10;
        int qtyEach = 2;
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        CountDownLatch start = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(threads);
        AtomicInteger successes = new AtomicInteger(0);
        AtomicInteger failures = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            final int n = i;
            pool.submit(new Runnable() {
                @Override
                public void run() {
                    try {
                        start.await();
                        service.reserve(laptop, whWest, qtyEach, "concurrent-" + n);
                        successes.incrementAndGet();
                    } catch (Exception e) {
                        failures.incrementAndGet();
                    } finally {
                        done.countDown();
                    }
                }
            });
        }
        start.countDown();
        done.await();
        pool.shutdown();

        StockSnapshot after = service.getStock(laptop, whWest);
        System.out.println("Before: " + before + " | After: " + after);
        System.out.println("Successes=" + successes.get() + ", failures=" + failures.get()
                + " (reserved never exceeds on-hand)");
        System.out.println();
    }
}
```

</details>

### `Inventory.java`

<details>
<summary>Click to view Inventory.java</summary>

```java
package com.you.lld.problems.inventory;

import com.you.lld.problems.inventory.service.InventoryService;
import com.you.lld.problems.inventory.service.OrderService;
import com.you.lld.problems.inventory.service.impl.InMemoryInventoryService;
import com.you.lld.problems.inventory.service.impl.InMemoryOrderService;

/**
 * Facade for multi-warehouse inventory and order orchestration.
 */
public final class Inventory {

    private final InventoryService inventoryService;
    private final OrderService orderService;

    public Inventory() {
        this.inventoryService = new InMemoryInventoryService();
        this.orderService = new InMemoryOrderService(inventoryService);
    }

    public Inventory(InventoryService inventoryService, OrderService orderService) {
        this.inventoryService = inventoryService;
        this.orderService = orderService;
    }

    public InventoryService inventory() {
        return inventoryService;
    }

    public OrderService orders() {
        return orderService;
    }
}
```

</details>

### `model/Address.java`

<details>
<summary>Click to view model/Address.java</summary>

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

</details>

### `model/CategoryId.java`

<details>
<summary>Click to view model/CategoryId.java</summary>

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

</details>

### `model/DeliveryEstimate.java`

<details>
<summary>Click to view model/DeliveryEstimate.java</summary>

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

</details>

### `model/Identifiers.java`

<details>
<summary>Click to view model/Identifiers.java</summary>

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

</details>

### `model/Order.java`

<details>
<summary>Click to view model/Order.java</summary>

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

</details>

### `model/OrderId.java`

<details>
<summary>Click to view model/OrderId.java</summary>

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

</details>

### `model/OrderLineItem.java`

<details>
<summary>Click to view model/OrderLineItem.java</summary>

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

</details>

### `model/OrderStatus.java`

<details>
<summary>Click to view model/OrderStatus.java</summary>

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

</details>

### `model/Payment.java`

<details>
<summary>Click to view model/Payment.java</summary>

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

</details>

### `model/PaymentId.java`

<details>
<summary>Click to view model/PaymentId.java</summary>

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

</details>

### `model/PaymentMethod.java`

<details>
<summary>Click to view model/PaymentMethod.java</summary>

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

</details>

### `model/PaymentStatus.java`

<details>
<summary>Click to view model/PaymentStatus.java</summary>

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

</details>

### `model/Product.java`

<details>
<summary>Click to view model/Product.java</summary>

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

</details>

### `model/ProductStatus.java`

<details>
<summary>Click to view model/ProductStatus.java</summary>

```java
package com.you.lld.problems.inventory.model;

public enum ProductStatus {
  ACTIVE,
  DISCONTINUED,
  OUT_OF_STOCK,
  SEASONAL
}
```

</details>

### `model/ReservationId.java`

<details>
<summary>Click to view model/ReservationId.java</summary>

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

</details>

### `model/SkuId.java`

<details>
<summary>Click to view model/SkuId.java</summary>

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

</details>

### `model/StockSnapshot.java`

<details>
<summary>Click to view model/StockSnapshot.java</summary>

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

</details>

### `model/User.java`

<details>
<summary>Click to view model/User.java</summary>

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

</details>

### `model/UserId.java`

<details>
<summary>Click to view model/UserId.java</summary>

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

</details>

### `model/UserStatus.java`

<details>
<summary>Click to view model/UserStatus.java</summary>

```java
package com.you.lld.problems.inventory.model;

public enum UserStatus {
  ACTIVE,
  SUSPENDED,
  INACTIVE
}
```

</details>

### `model/WarehouseId.java`

<details>
<summary>Click to view model/WarehouseId.java</summary>

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

</details>

### `service/InventoryService.java`

<details>
<summary>Click to view service/InventoryService.java</summary>

```java
package com.you.lld.problems.inventory.service;

import com.you.lld.problems.inventory.model.ReservationId;
import com.you.lld.problems.inventory.model.SkuId;
import com.you.lld.problems.inventory.model.StockSnapshot;
import com.you.lld.problems.inventory.model.WarehouseId;

/**
 * Inventory management: receive, reserve, release, commit, adjust, transfer.
 * Quantities are non-negative; invalid operations throw IllegalArgumentException.
 */
public interface InventoryService {

    void receiveStock(SkuId skuId, WarehouseId warehouseId, long quantity, String reason);

    ReservationId reserve(SkuId skuId, WarehouseId warehouseId, long quantity, String reference);

    void release(ReservationId reservationId, String reason);

    void commit(ReservationId reservationId, String reason);

    void adjust(SkuId skuId, WarehouseId warehouseId, long delta, String reason);

    void transfer(SkuId skuId, WarehouseId from, WarehouseId to, long quantity, String reason);

    StockSnapshot getStock(SkuId skuId, WarehouseId warehouseId);
}
```

</details>

### `service/OrderService.java`

<details>
<summary>Click to view service/OrderService.java</summary>

```java
package com.you.lld.problems.inventory.service;

import com.you.lld.problems.inventory.model.*;

import java.util.List;

/**
 * Order orchestration coordinating inventory, payment, and fulfillment.
 */
public interface OrderService {

    Order placeOrder(UserId userId, List<OrderLineItem> items, Address deliveryAddress, PaymentMethod paymentMethod);

    Order confirmPayment(OrderId orderId, String gatewayTransactionId);

    Order cancelOrder(OrderId orderId, String reason);

    Order updateOrderStatus(OrderId orderId, OrderStatus newStatus);

    Order getOrder(OrderId orderId);

    List<Order> getUserOrders(UserId userId, OrderStatus statusFilter);

    boolean checkAvailability(SkuId skuId, long quantity, Address deliveryAddress);

    DeliveryEstimate getDeliveryEstimate(Address deliveryAddress);
}
```

</details>

### `service/impl/InMemoryInventoryService.java`

<details>
<summary>Click to view service/impl/InMemoryInventoryService.java</summary>

```java
package com.you.lld.problems.inventory.service.impl;

import com.you.lld.problems.inventory.model.ReservationId;
import com.you.lld.problems.inventory.model.SkuId;
import com.you.lld.problems.inventory.model.StockSnapshot;
import com.you.lld.problems.inventory.model.WarehouseId;
import com.you.lld.problems.inventory.service.InventoryService;

import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe in-memory inventory with per-(sku, warehouse) fine-grained locks.
 * Reserve-Commit-Release lifecycle prevents overselling under concurrent orders.
 */
public final class InMemoryInventoryService implements InventoryService {

    private static final class Key {
        final SkuId skuId;
        final WarehouseId warehouseId;

        Key(SkuId s, WarehouseId w) {
            this.skuId = s;
            this.warehouseId = w;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Key)) return false;
            Key k = (Key) o;
            return skuId.equals(k.skuId) && warehouseId.equals(k.warehouseId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(skuId, warehouseId);
        }
    }

    private static final class Reservation {
        final ReservationId id;
        final SkuId skuId;
        final WarehouseId warehouseId;
        final long quantity;

        Reservation(ReservationId id, SkuId skuId, WarehouseId warehouseId, long quantity) {
            this.id = id;
            this.skuId = skuId;
            this.warehouseId = warehouseId;
            this.quantity = quantity;
        }
    }

    private static final class Entry {
        long onHand;
        long reserved;
        final Object lock = new Object();
    }

    private final ConcurrentHashMap<Key, Entry> entries = new ConcurrentHashMap<Key, Entry>();
    private final ConcurrentHashMap<ReservationId, Reservation> reservations =
            new ConcurrentHashMap<ReservationId, Reservation>();

    private Entry getEntry(SkuId skuId, WarehouseId warehouseId) {
        return entries.computeIfAbsent(new Key(skuId, warehouseId), k -> new Entry());
    }

    private static void requirePositive(long quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
    }

    @Override
    public void receiveStock(SkuId skuId, WarehouseId warehouseId, long quantity, String reason) {
        Objects.requireNonNull(skuId);
        Objects.requireNonNull(warehouseId);
        requirePositive(quantity);
        Entry e = getEntry(skuId, warehouseId);
        synchronized (e.lock) {
            e.onHand = Math.addExact(e.onHand, quantity);
        }
    }

    @Override
    public ReservationId reserve(SkuId skuId, WarehouseId warehouseId, long quantity, String reference) {
        Objects.requireNonNull(skuId);
        Objects.requireNonNull(warehouseId);
        requirePositive(quantity);
        Entry e = getEntry(skuId, warehouseId);
        synchronized (e.lock) {
            long available = e.onHand - e.reserved;
            if (available < quantity) {
                throw new IllegalArgumentException("Insufficient available");
            }
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
        if (r == null) {
            throw new IllegalArgumentException("Unknown reservation");
        }
        Entry e = getEntry(r.skuId, r.warehouseId);
        synchronized (e.lock) {
            if (e.reserved < r.quantity) {
                throw new IllegalStateException("Reserved underflow");
            }
            e.reserved -= r.quantity;
        }
    }

    @Override
    public void commit(ReservationId reservationId, String reason) {
        Objects.requireNonNull(reservationId);
        Reservation r = reservations.remove(reservationId);
        if (r == null) {
            throw new IllegalArgumentException("Unknown reservation");
        }
        Entry e = getEntry(r.skuId, r.warehouseId);
        synchronized (e.lock) {
            if (e.reserved < r.quantity) {
                throw new IllegalStateException("Reserved underflow");
            }
            e.reserved -= r.quantity;
            if (e.onHand < r.quantity) {
                throw new IllegalStateException("On-hand underflow");
            }
            e.onHand -= r.quantity;
        }
    }

    @Override
    public void adjust(SkuId skuId, WarehouseId warehouseId, long delta, String reason) {
        Objects.requireNonNull(skuId);
        Objects.requireNonNull(warehouseId);
        Entry e = getEntry(skuId, warehouseId);
        synchronized (e.lock) {
            long newOnHand = e.onHand + delta;
            if (newOnHand < e.reserved) {
                throw new IllegalArgumentException("Adjustment would violate reserved <= onHand");
            }
            if (newOnHand < 0) {
                throw new IllegalArgumentException("On-hand cannot be negative");
            }
            e.onHand = newOnHand;
        }
    }

    @Override
    public void transfer(SkuId skuId, WarehouseId from, WarehouseId to, long quantity, String reason) {
        Objects.requireNonNull(skuId);
        Objects.requireNonNull(from);
        Objects.requireNonNull(to);
        if (from.equals(to)) {
            return;
        }
        requirePositive(quantity);

        Entry src = getEntry(skuId, from);
        Entry dst = getEntry(skuId, to);
        Object firstLock;
        Object secondLock;
        if (from.toString().compareTo(to.toString()) < 0) {
            firstLock = src.lock;
            secondLock = dst.lock;
        } else {
            firstLock = dst.lock;
            secondLock = src.lock;
        }
        synchronized (firstLock) {
            synchronized (secondLock) {
                long available = src.onHand - src.reserved;
                if (available < quantity) {
                    throw new IllegalArgumentException("Insufficient available at source");
                }
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

</details>

### `service/impl/InMemoryOrderService.java`

<details>
<summary>Click to view service/impl/InMemoryOrderService.java</summary>

```java
package com.you.lld.problems.inventory.service.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.inventory.model.*;
import com.you.lld.problems.inventory.service.InventoryService;
import com.you.lld.problems.inventory.service.OrderService;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * In-memory order orchestration: reserve on payment, commit on delivery, release on cancel.
 */
public final class InMemoryOrderService implements OrderService {

    private final InventoryService inventoryService;
    private final ConcurrentHashMap<OrderId, Order> orders = new ConcurrentHashMap<OrderId, Order>();
    private final ConcurrentHashMap<PaymentId, Payment> payments = new ConcurrentHashMap<PaymentId, Payment>();
    private final ConcurrentHashMap<UserId, User> users = new ConcurrentHashMap<UserId, User>();
    private final ConcurrentHashMap<SkuId, Product> products = new ConcurrentHashMap<SkuId, Product>();
    private final List<WarehouseId> warehouses = Arrays.asList(
            WarehouseId.of("BLR-A"), WarehouseId.of("BLR-B"),
            WarehouseId.of("MUM-A"), WarehouseId.of("DEL-A"));

    public InMemoryOrderService(InventoryService inventoryService) {
        this.inventoryService = Objects.requireNonNull(inventoryService);
    }

    public void addUser(User user) {
        users.put(user.userId(), user);
    }

    public void addProduct(Product product) {
        products.put(product.skuId(), product);
    }

    @Override
    public Order placeOrder(UserId userId, List<OrderLineItem> items, Address deliveryAddress,
                            PaymentMethod paymentMethod) {
        User user = users.get(userId);
        if (user == null || !user.isActive()) {
            throw new IllegalArgumentException("Invalid or inactive user");
        }
        if (items.isEmpty()) {
            throw new IllegalArgumentException("Order must have at least one item");
        }
        for (OrderLineItem item : items) {
            Product product = products.get(item.skuId());
            if (product == null || !product.isActive()) {
                throw new IllegalArgumentException("Product not available: " + item.skuId());
            }
        }

        WarehouseId nearestWarehouse = findNearestWarehouse(deliveryAddress);
        Money subtotal = items.stream()
                .map(OrderLineItem::lineTotal)
                .reduce(Money.ofMinor(0, items.get(0).unitPrice().currency()), Money::plus);
        Money deliveryFee = calculateDeliveryFee(deliveryAddress, subtotal);
        Money taxes = subtotal.percent(1800);
        Money total = subtotal.plus(deliveryFee).plus(taxes);

        OrderId orderId = OrderId.random();
        Order order = new Order(
                orderId, userId, items, deliveryAddress, OrderStatus.CREATED,
                subtotal, deliveryFee, taxes, total,
                LocalDateTime.now(), calculateDeliveryTime(deliveryAddress), nearestWarehouse);
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
        // Declared OUTSIDE the try: the compensation path needs to know what was
        // already reserved. Scoping this inside the try is what made the leak
        // below unrecoverable.
        List<OrderLineItem> reservedItems = new ArrayList<OrderLineItem>();
        try {
            for (OrderLineItem item : order.lineItems()) {
                ReservationId reservationId = inventoryService.reserve(
                        item.skuId(), order.assignedWarehouse(), item.quantity(), "order:" + orderId);
                reservedItems.add(item.withReservation(reservationId));
            }
            PaymentId paymentId = PaymentId.random();
            Payment payment = new Payment(
                    paymentId, orderId, order.userId(), order.total(),
                    PaymentMethod.UPI, PaymentStatus.SUCCESS, gatewayTransactionId,
                    LocalDateTime.now(), LocalDateTime.now());
            payments.put(paymentId, payment);

            Order confirmedOrder = new Order(
                    order.orderId(), order.userId(), reservedItems, order.deliveryAddress(),
                    OrderStatus.CONFIRMED, order.subtotal(), order.deliveryFee(), order.taxes(), order.total(),
                    order.createdAt(), order.expectedDeliveryAt(), order.assignedWarehouse());
            orders.put(orderId, confirmedOrder);
            return confirmedOrder;
        } catch (IllegalArgumentException e) {
            // Compensate: a multi-line order is all-or-nothing. Without this the
            // lines reserved before the failing one stayed reserved forever — and
            // because the FAILED order was stored with the ORIGINAL (unreserved)
            // line items, their reservation ids were lost, so even cancelOrder
            // could not recover them.
            releaseAll(reservedItems, "order_failed:" + orderId);
            Order failedOrder = new Order(
                    order.orderId(), order.userId(), order.lineItems(), order.deliveryAddress(),
                    OrderStatus.FAILED, order.subtotal(), order.deliveryFee(), order.taxes(), order.total(),
                    order.createdAt(), order.expectedDeliveryAt(), order.assignedWarehouse());
            orders.put(orderId, failedOrder);
            throw new IllegalStateException("Insufficient inventory for order: " + e.getMessage());
        }
    }

    /** Best-effort compensation: one failed release must not strand the others. */
    private void releaseAll(List<OrderLineItem> reserved, String reason) {
        for (OrderLineItem item : reserved) {
            if (item.isReserved()) {
                try {
                    inventoryService.release(item.reservationId(), reason);
                } catch (RuntimeException ignored) {
                    // Already released or unknown — keep unwinding the rest.
                }
            }
        }
    }

    @Override
    public Order cancelOrder(OrderId orderId, String reason) {
        Order order = orders.get(orderId);
        if (order == null) {
            throw new IllegalArgumentException("Order not found");
        }
        if (order.status() == OrderStatus.DELIVERED) {
            // Reservations were committed on delivery; releasing them now would
            // credit stock that has physically left the warehouse.
            throw new IllegalStateException("Cannot cancel a DELIVERED order — use a return instead");
        }
        if (order.status() == OrderStatus.CANCELLED) {
            return order;   // idempotent
        }
        for (OrderLineItem item : order.lineItems()) {
            if (item.isReserved()) {
                inventoryService.release(item.reservationId(), "order_cancelled:" + reason);
            }
        }
        Order cancelledOrder = new Order(
                order.orderId(), order.userId(), order.lineItems(), order.deliveryAddress(),
                OrderStatus.CANCELLED, order.subtotal(), order.deliveryFee(), order.taxes(), order.total(),
                order.createdAt(), order.expectedDeliveryAt(), order.assignedWarehouse());
        orders.put(orderId, cancelledOrder);
        return cancelledOrder;
    }

    @Override
    public Order updateOrderStatus(OrderId orderId, OrderStatus newStatus) {
        Order order = orders.get(orderId);
        if (order == null) {
            throw new IllegalArgumentException("Order not found");
        }
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
                order.createdAt(), order.expectedDeliveryAt(), order.assignedWarehouse());
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
                .sorted((o1, o2) -> o2.createdAt().compareTo(o1.createdAt()))
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
        return new DeliveryEstimate(nearest, now.plusHours(2), now.plusDays(1), 15, true);
    }

    private WarehouseId findNearestWarehouse(Address address) {
        return warehouses.get(0);
    }

    private Money calculateDeliveryFee(Address address, Money subtotal) {
        if (subtotal.compareTo(Money.ofMinor(50000, subtotal.currency())) >= 0) {
            return Money.ofMinor(0, subtotal.currency());
        }
        return Money.ofMinor(4000, subtotal.currency());
    }

    private LocalDateTime calculateDeliveryTime(Address address) {
        return LocalDateTime.now().plusHours(4);
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.inventory.InventoryDemo"
```

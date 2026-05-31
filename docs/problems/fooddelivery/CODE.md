# fooddelivery - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/fooddelivery/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py fooddelivery`.

## Project Structure (32 files)

```
fooddelivery/
├── FoodDeliveryDemo.java
├── api/FoodDeliveryService.java
├── api/NotificationService.java
├── model/Address.java
├── model/CancelledOrderState.java
├── model/ConfirmedOrderState.java
├── model/Customer.java
├── model/DeliveredOrderState.java
├── model/DeliveryPartner.java
├── model/MenuItem.java
├── model/Order.java
├── model/OrderItem.java
├── model/OrderObserver.java
├── model/OrderState.java
├── model/OrderStatus.java
├── model/OutForDeliveryState.java
├── model/PartnerStatus.java
├── model/PlacedOrderState.java
├── model/PreparingOrderState.java
├── model/ReadyForPickupState.java
├── model/Restaurant.java
├── model/RestaurantStatus.java
├── impl/ConsoleNotificationService.java
├── impl/InMemoryFoodDeliveryService.java
├── impl/OrderNotifier.java
├── exceptions/CustomerNotFoundException.java
├── exceptions/InvalidOperationException.java
├── exceptions/OrderNotFoundException.java
├── exceptions/PartnerNotAvailableException.java
├── exceptions/PartnerNotFoundException.java
├── exceptions/RestaurantClosedException.java
├── exceptions/RestaurantNotFoundException.java
```

## Source Code

### `FoodDeliveryDemo.java`

<details>
<summary>Click to view FoodDeliveryDemo.java</summary>

```java
package com.you.lld.problems.fooddelivery;

import com.you.lld.problems.fooddelivery.api.FoodDeliveryService;
import com.you.lld.problems.fooddelivery.exceptions.InvalidOperationException;
import com.you.lld.problems.fooddelivery.impl.ConsoleNotificationService;
import com.you.lld.problems.fooddelivery.impl.InMemoryFoodDeliveryService;
import com.you.lld.problems.fooddelivery.model.*;

import java.util.ArrayList;
import java.util.List;

/**
 * End-to-end demo of Food Delivery System exercising:
 *
 *   1. State    -- Order lifecycle: Placed -> Confirmed -> Preparing -> Ready ->
 *                  OutForDelivery -> Delivered (+ cancellation guards)
 *   2. Observer -- OrderNotifier fires per-stakeholder notifications on every transition
 *   3. Menu validation -- placeOrder verifies items/availability/price from restaurant menu
 *   4. Partner lifecycle -- BUSY on assignment, AVAILABLE on delivery/cancel
 *   5. Concurrency -- synchronized(order) per-order, synchronized(partner)
 */
public class FoodDeliveryDemo {

    public static void main(String[] args) {
        System.out.println("========================================");
        System.out.println("  Food Delivery System -- Full LLD Demo");
        System.out.println("========================================\n");

        FoodDeliveryService service = new InMemoryFoodDeliveryService(new ConsoleNotificationService());

        Restaurant restaurant = setupRestaurant(service);
        Customer customer = setupCustomer(service);
        DeliveryPartner partner = setupPartner(service);

        demoHappyPath(service, restaurant, customer, partner);
        demoCancellation(service, restaurant, customer, partner);
        demoStateGuards(service, restaurant, customer);
        demoMenuValidation(service, restaurant, customer);
        demoSearch(service, customer);

        System.out.println("========================================");
        System.out.println("  All demos completed.");
        System.out.println("========================================");
    }

    // ──────────── Setup ────────────

    private static Restaurant setupRestaurant(FoodDeliveryService service) {
        Address addr = new Address("123 Main St", "NYC", "NY", "10001");
        addr.setLatitude(40.7128);
        addr.setLongitude(-74.0060);
        Restaurant r = service.registerRestaurant("Pizza Palace", addr);

        MenuItem pizza = new MenuItem("ITEM001", "Margherita Pizza", 12.99);
        pizza.setCategory("Pizza");
        pizza.setVegetarian(true);
        service.addMenuItem(r.getRestaurantId(), pizza);

        MenuItem pasta = new MenuItem("ITEM002", "Alfredo Pasta", 10.99);
        pasta.setCategory("Pasta");
        service.addMenuItem(r.getRestaurantId(), pasta);

        MenuItem salad = new MenuItem("ITEM003", "Caesar Salad", 8.50);
        salad.setCategory("Salad");
        salad.setAvailable(false);
        service.addMenuItem(r.getRestaurantId(), salad);

        r.setRating(4.5);
        System.out.println("[Setup] Restaurant: " + r.getName() + " (3 menu items)\n");
        return r;
    }

    private static Customer setupCustomer(FoodDeliveryService service) {
        Customer c = service.registerCustomer("John Doe", "john@example.com", "555-0100");
        Address deliveryAddr = new Address("456 Park Ave", "NYC", "NY", "10002");
        deliveryAddr.setLatitude(40.7589);
        deliveryAddr.setLongitude(-73.9851);
        c.addAddress(deliveryAddr);
        System.out.println("[Setup] Customer: " + c.getName());
        return c;
    }

    private static DeliveryPartner setupPartner(FoodDeliveryService service) {
        DeliveryPartner p = service.registerDeliveryPartner("Mike Wilson", "555-0200");
        p.setVehicleNumber("ABC123");
        Address loc = new Address("789 Broadway", "NYC", "NY", "10003");
        loc.setLatitude(40.7300);
        loc.setLongitude(-73.9950);
        service.updatePartnerLocation(p.getPartnerId(), loc);
        System.out.println("[Setup] Partner: " + p.getName() + "\n");
        return p;
    }

    // ──────────── Demo 1: Happy path ────────────

    private static void demoHappyPath(FoodDeliveryService service,
                                       Restaurant restaurant, Customer customer,
                                       DeliveryPartner partner) {
        System.out.println("--- Demo 1: Happy Path (State: Placed -> Delivered) ---\n");

        List<OrderItem> items = new ArrayList<>();
        items.add(new OrderItem("ITEM001", "Margherita Pizza", 12.99, 2));
        items.add(new OrderItem("ITEM002", "Alfredo Pasta", 10.99, 1));

        Order order = service.placeOrder(customer.getCustomerId(),
            restaurant.getRestaurantId(), items, customer.getAddresses().get(0));
        System.out.println("Order: " + order + "\n");

        service.assignDeliveryPartner(order.getOrderId(), partner.getPartnerId());
        System.out.println("Partner assigned: " + partner.getName()
            + " (status: " + partner.getStatus() + ")\n");

        service.updateOrderStatus(order.getOrderId(), OrderStatus.CONFIRMED);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.PREPARING);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.READY_FOR_PICKUP);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.OUT_FOR_DELIVERY);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.DELIVERED);

        System.out.println("\nFinal status: " + order.getStatus());
        System.out.println("Partner status after delivery: " + partner.getStatus());
        System.out.println();
    }

    // ──────────── Demo 2: Cancellation ────────────

    private static void demoCancellation(FoodDeliveryService service,
                                          Restaurant restaurant, Customer customer,
                                          DeliveryPartner partner) {
        System.out.println("--- Demo 2: Cancellation (State: Placed -> Cancelled) ---\n");

        List<OrderItem> items = new ArrayList<>();
        items.add(new OrderItem("ITEM001", "Margherita Pizza", 12.99, 1));

        Order order = service.placeOrder(customer.getCustomerId(),
            restaurant.getRestaurantId(), items, customer.getAddresses().get(0));

        service.assignDeliveryPartner(order.getOrderId(), partner.getPartnerId());
        System.out.println("Partner status before cancel: " + partner.getStatus());

        service.cancelOrder(order.getOrderId());
        System.out.println("Order status: " + order.getStatus());
        System.out.println("Partner released: " + partner.getStatus());
        System.out.println();
    }

    // ──────────── Demo 3: State guards ────────────

    private static void demoStateGuards(FoodDeliveryService service,
                                         Restaurant restaurant, Customer customer) {
        System.out.println("--- Demo 3: State Pattern Guards ---\n");

        List<OrderItem> items = new ArrayList<>();
        items.add(new OrderItem("ITEM002", "Alfredo Pasta", 10.99, 1));

        Order order = service.placeOrder(customer.getCustomerId(),
            restaurant.getRestaurantId(), items, customer.getAddresses().get(0));

        try {
            service.updateOrderStatus(order.getOrderId(), OrderStatus.PREPARING);
        } catch (IllegalStateException e) {
            System.out.println("Skip CONFIRMED blocked: " + e.getMessage());
        }

        service.updateOrderStatus(order.getOrderId(), OrderStatus.CONFIRMED);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.PREPARING);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.READY_FOR_PICKUP);

        try {
            service.cancelOrder(order.getOrderId());
        } catch (IllegalStateException e) {
            System.out.println("Cancel after READY blocked: " + e.getMessage());
        }

        service.updateOrderStatus(order.getOrderId(), OrderStatus.OUT_FOR_DELIVERY);
        service.updateOrderStatus(order.getOrderId(), OrderStatus.DELIVERED);

        try {
            service.cancelOrder(order.getOrderId());
        } catch (IllegalStateException e) {
            System.out.println("Cancel after DELIVERED blocked: " + e.getMessage());
        }
        System.out.println();
    }

    // ──────────── Demo 4: Menu validation ────────────

    private static void demoMenuValidation(FoodDeliveryService service,
                                            Restaurant restaurant, Customer customer) {
        System.out.println("--- Demo 4: Menu Validation ---\n");

        try {
            List<OrderItem> bad = new ArrayList<>();
            bad.add(new OrderItem("ITEM999", "Nonexistent", 99.99, 1));
            service.placeOrder(customer.getCustomerId(),
                restaurant.getRestaurantId(), bad, customer.getAddresses().get(0));
        } catch (InvalidOperationException e) {
            System.out.println("Invalid item blocked: " + e.getMessage());
        }

        try {
            List<OrderItem> unavailable = new ArrayList<>();
            unavailable.add(new OrderItem("ITEM003", "Caesar Salad", 8.50, 1));
            service.placeOrder(customer.getCustomerId(),
                restaurant.getRestaurantId(), unavailable, customer.getAddresses().get(0));
        } catch (InvalidOperationException e) {
            System.out.println("Unavailable item blocked: " + e.getMessage());
        }
        System.out.println();
    }

    // ──────────── Demo 5: Search ────────────

    private static void demoSearch(FoodDeliveryService service, Customer customer) {
        System.out.println("--- Demo 5: Restaurant Search ---\n");

        Address loc = customer.getAddresses().get(0);
        List<Restaurant> nearby = service.searchRestaurants("pizza", loc, 10.0);
        System.out.println("Found " + nearby.size() + " restaurant(s) matching 'pizza' within 10km");
        nearby.forEach(r -> System.out.println("  - " + r.getName()
            + " (rating: " + r.getRating() + ")"));

        List<Restaurant> all = service.searchRestaurants(null, null, 0);
        System.out.println("All open restaurants: " + all.size());
        System.out.println();
    }
}
```

</details>

### `api/FoodDeliveryService.java`

<details>
<summary>Click to view api/FoodDeliveryService.java</summary>

```java
package com.you.lld.problems.fooddelivery.api;

import com.you.lld.problems.fooddelivery.model.*;

import java.util.List;

public interface FoodDeliveryService {
    // Restaurant Management
    Restaurant registerRestaurant(String name, Address address);

    Restaurant getRestaurant(String restaurantId);

    List<Restaurant> searchRestaurants(String query, Address location, double radiusKm);

    void updateRestaurantStatus(String restaurantId, RestaurantStatus status);

    // Menu Management
    void addMenuItem(String restaurantId, MenuItem item);

    void removeMenuItem(String restaurantId, String itemId);

    void updateMenuItemAvailability(String restaurantId, String itemId, boolean available);

    // Customer Management
    Customer registerCustomer(String name, String email, String phone);

    Customer getCustomer(String customerId);

    // Order Management
    Order placeOrder(String customerId, String restaurantId, List<OrderItem> items, Address deliveryAddress);

    Order getOrder(String orderId);

    List<Order> getCustomerOrders(String customerId);

    List<Order> getRestaurantOrders(String restaurantId);

    void updateOrderStatus(String orderId, OrderStatus status);

    void cancelOrder(String orderId);

    // Delivery Partner Management
    DeliveryPartner registerDeliveryPartner(String name, String phone);

    void assignDeliveryPartner(String orderId, String partnerId);

    List<DeliveryPartner> getAvailablePartners(Address location);

    void updatePartnerLocation(String partnerId, Address location);
}
```

</details>

### `api/NotificationService.java`

<details>
<summary>Click to view api/NotificationService.java</summary>

```java
package com.you.lld.problems.fooddelivery.api;

/**
 * Delivery channel for notifications.
 * Implementations: console, SMS, push, email, etc.
 */
public interface NotificationService {
    void notify(String recipientId, String message);
}
```

</details>

### `model/Address.java`

<details>
<summary>Click to view model/Address.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;

public class Address {
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private double latitude;
    private double longitude;

    public Address(String street, String city, String state, String zipCode) {
        this.street = street;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
    }

    public String getStreet() {
        return street;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double distanceTo(Address other) {
        double lat1 = Math.toRadians(this.latitude);
        double lon1 = Math.toRadians(this.longitude);
        double lat2 = Math.toRadians(other.latitude);
        double lon2 = Math.toRadians(other.longitude);
        double dlon = lon2 - lon1;
        double dlat = lat2 - lat1;
        double a = Math.pow(Math.sin(dlat / 2), 2) +
                Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
        double c = 2 * Math.asin(Math.sqrt(a));
        return 6371 * c; // Earth radius in km
    }
}
```

</details>

### `model/CancelledOrderState.java`

<details>
<summary>Click to view model/CancelledOrderState.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;

public class CancelledOrderState implements OrderState {
    public static final CancelledOrderState INSTANCE = new CancelledOrderState();
    private CancelledOrderState() {}

    @Override public OrderState confirm(Order order)        { throw terminal(); }
    @Override public OrderState startPreparing(Order order) { throw terminal(); }
    @Override public OrderState markReady(Order order)      { throw terminal(); }
    @Override public OrderState pickUp(Order order)         { throw terminal(); }
    @Override public OrderState deliver(Order order)        { throw terminal(); }
    @Override public OrderState cancel(Order order)         { throw terminal(); }

    @Override public OrderStatus getStatus() { return OrderStatus.CANCELLED; }

    private IllegalStateException terminal() {
        return new IllegalStateException("Order is already CANCELLED (terminal)");
    }
}
```

</details>

### `model/ConfirmedOrderState.java`

<details>
<summary>Click to view model/ConfirmedOrderState.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;

public class ConfirmedOrderState implements OrderState {
    public static final ConfirmedOrderState INSTANCE = new ConfirmedOrderState();
    private ConfirmedOrderState() {}

    @Override public OrderState startPreparing(Order order) { return PreparingOrderState.INSTANCE; }
    @Override public OrderState cancel(Order order)         { return CancelledOrderState.INSTANCE; }

    @Override public OrderState confirm(Order order)        { throw invalid("already confirmed"); }
    @Override public OrderState markReady(Order order)      { throw invalid("not preparing yet"); }
    @Override public OrderState pickUp(Order order)         { throw invalid("not ready yet"); }
    @Override public OrderState deliver(Order order)        { throw invalid("not out for delivery yet"); }

    @Override public OrderStatus getStatus() { return OrderStatus.CONFIRMED; }

    private IllegalStateException invalid(String reason) {
        return new IllegalStateException("Order is CONFIRMED -- " + reason);
    }
}
```

</details>

### `model/Customer.java`

<details>
<summary>Click to view model/Customer.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;

import java.util.*;

public class Customer {
    private final String customerId;
    private String name;
    private String email;
    private String phone;
    private List<Address> addresses;
    private List<String> orderHistory;

    public Customer(String customerId, String name, String email, String phone) {
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.addresses = new ArrayList<>();
        this.orderHistory = new ArrayList<>();
    }

    public String getCustomerId() {
        return customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<Address> getAddresses() {
        return new ArrayList<>(addresses);
    }

    public void addAddress(Address address) {
        addresses.add(address);
    }

    public List<String> getOrderHistory() {
        return new ArrayList<>(orderHistory);
    }

    public void addOrderToHistory(String orderId) {
        orderHistory.add(orderId);
    }
}
```

</details>

### `model/DeliveredOrderState.java`

<details>
<summary>Click to view model/DeliveredOrderState.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;

public class DeliveredOrderState implements OrderState {
    public static final DeliveredOrderState INSTANCE = new DeliveredOrderState();
    private DeliveredOrderState() {}

    @Override public OrderState confirm(Order order)        { throw terminal(); }
    @Override public OrderState startPreparing(Order order) { throw terminal(); }
    @Override public OrderState markReady(Order order)      { throw terminal(); }
    @Override public OrderState pickUp(Order order)         { throw terminal(); }
    @Override public OrderState deliver(Order order)        { throw terminal(); }
    @Override public OrderState cancel(Order order)         { throw terminal(); }

    @Override public OrderStatus getStatus() { return OrderStatus.DELIVERED; }

    private IllegalStateException terminal() {
        return new IllegalStateException("Order is already DELIVERED (terminal)");
    }
}
```

</details>

### `model/DeliveryPartner.java`

<details>
<summary>Click to view model/DeliveryPartner.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;
public class DeliveryPartner {
    private final String partnerId;
    private String name;
    private String phone;
    private String vehicleNumber;
    private PartnerStatus status;
    private Address currentLocation;
    private String currentOrderId;
    
    public DeliveryPartner(String partnerId, String name, String phone) {
        this.partnerId = partnerId;
        this.name = name;
        this.phone = phone;
        this.status = PartnerStatus.AVAILABLE;
    }
    
    public String getPartnerId() { return partnerId; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
    public PartnerStatus getStatus() { return status; }
    public void setStatus(PartnerStatus status) { this.status = status; }
    public Address getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(Address location) { this.currentLocation = location; }
    public String getCurrentOrderId() { return currentOrderId; }
    public void setCurrentOrderId(String orderId) { this.currentOrderId = orderId; }
    public boolean isAvailable() { return status == PartnerStatus.AVAILABLE; }
}
```

</details>

### `model/MenuItem.java`

<details>
<summary>Click to view model/MenuItem.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;
public class MenuItem {
    private final String itemId;
    private String name;
    private String description;
    private double price;
    private boolean available;
    private String category;
    private boolean vegetarian;
    
    public MenuItem(String itemId, String name, double price) {
        this.itemId = itemId;
        this.name = name;
        this.price = price;
        this.available = true;
        this.vegetarian = false;
    }
    
    public String getItemId() { return itemId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public boolean isVegetarian() { return vegetarian; }
    public void setVegetarian(boolean vegetarian) { this.vegetarian = vegetarian; }
}
```

</details>

### `model/Order.java`

<details>
<summary>Click to view model/Order.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Order entity with State pattern + Observer pattern.
 *
 * State pattern: delegates confirm/prepare/ready/pickUp/deliver/cancel to its OrderState.
 *     States validate transitions; side effects (partner release) handled by service.
 *
 * Observer pattern: registered OrderObservers notified on every state change.
 *     Notification formatting lives in OrderNotifier (SRP), not here.
 */
public class Order {

    private final String orderId;
    private final String customerId;
    private final String restaurantId;
    private final Address deliveryAddress;
    private final List<OrderItem> items;
    private final LocalDateTime orderedAt;

    private OrderState state;
    private String deliveryPartnerId;
    private double subtotal;
    private double deliveryFee;
    private double tax;
    private double totalAmount;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime actualDeliveryTime;
    private String specialInstructions;

    private final List<OrderObserver> observers = new CopyOnWriteArrayList<>();

    public Order(String orderId, String customerId, String restaurantId, Address deliveryAddress) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.restaurantId = restaurantId;
        this.deliveryAddress = deliveryAddress;
        this.items = new ArrayList<>();
        this.orderedAt = LocalDateTime.now();
        this.state = PlacedOrderState.INSTANCE;
    }

    // ─── State transitions (delegate to current state) ────────────────

    public void confirm()       { this.state = this.state.confirm(this);        notifyObservers(); }
    public void startPreparing(){ this.state = this.state.startPreparing(this); notifyObservers(); }
    public void markReady()     { this.state = this.state.markReady(this);      notifyObservers(); }
    public void pickUp()        { this.state = this.state.pickUp(this);         notifyObservers(); }

    public void deliver() {
        this.state = this.state.deliver(this);
        this.actualDeliveryTime = LocalDateTime.now();
        notifyObservers();
    }

    public void cancel() {
        this.state = this.state.cancel(this);
        notifyObservers();
    }

    // ─── Observer ─────────────────────────────────────────────────────

    public void addObserver(OrderObserver observer)    { observers.add(observer); }
    public void removeObserver(OrderObserver observer)  { observers.remove(observer); }

    private void notifyObservers() {
        for (OrderObserver o : observers) { o.update(this); }
    }

    // ─── Items & pricing ──────────────────────────────────────────────

    public void addItem(OrderItem item) {
        items.add(item);
        recalculate();
    }

    void recalculate() {
        this.subtotal = items.stream().mapToDouble(OrderItem::getTotal).sum();
        this.deliveryFee = subtotal > 50 ? 0 : 5.0;
        this.tax = subtotal * 0.08;
        this.totalAmount = subtotal + deliveryFee + tax;
    }

    // ─── Getters ──────────────────────────────────────────────────────

    public String getOrderId()                  { return orderId; }
    public String getCustomerId()               { return customerId; }
    public String getRestaurantId()             { return restaurantId; }
    public List<OrderItem> getItems()           { return Collections.unmodifiableList(items); }
    public OrderStatus getStatus()              { return state.getStatus(); }
    public String getDeliveryPartnerId()        { return deliveryPartnerId; }
    public Address getDeliveryAddress()         { return deliveryAddress; }
    public double getSubtotal()                 { return subtotal; }
    public double getDeliveryFee()              { return deliveryFee; }
    public double getTax()                      { return tax; }
    public double getTotalAmount()              { return totalAmount; }
    public LocalDateTime getOrderedAt()         { return orderedAt; }
    public LocalDateTime getEstimatedDeliveryTime() { return estimatedDeliveryTime; }
    public LocalDateTime getActualDeliveryTime()    { return actualDeliveryTime; }
    public String getSpecialInstructions()      { return specialInstructions; }

    // ─── Setters used by service layer ────────────────────────────────

    public void setDeliveryPartnerId(String id) { this.deliveryPartnerId = id; }
    public void setEstimatedDeliveryTime(LocalDateTime t) { this.estimatedDeliveryTime = t; }
    public void setSpecialInstructions(String s) { this.specialInstructions = s; }

    @Override
    public String toString() {
        return "Order{id='" + orderId + "', status=" + getStatus()
            + ", items=" + items.size()
            + ", total=$" + String.format("%.2f", totalAmount) + '}';
    }
}
```

</details>

### `model/OrderItem.java`

<details>
<summary>Click to view model/OrderItem.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;
public class OrderItem {
    private final String menuItemId;
    private String itemName;
    private double price;
    private int quantity;
    private String customization;
    
    public OrderItem(String menuItemId, String itemName, double price, int quantity) {
        this.menuItemId = menuItemId;
        this.itemName = itemName;
        this.price = price;
        this.quantity = quantity;
    }
    
    public String getMenuItemId() { return menuItemId; }
    public String getItemName() { return itemName; }
    public double getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public String getCustomization() { return customization; }
    public void setCustomization(String customization) { this.customization = customization; }
    public double getTotal() { return price * quantity; }
}
```

</details>

### `model/OrderObserver.java`

<details>
<summary>Click to view model/OrderObserver.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;

/**
 * Observer for Order lifecycle events.
 * Implementations (e.g. OrderNotifier) handle notification formatting/delivery.
 * Keeps Order entity pure -- SRP.
 */
public interface OrderObserver {
    void update(Order order);
}
```

</details>

### `model/OrderState.java`

<details>
<summary>Click to view model/OrderState.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;

/**
 * State pattern for Order lifecycle.
 *
 *   Placed → Confirmed → Preparing → ReadyForPickup → OutForDelivery → Delivered
 *   Placed / Confirmed / Preparing → Cancelled
 *
 * States are STATELESS singletons. All mutable data lives on Order.
 * Side effects (partner release, notifications) are handled by the service.
 */
public interface OrderState {
    OrderState confirm(Order order);
    OrderState startPreparing(Order order);
    OrderState markReady(Order order);
    OrderState pickUp(Order order);
    OrderState deliver(Order order);
    OrderState cancel(Order order);
    OrderStatus getStatus();
}
```

</details>

### `model/OrderStatus.java`

<details>
<summary>Click to view model/OrderStatus.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;
public enum OrderStatus {
    PLACED, CONFIRMED, PREPARING, READY_FOR_PICKUP, 
    OUT_FOR_DELIVERY, DELIVERED, CANCELLED
}
```

</details>

### `model/OutForDeliveryState.java`

<details>
<summary>Click to view model/OutForDeliveryState.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;

public class OutForDeliveryState implements OrderState {
    public static final OutForDeliveryState INSTANCE = new OutForDeliveryState();
    private OutForDeliveryState() {}

    @Override public OrderState deliver(Order order) { return DeliveredOrderState.INSTANCE; }

    @Override public OrderState confirm(Order order)        { throw invalid("already past confirmation"); }
    @Override public OrderState startPreparing(Order order) { throw invalid("already prepared"); }
    @Override public OrderState markReady(Order order)      { throw invalid("already picked up"); }
    @Override public OrderState pickUp(Order order)         { throw invalid("already picked up"); }
    @Override public OrderState cancel(Order order)         { throw invalid("order is en route, cannot cancel"); }

    @Override public OrderStatus getStatus() { return OrderStatus.OUT_FOR_DELIVERY; }

    private IllegalStateException invalid(String reason) {
        return new IllegalStateException("Order is OUT_FOR_DELIVERY -- " + reason);
    }
}
```

</details>

### `model/PartnerStatus.java`

<details>
<summary>Click to view model/PartnerStatus.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;
public enum PartnerStatus { AVAILABLE, BUSY, OFFLINE }
```

</details>

### `model/PlacedOrderState.java`

<details>
<summary>Click to view model/PlacedOrderState.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;

public class PlacedOrderState implements OrderState {
    public static final PlacedOrderState INSTANCE = new PlacedOrderState();
    private PlacedOrderState() {}

    @Override public OrderState confirm(Order order)        { return ConfirmedOrderState.INSTANCE; }
    @Override public OrderState cancel(Order order)         { return CancelledOrderState.INSTANCE; }

    @Override public OrderState startPreparing(Order order) { throw invalid("confirm before preparing"); }
    @Override public OrderState markReady(Order order)      { throw invalid("not preparing yet"); }
    @Override public OrderState pickUp(Order order)         { throw invalid("not ready yet"); }
    @Override public OrderState deliver(Order order)        { throw invalid("not out for delivery yet"); }

    @Override public OrderStatus getStatus() { return OrderStatus.PLACED; }

    private IllegalStateException invalid(String reason) {
        return new IllegalStateException("Order is PLACED -- " + reason);
    }
}
```

</details>

### `model/PreparingOrderState.java`

<details>
<summary>Click to view model/PreparingOrderState.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;

public class PreparingOrderState implements OrderState {
    public static final PreparingOrderState INSTANCE = new PreparingOrderState();
    private PreparingOrderState() {}

    @Override public OrderState markReady(Order order)      { return ReadyForPickupState.INSTANCE; }
    @Override public OrderState cancel(Order order)         { return CancelledOrderState.INSTANCE; }

    @Override public OrderState confirm(Order order)        { throw invalid("already confirmed"); }
    @Override public OrderState startPreparing(Order order) { throw invalid("already preparing"); }
    @Override public OrderState pickUp(Order order)         { throw invalid("not ready yet"); }
    @Override public OrderState deliver(Order order)        { throw invalid("not out for delivery yet"); }

    @Override public OrderStatus getStatus() { return OrderStatus.PREPARING; }

    private IllegalStateException invalid(String reason) {
        return new IllegalStateException("Order is PREPARING -- " + reason);
    }
}
```

</details>

### `model/ReadyForPickupState.java`

<details>
<summary>Click to view model/ReadyForPickupState.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;

public class ReadyForPickupState implements OrderState {
    public static final ReadyForPickupState INSTANCE = new ReadyForPickupState();
    private ReadyForPickupState() {}

    @Override public OrderState pickUp(Order order) { return OutForDeliveryState.INSTANCE; }

    @Override public OrderState confirm(Order order)        { throw invalid("already past confirmation"); }
    @Override public OrderState startPreparing(Order order) { throw invalid("already prepared"); }
    @Override public OrderState markReady(Order order)      { throw invalid("already ready"); }
    @Override public OrderState deliver(Order order)        { throw invalid("not picked up yet"); }
    @Override public OrderState cancel(Order order)         { throw invalid("food already prepared, cannot cancel"); }

    @Override public OrderStatus getStatus() { return OrderStatus.READY_FOR_PICKUP; }

    private IllegalStateException invalid(String reason) {
        return new IllegalStateException("Order is READY_FOR_PICKUP -- " + reason);
    }
}
```

</details>

### `model/Restaurant.java`

<details>
<summary>Click to view model/Restaurant.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;
import java.util.*;

public class Restaurant {
    private final String restaurantId;
    private String name;
    private Address address;
    private List<MenuItem> menu;
    private RestaurantStatus status;
    private double rating;
    private List<String> cuisineTypes;
    private String phoneNumber;
    private Map<String, Integer> preparationTimes; // menuItemId -> minutes
    
    public Restaurant(String restaurantId, String name, Address address) {
        this.restaurantId = restaurantId;
        this.name = name;
        this.address = address;
        this.menu = new ArrayList<>();
        this.status = RestaurantStatus.OPEN;
        this.rating = 0.0;
        this.cuisineTypes = new ArrayList<>();
        this.preparationTimes = new HashMap<>();
    }
    
    public String getRestaurantId() { return restaurantId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Address getAddress() { return address; }
    public List<MenuItem> getMenu() { return new ArrayList<>(menu); }
    public void addMenuItem(MenuItem item) { menu.add(item); }
    public void removeMenuItem(String itemId) { 
        menu.removeIf(item -> item.getItemId().equals(itemId)); 
    }
    public RestaurantStatus getStatus() { return status; }
    public void setStatus(RestaurantStatus status) { this.status = status; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public List<String> getCuisineTypes() { return new ArrayList<>(cuisineTypes); }
    public void addCuisineType(String cuisine) { cuisineTypes.add(cuisine); }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setPreparationTime(String itemId, int minutes) {
        preparationTimes.put(itemId, minutes);
    }
    public int getPreparationTime(String itemId) {
        return preparationTimes.getOrDefault(itemId, 30);
    }
    public boolean isOpen() { return status == RestaurantStatus.OPEN; }
}
```

</details>

### `model/RestaurantStatus.java`

<details>
<summary>Click to view model/RestaurantStatus.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;
public enum RestaurantStatus { OPEN, CLOSED, TEMPORARILY_CLOSED, ACCEPTING_ORDERS_ONLY }
```

</details>

### `impl/ConsoleNotificationService.java`

<details>
<summary>Click to view impl/ConsoleNotificationService.java</summary>

```java
package com.you.lld.problems.fooddelivery.impl;

import com.you.lld.problems.fooddelivery.api.NotificationService;

public class ConsoleNotificationService implements NotificationService {
    @Override
    public void notify(String recipientId, String message) {
        System.out.println("[NOTIFY -> " + recipientId + "] " + message);
    }
}
```

</details>

### `impl/InMemoryFoodDeliveryService.java`

<details>
<summary>Click to view impl/InMemoryFoodDeliveryService.java</summary>

```java
package com.you.lld.problems.fooddelivery.impl;

import com.you.lld.problems.fooddelivery.api.FoodDeliveryService;
import com.you.lld.problems.fooddelivery.api.NotificationService;
import com.you.lld.problems.fooddelivery.exceptions.*;
import com.you.lld.problems.fooddelivery.model.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * In-memory Food Delivery Service implementation.
 *
 * Patterns:
 *   State    -- Order lifecycle via OrderState (7 states, validated transitions)
 *   Observer -- OrderObserver / OrderNotifier (customer + restaurant + partner)
 *               Notified on every state change. SRP: no notification logic in entities.
 *
 * Concurrency:
 *   - ConcurrentHashMap for all stores
 *   - synchronized(order) for per-order state transitions
 *   - synchronized(partner) for partner assignment/release
 *
 * Key fixes vs original:
 *   - placeOrder validates items against restaurant menu (existence, availability, price)
 *   - Partner is released back to AVAILABLE when order is DELIVERED or CANCELLED
 *   - updateOrderStatus replaced by named transition methods via State pattern
 */
public class InMemoryFoodDeliveryService implements FoodDeliveryService {

    private final Map<String, Restaurant> restaurants = new ConcurrentHashMap<>();
    private final Map<String, Customer> customers = new ConcurrentHashMap<>();
    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    private final Map<String, DeliveryPartner> deliveryPartners = new ConcurrentHashMap<>();

    private final NotificationService notificationService;

    public InMemoryFoodDeliveryService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // ======================== Restaurant ========================

    @Override
    public Restaurant registerRestaurant(String name, Address address) {
        String id = UUID.randomUUID().toString();
        Restaurant restaurant = new Restaurant(id, name, address);
        restaurants.put(id, restaurant);
        return restaurant;
    }

    @Override
    public Restaurant getRestaurant(String restaurantId) {
        Restaurant r = restaurants.get(restaurantId);
        if (r == null) throw new RestaurantNotFoundException("Restaurant not found: " + restaurantId);
        return r;
    }

    @Override
    public List<Restaurant> searchRestaurants(String query, Address location, double radiusKm) {
        return restaurants.values().stream()
            .filter(Restaurant::isOpen)
            .filter(r -> query == null || r.getName().toLowerCase().contains(query.toLowerCase()))
            .filter(r -> location == null || r.getAddress().distanceTo(location) <= radiusKm)
            .sorted((a, b) -> Double.compare(b.getRating(), a.getRating()))
            .collect(Collectors.toList());
    }

    @Override
    public void updateRestaurantStatus(String restaurantId, RestaurantStatus status) {
        getRestaurant(restaurantId).setStatus(status);
    }

    // ======================== Menu ========================

    @Override
    public void addMenuItem(String restaurantId, MenuItem item) {
        getRestaurant(restaurantId).addMenuItem(item);
    }

    @Override
    public void removeMenuItem(String restaurantId, String itemId) {
        getRestaurant(restaurantId).removeMenuItem(itemId);
    }

    @Override
    public void updateMenuItemAvailability(String restaurantId, String itemId, boolean available) {
        Restaurant r = getRestaurant(restaurantId);
        r.getMenu().stream()
            .filter(item -> item.getItemId().equals(itemId))
            .findFirst()
            .ifPresent(item -> item.setAvailable(available));
    }

    // ======================== Customer ========================

    @Override
    public Customer registerCustomer(String name, String email, String phone) {
        String id = UUID.randomUUID().toString();
        Customer customer = new Customer(id, name, email, phone);
        customers.put(id, customer);
        return customer;
    }

    @Override
    public Customer getCustomer(String customerId) {
        Customer c = customers.get(customerId);
        if (c == null) throw new CustomerNotFoundException("Customer not found: " + customerId);
        return c;
    }

    // ======================== Order lifecycle ========================

    /**
     * Place an order. Validates every OrderItem against the restaurant menu:
     * - item must exist
     * - item must be available
     * - price is taken from menu (not trusted from caller)
     *
     * Registers customer and restaurant OrderNotifiers (Observer pattern).
     */
    @Override
    public Order placeOrder(String customerId, String restaurantId,
                            List<OrderItem> items, Address deliveryAddress) {
        Customer customer = getCustomer(customerId);
        Restaurant restaurant = getRestaurant(restaurantId);

        if (!restaurant.isOpen()) {
            throw new RestaurantClosedException("Restaurant is not accepting orders");
        }
        if (items == null || items.isEmpty()) {
            throw new InvalidOperationException("Order must have at least one item");
        }

        Map<String, MenuItem> menuMap = new HashMap<>();
        for (MenuItem mi : restaurant.getMenu()) {
            menuMap.put(mi.getItemId(), mi);
        }

        String orderId = UUID.randomUUID().toString();
        Order order = new Order(orderId, customerId, restaurantId, deliveryAddress);

        for (OrderItem oi : items) {
            MenuItem menuItem = menuMap.get(oi.getMenuItemId());
            if (menuItem == null) {
                throw new InvalidOperationException("Menu item not found: " + oi.getMenuItemId());
            }
            if (!menuItem.isAvailable()) {
                throw new InvalidOperationException("Menu item not available: " + menuItem.getName());
            }
            order.addItem(new OrderItem(menuItem.getItemId(), menuItem.getName(),
                                        menuItem.getPrice(), oi.getQuantity()));
        }

        order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(45));

        order.addObserver(new OrderNotifier(customerId, "Customer", notificationService));
        order.addObserver(new OrderNotifier(restaurantId, "Restaurant", notificationService));

        orders.put(orderId, order);
        customer.addOrderToHistory(orderId);

        System.out.println("[FoodDelivery] Order placed: " + orderId
            + " | Items: " + order.getItems().size()
            + " | Total: $" + String.format("%.2f", order.getTotalAmount()));
        return order;
    }

    @Override
    public Order getOrder(String orderId) {
        Order o = orders.get(orderId);
        if (o == null) throw new OrderNotFoundException("Order not found: " + orderId);
        return o;
    }

    @Override
    public List<Order> getCustomerOrders(String customerId) {
        return orders.values().stream()
            .filter(o -> o.getCustomerId().equals(customerId))
            .sorted((a, b) -> b.getOrderedAt().compareTo(a.getOrderedAt()))
            .collect(Collectors.toList());
    }

    @Override
    public List<Order> getRestaurantOrders(String restaurantId) {
        return orders.values().stream()
            .filter(o -> o.getRestaurantId().equals(restaurantId))
            .sorted((a, b) -> b.getOrderedAt().compareTo(a.getOrderedAt()))
            .collect(Collectors.toList());
    }

    /**
     * Named state transitions via State pattern.
     * Each transition is synchronized on the order for per-order concurrency.
     * On DELIVERED/CANCELLED: releases the delivery partner back to AVAILABLE.
     */
    @Override
    public void updateOrderStatus(String orderId, OrderStatus status) {
        Order order = getOrder(orderId);
        synchronized (order) {
            switch (status) {
                case CONFIRMED:        order.confirm();        break;
                case PREPARING:        order.startPreparing(); break;
                case READY_FOR_PICKUP: order.markReady();      break;
                case OUT_FOR_DELIVERY: order.pickUp();         break;
                case DELIVERED:        order.deliver();        releasePartner(order); break;
                default:
                    throw new InvalidOperationException("Use cancelOrder() to cancel");
            }
        }
    }

    @Override
    public void cancelOrder(String orderId) {
        Order order = getOrder(orderId);
        synchronized (order) {
            order.cancel();
            releasePartner(order);
        }
    }

    // ======================== Delivery Partner ========================

    @Override
    public DeliveryPartner registerDeliveryPartner(String name, String phone) {
        String id = UUID.randomUUID().toString();
        DeliveryPartner partner = new DeliveryPartner(id, name, phone);
        deliveryPartners.put(id, partner);
        return partner;
    }

    /**
     * Assign a delivery partner to an order.
     * Synchronized on partner to prevent double-assignment.
     * Registers a PartnerOrderNotifier (Observer) on the order.
     */
    @Override
    public void assignDeliveryPartner(String orderId, String partnerId) {
        Order order = getOrder(orderId);
        DeliveryPartner partner = deliveryPartners.get(partnerId);
        if (partner == null) throw new PartnerNotFoundException("Partner not found: " + partnerId);

        synchronized (partner) {
            if (!partner.isAvailable()) {
                throw new PartnerNotAvailableException("Partner " + partnerId + " is not available");
            }
            order.setDeliveryPartnerId(partnerId);
            partner.setStatus(PartnerStatus.BUSY);
            partner.setCurrentOrderId(orderId);

            order.addObserver(new OrderNotifier(partnerId, "DeliveryPartner", notificationService));
        }
    }

    @Override
    public List<DeliveryPartner> getAvailablePartners(Address location) {
        return deliveryPartners.values().stream()
            .filter(DeliveryPartner::isAvailable)
            .filter(p -> location == null || p.getCurrentLocation() == null
                || p.getCurrentLocation().distanceTo(location) <= 10.0)
            .collect(Collectors.toList());
    }

    @Override
    public void updatePartnerLocation(String partnerId, Address location) {
        DeliveryPartner partner = deliveryPartners.get(partnerId);
        if (partner == null) throw new PartnerNotFoundException("Partner not found: " + partnerId);
        partner.setCurrentLocation(location);
    }

    // ======================== Internal ========================

    private void releasePartner(Order order) {
        String partnerId = order.getDeliveryPartnerId();
        if (partnerId == null) return;
        DeliveryPartner partner = deliveryPartners.get(partnerId);
        if (partner != null) {
            synchronized (partner) {
                partner.setStatus(PartnerStatus.AVAILABLE);
                partner.setCurrentOrderId(null);
            }
        }
    }
}
```

</details>

### `impl/OrderNotifier.java`

<details>
<summary>Click to view impl/OrderNotifier.java</summary>

```java
package com.you.lld.problems.fooddelivery.impl;

import com.you.lld.problems.fooddelivery.api.NotificationService;
import com.you.lld.problems.fooddelivery.model.Order;
import com.you.lld.problems.fooddelivery.model.OrderObserver;

/**
 * Observer that bridges Order state changes -> NotificationService delivery.
 *
 * One OrderNotifier per stakeholder per order. The service registers:
 *   - Customer notifier on placeOrder
 *   - Restaurant notifier on placeOrder
 *   - Partner notifier on assignDeliveryPartner
 *
 * Keeps Order and all entity classes pure (no notification logic in entities -- SRP).
 */
public class OrderNotifier implements OrderObserver {

    private final String recipientId;
    private final String role;
    private final NotificationService notificationService;

    public OrderNotifier(String recipientId, String role, NotificationService notificationService) {
        this.recipientId = recipientId;
        this.role = role;
        this.notificationService = notificationService;
    }

    @Override
    public void update(Order order) {
        String msg;
        switch (order.getStatus()) {
            case CONFIRMED:
                msg = "Order " + order.getOrderId() + " confirmed by restaurant.";
                break;
            case PREPARING:
                msg = "Order " + order.getOrderId() + " is being prepared.";
                break;
            case READY_FOR_PICKUP:
                msg = "Order " + order.getOrderId() + " is ready for pickup.";
                break;
            case OUT_FOR_DELIVERY:
                msg = "Order " + order.getOrderId() + " is out for delivery.";
                break;
            case DELIVERED:
                msg = "Order " + order.getOrderId() + " delivered! Total: $"
                    + String.format("%.2f", order.getTotalAmount());
                break;
            case CANCELLED:
                msg = "Order " + order.getOrderId() + " has been cancelled.";
                break;
            default:
                return;
        }
        notificationService.notify(recipientId + " (" + role + ")", msg);
    }
}
```

</details>

### `exceptions/CustomerNotFoundException.java`

<details>
<summary>Click to view exceptions/CustomerNotFoundException.java</summary>

```java
package com.you.lld.problems.fooddelivery.exceptions;
public class CustomerNotFoundException extends RuntimeException {
    public CustomerNotFoundException(String message) { super(message); }
}
```

</details>

### `exceptions/InvalidOperationException.java`

<details>
<summary>Click to view exceptions/InvalidOperationException.java</summary>

```java
package com.you.lld.problems.fooddelivery.exceptions;

public class InvalidOperationException extends RuntimeException {
    public InvalidOperationException(String message) {
        super(message);
    }
}
```

</details>

### `exceptions/OrderNotFoundException.java`

<details>
<summary>Click to view exceptions/OrderNotFoundException.java</summary>

```java
package com.you.lld.problems.fooddelivery.exceptions;
public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(String message) { super(message); }
}
```

</details>

### `exceptions/PartnerNotAvailableException.java`

<details>
<summary>Click to view exceptions/PartnerNotAvailableException.java</summary>

```java
package com.you.lld.problems.fooddelivery.exceptions;
public class PartnerNotAvailableException extends RuntimeException {
    public PartnerNotAvailableException(String message) { super(message); }
}
```

</details>

### `exceptions/PartnerNotFoundException.java`

<details>
<summary>Click to view exceptions/PartnerNotFoundException.java</summary>

```java
package com.you.lld.problems.fooddelivery.exceptions;
public class PartnerNotFoundException extends RuntimeException {
    public PartnerNotFoundException(String message) { super(message); }
}
```

</details>

### `exceptions/RestaurantClosedException.java`

<details>
<summary>Click to view exceptions/RestaurantClosedException.java</summary>

```java
package com.you.lld.problems.fooddelivery.exceptions;
public class RestaurantClosedException extends RuntimeException {
    public RestaurantClosedException(String message) { super(message); }
}
```

</details>

### `exceptions/RestaurantNotFoundException.java`

<details>
<summary>Click to view exceptions/RestaurantNotFoundException.java</summary>

```java
package com.you.lld.problems.fooddelivery.exceptions;
public class RestaurantNotFoundException extends RuntimeException {
    public RestaurantNotFoundException(String message) { super(message); }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.fooddelivery.FoodDeliveryDemo"
```

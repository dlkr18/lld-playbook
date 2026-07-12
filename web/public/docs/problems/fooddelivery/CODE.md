# fooddelivery - Complete Implementation

## 📁 Project Structure (20 files)

```
fooddelivery/
├── FoodDeliveryDemo.java
├── api/FoodDeliveryService.java
├── exceptions/CustomerNotFoundException.java
├── exceptions/InvalidOperationException.java
├── exceptions/OrderNotFoundException.java
├── exceptions/PartnerNotAvailableException.java
├── exceptions/PartnerNotFoundException.java
├── exceptions/RestaurantClosedException.java
├── exceptions/RestaurantNotFoundException.java
├── impl/InMemoryFoodDeliveryService.java
├── model/Address.java
├── model/Customer.java
├── model/DeliveryPartner.java
├── model/MenuItem.java
├── model/Order.java
├── model/OrderItem.java
├── model/OrderStatus.java
├── model/PartnerStatus.java
├── model/Restaurant.java
├── model/RestaurantStatus.java
```

## 📝 Source Code

### 📄 `FoodDeliveryDemo.java`

<details>
<summary>📄 Click to view FoodDeliveryDemo.java</summary>

```java
package com.you.lld.problems.fooddelivery;
import com.you.lld.problems.fooddelivery.api.*;
import com.you.lld.problems.fooddelivery.impl.*;
import com.you.lld.problems.fooddelivery.model.*;
import java.util.*;

public class FoodDeliveryDemo {
    public static void main(String[] args) {
        System.out.println("=== Food Delivery System Demo ===\n");
        
        FoodDeliveryService service = new InMemoryFoodDeliveryService();
        
        // Register Restaurant
        Address restaurantAddr = new Address("123 Main St", "NYC", "NY", "10001");
        restaurantAddr.setLatitude(40.7128);
        restaurantAddr.setLongitude(-74.0060);
        Restaurant restaurant = service.registerRestaurant("Pizza Palace", restaurantAddr);
        System.out.println("✅ Restaurant registered: " + restaurant.getName());
        
        // Add Menu Items
        MenuItem pizza = new MenuItem("ITEM001", "Margherita Pizza", 12.99);
        pizza.setCategory("Pizza");
        pizza.setVegetarian(true);
        service.addMenuItem(restaurant.getRestaurantId(), pizza);
        
        MenuItem pasta = new MenuItem("ITEM002", "Alfredo Pasta", 10.99);
        pasta.setCategory("Pasta");
        service.addMenuItem(restaurant.getRestaurantId(), pasta);
        
        System.out.println("✅ Menu items added: " + restaurant.getMenu().size());
        
        // Register Customer
        Customer customer = service.registerCustomer("John Doe", "john@example.com", "555-0100");
        Address deliveryAddr = new Address("456 Park Ave", "NYC", "NY", "10002");
        deliveryAddr.setLatitude(40.7589);
        deliveryAddr.setLongitude(-73.9851);
        customer.addAddress(deliveryAddr);
        System.out.println("✅ Customer registered: " + customer.getName());
        
        // Place Order
        List<OrderItem> items = new ArrayList<>();
        items.add(new OrderItem("ITEM001", pizza.getName(), pizza.getPrice(), 2));
        items.add(new OrderItem("ITEM002", pasta.getName(), pasta.getPrice(), 1));
        
        Order order = service.placeOrder(
            customer.getCustomerId(),
            restaurant.getRestaurantId(),
            items,
            deliveryAddr
        );
        
        System.out.println("\n✅ Order placed successfully!");
        System.out.println("   Order ID: " + order.getOrderId());
        System.out.println("   Status: " + order.getStatus());
        System.out.println("   Items: " + order.getItems().size());
        System.out.println("   Total: $" + String.format("%.2f", order.getTotalAmount()));
        
        // Register Delivery Partner
        DeliveryPartner partner = service.registerDeliveryPartner("Mike Wilson", "555-0200");
        partner.setVehicleNumber("ABC123");
        System.out.println("\n✅ Delivery partner registered: " + partner.getName());
        
        // Assign Partner
        service.assignDeliveryPartner(order.getOrderId(), partner.getPartnerId());
        System.out.println("✅ Partner assigned to order");
        
        // Update Order Status
        service.updateOrderStatus(order.getOrderId(), OrderStatus.PREPARING);
        System.out.println("✅ Order status: PREPARING");
        
        service.updateOrderStatus(order.getOrderId(), OrderStatus.OUT_FOR_DELIVERY);
        System.out.println("✅ Order status: OUT_FOR_DELIVERY");
        
        service.updateOrderStatus(order.getOrderId(), OrderStatus.DELIVERED);
        System.out.println("✅ Order status: DELIVERED");
        
        // Search Restaurants
        List<Restaurant> nearby = service.searchRestaurants("pizza", deliveryAddr, 10.0);
        System.out.println("\n🔍 Found " + nearby.size() + " restaurants nearby");
        
        System.out.println("\n✅ Demo completed successfully!");
    }
}
```

</details>

### 📄 `api/FoodDeliveryService.java`

<details>
<summary>📄 Click to view api/FoodDeliveryService.java</summary>

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

### 📄 `exceptions/CustomerNotFoundException.java`

<details>
<summary>📄 Click to view exceptions/CustomerNotFoundException.java</summary>

```java
package com.you.lld.problems.fooddelivery.exceptions;
public class CustomerNotFoundException extends RuntimeException {
    public CustomerNotFoundException(String message) { super(message); }
}
```

</details>

### 📄 `exceptions/InvalidOperationException.java`

<details>
<summary>📄 Click to view exceptions/InvalidOperationException.java</summary>

```java
package com.you.lld.problems.fooddelivery.exceptions;
public class InvalidOperationException extends RuntimeException {
    public InvalidOperationException(String message) { super(message); }
}
```

</details>

### 📄 `exceptions/OrderNotFoundException.java`

<details>
<summary>📄 Click to view exceptions/OrderNotFoundException.java</summary>

```java
package com.you.lld.problems.fooddelivery.exceptions;
public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(String message) { super(message); }
}
```

</details>

### 📄 `exceptions/PartnerNotAvailableException.java`

<details>
<summary>📄 Click to view exceptions/PartnerNotAvailableException.java</summary>

```java
package com.you.lld.problems.fooddelivery.exceptions;
public class PartnerNotAvailableException extends RuntimeException {
    public PartnerNotAvailableException(String message) { super(message); }
}
```

</details>

### 📄 `exceptions/PartnerNotFoundException.java`

<details>
<summary>📄 Click to view exceptions/PartnerNotFoundException.java</summary>

```java
package com.you.lld.problems.fooddelivery.exceptions;
public class PartnerNotFoundException extends RuntimeException {
    public PartnerNotFoundException(String message) { super(message); }
}
```

</details>

### 📄 `exceptions/RestaurantClosedException.java`

<details>
<summary>📄 Click to view exceptions/RestaurantClosedException.java</summary>

```java
package com.you.lld.problems.fooddelivery.exceptions;
public class RestaurantClosedException extends RuntimeException {
    public RestaurantClosedException(String message) { super(message); }
}
```

</details>

### 📄 `exceptions/RestaurantNotFoundException.java`

<details>
<summary>📄 Click to view exceptions/RestaurantNotFoundException.java</summary>

```java
package com.you.lld.problems.fooddelivery.exceptions;
public class RestaurantNotFoundException extends RuntimeException {
    public RestaurantNotFoundException(String message) { super(message); }
}
```

</details>

### 📄 `impl/InMemoryFoodDeliveryService.java`

<details>
<summary>📄 Click to view impl/InMemoryFoodDeliveryService.java</summary>

```java
package com.you.lld.problems.fooddelivery.impl;
import com.you.lld.problems.fooddelivery.api.*;
import com.you.lld.problems.fooddelivery.model.*;
import com.you.lld.problems.fooddelivery.exceptions.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

public class InMemoryFoodDeliveryService implements FoodDeliveryService {
    private final Map<String, Restaurant> restaurants;
    private final Map<String, Customer> customers;
    private final Map<String, Order> orders;
    private final Map<String, DeliveryPartner> deliveryPartners;
    
    public InMemoryFoodDeliveryService() {
        this.restaurants = new HashMap<>();
        this.customers = new HashMap<>();
        this.orders = new HashMap<>();
        this.deliveryPartners = new HashMap<>();
    }
    
    @Override
    public Restaurant registerRestaurant(String name, Address address) {
        String id = UUID.randomUUID().toString();
        Restaurant restaurant = new Restaurant(id, name, address);
        restaurants.put(id, restaurant);
        return restaurant;
    }
    
    @Override
    public Restaurant getRestaurant(String restaurantId) {
        Restaurant restaurant = restaurants.get(restaurantId);
        if (restaurant == null) {
            throw new RestaurantNotFoundException("Restaurant not found: " + restaurantId);
        }
        return restaurant;
    }
    
    @Override
    public List<Restaurant> searchRestaurants(String query, Address location, double radiusKm) {
        return restaurants.values().stream()
            .filter(r -> r.isOpen())
            .filter(r -> query == null || r.getName().toLowerCase().contains(query.toLowerCase()))
            .filter(r -> location == null || r.getAddress().distanceTo(location) <= radiusKm)
            .sorted((a, b) -> Double.compare(b.getRating(), a.getRating()))
            .collect(Collectors.toList());
    }
    
    @Override
    public void updateRestaurantStatus(String restaurantId, RestaurantStatus status) {
        Restaurant restaurant = getRestaurant(restaurantId);
        restaurant.setStatus(status);
    }
    
    @Override
    public void addMenuItem(String restaurantId, MenuItem item) {
        Restaurant restaurant = getRestaurant(restaurantId);
        restaurant.addMenuItem(item);
    }
    
    @Override
    public void removeMenuItem(String restaurantId, String itemId) {
        Restaurant restaurant = getRestaurant(restaurantId);
        restaurant.removeMenuItem(itemId);
    }
    
    @Override
    public void updateMenuItemAvailability(String restaurantId, String itemId, boolean available) {
        Restaurant restaurant = getRestaurant(restaurantId);
        restaurant.getMenu().stream()
            .filter(item -> item.getItemId().equals(itemId))
            .findFirst()
            .ifPresent(item -> item.setAvailable(available));
    }
    
    @Override
    public Customer registerCustomer(String name, String email, String phone) {
        String id = UUID.randomUUID().toString();
        Customer customer = new Customer(id, name, email, phone);
        customers.put(id, customer);
        return customer;
    }
    
    @Override
    public Customer getCustomer(String customerId) {
        Customer customer = customers.get(customerId);
        if (customer == null) {
            throw new CustomerNotFoundException("Customer not found: " + customerId);
        }
        return customer;
    }
    
    @Override
    public Order placeOrder(String customerId, String restaurantId, 
                           List<OrderItem> items, Address deliveryAddress) {
        Customer customer = getCustomer(customerId);
        Restaurant restaurant = getRestaurant(restaurantId);
        
        if (!restaurant.isOpen()) {
            throw new RestaurantClosedException("Restaurant is not accepting orders");
        }
        
        String orderId = UUID.randomUUID().toString();
        Order order = new Order(orderId, customerId, restaurantId, deliveryAddress);
        
        for (OrderItem item : items) {
            order.addItem(item);
        }
        
        order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(45));
        orders.put(orderId, order);
        customer.addOrderToHistory(orderId);
        
        return order;
    }
    
    @Override
    public Order getOrder(String orderId) {
        Order order = orders.get(orderId);
        if (order == null) {
            throw new OrderNotFoundException("Order not found: " + orderId);
        }
        return order;
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
    
    @Override
    public void updateOrderStatus(String orderId, OrderStatus status) {
        Order order = getOrder(orderId);
        order.setStatus(status);
        if (status == OrderStatus.DELIVERED) {
            order.setActualDeliveryTime(LocalDateTime.now());
        }
    }
    
    @Override
    public void cancelOrder(String orderId) {
        Order order = getOrder(orderId);
        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new InvalidOperationException("Cannot cancel delivered order");
        }
        order.setStatus(OrderStatus.CANCELLED);
    }
    
    @Override
    public DeliveryPartner registerDeliveryPartner(String name, String phone) {
        String id = UUID.randomUUID().toString();
        DeliveryPartner partner = new DeliveryPartner(id, name, phone);
        deliveryPartners.put(id, partner);
        return partner;
    }
    
    @Override
    public void assignDeliveryPartner(String orderId, String partnerId) {
        Order order = getOrder(orderId);
        DeliveryPartner partner = deliveryPartners.get(partnerId);
        if (partner == null) {
            throw new PartnerNotFoundException("Partner not found");
        }
        if (!partner.isAvailable()) {
            throw new PartnerNotAvailableException("Partner is not available");
        }
        
        order.setDeliveryPartnerId(partnerId);
        partner.setStatus(PartnerStatus.BUSY);
        partner.setCurrentOrderId(orderId);
    }
    
    @Override
    public List<DeliveryPartner> getAvailablePartners(Address location) {
        return deliveryPartners.values().stream()
            .filter(DeliveryPartner::isAvailable)
            .collect(Collectors.toList());
    }
    
    @Override
    public void updatePartnerLocation(String partnerId, Address location) {
        DeliveryPartner partner = deliveryPartners.get(partnerId);
        if (partner != null) {
            partner.setCurrentLocation(location);
        }
    }
}
```

</details>

### 📄 `model/Address.java`

<details>
<summary>📄 Click to view model/Address.java</summary>

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
    
    public String getStreet() { return street; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getZipCode() { return zipCode; }
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    
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

### 📄 `model/Customer.java`

<details>
<summary>📄 Click to view model/Customer.java</summary>

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
    
    public String getCustomerId() { return customerId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public List<Address> getAddresses() { return new ArrayList<>(addresses); }
    public void addAddress(Address address) { addresses.add(address); }
    public List<String> getOrderHistory() { return new ArrayList<>(orderHistory); }
    public void addOrderToHistory(String orderId) { orderHistory.add(orderId); }
}
```

</details>

### 📄 `model/DeliveryPartner.java`

<details>
<summary>📄 Click to view model/DeliveryPartner.java</summary>

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

### 📄 `model/MenuItem.java`

<details>
<summary>📄 Click to view model/MenuItem.java</summary>

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

### 📄 `model/Order.java`

<details>
<summary>📄 Click to view model/Order.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;
import java.time.LocalDateTime;
import java.util.*;

public class Order {
    private final String orderId;
    private final String customerId;
    private final String restaurantId;
    private List<OrderItem> items;
    private OrderStatus status;
    private String deliveryPartnerId;
    private Address deliveryAddress;
    private double subtotal;
    private double deliveryFee;
    private double tax;
    private double totalAmount;
    private LocalDateTime orderedAt;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime actualDeliveryTime;
    private String specialInstructions;
    
    public Order(String orderId, String customerId, String restaurantId, Address deliveryAddress) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.restaurantId = restaurantId;
        this.deliveryAddress = deliveryAddress;
        this.items = new ArrayList<>();
        this.status = OrderStatus.PLACED;
        this.orderedAt = LocalDateTime.now();
    }
    
    public String getOrderId() { return orderId; }
    public String getCustomerId() { return customerId; }
    public String getRestaurantId() { return restaurantId; }
    public List<OrderItem> getItems() { return new ArrayList<>(items); }
    public void addItem(OrderItem item) { 
        items.add(item);
        calculateAmounts();
    }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public String getDeliveryPartnerId() { return deliveryPartnerId; }
    public void setDeliveryPartnerId(String partnerId) { this.deliveryPartnerId = partnerId; }
    public Address getDeliveryAddress() { return deliveryAddress; }
    public double getSubtotal() { return subtotal; }
    public double getDeliveryFee() { return deliveryFee; }
    public double getTax() { return tax; }
    public double getTotalAmount() { return totalAmount; }
    public LocalDateTime getOrderedAt() { return orderedAt; }
    public LocalDateTime getEstimatedDeliveryTime() { return estimatedDeliveryTime; }
    public void setEstimatedDeliveryTime(LocalDateTime time) { this.estimatedDeliveryTime = time; }
    public LocalDateTime getActualDeliveryTime() { return actualDeliveryTime; }
    public void setActualDeliveryTime(LocalDateTime time) { this.actualDeliveryTime = time; }
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String instructions) { this.specialInstructions = instructions; }
    
    private void calculateAmounts() {
        this.subtotal = items.stream().mapToDouble(OrderItem::getTotal).sum();
        this.deliveryFee = subtotal > 50 ? 0 : 5.0;
        this.tax = subtotal * 0.08;
        this.totalAmount = subtotal + deliveryFee + tax;
    }
}
```

</details>

### 📄 `model/OrderItem.java`

<details>
<summary>📄 Click to view model/OrderItem.java</summary>

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

### 📄 `model/OrderStatus.java`

<details>
<summary>📄 Click to view model/OrderStatus.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;
public enum OrderStatus {
    PLACED, CONFIRMED, PREPARING, READY_FOR_PICKUP, 
    OUT_FOR_DELIVERY, DELIVERED, CANCELLED
}
```

</details>

### 📄 `model/PartnerStatus.java`

<details>
<summary>📄 Click to view model/PartnerStatus.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;
public enum PartnerStatus { AVAILABLE, BUSY, OFFLINE }
```

</details>

### 📄 `model/Restaurant.java`

<details>
<summary>📄 Click to view model/Restaurant.java</summary>

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

### 📄 `model/RestaurantStatus.java`

<details>
<summary>📄 Click to view model/RestaurantStatus.java</summary>

```java
package com.you.lld.problems.fooddelivery.model;
public enum RestaurantStatus { OPEN, CLOSED, TEMPORARILY_CLOSED, ACCEPTING_ORDERS_ONLY }
```

</details>


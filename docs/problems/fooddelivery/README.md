# Food Delivery System (Uber Eats / DoorDash)

## Overview
A comprehensive food delivery platform connecting customers, restaurants, and delivery partners. Supports restaurant discovery, menu browsing, order placement, real-time tracking, payment processing, and delivery partner assignment with intelligent routing algorithms.

**Difficulty:** Hard  
**Domain:** E-Commerce, Logistics  
**Interview Frequency:** Very High (Uber, DoorDash, Zomato, Swiggy, Grubhub)

## Requirements

### Functional Requirements
1. **Restaurant Management**
   - Register restaurants with location, cuisine, hours
   - Manage menu items (add, update, remove)
   - Track restaurant ratings and reviews
   - Handle restaurant availability status

2. **Customer Management**
   - User registration and authentication
   - Manage delivery addresses
   - Order history and favorites
   - Payment methods

3. **Order Management**
   - Browse restaurants by location/cuisine
   - Add items to cart
   - Place orders with special instructions
   - Track order status in real-time
   - Cancel orders (within time window)

4. **Delivery Partner Management**
   - Register delivery partners
   - Track partner location in real-time
   - Assign orders to nearest available partner
   - Track earnings and ratings

5. **Search & Discovery**
   - Search restaurants by name, cuisine, dish
   - Filter by ratings, delivery time, price
   - Sort by distance, popularity, rating
   - Show estimated delivery time

6. **Payment Processing**
   - Multiple payment methods (Card, Wallet, COD)
   - Calculate order total (subtotal + tax + delivery fee)
   - Apply discounts and promo codes
   - Process refunds for cancellations

### Non-Functional Requirements
1. **Scalability**
   - Support millions of users
   - Handle 100K+ concurrent orders
   - Horizontal scaling for peak hours

2. **Performance**
   - Restaurant search < 500ms
   - Order placement < 1s
   - Real-time location updates < 2s

3. **Availability**
   - 99.9% uptime
   - Graceful degradation
   - Fault-tolerant delivery assignment

4. **Consistency**
   - Accurate inventory tracking
   - No double-assignment of orders
   - Atomic payment processing

## Class Diagram
![Food Delivery Class Diagram](diagrams/class.png)

## Core Components

### 1. Order Lifecycle
```
PLACED → CONFIRMED → PREPARING → READY → 
OUT_FOR_DELIVERY → DELIVERED

Alternative flows:
- PLACED → CANCELLED (by customer/restaurant)
- PREPARING → CANCELLED (within time window)
```

### 2. Key Algorithms

#### Restaurant Search (Geospatial)
```java
public List<Restaurant> searchRestaurants(String query, Address location, double radiusKm) {
    return restaurants.values().stream()
        .filter(r -> r.isOpen())
        .filter(r -> matchesQuery(r, query))
        .filter(r -> r.getAddress().distanceTo(location) <= radiusKm)
        .sorted((a, b) -> {
            // Sort by: 1) Rating, 2) Distance
            int ratingCmp = Double.compare(b.getRating(), a.getRating());
            if (ratingCmp != 0) return ratingCmp;
            return Double.compare(
                a.getAddress().distanceTo(location),
                b.getAddress().distanceTo(location)
            );
        })
        .collect(Collectors.toList());
}
```

**Time Complexity:** O(N log N) where N = restaurants  
**Space Complexity:** O(N)

**Optimization:** Use geospatial index (R-tree, Quadtree, or PostGIS)

#### Distance Calculation (Haversine Formula)
```java
public double distanceTo(Address other) {
    double R = 6371; // Earth radius in km
    
    double lat1Rad = Math.toRadians(this.latitude);
    double lat2Rad = Math.toRadians(other.latitude);
    double deltaLat = Math.toRadians(other.latitude - this.latitude);
    double deltaLon = Math.toRadians(other.longitude - this.longitude);
    
    double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
               Math.cos(lat1Rad) * Math.cos(lat2Rad) *
               Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in km
}
```

**Time Complexity:** O(1)

#### Delivery Partner Assignment (Nearest Available)
```java
public DeliveryPartner assignNearestPartner(Order order) {
    Address restaurantLocation = getRestaurant(order.getRestaurantId()).getAddress();
    
    return deliveryPartners.values().stream()
        .filter(p -> p.isAvailable())
        .min(Comparator.comparingDouble(p -> 
            p.getCurrentLocation().distanceTo(restaurantLocation)
        ))
        .orElseThrow(() -> new NoPartnerAvailableException());
}
```

**Time Complexity:** O(P) where P = delivery partners  
**Space Complexity:** O(1)

**Optimization:** Use geospatial index + Redis for real-time locations

#### Order Total Calculation
```java
public void calculateAmounts() {
    // Subtotal
    this.subtotal = items.stream()
        .mapToDouble(item -> item.getPrice() * item.getQuantity())
        .sum();
    
    // Delivery fee (distance-based)
    double distance = restaurant.getAddress().distanceTo(deliveryAddress);
    this.deliveryFee = calculateDeliveryFee(distance);
    
    // Tax (10%)
    this.tax = subtotal * 0.10;
    
    // Total
    this.totalAmount = subtotal + deliveryFee + tax;
}

private double calculateDeliveryFee(double distanceKm) {
    if (distanceKm < 2) return 2.0;
    if (distanceKm < 5) return 3.0;
    if (distanceKm < 10) return 5.0;
    return 5.0 + (distanceKm - 10) * 0.5;
}
```

### 3. Real-Time Tracking

#### Location Updates
```java
public void updatePartnerLocation(String partnerId, Address location) {
    DeliveryPartner partner = deliveryPartners.get(partnerId);
    partner.setCurrentLocation(location);
    
    // Notify customers tracking this partner's orders
    List<Order> activeOrders = getPartnerActiveOrders(partnerId);
    for (Order order : activeOrders) {
        notifyCustomer(order.getCustomerId(), 
            "Your order is " + estimateArrival(location, order.getDeliveryAddress()) + 
            " minutes away");
    }
}
```

## Design Patterns

### 1. Strategy Pattern
**Purpose:** Different delivery fee strategies

```java
interface DeliveryFeeStrategy {
    double calculate(double distance, Order order);
}

class DistanceBasedFee implements DeliveryFeeStrategy {
    public double calculate(double distance, Order order) {
        return 2.0 + distance * 0.5;
    }
}

class SurgeP ricingFee implements DeliveryFeeStrategy {
    public double calculate(double distance, Order order) {
        double baseFee = 2.0 + distance * 0.5;
        if (isPeakHour()) {
            return baseFee * 1.5; // 50% surge
        }
        return baseFee;
    }
}
```

### 2. Observer Pattern
**Purpose:** Real-time order status notifications

```java
interface OrderObserver {
    void onStatusChange(Order order, OrderStatus newStatus);
}

class CustomerNotifier implements OrderObserver {
    public void onStatusChange(Order order, OrderStatus newStatus) {
        String message = switch (newStatus) {
            case CONFIRMED -> "Your order has been confirmed!";
            case PREPARING -> "Restaurant is preparing your order";
            case OUT_FOR_DELIVERY -> "Your order is on the way!";
            case DELIVERED -> "Order delivered. Enjoy your meal!";
            default -> "Order status: " + newStatus;
        };
        sendNotification(order.getCustomerId(), message);
    }
}
```

### 3. State Pattern
**Purpose:** Order state transitions

```java
interface OrderState {
    void confirm();
    void cancel();
    void markReady();
    void assignPartner();
    void deliver();
}

class PlacedState implements OrderState {
    public void confirm() { /* transition to CONFIRMED */ }
    public void cancel() { /* transition to CANCELLED */ }
    public void markReady() { throw new IllegalStateException(); }
}

class ConfirmedState implements OrderState {
    public void markReady() { /* transition to READY */ }
    public void cancel() { /* transition to CANCELLED */ }
}
```

## Source Code

📄 **[View Complete Source Code](/problems/fooddelivery/CODE)**

**Key Files:**
- [`FoodDeliveryService.java`](/problems/fooddelivery/CODE#fooddeliveryservicejava) - Main interface (34 methods)
- [`InMemoryFoodDeliveryService.java`](/problems/fooddelivery/CODE#inmemoryfooddeliveryservicejava) - Implementation
- [`Order.java`](/problems/fooddelivery/CODE#orderjava) - Order model (49 lines)
- [`Restaurant.java`](/problems/fooddelivery/CODE#restaurantjava) - Restaurant model (46 lines)
- [`DeliveryPartner.java`](/problems/fooddelivery/CODE#deliverypartnerjava) - Partner model (30 lines)

**Total Lines of Code:** ~600 lines

## Usage Example

```java
FoodDeliveryService service = new InMemoryFoodDeliveryService();

// Register restaurant
Address restaurantAddr = new Address("123 Main St", "NYC", "NY", "10001");
restaurantAddr.setLatitude(40.7128);
restaurantAddr.setLongitude(-74.0060);
Restaurant restaurant = service.registerRestaurant("Pizza Palace", restaurantAddr);

// Add menu items
MenuItem pizza = new MenuItem("ITEM001", "Margherita Pizza", 12.99);
service.addMenuItem(restaurant.getRestaurantId(), pizza);

// Register customer
Customer customer = service.registerCustomer("John Doe", "john@example.com", "555-0100");
Address deliveryAddr = new Address("456 Park Ave", "NYC", "NY", "10002");

// Place order
List<OrderItem> items = Arrays.asList(
    new OrderItem("ITEM001", "Margherita Pizza", 12.99, 2)
);
Order order = service.placeOrder(
    customer.getCustomerId(),
    restaurant.getRestaurantId(),
    items,
    deliveryAddr
);

// Register and assign delivery partner
DeliveryPartner partner = service.registerDeliveryPartner("Mike Wilson", "555-0200");
service.assignDeliveryPartner(order.getOrderId(), partner.getPartnerId());

// Update order status
service.updateOrderStatus(order.getOrderId(), OrderStatus.PREPARING);
service.updateOrderStatus(order.getOrderId(), OrderStatus.OUT_FOR_DELIVERY);
service.updateOrderStatus(order.getOrderId(), OrderStatus.DELIVERED);
```

## Common Interview Questions

### System Design Questions

1. **How do you handle peak hour traffic (10x normal load)?**
   - Horizontal scaling with load balancers
   - Database read replicas
   - Redis caching for restaurant/menu data
   - Message queue (Kafka) for async processing
   - CDN for static assets

2. **How do you assign delivery partners efficiently?**
   - Geospatial indexing (R-tree, Quadtree)
   - Real-time location tracking (Redis Geospatial)
   - Predictive assignment (ML for ETA)
   - Batch assignment for multiple orders

3. **How do you ensure data consistency across services?**
   - Saga pattern for distributed transactions
   - Event sourcing for audit trail
   - Idempotency keys for payments
   - Two-phase commit for critical operations

4. **How do you handle restaurant going offline mid-order?**
   - Notify customer immediately
   - Offer alternatives or cancellation
   - Automatic refund processing
   - Partner compensation

### Coding Questions

1. **Find restaurants within 5km radius**
   ```java
   public List<Restaurant> findNearby(Address location, double radiusKm) {
       return restaurants.stream()
           .filter(r -> r.getAddress().distanceTo(location) <= radiusKm)
           .collect(Collectors.toList());
   }
   ```

2. **Calculate estimated delivery time**
   ```java
   public int estimateDeliveryTime(Restaurant r, Address delivery) {
       double distance = r.getAddress().distanceTo(delivery);
       int prepTime = r.getAveragePrepTime(); // minutes
       int travelTime = (int) (distance / 0.5); // 30 km/h avg speed
       return prepTime + travelTime;
   }
   ```

3. **Apply discount code**
   ```java
   public double applyDiscount(Order order, String code) {
       Discount discount = discounts.get(code);
       if (discount == null || discount.isExpired()) {
           return order.getTotalAmount();
       }
       return order.getTotalAmount() * (1 - discount.getPercentage() / 100.0);
   }
   ```

### Design Pattern Questions
1. **Which pattern for delivery fee calculation?** → Strategy Pattern
2. **Which pattern for order notifications?** → Observer Pattern
3. **Which pattern for order state management?** → State Pattern

## Trade-offs & Design Decisions

### 1. Real-Time Location Tracking
**WebSocket:** Bidirectional, high resource usage  
**Polling:** Simple, higher latency

**Decision:** WebSocket for active deliveries, polling for tracking page

### 2. Partner Assignment
**Nearest:** Fast, may not be optimal  
**Optimal (Hungarian Algorithm):** Better, computationally expensive

**Decision:** Nearest for real-time, batch optimization every 5 min

### 3. Database Choice
**SQL:** ACID, complex queries  
**NoSQL:** Scalable, eventual consistency

**Decision:** SQL for orders/payments, NoSQL for menus/tracking

## Key Takeaways

### What Interviewers Look For
1. ✅ **Geospatial algorithms** for restaurant search
2. ✅ **Real-time tracking** architecture
3. ✅ **Partner assignment** optimization
4. ✅ **Payment processing** with refunds
5. ✅ **State management** for orders
6. ✅ **Scalability** for peak loads

### Common Mistakes to Avoid
1. ❌ Linear search for nearby restaurants (use geospatial index)
2. ❌ No handling for partner unavailability
3. ❌ Forgetting order cancellation time windows
4. ❌ Not calculating delivery fees dynamically
5. ❌ No surge pricing for peak hours
6. ❌ Missing refund processing

### Production-Ready Checklist
- [x] Restaurant and menu management
- [x] Order placement and tracking
- [x] Delivery partner assignment
- [x] Payment calculation
- [x] Geospatial search
- [ ] Real-time WebSocket tracking
- [ ] Payment gateway integration
- [ ] Surge pricing
- [ ] ML-based ETA prediction
- [ ] Fraud detection

---

## Related Problems
- 🚗 **Ride Hailing (Uber)** - Similar partner assignment
- 📦 **Package Delivery** - Route optimization
- 🏪 **E-Commerce** - Cart and checkout
- 🗺️ **Maps/Navigation** - Geospatial algorithms

## References
- Haversine Formula: Great-circle distance calculation
- Geospatial Indexing: R-tree, Quadtree
- Uber Engineering Blog: Real-time dispatch
- DoorDash Engineering: Order assignment optimization

---

*This implementation demonstrates production-ready food delivery system with geospatial search, real-time tracking, and intelligent partner assignment. Perfect for marketplace interviews at Uber, DoorDash, Zomato, and logistics companies.*

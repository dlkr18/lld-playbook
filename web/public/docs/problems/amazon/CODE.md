# Amazon - Complete Implementation

## 📂 Directory Structure

**Total: 28 Java files**

```
Amazon/
  📂 api/
    📄 AmazonService.java
    📄 CartService.java
    📄 OrderService.java
    📄 PaymentService.java
    📄 ProductService.java
  📂 exceptions/
    📄 CustomerNotFoundException.java
    📄 EmptyCartException.java
    📄 InsufficientStockException.java
    📄 InvalidOperationException.java
    📄 OrderNotFoundException.java
    📄 ProductNotFoundException.java
  📂 impl/
    📄 OrderServiceImpl.java
    📄 ProductServiceImpl.java
  📂 model/
    📄 Address.java
    📄 Cart.java
    📄 CartItem.java
    📄 Category.java
    📄 Customer.java
    📄 Order.java
    📄 OrderItem.java
    📄 OrderStatus.java
    📄 Payment.java
    📄 PaymentMethod.java
    📄 PaymentStatus.java
    📄 Product.java
    📄 ProductCategory.java
    📄 ProductStatus.java
    📄 Review.java
```

---

## 🔗 Quick Navigation

- [api](#api)
- [exceptions](#exceptions)
- [impl](#impl)
- [model](#model)

---

## 📁 api {#api}

**Files in this directory: 5**

### AmazonService.java

<details>
<summary>📄 Click to view AmazonService.java</summary>

```java
package com.you.lld.problems.amazon.api;
import com.you.lld.problems.amazon.model.*;
import java.util.List;

public interface AmazonService {
    // Product Management
    Product addProduct(Product product);
    Product getProduct(String productId);
    void updateProduct(Product product);
    void deleteProduct(String productId);
    List<Product> searchProducts(String query);
    List<Product> getProductsByCategory(ProductCategory category);
    
    // Cart Management
    Cart getCart(String userId);
    void addToCart(String userId, String productId, int quantity);
    void removeFromCart(String userId, String productId);
    void updateCartItemQuantity(String userId, String productId, int quantity);
    void clearCart(String userId);
    
    // Order Management
    Order placeOrder(String userId, String cartId, Address shippingAddress, PaymentMethod paymentMethod);
    Order getOrder(String orderId);
    List<Order> getOrderHistory(String userId);
    void cancelOrder(String orderId);
    void updateOrderStatus(String orderId, OrderStatus status);
    
    // Customer Management
    Customer registerCustomer(String name, String email);
    Customer getCustomer(String customerId);
    void updateCustomer(Customer customer);
    
    // Wishlist Management
    void addToWishlist(String customerId, String productId);
    void removeFromWishlist(String customerId, String productId);
    List<Product> getWishlist(String customerId);
    
    // Review Management
    Review addReview(String productId, String customerId, int rating, String comment);
    List<Review> getProductReviews(String productId);
}

```
</details>

---

### CartService.java

<details>
<summary>📄 Click to view CartService.java</summary>

```java
package com.you.lld.problems.amazon.api;

import com.you.lld.problems.amazon.model.*;
import java.math.BigDecimal;

public interface CartService {
    Cart getCart(String userId);
    void addToCart(String userId, String productId, int quantity);
    void removeFromCart(String userId, String productId);
    void updateQuantity(String userId, String productId, int quantity);
    void clearCart(String userId);
    BigDecimal getCartTotal(String userId);
}


```
</details>

---

### OrderService.java

<details>
<summary>📄 Click to view OrderService.java</summary>

```java
package com.you.lld.problems.amazon.api;

import com.you.lld.problems.amazon.model.*;

import java.util.List;

/**
 * Service interface for order management operations.
 */
public interface OrderService {
    
    /**
     * Creates a new order.
     * 
     * @param userId User ID
     * @param items Order items
     * @param shippingAddress Shipping address
     * @return Order ID
     */
    String createOrder(String userId, List<OrderItem> items, Address shippingAddress);
    
    /**
     * Gets an order by ID.
     * 
     * @param orderId Order ID
     * @return Order if found, null otherwise
     */
    Order getOrder(String orderId);
    
    /**
     * Gets all orders for a user.
     * 
     * @param userId User ID
     * @return List of orders
     */
    List<Order> getUserOrders(String userId);
    
    /**
     * Cancels an order.
     * 
     * @param orderId Order ID
     * @return true if cancelled successfully
     */
    boolean cancelOrder(String orderId);
    
    /**
     * Updates order status.
     * 
     * @param orderId Order ID
     * @param status New status
     * @return true if updated successfully
     */
    boolean updateOrderStatus(String orderId, OrderStatus status);
}

```
</details>

---

### PaymentService.java

<details>
<summary>📄 Click to view PaymentService.java</summary>

```java
package com.you.lld.problems.amazon.api;

import com.you.lld.problems.amazon.model.*;
import java.math.BigDecimal;

public interface PaymentService {
    Payment initiatePayment(String orderId, String userId, BigDecimal amount, PaymentMethod method);
    void processPayment(String paymentId, String transactionId);
    void confirmPayment(String paymentId);
    void failPayment(String paymentId);
    void refundPayment(String paymentId);
    Payment getPayment(String paymentId);
    PaymentStatus getPaymentStatus(String paymentId);
}


```
</details>

---

### ProductService.java

<details>
<summary>📄 Click to view ProductService.java</summary>

```java
package com.you.lld.problems.amazon.api;

import com.you.lld.problems.amazon.model.*;
import java.util.List;

public interface ProductService {
    String addProduct(Product product);
    Product getProduct(String productId);
    List<Product> searchProducts(String keyword);
    List<Product> getProductsByCategory(String categoryId);
    List<Product> getProductsBySeller(String sellerId);
    void updateProduct(String productId, Product updatedProduct);
    void updateStock(String productId, int quantity);
    void deleteProduct(String productId);
    
    // Review operations
    String addReview(String productId, Review review);
    List<Review> getProductReviews(String productId);
}


```
</details>

---

## 📁 exceptions {#exceptions}

**Files in this directory: 6**

### CustomerNotFoundException.java

<details>
<summary>📄 Click to view CustomerNotFoundException.java</summary>

```java
package com.you.lld.problems.amazon.exceptions;
public class CustomerNotFoundException extends RuntimeException {
    public CustomerNotFoundException(String message) { super(message); }
}

```
</details>

---

### EmptyCartException.java

<details>
<summary>📄 Click to view EmptyCartException.java</summary>

```java
package com.you.lld.problems.amazon.exceptions;
public class EmptyCartException extends RuntimeException {
    public EmptyCartException(String message) { super(message); }
}

```
</details>

---

### InsufficientStockException.java

<details>
<summary>📄 Click to view InsufficientStockException.java</summary>

```java
package com.you.lld.problems.amazon.exceptions;
public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String message) { super(message); }
}

```
</details>

---

### InvalidOperationException.java

<details>
<summary>📄 Click to view InvalidOperationException.java</summary>

```java
package com.you.lld.problems.amazon.exceptions;
public class InvalidOperationException extends RuntimeException {
    public InvalidOperationException(String message) { super(message); }
}

```
</details>

---

### OrderNotFoundException.java

<details>
<summary>📄 Click to view OrderNotFoundException.java</summary>

```java
package com.you.lld.problems.amazon.exceptions;
public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(String message) { super(message); }
}

```
</details>

---

### ProductNotFoundException.java

<details>
<summary>📄 Click to view ProductNotFoundException.java</summary>

```java
package com.you.lld.problems.amazon.exceptions;
public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(String message) { super(message); }
}

```
</details>

---

## 📁 impl {#impl}

**Files in this directory: 2**

### OrderServiceImpl.java

<details>
<summary>📄 Click to view OrderServiceImpl.java</summary>

```java
package com.you.lld.problems.amazon.impl;

import com.you.lld.problems.amazon.api.OrderService;
import com.you.lld.problems.amazon.model.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class OrderServiceImpl implements OrderService {
    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    
    @Override
    public String createOrder(String userId, List<OrderItem> items, Address shippingAddress) {
        String orderId = UUID.randomUUID().toString();
        
        java.math.BigDecimal total = items.stream()
            .map(OrderItem::getSubtotal)
            .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        
        Order order = new Order(orderId, userId, items, total, shippingAddress);
        orders.put(orderId, order);
        
        System.out.println("Order created: " + orderId);
        return orderId;
    }
    
    @Override
    public Order getOrder(String orderId) {
        return orders.get(orderId);
    }
    
    @Override
    public List<Order> getUserOrders(String userId) {
        return orders.values().stream()
            .filter(o -> o.getUserId().equals(userId))
            .sorted(Comparator.comparing(Order::getOrderDate).reversed())
            .collect(Collectors.toList());
    }
    
    public void confirmOrder(String orderId, String paymentId) {
        Order order = orders.get(orderId);
        if (order != null) {
            order.confirm(paymentId);
            System.out.println("Order confirmed: " + orderId);
        }
    }
    
    public void shipOrder(String orderId, String trackingNumber) {
        Order order = orders.get(orderId);
        if (order != null) {
            order.ship(trackingNumber);
            System.out.println("Order shipped: " + orderId + ", tracking: " + trackingNumber);
        }
    }
    
    public void deliverOrder(String orderId) {
        Order order = orders.get(orderId);
        if (order != null) {
            order.deliver();
            System.out.println("Order delivered: " + orderId);
        }
    }
    
    @Override
    public boolean cancelOrder(String orderId) {
        Order order = orders.get(orderId);
        if (order != null) {
            order.cancel();
            System.out.println("Order cancelled: " + orderId);
            return true;
        }
        return false;
    }
    
    @Override
    public boolean updateOrderStatus(String orderId, OrderStatus status) {
        Order order = orders.get(orderId);
        if (order != null) {
            order.setStatus(status);
            return true;
        }
        return false;
    }
}


```
</details>

---

### ProductServiceImpl.java

<details>
<summary>📄 Click to view ProductServiceImpl.java</summary>

```java
package com.you.lld.problems.amazon.impl;

import com.you.lld.problems.amazon.api.ProductService;
import com.you.lld.problems.amazon.model.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class ProductServiceImpl implements ProductService {
    private final Map<String, Product> products = new ConcurrentHashMap<>();
    private final Map<String, List<Review>> productReviews = new ConcurrentHashMap<>();
    
    @Override
    public String addProduct(Product product) {
        products.put(product.getId(), product);
        productReviews.put(product.getId(), new ArrayList<>());
        System.out.println("Product added: " + product.getId());
        return product.getId();
    }
    
    @Override
    public Product getProduct(String productId) {
        return products.get(productId);
    }
    
    @Override
    public List<Product> searchProducts(String keyword) {
        String lowerKeyword = keyword.toLowerCase();
        return products.values().stream()
            .filter(p -> p.getName().toLowerCase().contains(lowerKeyword) ||
                        (p.getDescription() != null && p.getDescription().toLowerCase().contains(lowerKeyword)))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Product> getProductsByCategory(String categoryId) {
        return products.values().stream()
            .filter(p -> p.getCategoryId().equals(categoryId))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Product> getProductsBySeller(String sellerId) {
        return products.values().stream()
            .filter(p -> p.getSellerId().equals(sellerId))
            .collect(Collectors.toList());
    }
    
    @Override
    public void updateProduct(String productId, Product updatedProduct) {
        if (products.containsKey(productId)) {
            products.put(productId, updatedProduct);
            System.out.println("Product updated: " + productId);
        }
    }
    
    @Override
    public void updateStock(String productId, int quantity) {
        Product product = products.get(productId);
        if (product != null) {
            if (quantity >= 0) {
                product.addStock(quantity);
            } else {
                product.reduceStock(Math.abs(quantity));
            }
        }
    }
    
    @Override
    public void deleteProduct(String productId) {
        Product product = products.remove(productId);
        if (product != null) {
            product.setStatus(ProductStatus.DISCONTINUED);
            System.out.println("Product deleted: " + productId);
        }
    }
    
    @Override
    public String addReview(String productId, Review review) {
        Product product = products.get(productId);
        if (product == null) {
            throw new IllegalArgumentException("Product not found");
        }
        
        List<Review> reviews = productReviews.computeIfAbsent(productId, k -> new ArrayList<>());
        reviews.add(review);
        product.updateRating(review.getRating());
        
        System.out.println("Review added for product: " + productId);
        return review.getId();
    }
    
    @Override
    public List<Review> getProductReviews(String productId) {
        return new ArrayList<>(productReviews.getOrDefault(productId, Collections.emptyList()));
    }
}


```
</details>

---

## 📁 model {#model}

**Files in this directory: 15**

### Address.java

<details>
<summary>📄 Click to view Address.java</summary>

```java
package com.you.lld.problems.amazon.model;

public class Address {
    private final String id;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private boolean isDefault;
    
    public Address(String id, String street, String city, String state, 
                   String zipCode, String country) {
        this.id = id;
        this.street = street;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.country = country;
        this.isDefault = false;
    }
    
    public String getFullAddress() {
        return street + ", " + city + ", " + state + " " + zipCode + ", " + country;
    }
    
    public String getId() { return id; }
    public String getStreet() { return street; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getZipCode() { return zipCode; }
    public String getCountry() { return country; }
    public boolean isDefault() { return isDefault; }
    
    public void setDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }
    
    @Override
    public String toString() {
        return "Address{" + getFullAddress() + (isDefault ? " [DEFAULT]" : "") + "}";
    }
}

```
</details>

---

### Cart.java

<details>
<summary>📄 Click to view Cart.java</summary>

```java
package com.you.lld.problems.amazon.model;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class Cart {
    private final String userId;
    private final Map<String, CartItem> items;
    private BigDecimal totalAmount;
    
    public Cart(String userId) {
        this.userId = userId;
        this.items = new ConcurrentHashMap<>();
        this.totalAmount = BigDecimal.ZERO;
    }
    
    public synchronized void addItem(Product product, int quantity) {
        if (!product.isInStock()) {
            throw new IllegalStateException("Product is out of stock");
        }
        
        if (!product.canFulfillQuantity(quantity)) {
            throw new IllegalStateException("Requested quantity not available");
        }
        
        String productId = product.getId();
        CartItem existing = items.get(productId);
        
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
        } else {
            items.put(productId, new CartItem(productId, product.getName(), 
                                             product.getPrice(), quantity));
        }
        
        recalculateTotal();
    }
    
    public synchronized void removeItem(String productId) {
        items.remove(productId);
        recalculateTotal();
    }
    
    public synchronized void updateQuantity(String productId, int quantity) {
        CartItem item = items.get(productId);
        if (item != null) {
            if (quantity <= 0) {
                items.remove(productId);
            } else {
                item.setQuantity(quantity);
            }
            recalculateTotal();
        }
    }
    
    public synchronized void clear() {
        items.clear();
        totalAmount = BigDecimal.ZERO;
    }
    
    private void recalculateTotal() {
        totalAmount = items.values().stream()
            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public boolean isEmpty() {
        return items.isEmpty();
    }
    
    public String getUserId() { return userId; }
    public Map<String, CartItem> getItems() { return new HashMap<>(items); }
    public BigDecimal getTotalAmount() { return totalAmount; }
    
    @Override
    public String toString() {
        return "Cart{userId='" + userId + "', items=" + items.size() + 
               ", total=" + totalAmount + "}";
    }
}

```
</details>

---

### CartItem.java

<details>
<summary>📄 Click to view CartItem.java</summary>

```java
package com.you.lld.problems.amazon.model;

import java.math.BigDecimal;

public class CartItem {
    private final String productId;
    private final String productName;
    private final BigDecimal price;
    private int quantity;
    
    public CartItem(String productId, String productName, BigDecimal price, int quantity) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
    }
    
    public BigDecimal getSubtotal() {
        return price.multiply(BigDecimal.valueOf(quantity));
    }
    
    public String getProductId() { return productId; }
    public String getProductName() { return productName; }
    public BigDecimal getPrice() { return price; }
    public int getQuantity() { return quantity; }
    
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    
    @Override
    public String toString() {
        return "CartItem{productId='" + productId + "', name='" + productName + 
               "', price=" + price + ", qty=" + quantity + ", subtotal=" + getSubtotal() + "}";
    }
}

```
</details>

---

### Category.java

<details>
<summary>📄 Click to view Category.java</summary>

```java
package com.you.lld.problems.amazon.model;

import java.util.*;

public class Category {
    private final String id;
    private String name;
    private String description;
    private String parentCategoryId;
    private List<String> subcategoryIds;
    
    public Category(String id, String name) {
        this.id = id;
        this.name = name;
        this.subcategoryIds = new ArrayList<>();
    }
    
    public void addSubcategory(String subcategoryId) {
        if (!subcategoryIds.contains(subcategoryId)) {
            subcategoryIds.add(subcategoryId);
        }
    }
    
    public void removeSubcategory(String subcategoryId) {
        subcategoryIds.remove(subcategoryId);
    }
    
    public boolean isRootCategory() {
        return parentCategoryId == null;
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getParentCategoryId() { return parentCategoryId; }
    public List<String> getSubcategoryIds() { return new ArrayList<>(subcategoryIds); }
    
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setParentCategoryId(String parentCategoryId) { this.parentCategoryId = parentCategoryId; }
    
    @Override
    public String toString() {
        return "Category{id='" + id + "', name='" + name + "', subcategories=" + subcategoryIds.size() + "}";
    }
}


```
</details>

---

### Customer.java

<details>
<summary>📄 Click to view Customer.java</summary>

```java
package com.you.lld.problems.amazon.model;
import java.util.*;

public class Customer {
    private final String customerId;
    private String name;
    private String email;
    private String phone;
    private List<Address> addresses;
    private boolean isPrime;
    private List<String> wishlistProductIds;
    
    public Customer(String customerId, String name, String email) {
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.addresses = new ArrayList<>();
        this.isPrime = false;
        this.wishlistProductIds = new ArrayList<>();
    }
    
    public String getCustomerId() { return customerId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public List<Address> getAddresses() { return new ArrayList<>(addresses); }
    public void addAddress(Address address) { addresses.add(address); }
    public boolean isPrime() { return isPrime; }
    public void setPrime(boolean prime) { isPrime = prime; }
    public List<String> getWishlistProductIds() { return new ArrayList<>(wishlistProductIds); }
    public void addToWishlist(String productId) { wishlistProductIds.add(productId); }
    public void removeFromWishlist(String productId) { wishlistProductIds.remove(productId); }
}

```
</details>

---

### Order.java

<details>
<summary>📄 Click to view Order.java</summary>

```java
package com.you.lld.problems.amazon.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

public class Order {
    private final String id;
    private final String userId;
    private final List<OrderItem> items;
    private final BigDecimal totalAmount;
    private final Address shippingAddress;
    private OrderStatus status;
    private String paymentId;
    private LocalDateTime orderDate;
    private LocalDateTime estimatedDelivery;
    private LocalDateTime actualDelivery;
    private String trackingNumber;
    
    public Order(String id, String userId, List<OrderItem> items, 
                 BigDecimal totalAmount, Address shippingAddress) {
        this.id = id;
        this.userId = userId;
        this.items = new ArrayList<>(items);
        this.totalAmount = totalAmount;
        this.shippingAddress = shippingAddress;
        this.status = OrderStatus.PENDING;
        this.orderDate = LocalDateTime.now();
        this.estimatedDelivery = orderDate.plusDays(5);
    }
    
    public void confirm(String paymentId) {
        this.paymentId = paymentId;
        this.status = OrderStatus.CONFIRMED;
    }
    
    public void ship(String trackingNumber) {
        if (status != OrderStatus.CONFIRMED) {
            throw new IllegalStateException("Order must be confirmed before shipping");
        }
        this.trackingNumber = trackingNumber;
        this.status = OrderStatus.SHIPPED;
    }
    
    public void deliver() {
        if (status != OrderStatus.SHIPPED) {
            throw new IllegalStateException("Order must be shipped before delivery");
        }
        this.actualDelivery = LocalDateTime.now();
        this.status = OrderStatus.DELIVERED;
    }
    
    public void cancel() {
        if (status == OrderStatus.DELIVERED) {
            throw new IllegalStateException("Cannot cancel delivered order");
        }
        this.status = OrderStatus.CANCELLED;
    }
    
    // Getters
    public String getId() { return id; }
    public String getUserId() { return userId; }
    public List<OrderItem> getItems() { return new ArrayList<>(items); }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public Address getShippingAddress() { return shippingAddress; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public String getPaymentId() { return paymentId; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public LocalDateTime getEstimatedDelivery() { return estimatedDelivery; }
    public LocalDateTime getActualDelivery() { return actualDelivery; }
    public String getTrackingNumber() { return trackingNumber; }
    
    @Override
    public String toString() {
        return "Order{id='" + id + "', userId='" + userId + "', status=" + status + 
               ", total=" + totalAmount + ", items=" + items.size() + "}";
    }
}

```
</details>

---

### OrderItem.java

<details>
<summary>📄 Click to view OrderItem.java</summary>

```java
package com.you.lld.problems.amazon.model;

import java.math.BigDecimal;

public class OrderItem {
    private final String productId;
    private final String productName;
    private final BigDecimal unitPrice;
    private final int quantity;
    private final BigDecimal subtotal;
    
    public OrderItem(String productId, String productName, BigDecimal unitPrice, int quantity) {
        this.productId = productId;
        this.productName = productName;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.subtotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
    }
    
    public String getProductId() { return productId; }
    public String getProductName() { return productName; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public int getQuantity() { return quantity; }
    public BigDecimal getSubtotal() { return subtotal; }
    
    @Override
    public String toString() {
        return "OrderItem{productId='" + productId + "', name='" + productName + 
               "', qty=" + quantity + ", subtotal=" + subtotal + "}";
    }
}

```
</details>

---

### OrderStatus.java

<details>
<summary>📄 Click to view OrderStatus.java</summary>

```java
package com.you.lld.problems.amazon.model;

public enum OrderStatus {
    PENDING,
    CONFIRMED,
    PROCESSING,
    SHIPPED,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED,
    REFUNDED
}

```
</details>

---

### Payment.java

<details>
<summary>📄 Click to view Payment.java</summary>

```java
package com.you.lld.problems.amazon.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Payment {
    private final String id;
    private final String orderId;
    private final String userId;
    private final BigDecimal amount;
    private final PaymentMethod method;
    private PaymentStatus status;
    private LocalDateTime paymentDate;
    private String transactionId;
    
    public Payment(String id, String orderId, String userId, BigDecimal amount, PaymentMethod method) {
        this.id = id;
        this.orderId = orderId;
        this.userId = userId;
        this.amount = amount;
        this.method = method;
        this.status = PaymentStatus.PENDING;
    }
    
    public void process(String transactionId) {
        this.transactionId = transactionId;
        this.status = PaymentStatus.PROCESSING;
        this.paymentDate = LocalDateTime.now();
    }
    
    public void confirm() {
        if (status != PaymentStatus.PROCESSING) {
            throw new IllegalStateException("Payment must be processing before confirmation");
        }
        this.status = PaymentStatus.COMPLETED;
    }
    
    public void fail() {
        this.status = PaymentStatus.FAILED;
    }
    
    public void refund() {
        if (status != PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Can only refund completed payments");
        }
        this.status = PaymentStatus.REFUNDED;
    }
    
    public String getId() { return id; }
    public String getOrderId() { return orderId; }
    public String getUserId() { return userId; }
    public BigDecimal getAmount() { return amount; }
    public PaymentMethod getMethod() { return method; }
    public PaymentStatus getStatus() { return status; }
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public String getTransactionId() { return transactionId; }
    
    @Override
    public String toString() {
        return "Payment{id='" + id + "', orderId='" + orderId + "', amount=" + amount + 
               ", method=" + method + ", status=" + status + "}";
    }
}


```
</details>

---

### PaymentMethod.java

<details>
<summary>📄 Click to view PaymentMethod.java</summary>

```java
package com.you.lld.problems.amazon.model;

public enum PaymentMethod {
    CREDIT_CARD,
    DEBIT_CARD,
    NET_BANKING,
    UPI,
    WALLET,
    CASH_ON_DELIVERY
}

```
</details>

---

### PaymentStatus.java

<details>
<summary>📄 Click to view PaymentStatus.java</summary>

```java
package com.you.lld.problems.amazon.model;

public enum PaymentStatus {
    PENDING,
    PROCESSING,
    COMPLETED,
    FAILED,
    REFUNDED
}


```
</details>

---

### Product.java

<details>
<summary>📄 Click to view Product.java</summary>

```java
package com.you.lld.problems.amazon.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

public class Product {
    private final String id;
    private String name;
    private String description;
    private BigDecimal price;
    private String categoryId;
    private String sellerId;
    private int stockQuantity;
    private double rating;
    private int reviewCount;
    private List<String> images;
    private Map<String, String> specifications;
    private ProductStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Product(String id, String name, BigDecimal price, String categoryId, String sellerId) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.categoryId = categoryId;
        this.sellerId = sellerId;
        this.stockQuantity = 0;
        this.rating = 0.0;
        this.reviewCount = 0;
        this.images = new ArrayList<>();
        this.specifications = new HashMap<>();
        this.status = ProductStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public boolean isInStock() {
        return stockQuantity > 0 && status == ProductStatus.ACTIVE;
    }
    
    public boolean canFulfillQuantity(int quantity) {
        return stockQuantity >= quantity;
    }
    
    public void reduceStock(int quantity) {
        if (quantity > stockQuantity) {
            throw new IllegalStateException("Insufficient stock");
        }
        this.stockQuantity -= quantity;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void addStock(int quantity) {
        this.stockQuantity += quantity;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void updateRating(double newRating) {
        this.rating = ((this.rating * this.reviewCount) + newRating) / (this.reviewCount + 1);
        this.reviewCount++;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public String getCategoryId() { return categoryId; }
    public String getSellerId() { return sellerId; }
    public int getStockQuantity() { return stockQuantity; }
    public double getRating() { return rating; }
    public int getReviewCount() { return reviewCount; }
    public List<String> getImages() { return new ArrayList<>(images); }
    public Map<String, String> getSpecifications() { return new HashMap<>(specifications); }
    public ProductStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    // Setters
    public void setName(String name) {
        this.name = name;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void setDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void setStatus(ProductStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void addImage(String imageUrl) {
        this.images.add(imageUrl);
    }
    
    public void addSpecification(String key, String value) {
        this.specifications.put(key, value);
    }
    
    @Override
    public String toString() {
        return "Product{id='" + id + "', name='" + name + "', price=" + price + 
               ", stock=" + stockQuantity + ", rating=" + rating + "}";
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return id.equals(product.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

```
</details>

---

### ProductCategory.java

<details>
<summary>📄 Click to view ProductCategory.java</summary>

```java
package com.you.lld.problems.amazon.model;

public enum ProductCategory {
    ELECTRONICS,
    BOOKS,
    CLOTHING,
    HOME_AND_KITCHEN,
    SPORTS,
    TOYS,
    BEAUTY,
    AUTOMOTIVE,
    GENERAL
}

```
</details>

---

### ProductStatus.java

<details>
<summary>📄 Click to view ProductStatus.java</summary>

```java
package com.you.lld.problems.amazon.model;

public enum ProductStatus {
    ACTIVE,
    OUT_OF_STOCK,
    DISCONTINUED,
    PENDING_APPROVAL
}

```
</details>

---

### Review.java

<details>
<summary>📄 Click to view Review.java</summary>

```java
package com.you.lld.problems.amazon.model;

import java.time.LocalDateTime;

public class Review {
    private final String id;
    private final String productId;
    private final String userId;
    private final String userName;
    private final int rating;
    private final String title;
    private final String content;
    private final LocalDateTime createdAt;
    private int helpfulCount;
    private boolean verified;
    
    public Review(String id, String productId, String userId, String userName,
                  int rating, String title, String content) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.userName = userName;
        this.rating = rating;
        this.title = title;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.helpfulCount = 0;
        this.verified = false;
    }
    
    public void markVerified() {
        this.verified = true;
    }
    
    public void incrementHelpful() {
        this.helpfulCount++;
    }
    
    public String getId() { return id; }
    public String getProductId() { return productId; }
    public String getUserId() { return userId; }
    public String getUserName() { return userName; }
    public int getRating() { return rating; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public int getHelpfulCount() { return helpfulCount; }
    public boolean isVerified() { return verified; }
    
    @Override
    public String toString() {
        return "Review{id='" + id + "', rating=" + rating + ", verified=" + verified + 
               ", helpful=" + helpfulCount + "}";
    }
}

```
</details>

---


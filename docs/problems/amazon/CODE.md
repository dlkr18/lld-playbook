# amazon - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/amazon/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py amazon`.

## Project Structure (32 files)

```
amazon/
├── AmazonDemo.java
├── Amazon.java
├── model/Address.java
├── model/Cart.java
├── model/CartItem.java
├── model/Category.java
├── model/Customer.java
├── model/Order.java
├── model/OrderItem.java
├── model/OrderStatus.java
├── model/Payment.java
├── model/PaymentMethod.java
├── model/PaymentStatus.java
├── model/Product.java
├── model/ProductCategory.java
├── model/ProductStatus.java
├── model/Review.java
├── service/AmazonService.java
├── service/CartService.java
├── service/OrderService.java
├── service/PaymentService.java
├── service/ProductService.java
├── service/impl/CartServiceImpl.java
├── service/impl/OrderServiceImpl.java
├── service/impl/PaymentServiceImpl.java
├── service/impl/ProductServiceImpl.java
├── exceptions/CustomerNotFoundException.java
├── exceptions/EmptyCartException.java
├── exceptions/InsufficientStockException.java
├── exceptions/InvalidOperationException.java
├── exceptions/OrderNotFoundException.java
├── exceptions/ProductNotFoundException.java
```

## Source Code

### `AmazonDemo.java`

<details>
<summary>Click to view AmazonDemo.java</summary>

```java
package com.you.lld.problems.amazon;

import com.you.lld.problems.amazon.model.Address;
import com.you.lld.problems.amazon.model.Order;
import com.you.lld.problems.amazon.model.Product;
import com.you.lld.problems.amazon.model.Review;

import java.math.BigDecimal;

/**
 * SDE3 demo: catalog, cart+checkout, order lifecycle, reviews, cancellation.
 */
public class AmazonDemo {

    public static void main(String[] args) {
        System.out.println("=== Amazon E-Commerce (SDE3) ===\n");
        Amazon amazon = new Amazon();
        Address addr = new Address("A1", "123 Main St", "SF", "CA", "94102", "USA");

        // 1. Product catalog
        System.out.println("--- 1. Catalog ---");
        Product laptop = new Product("P1", "MacBook Pro", new BigDecimal("2499.99"), "electronics", "s1");
        laptop.addStock(50);
        Product book = new Product("P3", "Design Patterns", new BigDecimal("49.99"), "books", "s2");
        book.addStock(200);
        amazon.addProduct(laptop);
        amazon.addProduct(book);
        System.out.println("Search MacBook: " + amazon.searchProducts("MacBook").size() + " hit(s)");

        // 2. Cart + checkout (Facade orchestrates cart → order)
        System.out.println("\n--- 2. Cart + checkout ---");
        amazon.addToCart("user-1", "P1", 1);
        amazon.addToCart("user-1", "P3", 2);
        String orderId = amazon.checkout("user-1", addr);
        Order order = amazon.getOrder(orderId);
        System.out.println("Order " + orderId + " total: $" + order.getTotalAmount());

        // 3. Order lifecycle (State-like transitions)
        System.out.println("\n--- 3. Order lifecycle ---");
        amazon.confirmOrder(orderId, "PAY-001");
        amazon.shipOrder(orderId, "TRACK-123");
        amazon.deliverOrder(orderId);
        System.out.println("Final status: " + amazon.getOrder(orderId).getStatus());

        // 4. Reviews
        System.out.println("\n--- 4. Reviews ---");
        amazon.addReview("P1", new Review("R1", "P1", "user-1", "Alice", 5, "Great", "Fast laptop"));
        System.out.println("Review added for MacBook Pro");

        // 5. Cancel pending order
        System.out.println("\n--- 5. Cancellation ---");
        amazon.addToCart("user-2", "P3", 1);
        String order2 = amazon.checkout("user-2", addr);
        boolean cancelled = amazon.cancelOrder(order2);
        System.out.println("Cancelled: " + cancelled + ", status=" + amazon.getOrder(order2).getStatus());

        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `Amazon.java`

<details>
<summary>Click to view Amazon.java</summary>

```java
package com.you.lld.problems.amazon;

import com.you.lld.problems.amazon.exceptions.EmptyCartException;
import com.you.lld.problems.amazon.exceptions.InsufficientStockException;
import com.you.lld.problems.amazon.exceptions.OrderNotFoundException;
import com.you.lld.problems.amazon.exceptions.ProductNotFoundException;
import com.you.lld.problems.amazon.model.Address;
import com.you.lld.problems.amazon.model.CartItem;
import com.you.lld.problems.amazon.model.Order;
import com.you.lld.problems.amazon.model.OrderItem;
import com.you.lld.problems.amazon.model.Product;
import com.you.lld.problems.amazon.model.Review;
import com.you.lld.problems.amazon.service.CartService;
import com.you.lld.problems.amazon.service.OrderService;
import com.you.lld.problems.amazon.service.ProductService;
import com.you.lld.problems.amazon.service.impl.CartServiceImpl;
import com.you.lld.problems.amazon.service.impl.OrderServiceImpl;
import com.you.lld.problems.amazon.service.impl.ProductServiceImpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/** Facade for e-commerce — catalog, cart, checkout, order lifecycle. */
public class Amazon {
    private final ProductService products;
    private final CartService cart;
    private final OrderService orders;

    public Amazon() {
        ProductServiceImpl productService = new ProductServiceImpl();
        this.products = productService;
        this.cart = new CartServiceImpl(productService);
        this.orders = new OrderServiceImpl();
    }

    public void addProduct(Product product) {
        products.addProduct(product);
    }

    public List<Product> searchProducts(String query) {
        return products.searchProducts(query);
    }

    public void addToCart(String customerId, String productId, int quantity) {
        cart.addToCart(customerId, productId, quantity);
    }

    /**
     * Places an order for everything in the customer's cart.
     *
     * <p>Stock is reserved <b>before</b> the order exists, all-or-nothing: if any
     * line cannot be satisfied, every reservation already taken is released and no
     * order is created. Without this the checkout was a pure read — 100 concurrent
     * buyers could each place an order against a single unit of stock.
     */
    public String checkout(String customerId, Address address) {
        Collection<CartItem> cartItems = cart.getCart(customerId).getItems().values();
        if (cartItems.isEmpty()) {
            throw new EmptyCartException("Cannot check out an empty cart: " + customerId);
        }

        List<OrderItem> items = new ArrayList<OrderItem>();
        List<CartItem> reserved = new ArrayList<CartItem>();
        try {
            for (CartItem item : cartItems) {
                Product product = products.getProduct(item.getProductId());
                if (product == null) {
                    throw new ProductNotFoundException("Product no longer available: " + item.getProductId());
                }
                if (!product.tryReserve(item.getQuantity())) {
                    throw new InsufficientStockException(
                            "Insufficient stock for " + product.getName() + ": requested "
                                    + item.getQuantity() + ", available " + product.getStockQuantity());
                }
                reserved.add(item);
                items.add(new OrderItem(item.getProductId(), item.getProductName(),
                        item.getPrice(), item.getQuantity()));
            }
        } catch (RuntimeException e) {
            releaseAll(reserved);
            throw e;
        }

        String orderId = orders.createOrder(customerId, items, address);
        cart.clearCart(customerId);
        return orderId;
    }

    private void releaseAll(List<CartItem> reserved) {
        for (CartItem item : reserved) {
            Product product = products.getProduct(item.getProductId());
            if (product != null) {
                product.releaseStock(item.getQuantity());
            }
        }
    }

    public void addReview(String productId, Review review) {
        products.addReview(productId, review);
    }

    public Order getOrder(String orderId) {
        return orders.getOrder(orderId);
    }

    public void confirmOrder(String orderId, String paymentId) {
        orders.confirmOrder(orderId, paymentId);
    }

    public void shipOrder(String orderId, String trackingNumber) {
        orders.shipOrder(orderId, trackingNumber);
    }

    public void deliverOrder(String orderId) {
        orders.deliverOrder(orderId);
    }

    /** Cancels the order and returns its reserved stock to the catalog. */
    public boolean cancelOrder(String orderId) {
        Order order = orders.getOrder(orderId);
        if (order == null) {
            throw new OrderNotFoundException("Order not found: " + orderId);
        }
        boolean cancelled = orders.cancelOrder(orderId);
        if (cancelled) {
            for (OrderItem item : order.getItems()) {
                Product product = products.getProduct(item.getProductId());
                if (product != null) {
                    product.releaseStock(item.getQuantity());
                }
            }
        }
        return cancelled;
    }
}
```

</details>

### `model/Address.java`

<details>
<summary>Click to view model/Address.java</summary>

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

### `model/Cart.java`

<details>
<summary>Click to view model/Cart.java</summary>

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

### `model/CartItem.java`

<details>
<summary>Click to view model/CartItem.java</summary>

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

### `model/Category.java`

<details>
<summary>Click to view model/Category.java</summary>

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

### `model/Customer.java`

<details>
<summary>Click to view model/Customer.java</summary>

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

### `model/Order.java`

<details>
<summary>Click to view model/Order.java</summary>

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
        if (status != OrderStatus.PENDING) {
            throw new IllegalStateException("Only a PENDING order can be confirmed, was: " + status);
        }
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

### `model/OrderItem.java`

<details>
<summary>Click to view model/OrderItem.java</summary>

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

### `model/OrderStatus.java`

<details>
<summary>Click to view model/OrderStatus.java</summary>

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

### `model/Payment.java`

<details>
<summary>Click to view model/Payment.java</summary>

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

### `model/PaymentMethod.java`

<details>
<summary>Click to view model/PaymentMethod.java</summary>

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

### `model/PaymentStatus.java`

<details>
<summary>Click to view model/PaymentStatus.java</summary>

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

### `model/Product.java`

<details>
<summary>Click to view model/Product.java</summary>

```java
package com.you.lld.problems.amazon.model;

import java.math.BigDecimal;
import com.you.lld.problems.amazon.exceptions.InsufficientStockException;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.*;

public class Product {
    private final String id;
    private String name;
    private String description;
    private BigDecimal price;
    private String categoryId;
    private String sellerId;
    private final AtomicInteger stockQuantity = new AtomicInteger(0);
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
        this.rating = 0.0;
        this.reviewCount = 0;
        this.images = new ArrayList<>();
        this.specifications = new HashMap<>();
        this.status = ProductStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public boolean isInStock() {
        return stockQuantity.get() > 0 && status == ProductStatus.ACTIVE;
    }
    
    public boolean canFulfillQuantity(int quantity) {
        return stockQuantity.get() >= quantity;
    }
    
    /**
     * Atomically reserves {@code quantity} units, or returns false if there are not
     * enough. A check-then-act (`if (q > stock) throw; stock -= q;`) lets every
     * concurrent buyer pass the check and oversell the last unit — so the compare
     * and the decrement have to be one CAS.
     */
    public boolean tryReserve(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Reserve quantity must be positive");
        }
        while (true) {
            int current = stockQuantity.get();
            if (current < quantity) {
                return false;
            }
            if (stockQuantity.compareAndSet(current, current - quantity)) {
                this.updatedAt = LocalDateTime.now();
                return true;
            }
        }
    }

    /** Returns reserved units to stock (checkout rollback, order cancellation). */
    public void releaseStock(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Release quantity must be positive");
        }
        stockQuantity.addAndGet(quantity);
        this.updatedAt = LocalDateTime.now();
    }

    public void reduceStock(int quantity) {
        if (!tryReserve(quantity)) {
            throw new InsufficientStockException(
                    "Insufficient stock for " + name + ": requested " + quantity
                            + ", available " + stockQuantity.get());
        }
    }
    
    public void addStock(int quantity) {
        stockQuantity.addAndGet(quantity);
        this.updatedAt = LocalDateTime.now();
    }
    
    /** Synchronized: the running average is a read-modify-write over two fields. */
    public synchronized void updateRating(double newRating) {
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
    public int getStockQuantity() { return stockQuantity.get(); }
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

### `model/ProductCategory.java`

<details>
<summary>Click to view model/ProductCategory.java</summary>

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

### `model/ProductStatus.java`

<details>
<summary>Click to view model/ProductStatus.java</summary>

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

### `model/Review.java`

<details>
<summary>Click to view model/Review.java</summary>

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

### `service/AmazonService.java`

<details>
<summary>Click to view service/AmazonService.java</summary>

```java
package com.you.lld.problems.amazon.service;
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

### `service/CartService.java`

<details>
<summary>Click to view service/CartService.java</summary>

```java
package com.you.lld.problems.amazon.service;

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

### `service/OrderService.java`

<details>
<summary>Click to view service/OrderService.java</summary>

```java
package com.you.lld.problems.amazon.service;

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

    void confirmOrder(String orderId, String paymentId);

    void shipOrder(String orderId, String trackingNumber);

    void deliverOrder(String orderId);
    
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

### `service/PaymentService.java`

<details>
<summary>Click to view service/PaymentService.java</summary>

```java
package com.you.lld.problems.amazon.service;

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

### `service/ProductService.java`

<details>
<summary>Click to view service/ProductService.java</summary>

```java
package com.you.lld.problems.amazon.service;

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

### `service/impl/CartServiceImpl.java`

<details>
<summary>Click to view service/impl/CartServiceImpl.java</summary>

```java
package com.you.lld.problems.amazon.service.impl;

import com.you.lld.problems.amazon.service.CartService;
import com.you.lld.problems.amazon.model.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe in-memory cart service.
 * Each user has their own Cart; concurrent operations on different carts are safe.
 */
public class CartServiceImpl implements CartService {

    private final Map<String, Cart> carts = new ConcurrentHashMap<>();
    private final ProductServiceImpl productService;

    public CartServiceImpl(ProductServiceImpl productService) {
        this.productService = productService;
    }

    @Override
    public Cart getCart(String userId) {
        return carts.computeIfAbsent(userId, Cart::new);
    }

    @Override
    public void addToCart(String userId, String productId, int quantity) {
        if (quantity <= 0) throw new IllegalArgumentException("Quantity must be positive");
        Product product = productService.getProduct(productId);
        if (product == null) throw new IllegalArgumentException("Product not found: " + productId);
        Cart cart = getCart(userId);
        cart.addItem(product, quantity);
    }

    @Override
    public void removeFromCart(String userId, String productId) {
        Cart cart = carts.get(userId);
        if (cart != null) {
            cart.removeItem(productId);
        }
    }

    @Override
    public void updateQuantity(String userId, String productId, int quantity) {
        Cart cart = carts.get(userId);
        if (cart != null) {
            cart.updateQuantity(productId, quantity);
        }
    }

    @Override
    public void clearCart(String userId) {
        Cart cart = carts.get(userId);
        if (cart != null) {
            cart.clear();
        }
    }

    @Override
    public BigDecimal getCartTotal(String userId) {
        Cart cart = carts.get(userId);
        return cart != null ? cart.getTotalAmount() : BigDecimal.ZERO;
    }
}
```

</details>

### `service/impl/OrderServiceImpl.java`

<details>
<summary>Click to view service/impl/OrderServiceImpl.java</summary>

```java
package com.you.lld.problems.amazon.service.impl;

import com.you.lld.problems.amazon.service.OrderService;
import com.you.lld.problems.amazon.exceptions.OrderNotFoundException;
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
    
    @Override
    public void confirmOrder(String orderId, String paymentId) {
        requireOrder(orderId).confirm(paymentId);
    }
    
    @Override
    public void shipOrder(String orderId, String trackingNumber) {
        requireOrder(orderId).ship(trackingNumber);
    }
    
    @Override
    public void deliverOrder(String orderId) {
        requireOrder(orderId).deliver();
    }
    
    @Override
    public boolean cancelOrder(String orderId) {
        requireOrder(orderId).cancel();
        return true;
    }
    
    @Override
    public boolean updateOrderStatus(String orderId, OrderStatus status) {
        requireOrder(orderId).setStatus(status);
        return true;
    }

    /** Silent no-ops hide bugs — an unknown order id is a caller error, not a shrug. */
    private Order requireOrder(String orderId) {
        Order order = orders.get(orderId);
        if (order == null) {
            throw new OrderNotFoundException("Order not found: " + orderId);
        }
        return order;
    }
}
```

</details>

### `service/impl/PaymentServiceImpl.java`

<details>
<summary>Click to view service/impl/PaymentServiceImpl.java</summary>

```java
package com.you.lld.problems.amazon.service.impl;

import com.you.lld.problems.amazon.service.PaymentService;
import com.you.lld.problems.amazon.model.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe in-memory payment service.
 */
public class PaymentServiceImpl implements PaymentService {

    private final Map<String, Payment> payments = new ConcurrentHashMap<>();

    @Override
    public Payment initiatePayment(String orderId, String userId, BigDecimal amount, PaymentMethod method) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        String paymentId = "PAY-" + UUID.randomUUID().toString().substring(0, 8);
        Payment payment = new Payment(paymentId, orderId, userId, amount, method);
        payments.put(paymentId, payment);
        return payment;
    }

    @Override
    public void processPayment(String paymentId, String transactionId) {
        Payment payment = getPaymentOrThrow(paymentId);
        payment.process(transactionId);
    }

    @Override
    public void confirmPayment(String paymentId) {
        Payment payment = getPaymentOrThrow(paymentId);
        payment.confirm();
    }

    @Override
    public void failPayment(String paymentId) {
        Payment payment = getPaymentOrThrow(paymentId);
        payment.fail();
    }

    @Override
    public void refundPayment(String paymentId) {
        Payment payment = getPaymentOrThrow(paymentId);
        payment.refund();
    }

    @Override
    public Payment getPayment(String paymentId) {
        return payments.get(paymentId);
    }

    @Override
    public PaymentStatus getPaymentStatus(String paymentId) {
        Payment payment = getPaymentOrThrow(paymentId);
        return payment.getStatus();
    }

    private Payment getPaymentOrThrow(String paymentId) {
        Payment payment = payments.get(paymentId);
        if (payment == null) {
            throw new IllegalArgumentException("Payment not found: " + paymentId);
        }
        return payment;
    }
}
```

</details>

### `service/impl/ProductServiceImpl.java`

<details>
<summary>Click to view service/impl/ProductServiceImpl.java</summary>

```java
package com.you.lld.problems.amazon.service.impl;

import com.you.lld.problems.amazon.service.ProductService;
import com.you.lld.problems.amazon.exceptions.ProductNotFoundException;
import com.you.lld.problems.amazon.model.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

public class ProductServiceImpl implements ProductService {
    private final Map<String, Product> products = new ConcurrentHashMap<>();
    private final Map<String, List<Review>> productReviews = new ConcurrentHashMap<>();
    
    @Override
    public String addProduct(Product product) {
        products.put(product.getId(), product);
        productReviews.put(product.getId(), new CopyOnWriteArrayList<>());
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
        // Soft delete: removing from the map first made the status change invisible,
        // and orphaned any Order still referencing the product.
        Product product = products.get(productId);
        if (product == null) {
            throw new ProductNotFoundException("Product not found: " + productId);
        }
        product.setStatus(ProductStatus.DISCONTINUED);
    }
    
    @Override
    public String addReview(String productId, Review review) {
        Product product = products.get(productId);
        if (product == null) {
            throw new ProductNotFoundException("Product not found: " + productId);
        }
        
        // CopyOnWriteArrayList: reviews are read-often, written-rarely, and a plain
        // ArrayList inside a ConcurrentHashMap loses concurrent adds.
        List<Review> reviews = productReviews.computeIfAbsent(productId, k -> new CopyOnWriteArrayList<>());
        reviews.add(review);
        product.updateRating(review.getRating());
        
        return review.getId();
    }
    
    @Override
    public List<Review> getProductReviews(String productId) {
        return new ArrayList<>(productReviews.getOrDefault(productId, Collections.emptyList()));
    }
}
```

</details>

### `exceptions/CustomerNotFoundException.java`

<details>
<summary>Click to view exceptions/CustomerNotFoundException.java</summary>

```java
package com.you.lld.problems.amazon.exceptions;
public class CustomerNotFoundException extends RuntimeException {
    public CustomerNotFoundException(String message) { super(message); }
}
```

</details>

### `exceptions/EmptyCartException.java`

<details>
<summary>Click to view exceptions/EmptyCartException.java</summary>

```java
package com.you.lld.problems.amazon.exceptions;
public class EmptyCartException extends RuntimeException {
    public EmptyCartException(String message) { super(message); }
}
```

</details>

### `exceptions/InsufficientStockException.java`

<details>
<summary>Click to view exceptions/InsufficientStockException.java</summary>

```java
package com.you.lld.problems.amazon.exceptions;
public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String message) { super(message); }
}
```

</details>

### `exceptions/InvalidOperationException.java`

<details>
<summary>Click to view exceptions/InvalidOperationException.java</summary>

```java
package com.you.lld.problems.amazon.exceptions;
public class InvalidOperationException extends RuntimeException {
    public InvalidOperationException(String message) { super(message); }
}
```

</details>

### `exceptions/OrderNotFoundException.java`

<details>
<summary>Click to view exceptions/OrderNotFoundException.java</summary>

```java
package com.you.lld.problems.amazon.exceptions;
public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(String message) { super(message); }
}
```

</details>

### `exceptions/ProductNotFoundException.java`

<details>
<summary>Click to view exceptions/ProductNotFoundException.java</summary>

```java
package com.you.lld.problems.amazon.exceptions;
public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(String message) { super(message); }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.amazon.AmazonDemo"
```

package com.you.lld.problems.amazon.impl;
import com.you.lld.problems.amazon.api.*;
import com.you.lld.problems.amazon.model.*;
import com.you.lld.problems.amazon.exceptions.*;
import java.util.*;
import java.util.stream.Collectors;

public class InMemoryAmazonService implements AmazonService {
    private final Map<String, Product> products;
    private final Map<String, Customer> customers;
    private final Map<String, Cart> carts;
    private final Map<String, Order> orders;
    
    public InMemoryAmazonService() {
        this.products = new HashMap<>();
        this.customers = new HashMap<>();
        this.carts = new HashMap<>();
        this.orders = new HashMap<>();
    }
    
    @Override
    public Product addProduct(Product product) {
        products.put(product.getProductId(), product);
        return product;
    }
    
    @Override
    public Product getProduct(String productId) {
        Product product = products.get(productId);
        if (product == null) {
            throw new ProductNotFoundException("Product not found: " + productId);
        }
        return product;
    }
    
    @Override
    public void updateProduct(Product product) {
        if (!products.containsKey(product.getProductId())) {
            throw new ProductNotFoundException("Product not found");
        }
        products.put(product.getProductId(), product);
    }
    
    @Override
    public void deleteProduct(String productId) {
        products.remove(productId);
    }
    
    @Override
    public List<Product> searchProducts(String query) {
        String lowerQuery = query.toLowerCase();
        return products.values().stream()
            .filter(p -> p.getName().toLowerCase().contains(lowerQuery) ||
                        (p.getDescription() != null && p.getDescription().toLowerCase().contains(lowerQuery)))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Product> getProductsByCategory(ProductCategory category) {
        return products.values().stream()
            .filter(p -> p.getCategory() == category)
            .collect(Collectors.toList());
    }
    
    @Override
    public Cart getCart(String userId) {
        return carts.computeIfAbsent(userId, k -> new Cart(UUID.randomUUID().toString(), userId));
    }
    
    @Override
    public void addToCart(String userId, String productId, int quantity) {
        Product product = getProduct(productId);
        if (!product.isInStock()) {
            throw new InsufficientStockException("Product out of stock");
        }
        if (product.getStockQuantity() < quantity) {
            throw new InsufficientStockException("Insufficient stock. Available: " + product.getStockQuantity());
        }
        
        Cart cart = getCart(userId);
        CartItem item = new CartItem(productId, product.getName(), product.getPrice(), quantity);
        cart.addItem(item);
    }
    
    @Override
    public void removeFromCart(String userId, String productId) {
        Cart cart = getCart(userId);
        cart.removeItem(productId);
    }
    
    @Override
    public void updateCartItemQuantity(String userId, String productId, int quantity) {
        Cart cart = getCart(userId);
        cart.updateQuantity(productId, quantity);
    }
    
    @Override
    public void clearCart(String userId) {
        Cart cart = getCart(userId);
        cart.clear();
    }
    
    @Override
    public Order placeOrder(String userId, String cartId, Address shippingAddress, PaymentMethod paymentMethod) {
        Cart cart = carts.get(cartId);
        if (cart == null || cart.getItems().isEmpty()) {
            throw new EmptyCartException("Cannot place order with empty cart");
        }
        
        // Create order
        String orderId = UUID.randomUUID().toString();
        Order order = new Order(orderId, userId, shippingAddress);
        order.setPaymentMethod(paymentMethod);
        
        // Add items and reduce stock
        for (CartItem cartItem : cart.getItems().values()) {
            Product product = getProduct(cartItem.getProductId());
            product.reduceStock(cartItem.getQuantity());
            
            OrderItem orderItem = new OrderItem(
                product.getProductId(),
                product.getName(),
                product.getPrice(),
                cartItem.getQuantity(),
                product.getSellerId()
            );
            order.addItem(orderItem);
        }
        
        order.setStatus(OrderStatus.CONFIRMED);
        orders.put(orderId, order);
        cart.clear();
        
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
    public List<Order> getOrderHistory(String userId) {
        return orders.values().stream()
            .filter(o -> o.getUserId().equals(userId))
            .sorted((a, b) -> b.getOrderedAt().compareTo(a.getOrderedAt()))
            .collect(Collectors.toList());
    }
    
    @Override
    public void cancelOrder(String orderId) {
        Order order = getOrder(orderId);
        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new InvalidOperationException("Cannot cancel delivered order");
        }
        
        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product product = getProduct(item.getProductId());
            product.addStock(item.getQuantity());
        }
        
        order.setStatus(OrderStatus.CANCELLED);
    }
    
    @Override
    public void updateOrderStatus(String orderId, OrderStatus status) {
        Order order = getOrder(orderId);
        order.setStatus(status);
    }
    
    @Override
    public Customer registerCustomer(String name, String email) {
        String customerId = UUID.randomUUID().toString();
        Customer customer = new Customer(customerId, name, email);
        customers.put(customerId, customer);
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
    public void updateCustomer(Customer customer) {
        if (!customers.containsKey(customer.getCustomerId())) {
            throw new CustomerNotFoundException("Customer not found");
        }
        customers.put(customer.getCustomerId(), customer);
    }
    
    @Override
    public void addToWishlist(String customerId, String productId) {
        Customer customer = getCustomer(customerId);
        getProduct(productId); // Validate product exists
        customer.addToWishlist(productId);
    }
    
    @Override
    public void removeFromWishlist(String customerId, String productId) {
        Customer customer = getCustomer(customerId);
        customer.removeFromWishlist(productId);
    }
    
    @Override
    public List<Product> getWishlist(String customerId) {
        Customer customer = getCustomer(customerId);
        return customer.getWishlistProductIds().stream()
            .map(products::get)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }
    
    @Override
    public Review addReview(String productId, String customerId, int rating, String comment) {
        Product product = getProduct(productId);
        getCustomer(customerId); // Validate customer exists
        
        String reviewId = UUID.randomUUID().toString();
        Review review = new Review(reviewId, productId, customerId, rating);
        review.setComment(comment);
        product.addReview(review);
        
        return review;
    }
    
    @Override
    public List<Review> getProductReviews(String productId) {
        Product product = getProduct(productId);
        return product.getReviews();
    }
}

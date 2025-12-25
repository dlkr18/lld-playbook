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

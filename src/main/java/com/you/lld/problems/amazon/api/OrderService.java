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

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

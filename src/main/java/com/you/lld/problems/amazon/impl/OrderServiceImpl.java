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


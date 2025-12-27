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

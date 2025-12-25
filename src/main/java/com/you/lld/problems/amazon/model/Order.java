package com.you.lld.problems.amazon.model;
import java.time.LocalDateTime;
import java.util.*;

public class Order {
    private final String orderId;
    private final String userId;
    private List<OrderItem> items;
    private Address shippingAddress;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private double subtotal;
    private double tax;
    private double shippingCost;
    private double totalAmount;
    private LocalDateTime orderedAt;
    private LocalDateTime deliveredAt;
    private String trackingNumber;
    
    public Order(String orderId, String userId, Address shippingAddress) {
        this.orderId = orderId;
        this.userId = userId;
        this.items = new ArrayList<>();
        this.shippingAddress = shippingAddress;
        this.status = OrderStatus.PENDING;
        this.orderedAt = LocalDateTime.now();
    }
    
    // Getters
    public String getOrderId() { return orderId; }
    public String getUserId() { return userId; }
    public List<OrderItem> getItems() { return new ArrayList<>(items); }
    public Address getShippingAddress() { return shippingAddress; }
    public OrderStatus getStatus() { return status; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public double getSubtotal() { return subtotal; }
    public double getTax() { return tax; }
    public double getShippingCost() { return shippingCost; }
    public double getTotalAmount() { return totalAmount; }
    public LocalDateTime getOrderedAt() { return orderedAt; }
    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public String getTrackingNumber() { return trackingNumber; }
    
    // Setters and methods
    public void addItem(OrderItem item) {
        items.add(item);
        calculateAmounts();
    }
    
    public void setPaymentMethod(PaymentMethod method) {
        this.paymentMethod = method;
    }
    
    public void setStatus(OrderStatus status) {
        this.status = status;
        if (status == OrderStatus.DELIVERED) {
            this.deliveredAt = LocalDateTime.now();
        }
    }
    
    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }
    
    private void calculateAmounts() {
        this.subtotal = items.stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
        this.tax = subtotal * 0.10; // 10% tax
        this.shippingCost = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
        this.totalAmount = subtotal + tax + shippingCost;
    }
}

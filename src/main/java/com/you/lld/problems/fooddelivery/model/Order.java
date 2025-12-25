package com.you.lld.problems.fooddelivery.model;
import java.time.LocalDateTime;
import java.util.*;

public class Order {
    private final String orderId;
    private final String customerId;
    private final String restaurantId;
    private List<OrderItem> items;
    private OrderStatus status;
    private String deliveryPartnerId;
    private Address deliveryAddress;
    private double subtotal;
    private double deliveryFee;
    private double tax;
    private double totalAmount;
    private LocalDateTime orderedAt;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime actualDeliveryTime;
    private String specialInstructions;
    
    public Order(String orderId, String customerId, String restaurantId, Address deliveryAddress) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.restaurantId = restaurantId;
        this.deliveryAddress = deliveryAddress;
        this.items = new ArrayList<>();
        this.status = OrderStatus.PLACED;
        this.orderedAt = LocalDateTime.now();
    }
    
    public String getOrderId() { return orderId; }
    public String getCustomerId() { return customerId; }
    public String getRestaurantId() { return restaurantId; }
    public List<OrderItem> getItems() { return new ArrayList<>(items); }
    public void addItem(OrderItem item) { 
        items.add(item);
        calculateAmounts();
    }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public String getDeliveryPartnerId() { return deliveryPartnerId; }
    public void setDeliveryPartnerId(String partnerId) { this.deliveryPartnerId = partnerId; }
    public Address getDeliveryAddress() { return deliveryAddress; }
    public double getSubtotal() { return subtotal; }
    public double getDeliveryFee() { return deliveryFee; }
    public double getTax() { return tax; }
    public double getTotalAmount() { return totalAmount; }
    public LocalDateTime getOrderedAt() { return orderedAt; }
    public LocalDateTime getEstimatedDeliveryTime() { return estimatedDeliveryTime; }
    public void setEstimatedDeliveryTime(LocalDateTime time) { this.estimatedDeliveryTime = time; }
    public LocalDateTime getActualDeliveryTime() { return actualDeliveryTime; }
    public void setActualDeliveryTime(LocalDateTime time) { this.actualDeliveryTime = time; }
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String instructions) { this.specialInstructions = instructions; }
    
    private void calculateAmounts() {
        this.subtotal = items.stream().mapToDouble(OrderItem::getTotal).sum();
        this.deliveryFee = subtotal > 50 ? 0 : 5.0;
        this.tax = subtotal * 0.08;
        this.totalAmount = subtotal + deliveryFee + tax;
    }
}

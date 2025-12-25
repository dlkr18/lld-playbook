package com.you.lld.problems.fooddelivery;
import java.time.LocalDateTime;
import java.util.*;

public class DeliveryOrder {
    public enum OrderStatus { PLACED, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED }
    
    private final String orderId;
    private final String restaurantId;
    private final String userId;
    private final List<String> items;
    private OrderStatus status;
    private String deliveryAgentId;
    private LocalDateTime orderTime;
    
    public DeliveryOrder(String orderId, String restaurantId, String userId, List<String> items) {
        this.orderId = orderId;
        this.restaurantId = restaurantId;
        this.userId = userId;
        this.items = new ArrayList<>(items);
        this.status = OrderStatus.PLACED;
        this.orderTime = LocalDateTime.now();
    }
    
    public String getOrderId() { return orderId; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public void assignDeliveryAgent(String agentId) { this.deliveryAgentId = agentId; }
}

package com.you.lld.problems.stockexchange.model;

import java.time.LocalDateTime;

/**
 * Represents a stock order (buy or sell).
 */
public class Order {
    private String id;
    private String symbol;
    private String userId;
    private OrderType type;
    private double price;
    private int quantity;
    private int filledQuantity;
    private OrderStatus status;
    private LocalDateTime createdAt;
    
    public Order(String symbol, String userId, OrderType type, double price, int quantity) {
        this.symbol = symbol;
        this.userId = userId;
        this.type = type;
        this.price = price;
        this.quantity = quantity;
        this.filledQuantity = 0;
        this.status = OrderStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getSymbol() {
        return symbol;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public OrderType getType() {
        return type;
    }
    
    public double getPrice() {
        return price;
    }
    
    public int getQuantity() {
        return quantity;
    }
    
    public int getFilledQuantity() {
        return filledQuantity;
    }
    
    public void setFilledQuantity(int filledQuantity) {
        this.filledQuantity = filledQuantity;
    }
    
    public int getRemainingQuantity() {
        return quantity - filledQuantity;
    }
    
    public OrderStatus getStatus() {
        return status;
    }
    
    public void setStatus(OrderStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}

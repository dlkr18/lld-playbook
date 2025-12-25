package com.you.lld.problems.stockexchange;
import java.time.LocalDateTime;

public class Order {
    public enum OrderType { BUY, SELL }
    public enum OrderStatus { PENDING, FILLED, CANCELLED }
    
    private final String orderId;
    private final String stockSymbol;
    private final OrderType type;
    private final double price;
    private int quantity;
    private OrderStatus status;
    private LocalDateTime timestamp;
    
    public Order(String orderId, String stockSymbol, OrderType type, double price, int quantity) {
        this.orderId = orderId;
        this.stockSymbol = stockSymbol;
        this.type = type;
        this.price = price;
        this.quantity = quantity;
        this.status = OrderStatus.PENDING;
        this.timestamp = LocalDateTime.now();
    }
    
    public String getOrderId() { return orderId; }
    public OrderType getType() { return type; }
    public double getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}

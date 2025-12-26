package com.you.lld.problems.coffeemachine.model;

import java.time.LocalDateTime;

public class Order {
    private final String id;
    private final Beverage beverage;
    private final LocalDateTime orderTime;
    private OrderStatus status;
    
    public Order(String id, Beverage beverage) {
        this.id = id;
        this.beverage = beverage;
        this.orderTime = LocalDateTime.now();
        this.status = OrderStatus.PENDING;
    }
    
    public void complete() { this.status = OrderStatus.COMPLETED; }
    public void fail() { this.status = OrderStatus.FAILED; }
    
    public String getId() { return id; }
    public Beverage getBeverage() { return beverage; }
    public OrderStatus getStatus() { return status; }
    
    @Override
    public String toString() {
        return "Order{id='" + id + "', beverage=" + beverage.getName() + ", status=" + status + "}";
    }
}

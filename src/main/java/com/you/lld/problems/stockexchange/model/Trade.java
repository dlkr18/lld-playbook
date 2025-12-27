package com.you.lld.problems.stockexchange.model;

import java.time.LocalDateTime;

/**
 * Represents an executed trade.
 */
public class Trade {
    private final String id;
    private final String symbol;
    private final String buyOrderId;
    private final String sellOrderId;
    private final int quantity;
    private final double price;
    private final LocalDateTime executedAt;
    
    public Trade(String id, String symbol, String buyOrderId, String sellOrderId, 
                 int quantity, double price, LocalDateTime executedAt) {
        this.id = id;
        this.symbol = symbol;
        this.buyOrderId = buyOrderId;
        this.sellOrderId = sellOrderId;
        this.quantity = quantity;
        this.price = price;
        this.executedAt = executedAt;
    }
    
    public String getId() {
        return id;
    }
    
    public String getSymbol() {
        return symbol;
    }
    
    public String getBuyOrderId() {
        return buyOrderId;
    }
    
    public String getSellOrderId() {
        return sellOrderId;
    }
    
    public int getQuantity() {
        return quantity;
    }
    
    public double getPrice() {
        return price;
    }
    
    public LocalDateTime getExecutedAt() {
        return executedAt;
    }
    
    public double getTotalValue() {
        return quantity * price;
    }
}

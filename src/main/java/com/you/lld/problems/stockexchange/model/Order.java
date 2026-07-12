package com.you.lld.problems.stockexchange.model;

import java.time.LocalDateTime;
import java.util.Comparator;

public class Order {
    private String id;
    private final String symbol;
    private final String userId;
    private final OrderType type;
    private final double price;
    private final int quantity;
    private int filledQuantity;
    private OrderStatus status;
    private final LocalDateTime createdAt;

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

    /** Buy book: highest price first, then earliest time. */
    public static final class BuyComparator implements Comparator<Order> {
        @Override
        public int compare(Order a, Order b) {
            int priceCompare = Double.compare(b.getPrice(), a.getPrice());
            if (priceCompare != 0) {
                return priceCompare;
            }
            return a.getCreatedAt().compareTo(b.getCreatedAt());
        }
    }

    /** Sell book: lowest price first, then earliest time. */
    public static final class SellComparator implements Comparator<Order> {
        @Override
        public int compare(Order a, Order b) {
            int priceCompare = Double.compare(a.getPrice(), b.getPrice());
            if (priceCompare != 0) {
                return priceCompare;
            }
            return a.getCreatedAt().compareTo(b.getCreatedAt());
        }
    }
}

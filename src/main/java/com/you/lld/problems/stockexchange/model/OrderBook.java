package com.you.lld.problems.stockexchange.model;

import java.util.*;

/**
 * Thread-safe order book for a specific stock symbol.
 * All operations are synchronized to prevent concurrent modification
 * of the PriorityQueues.
 */
public class OrderBook {
    private final String symbol;
    private final PriorityQueue<Order> buyOrders;  // Max heap (highest price first)
    private final PriorityQueue<Order> sellOrders; // Min heap (lowest price first)
    
    public OrderBook(String symbol) {
        this.symbol = symbol;
        this.buyOrders = new PriorityQueue<>((a, b) -> {
            int pc = Double.compare(b.getPrice(), a.getPrice());
            return pc != 0 ? pc : a.getCreatedAt().compareTo(b.getCreatedAt()); // Price-time priority
        });
        this.sellOrders = new PriorityQueue<>((a, b) -> {
            int pc = Double.compare(a.getPrice(), b.getPrice());
            return pc != 0 ? pc : a.getCreatedAt().compareTo(b.getCreatedAt());
        });
    }
    
    public synchronized void addOrder(Order order) {
        if (order == null) throw new IllegalArgumentException("Order cannot be null");
        if (order.getType() == OrderType.BUY) {
            buyOrders.offer(order);
        } else {
            sellOrders.offer(order);
        }
    }
    
    public synchronized void removeOrder(Order order) {
        if (order.getType() == OrderType.BUY) {
            buyOrders.remove(order);
        } else {
            sellOrders.remove(order);
        }
    }
    
    public synchronized Order getBestBuyOrder() {
        return buyOrders.peek();
    }
    
    public synchronized Order getBestSellOrder() {
        return sellOrders.peek();
    }
    
    public synchronized double getBestBid() {
        Order best = getBestBuyOrder();
        return best != null ? best.getPrice() : 0.0;
    }
    
    public synchronized double getBestAsk() {
        Order best = getBestSellOrder();
        return best != null ? best.getPrice() : 0.0;
    }
    
    public synchronized List<Order> getAllOrders() {
        List<Order> all = new ArrayList<>();
        all.addAll(buyOrders);
        all.addAll(sellOrders);
        return all;
    }
    
    public String getSymbol() {
        return symbol;
    }
}

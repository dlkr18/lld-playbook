package com.you.lld.problems.stockexchange.model;

import java.util.*;
import java.util.concurrent.PriorityBlockingQueue;

/**
 * Order book for a specific stock symbol.
 * Maintains separate queues for buy and sell orders.
 */
public class OrderBook {
    private final String symbol;
    private final PriorityQueue<Order> buyOrders;  // Max heap (highest price first)
    private final PriorityQueue<Order> sellOrders; // Min heap (lowest price first)
    
    public OrderBook(String symbol) {
        this.symbol = symbol;
        // Buy orders: highest price first
        this.buyOrders = new PriorityQueue<>((a, b) -> Double.compare(b.getPrice(), a.getPrice()));
        // Sell orders: lowest price first
        this.sellOrders = new PriorityQueue<>(Comparator.comparingDouble(Order::getPrice));
    }
    
    public void addOrder(Order order) {
        if (order.getType() == OrderType.BUY) {
            buyOrders.offer(order);
        } else {
            sellOrders.offer(order);
        }
    }
    
    public void removeOrder(Order order) {
        if (order.getType() == OrderType.BUY) {
            buyOrders.remove(order);
        } else {
            sellOrders.remove(order);
        }
    }
    
    public Order getBestBuyOrder() {
        return buyOrders.peek();
    }
    
    public Order getBestSellOrder() {
        return sellOrders.peek();
    }
    
    public double getBestBid() {
        Order best = getBestBuyOrder();
        return best != null ? best.getPrice() : 0.0;
    }
    
    public double getBestAsk() {
        Order best = getBestSellOrder();
        return best != null ? best.getPrice() : 0.0;
    }
    
    public List<Order> getAllOrders() {
        List<Order> all = new ArrayList<>();
        all.addAll(buyOrders);
        all.addAll(sellOrders);
        return all;
    }
    
    public String getSymbol() {
        return symbol;
    }
}

package com.you.lld.problems.stockexchange.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;

/**
 * Thread-safe order book — buy max-heap, sell min-heap, price-time priority.
 */
public class OrderBook {
    private final String symbol;
    private final PriorityQueue<Order> buyOrders;
    private final PriorityQueue<Order> sellOrders;

    public OrderBook(String symbol) {
        this.symbol = symbol;
        this.buyOrders = new PriorityQueue<Order>(new Order.BuyComparator());
        this.sellOrders = new PriorityQueue<Order>(new Order.SellComparator());
    }

    public synchronized void addOrder(Order order) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }
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
        List<Order> all = new ArrayList<Order>();
        all.addAll(buyOrders);
        all.addAll(sellOrders);
        return all;
    }

    /**
     * Price-time priority matching loop. Caller supplies trade factory callback.
     */
    public synchronized int match(MatchCallback callback) {
        int matchCount = 0;
        while (true) {
            Order buy = buyOrders.peek();
            Order sell = sellOrders.peek();
            if (buy == null || sell == null || buy.getPrice() < sell.getPrice()) {
                break;
            }
            int quantity = Math.min(buy.getRemainingQuantity(), sell.getRemainingQuantity());
            double price = sell.getPrice();
            callback.onTrade(buy, sell, quantity, price);
            matchCount++;

            buy.setFilledQuantity(buy.getFilledQuantity() + quantity);
            sell.setFilledQuantity(sell.getFilledQuantity() + quantity);
            updateStatus(buy);
            updateStatus(sell);

            if (buy.getRemainingQuantity() == 0) {
                buyOrders.poll();
            }
            if (sell.getRemainingQuantity() == 0) {
                sellOrders.poll();
            }
        }
        return matchCount;
    }

    private void updateStatus(Order order) {
        if (order.getRemainingQuantity() == 0) {
            order.setStatus(OrderStatus.FILLED);
        } else {
            order.setStatus(OrderStatus.PARTIALLY_FILLED);
        }
    }

    public String getSymbol() {
        return symbol;
    }

    public interface MatchCallback {
        void onTrade(Order buy, Order sell, int quantity, double price);
    }
}

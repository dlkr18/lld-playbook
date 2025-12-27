package com.you.lld.problems.stockexchange.impl;

import com.you.lld.problems.stockexchange.api.StockExchangeService;
import com.you.lld.problems.stockexchange.model.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * Order matching engine implementing price-time priority.
 * Thread-safe for concurrent order placement.
 */
public class OrderMatchingEngine implements StockExchangeService {
    
    private final Map<String, Order> orders;
    private final Map<String, List<Trade>> trades;
    private final Map<String, OrderBook> orderBooks; // symbol -> order book
    private final AtomicLong orderIdGenerator;
    private final AtomicLong tradeIdGenerator;
    
    public OrderMatchingEngine() {
        this.orders = new ConcurrentHashMap<>();
        this.trades = new ConcurrentHashMap<>();
        this.orderBooks = new ConcurrentHashMap<>();
        this.orderIdGenerator = new AtomicLong(0);
        this.tradeIdGenerator = new AtomicLong(0);
    }
    
    @Override
    public String placeOrder(Order order) {
        String orderId = "ORD-" + orderIdGenerator.incrementAndGet();
        order.setId(orderId);
        order.setStatus(OrderStatus.OPEN);
        orders.put(orderId, order);
        
        OrderBook book = orderBooks.computeIfAbsent(
            order.getSymbol(), 
            k -> new OrderBook(order.getSymbol())
        );
        book.addOrder(order);
        
        // Attempt to match immediately
        matchOrders(order.getSymbol());
        
        return orderId;
    }
    
    @Override
    public boolean cancelOrder(String orderId) {
        Order order = orders.get(orderId);
        if (order == null || order.getStatus() != OrderStatus.OPEN) {
            return false;
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        OrderBook book = orderBooks.get(order.getSymbol());
        if (book != null) {
            book.removeOrder(order);
        }
        
        return true;
    }
    
    @Override
    public Order getOrder(String orderId) {
        return orders.get(orderId);
    }
    
    @Override
    public List<Order> getOpenOrders(String symbol) {
        OrderBook book = orderBooks.get(symbol);
        if (book == null) {
            return new ArrayList<>();
        }
        return book.getAllOrders().stream()
            .filter(o -> o.getStatus() == OrderStatus.OPEN)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Order> getUserOrders(String userId) {
        return orders.values().stream()
            .filter(o -> o.getUserId().equals(userId))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Trade> getTrades(String symbol) {
        return trades.getOrDefault(symbol, new ArrayList<>());
    }
    
    @Override
    public double getBestBid(String symbol) {
        OrderBook book = orderBooks.get(symbol);
        return book != null ? book.getBestBid() : 0.0;
    }
    
    @Override
    public double getBestAsk(String symbol) {
        OrderBook book = orderBooks.get(symbol);
        return book != null ? book.getBestAsk() : 0.0;
    }
    
    @Override
    public int matchOrders(String symbol) {
        OrderBook book = orderBooks.get(symbol);
        if (book == null) {
            return 0;
        }
        
        int matchCount = 0;
        
        while (true) {
            Order buyOrder = book.getBestBuyOrder();
            Order sellOrder = book.getBestSellOrder();
            
            if (buyOrder == null || sellOrder == null) {
                break;
            }
            
            // Check if orders can be matched
            if (buyOrder.getPrice() < sellOrder.getPrice()) {
                break;
            }
            
            // Execute trade
            int quantity = Math.min(buyOrder.getRemainingQuantity(), 
                                   sellOrder.getRemainingQuantity());
            double price = sellOrder.getPrice(); // Price-time priority: use sell order price
            
            executeTrade(buyOrder, sellOrder, quantity, price);
            matchCount++;
            
            // Remove filled orders
            if (buyOrder.getRemainingQuantity() == 0) {
                book.removeOrder(buyOrder);
                buyOrder.setStatus(OrderStatus.FILLED);
            }
            if (sellOrder.getRemainingQuantity() == 0) {
                book.removeOrder(sellOrder);
                sellOrder.setStatus(OrderStatus.FILLED);
            }
        }
        
        return matchCount;
    }
    
    private void executeTrade(Order buyOrder, Order sellOrder, int quantity, double price) {
        String tradeId = "TRD-" + tradeIdGenerator.incrementAndGet();
        Trade trade = new Trade(
            tradeId,
            buyOrder.getSymbol(),
            buyOrder.getId(),
            sellOrder.getId(),
            quantity,
            price,
            LocalDateTime.now()
        );
        
        trades.computeIfAbsent(buyOrder.getSymbol(), k -> new ArrayList<>()).add(trade);
        
        buyOrder.setFilledQuantity(buyOrder.getFilledQuantity() + quantity);
        sellOrder.setFilledQuantity(sellOrder.getFilledQuantity() + quantity);
    }
}



package com.you.lld.problems.stockexchange.service.impl;

import com.you.lld.problems.stockexchange.model.Order;
import com.you.lld.problems.stockexchange.model.OrderBook;
import com.you.lld.problems.stockexchange.model.OrderStatus;
import com.you.lld.problems.stockexchange.model.Trade;
import com.you.lld.problems.stockexchange.service.StockExchangeService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Order matching engine — synchronized per-symbol books, price-time priority.
 */
public class OrderMatchingEngine implements StockExchangeService {

    private final Map<String, Order> orders = new ConcurrentHashMap<String, Order>();
    private final Map<String, List<Trade>> trades = new ConcurrentHashMap<String, List<Trade>>();
    private final Map<String, OrderBook> orderBooks = new ConcurrentHashMap<String, OrderBook>();
    private final AtomicLong orderIdGenerator = new AtomicLong(0);
    private final AtomicLong tradeIdGenerator = new AtomicLong(0);

    @Override
    public String placeOrder(Order order) {
        validate(order);
        String orderId = "ORD-" + orderIdGenerator.incrementAndGet();
        order.setId(orderId);
        order.setStatus(OrderStatus.OPEN);
        orders.put(orderId, order);

        OrderBook book = orderBooks.get(order.getSymbol());
        if (book == null) {
            synchronized (this) {
                book = orderBooks.get(order.getSymbol());
                if (book == null) {
                    book = new OrderBook(order.getSymbol());
                    orderBooks.put(order.getSymbol(), book);
                }
            }
        }
        book.addOrder(order);
        matchOrders(order.getSymbol());
        return orderId;
    }

    @Override
    public boolean cancelOrder(String orderId) {
        Order order = orders.get(orderId);
        if (order == null || order.getStatus() == OrderStatus.CANCELLED
                || order.getStatus() == OrderStatus.FILLED) {
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
            return new ArrayList<Order>();
        }
        List<Order> open = new ArrayList<Order>();
        for (Order order : book.getAllOrders()) {
            if (order.getStatus() == OrderStatus.OPEN
                    || order.getStatus() == OrderStatus.PARTIALLY_FILLED) {
                open.add(order);
            }
        }
        return open;
    }

    @Override
    public List<Order> getUserOrders(String userId) {
        List<Order> result = new ArrayList<Order>();
        for (Order order : orders.values()) {
            if (order.getUserId().equals(userId)) {
                result.add(order);
            }
        }
        return result;
    }

    @Override
    public List<Trade> getTrades(String symbol) {
        List<Trade> symbolTrades = trades.get(symbol);
        return symbolTrades != null ? new ArrayList<Trade>(symbolTrades) : new ArrayList<Trade>();
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
        final OrderBook book = orderBooks.get(symbol);
        if (book == null) {
            return 0;
        }
        return book.match(new OrderBook.MatchCallback() {
            @Override
            public void onTrade(Order buy, Order sell, int quantity, double price) {
                recordTrade(buy, sell, quantity, price);
            }
        });
    }

    private void recordTrade(Order buy, Order sell, int quantity, double price) {
        String tradeId = "TRD-" + tradeIdGenerator.incrementAndGet();
        Trade trade = new Trade(
                tradeId,
                buy.getSymbol(),
                buy.getId(),
                sell.getId(),
                quantity,
                price,
                LocalDateTime.now());
        List<Trade> symbolTrades = trades.get(buy.getSymbol());
        if (symbolTrades == null) {
            symbolTrades = new ArrayList<Trade>();
            List<Trade> existing = trades.putIfAbsent(buy.getSymbol(), symbolTrades);
            if (existing != null) {
                symbolTrades = existing;
            }
        }
        synchronized (symbolTrades) {
            symbolTrades.add(trade);
        }
    }

    private void validate(Order order) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }
        if (order.getSymbol() == null || order.getSymbol().isEmpty()) {
            throw new IllegalArgumentException("Symbol is required");
        }
        if (order.getPrice() <= 0) {
            throw new IllegalArgumentException("Price must be positive");
        }
        if (order.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
    }
}

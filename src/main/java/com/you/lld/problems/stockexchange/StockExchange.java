package com.you.lld.problems.stockexchange;

import com.you.lld.problems.stockexchange.model.Order;
import com.you.lld.problems.stockexchange.model.OrderType;
import com.you.lld.problems.stockexchange.model.Trade;
import com.you.lld.problems.stockexchange.service.StockExchangeService;
import com.you.lld.problems.stockexchange.service.impl.OrderMatchingEngine;

import java.util.List;

/** Facade for order placement and matching. */
public final class StockExchange {
    private final StockExchangeService service;

    public StockExchange() {
        this(new OrderMatchingEngine());
    }

    public StockExchange(StockExchangeService service) {
        this.service = service;
    }

    public String buy(String symbol, String userId, double price, int quantity) {
        return service.placeOrder(new Order(symbol, userId, OrderType.BUY, price, quantity));
    }

    public String sell(String symbol, String userId, double price, int quantity) {
        return service.placeOrder(new Order(symbol, userId, OrderType.SELL, price, quantity));
    }

    public boolean cancel(String orderId) {
        return service.cancelOrder(orderId);
    }

    public Order order(String orderId) {
        return service.getOrder(orderId);
    }

    public List<Trade> trades(String symbol) {
        return service.getTrades(symbol);
    }

    public double bestBid(String symbol) {
        return service.getBestBid(symbol);
    }

    public double bestAsk(String symbol) {
        return service.getBestAsk(symbol);
    }

    public List<Order> openOrders(String symbol) {
        return service.getOpenOrders(symbol);
    }
}

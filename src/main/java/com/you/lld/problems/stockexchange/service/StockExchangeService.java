package com.you.lld.problems.stockexchange.service;

import com.you.lld.problems.stockexchange.model.Order;
import com.you.lld.problems.stockexchange.model.Trade;

import java.util.List;

public interface StockExchangeService {
    String placeOrder(Order order);
    boolean cancelOrder(String orderId);
    Order getOrder(String orderId);
    List<Order> getOpenOrders(String symbol);
    List<Order> getUserOrders(String userId);
    List<Trade> getTrades(String symbol);
    double getBestBid(String symbol);
    double getBestAsk(String symbol);
    int matchOrders(String symbol);
}

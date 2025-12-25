package com.you.lld.problems.stockexchange;
import java.util.*;

public class StockExchange {
    private final Map<String, OrderBook> orderBooks;
    
    public StockExchange() {
        this.orderBooks = new HashMap<>();
    }
    
    public void placeOrder(Order order) {
        orderBooks.computeIfAbsent(order.getOrderId(), k -> new OrderBook(order.getOrderId())).addOrder(order);
    }
}

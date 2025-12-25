package com.you.lld.problems.stockexchange;
import java.util.*;

public class OrderBook {
    private final String stockSymbol;
    private final PriorityQueue<Order> buyOrders;  // Max heap by price
    private final PriorityQueue<Order> sellOrders; // Min heap by price
    
    public OrderBook(String stockSymbol) {
        this.stockSymbol = stockSymbol;
        this.buyOrders = new PriorityQueue<>((a, b) -> Double.compare(b.getPrice(), a.getPrice()));
        this.sellOrders = new PriorityQueue<>((a, b) -> Double.compare(a.getPrice(), b.getPrice()));
    }
    
    public void addOrder(Order order) {
        if (order.getType() == Order.OrderType.BUY) {
            buyOrders.offer(order);
        } else {
            sellOrders.offer(order);
        }
        matchOrders();
    }
    
    private void matchOrders() {
        while (!buyOrders.isEmpty() && !sellOrders.isEmpty()) {
            Order buyOrder = buyOrders.peek();
            Order sellOrder = sellOrders.peek();
            
            if (buyOrder.getPrice() >= sellOrder.getPrice()) {
                int matchedQty = Math.min(buyOrder.getQuantity(), sellOrder.getQuantity());
                
                buyOrder.setQuantity(buyOrder.getQuantity() - matchedQty);
                sellOrder.setQuantity(sellOrder.getQuantity() - matchedQty);
                
                if (buyOrder.getQuantity() == 0) {
                    buyOrder.setStatus(Order.OrderStatus.FILLED);
                    buyOrders.poll();
                }
                if (sellOrder.getQuantity() == 0) {
                    sellOrder.setStatus(Order.OrderStatus.FILLED);
                    sellOrders.poll();
                }
            } else {
                break;
            }
        }
    }
}

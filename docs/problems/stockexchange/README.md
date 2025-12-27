# Stock Exchange / Trading Platform

## Overview
Real-time stock trading platform with order matching, price discovery, and market data dissemination supporting limit/market orders and order books.

**Difficulty:** Hard  
**Interview Frequency:** Very High (Trading firms, fintech)

## Key Algorithms

### Order Matching (Price-Time Priority)
```java
public void matchOrder(Order order) {
    if (order.getType() == OrderType.MARKET) {
        matchMarketOrder(order);
    } else {
        matchLimitOrder(order);
    }
}

private void matchLimitOrder(Order order) {
    OrderBook book = getOrderBook(order.getSymbol());
    
    if (order.getSide() == Side.BUY) {
        // Match with sell orders
        while (order.getRemainingQty() > 0 && 
               !book.getAsks().isEmpty() &&
               book.getAsks().peek().getPrice() <= order.getPrice()) {
            Order sellOrder = book.getAsks().poll();
            executeTrade(order, sellOrder);
        }
        
        // Add remaining to buy side
        if (order.getRemainingQty() > 0) {
            book.getBids().add(order);
        }
    } else {
        // Match with buy orders
        while (order.getRemainingQty() > 0 && 
               !book.getBids().isEmpty() &&
               book.getBids().peek().getPrice() >= order.getPrice()) {
            Order buyOrder = book.getBids().poll();
            executeTrade(buyOrder, order);
        }
        
        // Add remaining to sell side
        if (order.getRemainingQty() > 0) {
            book.getAsks().add(order);
        }
    }
}
```

**Time Complexity:** O(log N) per order  
**Space Complexity:** O(N) for order book

### Order Book (Priority Queues)
```java
class OrderBook {
    // Buy orders: highest price first
    PriorityQueue<Order> bids = new PriorityQueue<>(
        (a, b) -> Double.compare(b.getPrice(), a.getPrice())
    );
    
    // Sell orders: lowest price first
    PriorityQueue<Order> asks = new PriorityQueue<>(
        (a, b) -> Double.compare(a.getPrice(), b.getPrice())
    );
}
```

## Order Types
- **Market**: Execute immediately at best available price
- **Limit**: Execute only at specified price or better
- **Stop-Loss**: Trigger when price reaches threshold
- **IOC (Immediate or Cancel)**: Fill immediately or cancel

## Source Code
📄 **[View Complete Source Code](/problems/stockexchange/CODE)**

*High-frequency trading platform with order matching engine.*

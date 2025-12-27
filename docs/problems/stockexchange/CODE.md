# Source Code

This page contains the complete source code for this problem.

## 📁 Directory Structure

```
├── Order.java
├── OrderBook.java
├── StockExchange.java
├── api/StockExchangeService.java
├── exceptions/InsufficientSharesException.java
├── exceptions/InvalidPriceException.java
├── exceptions/OrderNotFoundException.java
├── impl/OrderMatchingEngine.java
├── model/Investor.java
├── model/MarketData.java
├── model/Order.java
├── model/OrderBook.java
├── model/OrderStatus.java
├── model/OrderType.java
├── model/Portfolio.java
├── model/Stock.java
├── model/Trade.java
```

## Order.java

```java
package com.you.lld.problems.stockexchange;
import java.time.LocalDateTime;

public class Order {
    public enum OrderType { BUY, SELL }
    public enum OrderStatus { PENDING, FILLED, CANCELLED }
    
    private final String orderId;
    private final String stockSymbol;
    private final OrderType type;
    private final double price;
    private int quantity;
    private OrderStatus status;
    private LocalDateTime timestamp;
    
    public Order(String orderId, String stockSymbol, OrderType type, double price, int quantity) {
        this.orderId = orderId;
        this.stockSymbol = stockSymbol;
        this.type = type;
        this.price = price;
        this.quantity = quantity;
        this.status = OrderStatus.PENDING;
        this.timestamp = LocalDateTime.now();
    }
    
    public String getOrderId() { return orderId; }
    public OrderType getType() { return type; }
    public double getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
```

## OrderBook.java

```java
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
```

## StockExchange.java

```java
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
```

## StockExchangeService.java

```java
package com.you.lld.problems.stockexchange.api;

import com.you.lld.problems.stockexchange.model.Order;
import com.you.lld.problems.stockexchange.model.Trade;
import com.you.lld.problems.stockexchange.model.OrderType;

import java.util.List;

/**
 * Service interface for stock exchange operations.
 * Supports order placement, matching, and trade execution.
 */
public interface StockExchangeService {
    
    /**
     * Places a new order.
     * 
     * @param order Order to place
     * @return Order ID
     */
    String placeOrder(Order order);
    
    /**
     * Cancels an existing order.
     * 
     * @param orderId Order ID to cancel
     * @return true if cancelled successfully
     */
    boolean cancelOrder(String orderId);
    
    /**
     * Gets an order by ID.
     * 
     * @param orderId Order ID
     * @return Order if found, null otherwise
     */
    Order getOrder(String orderId);
    
    /**
     * Gets all open orders for a stock.
     * 
     * @param symbol Stock symbol
     * @return List of open orders
     */
    List<Order> getOpenOrders(String symbol);
    
    /**
     * Gets all orders for a user.
     * 
     * @param userId User ID
     * @return List of user orders
     */
    List<Order> getUserOrders(String userId);
    
    /**
     * Gets all executed trades for a stock.
     * 
     * @param symbol Stock symbol
     * @return List of trades
     */
    List<Trade> getTrades(String symbol);
    
    /**
     * Gets current best bid price for a stock.
     * 
     * @param symbol Stock symbol
     * @return Best bid price, or 0 if no bids
     */
    double getBestBid(String symbol);
    
    /**
     * Gets current best ask price for a stock.
     * 
     * @param symbol Stock symbol
     * @return Best ask price, or 0 if no asks
     */
    double getBestAsk(String symbol);
    
    /**
     * Manually triggers order matching for a symbol.
     * 
     * @param symbol Stock symbol
     * @return Number of trades executed
     */
    int matchOrders(String symbol);
}

```

## InsufficientSharesException.java

```java
package com.you.lld.problems.stockexchange.exceptions;
public class InsufficientSharesException extends RuntimeException { public InsufficientSharesException(String m) { super(m); } }```

## InvalidPriceException.java

```java
package com.you.lld.problems.stockexchange.exceptions;
public class InvalidPriceException extends RuntimeException { public InvalidPriceException(String m) { super(m); } }```

## OrderNotFoundException.java

```java
package com.you.lld.problems.stockexchange.exceptions;
public class OrderNotFoundException extends RuntimeException { public OrderNotFoundException(String m) { super(m); } }```

## OrderMatchingEngine.java

```java
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

```

## Investor.java

```java
package com.you.lld.problems.stockexchange.model;
import java.util.*;
public
class Investor  {
    private String investorId;
    public Investor(String id)  {
        investorId=id;
    }
    public String getInvestorId()  {
        return investorId;
    }
}
```

## MarketData.java

```java
package com.you.lld.problems.stockexchange.model;
import java.util.*;
public
class MarketData  {
    private String marketdataId;
    public MarketData(String id)  {
        marketdataId=id;
    }
    public String getMarketDataId()  {
        return marketdataId;
    }
}
```

## Order.java

```java
package com.you.lld.problems.stockexchange.model;
import java.util.*;
public
class Order  {
    private String orderId;
    public Order(String id)  {
        orderId=id;
    }
    public String getOrderId()  {
        return orderId;
    }
}
```

## OrderBook.java

```java
package com.you.lld.problems.stockexchange.model;
import java.util.*;
public
class OrderBook  {
    private String orderbookId;
    public OrderBook(String id)  {
        orderbookId=id;
    }
    public String getOrderBookId()  {
        return orderbookId;
    }
}
```

## OrderStatus.java

```java
package com.you.lld.problems.stockexchange.model;
public enum OrderStatus { ACTIVE, INACTIVE, PENDING, COMPLETED }```

## OrderType.java

```java
package com.you.lld.problems.stockexchange.model;
public enum OrderType { ACTIVE, INACTIVE, PENDING, COMPLETED }```

## Portfolio.java

```java
package com.you.lld.problems.stockexchange.model;
import java.util.*;
public
class Portfolio  {
    private String portfolioId;
    public Portfolio(String id)  {
        portfolioId=id;
    }
    public String getPortfolioId()  {
        return portfolioId;
    }
}
```

## Stock.java

```java
package com.you.lld.problems.stockexchange.model;
import java.util.*;
public
class Stock  {
    private String stockId;
    public Stock(String id)  {
        stockId=id;
    }
    public String getStockId()  {
        return stockId;
    }
}
```

## Trade.java

```java
package com.you.lld.problems.stockexchange.model;
import java.util.*;
public
class Trade  {
    private String tradeId;
    public Trade(String id)  {
        tradeId=id;
    }
    public String getTradeId()  {
        return tradeId;
    }
}
```


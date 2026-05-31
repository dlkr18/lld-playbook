# stockexchange - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/stockexchange/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py stockexchange`.

## Project Structure (15 files)

```
stockexchange/
├── StockExchangeDemo.java
├── api/StockExchangeService.java
├── model/Investor.java
├── model/MarketData.java
├── model/Order.java
├── model/OrderBook.java
├── model/OrderStatus.java
├── model/OrderType.java
├── model/Portfolio.java
├── model/Stock.java
├── model/Trade.java
├── impl/OrderMatchingEngine.java
├── exceptions/InsufficientSharesException.java
├── exceptions/InvalidPriceException.java
├── exceptions/OrderNotFoundException.java
```

## Source Code

### `StockExchangeDemo.java`

<details>
<summary>Click to view StockExchangeDemo.java</summary>

```java
package com.you.lld.problems.stockexchange;

import com.you.lld.problems.stockexchange.impl.OrderMatchingEngine;
import com.you.lld.problems.stockexchange.model.*;

import java.util.List;

/**
 * Demo: Stock Exchange with order matching, price-time priority,
 * partial fills, cancellation.
 */
public class StockExchangeDemo {

    public static void main(String[] args) {
        System.out.println("=== Stock Exchange Demo ===\n");

        OrderMatchingEngine engine = new OrderMatchingEngine();

        // --- Scenario 1: Basic matching ---
        System.out.println("--- Scenario 1: Basic buy/sell matching ---");
        String sellId1 = engine.placeOrder(
            new Order("AAPL", "seller1", OrderType.SELL, 150.00, 100));
        System.out.println("Placed sell: 100 AAPL @ $150.00 -> " + sellId1);

        String buyId1 = engine.placeOrder(
            new Order("AAPL", "buyer1", OrderType.BUY, 151.00, 100));
        System.out.println("Placed buy:  100 AAPL @ $151.00 -> " + buyId1);

        // Should have matched at sell price ($150)
        List<Trade> aaplTrades = engine.getTrades("AAPL");
        System.out.println("Trades executed: " + aaplTrades.size());
        if (!aaplTrades.isEmpty()) {
            Trade t = aaplTrades.get(0);
            System.out.println("  Trade: " + t.getQuantity() + " shares @ $" + t.getPrice()
                + " = $" + t.getTotalValue());
        }
        System.out.println("Buy order status: " + engine.getOrder(buyId1).getStatus());
        System.out.println("Sell order status: " + engine.getOrder(sellId1).getStatus());

        // --- Scenario 2: Partial fill ---
        System.out.println("\n--- Scenario 2: Partial fill ---");
        engine.placeOrder(new Order("GOOG", "seller2", OrderType.SELL, 2800.00, 50));
        engine.placeOrder(new Order("GOOG", "buyer2", OrderType.BUY, 2800.00, 30));

        List<Trade> googTrades = engine.getTrades("GOOG");
        System.out.println("GOOG trades: " + googTrades.size());
        if (!googTrades.isEmpty()) {
            System.out.println("  Partial fill: " + googTrades.get(0).getQuantity() + " shares");
        }
        List<Order> openGoog = engine.getOpenOrders("GOOG");
        System.out.println("Open GOOG orders: " + openGoog.size());
        for (Order o : openGoog) {
            System.out.println("  " + o.getType() + " remaining: " + o.getRemainingQuantity());
        }

        // --- Scenario 3: Order book depth ---
        System.out.println("\n--- Scenario 3: Multiple orders at different prices ---");
        engine.placeOrder(new Order("TSLA", "s1", OrderType.SELL, 250.00, 100));
        engine.placeOrder(new Order("TSLA", "s2", OrderType.SELL, 248.00, 50));
        engine.placeOrder(new Order("TSLA", "s3", OrderType.SELL, 252.00, 75));

        System.out.println("Best ask (lowest sell): $" + engine.getBestAsk("TSLA"));

        // This buy at $249 should match with sell at $248
        engine.placeOrder(new Order("TSLA", "b1", OrderType.BUY, 249.00, 50));
        List<Trade> tslaTrades = engine.getTrades("TSLA");
        System.out.println("TSLA trades: " + tslaTrades.size());
        for (Trade t : tslaTrades) {
            System.out.println("  " + t.getQuantity() + " @ $" + t.getPrice());
        }

        // --- Scenario 4: Cancel order ---
        System.out.println("\n--- Scenario 4: Order cancellation ---");
        String cancelTarget = engine.placeOrder(
            new Order("MSFT", "user5", OrderType.BUY, 380.00, 200));
        System.out.println("Placed buy MSFT: " + cancelTarget);
        System.out.println("Status: " + engine.getOrder(cancelTarget).getStatus());
        boolean cancelled = engine.cancelOrder(cancelTarget);
        System.out.println("Cancelled: " + cancelled);
        System.out.println("Status: " + engine.getOrder(cancelTarget).getStatus());

        // --- Scenario 5: No match ---
        System.out.println("\n--- Scenario 5: No match (bid < ask) ---");
        engine.placeOrder(new Order("NFLX", "s4", OrderType.SELL, 600.00, 100));
        engine.placeOrder(new Order("NFLX", "b4", OrderType.BUY, 590.00, 100));
        System.out.println("NFLX trades: " + engine.getTrades("NFLX").size());
        System.out.println("Best bid: $" + engine.getBestBid("NFLX"));
        System.out.println("Best ask: $" + engine.getBestAsk("NFLX"));

        // --- Scenario 6: User order history ---
        System.out.println("\n--- Scenario 6: User order history ---");
        List<Order> user5Orders = engine.getUserOrders("user5");
        System.out.println("user5 orders: " + user5Orders.size());
        for (Order o : user5Orders) {
            System.out.println("  " + o.getId() + " " + o.getSymbol() + " " 
                + o.getType() + " " + o.getStatus());
        }

        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `api/StockExchangeService.java`

<details>
<summary>Click to view api/StockExchangeService.java</summary>

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

</details>

### `model/Investor.java`

<details>
<summary>Click to view model/Investor.java</summary>

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

</details>

### `model/MarketData.java`

<details>
<summary>Click to view model/MarketData.java</summary>

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

</details>

### `model/Order.java`

<details>
<summary>Click to view model/Order.java</summary>

```java
package com.you.lld.problems.stockexchange.model;

import java.time.LocalDateTime;

/**
 * Represents a stock order (buy or sell).
 */
public class Order {
    private String id;
    private String symbol;
    private String userId;
    private OrderType type;
    private double price;
    private int quantity;
    private int filledQuantity;
    private OrderStatus status;
    private LocalDateTime createdAt;
    
    public Order(String symbol, String userId, OrderType type, double price, int quantity) {
        this.symbol = symbol;
        this.userId = userId;
        this.type = type;
        this.price = price;
        this.quantity = quantity;
        this.filledQuantity = 0;
        this.status = OrderStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getSymbol() {
        return symbol;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public OrderType getType() {
        return type;
    }
    
    public double getPrice() {
        return price;
    }
    
    public int getQuantity() {
        return quantity;
    }
    
    public int getFilledQuantity() {
        return filledQuantity;
    }
    
    public void setFilledQuantity(int filledQuantity) {
        this.filledQuantity = filledQuantity;
    }
    
    public int getRemainingQuantity() {
        return quantity - filledQuantity;
    }
    
    public OrderStatus getStatus() {
        return status;
    }
    
    public void setStatus(OrderStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
```

</details>

### `model/OrderBook.java`

<details>
<summary>Click to view model/OrderBook.java</summary>

```java
package com.you.lld.problems.stockexchange.model;

import java.util.*;

/**
 * Thread-safe order book for a specific stock symbol.
 * All operations are synchronized to prevent concurrent modification
 * of the PriorityQueues.
 */
public class OrderBook {
    private final String symbol;
    private final PriorityQueue<Order> buyOrders;  // Max heap (highest price first)
    private final PriorityQueue<Order> sellOrders; // Min heap (lowest price first)
    
    public OrderBook(String symbol) {
        this.symbol = symbol;
        this.buyOrders = new PriorityQueue<>((a, b) -> {
            int pc = Double.compare(b.getPrice(), a.getPrice());
            return pc != 0 ? pc : a.getCreatedAt().compareTo(b.getCreatedAt()); // Price-time priority
        });
        this.sellOrders = new PriorityQueue<>((a, b) -> {
            int pc = Double.compare(a.getPrice(), b.getPrice());
            return pc != 0 ? pc : a.getCreatedAt().compareTo(b.getCreatedAt());
        });
    }
    
    public synchronized void addOrder(Order order) {
        if (order == null) throw new IllegalArgumentException("Order cannot be null");
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
        List<Order> all = new ArrayList<>();
        all.addAll(buyOrders);
        all.addAll(sellOrders);
        return all;
    }
    
    public String getSymbol() {
        return symbol;
    }
}
```

</details>

### `model/OrderStatus.java`

<details>
<summary>Click to view model/OrderStatus.java</summary>

```java
package com.you.lld.problems.stockexchange.model;

/**
 * Status of an order.
 */
public enum OrderStatus {
    PENDING,    // Order created but not yet submitted
    OPEN,       // Order submitted and waiting to be filled
    PARTIALLY_FILLED, // Order partially executed
    FILLED,     // Order fully executed
    CANCELLED   // Order cancelled
}
```

</details>

### `model/OrderType.java`

<details>
<summary>Click to view model/OrderType.java</summary>

```java
package com.you.lld.problems.stockexchange.model;

/**
 * Type of stock order.
 */
public enum OrderType {
    BUY,
    SELL
}
```

</details>

### `model/Portfolio.java`

<details>
<summary>Click to view model/Portfolio.java</summary>

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

</details>

### `model/Stock.java`

<details>
<summary>Click to view model/Stock.java</summary>

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

</details>

### `model/Trade.java`

<details>
<summary>Click to view model/Trade.java</summary>

```java
package com.you.lld.problems.stockexchange.model;

import java.time.LocalDateTime;

/**
 * Represents an executed trade.
 */
public class Trade {
    private final String id;
    private final String symbol;
    private final String buyOrderId;
    private final String sellOrderId;
    private final int quantity;
    private final double price;
    private final LocalDateTime executedAt;
    
    public Trade(String id, String symbol, String buyOrderId, String sellOrderId, 
                 int quantity, double price, LocalDateTime executedAt) {
        this.id = id;
        this.symbol = symbol;
        this.buyOrderId = buyOrderId;
        this.sellOrderId = sellOrderId;
        this.quantity = quantity;
        this.price = price;
        this.executedAt = executedAt;
    }
    
    public String getId() {
        return id;
    }
    
    public String getSymbol() {
        return symbol;
    }
    
    public String getBuyOrderId() {
        return buyOrderId;
    }
    
    public String getSellOrderId() {
        return sellOrderId;
    }
    
    public int getQuantity() {
        return quantity;
    }
    
    public double getPrice() {
        return price;
    }
    
    public LocalDateTime getExecutedAt() {
        return executedAt;
    }
    
    public double getTotalValue() {
        return quantity * price;
    }
}
```

</details>

### `impl/OrderMatchingEngine.java`

<details>
<summary>Click to view impl/OrderMatchingEngine.java</summary>

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
        if (order == null) throw new IllegalArgumentException("Order cannot be null");
        if (order.getSymbol() == null || order.getSymbol().isEmpty()) {
            throw new IllegalArgumentException("Symbol is required");
        }
        if (order.getPrice() <= 0) throw new IllegalArgumentException("Price must be positive");
        if (order.getQuantity() <= 0) throw new IllegalArgumentException("Quantity must be positive");

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

</details>

### `exceptions/InsufficientSharesException.java`

<details>
<summary>Click to view exceptions/InsufficientSharesException.java</summary>

```java
package com.you.lld.problems.stockexchange.exceptions;
public class InsufficientSharesException extends RuntimeException { public InsufficientSharesException(String m) { super(m); } }
```

</details>

### `exceptions/InvalidPriceException.java`

<details>
<summary>Click to view exceptions/InvalidPriceException.java</summary>

```java
package com.you.lld.problems.stockexchange.exceptions;
public class InvalidPriceException extends RuntimeException { public InvalidPriceException(String m) { super(m); } }
```

</details>

### `exceptions/OrderNotFoundException.java`

<details>
<summary>Click to view exceptions/OrderNotFoundException.java</summary>

```java
package com.you.lld.problems.stockexchange.exceptions;
public class OrderNotFoundException extends RuntimeException { public OrderNotFoundException(String m) { super(m); } }
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.stockexchange.StockExchangeDemo"
```

# stockexchange - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/stockexchange/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py stockexchange`.

## Project Structure (16 files)

```
stockexchange/
├── StockExchangeDemo.java
├── StockExchange.java
├── model/Investor.java
├── model/MarketData.java
├── model/Order.java
├── model/OrderBook.java
├── model/OrderStatus.java
├── model/OrderType.java
├── model/Portfolio.java
├── model/Stock.java
├── model/Trade.java
├── service/StockExchangeService.java
├── service/impl/OrderMatchingEngine.java
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

import com.you.lld.problems.stockexchange.model.Order;
import com.you.lld.problems.stockexchange.model.OrderType;
import com.you.lld.problems.stockexchange.model.Trade;

import java.util.List;

/**
 * Demo: order book heaps, price-time priority, partial fills, cancellation.
 */
public class StockExchangeDemo {

    public static void main(String[] args) {
        System.out.println("=== Stock Exchange Demo ===\n");
        StockExchange exchange = new StockExchange();

        System.out.println("--- Scenario 1: Full match ---");
        String sellId = exchange.sell("AAPL", "seller1", 150.00, 100);
        String buyId = exchange.buy("AAPL", "buyer1", 151.00, 100);
        printTrade(exchange.trades("AAPL"));
        System.out.println("Buy status: " + exchange.order(buyId).getStatus());
        System.out.println("Sell status: " + exchange.order(sellId).getStatus());

        System.out.println("\n--- Scenario 2: Partial fill ---");
        exchange.sell("GOOG", "seller2", 2800.00, 50);
        exchange.buy("GOOG", "buyer2", 2800.00, 30);
        printTrade(exchange.trades("GOOG"));
        for (Order o : exchange.openOrders("GOOG")) {
            System.out.println("  Open " + o.getType() + " remaining: " + o.getRemainingQuantity()
                    + " status=" + o.getStatus());
        }

        System.out.println("\n--- Scenario 3: Best price wins ---");
        exchange.sell("TSLA", "s1", 250.00, 100);
        exchange.sell("TSLA", "s2", 248.00, 50);
        exchange.sell("TSLA", "s3", 252.00, 75);
        System.out.println("Best ask: $" + exchange.bestAsk("TSLA"));
        exchange.buy("TSLA", "b1", 249.00, 50);
        for (Trade t : exchange.trades("TSLA")) {
            System.out.println("  Trade: " + t.getQuantity() + " @ $" + t.getPrice());
        }

        System.out.println("\n--- Scenario 4: Cancellation ---");
        String cancelId = exchange.buy("MSFT", "user5", 380.00, 200);
        System.out.println("Before cancel: " + exchange.order(cancelId).getStatus());
        System.out.println("Cancelled: " + exchange.cancel(cancelId));
        System.out.println("After cancel: " + exchange.order(cancelId).getStatus());

        System.out.println("\n--- Scenario 5: No match (bid < ask) ---");
        exchange.sell("NFLX", "s4", 600.00, 100);
        exchange.buy("NFLX", "b4", 590.00, 100);
        System.out.println("Trades: " + exchange.trades("NFLX").size());
        System.out.println("Best bid: $" + exchange.bestBid("NFLX"));
        System.out.println("Best ask: $" + exchange.bestAsk("NFLX"));

        System.out.println("\n=== Demo complete ===");
    }

    private static void printTrade(List<Trade> trades) {
        if (!trades.isEmpty()) {
            Trade t = trades.get(trades.size() - 1);
            System.out.println("  Last trade: " + t.getQuantity() + " @ $" + t.getPrice());
        }
    }
}
```

</details>

### `StockExchange.java`

<details>
<summary>Click to view StockExchange.java</summary>

```java
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
import java.util.Comparator;

public class Order {
    private String id;
    private final String symbol;
    private final String userId;
    private final OrderType type;
    private final double price;
    private final int quantity;
    private int filledQuantity;
    private OrderStatus status;
    private final LocalDateTime createdAt;

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

    /** Buy book: highest price first, then earliest time. */
    public static final class BuyComparator implements Comparator<Order> {
        @Override
        public int compare(Order a, Order b) {
            int priceCompare = Double.compare(b.getPrice(), a.getPrice());
            if (priceCompare != 0) {
                return priceCompare;
            }
            return a.getCreatedAt().compareTo(b.getCreatedAt());
        }
    }

    /** Sell book: lowest price first, then earliest time. */
    public static final class SellComparator implements Comparator<Order> {
        @Override
        public int compare(Order a, Order b) {
            int priceCompare = Double.compare(a.getPrice(), b.getPrice());
            if (priceCompare != 0) {
                return priceCompare;
            }
            return a.getCreatedAt().compareTo(b.getCreatedAt());
        }
    }
}
```

</details>

### `model/OrderBook.java`

<details>
<summary>Click to view model/OrderBook.java</summary>

```java
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

### `service/StockExchangeService.java`

<details>
<summary>Click to view service/StockExchangeService.java</summary>

```java
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
```

</details>

### `service/impl/OrderMatchingEngine.java`

<details>
<summary>Click to view service/impl/OrderMatchingEngine.java</summary>

```java
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

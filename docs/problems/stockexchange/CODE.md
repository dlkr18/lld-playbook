# stockexchange - Complete Implementation

## 📁 Project Structure (15 files)

```
stockexchange/
├── Order.java
├── OrderBook.java
├── StockExchange.java
├── exceptions/InsufficientSharesException.java
├── exceptions/InvalidPriceException.java
├── exceptions/OrderNotFoundException.java
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

## 📝 Source Code

### 📄 `Order.java`

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

### 📄 `OrderBook.java`

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

### 📄 `StockExchange.java`

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

### 📄 `exceptions/InsufficientSharesException.java`

```java
package com.you.lld.problems.stockexchange.exceptions;
public class InsufficientSharesException extends RuntimeException { public InsufficientSharesException(String m) { super(m); } }```

### 📄 `exceptions/InvalidPriceException.java`

```java
package com.you.lld.problems.stockexchange.exceptions;
public class InvalidPriceException extends RuntimeException { public InvalidPriceException(String m) { super(m); } }```

### 📄 `exceptions/OrderNotFoundException.java`

```java
package com.you.lld.problems.stockexchange.exceptions;
public class OrderNotFoundException extends RuntimeException { public OrderNotFoundException(String m) { super(m); } }```

### 📄 `model/Investor.java`

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

### 📄 `model/MarketData.java`

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

### 📄 `model/Order.java`

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

### 📄 `model/OrderBook.java`

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

### 📄 `model/OrderStatus.java`

```java
package com.you.lld.problems.stockexchange.model;
public enum OrderStatus { ACTIVE, INACTIVE, PENDING, COMPLETED }```

### 📄 `model/OrderType.java`

```java
package com.you.lld.problems.stockexchange.model;
public enum OrderType { ACTIVE, INACTIVE, PENDING, COMPLETED }```

### 📄 `model/Portfolio.java`

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

### 📄 `model/Stock.java`

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

### 📄 `model/Trade.java`

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


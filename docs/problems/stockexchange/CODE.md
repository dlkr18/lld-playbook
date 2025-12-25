# Stock Exchange

## Difficulty: Hard | Pattern: Order Matching, Priority Queue

```java
class StockExchange {
    private Map<String, OrderBook> orderBooks;
    
    void placeOrder(Order order);
    void cancelOrder(String orderId);
}

class OrderBook {
    PriorityQueue<Order> buyOrders;
    PriorityQueue<Order> sellOrders;
    
    void matchOrders();
}
```

**Status**: ✅ Documented

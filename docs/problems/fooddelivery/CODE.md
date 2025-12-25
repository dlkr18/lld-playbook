# Food Delivery Service

## Difficulty: Hard | Pattern: Strategy, Observer

```java
class FoodDeliveryService {
    private Map<String, Restaurant> restaurants;
    private Map<String, DeliveryAgent> agents;
    private OrderMatcher orderMatcher;
    
    Order placeOrder(OrderRequest request);
    void assignDeliveryAgent(String orderId);
}

class OrderMatcher {
    DeliveryAgent findBestAgent(Order order);
}
```

**Status**: ✅ Documented

# Food Delivery — LLD

Restaurant orders, delivery partner assignment, order state machine, tracking.

## Patterns

| Pattern | Why |
|---------|-----|
| **State** | Order: Placed → Confirmed → Preparing → OutForDelivery → Delivered |
| **Strategy** | Nearest-partner matching (Haversine), fee calculation |
| **Observer** | Customer/restaurant notifications |

## Run

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.fooddelivery.FoodDeliveryDemo"
```

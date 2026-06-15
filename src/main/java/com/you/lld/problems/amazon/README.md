# Amazon E-Commerce — LLD

Design product catalog, shopping cart, checkout, order lifecycle, reviews.

## Package Structure

```
amazon/
  model/          Product, Cart, Order, Review, Address, Payment
  service/        ProductService, CartService, OrderService, PaymentService
  service/impl/   Product/Cart/Order/Payment implementations
  Amazon.java     Facade (catalog + cart + checkout)
  AmazonDemo.java
```

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Facade** | `Amazon` | Orchestrates cart → order → fulfillment in one API. |
| **Service decomposition** | Separate cart/order/product services | Single Responsibility; cart doesn't know shipping. |

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.amazon.AmazonDemo"
```

## Key Talking Points

- **Cart per user** in ConcurrentHashMap; synchronized item mutations on Cart.
- **Stock check** at add-to-cart time — fail fast before checkout.
- **Order state machine** — PENDING → CONFIRMED → SHIPPED → DELIVERED / CANCELLED.

# Amazon E-Commerce — LLD

Design product catalog, shopping cart, checkout, order lifecycle, reviews.

## Package Structure

```
amazon/
  model/          Product, Cart, Order, Review, Address, Payment
  service/        ProductService, CartService, OrderService, PaymentService
  service/impl/   Product/Cart/Order/Payment implementations
  exceptions/     InsufficientStock, EmptyCart, ProductNotFound, OrderNotFound, ...
  Amazon.java     Facade (catalog + cart + checkout saga)
  AmazonDemo.java
```

## Class Diagram

```mermaid
classDiagram
    class Amazon {
        -ProductService products
        -CartService cart
        -OrderService orders
        +checkout(String, Address) String
        +cancelOrder(String) boolean
        -releaseAll(List~CartItem~)
    }
    class ProductService {
        <<interface>>
        +getProduct(String) Product
        +searchProducts(String) List~Product~
        +addReview(String, Review) String
    }
    class CartService {
        <<interface>>
        +addToCart(String, String, int)
        +getCart(String) Cart
        +clearCart(String)
    }
    class OrderService {
        <<interface>>
        +createOrder(String, List~OrderItem~, Address) String
        +confirmOrder(String, String)
        +cancelOrder(String) boolean
    }
    class Product {
        -AtomicInteger stockQuantity
        -BigDecimal price
        -double rating
        -int reviewCount
        +tryReserve(int) boolean
        +releaseStock(int)
        +synchronized updateRating(double)
    }
    class Cart {
        -Map~String,CartItem~ items
        -BigDecimal totalAmount
        +synchronized addItem(Product, int)
    }
    class Order {
        -List~OrderItem~ items
        -BigDecimal totalAmount
        -OrderStatus status
        +confirm(String)
        +ship(String)
        +cancel()
    }
    class OrderItem {
        -String productId
        -BigDecimal price
        -int quantity
        note "price snapshotted at checkout"
    }

    Amazon --> ProductService
    Amazon --> CartService
    Amazon --> OrderService
    CartService --> ProductService
    ProductService --> Product
    CartService --> Cart
    OrderService --> Order
    Order --> OrderItem
    Cart --> Product : reads price
```

## Checkout Saga (all-or-nothing)

```mermaid
stateDiagram-v2
    [*] --> ValidateCart
    ValidateCart --> Fail: empty cart / EmptyCartException
    ValidateCart --> ReserveLines

    state ReserveLines {
        [*] --> TryReserve
        TryReserve --> TryReserve: next line
        TryReserve --> Reserved: all lines OK
        TryReserve --> Compensate: CAS fails / InsufficientStockException
        Compensate --> [*]: releaseAll(reserved), rethrow
    }

    ReserveLines --> CreateOrder: Reserved
    ReserveLines --> Fail: Compensate
    CreateOrder --> ClearCart
    ClearCart --> [*]: orderId

    note right of ReserveLines
        Reserve BEFORE the order exists.
        The `reserved` list is the
        compensation log.
    end note
```

## Order Lifecycle

```mermaid
stateDiagram-v2
    [*] --> PENDING: checkout
    PENDING --> CONFIRMED: confirm(paymentId)
    CONFIRMED --> SHIPPED: ship(tracking)
    SHIPPED --> DELIVERED: deliver()
    PENDING --> CANCELLED: cancel() -> releases stock
    CONFIRMED --> CANCELLED: cancel() -> releases stock
    SHIPPED --> CANCELLED: cancel() -> releases stock
    DELIVERED --> DELIVERED: cancel() rejected
    DELIVERED --> [*]
    CANCELLED --> [*]
```

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Facade** | `Amazon` | Orchestrates the cart → reserve → order saga in one API. |
| **Service decomposition** | Separate cart/order/product services | Single Responsibility; cart doesn't know shipping. |
| **Saga + compensation** | `checkout` / `releaseAll` | All-or-nothing across services without a distributed transaction. |
| **Compare-and-swap** | `Product.tryReserve` | The no-oversell invariant, lock-free. |
| **Value Object** | `OrderItem`, `Address` | Price snapshotted at checkout so orders don't rewrite themselves. |
| **Guarded state transitions** | `Order.confirm/ship/cancel` | Illegal transitions throw rather than corrupt. |

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.amazon.AmazonDemo"
```

## Key Talking Points

- **Stock is reserved at checkout, not at add-to-cart.** Reserving earlier holds
  inventory hostage to abandoned carts and needs a TTL + reaper. Checkout-time
  reservation trades that for a late "out of stock" — a product decision worth
  stating explicitly.
- **`tryReserve` is a CAS loop on the entity, not a service method.** A check-then-act
  (`if (q > stock) throw; stock -= q;`) lets every concurrent buyer pass the same
  stale check — measured at 100 orders against 1 unit. Putting the invariant on
  `Product` means no future service can bypass it.
- **Checkout is a saga.** Reserve every line before the order exists; on any
  failure, release everything already reserved and rethrow. `cancelOrder` is the
  symmetric compensation — without it inventory leaks on every cancellation.
- **`synchronized` for the rating, CAS for the stock.** The running average spans
  two fields (`rating`, `reviewCount`) so atomics don't help; stock is one field so
  CAS is strictly better. Picking per field is the point.
- **Order state machine** — PENDING → CONFIRMED → SHIPPED → DELIVERED / CANCELLED,
  with guards on the entity so illegal transitions throw.
- **Services are silent and speak their error vocabulary** — no `System.out` in the
  service layer, and the typed exceptions are actually thrown.

See [INTERVIEW.md](INTERVIEW.md) for the full SDE2/SDE3 walkthrough, including the
measured overselling reproduction.

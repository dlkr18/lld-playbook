# Restaurant — LLD

Restaurant management: table allocation, reservations, order state machine, and billing.

## Package Structure

```
restaurant/
  model/          Table, Order, Reservation, MenuItem, Bill, *Status enums
  service/        RestaurantService, TableAllocationStrategy
  service/impl/   InMemoryRestaurantService, BestFitTableAllocation
  exceptions/     TableNotFoundException, OrderNotFoundException, ...
  Restaurant.java Facade
  RestaurantDemo.java
```

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Strategy** | `TableAllocationStrategy` / `BestFitTableAllocation` | Swap first-fit vs best-fit without touching service. |
| **State machine** | `Order.transitionTo()` | Enforce PENDING→PREPARING→READY→SERVED→PAID. |
| **Synchronized resource** | Per-table lock | Safe concurrent reservation + seating. |
| **Facade** | `Restaurant` | Interview entry point. |

## Class Diagram

```mermaid
classDiagram
    class Restaurant {
        +service() RestaurantService
    }
    class TableAllocationStrategy {
        <<interface>>
        +allocate()
    }
    class BestFitTableAllocation
    class Order {
        +transitionTo()
    }
    class InMemoryRestaurantService
    Restaurant --> RestaurantService
    TableAllocationStrategy <|.. BestFitTableAllocation
    InMemoryRestaurantService --> TableAllocationStrategy
```

## Order State Diagram

```mermaid
stateDiagram-v2
    [*] --> PENDING
    PENDING --> PREPARING
    PREPARING --> READY
    READY --> SERVED
    SERVED --> PAID
    PENDING --> CANCELLED
    PREPARING --> CANCELLED
    READY --> CANCELLED
    PAID --> [*]
    CANCELLED --> [*]
```

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.restaurant.RestaurantDemo"
```

## Key Talking Points

- **Best-fit allocation** — smallest table ≥ party size minimizes wasted capacity.
- **Per-table locking** — reservation and seating mutate table status under `synchronized(table)`.
- **Order FSM** — invalid skips (PENDING→PAID) rejected at domain layer.
- **Bill gates** — `generateBill` only after SERVED; frees table on PAID.
- **Reservation lifecycle** — cancel restores AVAILABLE without orphan orders.

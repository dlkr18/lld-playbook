# BookMyShow - LLD Implementation

Plain **Low-Level Design** implementation. No Spring Boot, no REST, no DTOs — just interfaces, domain models, and service logic.

## Structure

```
bookmyshow/
├── api/              # Interfaces
│   ├── BookingService.java
│   ├── PricingStrategy.java
│   └── NotificationStrategy.java
│
├── model/            # Domain objects
│   ├── Movie, Theater, Screen, Show, Seat, Booking, Payment, User
│   └── Enums (City, Language, Genre, SeatType, BookingStatus, etc.)
│
├── impl/             # Business logic
│   ├── EnhancedBookingService.java   # Main service (in-memory state)
│   ├── SeatLockManager.java         # Seat locking + timeout
│   ├── *PricingStrategy.java        # Simple / Dynamic pricing
│   ├── *NotificationStrategy.java   # Email / SMS / Multi-channel
│   └── BookMyShowDemo.java          # Demo using service + models
│
├── cache/            # LRU cache for movies (optional)
│   └── MovieCache.java
│
├── util/             # Helpers (optional)
│   └── DateTimeUtil, SeatUtil, PriceCalculator
│
└── exceptions/       # Domain exceptions
    └── BookingNotFoundException, SeatNotAvailableException, etc.
```

## Flow

- **Demo / client** → calls `BookingService` with domain objects (`User`, `Show`, `Seat` ids, etc.).
- **Service** → holds in-memory maps, uses `PricingStrategy` and `NotificationStrategy`, uses `SeatLockManager` for concurrency.
- No controllers, no DTOs, no repositories — just API, model, and impl.

## Run

```bash
mvn compile exec:java -Dexec.mainClass="com.you.lld.problems.bookmyshow.impl.BookMyShowDemo"
```

## Design patterns used

- **Strategy** — pricing and notifications
- **Concurrency** — per-seat locking, lock timeout
- **Value object** — `Money` for amounts
- **Cache** — LRU `MovieCache` for movie lookups

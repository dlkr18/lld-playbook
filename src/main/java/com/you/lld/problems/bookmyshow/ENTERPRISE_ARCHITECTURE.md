# BookMyShow - Enterprise Architecture

## 🏗️ Complete Multi-Layer Architecture

This implementation goes **beyond the basic 3-layer structure** (API/Model/Impl) to demonstrate a **production-grade enterprise architecture** with 10+ layers and 35+ components.

---

## 📦 Complete Package Structure

```
bookmyshow/
├── api/                    # 1. PUBLIC CONTRACTS
│   ├── BookingService.java           (Main service interface)
│   ├── PricingStrategy.java          (Pricing abstraction)
│   └── NotificationStrategy.java     (Notification abstraction)
│
├── model/                  # 2. DOMAIN OBJECTS
│   ├── Movie.java, Theater.java, Screen.java, Show.java
│   ├── Seat.java, Booking.java, Payment.java, User.java
│   └── Enums (City, Language, Genre, SeatType, Status, etc.)
│
├── impl/                   # 3. BUSINESS LOGIC
│   ├── EnhancedBookingService.java   (Main service)
│   ├── SeatLockManager.java          (Concurrency control)
│   ├── DynamicPricingStrategy.java   (Dynamic pricing)
│   ├── SimplePricingStrategy.java    (Flat pricing)
│   ├── EmailNotificationStrategy.java
│   ├── SMSNotificationStrategy.java
│   ├── MultiChannelNotificationStrategy.java
│   └── BookMyShowDemo.java
│
├── repository/             # 4. DATA ACCESS LAYER ✨ NEW
│   ├── BookingRepository.java        (Interface)
│   ├── ShowRepository.java           (Interface)
│   └── impl/
│       └── InMemoryBookingRepository.java
│
├── controller/             # 5. API/REST LAYER ✨ NEW
│   └── BookingController.java        (REST endpoints)
│
├── dto/                    # 6. DATA TRANSFER OBJECTS ✨ NEW
│   ├── BookingRequest.java           (API request)
│   └── BookingResponse.java          (API response)
│
├── validator/              # 7. VALIDATION LAYER ✨ NEW
│   └── BookingValidator.java         (Business rules validation)
│
├── mapper/                 # 8. MAPPING LAYER ✨ NEW
│   └── BookingMapper.java            (DTO ↔ Model conversion)
│
├── factory/                # 9. FACTORY LAYER ✨ NEW
│   └── BookingFactory.java           (Complex object creation)
│
├── cache/                  # 10. CACHING LAYER ✨ NEW
│   └── MovieCache.java               (LRU cache for movies)
│
├── event/                  # 11. EVENT-DRIVEN LAYER ✨ NEW
│   ├── BookingEvent.java             (Base event)
│   ├── BookingConfirmedEvent.java
│   ├── BookingCancelledEvent.java
│   ├── BookingEventListener.java     (Observer interface)
│   └── BookingEventPublisher.java    (Publisher/Subscriber)
│
├── config/                 # 12. CONFIGURATION LAYER ✨ NEW
│   └── ApplicationConfig.java        (App configuration)
│
├── util/                   # 13. UTILITY LAYER ✨ NEW
│   ├── DateTimeUtil.java             (Date/time helpers)
│   ├── SeatUtil.java                 (Seat operations)
│   └── PriceCalculator.java          (Price calculations)
│
└── exceptions/             # 14. EXCEPTION LAYER
    ├── BookingNotFoundException.java
    ├── ShowNotFoundException.java
    ├── SeatNotAvailableException.java
    └── PaymentFailedException.java
```

---

## 🎯 Architecture Patterns by Layer

### **1. Repository Layer** (Data Access Pattern)

**Purpose**: Abstract data persistence  
**Pattern**: Repository Pattern  

```java
public interface BookingRepository {
    Booking save(Booking booking);
    Optional<Booking> findById(String bookingId);
    List<Booking> findByUserId(String userId);
    List<Booking> findExpiredPendingBookings(LocalDateTime threshold);
    double getTotalRevenue(LocalDateTime start, LocalDateTime end);
}
```

**Benefits**:
- ✅ Decouples business logic from data access
- ✅ Easy to swap implementations (H2 → PostgreSQL → MongoDB)
- ✅ Testable with mock repositories
- ✅ Query methods centralized

---

### **2. Controller Layer** (API Pattern)

**Purpose**: Handle HTTP requests/responses  
**Pattern**: MVC Controller  

```java
@RestController  // Spring Boot annotation (simulated)
@RequestMapping("/api/v1/bookings")
public class BookingController {
    
    public BookingResponse createBooking(BookingRequest request) {
        // Validate → Process → Map to DTO → Return
    }
}
```

**Benefits**:
- ✅ Clean separation of API contract from business logic
- ✅ Easy to add authentication/authorization
- ✅ Request/response transformation
- ✅ Error handling at API boundary

---

### **3. DTO Layer** (Transfer Object Pattern)

**Purpose**: API contract separate from domain model  
**Pattern**: Data Transfer Object  

```java
// API Request
public class BookingRequest {
    private String userId;
    private String showId;
    private List<String> seatIds;
    private String promoCode;  // Optional
}

// API Response
public class BookingResponse {
    private String bookingId;
    private String movieTitle;
    private List<SeatDTO> seats;
    // Only data needed by client
}
```

**Benefits**:
- ✅ API versioning (v1, v2) without changing domain models
- ✅ Hide internal implementation details
- ✅ Reduce over-fetching/under-fetching
- ✅ Clear API contracts

---

### **4. Validator Layer** (Validation Pattern)

**Purpose**: Validate business rules before processing  
**Pattern**: Validator Pattern  

```java
public class BookingValidator {
    public List<String> validate(BookingRequest request) {
        // Check user ID, show ID, seat count limits
        // Check for duplicate seats
        // Validate promo code format
        // Check seat adjacency (optional)
    }
}
```

**Benefits**:
- ✅ Centralized validation logic
- ✅ Reusable across controllers
- ✅ Clear error messages
- ✅ Fail fast

---

### **5. Mapper Layer** (Mapper Pattern)

**Purpose**: Convert between DTOs and domain models  
**Pattern**: Object Mapper  

```java
public class BookingMapper {
    public static BookingResponse toResponse(
        Booking booking, Show show, Movie movie, Theater theater) {
        // Map domain models → DTO
    }
}
```

**Benefits**:
- ✅ Single source of truth for conversions
- ✅ Reduces boilerplate code
- ✅ Easy to maintain mapping logic
- ✅ Type-safe transformations

---

### **6. Factory Layer** (Factory Pattern)

**Purpose**: Complex object creation  
**Pattern**: Factory Pattern  

```java
public class BookingFactory {
    public static Booking createBooking(...) {
        String bookingId = generateBookingId(); // Complex ID generation
        return new Booking(...);
    }
    
    private static String generateBookingId() {
        return "BKG-" + timestamp + "-" + random;
    }
}
```

**Benefits**:
- ✅ Encapsulates creation logic
- ✅ Consistent ID generation
- ✅ Easy to add creation variants
- ✅ Testable creation logic

---

### **7. Cache Layer** (Caching Pattern)

**Purpose**: Performance optimization  
**Pattern**: LRU Cache  

```java
public class MovieCache {
    private final Map<String, CacheEntry> cache;
    private final LinkedList<String> accessOrder; // LRU
    
    public synchronized Optional<Movie> get(String movieId) {
        // Check cache → Check expiry → Update LRU order
    }
}
```

**Benefits**:
- ✅ Reduces database queries
- ✅ Faster response times
- ✅ TTL-based expiry
- ✅ Bounded memory usage (LRU eviction)

---

### **8. Event Layer** (Event-Driven Pattern)

**Purpose**: Decouple components via events  
**Pattern**: Observer + Publisher/Subscriber  

```java
// Event
public class BookingConfirmedEvent extends BookingEvent {
    private final String paymentId;
}

// Listener
public interface BookingEventListener {
    void onEvent(BookingEvent event);
}

// Publisher
public class BookingEventPublisher {
    public void publish(BookingEvent event) {
        // Notify all listeners (async or sync)
    }
}
```

**Benefits**:
- ✅ Loose coupling between components
- ✅ Easy to add new listeners (analytics, logging)
- ✅ Async processing for better performance
- ✅ Event sourcing capability

---

### **9. Config Layer** (Configuration Pattern)

**Purpose**: Centralized configuration management  
**Pattern**: Configuration Object  

```java
public class ApplicationConfig {
    // Booking config
    public static final int MAX_SEATS_PER_BOOKING = 10;
    public static final Duration BOOKING_LOCK_TIMEOUT = Duration.ofMinutes(5);
    
    // Cache config
    public static final int MOVIE_CACHE_SIZE = 1000;
    public static final Duration MOVIE_CACHE_TTL = Duration.ofHours(6);
    
    // Feature flags
    public static final boolean ENABLE_DYNAMIC_PRICING = true;
    public static final boolean ENABLE_PROMO_CODES = true;
}
```

**Benefits**:
- ✅ Single source of truth for configuration
- ✅ Easy to change behavior without code changes
- ✅ Environment-specific configs (dev, prod)
- ✅ Feature flags for gradual rollouts

---

### **10. Util Layer** (Helper Pattern)

**Purpose**: Reusable utility functions  
**Pattern**: Static Utility Classes  

```java
// DateTimeUtil
public static boolean isWeekend(LocalDateTime dateTime) { }
public static boolean isEvening(LocalDateTime dateTime) { }
public static long hoursBetween(LocalDateTime start, LocalDateTime end) { }

// SeatUtil
public static List<Seat> generateSeatLayout(int rows, int seatsPerRow) { }
public static boolean areConsecutive(List<Seat> seats) { }

// PriceCalculator
public static Money applyDiscount(Money price, double discountPercent) { }
public static Money applyPromoCode(Money price, String promoCode) { }
```

**Benefits**:
- ✅ Reusable across application
- ✅ Reduces code duplication
- ✅ Easier testing
- ✅ Clear, focused functionality

---

## 🔄 Request Flow Through Layers

```
HTTP Request
    ↓
[Controller Layer]
   │ - Parse request
   │ - Validate input
   ↓
[Validator Layer]
   │ - Check business rules
   │ - Return errors if invalid
   ↓
[Service Layer (Impl)]
   │ - Business logic
   │ - Call strategies (Pricing, Notification)
   ↓
[Repository Layer]
   │ - Data access
   │ - CRUD operations
   ↓
[Cache Layer] (optional)
   │ - Check cache first
   │ - Update cache on write
   ↓
[Event Layer]
   │ - Publish events
   │ - Notify listeners
   ↓
[Mapper Layer]
   │ - Convert domain → DTO
   ↓
[Controller Layer]
   │ - Return DTO response
   ↓
HTTP Response
```

---

## 📊 Component Statistics

| Layer | Components | Lines of Code | Purpose |
|-------|-----------|---------------|---------|
| API | 3 | ~150 | Interfaces |
| Model | 15+ | ~800 | Domain objects |
| Impl | 8 | ~1,500 | Business logic |
| Repository | 3 | ~300 | Data access |
| Controller | 1 | ~150 | REST API |
| DTO | 2 | ~150 | API contracts |
| Validator | 1 | ~120 | Validation |
| Mapper | 1 | ~80 | Conversions |
| Factory | 1 | ~70 | Object creation |
| Cache | 1 | ~150 | Performance |
| Event | 5 | ~250 | Event-driven |
| Config | 1 | ~150 | Configuration |
| Util | 3 | ~250 | Helpers |
| Exceptions | 4 | ~100 | Error handling |
| **TOTAL** | **48+** | **~4,200** | **Enterprise-ready** |

---

## 🎨 Design Patterns Applied (Extended)

| Pattern | Where Used | Purpose |
|---------|------------|---------|
| **Repository** | BookingRepository, ShowRepository | Data access abstraction |
| **Factory** | BookingFactory | Complex object creation |
| **Mapper** | BookingMapper | DTO ↔ Model conversion |
| **Observer** | BookingEventListener | Event handling |
| **Publisher/Subscriber** | BookingEventPublisher | Event distribution |
| **Strategy** | PricingStrategy, NotificationStrategy | Algorithm selection |
| **Composite** | MultiChannelNotificationStrategy | Combine strategies |
| **Dependency Injection** | All service constructors | Loose coupling |
| **Value Object** | Money, DTOs | Immutability |
| **Cache-Aside** | MovieCache | Performance optimization |
| **Validator** | BookingValidator | Input validation |
| **MVC** | Controller | API handling |

---

## 🚀 Production Readiness Checklist

### What's Implemented ✅
- [x] **Multi-layer architecture** (10+ layers)
- [x] **Repository pattern** for data access
- [x] **DTO layer** for API contracts
- [x] **Validation layer** for business rules
- [x] **Caching layer** for performance
- [x] **Event-driven architecture** for decoupling
- [x] **Configuration management**
- [x] **Utility helpers**
- [x] **REST controller simulation**
- [x] **Factory pattern** for object creation
- [x] **Mapper pattern** for conversions
- [x] **Thread-safe operations**
- [x] **Proper exception hierarchy**
- [x] **Money type** for financial accuracy

### What's Needed for Production 🔄
- [ ] **Database integration** (JPA/Hibernate)
- [ ] **Spring Boot** integration
- [ ] **Redis** for distributed cache/locks
- [ ] **Kafka/RabbitMQ** for event streaming
- [ ] **Monitoring** (Prometheus + Grafana)
- [ ] **Logging** (ELK stack)
- [ ] **API documentation** (Swagger/OpenAPI)
- [ ] **Authentication** (JWT/OAuth2)
- [ ] **Rate limiting** (Redis-based)
- [ ] **Circuit breakers** (Resilience4j)

---

## 💡 Key Takeaways

### Why So Many Layers?

1. **Separation of Concerns**: Each layer has a single, clear responsibility
2. **Testability**: Easy to test each layer in isolation
3. **Maintainability**: Changes in one layer don't affect others
4. **Scalability**: Can replace/optimize individual layers
5. **Team Collaboration**: Teams can work on different layers independently

### Real-World Benefits

- **Repository Layer**: Swap H2 → PostgreSQL → MongoDB without changing business logic
- **Cache Layer**: Add caching without changing existing code
- **Event Layer**: Add analytics/logging without touching core logic
- **DTO Layer**: API versioning (v1, v2) without changing domain models
- **Validator Layer**: Centralized business rules, easy to update
- **Config Layer**: Feature flags for A/B testing, gradual rollouts

---

## 🎓 Interview Talking Points

This architecture demonstrates:

1. **Enterprise Experience**: Multi-layer architecture beyond basic patterns
2. **Design Maturity**: Proper separation of concerns, not just "3-tier"
3. **Production Thinking**: Cache, events, validation, DTOs
4. **Scalability Awareness**: Event-driven, repository pattern, caching
5. **Code Organization**: 48+ components organized logically
6. **Pattern Knowledge**: 12+ design patterns applied correctly

---

## 📝 Summary

This implementation goes **far beyond the basic api/model/impl structure** to demonstrate:

✅ **10+ architectural layers**  
✅ **48+ components**  
✅ **12+ design patterns**  
✅ **4,200+ lines of production-quality code**  
✅ **Enterprise-grade architecture**  
✅ **Interview-ready depth**  

**Perfect for demonstrating advanced system design skills in interviews!** 🎯

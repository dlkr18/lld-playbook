# Parking Lot Implementation

This package contains complete, production-ready implementations of the parking lot system.

## Components

### 1. InMemoryParkingService
**Main implementation of `ParkingService` interface.**

**Features:**
- Thread-safe implementation using `ConcurrentHashMap`
- Atomic ticket and payment ID generation
- Comprehensive validation and error handling
- Support for adding/removing parking spaces dynamically
- Tracks both active and completed tickets

**Usage:**
```java
// Create parking spaces
List<ParkingSpace> spaces = new ArrayList<>();
spaces.add(new ParkingSpace("A1", SpaceType.COMPACT, 0));
spaces.add(new ParkingSpace("A2", SpaceType.LARGE, 0));

// Initialize strategies
PricingStrategy pricing = new HourlyPricingStrategy();
SpaceAllocationStrategy allocation = new NearestSpaceAllocationStrategy();
PaymentProcessor processor = new SimplePaymentProcessor();

// Create service
ParkingService service = new InMemoryParkingService(
    spaces, pricing, allocation, processor
);

// Park a vehicle
Vehicle car = new Vehicle("ABC-123", VehicleType.CAR);
ParkingTicket ticket = service.enterVehicle(car);

// Calculate fee
Money fee = service.calculateParkingFee(ticket.getTicketId());

// Exit and pay
Payment payment = service.exitVehicle(
    ticket.getTicketId(), 
    PaymentMethod.CREDIT_CARD
);
```

**Thread Safety:**
- All public methods are thread-safe
- Uses synchronized blocks for space occupation/vacation
- Uses atomic counters for ID generation
- Suitable for concurrent usage in multi-threaded environments

### 2. HourlyPricingStrategy
**Time-based pricing implementation.**

**Features:**
- Different hourly rates per vehicle type
- Grace period (default: 15 minutes free)
- Minimum charge enforcement
- Rounds up partial hours
- Configurable rates

**Default Rates:**
- Motorcycle: $10/hour
- Car: $20/hour
- Truck: $40/hour
- Bus: $50/hour
- Minimum charge: $5

**Custom Configuration:**
```java
Map<VehicleType, Money> customRates = new HashMap<>();
customRates.put(VehicleType.CAR, Money.of(new BigDecimal("25.00")));
// ... configure other types

Money minCharge = Money.of(new BigDecimal("10.00"));
Duration gracePeriod = Duration.ofMinutes(30);

PricingStrategy pricing = new HourlyPricingStrategy(
    customRates, minCharge, gracePeriod
);
```

**Pricing Logic:**
1. If parking duration ≤ grace period → Free ($0)
2. Calculate hours (rounds up partial hours)
3. Multiply hours by hourly rate for vehicle type
4. Apply minimum charge if calculated fee is lower

### 3. NearestSpaceAllocationStrategy
**Intelligent space allocation based on proximity and space type.**

**Features:**
- Prioritizes lower floor numbers (nearer to entrance)
- Optimizes space type selection per vehicle
- Follows business rules for space allocation

**Space Priority Logic:**

| Vehicle Type | 1st Choice | 2nd Choice | 3rd Choice |
|-------------|------------|------------|------------|
| Motorcycle  | Motorcycle | Compact    | Large      |
| Car         | Compact    | Large      | -          |
| Truck       | Large      | -          | -          |
| Bus         | Large      | -          | -          |

**Algorithm:**
1. Filter available spaces by vehicle compatibility
2. Try to find space matching preferred type (by priority order)
3. Within same type, select lowest floor number
4. If same floor, sort by space ID for consistency

### 4. SimplePaymentProcessor
**In-memory payment processing simulation.**

**Features:**
- Supports all payment methods
- Configurable transaction fees
- Payment history tracking
- Refund support

**Default Transaction Fees:**
- Cash: 0%
- Credit Card: 2.5%
- Debit Card: 1.5%
- Mobile Payment: 2.0%

**Usage:**
```java
PaymentProcessor processor = new SimplePaymentProcessor();

// Process payment
Payment payment = new Payment(
    "PAY-001", ticket, amount, PaymentMethod.CREDIT_CARD
);
boolean success = processor.processPayment(payment);

// Calculate transaction fee
Money fee = processor.getTransactionFee(
    amount, PaymentMethod.CREDIT_CARD
);

// Refund payment
processor.refundPayment(payment);
```

**Production Note:**
This is a simplified implementation. In production, replace with:
- Real payment gateway integration (Stripe, PayPal, etc.)
- PCI-DSS compliant security
- 3D Secure authentication
- Webhook handling for async notifications
- Proper error codes and retry logic

### 5. ParkingLotDemo
**Complete demonstration of the system.**

**What it demonstrates:**
- System initialization with multiple floors
- Vehicle entry for different types
- Occupancy tracking
- Fee calculation
- Payment processing with multiple methods
- Vehicle exit
- Error handling scenarios

**Run the demo:**
```bash
cd src/main/java
javac com/you/lld/problems/parkinglot/impl/ParkingLotDemo.java
java com.you.lld.problems.parkinglot.impl.ParkingLotDemo
```

## Architecture Decisions

### Design Patterns Used

1. **Strategy Pattern**
   - `PricingStrategy` - Pluggable pricing algorithms
   - `SpaceAllocationStrategy` - Configurable allocation logic
   - Allows runtime strategy switching

2. **Dependency Injection**
   - Service accepts strategies via constructor
   - Promotes loose coupling and testability
   - Easy to mock for unit tests

3. **Value Objects**
   - `Money` for financial calculations
   - `Duration` for time calculations
   - Ensures type safety and prevents errors

4. **Immutable Objects**
   - Most model classes are immutable
   - Thread-safe by design
   - Prevents accidental state mutation

### SOLID Principles

1. **Single Responsibility**
   - Each class has one clear purpose
   - `ParkingService` - orchestration
   - `PricingStrategy` - fee calculation
   - `PaymentProcessor` - payment handling

2. **Open/Closed**
   - Open for extension via strategy interfaces
   - Closed for modification of core logic
   - Add new strategies without changing service

3. **Liskov Substitution**
   - All strategy implementations are substitutable
   - Consistent interface contracts

4. **Interface Segregation**
   - Small, focused interfaces
   - Clients depend only on what they use

5. **Dependency Inversion**
   - Service depends on abstractions (interfaces)
   - Not on concrete implementations
   - Strategies injected from outside

## Testing Recommendations

### Unit Tests
```java
@Test
public void testVehicleEntrySuccess() {
    // Given
    ParkingService service = createTestService();
    Vehicle vehicle = new Vehicle("ABC-123", VehicleType.CAR);
    
    // When
    ParkingTicket ticket = service.enterVehicle(vehicle);
    
    // Then
    assertNotNull(ticket);
    assertEquals(vehicle, ticket.getVehicle());
    assertTrue(ticket.isActive());
}

@Test(expected = ParkingFullException.class)
public void testParkingFullException() {
    // Given
    ParkingService service = createServiceWithOneSpace();
    Vehicle car1 = new Vehicle("ABC-123", VehicleType.CAR);
    Vehicle car2 = new Vehicle("DEF-456", VehicleType.CAR);
    
    // When
    service.enterVehicle(car1); // First car parks
    service.enterVehicle(car2); // Should throw exception
}
```

### Integration Tests
```java
@Test
public void testCompleteParking Workflow() {
    // Test end-to-end flow:
    // 1. Vehicle enters
    // 2. Time passes
    // 3. Fee calculation
    // 4. Payment processing
    // 5. Vehicle exits
    // 6. Space is freed
}
```

### Concurrent Tests
```java
@Test
public void testConcurrentVehicleEntry() {
    // Test multiple threads entering vehicles simultaneously
    // Verify no double-booking of spaces
    // Verify thread safety
}
```

## Extension Points

### Custom Pricing Strategies

```java
public class DynamicPricingStrategy implements PricingStrategy {
    @Override
    public Money calculateFee(ParkingTicket ticket) {
        // Implement surge pricing based on:
        // - Time of day (higher rates during peak hours)
        // - Occupancy rate (higher when near full)
        // - Special events (holiday pricing)
        // - Demand patterns
    }
}
```

### Custom Allocation Strategies

```java
public class LoadBalancingAllocationStrategy implements SpaceAllocationStrategy {
    @Override
    public Optional<ParkingSpace> selectSpace(
            List<ParkingSpace> spaces, VehicleType type) {
        // Distribute vehicles evenly across floors
        // Balance wear and tear
        // Optimize for future allocation patterns
    }
}
```

### Database Integration

Replace `InMemoryParkingService` with:
```java
public class DatabaseParkingService implements ParkingService {
    private final ParkingSpaceRepository spaceRepo;
    private final ParkingTicketRepository ticketRepo;
    private final PaymentRepository paymentRepo;
    
    // Implement with JPA/Hibernate for persistence
    // Add transaction management
    // Implement optimistic locking
}
```

## Performance Characteristics

### Time Complexity
- `enterVehicle()`: O(n) where n = number of spaces
- `exitVehicle()`: O(1) - ticket lookup
- `calculateParkingFee()`: O(1) - ticket lookup
- `checkAvailability()`: O(n) where n = number of spaces
- `getOccupancyReport()`: O(n) where n = number of spaces

### Space Complexity
- O(s + t) where s = spaces, t = tickets
- Bounded by maximum lot capacity
- Old tickets could be archived periodically

### Scalability Considerations
1. **Vertical**: Current implementation scales to ~10,000 spaces
2. **Horizontal**: Need distributed implementation for multiple lots
3. **Caching**: Add cache layer for frequent queries
4. **Read Replicas**: Separate read/write operations
5. **Event Sourcing**: Track all state changes for audit

## Security Considerations

1. **Ticket Security**
   - Add cryptographic signing to prevent forgery
   - Include timestamp and checksum
   - Implement ticket expiration

2. **Payment Security**
   - Never store credit card numbers
   - Use tokenization for card data
   - Implement PCI-DSS compliance
   - Add fraud detection

3. **Access Control**
   - Role-based access for admin operations
   - Audit logging for all operations
   - Rate limiting to prevent abuse

## Monitoring & Observability

### Metrics to Track
```java
// Business Metrics
- vehicles_parked_total
- average_parking_duration
- revenue_by_payment_method
- occupancy_rate_by_floor

// Technical Metrics
- api_latency_seconds
- payment_processing_time
- space_allocation_time
- concurrent_requests

// Error Metrics
- parking_full_exceptions_total
- payment_failures_total
- invalid_ticket_errors_total
```

### Logging
```java
// Log all critical operations:
log.info("Vehicle entered: license={}, ticketId={}, spaceId={}", 
    vehicle.getLicenseNumber(), ticket.getTicketId(), space.getSpaceId());

log.info("Payment processed: ticketId={}, amount={}, method={}", 
    ticket.getTicketId(), payment.getAmount(), payment.getPaymentMethod());

log.error("Payment failed: ticketId={}, error={}", 
    ticketId, e.getMessage(), e);
```

## Future Enhancements

1. **Reservation System**
   - Pre-book parking spaces
   - Time-bound reservations
   - Cancellation handling

2. **Subscription Plans**
   - Monthly passes
   - Corporate accounts
   - Loyalty programs

3. **Dynamic Pricing**
   - Surge pricing during peak hours
   - Demand-based pricing
   - Early bird discounts

4. **IoT Integration**
   - Automated license plate recognition
   - Smart sensors for occupancy detection
   - Mobile app integration

5. **Analytics Dashboard**
   - Real-time occupancy visualization
   - Revenue reports
   - Usage patterns and trends

## License & Contact

Part of the LLD Playbook project.
For questions or contributions, refer to the main project documentation.

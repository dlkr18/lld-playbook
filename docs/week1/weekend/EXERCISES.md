# Weekend 1 Project: Parking Lot System 📝

Complete end-to-end implementation with all components.

---

## 🎯 **Part 1: Domain Models (2 hours)**

### **Task 1.1: Vehicle Hierarchy**
```java
public abstract class Vehicle {
    protected final String licensePlate;
    protected final VehicleType type;
    
    public abstract SpaceSize getRequiredSpace();
}

public class Motorcycle extends Vehicle { }
public class Car extends Vehicle { }
public class Truck extends Vehicle { }
public class ElectricCar extends Vehicle {
    public boolean needsCharging();
}
```

### **Task 1.2: Parking Space**
```java
public class ParkingSpace {
    private final String id;
    private final SpaceSize size;
    private final int floor;
    private final SpaceType type; // REGULAR, HANDICAPPED, ELECTRIC
    private Vehicle occupant;
    
    public boolean canFit(Vehicle vehicle);
    public void park(Vehicle vehicle);
    public Vehicle vacate();
}
```

### **Task 1.3: Parking Ticket**
```java
public class ParkingTicket {
    private final String ticketId;
    private final Vehicle vehicle;
    private final ParkingSpace space;
    private final Instant entryTime;
    private Instant exitTime;
    private PaymentStatus paymentStatus;
    
    public Duration getParkingDuration();
}
```

---

## 🎯 **Part 2: Pricing Engine (1.5 hours)**

### **Task 2.1: Base Pricing Strategy**
```java
public interface PricingStrategy {
    Money calculateFee(ParkingTicket ticket);
}

public class HourlyPricing implements PricingStrategy {
    private final Map<VehicleType, Money> hourlyRates;
    private final Money minimumCharge;
}
```

### **Task 2.2: Peak Hours Pricing**
```java
public class PeakHoursPricing implements PricingStrategy {
    private final PricingStrategy basePricing;
    private final BigDecimal peakMultiplier;
    private final List<TimeRange> peakHours;
    
    @Override
    public Money calculateFee(ParkingTicket ticket) {
        // Apply multiplier for hours during peak times
    }
}
```

### **Task 2.3: Tiered Pricing**
```java
public class TieredPricing implements PricingStrategy {
    // First hour: $5
    // Hours 2-4: $3/hour
    // Hours 5+: $2/hour
    // Maximum daily: $30
}
```

### **Test Cases**
```java
// 30 minutes = $5 (minimum charge)
// 2.5 hours = $8 (first hour $5 + 1.5 * $3)
// 8 hours during peak = calculate with multiplier
// 24 hours = $30 (daily max)
```

---

## 🎯 **Part 3: Space Allocation (1.5 hours)**

### **Task 3.1: Allocation Strategy**
```java
public interface SpaceAllocationStrategy {
    Optional<ParkingSpace> findSpace(Vehicle vehicle, List<ParkingSpace> available);
}

public class NearestEntranceStrategy implements SpaceAllocationStrategy { }
public class EvenDistributionStrategy implements SpaceAllocationStrategy { }
public class SmallestFitStrategy implements SpaceAllocationStrategy { }
```

### **Task 3.2: Multi-Floor Support**
```java
public class ParkingFloor {
    private final int floorNumber;
    private final Map<String, ParkingSpace> spaces;
    private final EntranceGate entrance;
    private final ExitGate exit;
    
    public int getAvailableCount(SpaceSize size);
    public List<ParkingSpace> getAvailableSpaces(SpaceSize size);
}
```

---

## 🎯 **Part 4: Entry/Exit Flow (2 hours)**

### **Task 4.1: Entry Gate**
```java
public class EntryGate {
    private final String gateId;
    private final ParkingLot lot;
    private final TicketDispenser dispenser;
    
    public ParkingTicket processEntry(Vehicle vehicle) {
        // 1. Check capacity
        // 2. Find space
        // 3. Generate ticket
        // 4. Open barrier
    }
}
```

### **Task 4.2: Exit Gate**
```java
public class ExitGate {
    private final String gateId;
    private final PaymentProcessor paymentProcessor;
    
    public ExitResult processExit(ParkingTicket ticket, PaymentMethod method) {
        // 1. Calculate fee
        // 2. Process payment
        // 3. Mark space as available
        // 4. Open barrier
    }
}
```

### **Task 4.3: Payment Processing**
```java
public interface PaymentProcessor {
    PaymentResult process(Money amount, PaymentMethod method);
    RefundResult refund(String transactionId, Money amount);
}

public class MultiMethodPaymentProcessor implements PaymentProcessor {
    // Support: CASH, CREDIT_CARD, MOBILE_PAY
}
```

---

## 🎯 **Part 5: Management Dashboard (1.5 hours)**

### **Task 5.1: Occupancy Reporting**
```java
public class OccupancyReport {
    private final int totalSpaces;
    private final int occupiedSpaces;
    private final Map<SpaceSize, Integer> availableBySize;
    private final Map<Integer, Integer> availableByFloor;
    private final Instant generatedAt;
    
    public BigDecimal getOccupancyRate();
}
```

### **Task 5.2: Revenue Reporting**
```java
public class RevenueReport {
    private final DateRange period;
    private final Money totalRevenue;
    private final Map<PaymentMethod, Money> byPaymentMethod;
    private final Map<VehicleType, Money> byVehicleType;
    private final int totalTickets;
    private final Duration averageParkingDuration;
}
```

### **Task 5.3: Admin Operations**
```java
public interface ParkingLotAdmin {
    void addFloor(ParkingFloor floor);
    void removeFloor(int floorNumber);
    void addSpace(int floor, ParkingSpace space);
    void closeSpace(String spaceId, String reason);
    void updatePricing(PricingStrategy newPricing);
    void generateReport(DateRange period);
}
```

---

## 🎯 **Part 6: Error Handling (1 hour)**

### **Custom Exceptions**
```java
public class ParkingLotFullException extends ParkingException { }
public class InvalidTicketException extends ParkingException { }
public class PaymentFailedException extends ParkingException { }
public class SpaceNotAvailableException extends ParkingException { }
public class VehicleAlreadyParkedException extends ParkingException { }
```

### **Recovery Scenarios**
1. Payment failure → retry or manual override
2. Ticket lost → charge maximum daily rate
3. System failure → allow manual exit with estimated fee

---

## 🎯 **Part 7: Concurrency (1.5 hours)**

### **Thread-Safe Operations**
```java
public class ConcurrentParkingLot {
    private final ReadWriteLock spaceLock = new ReentrantReadWriteLock();
    private final ConcurrentHashMap<String, ParkingTicket> activeTickets;
    
    public ParkingTicket parkVehicle(Vehicle vehicle) {
        spaceLock.writeLock().lock();
        try {
            // Find and allocate space
        } finally {
            spaceLock.writeLock().unlock();
        }
    }
}
```

### **Test Concurrent Access**
```java
@Test
void shouldHandleConcurrentParking() throws InterruptedException {
    ParkingLot lot = createLotWithCapacity(100);
    
    ExecutorService executor = Executors.newFixedThreadPool(20);
    CountDownLatch latch = new CountDownLatch(200);
    AtomicInteger successes = new AtomicInteger();
    
    for (int i = 0; i < 200; i++) {
        executor.submit(() -> {
            try {
                if (lot.parkVehicle(createCar())) {
                    successes.incrementAndGet();
                }
            } finally {
                latch.countDown();
            }
        });
    }
    
    latch.await(10, TimeUnit.SECONDS);
    assertEquals(100, successes.get()); // Only 100 should succeed
}
```

---

## 📋 **Deliverables Checklist**

- [ ] All domain models implemented
- [ ] At least 3 pricing strategies
- [ ] At least 2 allocation strategies
- [ ] Entry/exit flow working
- [ ] Payment processing implemented
- [ ] Reporting dashboard functional
- [ ] Custom exception hierarchy
- [ ] Thread-safety verified
- [ ] 80%+ test coverage
- [ ] Class diagram updated
- [ ] Sequence diagrams for entry/exit flows
- [ ] State diagram for ticket lifecycle

---

## ⏱️ **Estimated Time: 12 hours**

| Component | Time |
|-----------|------|
| Domain Models | 2 hrs |
| Pricing Engine | 1.5 hrs |
| Space Allocation | 1.5 hrs |
| Entry/Exit Flow | 2 hrs |
| Dashboard | 1.5 hrs |
| Error Handling | 1 hr |
| Concurrency | 1.5 hrs |
| Testing | 1 hr |

---

**Full Solution**: See `src/main/java/com/you/lld/problems/parkinglot/`

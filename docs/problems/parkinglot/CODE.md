# Parking Lot System - Complete Implementation 🅿️

Production-ready **parking lot management system** with **multiple pricing strategies**, **space allocation algorithms**, **payment processing**, and **occupancy tracking**. Comprehensive system design example.

---

## 🎯 **System Overview**

Complete parking lot system supporting:

✅ **Multi-Level Parking** - Floors, zones, space types  
✅ **Multiple Vehicle Types** - Car, Bike, Truck, EV  
✅ **Dynamic Pricing** - Hourly, daily, flat rate, peak hours  
✅ **Smart Allocation** - Nearest, first available, by type  
✅ **Payment Processing** - Multiple payment methods  
✅ **Real-Time Occupancy** - Live availability tracking  

---

## 📚 **Complete Documentation**

For full system design, architecture, and diagrams, see:

**[📖 Main Documentation](problems/parkinglot/README.md)**

Includes:
- System requirements and constraints
- API contracts and interfaces
- UML diagrams (Class, Sequence)
- Design decisions and trade-offs

---

## 💻 **Implementation Structure**

### **Core Models** (`src/main/java/com/you/lld/problems/parkinglot/model/`)

#### **Vehicle & Space Types:**
```java
public enum VehicleType {
    BIKE,     // Motorcycle, Scooter
    CAR,      // Sedan, SUV
    TRUCK,    // Large vehicles
    EV        // Electric vehicles (need charging)
}

public enum SpaceType {
    COMPACT,   // For bikes
    STANDARD,  // For cars
    LARGE,     // For trucks
    EV_CHARGING  // EV charging spots
}
```

#### **Domain Models:**
- `Vehicle.java` - License plate, type, owner
- `ParkingSpace.java` - Space number, type, floor, occupied status
- `ParkingTicket.java` - Entry time, vehicle, space, fees
- `Payment.java` - Amount, method, status, timestamp
- `OccupancyReport.java` - Real-time availability by type

---

### **Service Interfaces** (`src/main/java/com/you/lld/problems/parkinglot/api/`)

#### **Parking Service:**
```java
public interface ParkingService {
    // Entry/Exit
    ParkingTicket parkVehicle(Vehicle vehicle, SpaceType preferredType);
    Payment exitVehicle(String ticketId, PaymentMethod method);
    
    // Query
    Optional<ParkingTicket> getTicket(String ticketId);
    OccupancyReport getOccupancy();
    boolean isSpaceAvailable(SpaceType type);
    int getAvailableSpaces(SpaceType type);
}
```

#### **Pricing Strategy (Strategy Pattern):**
```java
public interface PricingStrategy {
    BigDecimal calculateFee(ParkingTicket ticket, LocalDateTime exitTime);
}

// Implementations:
class HourlyPricingStrategy implements PricingStrategy {
    // $5/hour, minimum 1 hour
}

class FlatRatePricingStrategy implements PricingStrategy {
    // $20 for any duration
}

class PeakHourPricingStrategy implements PricingStrategy {
    // $8/hour during peak (9am-6pm), $4/hour off-peak
}
```

#### **Space Allocation (Strategy Pattern):**
```java
public interface SpaceAllocationStrategy {
    Optional<ParkingSpace> findSpace(VehicleType vehicleType, SpaceType preferredType);
}

// Implementations:
class NearestAvailableStrategy implements SpaceAllocationStrategy {
    // Find nearest available space to entrance
}

class FirstAvailableStrategy implements SpaceAllocationStrategy {
    // Find first available space (simple iteration)
}

class TypeOptimizedStrategy implements SpaceAllocationStrategy {
    // Match vehicle type to optimal space type
}
```

#### **Payment Processor:**
```java
public interface PaymentProcessor {
    Payment processPayment(BigDecimal amount, PaymentMethod method);
    Payment refund(String paymentId, BigDecimal amount);
}
```

---

### **Exception Hierarchy** (`src/main/java/com/you/lld/problems/parkinglot/api/exceptions/`)

```java
public class ParkingException extends RuntimeException { }
public class ParkingFullException extends ParkingException { }
public class InvalidTicketException extends ParkingException { }
public class PaymentFailedException extends ParkingException { }
public class InvalidVehicleException extends ParkingException { }
```

---

## 📝 **Usage Examples**

### **Example 1: Basic Parking Flow**

```java
ParkingService parking = new ParkingLotService();

// 1. Vehicle arrives
Vehicle car = new Vehicle("ABC-123", VehicleType.CAR, "John Doe");

try {
    // 2. Park vehicle (get ticket)
    ParkingTicket ticket = parking.parkVehicle(car, SpaceType.STANDARD);
    System.out.println("Parked at space: " + ticket.getSpace().getSpaceNumber());
    System.out.println("Ticket ID: " + ticket.getTicketId());
    
    // ... some time passes ...
    
    // 3. Vehicle exits (process payment)
    Payment payment = parking.exitVehicle(
        ticket.getTicketId(),
        PaymentMethod.CREDIT_CARD
    );
    
    System.out.println("Fee: $" + payment.getAmount());
    System.out.println("Payment status: " + payment.getStatus());
    
} catch (ParkingFullException e) {
    System.err.println("Sorry, parking is full!");
} catch (PaymentFailedException e) {
    System.err.println("Payment failed: " + e.getMessage());
}
```

### **Example 2: Pricing Strategies**

```java
// Hourly pricing ($5/hour)
PricingStrategy hourly = new HourlyPricingStrategy(
    BigDecimal.valueOf(5.00)
);

// Peak hour pricing (dynamic rates)
PricingStrategy peak = new PeakHourPricingStrategy(
    BigDecimal.valueOf(8.00),  // peak rate
    BigDecimal.valueOf(4.00),  // off-peak rate
    LocalTime.of(9, 0),        // peak start
    LocalTime.of(18, 0)        // peak end
);

// Flat rate ($20 for any duration)
PricingStrategy flatRate = new FlatRatePricingStrategy(
    BigDecimal.valueOf(20.00)
);

// Create parking service with chosen strategy
ParkingService parking = new ParkingLotService(
    spaces,
    peak,  // use peak hour pricing
    new NearestAvailableStrategy(),
    new SimplePaymentProcessor()
);
```

### **Example 3: Real-Time Occupancy**

```java
// Check availability before arriving
if (parking.isSpaceAvailable(SpaceType.STANDARD)) {
    System.out.println("Spaces available!");
} else {
    System.out.println("Lot is full, try later");
}

// Get detailed occupancy report
OccupancyReport report = parking.getOccupancy();

System.out.println("Total spaces: " + report.getTotalSpaces());
System.out.println("Occupied: " + report.getOccupiedSpaces());
System.out.println("Available: " + report.getAvailableSpaces());

// By type
Map<SpaceType, Integer> available = report.getAvailableByType();
System.out.println("Standard spaces: " + available.get(SpaceType.STANDARD));
System.out.println("EV charging: " + available.get(SpaceType.EV_CHARGING));
```

### **Example 4: Space Allocation Strategies**

```java
// Strategy 1: Nearest to entrance
SpaceAllocationStrategy nearest = new NearestAvailableStrategy();

// Strategy 2: Type-optimized (match vehicle to space)
SpaceAllocationStrategy optimized = new TypeOptimizedStrategy();

// Strategy 3: First available (simple)
SpaceAllocationStrategy firstAvail = new FirstAvailableStrategy();

// Use with parking service
ParkingService parking = new ParkingLotService(
    spaces,
    pricingStrategy,
    optimized,  // use type-optimized allocation
    paymentProcessor
);
```

---

## 🎯 **Design Patterns Used**

| Pattern | Where Used | Purpose |
|---------|------------|---------|
| **Strategy** | Pricing, Space Allocation | Pluggable algorithms |
| **Factory** | Ticket/Payment creation | Object creation |
| **Value Object** | Vehicle, Payment | Immutable data |
| **Service Layer** | ParkingService | Business logic |
| **Exception Hierarchy** | Custom exceptions | Error handling |

---

## 💰 **Pricing Calculation Examples**

### **Hourly Pricing:**
```
Entry: 10:00 AM
Exit:  1:30 PM
Duration: 3.5 hours
Rate: $5/hour
Fee: 4 hours × $5 = $20 (rounded up)
```

### **Peak Hour Pricing:**
```
Entry: 8:00 AM
Exit:  7:00 PM
Duration: 11 hours

Peak (9am-6pm): 9 hours × $8 = $72
Off-peak: 2 hours × $4 = $8
Total: $80
```

### **Flat Rate:**
```
Any duration: $20
```

---

## 🏗️ **System Architecture**

### **Class Diagram:**
```
ParkingService
    ├── PricingStrategy
    │   ├── HourlyPricingStrategy
    │   ├── FlatRatePricingStrategy
    │   └── PeakHourPricingStrategy
    ├── SpaceAllocationStrategy
    │   ├── NearestAvailableStrategy
    │   ├── FirstAvailableStrategy
    │   └── TypeOptimizedStrategy
    └── PaymentProcessor
```

### **Sequence Diagram: Park Vehicle**
```
User → ParkingService: parkVehicle(vehicle)
ParkingService → SpaceAllocationStrategy: findSpace(vehicleType)
SpaceAllocationStrategy → ParkingService: parkingSpace
ParkingService → ParkingSpace: markOccupied()
ParkingService → ParkingTicket: create()
ParkingService → User: ticket
```

---

## 📊 **Performance Characteristics**

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| **Park Vehicle** | O(N) | N = number of spaces |
| **Exit Vehicle** | O(1) | Ticket lookup in HashMap |
| **Get Occupancy** | O(N) | Iterate all spaces |
| **Check Availability** | O(N) | Linear search |

**Optimization:** Use separate availability trackers by type for O(1) availability checks.

---

## 🚨 **Error Scenarios**

### **1. Parking Full:**
```java
try {
    ticket = parking.parkVehicle(vehicle, SpaceType.STANDARD);
} catch (ParkingFullException e) {
    // Redirect to nearby lots
    // Or add to waitlist
}
```

### **2. Invalid Ticket:**
```java
try {
    payment = parking.exitVehicle("INVALID-TICKET", PaymentMethod.CASH);
} catch (InvalidTicketException e) {
    // Request customer service
}
```

### **3. Payment Failed:**
```java
try {
    payment = parking.exitVehicle(ticketId, PaymentMethod.CREDIT_CARD);
} catch (PaymentFailedException e) {
    // Try alternative payment method
    payment = parking.exitVehicle(ticketId, PaymentMethod.CASH);
}
```

---

## 🧪 **Testing**

### **Test Coverage:**
- Unit tests for pricing strategies
- Unit tests for allocation strategies
- Integration tests for full parking flow
- Edge cases: full lot, invalid tickets, payment failures

---

## 🔗 **Related Resources**

- [System Architecture](problems/parkinglot/README.md)
- [UML Diagrams](problems/parkinglot/diagrams/)
- [Weekend 1: Parking Lot Project](week1/weekend/README.md)
- [Strategy Pattern](week2/day8/README.md)

---

## 📦 **Quick Start**

```bash
# Run tests
mvn test -Dtest="ParkingServiceTest"

# View implementation
# All code is in: src/main/java/com/you/lld/problems/parkinglot/
```

---

**Source Code**: View complete implementations in your IDE:
- **Models**: `src/main/java/com/you/lld/problems/parkinglot/model/`
- **Services**: `src/main/java/com/you/lld/problems/parkinglot/api/`
- **Strategies**: `src/main/java/com/you/lld/problems/parkinglot/strategies/`
- **Tests**: `src/test/java/com/you/lld/problems/parkinglot/`

---

✨ **Complete parking lot system with flexible pricing and allocation strategies!** 🅿️


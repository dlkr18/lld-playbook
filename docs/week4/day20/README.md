# Day 20: Mock Interviews — LLD Mastery

**Focus**: Practice whiteboard and coding-focused LLD interviews with realistic scenarios.

---

## **Interview Format**

### **Typical Structure (45-60 min)**
1. **Clarification** (5-10 min): Gather requirements
2. **High-Level Design** (10-15 min): Core entities and relationships
3. **API Design** (10 min): Define interfaces and contracts
4. **Deep Dive** (15-20 min): Implement key components
5. **Discussion** (5-10 min): Trade-offs, scalability, extensions

---

## **Interview Checklist**

### **Before You Start:**
- [] Clarify functional requirements
- [] Ask about non-functional requirements (scale, latency)
- [] Identify core use cases
- [] Ask about constraints and limitations

### **During Design:**
- [] Think aloud — explain your reasoning
- [] Start with entities and relationships
- [] Define clean API contracts
- [] Consider edge cases
- [] Discuss trade-offs

### **Implementation:**
- [] Start with core classes
- [] Use meaningful names
- [] Apply SOLID principles
- [] Handle errors gracefully
- [] Write testable code

---

## **Mock Interview #1: Parking Lot System**

### **Requirements Gathering**

**Ask:**
- How many floors and spots per floor?
- What vehicle types? (Motorcycle, Car, Truck)
- Multiple entrances/exits?
- Payment methods?
- Hourly vs flat rate pricing?

**NFRs:**
- Entry/exit time < 100ms
- Handle 1000 concurrent vehicles
- 99.9% uptime

### **Core Entities**
```
ParkingLot
├── List<Floor>
├── List<Entrance>
├── List<Exit>
└── PricingStrategy

Floor
├── int floorNumber
├── List<ParkingSpot>
└── Map<SpotType, available count>

ParkingSpot
├── String spotId
├── SpotType type
├── boolean isOccupied
└── Vehicle currentVehicle

Vehicle
├── String licensePlate
├── VehicleType type
└── Ticket ticket

Ticket
├── String ticketId
├── Instant entryTime
├── ParkingSpot spot
├── Vehicle vehicle
└── Money amountPaid
```

### **Key APIs**
```java
interface ParkingLotService {
    Ticket parkVehicle(Vehicle vehicle);
    Money calculateFee(Ticket ticket);
    void processExit(Ticket ticket, Payment payment);
    int getAvailableSpots(VehicleType type);
}
```

### **Key Implementation Points**
- Spot allocation strategy (nearest entrance, floor preference)
- Concurrent spot reservation
- Pricing strategy pattern
- Payment processing

---

## **Mock Interview #2: Elevator System**

### **Requirements Gathering**

**Ask:**
- How many elevators and floors?
- Maximum capacity per elevator?
- Peak hours traffic pattern?
- Maintenance mode support?

### **Core Design**

```
ElevatorSystem
├── List<Elevator>
├── Scheduler
└── RequestQueue

Elevator
├── int currentFloor
├── Direction direction
├── ElevatorState state
├── Set<Integer> destinationFloors
└── int capacity

Request
├── int floor
├── Direction direction
├── Instant requestTime

Scheduler (Interface)
├── FCFS
├── SCAN
└── LOOK
```

### **Scheduling Algorithms**

| Algorithm | Description | Best For |
|-----------|-------------|----------|
| **FCFS** | First come, first served | Low traffic |
| **SCAN** | Move in one direction, then reverse | Balanced |
| **LOOK** | Like SCAN, but only to furthest request | Efficient |
| **Destination Dispatch** | Group by destination | High-rise |

---

## **Mock Interview #3: Rate Limiter**

### **Requirements**
- Support multiple strategies (Token Bucket, Sliding Window)
- Per-user and per-API limits
- Distributed support
- Graceful degradation

### **Quick Design**
```java
interface RateLimiter {
    boolean tryAcquire(String clientId);
    RateLimitInfo getInfo(String clientId);
}

class RateLimitInfo {
    int limit;
    int remaining;
    Instant resetTime;
}
```

### **Discussion Points**
- Algorithm trade-offs
- Distributed consistency
- HTTP response headers
- Burst handling

---

## **Mock Interview #4: URL Shortener**

### **Requirements**
- Shorten URLs
- Redirect to original
- Analytics (click count, location)
- Custom aliases (optional)
- Expiration (optional)

### **Key Decisions**
- ID generation (Base62 encoding)
- Storage (key-value store)
- Caching strategy
- Collision handling

### **API Design**
```java
interface UrlShortenerService {
    ShortenedUrl shorten(String originalUrl, ShortenOptions options);
    String resolve(String shortCode);
    UrlStats getStats(String shortCode);
}
```

---

## **Mock Interview #5: Library Management**

### **Entities**
- Book, Member, Librarian
- BookCopy, Reservation, Fine
- Catalog, Search

### **Key Features**
- Search by title, author, ISBN
- Reserve books
- Checkout/return with due dates
- Fine calculation
- Multiple copies of same book

---

## **Interview Tips**

### **Communication**
1. **Think aloud**: Explain your reasoning
2. **Ask questions**: Clarify before designing
3. **Be structured**: Follow a consistent approach
4. **Accept feedback**: Incorporate suggestions

### **Common Mistakes**
- Jumping to implementation too fast
- Not clarifying requirements
- Over-engineering simple problems
- Ignoring edge cases
- Not explaining trade-offs

### **What Interviewers Look For**
- Structured thinking
- Clean API design
- SOLID principles application
- Trade-off awareness
- Code quality

---

## **Self-Assessment Rubric**

| Criteria | Excellent | Good | Needs Work |
|----------|-----------|------|------------|
| **Requirements** | Thorough clarification | Most covered | Missed key points |
| **Design** | Clean, extensible | Solid basics | Missing abstractions |
| **APIs** | Clear contracts | Functional | Unclear responsibilities |
| **Code** | Production-ready | Works correctly | Has issues |
| **Trade-offs** | Deep analysis | Aware of some | Not discussed |

---

## **Practice Problems**

### **Easy (15-20 min each)**
1. TicTacToe
2. Stack with getMin()
3. LRU Cache

### **Medium (30-40 min each)**
1. Parking Lot
2. Library Management
3. ATM Machine
4. Vending Machine

### **Hard (45-60 min each)**
1. Elevator System
2. Chess Game
3. Hotel Booking System
4. Splitwise

---

## **Further Reading**

- "Design Patterns" by Gang of Four
- "Clean Code" by Robert C. Martin
- "Head First Design Patterns"
- "Grokking the Object-Oriented Design Interview"

---

**Congratulations!** You've completed the 4-week LLD curriculum!

**Final Step**: [Weekend Capstone Project](week4/weekend/README.md) →

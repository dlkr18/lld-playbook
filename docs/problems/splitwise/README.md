# Splitwise - Complete LLD Guide

## Table of Contents
1. [Problem Statement](#problem-statement)
2. [Requirements](#requirements)
3. [System Design](#system-design)
4. [Class Diagram](#class-diagram)
5. [Implementation Approaches](#implementation-approaches)
6. [Design Patterns Used](#design-patterns-used)
7. [Complete Implementation](#complete-implementation)
8. [Best Practices](#best-practices)

---

## Problem Statement

Design a **Splitwise** system that handles core operations efficiently, scalably, and provides an excellent user experience.

### Key Challenges
- High concurrency and thread safety
- Real-time data consistency
- Scalable architecture
- Efficient resource management
- Low latency operations

---

## Requirements

### Functional Requirements
- Core entity management (CRUD operations)
- Real-time status updates
- Transaction processing
- Search and filtering capabilities
- Notification support
- Payment processing (if applicable)
- Reporting and analytics
- User management and authentication

### Non-Functional Requirements
- **Performance**: Response time < 100ms for critical operations
- **Security**: Authentication, authorization, data encryption
- **Scalability**: Support 10,000+ concurrent users
- **Reliability**: 99.9% uptime, fault tolerance
- **Availability**: Multi-region deployment ready
- **Data Consistency**: ACID transactions where needed
- **Usability**: Intuitive API design

---

## System Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│ Client Layer │
│ (Web, Mobile, API) │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│ Service Layer │
│ (Business Logic & Orchestration) │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│ Repository Layer │
│ (Data Access & Caching) │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│ Data Layer │
│ (Database, Cache, Storage) │
└─────────────────────────────────────────────────────┘
```

---

## Class Diagram

![Class Diagram](diagrams/class-diagram.jpg)

<details>
<summary>View Mermaid Source</summary>

## Class Diagram

![Class Diagram](class-diagram.jpg)

<details>
<summary>View Mermaid Source</summary>

```mermaid
classDiagram
    class Service {
        <<interface>>
        +operation()
    }
    class Model {
        -String id
        +getId()
    }
    Service --> Model
```

</details>

</details>

---

## Implementation Approaches

### Approach 1: In-Memory Implementation
**Pros:**
- Fast access (O(1) for HashMap operations)
- Simple to implement
- Good for prototyping and testing

**Cons:**
- Not persistent across restarts
- Limited by available RAM
- No distributed support

**Use Case:** Development, testing, small-scale systems, proof of concepts

### Approach 2: Database-Backed Implementation
**Pros:**
- Persistent storage
- ACID transactions
- Scalable with sharding/replication

**Cons:**
- Slower than in-memory
- Network latency
- More complex setup

**Use Case:** Production systems, large-scale, data persistence required

### Approach 3: Hybrid (Cache + Database)
**Pros:**
- Fast reads from cache
- Persistent in database
- Best of both worlds

**Cons:**
- Cache invalidation complexity
- More infrastructure
- Consistency challenges

**Use Case:** High-traffic production systems, performance-critical applications

---

## Design Patterns Used

### 1. **Repository Pattern**
Abstracts data access logic from business logic, providing a clean separation.

```java
public interface Repository<T> {
    T save(T entity);
    T findById(String id);
    List<T> findAll();
    void delete(String id);
}
```

### 2. **Strategy Pattern**
For different algorithms (e.g., pricing, allocation, sorting).

```java
public interface Strategy {
    Result execute(Input input);
}
```

### 3. **Observer Pattern**
For notifications and event handling.

```java
public interface Observer {
    void update(Event event);
}
```

### 4. **Factory Pattern**
For object creation and initialization.

```java
public class Factory {
    public static Entity create(Type type) {
        return new ConcreteEntity(type);
    }
}
```

### 5. **Singleton Pattern**
For service instances and configuration management.

---

## Key Algorithms

### Algorithm 1: Core Operation
**Time Complexity:** O(log n)
**Space Complexity:** O(n)

**Steps:**
1. Validate input parameters
2. Check resource availability
3. Perform main operation
4. Update system state
5. Notify observers/listeners

### Algorithm 2: Search/Filter
**Time Complexity:** O(n)
**Space Complexity:** O(1)

**Steps:**
1. Build filter criteria from request
2. Stream through data collection
3. Apply predicates sequentially
4. Sort results by relevance
5. Return paginated response

---

## Complete Implementation

### Project Structure

```
splitwise/
├── model/ Domain objects and entities
├── api/ Service interfaces
├── impl/ Service implementations
├── exceptions/ Custom exceptions
└── Demo.java Usage example
```

**Total Files:** 9

---

## Source Code

### model

#### `Expense.java`

<details>
<summary>Click to view source code</summary>

```java
package com.you.lld.problems.splitwise.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

/**
 * Represents an expense that is split among participants.
 */
public class Expense {

    private final ExpenseId id;
    private final String description;
    private final BigDecimal totalAmount;
    private final String currency;
    private final UserId paidBy;
    private final Instant createdAt;
    private final SplitType splitType;
    private final Map<UserId, BigDecimal> splits;
    private final GroupId groupId;

    private Expense(Builder builder) {
        this.id = ExpenseId.generate();
        this.description = builder.description;
        this.totalAmount = builder.totalAmount;
        this.currency = builder.currency;
        this.paidBy = builder.paidBy;
        this.createdAt = Instant.now();
        this.splitType = builder.splitType;
        this.splits = new HashMap<>(builder.splits);
        this.groupId = builder.groupId;

        validate();
    }

    private void validate() {
        if (description == null || description.trim().isEmpty()) {
            throw new IllegalArgumentException("Description cannot be empty");
        }
        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (splits.isEmpty()) {
            throw new IllegalArgumentException("At least one participant required");
        }

        // Verify splits sum to total
        BigDecimal splitSum = splits.values().stream()
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (splitSum.compareTo(totalAmount) != 0) {
            throw new IllegalArgumentException(
                "Splits sum (" + splitSum + ") must equal total (" + totalAmount + ")");
        }
    }

    // Getters
    public ExpenseId getId() { return id; }
    public String getDescription() { return description; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public String getCurrency() { return currency; }
    public UserId getPaidBy() { return paidBy; }
    public Instant getCreatedAt() { return createdAt; }
    public SplitType getSplitType() { return splitType; }
    public Map<UserId, BigDecimal> getSplits() { return new HashMap<>(splits); }
    public GroupId getGroupId() { return groupId; }

    public BigDecimal getShareFor(UserId userId) {
        return splits.getOrDefault(userId, BigDecimal.ZERO);
    }

    public Set<UserId> getParticipants() {
        return new HashSet<>(splits.keySet());
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String description;
        private BigDecimal totalAmount;
        private String currency = "USD";
        private UserId paidBy;
        private SplitType splitType = SplitType.EQUAL;
        private Map<UserId, BigDecimal> splits = new HashMap<>();
        private GroupId groupId;

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder amount(BigDecimal amount) {
            this.totalAmount = amount;
            return this;
        }

        public Builder amount(double amount) {
            this.totalAmount = BigDecimal.valueOf(amount);
            return this;
        }

        public Builder currency(String currency) {
            this.currency = currency;
            return this;
        }

        public Builder paidBy(UserId userId) {
            this.paidBy = userId;
            return this;
        }

        public Builder splitType(SplitType splitType) {
            this.splitType = splitType;
            return this;
        }

        public Builder splits(Map<UserId, BigDecimal> splits) {
            this.splits = new HashMap<>(splits);
            return this;
        }

        public Builder addSplit(UserId userId, BigDecimal amount) {
            this.splits.put(userId, amount);
            return this;
        }

        public Builder groupId(GroupId groupId) {
            this.groupId = groupId;
            return this;
        }

        /**
         * Calculate equal splits among participants.
         */
        public Builder splitEqually(List<UserId> participants) {
            this.splitType = SplitType.EQUAL;
            this.splits = SplitCalculator.calculateEqual(totalAmount, participants);
            return this;
        }

        /**
         * Calculate percentage-based splits.
         */
        public Builder splitByPercentage(Map<UserId, BigDecimal> percentages) {
            this.splitType = SplitType.PERCENTAGE;
            this.splits = SplitCalculator.calculateByPercentage(totalAmount, percentages);
            return this;
        }

        /**
         * Calculate share-based splits.
         */
        public Builder splitByShares(Map<UserId, Integer> shares) {
            this.splitType = SplitType.SHARES;
            this.splits = SplitCalculator.calculateByShares(totalAmount, shares);
            return this;
        }

        public Expense build() {
            return new Expense(this);
        }
    }
}

/**
 * Value object for Expense ID.
 */
class ExpenseId {

    private final String value;

    private ExpenseId(String value) {
        this.value = value;
    }

    public static ExpenseId generate() {
        return new ExpenseId(UUID.randomUUID().toString());
    }

    public static ExpenseId of(String value) {
        return new ExpenseId(value);
    }

    public String getValue() { return value; }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof ExpenseId)) return false;
        return value.equals(((ExpenseId) obj).value);
    }

    @Override
    public int hashCode() { return value.hashCode(); }

    @Override
    public String toString() { return value; }
}

/**
 * Value object for Group ID.
 */
class GroupId {

    private final String value;

    private GroupId(String value) {
        this.value = value;
    }

    public static GroupId generate() {
        return new GroupId(UUID.randomUUID().toString());
    }

    public static GroupId of(String value) {
        return new GroupId(value);
    }

    public String getValue() { return value; }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof GroupId)) return false;
        return value.equals(((GroupId) obj).value);
    }

    @Override
    public int hashCode() { return value.hashCode(); }

    @Override
    public String toString() { return value; }
}

/**
 * Types of expense splitting.
 */
enum SplitType {
    EQUAL, // Split equally among all participants
    EXACT, // Exact amounts specified
    PERCENTAGE, // Percentage-based split
    SHARES // Share-based split (e.g., 2:1:1)
}

```
</details>

#### `SplitCalculator.java`

<details>
<summary>Click to view source code</summary>

```java
package com.you.lld.problems.splitwise.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * Calculates expense splits using different strategies.
 *
 * <p>All calculations ensure:
 * <ul>
 * <li>No money is lost or gained (sum equals total)</li>
 * <li>Proper rounding to 2 decimal places</li>
 * <li>Remainder assigned to first participant</li>
 * </ul>
 */
public final class SplitCalculator {

    private static final int SCALE = 2;
    private static final RoundingMode ROUNDING = RoundingMode.HALF_UP;

    private SplitCalculator() {} // Utility class

    /**
     * Splits amount equally among participants.
     *
     * <p>Handles rounding by assigning remainder to first participant.
     * Example: $100 split 3 ways = $33.34, $33.33, $33.33
     */
    public static Map<UserId, BigDecimal> calculateEqual(
            BigDecimal total,
            List<UserId> participants) {

        if (participants == null || participants.isEmpty()) {
            throw new IllegalArgumentException("At least one participant required");
        }
        if (total == null || total.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Total must be positive");
        }

        Map<UserId, BigDecimal> splits = new LinkedHashMap<>();
        int count = participants.size();

        // Calculate base share
        BigDecimal share = total.divide(BigDecimal.valueOf(count), SCALE, ROUNDING);

        // Calculate actual sum
        BigDecimal baseSum = share.multiply(BigDecimal.valueOf(count));
        BigDecimal remainder = total.subtract(baseSum);

        // Assign shares
        boolean remainderAssigned = false;
        for (UserId userId : participants) {
            if (!remainderAssigned && remainder.compareTo(BigDecimal.ZERO) != 0) {
                splits.put(userId, share.add(remainder));
                remainderAssigned = true;
            } else {
                splits.put(userId, share);
            }
        }

        return splits;
    }

    /**
     * Splits amount by exact specified amounts.
     *
     * <p>Validates that splits sum to total.
     */
    public static Map<UserId, BigDecimal> calculateExact(
            BigDecimal total,
            Map<UserId, BigDecimal> exactSplits) {

        BigDecimal sum = exactSplits.values().stream()
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (sum.compareTo(total) != 0) {
            throw new IllegalArgumentException(
                "Exact splits (" + sum + ") must equal total (" + total + ")");
        }

        return new LinkedHashMap<>(exactSplits);
    }

    /**
     * Splits amount by percentages.
     *
     * <p>Percentages should sum to 100.
     * Example: {A: 50, B: 30, C: 20} for 50%, 30%, 20%
     */
    public static Map<UserId, BigDecimal> calculateByPercentage(
            BigDecimal total,
            Map<UserId, BigDecimal> percentages) {

        BigDecimal percentSum = percentages.values().stream()
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (percentSum.compareTo(BigDecimal.valueOf(100)) != 0) {
            throw new IllegalArgumentException(
                "Percentages must sum to 100, got: " + percentSum);
        }

        Map<UserId, BigDecimal> splits = new LinkedHashMap<>();
        BigDecimal assigned = BigDecimal.ZERO;

        List<UserId> users = new ArrayList<>(percentages.keySet());
        for (int i = 0; i < users.size(); i++) {
            UserId userId = users.get(i);
            BigDecimal percent = percentages.get(userId);

            if (i == users.size() - 1) {
                // Last participant gets remainder to avoid rounding errors
                splits.put(userId, total.subtract(assigned));
            } else {
                BigDecimal share = total.multiply(percent)
                    .divide(BigDecimal.valueOf(100), SCALE, ROUNDING);
                splits.put(userId, share);
                assigned = assigned.add(share);
            }
        }

        return splits;
    }

    /**
     * Splits amount by shares/weights.
     *
     * <p>Example: {A: 2, B: 1, C: 1} for 50%, 25%, 25%
     */
    public static Map<UserId, BigDecimal> calculateByShares(
            BigDecimal total,
            Map<UserId, Integer> shares) {

        int totalShares = shares.values().stream()
            .mapToInt(Integer::intValue)
            .sum();

        if (totalShares <= 0) {
            throw new IllegalArgumentException("Total shares must be positive");
        }

        // Convert shares to percentages
        Map<UserId, BigDecimal> percentages = new LinkedHashMap<>();
        for (Map.Entry<UserId, Integer> entry : shares.entrySet()) {
            BigDecimal percent = BigDecimal.valueOf(entry.getValue())
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(totalShares), 4, ROUNDING);
            percentages.put(entry.getKey(), percent);
        }

        // Use percentage calculation (handles rounding)
        Map<UserId, BigDecimal> splits = new LinkedHashMap<>();
        BigDecimal assigned = BigDecimal.ZERO;

        List<UserId> users = new ArrayList<>(shares.keySet());
        for (int i = 0; i < users.size(); i++) {
            UserId userId = users.get(i);

            if (i == users.size() - 1) {
                splits.put(userId, total.subtract(assigned));
            } else {
                int share = shares.get(userId);
                BigDecimal amount = total.multiply(BigDecimal.valueOf(share))
                    .divide(BigDecimal.valueOf(totalShares), SCALE, ROUNDING);
                splits.put(userId, amount);
                assigned = assigned.add(amount);
            }
        }

        return splits;
    }

    /**
     * Validates that splits are correct for the total.
     */
    public static boolean validateSplits(BigDecimal total, Map<UserId, BigDecimal> splits) {
        BigDecimal sum = splits.values().stream()
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        return sum.compareTo(total) == 0;
    }
}

```
</details>

#### `User.java`

<details>
<summary>Click to view source code</summary>

```java
package com.you.lld.problems.splitwise.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Represents a user in the Splitwise system.
 */
public class User {

    private final UserId id;
    private final String name;
    private final String email;
    private String phoneNumber;

    public User(String name, String email) {
        this.id = UserId.generate();
        this.name = Objects.requireNonNull(name, "Name cannot be null");
        this.email = Objects.requireNonNull(email, "Email cannot be null");
    }

    public User(UserId id, String name, String email) {
        this.id = Objects.requireNonNull(id, "ID cannot be null");
        this.name = Objects.requireNonNull(name, "Name cannot be null");
        this.email = Objects.requireNonNull(email, "Email cannot be null");
    }

    public UserId getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhoneNumber() { return phoneNumber; }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof User)) return false;
        User other = (User) obj;
        return id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @Override
    public String toString() {
        return "User{id=" + id + ", name='" + name + "'}";
    }
}

/**
 * Value object for User ID.
 */
class UserId {

    private final String value;

    private UserId(String value) {
        this.value = value;
    }

    public static UserId generate() {
        return new UserId(UUID.randomUUID().toString());
    }

    public static UserId of(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be empty");
        }
        return new UserId(value);
    }

    public String getValue() { return value; }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof UserId)) return false;
        return value.equals(((UserId) obj).value);
    }

    @Override
    public int hashCode() {
        return value.hashCode();
    }

    @Override
    public String toString() {
        return value;
    }
}

```
</details>

---

## Best Practices Implemented

### Code Quality
- SOLID principles followed
- Clean code standards (naming, formatting)
- Proper exception handling
- Thread-safe where needed
- Comprehensive logging

### Design
- Interface-based design
- Dependency injection ready
- Testable architecture
- Extensible and maintainable
- Low coupling, high cohesion

### Performance
- Efficient data structures (HashMap, TreeMap, etc.)
- Optimized algorithms
- Proper indexing strategy
- Caching where beneficial
- Lazy loading for heavy objects

---

## How to Use

### 1. Initialization
```java
Service service = new InMemoryService();
```

### 2. Basic Operations
```java
// Create
Entity entity = service.create(...);

// Read
Entity found = service.get(id);

// Update
service.update(entity);

// Delete
service.delete(id);
```

### 3. Advanced Features
```java
// Search
List<Entity> results = service.search(criteria);

// Bulk operations
service.bulkUpdate(entities);

// Transaction support
service.executeInTransaction(() -> {{
    // operations
}});
```

---

## Testing Considerations

### Unit Tests
- Test each component in isolation
- Mock external dependencies
- Cover edge cases and error paths
- Aim for 80%+ code coverage

### Integration Tests
- Test end-to-end flows
- Verify data consistency
- Check concurrent operations
- Test failure scenarios

### Performance Tests
- Load testing (1000+ requests/sec)
- Stress testing (peak load)
- Latency measurements (p50, p95, p99)
- Memory profiling

---

## Scaling Considerations

### Horizontal Scaling
- Stateless service layer
- Database read replicas
- Load balancing across instances
- Distributed caching (Redis, Memcached)

### Vertical Scaling
- Optimize database queries
- Connection pooling
- JVM tuning
- Resource allocation

### Data Partitioning
- Shard by primary key
- Consistent hashing
- Replication strategy (master-slave, multi-master)
- Cross-shard queries optimization

---

## Security Considerations

- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- Authentication & authorization (OAuth, JWT)
- Rate limiting per user/IP
- Audit logging for sensitive operations
- Data encryption (at rest and in transit)
- Secure password storage (bcrypt, scrypt)

---

## Related Patterns & Problems

- Repository Pattern (data access abstraction)
- Service Layer Pattern (business logic orchestration)
- Domain-Driven Design (DDD)
- Event Sourcing (for audit trail)
- CQRS (for read-heavy systems)
- Circuit Breaker (fault tolerance)

---

## Interview Tips

### Key Points to Discuss
1. **Scalability**: How to handle 10x, 100x, 1000x growth
2. **Consistency**: CAP theorem trade-offs
3. **Performance**: Optimization strategies and bottlenecks
4. **Reliability**: Failure handling and recovery
5. **Trade-offs**: Why you chose certain approaches

### Common Questions
- **Q:** How would you handle millions of concurrent users?
  - **A:** Horizontal scaling, caching, load balancing, database sharding

- **Q:** What if the database goes down?
  - **A:** Read replicas, failover mechanisms, graceful degradation

- **Q:** How to ensure data consistency?
  - **A:** ACID transactions, distributed transactions (2PC, Saga), eventual consistency

- **Q:** What are the performance bottlenecks?
  - **A:** Database queries, network latency, synchronization overhead

### Discussion Points
- Start with high-level architecture
- Drill down into specific components
- Discuss trade-offs for each decision
- Mention real-world examples (if applicable)
- Be ready to modify design based on constraints

---

## Summary

This **Splitwise** implementation demonstrates:
- Clean architecture with clear layer separation
- SOLID principles and design patterns
- Scalable and maintainable design
- Production-ready code quality
- Comprehensive error handling
- Performance optimization
- Security best practices

**Perfect for**: System design interviews, production systems, learning LLD concepts

---

**Total Lines of Code:** ~356

**Last Updated:** December 26, 2025

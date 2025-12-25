# Day 4: Value Objects & Domain Types 💎

**Focus**: Master the distinction between entities and value objects, and learn to create robust domain types for money, time, and identifiers.

---

## 🎯 **Learning Objectives**

By the end of Day 4, you will:
- **Distinguish** between entities and value objects
- **Implement** immutable value objects in Java
- **Create** robust domain types (Money, Time, ID)
- **Apply** domain primitives to eliminate primitive obsession
- **Design** type-safe APIs using value objects

---

## 📚 **Entities vs Value Objects**

### **Entities**
Objects with a unique **identity** that persists over time.

**Characteristics:**
- Have a unique identifier (ID)
- Identity persists across state changes
- Two entities with same attributes are NOT equal (different IDs)
- Typically mutable
- Lifecycle management required

**Examples:**
- `User` (identified by userId)
- `Order` (identified by orderId)
- `Product` (identified by SKU)
- `BankAccount` (identified by accountNumber)

```java
// Entity - identity matters
public class User {
    private final UserId id;        // Identity
    private String name;            // Can change
    private Email email;            // Can change
    private Instant createdAt;      // Lifecycle
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof User)) return false;
        User other = (User) obj;
        return id.equals(other.id);  // Equality by ID only
    }
}
```

### **Value Objects**
Objects defined by their **attributes**, with no conceptual identity.

**Characteristics:**
- No unique identifier
- Defined entirely by their values
- Two value objects with same attributes ARE equal
- **Always immutable**
- Interchangeable when equal

**Examples:**
- `Money` (amount + currency)
- `Address` (street, city, zip)
- `DateRange` (start, end)
- `Coordinates` (latitude, longitude)

```java
// Value Object - values matter, immutable
public final class Money {
    private final BigDecimal amount;
    private final Currency currency;
    
    public Money(BigDecimal amount, Currency currency) {
        this.amount = amount;
        this.currency = currency;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Money)) return false;
        Money other = (Money) obj;
        return amount.equals(other.amount) && 
               currency.equals(other.currency);  // Equality by all values
    }
}
```

---

## 🔒 **Immutability Rules**

### **Why Immutability?**
1. **Thread Safety**: No synchronization needed
2. **Predictability**: Object state never changes unexpectedly
3. **Cacheability**: Safe to cache and share
4. **Hashability**: Safe to use in hash-based collections
5. **Simplicity**: Easier to reason about

### **How to Make Classes Immutable:**

```java
public final class ImmutableExample {           // 1. Make class final
    private final String name;                   // 2. Make all fields final
    private final List<String> items;            // 3. No setters
    
    public ImmutableExample(String name, List<String> items) {
        this.name = name;
        this.items = new ArrayList<>(items);     // 4. Defensive copy in constructor
    }
    
    public String getName() {
        return name;                             // 5. Return immutable or copy
    }
    
    public List<String> getItems() {
        return new ArrayList<>(items);           // 6. Defensive copy on return
    }
    
    // 7. Return new instance for "modifications"
    public ImmutableExample withName(String newName) {
        return new ImmutableExample(newName, this.items);
    }
}
```

---

## 💰 **Domain Type: Money**

Never use `double` or `float` for money! Use `BigDecimal` with proper rounding.

```java
public final class Money implements Comparable<Money> {
    
    public static final Money ZERO = Money.of(BigDecimal.ZERO, Currency.USD);
    
    private final BigDecimal amount;
    private final Currency currency;
    
    private Money(BigDecimal amount, Currency currency) {
        if (amount == null) {
            throw new IllegalArgumentException("Amount cannot be null");
        }
        if (currency == null) {
            throw new IllegalArgumentException("Currency cannot be null");
        }
        this.amount = amount.setScale(currency.getDefaultFractionDigits(), RoundingMode.HALF_UP);
        this.currency = currency;
    }
    
    // Factory methods
    public static Money of(BigDecimal amount, Currency currency) {
        return new Money(amount, currency);
    }
    
    public static Money dollars(double amount) {
        return new Money(BigDecimal.valueOf(amount), Currency.USD);
    }
    
    public static Money cents(long cents) {
        return new Money(BigDecimal.valueOf(cents).divide(BigDecimal.valueOf(100)), Currency.USD);
    }
    
    // Operations - return NEW instances
    public Money add(Money other) {
        requireSameCurrency(other);
        return new Money(this.amount.add(other.amount), this.currency);
    }
    
    public Money subtract(Money other) {
        requireSameCurrency(other);
        BigDecimal result = this.amount.subtract(other.amount);
        if (result.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Result cannot be negative");
        }
        return new Money(result, this.currency);
    }
    
    public Money multiply(int factor) {
        return new Money(this.amount.multiply(BigDecimal.valueOf(factor)), this.currency);
    }
    
    public Money percentage(BigDecimal percent) {
        BigDecimal factor = percent.divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP);
        return new Money(this.amount.multiply(factor), this.currency);
    }
    
    // Comparisons
    public boolean isGreaterThan(Money other) {
        requireSameCurrency(other);
        return this.amount.compareTo(other.amount) > 0;
    }
    
    public boolean isZero() {
        return this.amount.compareTo(BigDecimal.ZERO) == 0;
    }
    
    public boolean isNegative() {
        return this.amount.compareTo(BigDecimal.ZERO) < 0;
    }
    
    private void requireSameCurrency(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException(
                "Cannot operate on different currencies: " + 
                this.currency + " vs " + other.currency
            );
        }
    }
    
    // Standard methods
    @Override
    public int compareTo(Money other) {
        requireSameCurrency(other);
        return this.amount.compareTo(other.amount);
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Money)) return false;
        Money money = (Money) obj;
        return amount.compareTo(money.amount) == 0 && 
               currency.equals(money.currency);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(amount.stripTrailingZeros(), currency);
    }
    
    @Override
    public String toString() {
        return currency.getSymbol() + amount.toString();
    }
}
```

---

## ⏰ **Domain Type: TimeRange**

```java
public final class TimeRange {
    
    private final Instant start;
    private final Instant end;
    
    private TimeRange(Instant start, Instant end) {
        if (start == null || end == null) {
            throw new IllegalArgumentException("Start and end cannot be null");
        }
        if (end.isBefore(start)) {
            throw new IllegalArgumentException("End cannot be before start");
        }
        this.start = start;
        this.end = end;
    }
    
    public static TimeRange of(Instant start, Instant end) {
        return new TimeRange(start, end);
    }
    
    public static TimeRange ofDuration(Instant start, Duration duration) {
        return new TimeRange(start, start.plus(duration));
    }
    
    public boolean contains(Instant instant) {
        return !instant.isBefore(start) && !instant.isAfter(end);
    }
    
    public boolean overlaps(TimeRange other) {
        return !this.end.isBefore(other.start) && !this.start.isAfter(other.end);
    }
    
    public Duration getDuration() {
        return Duration.between(start, end);
    }
    
    public TimeRange extend(Duration duration) {
        return new TimeRange(this.start, this.end.plus(duration));
    }
    
    public Instant getStart() { return start; }
    public Instant getEnd() { return end; }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof TimeRange)) return false;
        TimeRange other = (TimeRange) obj;
        return start.equals(other.start) && end.equals(other.end);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(start, end);
    }
}
```

---

## 🔑 **Domain Type: Typed Identifiers**

Avoid using raw `String` or `Long` for IDs. Create typed wrappers.

```java
// Base class for all IDs
public abstract class Identifier<T> {
    
    protected final T value;
    
    protected Identifier(T value) {
        if (value == null) {
            throw new IllegalArgumentException("ID value cannot be null");
        }
        this.value = value;
    }
    
    public T getValue() {
        return value;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Identifier<?> that = (Identifier<?>) obj;
        return value.equals(that.value);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
    
    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" + value + ")";
    }
}

// Specific ID types
public final class UserId extends Identifier<String> {
    
    private UserId(String value) {
        super(value);
    }
    
    public static UserId of(String value) {
        return new UserId(value);
    }
    
    public static UserId generate() {
        return new UserId(UUID.randomUUID().toString());
    }
}

public final class OrderId extends Identifier<String> {
    
    private static final String PREFIX = "ORD-";
    
    private OrderId(String value) {
        super(value);
        if (!value.startsWith(PREFIX)) {
            throw new IllegalArgumentException("OrderId must start with " + PREFIX);
        }
    }
    
    public static OrderId of(String value) {
        return new OrderId(value);
    }
    
    public static OrderId generate() {
        return new OrderId(PREFIX + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
    }
}
```

### **Benefits of Typed IDs:**

```java
// BAD: Can easily mix up IDs
void processOrder(String orderId, String userId, String productId) {
    // Which is which? Easy to pass wrong parameter!
}

// GOOD: Compiler catches mistakes
void processOrder(OrderId orderId, UserId userId, ProductId productId) {
    // Impossible to mix up!
}
```

---

## 📧 **Domain Type: Email**

```java
public final class Email {
    
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    
    private final String value;
    
    private Email(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        String normalized = value.trim().toLowerCase();
        if (!EMAIL_PATTERN.matcher(normalized).matches()) {
            throw new IllegalArgumentException("Invalid email format: " + value);
        }
        this.value = normalized;
    }
    
    public static Email of(String value) {
        return new Email(value);
    }
    
    public String getValue() {
        return value;
    }
    
    public String getDomain() {
        return value.substring(value.indexOf('@') + 1);
    }
    
    public String getLocalPart() {
        return value.substring(0, value.indexOf('@'));
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Email)) return false;
        Email email = (Email) obj;
        return value.equals(email.value);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
    
    @Override
    public String toString() {
        return value;
    }
}
```

---

## 🎯 **Best Practices Summary**

### **When to Use Value Objects:**
- ✅ No need for identity tracking
- ✅ Defined by attributes (Money, Address, Coordinates)
- ✅ Conceptually replaceable when equal
- ✅ Benefits from immutability

### **When to Use Entities:**
- ✅ Needs unique identity (User, Order, Account)
- ✅ Lifecycle matters (created, updated, deleted)
- ✅ State changes over time
- ✅ Referenced by other objects

### **Immutability Checklist:**
- [ ] Class is `final`
- [ ] All fields are `final`
- [ ] No setters
- [ ] Defensive copies in constructors
- [ ] Defensive copies on return
- [ ] "Modification" methods return new instances

---

## 🏋️ **Exercises**

### **Exercise 1: PhoneNumber Value Object**
Create an immutable `PhoneNumber` class that:
- Validates format (10+ digits)
- Supports country codes
- Provides formatted output

### **Exercise 2: Address Value Object**
Create an immutable `Address` class with:
- Street, city, state, zip, country
- Validation for each field
- `withStreet()`, `withCity()` methods

### **Exercise 3: Percentage Value Object**
Create a `Percentage` class that:
- Ensures value is 0-100
- Supports operations (of, discount)
- Converts to/from decimal

---

## 💻 **Code Examples**

See complete implementations in your IDE:
- `src/main/java/com/you/lld/common/Money.java`
- `src/main/java/com/you/lld/problems/vendingmachine/model/`

---

**Next**: [Day 5 - Error Modeling & Validation](week1/day5/README.md) →

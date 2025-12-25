# Day 4 Exercises: Value Objects & Domain Types 📝

---

## 🎯 **Exercise 1: PhoneNumber Value Object**

### **Requirements**
Create an immutable `PhoneNumber` value object that:
- Supports international format with country codes
- Validates format (10+ digits after country code)
- Normalizes input (removes spaces, dashes, parentheses)
- Provides formatted output options

### **API Signature**
```java
public final class PhoneNumber {
    public static PhoneNumber of(String number);
    public static PhoneNumber of(String countryCode, String number);
    public String getCountryCode();
    public String getNationalNumber();
    public String formatInternational(); // +1 (555) 123-4567
    public String formatNational();      // (555) 123-4567
    public String formatE164();          // +15551234567
}
```

### **Test Cases**
```java
PhoneNumber.of("+1-555-123-4567")  // Valid US number
PhoneNumber.of("555-123-4567")     // Assume US
PhoneNumber.of("+44", "7911123456") // UK mobile
PhoneNumber.of("123")              // Should throw
PhoneNumber.of(null)               // Should throw
```

---

## 🎯 **Exercise 2: Address Value Object**

### **Requirements**
Create an immutable `Address` value object with:
- Required: street, city, country
- Optional: apartment, state/province, postal code
- Validation for each field
- Builder pattern for construction
- `with*` methods for creating modified copies

### **Implementation Notes**
- Use ISO 3166-1 for country codes
- Support both US (ZIP) and international postal codes
- Normalize state names to abbreviations for US

### **API Signature**
```java
public final class Address {
    public static Builder builder();
    public Address withStreet(String street);
    public Address withCity(String city);
    public String formatSingleLine();
    public String formatMultiLine();
    
    public static class Builder {
        public Builder street(String street);
        public Builder apartment(String apartment);
        public Builder city(String city);
        public Builder state(String state);
        public Builder postalCode(String postalCode);
        public Builder country(String country);
        public Address build();
    }
}
```

---

## 🎯 **Exercise 3: Percentage Value Object**

### **Requirements**
Create an immutable `Percentage` value object that:
- Accepts values 0-100 (or 0-1 for decimal)
- Provides operations: of, discount, markup
- Handles precision correctly
- Converts to/from decimal representation

### **API Signature**
```java
public final class Percentage {
    public static Percentage of(int value);
    public static Percentage of(BigDecimal value);
    public static Percentage fromDecimal(BigDecimal decimal); // 0.15 → 15%
    
    public Money of(Money amount);           // 10% of $100 = $10
    public Money discountFrom(Money amount); // $100 - 10% = $90
    public Money markupOn(Money amount);     // $100 + 10% = $110
    
    public BigDecimal toDecimal();           // 15% → 0.15
    public int toInt();                       // 15
}
```

### **Test Cases**
```java
Percentage.of(15).of(Money.dollars(100))        // $15.00
Percentage.of(20).discountFrom(Money.dollars(100)) // $80.00
Percentage.of(25).markupOn(Money.dollars(100))  // $125.00
Percentage.fromDecimal(new BigDecimal("0.175")).toInt() // 18 (rounded)
```

---

## 🎯 **Exercise 4: DateRange Value Object**

### **Requirements**
Create an immutable `DateRange` value object that:
- Represents a range of dates (inclusive)
- Supports overlap detection
- Supports containment check
- Handles open-ended ranges (no start or no end)

### **API Signature**
```java
public final class DateRange {
    public static DateRange of(LocalDate start, LocalDate end);
    public static DateRange startingFrom(LocalDate start);
    public static DateRange until(LocalDate end);
    public static DateRange unbounded();
    
    public boolean contains(LocalDate date);
    public boolean overlaps(DateRange other);
    public boolean isAdjacent(DateRange other);
    public Optional<DateRange> intersection(DateRange other);
    public DateRange union(DateRange other); // throws if not adjacent/overlapping
    
    public long getDays();
    public boolean isOpen();
    public boolean isBounded();
}
```

### **Test Cases**
```java
DateRange jan = DateRange.of(LocalDate.of(2024, 1, 1), LocalDate.of(2024, 1, 31));
DateRange feb = DateRange.of(LocalDate.of(2024, 2, 1), LocalDate.of(2024, 2, 29));
DateRange janMid = DateRange.of(LocalDate.of(2024, 1, 15), LocalDate.of(2024, 2, 15));

jan.overlaps(janMid)  // true
jan.overlaps(feb)     // false
jan.isAdjacent(feb)   // true
jan.intersection(janMid) // Jan 15-31
jan.union(feb)        // Jan 1 - Feb 29
```

---

## 🎯 **Exercise 5: Quantity Value Object**

### **Requirements**
Create an immutable `Quantity` value object for inventory management:
- Non-negative integer values
- Unit of measure support
- Arithmetic operations with unit validation
- Comparison operations

### **API Signature**
```java
public final class Quantity {
    public static Quantity of(int amount, UnitOfMeasure unit);
    public static Quantity zero(UnitOfMeasure unit);
    
    public Quantity add(Quantity other);
    public Quantity subtract(Quantity other);
    public Quantity multiply(int factor);
    
    public boolean isZero();
    public boolean isGreaterThan(Quantity other);
    public boolean isLessThan(Quantity other);
    
    public Quantity convertTo(UnitOfMeasure targetUnit);
}

public enum UnitOfMeasure {
    PIECE, KILOGRAM, GRAM, LITER, MILLILITER, METER, CENTIMETER
}
```

---

## 🎯 **Exercise 6: Entity vs Value Object Analysis**

### **Scenario Analysis**
For each item below, determine if it should be an Entity or Value Object. Justify your answer.

1. **Order** in e-commerce system
2. **GPS Coordinates** for delivery tracking
3. **Customer** in banking system
4. **Credit Card Number** for payments
5. **Discount Code** in promotions
6. **Session Token** for authentication
7. **Product Review** on marketplace
8. **Shipping Address** on order
9. **SKU (Stock Keeping Unit)** for inventory
10. **Temperature Reading** from IoT sensor

### **Analysis Template**
For each item:
- Classification: Entity or Value Object
- Identity: How is it identified?
- Mutability: Does it change over time?
- Lifecycle: Does it have a meaningful lifecycle?
- Equality: How are two instances compared?

---

## 🏋️ **Advanced Challenges**

### **Challenge 1: Currency-Safe Money Operations**
Extend the Money class to handle:
- Multi-currency arithmetic (convert before operation)
- Exchange rate provider injection
- Rounding strategies for different currencies (JPY has no cents)

### **Challenge 2: Composite Value Object**
Create a `FullName` value object that:
- Handles cultural differences (Western vs Eastern name order)
- Supports titles, suffixes, multiple middle names
- Provides formatted output for different contexts

### **Challenge 3: Self-Validating Value Objects**
Create a `CreditCardNumber` that:
- Validates using Luhn algorithm
- Identifies card type (Visa, Mastercard, Amex)
- Masks for display (****1234)
- Never stores full number in logs

---

## 📊 **Grading Rubric**

| Criteria | Points |
|----------|--------|
| **Immutability** - Class is truly immutable | 20 |
| **Validation** - All edge cases handled | 20 |
| **API Design** - Clean, intuitive methods | 20 |
| **Testing** - Comprehensive test coverage | 20 |
| **Documentation** - JavaDoc and examples | 10 |
| **Best Practices** - follows conventions | 10 |

---

**Solutions**: [EXERCISE_SOLUTIONS.md](week1/day4/EXERCISE_SOLUTIONS.md)

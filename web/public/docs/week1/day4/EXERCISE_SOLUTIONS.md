# Day 4 Exercise Solutions 🎯

---

## ✅ **Solution 1: PhoneNumber Value Object**

```java
package com.you.lld.common;

import java.util.Objects;
import java.util.regex.Pattern;

public final class PhoneNumber {
    
    private static final Pattern DIGITS_ONLY = Pattern.compile("\\d+");
    private static final String DEFAULT_COUNTRY_CODE = "+1";
    
    private final String countryCode;
    private final String nationalNumber;
    
    private PhoneNumber(String countryCode, String nationalNumber) {
        this.countryCode = countryCode;
        this.nationalNumber = nationalNumber;
    }
    
    public static PhoneNumber of(String number) {
        if (number == null || number.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }
        
        String cleaned = number.replaceAll("[^\\d+]", "");
        
        if (cleaned.startsWith("+")) {
            // Has country code
            String countryCode = extractCountryCode(cleaned);
            String national = cleaned.substring(countryCode.length());
            return new PhoneNumber(countryCode, validateNational(national));
        } else {
            // Assume default country code
            return new PhoneNumber(DEFAULT_COUNTRY_CODE, validateNational(cleaned));
        }
    }
    
    public static PhoneNumber of(String countryCode, String number) {
        if (countryCode == null || !countryCode.startsWith("+")) {
            throw new IllegalArgumentException("Country code must start with +");
        }
        String cleaned = number.replaceAll("[^\\d]", "");
        return new PhoneNumber(countryCode, validateNational(cleaned));
    }
    
    private static String extractCountryCode(String number) {
        // Simple extraction - real implementation would use libphonenumber
        if (number.startsWith("+1")) return "+1";
        if (number.startsWith("+44")) return "+44";
        if (number.startsWith("+91")) return "+91";
        // Default to first 2 digits after +
        return number.substring(0, 3);
    }
    
    private static String validateNational(String national) {
        if (national.length() < 10) {
            throw new IllegalArgumentException(
                "National number must be at least 10 digits: " + national);
        }
        return national;
    }
    
    public String getCountryCode() {
        return countryCode;
    }
    
    public String getNationalNumber() {
        return nationalNumber;
    }
    
    public String formatInternational() {
        // +1 (555) 123-4567
        if (nationalNumber.length() == 10) {
            return String.format("%s (%s) %s-%s",
                countryCode,
                nationalNumber.substring(0, 3),
                nationalNumber.substring(3, 6),
                nationalNumber.substring(6));
        }
        return countryCode + " " + nationalNumber;
    }
    
    public String formatNational() {
        // (555) 123-4567
        if (nationalNumber.length() == 10) {
            return String.format("(%s) %s-%s",
                nationalNumber.substring(0, 3),
                nationalNumber.substring(3, 6),
                nationalNumber.substring(6));
        }
        return nationalNumber;
    }
    
    public String formatE164() {
        // +15551234567
        return countryCode + nationalNumber;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof PhoneNumber)) return false;
        PhoneNumber other = (PhoneNumber) obj;
        return countryCode.equals(other.countryCode) && 
               nationalNumber.equals(other.nationalNumber);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(countryCode, nationalNumber);
    }
    
    @Override
    public String toString() {
        return formatInternational();
    }
}
```

---

## ✅ **Solution 2: Address Value Object**

```java
package com.you.lld.common;

import java.util.Objects;
import java.util.Optional;

public final class Address {
    
    private final String street;
    private final String apartment;
    private final String city;
    private final String state;
    private final String postalCode;
    private final String country;
    
    private Address(Builder builder) {
        this.street = builder.street;
        this.apartment = builder.apartment;
        this.city = builder.city;
        this.state = builder.state;
        this.postalCode = builder.postalCode;
        this.country = builder.country;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    // Getters
    public String getStreet() { return street; }
    public Optional<String> getApartment() { return Optional.ofNullable(apartment); }
    public String getCity() { return city; }
    public Optional<String> getState() { return Optional.ofNullable(state); }
    public Optional<String> getPostalCode() { return Optional.ofNullable(postalCode); }
    public String getCountry() { return country; }
    
    // With methods for creating modified copies
    public Address withStreet(String street) {
        return new Builder(this).street(street).build();
    }
    
    public Address withCity(String city) {
        return new Builder(this).city(city).build();
    }
    
    public Address withPostalCode(String postalCode) {
        return new Builder(this).postalCode(postalCode).build();
    }
    
    public String formatSingleLine() {
        StringBuilder sb = new StringBuilder();
        sb.append(street);
        if (apartment != null) {
            sb.append(", ").append(apartment);
        }
        sb.append(", ").append(city);
        if (state != null) {
            sb.append(", ").append(state);
        }
        if (postalCode != null) {
            sb.append(" ").append(postalCode);
        }
        sb.append(", ").append(country);
        return sb.toString();
    }
    
    public String formatMultiLine() {
        StringBuilder sb = new StringBuilder();
        sb.append(street);
        if (apartment != null) {
            sb.append("\n").append(apartment);
        }
        sb.append("\n").append(city);
        if (state != null) {
            sb.append(", ").append(state);
        }
        if (postalCode != null) {
            sb.append(" ").append(postalCode);
        }
        sb.append("\n").append(country);
        return sb.toString();
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Address)) return false;
        Address other = (Address) obj;
        return Objects.equals(street, other.street) &&
               Objects.equals(apartment, other.apartment) &&
               Objects.equals(city, other.city) &&
               Objects.equals(state, other.state) &&
               Objects.equals(postalCode, other.postalCode) &&
               Objects.equals(country, other.country);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(street, apartment, city, state, postalCode, country);
    }
    
    public static class Builder {
        private String street;
        private String apartment;
        private String city;
        private String state;
        private String postalCode;
        private String country;
        
        public Builder() {}
        
        public Builder(Address address) {
            this.street = address.street;
            this.apartment = address.apartment;
            this.city = address.city;
            this.state = address.state;
            this.postalCode = address.postalCode;
            this.country = address.country;
        }
        
        public Builder street(String street) {
            this.street = street;
            return this;
        }
        
        public Builder apartment(String apartment) {
            this.apartment = apartment;
            return this;
        }
        
        public Builder city(String city) {
            this.city = city;
            return this;
        }
        
        public Builder state(String state) {
            this.state = normalizeState(state);
            return this;
        }
        
        public Builder postalCode(String postalCode) {
            this.postalCode = postalCode;
            return this;
        }
        
        public Builder country(String country) {
            this.country = country;
            return this;
        }
        
        public Address build() {
            validate();
            return new Address(this);
        }
        
        private void validate() {
            if (street == null || street.trim().isEmpty()) {
                throw new IllegalArgumentException("Street is required");
            }
            if (city == null || city.trim().isEmpty()) {
                throw new IllegalArgumentException("City is required");
            }
            if (country == null || country.trim().isEmpty()) {
                throw new IllegalArgumentException("Country is required");
            }
        }
        
        private String normalizeState(String state) {
            // Normalize US state names to abbreviations
            if (state == null) return null;
            // Add more mappings as needed
            switch (state.toLowerCase()) {
                case "california": return "CA";
                case "new york": return "NY";
                case "texas": return "TX";
                default: return state;
            }
        }
    }
}
```

---

## ✅ **Solution 3: Percentage Value Object**

```java
package com.you.lld.common;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public final class Percentage implements Comparable<Percentage> {
    
    public static final Percentage ZERO = new Percentage(BigDecimal.ZERO);
    public static final Percentage HUNDRED = new Percentage(BigDecimal.valueOf(100));
    
    private static final BigDecimal ONE_HUNDRED = BigDecimal.valueOf(100);
    
    private final BigDecimal value;
    
    private Percentage(BigDecimal value) {
        if (value.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Percentage cannot be negative: " + value);
        }
        if (value.compareTo(ONE_HUNDRED) > 0) {
            throw new IllegalArgumentException("Percentage cannot exceed 100: " + value);
        }
        this.value = value.setScale(4, RoundingMode.HALF_UP);
    }
    
    public static Percentage of(int value) {
        return new Percentage(BigDecimal.valueOf(value));
    }
    
    public static Percentage of(BigDecimal value) {
        return new Percentage(value);
    }
    
    public static Percentage fromDecimal(BigDecimal decimal) {
        // 0.15 → 15%
        return new Percentage(decimal.multiply(ONE_HUNDRED));
    }
    
    /**
     * Calculate this percentage of an amount.
     * 10% of $100 = $10
     */
    public Money of(Money amount) {
        BigDecimal factor = value.divide(ONE_HUNDRED, 10, RoundingMode.HALF_UP);
        return amount.multiply(factor);
    }
    
    /**
     * Apply as discount to an amount.
     * $100 - 10% = $90
     */
    public Money discountFrom(Money amount) {
        return amount.subtract(of(amount));
    }
    
    /**
     * Apply as markup to an amount.
     * $100 + 10% = $110
     */
    public Money markupOn(Money amount) {
        return amount.add(of(amount));
    }
    
    /**
     * Convert to decimal representation.
     * 15% → 0.15
     */
    public BigDecimal toDecimal() {
        return value.divide(ONE_HUNDRED, 4, RoundingMode.HALF_UP);
    }
    
    public int toInt() {
        return value.setScale(0, RoundingMode.HALF_UP).intValue();
    }
    
    public BigDecimal getValue() {
        return value;
    }
    
    public Percentage add(Percentage other) {
        return new Percentage(this.value.add(other.value));
    }
    
    public Percentage subtract(Percentage other) {
        return new Percentage(this.value.subtract(other.value));
    }
    
    @Override
    public int compareTo(Percentage other) {
        return this.value.compareTo(other.value);
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Percentage)) return false;
        Percentage other = (Percentage) obj;
        return value.compareTo(other.value) == 0;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(value.stripTrailingZeros());
    }
    
    @Override
    public String toString() {
        return value.stripTrailingZeros().toPlainString() + "%";
    }
}
```

---

## ✅ **Solution 4: DateRange Value Object**

```java
package com.you.lld.common;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Objects;
import java.util.Optional;

public final class DateRange {
    
    private final LocalDate start;  // null means unbounded start
    private final LocalDate end;    // null means unbounded end
    
    private DateRange(LocalDate start, LocalDate end) {
        if (start != null && end != null && end.isBefore(start)) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
        this.start = start;
        this.end = end;
    }
    
    public static DateRange of(LocalDate start, LocalDate end) {
        if (start == null || end == null) {
            throw new IllegalArgumentException("Use startingFrom/until for open ranges");
        }
        return new DateRange(start, end);
    }
    
    public static DateRange startingFrom(LocalDate start) {
        Objects.requireNonNull(start, "Start date cannot be null");
        return new DateRange(start, null);
    }
    
    public static DateRange until(LocalDate end) {
        Objects.requireNonNull(end, "End date cannot be null");
        return new DateRange(null, end);
    }
    
    public static DateRange unbounded() {
        return new DateRange(null, null);
    }
    
    public boolean contains(LocalDate date) {
        if (date == null) return false;
        boolean afterStart = start == null || !date.isBefore(start);
        boolean beforeEnd = end == null || !date.isAfter(end);
        return afterStart && beforeEnd;
    }
    
    public boolean overlaps(DateRange other) {
        if (other == null) return false;
        
        // Two ranges overlap if neither ends before the other starts
        boolean thisEndsBeforeOtherStarts = 
            this.end != null && other.start != null && this.end.isBefore(other.start);
        boolean otherEndsBeforeThisStarts = 
            other.end != null && this.start != null && other.end.isBefore(this.start);
        
        return !thisEndsBeforeOtherStarts && !otherEndsBeforeThisStarts;
    }
    
    public boolean isAdjacent(DateRange other) {
        if (other == null) return false;
        
        // Adjacent if one ends the day before the other starts
        if (this.end != null && other.start != null) {
            if (this.end.plusDays(1).equals(other.start)) return true;
        }
        if (other.end != null && this.start != null) {
            if (other.end.plusDays(1).equals(this.start)) return true;
        }
        return false;
    }
    
    public Optional<DateRange> intersection(DateRange other) {
        if (!overlaps(other)) {
            return Optional.empty();
        }
        
        LocalDate maxStart = maxDate(this.start, other.start);
        LocalDate minEnd = minDate(this.end, other.end);
        
        return Optional.of(new DateRange(maxStart, minEnd));
    }
    
    public DateRange union(DateRange other) {
        if (!overlaps(other) && !isAdjacent(other)) {
            throw new IllegalArgumentException("Cannot union non-overlapping, non-adjacent ranges");
        }
        
        LocalDate minStart = minDate(this.start, other.start);
        LocalDate maxEnd = maxDate(this.end, other.end);
        
        return new DateRange(minStart, maxEnd);
    }
    
    public long getDays() {
        if (start == null || end == null) {
            throw new IllegalStateException("Cannot get days for unbounded range");
        }
        return ChronoUnit.DAYS.between(start, end) + 1; // Inclusive
    }
    
    public boolean isOpen() {
        return start == null || end == null;
    }
    
    public boolean isBounded() {
        return start != null && end != null;
    }
    
    public Optional<LocalDate> getStart() {
        return Optional.ofNullable(start);
    }
    
    public Optional<LocalDate> getEnd() {
        return Optional.ofNullable(end);
    }
    
    private static LocalDate maxDate(LocalDate a, LocalDate b) {
        if (a == null) return b;
        if (b == null) return a;
        return a.isAfter(b) ? a : b;
    }
    
    private static LocalDate minDate(LocalDate a, LocalDate b) {
        if (a == null) return b;
        if (b == null) return a;
        return a.isBefore(b) ? a : b;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof DateRange)) return false;
        DateRange other = (DateRange) obj;
        return Objects.equals(start, other.start) && Objects.equals(end, other.end);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(start, end);
    }
    
    @Override
    public String toString() {
        String startStr = start != null ? start.toString() : "...";
        String endStr = end != null ? end.toString() : "...";
        return "[" + startStr + " to " + endStr + "]";
    }
}
```

---

## ✅ **Solution 6: Entity vs Value Object Analysis**

| Item | Type | Reasoning |
|------|------|-----------|
| **Order** | Entity | Has lifecycle (placed→shipped→delivered), needs tracking by ID |
| **GPS Coordinates** | Value Object | Defined by lat/long values, no identity needed |
| **Customer** | Entity | Has identity, state changes over time (orders, preferences) |
| **Credit Card Number** | Value Object | Defined by its digits, interchangeable when equal |
| **Discount Code** | Entity | Has lifecycle (created, used, expired), needs tracking |
| **Session Token** | Entity | Has lifecycle (created, active, expired), identified by token ID |
| **Product Review** | Entity | Has identity (review ID), can be edited, has creation date |
| **Shipping Address** | Value Object | Defined by its fields, no lifecycle, interchangeable |
| **SKU** | Value Object | Identifier for product, defined by its value |
| **Temperature Reading** | Value Object | Defined by value and unit, no identity needed |

### **Key Decision Factors**

1. **Does it have a lifecycle?** → Entity
2. **Is identity important?** → Entity
3. **Are two instances with same values interchangeable?** → Value Object
4. **Does it change over time?** → Likely Entity
5. **Is it shared across aggregates?** → Entity

---

## 📝 **Key Takeaways**

1. **Immutability is enforced** through final class, final fields, and defensive copies
2. **Validation in constructors** prevents invalid states
3. **With methods** create new instances for modifications
4. **Null handling** is explicit through Optional or validation
5. **Equality** is based on all values, not identity

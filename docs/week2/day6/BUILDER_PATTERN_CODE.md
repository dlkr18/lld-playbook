# Builder Pattern - Complete Code Example

Learn the Builder pattern through a complete, production-ready User class implementation.

---

## 🎯 **What is the Builder Pattern?**

The Builder pattern separates the construction of complex objects from their representation, allowing step-by-step construction with a fluent API.

### **When to Use:**
- ✅ Objects with many optional parameters
- ✅ Need validation before object creation
- ✅ Want immutable result objects
- ✅ Avoid telescoping constructors

---

## 💻 **Complete Implementation**

### **User.java with Builder**

This shows a production-ready implementation with:
- Required and optional fields
- Validation
- Immutability
- Fluent API

```java
package com.you.lld.examples.week2.day6.builder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * User class demonstrating the Builder pattern.
 * 
 * This example shows how to handle:
 * - Required fields (name, email)
 * - Optional fields (age, phone, address, preferences)
 * - Validation during building
 * - Immutable result object
 * - Fluent API design
 */
public final class User {
    // Required fields
    private final String name;
    private final String email;
    
    // Optional fields
    private final Integer age;
    private final String phone;
    private final String address;
    private final List<String> preferences;
    private final boolean isActive;
    private final LocalDateTime createdAt;
    
    // Private constructor - only accessible through Builder
    private User(Builder builder) {
        this.name = builder.name;
        this.email = builder.email;
        this.age = builder.age;
        this.phone = builder.phone;
        this.address = builder.address;
        this.preferences = builder.preferences != null ? 
            new ArrayList<>(builder.preferences) : new ArrayList<>();
        this.isActive = builder.isActive;
        this.createdAt = builder.createdAt != null ? 
            builder.createdAt : LocalDateTime.now();
    }
    
    // Static method to create builder
    public static Builder builder() {
        return new Builder();
    }
    
    // Getters only - immutable object
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Integer getAge() { return age; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public List<String> getPreferences() { return new ArrayList<>(preferences); }
    public boolean isActive() { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    @Override
    public String toString() {
        return "User{" +
               "name='" + name + '\'' +
               ", email='" + email + '\'' +
               ", age=" + age +
               ", phone='" + phone + '\'' +
               ", address='" + address + '\'' +
               ", preferences=" + preferences +
               ", isActive=" + isActive +
               ", createdAt=" + createdAt +
               '}';
    }
    
    /**
     * Builder class for User construction.
     * Implements fluent interface pattern for readable object creation.
     */
    public static class Builder {
        // Required fields
        private String name;
        private String email;
        
        // Optional fields with default values
        private Integer age;
        private String phone;
        private String address;
        private List<String> preferences;
        private boolean isActive = true; // Default to active
        private LocalDateTime createdAt;
        
        // Private constructor to prevent external instantiation
        private Builder() {}
        
        // Required field setters
        public Builder name(String name) {
            this.name = name;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        // Optional field setters
        public Builder age(Integer age) {
            this.age = age;
            return this;
        }
        
        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }
        
        public Builder address(String address) {
            this.address = address;
            return this;
        }
        
        public Builder preferences(List<String> preferences) {
            this.preferences = preferences;
            return this;
        }
        
        public Builder addPreference(String preference) {
            if (this.preferences == null) {
                this.preferences = new ArrayList<>();
            }
            this.preferences.add(preference);
            return this;
        }
        
        public Builder isActive(boolean isActive) {
            this.isActive = isActive;
            return this;
        }
        
        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        /**
         * Build the User object with validation.
         * @return Immutable User instance
         * @throws IllegalStateException if required fields are missing or invalid
         */
        public User build() {
            validate();
            return new User(this);
        }
        
        /**
         * Validate builder state before creating User.
         * This is where business rules and constraints are enforced.
         */
        private void validate() {
            if (name == null || name.trim().isEmpty()) {
                throw new IllegalStateException("Name is required and cannot be empty");
            }
            
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalStateException("Email is required and cannot be empty");
            }
            
            // Basic email validation
            if (!email.contains("@") || !email.contains(".")) {
                throw new IllegalStateException("Email must be in valid format");
            }
            
            // Age validation if provided
            if (age != null && (age < 0 || age > 150)) {
                throw new IllegalStateException("Age must be between 0 and 150");
            }
            
            // Phone validation if provided
            if (phone != null && phone.trim().length() < 10) {
                throw new IllegalStateException("Phone number must be at least 10 digits");
            }
        }
    }
}
```

---

## 📝 **Usage Examples**

### **Example 1: Minimum Required Fields**

```java
User user1 = User.builder()
    .name("John Doe")
    .email("john@example.com")
    .build();
```

### **Example 2: With Optional Fields**

```java
User user2 = User.builder()
    .name("Jane Smith")
    .email("jane@example.com")
    .age(30)
    .phone("1234567890")
    .address("123 Main St")
    .addPreference("Dark Mode")
    .addPreference("Email Notifications")
    .build();
```

### **Example 3: Inactive User**

```java
User user3 = User.builder()
    .name("Bob Wilson")
    .email("bob@example.com")
    .isActive(false)
    .createdAt(LocalDateTime.now().minusDays(7))
    .build();
```

---

## ❌ **Without Builder (The Problem)**

### **Telescoping Constructor Anti-Pattern:**

```java
// Without Builder - CONFUSING!
public User(String name, String email) { }
public User(String name, String email, Integer age) { }
public User(String name, String email, Integer age, String phone) { }
public User(String name, String email, Integer age, String phone, String address) { }
// ... many more constructors!

// Usage is confusing:
User user = new User("John", "john@example.com", 30, "1234567890", "123 Main St");
// What does each parameter mean? Hard to read!
```

---

## ✅ **Benefits of Builder Pattern**

| Benefit | Description |
|---------|-------------|
| **Readability** | `builder().name("John").email("john@example.com").build()` is self-documenting |
| **Flexibility** | Set only the fields you need, in any order |
| **Validation** | Validate once before creation, not in multiple constructors |
| **Immutability** | Result object is immutable - thread-safe |
| **Optional Parameters** | Handle many optional parameters elegantly |

---

## 🎓 **Key Design Decisions**

### **1. Private Constructor**
```java
private User(Builder builder) {
    // Only Builder can create User instances
}
```
**Why?** Forces clients to use the Builder, ensuring validation

### **2. Static Factory Method**
```java
public static Builder builder() {
    return new Builder();
}
```
**Why?** Convenient entry point: `User.builder()`

### **3. Fluent API (Method Chaining)**
```java
public Builder name(String name) {
    this.name = name;
    return this;  // Return 'this' to enable chaining
}
```
**Why?** Enables readable chains: `.name("John").email("john@example.com")`

### **4. Defensive Copying**
```java
this.preferences = builder.preferences != null ? 
    new ArrayList<>(builder.preferences) : new ArrayList<>();
```
**Why?** Protects immutability - prevents external modification

### **5. Validation in build()**
```java
public User build() {
    validate();  // All validation in one place
    return new User(this);
}
```
**Why?** Single point of validation, fails fast with clear errors

---

## 🚨 **Common Mistakes to Avoid**

### **1. No Validation**
```java
// BAD: No validation
public User build() {
    return new User(this);  // What if name is null?
}
```

### **2. Mutable Result**
```java
// BAD: Setters on result object
public void setName(String name) {
    this.name = name;  // Breaks immutability!
}
```

### **3. Forgetting 'return this'**
```java
// BAD: Can't chain methods
public Builder name(String name) {
    this.name = name;
    // Missing: return this;
}
```

---

## 🔄 **When NOT to Use Builder**

- Simple objects with 1-3 fields → Use constructor
- All fields are required → Use constructor
- Object needs to be mutable → Use traditional setters

---

## 📚 **Related Patterns**

- **Factory Pattern** - Creates objects without exposing creation logic
- **Fluent Interface** - Method chaining for readable APIs
- **Step Builder** - Enforces order of method calls

---

## 🎯 **Practice Exercise**

Implement a Builder for this class:

```java
public class HttpRequest {
    private final String url;          // Required
    private final String method;       // Required ("GET", "POST", etc.)
    private final Map<String, String> headers;    // Optional
    private final String body;         // Optional
    private final int timeout;         // Optional, default 30s
}
```

**Bonus**: Add validation for:
- URL format
- Valid HTTP methods (GET, POST, PUT, DELETE)
- Timeout between 1-300 seconds

---

**See also:**
- [Factory Pattern Code Examples](week2/day6/FACTORY_PATTERN_CODE.md)
- [Prototype Pattern Code Examples](week2/day6/PROTOTYPE_PATTERN_CODE.md)
- [All Creational Patterns](week2/day6/README.md)

**Source Code Location**: `src/main/java/com/you/lld/examples/week2/day6/builder/`



# God Class Refactoring Example

## 📚 **Overview**

This example demonstrates how to refactor a "God Class" (a class that knows too much or does too much) into a clean, maintainable architecture following SOLID and GRASP principles.

---

## ❌ **Before: The God Class**

### **Problems:**
- ✗ Violates Single Responsibility Principle
- ✗ Hard to test (too many dependencies)
- ✗ Hard to maintain (changes affect multiple areas)
- ✗ High coupling (depends on concrete implementations)
- ✗ Low cohesion (unrelated responsibilities mixed together)

### **ECommerceManagerGodClass.java**

```java
package com.you.lld.examples.day2.refactoring.before;

import java.sql.*;
import java.util.List;
import java.util.Date;

/**
 * BAD EXAMPLE: God Class - Does EVERYTHING!
 * 
 * This class violates multiple principles:
 * - Single Responsibility: Handles users, products, orders, payments, reporting
 * - Open/Closed: Hard to extend without modifying existing code
 * - Dependency Inversion: Depends on concrete implementations
 * 
 * Problems:
 * - Hard to test individual features
 * - Hard to maintain - changes affect multiple areas
 * - Hard to extend - adding features requires modifying existing code
 * - High coupling to databases, email, payment systems
 * - Low cohesion - unrelated responsibilities mixed together
 */
public class ECommerceManagerGodClass {
    
    // TOO MANY DEPENDENCIES
    private Connection dbConnection;
    private EmailSender emailSender;
    private PaymentGateway paymentGateway;
    private Logger logger;
    
    // USER MANAGEMENT (Should be separate)
    public void createUser(String name, String email, String password) {
        // Validation logic
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name required");
        }
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Invalid email");
        }
        if (password.length() < 8) {
            throw new IllegalArgumentException("Password too short");
        }
        
        // Password hashing
        String hashedPassword = hashPassword(password);
        
        // Database operations
        String sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        try {
            PreparedStatement stmt = dbConnection.prepareStatement(sql);
            stmt.setString(1, name);
            stmt.setString(2, email);
            stmt.setString(3, hashedPassword);
            stmt.executeUpdate();
        } catch (SQLException e) {
            logger.error("Failed to create user", e);
            throw new RuntimeException("User creation failed");
        }
        
        // Email sending
        String subject = "Welcome to our store!";
        String body = "Hello " + name + ", welcome to our platform!";
        emailSender.send(email, subject, body);
        
        // Audit logging
        logger.info("User created: " + email);
    }
    
    // PRODUCT MANAGEMENT (Should be separate)
    public void addProduct(String name, double price, int quantity) {
        // Validation
        if (price < 0) throw new IllegalArgumentException("Price cannot be negative");
        if (quantity < 0) throw new IllegalArgumentException("Quantity cannot be negative");
        
        // Database operations
        String sql = "INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)";
        try {
            PreparedStatement stmt = dbConnection.prepareStatement(sql);
            stmt.setString(1, name);
            stmt.setDouble(2, price);
            stmt.setInt(3, quantity);
            stmt.executeUpdate();
        } catch (SQLException e) {
            logger.error("Failed to add product", e);
            throw new RuntimeException("Product addition failed");
        }
        
        logger.info("Product added: " + name);
    }
    
    // ORDER PROCESSING (Should be separate)
    public void processOrder(int userId, List<OrderItem> items) {
        // Complex order processing logic with multiple responsibilities
        // User validation, inventory checking, price calculation, 
        // payment processing, order creation, inventory update, email confirmation
        // ... (hundreds of lines of mixed responsibilities)
    }
    
    // REPORTING (Should be separate)
    public void generateSalesReport(Date startDate, Date endDate) {
        // Complex SQL queries
        // Report generation logic
        // File writing logic
        // Email sending logic
    }
    
    // UTILITY METHODS (Mixed responsibilities)
    private String hashPassword(String password) {
        // Password hashing logic
        return password; // Simplified
    }
    
    private void validateEmail(String email) {
        // Email validation logic
    }
    
    private double calculateShipping(double weight, String zipCode) {
        // Shipping calculation logic
        return 0.0; // Simplified
    }
    
    // ... MANY MORE METHODS with mixed responsibilities
}
```

---

## ✅ **After: Clean, Refactored Design**

### **Improvements:**
- ✓ Each class has a single responsibility
- ✓ Easy to test (small, focused units)
- ✓ Easy to maintain (changes are localized)
- ✓ Low coupling (depends on abstractions)
- ✓ High cohesion (related methods grouped together)

---

### **1. User.java** - Domain Entity

```java
package com.you.lld.examples.day2.refactoring.after;

/**
 * GOOD EXAMPLE: Domain Entity
 * 
 * Follows SOLID principles:
 * - Single Responsibility: Represents user data and behavior
 * - Open/Closed: Can extend without modification
 * 
 * Follows GRASP principles:
 * - Information Expert: Knows its own data
 * - High Cohesion: All methods relate to user concept
 * 
 * Design characteristics:
 * - Immutable: Cannot be changed after creation
 * - Value semantics: Equality based on content
 * - Domain-focused: Represents business concept
 */
public class User {
    private final String id;
    private final String name;
    private final String email;
    private final String hashedPassword;
    
    public User(String id, String name, String email, String hashedPassword) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.hashedPassword = hashedPassword;
    }
    
    // Getters only - immutable
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getHashedPassword() { return hashedPassword; }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        User user = (User) obj;
        return id.equals(user.id);
    }
    
    @Override
    public int hashCode() {
        return id.hashCode();
    }
    
    @Override
    public String toString() {
        return "User{id='" + id + "', name='" + name + "', email='" + email + "'}";
    }
}
```

---

### **2. UserRepository.java** - Data Access Abstraction

```java
package com.you.lld.examples.day2.refactoring.after;

/**
 * GOOD EXAMPLE: Repository Interface
 * 
 * Follows SOLID principles:
 * - Interface Segregation: Focused interface for user data access
 * - Dependency Inversion: Abstraction for data access
 * 
 * Follows GRASP principles:
 * - Pure Fabrication: Artificial class for data access concerns
 * - Low Coupling: Interface reduces coupling to specific implementations
 * 
 * Benefits:
 * - Easy to test with mock implementations
 * - Can switch between different data stores
 * - Clear contract for user data operations
 */
public interface UserRepository {
    User save(User user);
    User findById(String id);
    User findByEmail(String email);
    boolean existsByEmail(String email);
    void delete(String id);
}
```

---

### **3. UserService.java** - Business Logic

```java
package com.you.lld.examples.day2.refactoring.after;

import java.util.UUID;

/**
 * GOOD EXAMPLE: Refactored User Service
 * 
 * Follows SOLID principles:
 * - Single Responsibility: Only handles user business logic
 * - Dependency Inversion: Depends on abstractions (interfaces)
 * - Open/Closed: Can extend without modification
 * 
 * Follows GRASP principles:
 * - Information Expert: Uses user data appropriately
 * - Low Coupling: Minimal dependencies on abstractions
 * - High Cohesion: All methods serve user management
 */
public class UserService {
    private final UserRepository userRepository;
    private final UserValidator userValidator;
    private final PasswordService passwordService;
    private final NotificationService notificationService;
    
    public UserService(UserRepository userRepository, 
                      UserValidator userValidator,
                      PasswordService passwordService,
                      NotificationService notificationService) {
        this.userRepository = userRepository;
        this.userValidator = userValidator;
        this.passwordService = passwordService;
        this.notificationService = notificationService;
    }
    
    public User createUser(String name, String email, String password) {
        userValidator.validateUserCreation(name, email, password);
        
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("User with this email already exists");
        }
        
        String hashedPassword = passwordService.hashPassword(password);
        User user = new User(generateId(), name, email, hashedPassword);
        
        User savedUser = userRepository.save(user);
        notificationService.sendWelcomeNotification(savedUser);
        
        return savedUser;
    }
    
    public User findById(String id) {
        return userRepository.findById(id);
    }
    
    private String generateId() {
        return UUID.randomUUID().toString();
    }
}
```

---

### **4. BusinessException.java** - Domain Exception

```java
package com.you.lld.examples.day2.refactoring.after;

/**
 * Business Exception for domain-specific errors
 * 
 * Used to represent business rule violations and domain-specific error conditions.
 * This separates business logic errors from technical/infrastructure errors.
 */
public class BusinessException extends RuntimeException {
    
    public BusinessException(String message) {
        super(message);
    }
    
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

---

## 📊 **Comparison**

| Aspect | Before (God Class) | After (Refactored) |
|--------|-------------------|-------------------|
| **Responsibilities** | User, Product, Order, Payment, Reporting | Separated into distinct classes |
| **Lines per class** | 500+ lines | 50-100 lines each |
| **Testability** | Hard (many dependencies) | Easy (focused, mockable) |
| **Coupling** | High (concrete dependencies) | Low (interface dependencies) |
| **Cohesion** | Low (unrelated methods) | High (related methods) |
| **Maintainability** | Hard (changes affect many areas) | Easy (changes localized) |
| **Extensibility** | Hard (requires modification) | Easy (add new implementations) |

---

## 🎯 **Key Takeaways**

### **SOLID Principles Applied:**

1. **Single Responsibility Principle (SRP)**
   - Each class has one reason to change
   - User: Represents user data
   - UserRepository: Handles data access
   - UserService: Manages business logic

2. **Open/Closed Principle (OCP)**
   - Can extend behavior without modifying existing code
   - New repositories can be added by implementing interface

3. **Liskov Substitution Principle (LSP)**
   - Any UserRepository implementation can be substituted

4. **Interface Segregation Principle (ISP)**
   - UserRepository has focused, cohesive interface

5. **Dependency Inversion Principle (DIP)**
   - UserService depends on abstractions (interfaces), not concrete classes

### **GRASP Principles Applied:**

- **Information Expert**: User knows its own data
- **Creator**: UserService creates User objects
- **Low Coupling**: Minimal dependencies, uses interfaces
- **High Cohesion**: Related methods grouped together
- **Pure Fabrication**: UserRepository is artificial but necessary

---

## 🔗 **Related Resources**

- [SOLID Principles Guide](week1/day2/DAY2_SOLID_PRINCIPLES.md)
- [GRASP Principles Guide](week1/day2/DAY2_GRASP_PRINCIPLES.md)
- [Cohesion & Coupling](week1/day2/COHESION_COUPLING.md)

---

**Remember**: The goal is not perfection, but continuous improvement. Refactoring is an iterative process! 🔄



# Day 2 - SOLID Principles Examples

## 📂 8 Java Files

### refactoring / after

#### `BusinessException.java`

<details>
<summary>📄 Click to view source</summary>

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
</details>

#### `User.java`

<details>
<summary>📄 Click to view source</summary>

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
</details>

#### `UserRepository.java`

<details>
<summary>📄 Click to view source</summary>

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
</details>

#### `UserService.java`

<details>
<summary>📄 Click to view source</summary>

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
</details>

### refactoring / before

#### `ECommerceManagerGodClass.java`

<details>
<summary>📄 Click to view source</summary>

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

// Supporting classes for the example
class EmailSender {
    public void send(String to, String subject, String body) {}
}

class PaymentGateway {
    public PaymentResult charge(String email, double amount) { 
        return new PaymentResult(); 
    }
}

class PaymentResult {
    public boolean isSuccess() { return true; }
    public String getErrorMessage() { return ""; }
}

class Logger {
    public void error(String message, Exception e) {}
    public void info(String message) {}
}

class OrderItem {
    private int productId;
    private int quantity;
    
    public int getProductId() { return productId; }
    public int getQuantity() { return quantity; }
}


```
</details>

### solid / srp

#### `EmailService.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.day2.solid.srp;

/**
 * GOOD EXAMPLE: Single Responsibility - Email Operations
 * 
 * This class is only responsible for sending emails
 */
public class EmailService {
    
    public void sendWelcomeEmail(User user) {
        // Only responsible for sending emails
        String subject = "Welcome!";
        String body = "Hello " + user.getName() + ", welcome to our platform!";
        sendEmail(user.getEmail(), subject, body);
    }
    
    private void sendEmail(String to, String subject, String body) {
        // Email sending implementation
    }
}


```
</details>

#### `UserManagerBad.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.day2.solid.srp;

/**
 * BAD EXAMPLE: Violates Single Responsibility Principle
 * 
 * This class has multiple responsibilities:
 * 1. User data management
 * 2. Email sending
 * 3. Password management
 * 4. Reporting
 * 
 * Problems:
 * - Changes to email logic affect user management
 * - Database changes affect reporting
 * - Hard to test individual features
 * - Violates single responsibility
 */
public class UserManagerBad {
    
    // Responsibility 1: User data management
    public void createUser(String name, String email) {
        // validate user data
        // save to database
    }
    
    // Responsibility 2: Email sending
    public void sendWelcomeEmail(User user) {
        // compose email
        // send via SMTP
    }
    
    // Responsibility 3: Password management
    public void resetPassword(User user) {
        // generate new password
        // update database
        // send email
    }
    
    // Responsibility 4: Reporting
    public void generateUserReport() {
        // query database
        // format report
        // save to file
    }
}


```
</details>

#### `UserService.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.day2.solid.srp;

/**
 * GOOD EXAMPLE: Follows Single Responsibility Principle
 * 
 * This class has a single responsibility: User business logic
 * 
 * Benefits:
 * - Each class has one reason to change
 * - Easy to test and maintain
 * - Changes are isolated
 * - Clear responsibilities
 */
public class UserService {
    private UserRepository userRepository;
    private EmailService emailService;
    
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public void createUser(String name, String email) {
        User user = new User(name, email);
        userRepository.save(user);
        emailService.sendWelcomeEmail(user);  // Delegate to email service
    }
}


```
</details>


# Day 2: SOLID Principles Guide

## 🎯 **What are SOLID Principles?**

**SOLID** is an acronym for **5 fundamental principles** of object-oriented design that make code more **maintainable**, **flexible**, and **testable**.

**Created by:** Robert C. Martin (Uncle Bob)  
**Purpose:** Write clean, extensible, and robust code

---

## 🔤 **The SOLID Acronym**

| Letter | Principle | Core Idea |
|--------|-----------|-----------|
| **S** | **Single Responsibility** | One class, one reason to change |
| **O** | **Open/Closed** | Open for extension, closed for modification |
| **L** | **Liskov Substitution** | Subtypes must be substitutable for base types |
| **I** | **Interface Segregation** | Many specific interfaces > one general interface |
| **D** | **Dependency Inversion** | Depend on abstractions, not concretions |

---

## 1️⃣ **Single Responsibility Principle (SRP)**

### **Definition:**
> "A class should have only one reason to change."

### **❌ Violation Example:**
```java
// BAD: UserManager has multiple responsibilities
public class UserManager {
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

**Problems:**
- Changes to email logic affect user management
- Database changes affect reporting
- Hard to test individual features
- Violates single responsibility

### **✅ Good Example:**
```java
// GOOD: Each class has single responsibility
public class UserService {
    private UserRepository userRepository;
    private EmailService emailService;
    
    public void createUser(String name, String email) {
        User user = new User(name, email);
        userRepository.save(user);
        emailService.sendWelcomeEmail(user);  // Delegate to email service
    }
}

public class EmailService {
    public void sendWelcomeEmail(User user) {
        // Only responsible for sending emails
    }
}

public class PasswordService {
    public void resetPassword(User user) {
        // Only responsible for password operations
    }
}

public class UserReportService {
    public void generateUserReport() {
        // Only responsible for reporting
    }
}
```

**Benefits:**
- ✅ Each class has one reason to change
- ✅ Easy to test and maintain
- ✅ Changes are isolated
- ✅ Clear responsibilities

---

## 2️⃣ **Open/Closed Principle (OCP)**

### **Definition:**
> "Software entities should be open for extension but closed for modification."

### **❌ Violation Example:**
```java
// BAD: Need to modify existing code for new shapes
public class AreaCalculator {
    public double calculateArea(Object shape) {
        if (shape instanceof Rectangle) {
            Rectangle rect = (Rectangle) shape;
            return rect.getWidth() * rect.getHeight();
        } else if (shape instanceof Circle) {
            Circle circle = (Circle) shape;
            return Math.PI * circle.getRadius() * circle.getRadius();
        }
        // Need to add more if-else for new shapes - VIOLATION!
        return 0;
    }
}
```

**Problems:**
- Must modify `AreaCalculator` for every new shape
- Risk of breaking existing functionality
- Violates open/closed principle

### **✅ Good Example:**
```java
// GOOD: Open for extension, closed for modification
public abstract class Shape {
    public abstract double calculateArea();
}

public class Rectangle extends Shape {
    private double width, height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double calculateArea() {
        return width * height;
    }
}

public class Circle extends Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}

// Can add new shapes without modifying existing code
public class Triangle extends Shape {
    private double base, height;
    
    public Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }
    
    @Override
    public double calculateArea() {
        return 0.5 * base * height;
    }
}

public class AreaCalculator {
    public double calculateTotalArea(List<Shape> shapes) {
        return shapes.stream()
                    .mapToDouble(Shape::calculateArea)
                    .sum();
    }
}
```

**Benefits:**
- ✅ Add new shapes without changing existing code
- ✅ Existing functionality remains untouched
- ✅ Extensible and maintainable

---

## 3️⃣ **Liskov Substitution Principle (LSP)**

### **Definition:**
> "Objects of a superclass should be replaceable with objects of subclasses without breaking functionality."

### **❌ Violation Example:**
```java
// BAD: Square violates LSP
public class Rectangle {
    protected double width, height;
    
    public void setWidth(double width) {
        this.width = width;
    }
    
    public void setHeight(double height) {
        this.height = height;
    }
    
    public double getArea() {
        return width * height;
    }
}

public class Square extends Rectangle {
    @Override
    public void setWidth(double width) {
        this.width = width;
        this.height = width;  // Violates expected behavior!
    }
    
    @Override
    public void setHeight(double height) {
        this.width = height;  // Violates expected behavior!
        this.height = height;
    }
}

// This breaks when using Square as Rectangle
public void testRectangle(Rectangle rect) {
    rect.setWidth(5);
    rect.setHeight(4);
    assert rect.getArea() == 20;  // Fails for Square!
}
```

**Problems:**
- Square changes both dimensions when setting one
- Breaks the expected behavior of Rectangle
- Cannot substitute Square for Rectangle safely

### **✅ Good Example:**
```java
// GOOD: Proper abstraction that follows LSP
public abstract class Shape {
    public abstract double getArea();
    public abstract double getPerimeter();
}

public class Rectangle extends Shape {
    private final double width, height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double getArea() {
        return width * height;
    }
    
    @Override
    public double getPerimeter() {
        return 2 * (width + height);
    }
    
    // Getters only - immutable
    public double getWidth() { return width; }
    public double getHeight() { return height; }
}

public class Square extends Shape {
    private final double side;
    
    public Square(double side) {
        this.side = side;
    }
    
    @Override
    public double getArea() {
        return side * side;
    }
    
    @Override
    public double getPerimeter() {
        return 4 * side;
    }
    
    public double getSide() { return side; }
}

// Both can be used interchangeably as Shape
public double calculateTotalArea(List<Shape> shapes) {
    return shapes.stream()
                .mapToDouble(Shape::getArea)
                .sum();
}
```

**Benefits:**
- ✅ Both Rectangle and Square can be used as Shape
- ✅ No unexpected behavior changes
- ✅ Substitutable without breaking functionality

---

## 4️⃣ **Interface Segregation Principle (ISP)**

### **Definition:**
> "Clients should not be forced to depend on interfaces they don't use."

### **❌ Violation Example:**
```java
// BAD: Fat interface forces unnecessary dependencies
public interface Worker {
    void work();
    void eat();
    void sleep();
    void attendMeeting();
    void writeCode();
    void designSystem();
}

// Robot doesn't eat or sleep!
public class Robot implements Worker {
    @Override
    public void work() { /* robot work */ }
    
    @Override
    public void eat() { 
        throw new UnsupportedOperationException("Robots don't eat!");
    }
    
    @Override
    public void sleep() { 
        throw new UnsupportedOperationException("Robots don't sleep!");
    }
    
    @Override
    public void attendMeeting() { /* can attend */ }
    
    @Override
    public void writeCode() { /* can code */ }
    
    @Override
    public void designSystem() { 
        throw new UnsupportedOperationException("Robots don't design!");
    }
}
```

**Problems:**
- Robot forced to implement methods it can't use
- Throws exceptions for unsupported operations
- Violates interface segregation

### **✅ Good Example:**
```java
// GOOD: Segregated interfaces
public interface Workable {
    void work();
}

public interface Eatable {
    void eat();
}

public interface Sleepable {
    void sleep();
}

public interface Attendable {
    void attendMeeting();
}

public interface Programmable {
    void writeCode();
}

public interface Designable {
    void designSystem();
}

// Human implements what it needs
public class Human implements Workable, Eatable, Sleepable, Attendable, Programmable, Designable {
    @Override
    public void work() { /* human work */ }
    
    @Override
    public void eat() { /* human eat */ }
    
    @Override
    public void sleep() { /* human sleep */ }
    
    @Override
    public void attendMeeting() { /* attend meeting */ }
    
    @Override
    public void writeCode() { /* write code */ }
    
    @Override
    public void designSystem() { /* design system */ }
}

// Robot only implements what it can do
public class Robot implements Workable, Attendable, Programmable {
    @Override
    public void work() { /* robot work */ }
    
    @Override
    public void attendMeeting() { /* attend meeting */ }
    
    @Override
    public void writeCode() { /* write code */ }
}
```

**Benefits:**
- ✅ Classes only implement interfaces they need
- ✅ No forced dependencies on unused methods
- ✅ More flexible and maintainable

---

## 5️⃣ **Dependency Inversion Principle (DIP)**

### **Definition:**
> "High-level modules should not depend on low-level modules. Both should depend on abstractions."

### **❌ Violation Example:**
```java
// BAD: High-level class depends on concrete low-level class
public class OrderService {
    private MySQLDatabase database;  // Concrete dependency!
    private EmailSender emailSender;  // Concrete dependency!
    
    public OrderService() {
        this.database = new MySQLDatabase();  // Tight coupling!
        this.emailSender = new EmailSender();  // Tight coupling!
    }
    
    public void processOrder(Order order) {
        database.save(order);  // Depends on MySQL specifically
        emailSender.sendConfirmation(order);  // Depends on email specifically
    }
}

// Low-level modules
public class MySQLDatabase {
    public void save(Order order) { /* MySQL specific code */ }
}

public class EmailSender {
    public void sendConfirmation(Order order) { /* Email specific code */ }
}
```

**Problems:**
- Cannot switch to PostgreSQL without changing OrderService
- Cannot switch to SMS notifications
- Hard to test (cannot mock dependencies)
- Tight coupling between layers

### **✅ Good Example:**
```java
// GOOD: Depend on abstractions
public interface OrderRepository {
    void save(Order order);
}

public interface NotificationService {
    void sendOrderConfirmation(Order order);
}

// High-level module depends on abstractions
public class OrderService {
    private final OrderRepository repository;
    private final NotificationService notificationService;
    
    // Dependency injection - depends on abstractions!
    public OrderService(OrderRepository repository, NotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }
    
    public void processOrder(Order order) {
        repository.save(order);  // Works with any repository implementation
        notificationService.sendOrderConfirmation(order);  // Works with any notification
    }
}

// Low-level modules implement abstractions
public class MySQLOrderRepository implements OrderRepository {
    @Override
    public void save(Order order) { /* MySQL implementation */ }
}

public class PostgreSQLOrderRepository implements OrderRepository {
    @Override
    public void save(Order order) { /* PostgreSQL implementation */ }
}

public class EmailNotificationService implements NotificationService {
    @Override
    public void sendOrderConfirmation(Order order) { /* Email implementation */ }
}

public class SMSNotificationService implements NotificationService {
    @Override
    public void sendOrderConfirmation(Order order) { /* SMS implementation */ }
}
```

**Benefits:**
- ✅ Can switch database implementations easily
- ✅ Can switch notification methods
- ✅ Easy to test with mocks
- ✅ Loose coupling between layers

---

## 🎯 **SOLID in Action: Complete Example**

```java
// Following all SOLID principles
public interface PaymentProcessor {  // ISP: Focused interface
    PaymentResult processPayment(Payment payment);
}

public interface PaymentValidator {  // ISP: Separate validation interface
    ValidationResult validate(Payment payment);
}

public abstract class Payment {  // LSP: Proper abstraction
    protected final Money amount;
    protected final String merchantId;
    
    public Payment(Money amount, String merchantId) {
        this.amount = amount;
        this.merchantId = merchantId;
    }
    
    public abstract PaymentMethod getPaymentMethod();  // OCP: Extensible
    
    // Common behavior
    public Money getAmount() { return amount; }
    public String getMerchantId() { return merchantId; }
}

public class CreditCardPayment extends Payment {  // LSP: Substitutable
    private final String cardNumber;
    private final String cvv;
    
    public CreditCardPayment(Money amount, String merchantId, String cardNumber, String cvv) {
        super(amount, merchantId);
        this.cardNumber = cardNumber;
        this.cvv = cvv;
    }
    
    @Override
    public PaymentMethod getPaymentMethod() {
        return PaymentMethod.CREDIT_CARD;
    }
    
    public String getCardNumber() { return cardNumber; }
    public String getCvv() { return cvv; }
}

public class PayPalPayment extends Payment {  // OCP: New payment type without modification
    private final String paypalEmail;
    
    public PayPalPayment(Money amount, String merchantId, String paypalEmail) {
        super(amount, merchantId);
        this.paypalEmail = paypalEmail;
    }
    
    @Override
    public PaymentMethod getPaymentMethod() {
        return PaymentMethod.PAYPAL;
    }
    
    public String getPaypalEmail() { return paypalEmail; }
}

public class PaymentService {  // SRP: Only handles payment processing
    private final PaymentProcessor processor;  // DIP: Depends on abstraction
    private final PaymentValidator validator;  // DIP: Depends on abstraction
    
    public PaymentService(PaymentProcessor processor, PaymentValidator validator) {
        this.processor = processor;
        this.validator = validator;
    }
    
    public PaymentResult processPayment(Payment payment) {  // SRP: Single responsibility
        ValidationResult validation = validator.validate(payment);
        if (!validation.isValid()) {
            return PaymentResult.failed(validation.getErrors());
        }
        
        return processor.processPayment(payment);
    }
}
```

---

## 🚀 **Key Takeaways**

### **Why SOLID Matters:**
- 🔧 **Maintainable**: Easy to modify and extend
- 🧪 **Testable**: Easy to unit test with mocks
- 🔄 **Flexible**: Easy to change implementations
- 📈 **Scalable**: Supports growing complexity
- 🐛 **Robust**: Fewer bugs and side effects

### **Remember:**
- **S**: One class, one job
- **O**: Extend, don't modify
- **L**: Subtypes must work like base types
- **I**: Small, focused interfaces
- **D**: Depend on abstractions, not concrete classes

**SOLID principles are the foundation of clean, professional object-oriented design!** 🏗️✨

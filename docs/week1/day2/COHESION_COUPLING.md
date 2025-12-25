# Cohesion & Coupling Guide

## 🎯 **What are Cohesion & Coupling?**

**Cohesion** and **Coupling** are the **two most important metrics** for measuring the quality of object-oriented design.

- **Cohesion**: How **related** are the responsibilities within a class?
- **Coupling**: How **dependent** are classes on each other?

**Goal**: **High Cohesion** + **Low Coupling** = **Excellent Design** ✨

---

## 🔗 **Coupling - "How Connected Are Classes?"**

### **Definition:**
> **Coupling** measures the degree of **interdependence** between classes.

### **Types of Coupling (Worst to Best):**

#### **1. Content Coupling (Worst) 🔴**
One class directly modifies another class's internal data.

```java
// BAD: Content Coupling
public class BankAccount {
    public double balance;  // Public field - dangerous!
}

public class ATM {
    public void withdraw(BankAccount account, double amount) {
        account.balance -= amount;  // Directly modifying internal data!
        // No validation, no business rules
    }
}
```

**Problems:**
- No encapsulation
- No validation
- Breaks easily when BankAccount changes

#### **2. Common Coupling 🟠**
Multiple classes share global data.

```java
// BAD: Common Coupling via global state
public class GlobalConfig {
    public static String DATABASE_URL = "localhost:5432";
    public static int MAX_CONNECTIONS = 100;
    public static boolean DEBUG_MODE = true;
}

public class UserService {
    public void createUser(User user) {
        if (GlobalConfig.DEBUG_MODE) {  // Depends on global state
            System.out.println("Creating user: " + user.getName());
        }
        // Connect using GlobalConfig.DATABASE_URL
    }
}

public class OrderService {
    public void processOrder(Order order) {
        if (GlobalConfig.DEBUG_MODE) {  // Same global dependency
            System.out.println("Processing order: " + order.getId());
        }
    }
}
```

**Problems:**
- Hidden dependencies
- Hard to test
- Changes affect multiple classes

#### **3. Control Coupling 🟡**
One class controls the behavior of another by passing control flags.

```java
// BAD: Control Coupling
public class ReportGenerator {
    public void generateReport(String data, int reportType) {
        if (reportType == 1) {
            generatePDFReport(data);
        } else if (reportType == 2) {
            generateExcelReport(data);
        } else if (reportType == 3) {
            generateCSVReport(data);
        }
        // Caller controls internal behavior
    }
}

public class ReportService {
    public void createMonthlyReport() {
        ReportGenerator generator = new ReportGenerator();
        generator.generateReport(data, 1);  // Controlling behavior with flag
    }
}
```

**Problems:**
- Caller knows too much about internal implementation
- Hard to extend
- Violates encapsulation

#### **4. Stamp Coupling 🟡**
Classes share composite data structures, but only use parts of them.

```java
// BAD: Stamp Coupling
public class Employee {
    private String name;
    private String address;
    private String phone;
    private double salary;
    private String department;
    private Date hireDate;
    // ... many more fields
}

public class PayrollCalculator {
    public double calculateTax(Employee employee) {
        // Only needs salary, but receives entire Employee object
        return employee.getSalary() * 0.25;
    }
}

public class AddressValidator {
    public boolean validateAddress(Employee employee) {
        // Only needs address, but receives entire Employee object
        return employee.getAddress() != null && !employee.getAddress().isEmpty();
    }
}
```

**Problems:**
- Unnecessary dependencies
- Changes to Employee affect unrelated classes
- Hard to understand what data is actually needed

#### **5. Data Coupling (Best) 🟢**
Classes communicate through simple data parameters.

```java
// GOOD: Data Coupling
public class PayrollCalculator {
    public double calculateTax(double salary) {  // Only needs salary
        return salary * 0.25;
    }
    
    public double calculateNetPay(double salary, double deductions) {  // Simple parameters
        return salary - deductions - calculateTax(salary);
    }
}

public class AddressValidator {
    public boolean isValidAddress(String address) {  // Only needs address string
        return address != null && !address.trim().isEmpty() && address.length() > 5;
    }
}

public class PayrollService {
    private PayrollCalculator calculator = new PayrollCalculator();
    private AddressValidator validator = new AddressValidator();
    
    public PayrollResult processPayroll(Employee employee) {
        // Pass only required data
        double netPay = calculator.calculateNetPay(employee.getSalary(), employee.getDeductions());
        boolean validAddress = validator.isValidAddress(employee.getAddress());
        
        return new PayrollResult(netPay, validAddress);
    }
}
```

**Benefits:**
- ✅ Minimal dependencies
- ✅ Easy to test
- ✅ Clear interfaces
- ✅ Easy to change

---

## 🧩 **Cohesion - "How Related Are Responsibilities?"**

### **Definition:**
> **Cohesion** measures how **closely related** the responsibilities within a class are.

### **Types of Cohesion (Worst to Best):**

#### **1. Coincidental Cohesion (Worst) 🔴**
Unrelated responsibilities grouped together randomly.

```java
// BAD: Coincidental Cohesion
public class Utilities {
    public void sendEmail(String to, String subject, String body) {
        // Email sending logic
    }
    
    public double calculateTax(double income) {
        // Tax calculation logic
    }
    
    public void saveToFile(String filename, String data) {
        // File I/O logic
    }
    
    public String formatDate(Date date) {
        // Date formatting logic
    }
    
    public void connectToDatabase() {
        // Database connection logic
    }
}
```

**Problems:**
- No logical relationship between methods
- Hard to understand and maintain
- Changes for one feature affect unrelated features

#### **2. Logical Cohesion 🟠**
Similar operations grouped together, but serve different purposes.

```java
// BAD: Logical Cohesion
public class InputHandler {
    public void handleInput(String input, int inputType) {
        if (inputType == 1) {
            handleKeyboardInput(input);
        } else if (inputType == 2) {
            handleMouseInput(input);
        } else if (inputType == 3) {
            handleTouchInput(input);
        } else if (inputType == 4) {
            handleVoiceInput(input);
        }
    }
    
    private void handleKeyboardInput(String input) { /* ... */ }
    private void handleMouseInput(String input) { /* ... */ }
    private void handleTouchInput(String input) { /* ... */ }
    private void handleVoiceInput(String input) { /* ... */ }
}
```

**Problems:**
- Methods are logically similar but functionally different
- Control coupling (flags determine behavior)
- Hard to extend

#### **3. Temporal Cohesion 🟡**
Operations grouped because they happen at the same time.

```java
// BAD: Temporal Cohesion
public class SystemInitializer {
    public void initialize() {
        connectToDatabase();      // Database initialization
        loadConfiguration();     // Config initialization  
        startWebServer();        // Server initialization
        initializeLogging();     // Logging initialization
        setupSecurityContext(); // Security initialization
        preloadCache();          // Cache initialization
    }
    
    // All these methods are unrelated except they run during startup
}
```

**Problems:**
- Methods are related only by timing
- Mixed responsibilities
- Hard to test individual components

#### **4. Procedural Cohesion 🟡**
Operations grouped because they follow a sequence in a procedure.

```java
// BAD: Procedural Cohesion
public class OrderProcessor {
    public void processOrder(Order order) {
        validateCustomer(order.getCustomerId());     // Step 1
        checkInventory(order.getItems());            // Step 2
        calculatePricing(order);                     // Step 3
        processPayment(order.getPayment());          // Step 4
        updateInventory(order.getItems());           // Step 5
        sendConfirmationEmail(order.getCustomer());  // Step 6
        generateInvoice(order);                      // Step 7
    }
    
    // Methods are related only by the sequence they're called
}
```

**Problems:**
- Methods are related only by execution order
- Mixed levels of abstraction
- Hard to reuse individual steps

#### **5. Communicational Cohesion 🟢**
Operations grouped because they work on the same data.

```java
// GOOD: Communicational Cohesion
public class CustomerAccount {
    private String customerId;
    private String name;
    private String email;
    private AccountStatus status;
    
    // All methods work on customer account data
    public void updateContactInfo(String name, String email) {
        this.name = name;
        this.email = email;
    }
    
    public void activate() {
        this.status = AccountStatus.ACTIVE;
    }
    
    public void deactivate() {
        this.status = AccountStatus.INACTIVE;
    }
    
    public boolean isActive() {
        return status == AccountStatus.ACTIVE;
    }
    
    public String getDisplayName() {
        return name + " (" + customerId + ")";
    }
}
```

**Benefits:**
- ✅ All methods work on related data
- ✅ Clear responsibility boundary
- ✅ Easy to understand and maintain

#### **6. Functional Cohesion (Best) 🟢**
All operations contribute to a single, well-defined task.

```java
// EXCELLENT: Functional Cohesion
public class TaxCalculator {
    // Single responsibility: Calculate taxes
    
    public Money calculateIncomeTax(Money income, TaxBracket bracket) {
        return income.multiply(bracket.getRate());
    }
    
    public Money calculateSalesTax(Money amount, BigDecimal rate) {
        return amount.multiply(rate);
    }
    
    public Money calculatePropertyTax(Money propertyValue, BigDecimal rate) {
        return propertyValue.multiply(rate);
    }
    
    public TaxSummary calculateTotalTax(TaxableIncome income) {
        Money incomeTax = calculateIncomeTax(income.getGrossIncome(), income.getTaxBracket());
        Money salesTax = calculateSalesTax(income.getPurchases(), income.getSalesTaxRate());
        Money propertyTax = calculatePropertyTax(income.getPropertyValue(), income.getPropertyTaxRate());
        
        return new TaxSummary(incomeTax, salesTax, propertyTax);
    }
}

public class EmailService {
    // Single responsibility: Send emails
    
    public void sendWelcomeEmail(User user) {
        String subject = "Welcome to our platform!";
        String body = createWelcomeEmailBody(user);
        sendEmail(user.getEmail(), subject, body);
    }
    
    public void sendPasswordResetEmail(User user, String resetToken) {
        String subject = "Password Reset Request";
        String body = createPasswordResetEmailBody(user, resetToken);
        sendEmail(user.getEmail(), subject, body);
    }
    
    public void sendOrderConfirmationEmail(Order order) {
        String subject = "Order Confirmation - " + order.getId();
        String body = createOrderConfirmationEmailBody(order);
        sendEmail(order.getCustomer().getEmail(), subject, body);
    }
    
    private void sendEmail(String to, String subject, String body) {
        // Actual email sending logic
    }
}
```

**Benefits:**
- ✅ Single, clear purpose
- ✅ All methods contribute to the same goal
- ✅ Easy to understand, test, and maintain
- ✅ High reusability

---

## 📊 **Measuring Cohesion & Coupling**

### **Cohesion Metrics:**
```java
// LOW COHESION - Mixed responsibilities
public class UserManager {
    public void createUser(User user) { }          // User management
    public void sendEmail(String email) { }       // Email functionality  
    public void logActivity(String activity) { }  // Logging functionality
    public void validateInput(String input) { }   // Validation functionality
}

// HIGH COHESION - Single responsibility
public class UserService {
    public void createUser(User user) { }
    public void updateUser(User user) { }
    public void deleteUser(String userId) { }
    public User findUser(String userId) { }
}
```

### **Coupling Metrics:**
```java
// HIGH COUPLING - Many dependencies
public class OrderService {
    private MySQLDatabase database;           // Concrete dependency
    private SMTPEmailSender emailSender;     // Concrete dependency
    private StripePaymentGateway gateway;    // Concrete dependency
    private AmazonS3FileStorage storage;     // Concrete dependency
    // Changes to any of these affect OrderService
}

// LOW COUPLING - Abstract dependencies
public class OrderService {
    private OrderRepository repository;       // Abstract dependency
    private NotificationService notifier;    // Abstract dependency
    private PaymentGateway paymentGateway;   // Abstract dependency
    private FileStorage fileStorage;         // Abstract dependency
    // Can easily swap implementations
}
```

---

## 🎯 **Practical Examples**

### **Before: Poor Cohesion & High Coupling**
```java
// BAD DESIGN
public class UserController {
    // HIGH COUPLING - direct dependencies on concrete classes
    private MySQLUserRepository userRepo = new MySQLUserRepository();
    private SMTPEmailService emailService = new SMTPEmailService();
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private AuditLogger auditLogger = new AuditLogger();
    
    // LOW COHESION - mixed responsibilities
    public void createUser(String name, String email, String password) {
        // Validation logic
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        
        // Password encoding logic
        String hashedPassword = encoder.encode(password);
        
        // User creation logic
        User user = new User(name, email, hashedPassword);
        userRepo.save(user);
        
        // Email sending logic
        emailService.sendWelcomeEmail(email, name);
        
        // Audit logging logic
        auditLogger.log("User created: " + email);
        
        // File system logic
        createUserDirectory("/users/" + user.getId());
    }
    
    private void createUserDirectory(String path) {
        // File system operations
    }
}
```

### **After: High Cohesion & Low Coupling**
```java
// GOOD DESIGN
public class UserController {
    // LOW COUPLING - depends on abstractions
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    // HIGH COHESION - only handles HTTP concerns
    @PostMapping("/users")
    public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest request) {
        try {
            User user = userService.createUser(request.getName(), request.getEmail(), request.getPassword());
            return ResponseEntity.ok(new UserResponse(user));
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}

public class UserService {
    // LOW COUPLING - depends on abstractions
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;
    
    public UserService(UserRepository userRepository, 
                      NotificationService notificationService,
                      PasswordEncoder passwordEncoder,
                      AuditService auditService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }
    
    // HIGH COHESION - only handles user business logic
    public User createUser(String name, String email, String password) {
        validateUserInput(name, email, password);
        
        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(name, email, hashedPassword);
        
        User savedUser = userRepository.save(user);
        
        notificationService.sendWelcomeNotification(savedUser);
        auditService.logUserCreation(savedUser);
        
        return savedUser;
    }
    
    private void validateUserInput(String name, String email, String password) {
        // Validation logic
    }
}

public class EmailNotificationService implements NotificationService {
    // HIGH COHESION - only handles email notifications
    public void sendWelcomeNotification(User user) {
        String subject = "Welcome!";
        String body = createWelcomeEmailBody(user);
        sendEmail(user.getEmail(), subject, body);
    }
}
```

---

## 🚀 **Design Guidelines**

### **For High Cohesion:**
- ✅ **Single Responsibility**: Each class should have one reason to change
- ✅ **Related Operations**: Group operations that work on the same data
- ✅ **Clear Purpose**: Class name should clearly indicate its responsibility
- ✅ **Focused Interface**: All public methods should serve the same goal

### **For Low Coupling:**
- ✅ **Depend on Abstractions**: Use interfaces instead of concrete classes
- ✅ **Dependency Injection**: Don't create dependencies, receive them
- ✅ **Minimal Interfaces**: Pass only the data that's needed
- ✅ **Avoid Global State**: Don't use static variables for shared data

### **Red Flags:**
- ❌ **God Classes**: Classes with too many responsibilities
- ❌ **Feature Envy**: Methods that use more data from other classes
- ❌ **Long Parameter Lists**: Methods that need too much data
- ❌ **Shotgun Surgery**: Changes that require modifying many classes

---

## 🎯 **Key Takeaways**

### **The Golden Rule:**
```
HIGH COHESION + LOW COUPLING = MAINTAINABLE CODE
```

### **Benefits:**
- 🔧 **Maintainable**: Easy to modify and extend
- 🧪 **Testable**: Easy to unit test in isolation
- 🔄 **Reusable**: Components can be used in different contexts
- 🐛 **Reliable**: Changes have minimal ripple effects
- 📖 **Readable**: Clear responsibilities and relationships

### **Remember:**
- **Cohesion**: "Do these things belong together?"
- **Coupling**: "How much do these classes depend on each other?"
- **Goal**: Classes that do one thing well and depend on abstractions

**Cohesion and Coupling are the foundation of excellent object-oriented design!** 🏗️✨


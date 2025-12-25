# GRASP Principles Guide

## 🎯 **What are GRASP Principles?**

**GRASP** stands for **General Responsibility Assignment Software Patterns**. These are **9 fundamental principles** for assigning responsibilities to classes and objects in object-oriented design.

**Created by:** Craig Larman  
**Purpose:** Guide decisions about **WHO** should be responsible for **WHAT** in your system

---

## 🤝 **GRASP vs SOLID**

| **GRASP** | **SOLID** |
|-----------|-----------|
| **WHO** should do **WHAT** | **HOW** to structure code |
| Responsibility assignment | Code organization principles |
| Design decision guidance | Code quality principles |
| **Complements** SOLID | **Complements** GRASP |

**They work together!** GRASP helps you decide responsibilities, SOLID helps you implement them cleanly.

---

## 📋 **The 9 GRASP Principles**

| # | Principle | Core Question |
|---|-----------|---------------|
| 1 | **Information Expert** | Who has the information needed? |
| 2 | **Creator** | Who should create this object? |
| 3 | **Controller** | Who handles system events? |
| 4 | **Low Coupling** | How to minimize dependencies? |
| 5 | **High Cohesion** | How to keep responsibilities focused? |
| 6 | **Polymorphism** | How to handle type variations? |
| 7 | **Pure Fabrication** | What if no natural class fits? |
| 8 | **Indirection** | How to avoid direct coupling? |
| 9 | **Protected Variations** | How to shield from changes? |

---

## 1️⃣ **Information Expert**

### **Principle:**
> "Assign responsibility to the class that has the information needed to fulfill it."

### **Question:** Who knows best?

### **Example:**
```java
// BAD: OrderService calculates total, but doesn't have item details
public class OrderService {
    public Money calculateTotal(Order order) {
        Money total = Money.ZERO;
        for (OrderItem item : order.getItems()) {
            // OrderService doesn't know item pricing logic!
            total = total.add(item.getPrice().multiply(item.getQuantity()));
        }
        return total;
    }
}

// GOOD: Order has the information, so it calculates
public class Order {
    private List<OrderItem> items;
    
    public Money calculateTotal() {  // Order is the Information Expert
        return items.stream()
                   .map(OrderItem::getSubtotal)  // Each item knows its subtotal
                   .reduce(Money.ZERO, Money::add);
    }
}

public class OrderItem {
    private Money price;
    private int quantity;
    
    public Money getSubtotal() {  // OrderItem is expert on its own subtotal
        return price.multiply(quantity);
    }
}
```

**Benefits:**
- ✅ Logic is where the data is
- ✅ Encapsulation is maintained
- ✅ Changes are localized

---

## 2️⃣ **Creator**

### **Principle:**
> "Assign creation responsibility to a class that aggregates, contains, or closely uses the created objects."

### **Question:** Who should create this object?

### **Example:**
```java
// BAD: Random class creates objects it doesn't use
public class ObjectFactory {
    public OrderItem createOrderItem(String productId, int quantity) {
        // Factory doesn't know about Order context
        return new OrderItem(productId, quantity);
    }
}

// GOOD: Order creates OrderItems (it contains them)
public class Order {
    private List<OrderItem> items = new ArrayList<>();
    
    public void addItem(String productId, int quantity, Money price) {
        // Order is the Creator - it contains OrderItems
        OrderItem item = new OrderItem(productId, quantity, price);
        items.add(item);
    }
}

// GOOD: ShoppingCart creates Orders (it closely uses them)
public class ShoppingCart {
    private List<CartItem> items;
    
    public Order checkout(String customerId) {
        // ShoppingCart is the Creator - it closely uses Order
        Order order = new Order(customerId);
        for (CartItem cartItem : items) {
            order.addItem(cartItem.getProductId(), cartItem.getQuantity(), cartItem.getPrice());
        }
        return order;
    }
}
```

**Benefits:**
- ✅ Natural object relationships
- ✅ Clear ownership
- ✅ Logical creation flow

---

## 3️⃣ **Controller**

### **Principle:**
> "Assign responsibility for handling system events to a controller class."

### **Question:** Who coordinates system operations?

### **Example:**
```java
// BAD: UI directly manipulates domain objects
public class OrderUI {
    public void processOrder(String customerId, List<CartItem> items) {
        // UI doing business logic - BAD!
        Customer customer = customerRepository.findById(customerId);
        Order order = new Order(customer);
        for (CartItem item : items) {
            order.addItem(item);
        }
        orderRepository.save(order);
        emailService.sendConfirmation(order);
    }
}

// GOOD: Controller handles system operations
public class OrderController {  // System Controller
    private OrderService orderService;
    
    public void processOrder(String customerId, List<CartItem> items) {
        // Controller delegates to appropriate services
        orderService.createOrder(customerId, items);
    }
}

public class OrderService {  // Use Case Controller
    private CustomerRepository customerRepository;
    private OrderRepository orderRepository;
    private EmailService emailService;
    
    public Order createOrder(String customerId, List<CartItem> items) {
        Customer customer = customerRepository.findById(customerId);
        Order order = new Order(customer);
        
        for (CartItem item : items) {
            order.addItem(item.getProductId(), item.getQuantity(), item.getPrice());
        }
        
        orderRepository.save(order);
        emailService.sendConfirmation(order);
        return order;
    }
}
```

**Benefits:**
- ✅ Separation of concerns
- ✅ Reusable business logic
- ✅ Testable operations

---

## 4️⃣ **Low Coupling**

### **Principle:**
> "Minimize dependencies between classes."

### **Question:** How can we reduce dependencies?

### **Example:**
```java
// BAD: High coupling - Order directly depends on concrete classes
public class Order {
    private EmailSender emailSender = new EmailSender();  // Tight coupling!
    private MySQLDatabase database = new MySQLDatabase();  // Tight coupling!
    
    public void save() {
        database.save(this);  // Coupled to MySQL
        emailSender.sendConfirmation(this);  // Coupled to Email
    }
}

// GOOD: Low coupling - Order depends on abstractions
public class Order {
    // No direct dependencies on external services
    private String id;
    private String customerId;
    private List<OrderItem> items;
    
    // Pure domain logic only
    public Money calculateTotal() {
        return items.stream()
                   .map(OrderItem::getSubtotal)
                   .reduce(Money.ZERO, Money::add);
    }
}

public class OrderService {  // Service handles external dependencies
    private OrderRepository repository;  // Interface - low coupling
    private NotificationService notificationService;  // Interface - low coupling
    
    public void saveOrder(Order order) {
        repository.save(order);
        notificationService.sendOrderConfirmation(order);
    }
}
```

**Benefits:**
- ✅ Easy to change implementations
- ✅ Easy to test
- ✅ Reduced ripple effects

---

## 5️⃣ **High Cohesion**

### **Principle:**
> "Keep related responsibilities together in a class."

### **Question:** Do these responsibilities belong together?

### **Example:**
```java
// BAD: Low cohesion - unrelated responsibilities
public class UserManager {
    // User management
    public void createUser(String name) { }
    public void deleteUser(String id) { }
    
    // Email sending - unrelated!
    public void sendEmail(String to, String subject) { }
    
    // File operations - unrelated!
    public void saveToFile(String data) { }
    
    // Database operations - unrelated!
    public void backupDatabase() { }
}

// GOOD: High cohesion - related responsibilities together
public class User {  // User data and behavior
    private String id;
    private String name;
    private String email;
    
    public void updateProfile(String name, String email) {
        this.name = name;
        this.email = email;
    }
    
    public boolean isActive() {
        return status == UserStatus.ACTIVE;
    }
}

public class UserService {  // User business operations
    private UserRepository repository;
    
    public User createUser(String name, String email) {
        User user = new User(name, email);
        return repository.save(user);
    }
    
    public void deactivateUser(String userId) {
        User user = repository.findById(userId);
        user.deactivate();
        repository.save(user);
    }
}

public class EmailService {  // Email-related operations only
    public void sendWelcomeEmail(User user) { }
    public void sendPasswordReset(User user) { }
}
```

**Benefits:**
- ✅ Easy to understand
- ✅ Easy to maintain
- ✅ Focused responsibilities

---

## 6️⃣ **Polymorphism**

### **Principle:**
> "Use polymorphism to handle variations in behavior."

### **Question:** How to handle different types without if-else chains?

### **Example:**
```java
// BAD: Type checking with if-else
public class PaymentProcessor {
    public void processPayment(Payment payment) {
        if (payment.getType() == PaymentType.CREDIT_CARD) {
            // Credit card processing logic
            processCreditCard((CreditCardPayment) payment);
        } else if (payment.getType() == PaymentType.PAYPAL) {
            // PayPal processing logic
            processPayPal((PayPalPayment) payment);
        } else if (payment.getType() == PaymentType.BANK_TRANSFER) {
            // Bank transfer logic
            processBankTransfer((BankTransferPayment) payment);
        }
        // Need to add more if-else for new payment types!
    }
}

// GOOD: Polymorphism handles variations
public abstract class Payment {
    protected Money amount;
    
    public abstract PaymentResult process();  // Polymorphic method
    
    public Money getAmount() { return amount; }
}

public class CreditCardPayment extends Payment {
    private String cardNumber;
    private String cvv;
    
    @Override
    public PaymentResult process() {
        // Credit card specific processing
        return CreditCardGateway.charge(cardNumber, cvv, amount);
    }
}

public class PayPalPayment extends Payment {
    private String paypalEmail;
    
    @Override
    public PaymentResult process() {
        // PayPal specific processing
        return PayPalGateway.charge(paypalEmail, amount);
    }
}

public class PaymentProcessor {
    public PaymentResult processPayment(Payment payment) {
        // Polymorphism - no if-else needed!
        return payment.process();
    }
}
```

**Benefits:**
- ✅ No type checking code
- ✅ Easy to add new types
- ✅ Clean, extensible design

---

## 7️⃣ **Pure Fabrication**

### **Principle:**
> "Create artificial classes when no natural domain class fits the responsibility."

### **Question:** What if no existing class should have this responsibility?

### **Example:**
```java
// PROBLEM: Where should database persistence logic go?
// - User class? No, it's domain logic, not persistence
// - Database class? Too generic
// - Need a "fabricated" class!

// GOOD: Pure Fabrication - UserRepository
public class User {  // Pure domain class
    private String id;
    private String name;
    private String email;
    
    // Only domain behavior, no persistence
    public void updateProfile(String name, String email) {
        this.name = name;
        this.email = email;
    }
}

public class UserRepository {  // Pure Fabrication - artificial class
    // Exists solely to handle User persistence
    // Not a real-world domain concept, but necessary for design
    
    public User save(User user) {
        // Database persistence logic
        return database.save(user);
    }
    
    public User findById(String id) {
        return database.findById(id);
    }
    
    public List<User> findByEmail(String email) {
        return database.findByEmail(email);
    }
}

// Another example: Service classes are often Pure Fabrications
public class OrderProcessingService {  // Pure Fabrication
    // Coordinates multiple domain objects
    // Not a real-world thing, but necessary for orchestration
    
    public void processOrder(Order order) {
        validateOrder(order);
        reserveInventory(order);
        processPayment(order);
        scheduleShipping(order);
    }
}
```

**Benefits:**
- ✅ Keeps domain classes clean
- ✅ Provides necessary functionality
- ✅ Maintains separation of concerns

---

## 8️⃣ **Indirection**

### **Principle:**
> "Add an intermediate object to decouple components."

### **Question:** How to avoid direct dependencies?

### **Example:**
```java
// BAD: Direct coupling
public class OrderService {
    private EmailSender emailSender = new EmailSender();  // Direct dependency
    
    public void processOrder(Order order) {
        // Process order...
        emailSender.sendConfirmation(order.getCustomerEmail(), order);  // Direct call
    }
}

// GOOD: Indirection through interface
public interface NotificationService {  // Indirection layer
    void sendOrderConfirmation(Order order);
}

public class OrderService {
    private NotificationService notificationService;  // Indirect dependency
    
    public OrderService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    public void processOrder(Order order) {
        // Process order...
        notificationService.sendOrderConfirmation(order);  // Indirect call
    }
}

// Multiple implementations possible
public class EmailNotificationService implements NotificationService {
    @Override
    public void sendOrderConfirmation(Order order) {
        // Email implementation
    }
}

public class SMSNotificationService implements NotificationService {
    @Override
    public void sendOrderConfirmation(Order order) {
        // SMS implementation
    }
}
```

**Benefits:**
- ✅ Loose coupling
- ✅ Easy to swap implementations
- ✅ Better testability

---

## 9️⃣ **Protected Variations**

### **Principle:**
> "Identify points of likely change and create stable interfaces around them."

### **Question:** What might change, and how can we protect against it?

### **Example:**
```java
// PROBLEM: Payment processing might change (new providers, new methods)
// SOLUTION: Create stable interface to protect against variations

// Stable interface protects against payment provider changes
public interface PaymentGateway {
    PaymentResult processPayment(PaymentRequest request);
    RefundResult processRefund(RefundRequest request);
}

// Protected from variations in payment providers
public class PaymentService {
    private PaymentGateway gateway;  // Stable interface
    
    public PaymentResult processPayment(Order order) {
        PaymentRequest request = createPaymentRequest(order);
        return gateway.processPayment(request);  // Protected from provider changes
    }
}

// Variations can be added without affecting PaymentService
public class StripePaymentGateway implements PaymentGateway {
    @Override
    public PaymentResult processPayment(PaymentRequest request) {
        // Stripe-specific implementation
    }
}

public class PayPalPaymentGateway implements PaymentGateway {
    @Override
    public PaymentResult processPayment(PaymentRequest request) {
        // PayPal-specific implementation
    }
}

// Another example: Database variations
public interface OrderRepository {  // Protects against database changes
    Order save(Order order);
    Order findById(String id);
    List<Order> findByCustomerId(String customerId);
}

// Can switch databases without affecting business logic
public class MySQLOrderRepository implements OrderRepository { }
public class PostgreSQLOrderRepository implements OrderRepository { }
public class MongoOrderRepository implements OrderRepository { }
```

**Benefits:**
- ✅ Shields from external changes
- ✅ Easy to add new variations
- ✅ Stable core business logic

---

## 🤝 **GRASP + SOLID Working Together**

### **Example: Complete Design**
```java
// GRASP: Information Expert + Creator
// SOLID: Single Responsibility
public class Order {
    private String id;
    private String customerId;
    private List<OrderItem> items = new ArrayList<>();
    
    // GRASP: Creator - Order creates OrderItems
    public void addItem(String productId, int quantity, Money price) {
        OrderItem item = new OrderItem(productId, quantity, price);
        items.add(item);
    }
    
    // GRASP: Information Expert - Order knows its items
    public Money calculateTotal() {
        return items.stream()
                   .map(OrderItem::getSubtotal)
                   .reduce(Money.ZERO, Money::add);
    }
}

// GRASP: Controller + Pure Fabrication
// SOLID: Single Responsibility + Dependency Inversion
public class OrderService {
    private final OrderRepository repository;  // SOLID: DIP
    private final NotificationService notificationService;  // GRASP: Indirection
    
    public OrderService(OrderRepository repository, NotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }
    
    // GRASP: Controller - handles system operations
    public Order createOrder(String customerId, List<CartItem> items) {
        Order order = new Order(customerId);  // GRASP: Creator
        
        for (CartItem item : items) {
            order.addItem(item.getProductId(), item.getQuantity(), item.getPrice());
        }
        
        repository.save(order);
        notificationService.sendOrderConfirmation(order);
        return order;
    }
}

// GRASP: Protected Variations
// SOLID: Interface Segregation + Open/Closed
public interface NotificationService {
    void sendOrderConfirmation(Order order);
}

// GRASP: Polymorphism
// SOLID: Liskov Substitution
public class EmailNotificationService implements NotificationService {
    @Override
    public void sendOrderConfirmation(Order order) {
        // Email implementation
    }
}
```

---

## 🚀 **Key Takeaways**

### **GRASP Helps You Decide:**
- 🎯 **WHO** should be responsible for **WHAT**
- 🏗️ **WHERE** to put new functionality
- 🔗 **HOW** to assign responsibilities properly

### **Remember the Questions:**
1. **Information Expert**: Who has the data?
2. **Creator**: Who should create this?
3. **Controller**: Who handles system events?
4. **Low Coupling**: How to minimize dependencies?
5. **High Cohesion**: Do these belong together?
6. **Polymorphism**: How to handle variations?
7. **Pure Fabrication**: Need an artificial class?
8. **Indirection**: How to decouple?
9. **Protected Variations**: What might change?

**GRASP + SOLID = Excellent Object-Oriented Design!** 🎯✨

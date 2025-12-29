# Day 8: Behavioral Patterns 🔄

**Focus**: Master patterns for effective communication between objects and algorithms.

---

## 🎯 **Learning Objectives**

By the end of Day 8, you will:
- **Implement** Strategy, State, Template Method, Chain of Responsibility, Observer, Command, Iterator, Mediator, Memento, and Visitor patterns
- **Choose** the right behavioral pattern for different scenarios
- **Combine** behavioral patterns with other patterns

---

## 📚 **Patterns Covered**

### **1. Strategy Pattern** 🎯
**Problem**: Need to switch algorithms at runtime
**Solution**: Encapsulate algorithms in interchangeable classes

```java
// Strategy interface
public interface PricingStrategy {
    Money calculatePrice(Order order);
}

// Concrete strategies
public class RegularPricing implements PricingStrategy {
    @Override
    public Money calculatePrice(Order order) {
        return order.getSubtotal();
    }
}

public class PremiumMemberPricing implements PricingStrategy {
    private static final BigDecimal DISCOUNT = new BigDecimal("0.10");
    
    @Override
    public Money calculatePrice(Order order) {
        return order.getSubtotal().multiply(BigDecimal.ONE.subtract(DISCOUNT));
    }
}

public class HolidayPricing implements PricingStrategy {
    private static final BigDecimal DISCOUNT = new BigDecimal("0.20");
    
    @Override
    public Money calculatePrice(Order order) {
        Money subtotal = order.getSubtotal();
        if (subtotal.isGreaterThan(Money.dollars(100))) {
            return subtotal.multiply(BigDecimal.ONE.subtract(DISCOUNT));
        }
        return subtotal;
    }
}

// Context
public class ShoppingCart {
    private PricingStrategy pricingStrategy;
    private List<CartItem> items = new ArrayList<>();
    
    public void setPricingStrategy(PricingStrategy strategy) {
        this.pricingStrategy = strategy;
    }
    
    public Money calculateTotal() {
        Order order = createOrder();
        return pricingStrategy.calculatePrice(order);
    }
}

// Usage
ShoppingCart cart = new ShoppingCart();
cart.setPricingStrategy(new PremiumMemberPricing());
Money total = cart.calculateTotal();
```

---

### **2. State Pattern** 🔄
**Problem**: Object behavior changes based on internal state
**Solution**: Encapsulate states in separate classes

```java
// State interface
public interface OrderState {
    void confirm(Order order);
    void ship(Order order);
    void deliver(Order order);
    void cancel(Order order);
    String getStatus();
}

// Concrete states
public class PendingState implements OrderState {
    @Override
    public void confirm(Order order) {
        System.out.println("Order confirmed");
        order.setState(new ConfirmedState());
    }
    
    @Override
    public void ship(Order order) {
        throw new IllegalStateException("Cannot ship pending order");
    }
    
    @Override
    public void deliver(Order order) {
        throw new IllegalStateException("Cannot deliver pending order");
    }
    
    @Override
    public void cancel(Order order) {
        System.out.println("Order cancelled");
        order.setState(new CancelledState());
    }
    
    @Override
    public String getStatus() { return "PENDING"; }
}

public class ConfirmedState implements OrderState {
    @Override
    public void confirm(Order order) {
        throw new IllegalStateException("Order already confirmed");
    }
    
    @Override
    public void ship(Order order) {
        System.out.println("Order shipped");
        order.setState(new ShippedState());
    }
    
    @Override
    public void deliver(Order order) {
        throw new IllegalStateException("Cannot deliver before shipping");
    }
    
    @Override
    public void cancel(Order order) {
        System.out.println("Order cancelled, refund initiated");
        order.setState(new CancelledState());
    }
    
    @Override
    public String getStatus() { return "CONFIRMED"; }
}

// Context
public class Order {
    private OrderState state = new PendingState();
    private final OrderId id;
    
    public void confirm() { state.confirm(this); }
    public void ship() { state.ship(this); }
    public void deliver() { state.deliver(this); }
    public void cancel() { state.cancel(this); }
    
    void setState(OrderState state) {
        this.state = state;
    }
    
    public String getStatus() {
        return state.getStatus();
    }
}
```

---

### **3. Template Method Pattern** 📝
**Problem**: Define algorithm skeleton, let subclasses fill in steps
**Solution**: Abstract class with template method and hook methods

```java
// Abstract class with template method
public abstract class OrderProcessor {
    
    // Template method - defines the algorithm
    public final void processOrder(Order order) {
        validateOrder(order);
        calculateTotal(order);
        applyDiscounts(order);
        processPayment(order);
        updateInventory(order);
        sendConfirmation(order);
        afterProcessing(order); // Hook method
    }
    
    // Abstract methods - must be implemented
    protected abstract void processPayment(Order order);
    protected abstract void updateInventory(Order order);
    
    // Concrete methods - default implementation
    protected void validateOrder(Order order) {
        if (order.getItems().isEmpty()) {
            throw new ValidationException("Order must have items");
        }
    }
    
    protected void calculateTotal(Order order) {
        Money total = order.getItems().stream()
            .map(item -> item.getPrice().multiply(item.getQuantity()))
            .reduce(Money.ZERO, Money::add);
        order.setTotal(total);
    }
    
    protected void applyDiscounts(Order order) {
        // Default: no discounts
    }
    
    protected void sendConfirmation(Order order) {
        System.out.println("Sending confirmation for order " + order.getId());
    }
    
    // Hook method - optional override
    protected void afterProcessing(Order order) {
        // Default: do nothing
    }
}

// Concrete implementations
public class OnlineOrderProcessor extends OrderProcessor {
    
    private final PaymentGateway paymentGateway;
    private final InventoryService inventoryService;
    
    @Override
    protected void processPayment(Order order) {
        paymentGateway.charge(order.getTotal(), order.getPaymentDetails());
    }
    
    @Override
    protected void updateInventory(Order order) {
        for (OrderItem item : order.getItems()) {
            inventoryService.reserve(item.getProductId(), item.getQuantity());
        }
    }
    
    @Override
    protected void applyDiscounts(Order order) {
        // Apply online-specific discounts
        if (order.getTotal().isGreaterThan(Money.dollars(100))) {
            order.applyDiscount(new BigDecimal("0.05"));
        }
    }
}

public class InStoreOrderProcessor extends OrderProcessor {
    
    @Override
    protected void processPayment(Order order) {
        // Payment handled at POS
        System.out.println("Payment collected at register");
    }
    
    @Override
    protected void updateInventory(Order order) {
        // Immediate deduction
        for (OrderItem item : order.getItems()) {
            inventoryService.deduct(item.getProductId(), item.getQuantity());
        }
    }
    
    @Override
    protected void sendConfirmation(Order order) {
        // Print receipt instead of email
        receiptPrinter.print(order);
    }
}
```

---

### **4. Chain of Responsibility** ⛓️
**Problem**: Pass request along a chain of handlers
**Solution**: Chain of handlers that can process or forward requests

```java
// Handler interface
public abstract class SupportHandler {
    protected SupportHandler nextHandler;
    
    public void setNext(SupportHandler handler) {
        this.nextHandler = handler;
    }
    
    public abstract void handle(SupportTicket ticket);
    
    protected void passToNext(SupportTicket ticket) {
        if (nextHandler != null) {
            nextHandler.handle(ticket);
        } else {
            System.out.println("No handler available for: " + ticket);
        }
    }
}

// Concrete handlers
public class Level1Support extends SupportHandler {
    @Override
    public void handle(SupportTicket ticket) {
        if (ticket.getSeverity() == Severity.LOW) {
            System.out.println("L1 Support handling: " + ticket.getDescription());
            ticket.setStatus(Status.RESOLVED);
        } else {
            passToNext(ticket);
        }
    }
}

public class Level2Support extends SupportHandler {
    @Override
    public void handle(SupportTicket ticket) {
        if (ticket.getSeverity() == Severity.MEDIUM) {
            System.out.println("L2 Support handling: " + ticket.getDescription());
            ticket.setStatus(Status.RESOLVED);
        } else {
            passToNext(ticket);
        }
    }
}

public class Level3Support extends SupportHandler {
    @Override
    public void handle(SupportTicket ticket) {
        if (ticket.getSeverity() == Severity.HIGH || 
            ticket.getSeverity() == Severity.CRITICAL) {
            System.out.println("L3 Support handling: " + ticket.getDescription());
            ticket.setStatus(Status.RESOLVED);
        } else {
            passToNext(ticket);
        }
    }
}

// Setup chain
SupportHandler l1 = new Level1Support();
SupportHandler l2 = new Level2Support();
SupportHandler l3 = new Level3Support();

l1.setNext(l2);
l2.setNext(l3);

// Usage
SupportTicket ticket = new SupportTicket("Login issue", Severity.LOW);
l1.handle(ticket); // Handled by L1
```

---

### **5. Observer Pattern** 👁️
**Problem**: Notify multiple objects when state changes
**Solution**: Publish-subscribe mechanism

```java
// Observer interface
public interface OrderObserver {
    void onOrderCreated(Order order);
    void onOrderStatusChanged(Order order, OrderStatus oldStatus, OrderStatus newStatus);
    void onOrderCancelled(Order order);
}

// Subject
public class OrderService {
    private final List<OrderObserver> observers = new ArrayList<>();
    
    public void addObserver(OrderObserver observer) {
        observers.add(observer);
    }
    
    public void removeObserver(OrderObserver observer) {
        observers.remove(observer);
    }
    
    public Order createOrder(CreateOrderCommand command) {
        Order order = new Order(command);
        orderRepository.save(order);
        
        // Notify observers
        notifyOrderCreated(order);
        return order;
    }
    
    public void updateStatus(OrderId orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId);
        OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);
        orderRepository.save(order);
        
        notifyStatusChanged(order, oldStatus, newStatus);
    }
    
    private void notifyOrderCreated(Order order) {
        for (OrderObserver observer : observers) {
            observer.onOrderCreated(order);
        }
    }
    
    private void notifyStatusChanged(Order order, OrderStatus oldStatus, 
                                    OrderStatus newStatus) {
        for (OrderObserver observer : observers) {
            observer.onOrderStatusChanged(order, oldStatus, newStatus);
        }
    }
}

// Concrete observers
public class EmailNotificationObserver implements OrderObserver {
    private final EmailService emailService;
    
    @Override
    public void onOrderCreated(Order order) {
        emailService.sendOrderConfirmation(order);
    }
    
    @Override
    public void onOrderStatusChanged(Order order, OrderStatus oldStatus, 
                                    OrderStatus newStatus) {
        emailService.sendStatusUpdate(order, newStatus);
    }
    
    @Override
    public void onOrderCancelled(Order order) {
        emailService.sendCancellationConfirmation(order);
    }
}

public class InventoryObserver implements OrderObserver {
    private final InventoryService inventoryService;
    
    @Override
    public void onOrderCreated(Order order) {
        for (OrderItem item : order.getItems()) {
            inventoryService.reserve(item.getProductId(), item.getQuantity());
        }
    }
    
    @Override
    public void onOrderCancelled(Order order) {
        for (OrderItem item : order.getItems()) {
            inventoryService.release(item.getProductId(), item.getQuantity());
        }
    }
}
```

---

### **6. Command Pattern** ⌨️
**Problem**: Encapsulate requests as objects
**Solution**: Command objects with execute/undo

```java
// Command interface
public interface Command {
    void execute();
    void undo();
    String getDescription();
}

// Concrete commands
public class AddItemCommand implements Command {
    private final ShoppingCart cart;
    private final Product product;
    private final int quantity;
    
    public AddItemCommand(ShoppingCart cart, Product product, int quantity) {
        this.cart = cart;
        this.product = product;
        this.quantity = quantity;
    }
    
    @Override
    public void execute() {
        cart.addItem(product, quantity);
    }
    
    @Override
    public void undo() {
        cart.removeItem(product, quantity);
    }
    
    @Override
    public String getDescription() {
        return "Add " + quantity + "x " + product.getName();
    }
}

public class ApplyDiscountCommand implements Command {
    private final ShoppingCart cart;
    private final String discountCode;
    private Money discountAmount;
    
    @Override
    public void execute() {
        discountAmount = cart.applyDiscount(discountCode);
    }
    
    @Override
    public void undo() {
        cart.removeDiscount(discountCode);
    }
    
    @Override
    public String getDescription() {
        return "Apply discount: " + discountCode;
    }
}

// Invoker with history
public class CommandInvoker {
    private final Deque<Command> history = new ArrayDeque<>();
    private final Deque<Command> redoStack = new ArrayDeque<>();
    
    public void execute(Command command) {
        command.execute();
        history.push(command);
        redoStack.clear();
    }
    
    public void undo() {
        if (!history.isEmpty()) {
            Command command = history.pop();
            command.undo();
            redoStack.push(command);
        }
    }
    
    public void redo() {
        if (!redoStack.isEmpty()) {
            Command command = redoStack.pop();
            command.execute();
            history.push(command);
        }
    }
    
    public List<String> getHistory() {
        return history.stream()
            .map(Command::getDescription)
            .collect(Collectors.toList());
    }
}
```

---

## 🎯 **Pattern Selection Guide**

| Pattern | Use When | Key Benefit |
|---------|----------|-------------|
| **Strategy** | Algorithms vary | Runtime flexibility |
| **State** | Behavior depends on state | Clean state transitions |
| **Template Method** | Algorithm steps vary | Code reuse |
| **Chain of Responsibility** | Multiple handlers possible | Decoupling |
| **Observer** | Many dependents to notify | Loose coupling |
| **Command** | Need undo/redo, queuing | Operation encapsulation |



---

### **7. Iterator Pattern** 🔄
**Problem**: Need to access elements sequentially without exposing internal structure
**Solution**: Provide a standard way to traverse collections

**Real-World Examples:**
- `java.util.Iterator`
- `java.util.Enumeration`
- Database ResultSet

**Code Example:**
```java
public interface Iterator<T> {
    boolean hasNext();
    T next();
}

public class BookCollection {
    private List<Book> books = new ArrayList<>();
    
    public void addBook(Book book) {
        books.add(book);
    }
    
    public Iterator<Book> createIterator() {
        return new BookIterator();
    }
    
    private class BookIterator implements Iterator<Book> {
        private int position = 0;
        
        @Override
        public boolean hasNext() {
            return position < books.size();
        }
        
        @Override
        public Book next() {
            return books.get(position++);
        }
    }
}
```

---

### **8. Mediator Pattern** 🤝
**Problem**: Complex many-to-many relationships between objects
**Solution**: Encapsulate object interactions in a mediator

**Real-World Examples:**
- Chat rooms
- Air traffic control
- MVC controllers

**Code Example:**
```java
// Mediator
public interface ChatMediator {
    void sendMessage(String message, User user);
    void addUser(User user);
}

public class ChatRoom implements ChatMediator {
    private List<User> users = new ArrayList<>();
    
    @Override
    public void addUser(User user) {
        users.add(user);
    }
    
    @Override
    public void sendMessage(String message, User sender) {
        for (User user : users) {
            if (user != sender) {
                user.receive(message);
            }
        }
    }
}
```

---

### **9. Memento Pattern** 💾
**Problem**: Save and restore object state without violating encapsulation
**Solution**: Capture state in a memento object

**Real-World Examples:**
- Text editor undo/redo
- Game save states
- Database transactions

**Code Example:**
```java
// Memento
public class EditorMemento {
    private final String content;
    
    public EditorMemento(String content) {
        this.content = content;
    }
    
    public String getContent() {
        return content;
    }
}

// Originator
public class TextEditor {
    private StringBuilder content = new StringBuilder();
    
    public void write(String text) {
        content.append(text);
    }
    
    public EditorMemento save() {
        return new EditorMemento(content.toString());
    }
    
    public void restore(EditorMemento memento) {
        content = new StringBuilder(memento.getContent());
    }
}
```

---


### **10. Visitor Pattern** 🚶
**Problem**: Add operations to objects without modifying their classes
**Solution**: Separate algorithms from object structure

**Real-World Examples:**
- Compiler AST traversal
- Tax calculation
- Reporting systems

**Code Example:**
```java
// Element interface
public interface ShoppingItem {
    double accept(ShoppingCartVisitor visitor);
}

// Concrete element
public class Book implements ShoppingItem {
    private double price;
    
    public Book(double price) {
        this.price = price;
    }
    
    public double getPrice() {
        return price;
    }
    
    @Override
    public double accept(ShoppingCartVisitor visitor) {
        return visitor.visit(this);
    }
}

// Visitor interface
public interface ShoppingCartVisitor {
    double visit(Book book);
}

// Concrete visitor
public class TaxVisitor implements ShoppingCartVisitor {
    @Override
    public double visit(Book book) {
        return book.getPrice() * 1.1; // 10% tax
    }
}
```

**Usage:**
```java
ShoppingItem[] items = {
    new Book(15.0),
    new Book(25.0)
};

ShoppingCartVisitor taxVisitor = new TaxVisitor();

double total = 0;
for (ShoppingItem item : items) {
    total += item.accept(taxVisitor);
}

System.out.println("Total with tax: $" + total);
```

---

**Next**: [Day 9 - Design Principles](week2/day9/README.md) →

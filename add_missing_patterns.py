#!/usr/bin/env python3
"""Add missing design patterns to Day 6, 7, 8"""

import re

# Read Day 6 (Creational)
with open('docs/week2/day6/README.md', 'r') as f:
    day6_content = f.read()

# Insert Singleton and Abstract Factory BEFORE Builder
singleton_section = '''### **1. Singleton Pattern** 🔐
**Problem**: Ensure only one instance of a class exists and provide global access to it
**Solution**: Private constructor with static instance getter

**Key Benefits:**
- Controlled access to single instance
- Reduced memory footprint
- Global access point
- Lazy initialization possible

**Real-World Examples:**
- `java.lang.Runtime.getRuntime()`
- `java.awt.Desktop.getDesktop()`
- Spring beans with `@Scope("singleton")`

**Code Example:**
```java
// Thread-safe Singleton with double-checked locking
public class DatabaseConnectionPool {
    private static volatile DatabaseConnectionPool instance;
    private final List<Connection> connections;
    
    private DatabaseConnectionPool() {
        connections = new ArrayList<>();
        initializeConnections();
    }
    
    public static DatabaseConnectionPool getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnectionPool.class) {
                if (instance == null) {
                    instance = new DatabaseConnectionPool();
                }
            }
        }
        return instance;
    }
}

// Enum-based Singleton (preferred - thread-safe, serialization-safe)
public enum ConfigManager {
    INSTANCE;
    
    private Properties config;
    
    ConfigManager() {
        config = loadConfig();
    }
    
    public String get(String key) {
        return config.getProperty(key);
    }
}
```

---

### **2. Factory Method Pattern** 🏭
**Problem**: Object creation logic needs to be delegated to subclasses
**Solution**: Define an interface for creating objects, let subclasses decide which class to instantiate

**Real-World Examples:**
- `java.util.Calendar.getInstance()`
- `java.text.NumberFormat.getInstance()`
- JDBC `DriverManager.getConnection()`

**Code Example:**
```java
// Product interface
public interface Notification {
    void send(String recipient, String message);
}

// Concrete products
public class EmailNotification implements Notification {
    @Override
    public void send(String recipient, String message) {
        System.out.println("Email to " + recipient + ": " + message);
    }
}

// Creator
public abstract class NotificationFactory {
    public void notifyUser(String recipient, String message) {
        Notification notification = createNotification();
        notification.send(recipient, message);
    }
    
    protected abstract Notification createNotification();
}

// Concrete creator
public class EmailNotificationFactory extends NotificationFactory {
    @Override
    protected Notification createNotification() {
        return new EmailNotification();
    }
}
```

---

### **3. Abstract Factory Pattern** 🏭🏭
**Problem**: Need to create families of related objects without specifying their concrete classes
**Solution**: Provide an interface for creating families of related objects

**Real-World Examples:**
- `javax.xml.parsers.DocumentBuilderFactory`
- `javax.xml.transform.TransformerFactory`
- Cross-platform UI toolkits

**Code Example:**
```java
// Abstract products
public interface Button {
    void render();
}

public interface Checkbox {
    void render();
}

// Abstract factory
public interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

// Concrete factories
public class WindowsFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new WindowsButton();
    }
    
    @Override
    public Checkbox createCheckbox() {
        return new WindowsCheckbox();
    }
}

public class MacOSFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new MacOSButton();
    }
    
    @Override
    public Checkbox createCheckbox() {
        return new MacOSCheckbox();
    }
}
```

---

### **4. Builder Pattern** 🔨'''

abstract_factory_section = '''### **5. Prototype Pattern** 🧬'''

# Replace pattern numbering and add new patterns
day6_content = day6_content.replace(
    '### **1. Builder Pattern** 🔨',
    singleton_section
)
day6_content = day6_content.replace(
    '### **2. Factory Pattern** 🏭',
    abstract_factory_section
)
day6_content = day6_content.replace(
    '### **3. Prototype Pattern** 🧬',
    '### **5. Prototype Pattern** 🧬'
)

# Update learning objectives
day6_content = day6_content.replace(
    '- **Implement** Builder, Factory, and Prototype patterns in Java',
    '- **Implement** Singleton, Factory Method, Abstract Factory, Builder, and Prototype patterns in Java'
)

with open('docs/week2/day6/README.md', 'w') as f:
    f.write(day6_content)

print("✅ Day 6: Added Singleton, Factory Method, Abstract Factory")

# Read Day 7 (Structural)
with open('docs/week2/day7/README.md', 'r') as f:
    day7_content = f.read()

# Add Bridge and Facade patterns
bridge_facade = '''

---

### **6. Bridge Pattern** 🌉
**Problem**: Decouple abstraction from implementation so both can vary independently
**Solution**: Separate abstraction and implementation into different hierarchies

**Real-World Examples:**
- JDBC drivers (abstraction: Connection, implementation: MySQL/PostgreSQL drivers)
- GUI frameworks (abstraction: Window, implementation: WindowsWindow/LinuxWindow)

**Code Example:**
```java
// Implementation interface
public interface MessageSender {
    void sendMessage(String message);
}

// Concrete implementations
public class EmailSender implements MessageSender {
    @Override
    public void sendMessage(String message) {
        System.out.println("Email: " + message);
    }
}

public class SMSSender implements MessageSender {
    @Override
    public void sendMessage(String message) {
        System.out.println("SMS: " + message);
    }
}

// Abstraction
public abstract class Message {
    protected MessageSender sender;
    
    public Message(MessageSender sender) {
        this.sender = sender;
    }
    
    public abstract void send(String content);
}

// Refined abstractions
public class ShortMessage extends Message {
    public ShortMessage(MessageSender sender) {
        super(sender);
    }
    
    @Override
    public void send(String content) {
        sender.sendMessage(content.substring(0, Math.min(160, content.length())));
    }
}

public class LongMessage extends Message {
    public LongMessage(MessageSender sender) {
        super(sender);
    }
    
    @Override
    public void send(String content) {
        sender.sendMessage(content);
    }
}
```

**Usage:**
```java
Message message = new ShortMessage(new SMSSender());
message.send("Hello World!");

message = new LongMessage(new EmailSender());
message.send("This is a long message...");
```

---

### **7. Facade Pattern** 🎭
**Problem**: Complex subsystem is difficult to use, need a simplified interface
**Solution**: Provide a unified interface to a set of interfaces in a subsystem

**Real-World Examples:**
- `java.net.URL` (facade for complex networking)
- Spring's `JdbcTemplate` (facade for JDBC)
- Computer facade (CPU, Memory, HardDrive)

**Code Example:**
```java
// Complex subsystems
class CPU {
    public void freeze() { System.out.println("CPU: Freezing..."); }
    public void jump(long position) { System.out.println("CPU: Jumping to " + position); }
    public void execute() { System.out.println("CPU: Executing..."); }
}

class Memory {
    public void load(long position, byte[] data) {
        System.out.println("Memory: Loading data at " + position);
    }
}

class HardDrive {
    public byte[] read(long lba, int size) {
        System.out.println("HDD: Reading " + size + " bytes from " + lba);
        return new byte[size];
    }
}

// Facade
public class ComputerFacade {
    private final CPU cpu;
    private final Memory memory;
    private final HardDrive hardDrive;
    
    public ComputerFacade() {
        this.cpu = new CPU();
        this.memory = new Memory();
        this.hardDrive = new HardDrive();
    }
    
    public void start() {
        cpu.freeze();
        memory.load(0, hardDrive.read(0, 1024));
        cpu.jump(0);
        cpu.execute();
    }
}
```

**Usage:**
```java
// Without facade: complex
CPU cpu = new CPU();
Memory memory = new Memory();
HardDrive hdd = new HardDrive();
cpu.freeze();
memory.load(0, hdd.read(0, 1024));
cpu.jump(0);
cpu.execute();

// With facade: simple!
ComputerFacade computer = new ComputerFacade();
computer.start();
```
'''

# Insert before the closing section
day7_content = day7_content.replace(
    '---\n\n## 🏗️ **Real-World Applications**',
    bridge_facade + '\n\n---\n\n## 🏗️ **Real-World Applications**'
)

# Update learning objectives
day7_content = day7_content.replace(
    '- **Implement** Adapter, Decorator, Composite, Proxy, and Flyweight patterns',
    '- **Implement** Adapter, Bridge, Composite, Decorator, Facade, Flyweight, and Proxy patterns'
)

with open('docs/week2/day7/README.md', 'w') as f:
    f.write(day7_content)

print("✅ Day 7: Added Bridge and Facade")

# Read Day 8 (Behavioral)
with open('docs/week2/day8/README.md', 'r') as f:
    day8_content = f.read()

# Add Iterator, Mediator, Memento, Visitor
behavioral_additions = '''

---

### **7. Iterator Pattern** 🔄
**Problem**: Need to access elements of a collection sequentially without exposing internal structure
**Solution**: Provide a way to traverse a collection without exposing its representation

**Real-World Examples:**
- `java.util.Iterator`
- `java.util.Enumeration`
- Database cursors

**Code Example:**
```java
public interface Iterator<T> {
    boolean hasNext();
    T next();
}

public interface Collection<T> {
    Iterator<T> createIterator();
}

public class Book {
    private String title;
    private String author;
    
    public Book(String title, String author) {
        this.title = title;
        this.author = author;
    }
    
    @Override
    public String toString() {
        return title + " by " + author;
    }
}

public class BookCollection implements Collection<Book> {
    private List<Book> books = new ArrayList<>();
    
    public void addBook(Book book) {
        books.add(book);
    }
    
    @Override
    public Iterator<Book> createIterator() {
        return new BookIterator(books);
    }
    
    private static class BookIterator implements Iterator<Book> {
        private final List<Book> books;
        private int position = 0;
        
        public BookIterator(List<Book> books) {
            this.books = books;
        }
        
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

**Usage:**
```java
BookCollection library = new BookCollection();
library.addBook(new Book("1984", "Orwell"));
library.addBook(new Book("Brave New World", "Huxley"));

Iterator<Book> iterator = library.createIterator();
while (iterator.hasNext()) {
    System.out.println(iterator.next());
}
```

---

### **8. Mediator Pattern** 🤝
**Problem**: Many-to-many relationships between objects create complex dependencies
**Solution**: Encapsulate how objects interact using a mediator object

**Real-World Examples:**
- Chat room (users don't communicate directly)
- Air traffic control tower
- MVC controllers

**Code Example:**
```java
// Mediator interface
public interface ChatMediator {
    void sendMessage(String message, User user);
    void addUser(User user);
}

// Concrete mediator
public class ChatRoom implements ChatMediator {
    private List<User> users = new ArrayList<>();
    
    @Override
    public void addUser(User user) {
        users.add(user);
    }
    
    @Override
    public void sendMessage(String message, User sender) {
        for (User user : users) {
            // Don't send message back to sender
            if (user != sender) {
                user.receive(message);
            }
        }
    }
}

// Colleague
public abstract class User {
    protected ChatMediator mediator;
    protected String name;
    
    public User(ChatMediator mediator, String name) {
        this.mediator = mediator;
        this.name = name;
    }
    
    public abstract void send(String message);
    public abstract void receive(String message);
}

// Concrete colleague
public class ChatUser extends User {
    public ChatUser(ChatMediator mediator, String name) {
        super(mediator, name);
    }
    
    @Override
    public void send(String message) {
        System.out.println(name + " sends: " + message);
        mediator.sendMessage(message, this);
    }
    
    @Override
    public void receive(String message) {
        System.out.println(name + " receives: " + message);
    }
}
```

**Usage:**
```java
ChatMediator chatRoom = new ChatRoom();

User alice = new ChatUser(chatRoom, "Alice");
User bob = new ChatUser(chatRoom, "Bob");
User charlie = new ChatUser(chatRoom, "Charlie");

chatRoom.addUser(alice);
chatRoom.addUser(bob);
chatRoom.addUser(charlie);

alice.send("Hello everyone!");  // Bob and Charlie receive
```

---

### **9. Memento Pattern** 💾
**Problem**: Need to save and restore object state without violating encapsulation
**Solution**: Capture object's internal state externally so it can be restored later

**Real-World Examples:**
- Text editor undo/redo
- Game save states
- Database transactions

**Code Example:**
```java
// Memento
public class EditorMemento {
    private final String content;
    private final int cursorPosition;
    
    public EditorMemento(String content, int cursorPosition) {
        this.content = content;
        this.cursorPosition = cursorPosition;
    }
    
    public String getContent() { return content; }
    public int getCursorPosition() { return cursorPosition; }
}

// Originator
public class TextEditor {
    private StringBuilder content;
    private int cursorPosition;
    
    public TextEditor() {
        this.content = new StringBuilder();
        this.cursorPosition = 0;
    }
    
    public void write(String text) {
        content.append(text);
        cursorPosition += text.length();
    }
    
    public EditorMemento save() {
        return new EditorMemento(content.toString(), cursorPosition);
    }
    
    public void restore(EditorMemento memento) {
        content = new StringBuilder(memento.getContent());
        cursorPosition = memento.getCursorPosition();
    }
    
    public String getContent() {
        return content.toString();
    }
}

// Caretaker
public class EditorHistory {
    private final Deque<EditorMemento> history = new ArrayDeque<>();
    
    public void save(EditorMemento memento) {
        history.push(memento);
    }
    
    public EditorMemento undo() {
        return history.isEmpty() ? null : history.pop();
    }
}
```

**Usage:**
```java
TextEditor editor = new TextEditor();
EditorHistory history = new EditorHistory();

editor.write("Hello ");
history.save(editor.save());

editor.write("World");
history.save(editor.save());

editor.write("!!!");
System.out.println(editor.getContent());  // "Hello World!!!"

// Undo
editor.restore(history.undo());
System.out.println(editor.getContent());  // "Hello World"
```

---

### **10. Visitor Pattern** 🚶
**Problem**: Need to add operations to objects without modifying their classes
**Solution**: Separate algorithms from the objects they operate on

**Real-World Examples:**
- Compiler AST traversal
- Tax calculation for different elements
- Reporting on composite structures

**Code Example:**
```java
// Element interface
public interface ShoppingItem {
    double accept(ShoppingCartVisitor visitor);
}

// Concrete elements
public class Book implements ShoppingItem {
    private double price;
    private String isbn;
    
    public Book(double price, String isbn) {
        this.price = price;
        this.isbn = isbn;
    }
    
    public double getPrice() { return price; }
    public String getIsbn() { return isbn; }
    
    @Override
    public double accept(ShoppingCartVisitor visitor) {
        return visitor.visit(this);
    }
}

public class Fruit implements ShoppingItem {
    private double pricePerKg;
    private double weight;
    private String name;
    
    public Fruit(double pricePerKg, double weight, String name) {
        this.pricePerKg = pricePerKg;
        this.weight = weight;
        this.name = name;
    }
    
    public double getPricePerKg() { return pricePerKg; }
    public double getWeight() { return weight; }
    public String getName() { return name; }
    
    @Override
    public double accept(ShoppingCartVisitor visitor) {
        return visitor.visit(this);
    }
}

// Visitor interface
public interface ShoppingCartVisitor {
    double visit(Book book);
    double visit(Fruit fruit);
}

// Concrete visitor
public class ShoppingCartPriceVisitor implements ShoppingCartVisitor {
    @Override
    public double visit(Book book) {
        // Books have no tax if price < $20
        double price = book.getPrice();
        return price < 20 ? price : price * 1.1;
    }
    
    @Override
    public double visit(Fruit fruit) {
        // Fruits are priced by weight
        return fruit.getPricePerKg() * fruit.getWeight();
    }
}
```

**Usage:**
```java
ShoppingItem[] items = {
    new Book(15.0, "978-0134685991"),
    new Book(25.0, "978-0134685992"),
    new Fruit(3.0, 2.5, "Apple")
};

ShoppingCartVisitor priceVisitor = new ShoppingCartPriceVisitor();

double total = 0;
for (ShoppingItem item : items) {
    total += item.accept(priceVisitor);
}

System.out.println("Total: $" + total);
```
'''

# Insert before the closing section
day8_content = day8_content.replace(
    '---\n\n## 🏗️ **Real-World Applications**',
    behavioral_additions + '\n\n---\n\n## 🏗️ **Real-World Applications**'
)

# Update learning objectives
day8_content = day8_content.replace(
    '- **Implement** Strategy, State, Template Method, Chain of Responsibility, Observer, and Command patterns',
    '- **Implement** Strategy, State, Template Method, Chain of Responsibility, Observer, Command, Iterator, Mediator, Memento, and Visitor patterns'
)

with open('docs/week2/day8/README.md', 'w') as f:
    f.write(day8_content)

print("✅ Day 8: Added Iterator, Mediator, Memento, Visitor")

print("\n" + "="*60)
print("✅ ALL MISSING PATTERNS ADDED!")
print("="*60)
print("\n📊 Summary:")
print("  Day 6 (Creational): 5/5 ✅ (added Singleton, Factory Method, Abstract Factory)")
print("  Day 7 (Structural): 7/7 ✅ (added Bridge, Facade)")
print("  Day 8 (Behavioral): 10/10 ✅ (added Iterator, Mediator, Memento, Visitor)")

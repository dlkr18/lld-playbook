#!/usr/bin/env python3
import re

# Fix Day 6 - remove duplicate Prototype
with open('docs/week2/day6/README.md', 'r') as f:
    content = f.read()

# Find the second occurrence of "### **5. Prototype Pattern"
lines = content.split('\n')
prototype_count = 0
fixed_lines = []
for i, line in enumerate(lines):
    if '### **5. Prototype Pattern' in line:
        prototype_count += 1
        if prototype_count == 2:
            # Skip this line - it's the duplicate we added
            continue
    fixed_lines.append(line)

with open('docs/week2/day6/README.md', 'w') as f:
    f.write('\n'.join(fixed_lines))

print("✅ Fixed Day 6 duplicate")

# Add Bridge and Facade to Day 7
with open('docs/week2/day7/README.md', 'r') as f:
    day7 = f.read()

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
```

**Usage:**
```java
Message message = new ShortMessage(new SMSSender());
message.send("Hello World!");
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
    public void jump(long position) { System.out.println("CPU: Jumping..."); }
    public void execute() { System.out.println("CPU: Executing..."); }
}

class Memory {
    public void load(long position, byte[] data) {
        System.out.println("Memory: Loading...");
    }
}

class HardDrive {
    public byte[] read(long lba, int size) {
        System.out.println("HDD: Reading...");
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
// Simple facade instead of complex subsystem interactions
ComputerFacade computer = new ComputerFacade();
computer.start();
```
'''

# Insert before "All structural pattern examples"
day7 = day7.replace(
    '---\n\nAll structural pattern examples',
    bridge_facade + '\n\n---\n\nAll structural pattern examples'
)

# Update the patterns covered list
day7 = day7.replace(
    '**Patterns covered:**\n- ✅ Decorator Pattern - Coffee shop example\n- ✅ Adapter Pattern - Payment gateway integration  \n- ✅ Composite Pattern - File system tree\n- ✅ Proxy Pattern - Image lazy loading\n- ✅ Flyweight Pattern - Character rendering',
    '**Patterns covered:**\n- ✅ Adapter Pattern - Payment gateway integration\n- ✅ Bridge Pattern - Message sender abstraction\n- ✅ Composite Pattern - File system tree\n- ✅ Decorator Pattern - Coffee shop example\n- ✅ Facade Pattern - Computer startup\n- ✅ Flyweight Pattern - Character rendering\n- ✅ Proxy Pattern - Image lazy loading'
)

with open('docs/week2/day7/README.md', 'w') as f:
    f.write(day7)

print("✅ Added Bridge and Facade to Day 7")

# Add Iterator, Mediator, Memento, Visitor to Day 8
with open('docs/week2/day8/README.md', 'r') as f:
    day8 = f.read()

new_patterns = '''

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
// Element
public interface ShoppingItem {
    double accept(ShoppingCartVisitor visitor);
}

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

// Visitor
public interface ShoppingCartVisitor {
    double visit(Book book);
}

public class TaxVisitor implements ShoppingCartVisitor {
    @Override
    public double visit(Book book) {
        return book.getPrice() * 1.1; // 10% tax
    }
}
```
'''

# Insert before the final closing sections
if '---\n\n**Next**' in day8:
    day8 = day8.replace('---\n\n**Next**', new_patterns + '\n\n---\n\n**Next**')
else:
    # Append before end
    day8 = day8.rstrip() + '\n' + new_patterns + '\n'

with open('docs/week2/day8/README.md', 'w') as f:
    f.write(day8)

print("✅ Added Iterator, Mediator, Memento, Visitor to Day 8")

print("\n" + "="*70)
print("✅ ALL PATTERNS SUCCESSFULLY ADDED!")
print("="*70)

#!/usr/bin/env python3
import re

# Read Day 7
with open('docs/week2/day7/README.md', 'r') as f:
    content = f.read()

# Find insertion point (before "## 🎯 **Pattern Selection Guide**")
bridge_facade_patterns = '''

---

### **6. Bridge Pattern** 🌉
**Problem**: Decouple abstraction from implementation  
**Solution**: Separate into different hierarchies

```java
// Implementation
public interface MessageSender {
    void sendMessage(String msg);
}

public class EmailSender implements MessageSender {
    public void sendMessage(String msg) {
        System.out.println("Email: " + msg);
    }
}

public class SMSSender implements MessageSender {
    public void sendMessage(String msg) {
        System.out.println("SMS: " + msg);
    }
}

// Abstraction
public abstract class Message {
    protected MessageSender sender;
    public Message(MessageSender sender) { this.sender = sender; }
    public abstract void send(String content);
}

public class ShortMessage extends Message {
    public ShortMessage(MessageSender sender) { super(sender); }
    public void send(String content) {
        sender.sendMessage(content.substring(0, Math.min(160, content.length())));
    }
}
```

---

### **7. Facade Pattern** 🎭
**Problem**: Complex subsystem is difficult to use  
**Solution**: Provide simplified unified interface

```java
// Complex subsystems
class CPU {
    public void freeze() { System.out.println("CPU: Freezing..."); }
    public void jump(long pos) { System.out.println("CPU: Jump " + pos); }
    public void execute() { System.out.println("CPU: Execute"); }
}

class Memory {
    public void load(long pos, byte[] data) {
        System.out.println("Memory: Load at " + pos);
    }
}

class HardDrive {
    public byte[] read(long lba, int size) {
        System.out.println("HDD: Read " + size + " bytes");
        return new byte[size];
    }
}

// Facade
public class ComputerFacade {
    private CPU cpu = new CPU();
    private Memory memory = new Memory();
    private HardDrive hdd = new HardDrive();
    
    public void start() {
        cpu.freeze();
        memory.load(0, hdd.read(0, 1024));
        cpu.jump(0);
        cpu.execute();
    }
}
```
'''

# Insert before pattern selection guide
insertion_point = content.find('## 🎯 **Pattern Selection Guide**')
if insertion_point > 0:
    content = content[:insertion_point] + bridge_facade_patterns + '\n\n' + content[insertion_point:]

# Update the pattern selection table
old_table = '''| Pattern | Use When | Don't Use When |
|---------|----------|----------------|
| **Adapter** | Integrating incompatible interfaces | Interfaces are similar |
| **Decorator** | Adding behavior dynamically | Behavior is fixed |
| **Composite** | Tree structures with uniform treatment | Flat structures |
| **Proxy** | Controlling access, lazy loading | Direct access is fine |
| **Flyweight** | Many objects with shared state | Each object is unique |'''

new_table = '''| Pattern | Use When | Don't Use When |
|---------|----------|----------------|
| **Adapter** | Integrating incompatible interfaces | Interfaces are similar |
| **Bridge** | Abstraction & implementation vary independently | Single dimension |
| **Composite** | Tree structures with uniform treatment | Flat structures |
| **Decorator** | Adding behavior dynamically | Behavior is fixed |
| **Facade** | Simplifying complex subsystems | Already simple |
| **Flyweight** | Many objects with shared state | Each object is unique |
| **Proxy** | Controlling access, lazy loading | Direct access is fine |'''

content = content.replace(old_table, new_table)

with open('docs/week2/day7/README.md', 'w') as f:
    f.write(content)

print("✅ Day 7: Added Bridge and Facade patterns")

# Now fix Day 8
with open('docs/week2/day8/README.md', 'r') as f:
    content = f.read()

# Add missing behavioral patterns before any closing section
missing_patterns = '''

---

### **7. Iterator Pattern** 🔄
**Problem**: Traverse collection without exposing structure  
**Solution**: Standard iteration interface

```java
public interface Iterator<T> {
    boolean hasNext();
    T next();
}

public class BookCollection {
    private List<Book> books = new ArrayList<>();
    
    public Iterator<Book> iterator() {
        return new BookIterator();
    }
    
    private class BookIterator implements Iterator<Book> {
        private int pos = 0;
        public boolean hasNext() { return pos < books.size(); }
        public Book next() { return books.get(pos++); }
    }
}
```

---

### **8. Mediator Pattern** 🤝
**Problem**: Complex many-to-many relationships  
**Solution**: Centralize communication

```java
public interface ChatMediator {
    void sendMessage(String msg, User user);
}

public class ChatRoom implements ChatMediator {
    private List<User> users = new ArrayList<>();
    
    public void sendMessage(String msg, User sender) {
        for (User user : users) {
            if (user != sender) user.receive(msg);
        }
    }
}
```

---

### **9. Memento Pattern** 💾
**Problem**: Save/restore state without violating encapsulation  
**Solution**: Memento object stores state

```java
public class EditorMemento {
    private final String content;
    public EditorMemento(String content) { this.content = content; }
    public String getContent() { return content; }
}

public class TextEditor {
    private StringBuilder content = new StringBuilder();
    
    public EditorMemento save() {
        return new EditorMemento(content.toString());
    }
    
    public void restore(EditorMemento m) {
        content = new StringBuilder(m.getContent());
    }
}
```

---

### **10. Visitor Pattern** 🚶
**Problem**: Add operations without modifying classes  
**Solution**: Separate algorithms from structure

```java
public interface ShoppingItem {
    double accept(Visitor v);
}

public class Book implements ShoppingItem {
    private double price;
    public Book(double price) { this.price = price; }
    public double getPrice() { return price; }
    
    public double accept(Visitor v) {
        return v.visit(this);
    }
}

public interface Visitor {
    double visit(Book book);
}

public class TaxVisitor implements Visitor {
    public double visit(Book book) {
        return book.getPrice() * 1.1;
    }
}
```
'''

# Find good insertion point
if '---\n\n**Next**:' in content:
    content = content.replace('---\n\n**Next**:', missing_patterns + '\n\n---\n\n**Next**:')
elif '---\n\n## 🏗️' in content:
    content = content.replace('---\n\n## 🏗️', missing_patterns + '\n\n---\n\n## 🏗️')
else:
    # Append at end
    content = content.rstrip() + '\n' + missing_patterns + '\n'

with open('docs/week2/day8/README.md', 'w') as f:
    f.write(content)

print("✅ Day 8: Added Iterator, Mediator, Memento, Visitor patterns")

print("\n" + "="*70)
print("✅ ALL PATTERNS COMPLETE!")
print("="*70)

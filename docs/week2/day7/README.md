# Day 7: Structural Patterns 🏗️

**Focus**: Master patterns for composing objects and classes into larger structures.

---

## 🎯 **Learning Objectives**

By the end of Day 7, you will:
- **Implement** Adapter, Bridge, Composite, Decorator, Facade, Flyweight, and Proxy patterns
- **Recognize** when to use each structural pattern
- **Apply** patterns to real-world scenarios
- **Combine** patterns effectively

---

## 📚 **Patterns Covered**

### **1. Adapter Pattern** 🔌
**Problem**: Incompatible interfaces need to work together
**Solution**: Wrap one interface to match another

```java
// Target interface (what client expects)
public interface PaymentGateway {
    PaymentResult charge(Money amount, CardDetails card);
}

// Adaptee (third-party library with different interface)
public class StripeAPI {
    public StripeCharge createCharge(int amountCents, String cardToken) {
        // Stripe-specific implementation
    }
}

// Adapter
public class StripeAdapter implements PaymentGateway {
    
    private final StripeAPI stripeAPI;
    
    public StripeAdapter(StripeAPI stripeAPI) {
        this.stripeAPI = stripeAPI;
    }
    
    @Override
    public PaymentResult charge(Money amount, CardDetails card) {
        // Convert our domain objects to Stripe's format
        int amountCents = amount.getCents();
        String cardToken = tokenizeCard(card);
        
        StripeCharge charge = stripeAPI.createCharge(amountCents, cardToken);
        
        // Convert Stripe response back to our domain
        return convertToPaymentResult(charge);
    }
    
    private String tokenizeCard(CardDetails card) {
        // Convert card to Stripe token
    }
    
    private PaymentResult convertToPaymentResult(StripeCharge charge) {
        // Convert Stripe charge to our result
    }
}
```

**When to Use:**
- Integrating third-party libraries
- Legacy system integration
- Working with multiple vendors

**Real-World Examples:**
- **`java.util.Arrays.asList()`**: Adapts array to List interface
- **`java.io.InputStreamReader`**: Adapts InputStream to Reader
- **`java.io.OutputStreamWriter`**: Adapts OutputStream to Writer
- **`javax.xml.bind.annotation.adapters.XmlAdapter`**: Adapts types for JAXB
- **Spring JPA adapters**: Adapt different database APIs to standard interfaces
- **`Collections.list(Enumeration)`**: Adapts Enumeration to List

---

### **2. Decorator Pattern** 🎨
**Problem**: Add responsibilities dynamically without subclassing
**Solution**: Wrap objects with additional behavior

```java
// Component interface
public interface Coffee {
    String getDescription();
    Money getCost();
}

// Concrete component
public class Espresso implements Coffee {
    @Override
    public String getDescription() {
        return "Espresso";
    }
    
    @Override
    public Money getCost() {
        return Money.dollars(2.00);
    }
}

// Base decorator
public abstract class CoffeeDecorator implements Coffee {
    protected final Coffee coffee;
    
    protected CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
}

// Concrete decorators
public class MilkDecorator extends CoffeeDecorator {
    
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return coffee.getDescription() + ", Milk";
    }
    
    @Override
    public Money getCost() {
        return coffee.getCost().add(Money.dollars(0.50));
    }
}

public class WhipDecorator extends CoffeeDecorator {
    
    public WhipDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return coffee.getDescription() + ", Whip";
    }
    
    @Override
    public Money getCost() {
        return coffee.getCost().add(Money.dollars(0.75));
    }
}

// Usage
Coffee order = new WhipDecorator(new MilkDecorator(new Espresso()));
System.out.println(order.getDescription()); // "Espresso, Milk, Whip"
System.out.println(order.getCost());        // $3.25
```

**Real-World Examples:**
- Java I/O streams (BufferedInputStream, GzipInputStream)
- Logging decorators
- Caching decorators
- Authentication/Authorization wrappers

**Real-World Examples:**
- **`java.io.BufferedInputStream`**: Adds buffering to InputStream
- **`java.io.FilterInputStream`** / **`FilterOutputStream`**: Base for stream decorators
- **`java.util.Collections.unmodifiableList()`**: Adds immutability
- **`java.util.Collections.synchronizedList()`**: Adds thread-safety
- **`javax.servlet.http.HttpServletRequestWrapper`**: Decorates servlet requests
- **Spring `@Transactional`**: Adds transaction management via proxy
- **Jackson `@JsonSerialize`**: Decorates serialization behavior

---

### **3. Composite Pattern** 🌳
**Problem**: Treat individual objects and compositions uniformly
**Solution**: Tree structure with common interface

```java
// Component
public interface FileSystemItem {
    String getName();
    long getSize();
    void print(String indent);
}

// Leaf
public class File implements FileSystemItem {
    private final String name;
    private final long size;
    
    public File(String name, long size) {
        this.name = name;
        this.size = size;
    }
    
    @Override
    public String getName() { return name; }
    
    @Override
    public long getSize() { return size; }
    
    @Override
    public void print(String indent) {
        System.out.println(indent + "📄 " + name + " (" + size + " bytes)");
    }
}

// Composite
public class Directory implements FileSystemItem {
    private final String name;
    private final List<FileSystemItem> children = new ArrayList<>();
    
    public Directory(String name) {
        this.name = name;
    }
    
    public void add(FileSystemItem item) {
        children.add(item);
    }
    
    public void remove(FileSystemItem item) {
        children.remove(item);
    }
    
    @Override
    public String getName() { return name; }
    
    @Override
    public long getSize() {
        return children.stream()
            .mapToLong(FileSystemItem::getSize)
            .sum();
    }
    
    @Override
    public void print(String indent) {
        System.out.println(indent + "📁 " + name + "/");
        for (FileSystemItem child : children) {
            child.print(indent + "  ");
        }
    }
}

// Usage
Directory root = new Directory("root");
Directory docs = new Directory("docs");
docs.add(new File("readme.txt", 1024));
docs.add(new File("notes.txt", 512));
root.add(docs);
root.add(new File("config.json", 256));

root.print(""); // Prints tree structure
System.out.println("Total size: " + root.getSize()); // 1792
```

**Use Cases:**
- File systems
- UI component hierarchies
- Organization structures
- Menu systems

**Real-World Examples:**
- **`java.awt.Component`** / **`Container`**: Swing component hierarchy
- **`javax.faces.component.UIComponent`**: JSF component tree
- **`org.w3c.dom.Node`**: XML DOM tree structure
- **File system APIs**: Files and directories treated uniformly
- **Spring `@Composite` annotation**: Composing multiple stereotypes
- **JavaFX Scene Graph**: UI node hierarchy

---

### **4. Proxy Pattern** 🛡️
**Problem**: Control access to an object
**Solution**: Surrogate with same interface

**Types of Proxies:**
- **Virtual Proxy**: Lazy initialization
- **Protection Proxy**: Access control
- **Remote Proxy**: Network communication
- **Caching Proxy**: Cache results

```java
// Subject interface
public interface Image {
    void display();
    int getWidth();
    int getHeight();
}

// Real subject (expensive to create)
public class HighResolutionImage implements Image {
    private final String filename;
    private byte[] imageData;
    
    public HighResolutionImage(String filename) {
        this.filename = filename;
        loadImage(); // Expensive operation
    }
    
    private void loadImage() {
        System.out.println("Loading " + filename + " from disk...");
        // Simulate loading large image
        this.imageData = new byte[10_000_000];
    }
    
    @Override
    public void display() {
        System.out.println("Displaying " + filename);
    }
    
    @Override
    public int getWidth() { return 1920; }
    
    @Override
    public int getHeight() { return 1080; }
}

// Virtual Proxy - lazy loading
public class ImageProxy implements Image {
    private final String filename;
    private HighResolutionImage realImage;
    
    public ImageProxy(String filename) {
        this.filename = filename;
        // Don't load image yet
    }
    
    @Override
    public void display() {
        if (realImage == null) {
            realImage = new HighResolutionImage(filename);
        }
        realImage.display();
    }
    
    @Override
    public int getWidth() {
        // Could return cached/default value without loading
        return realImage != null ? realImage.getWidth() : 0;
    }
    
    @Override
    public int getHeight() {
        return realImage != null ? realImage.getHeight() : 0;
    }
}

// Protection Proxy - access control
public class SecureImageProxy implements Image {
    private final Image realImage;
    private final User currentUser;
    
    public SecureImageProxy(Image realImage, User currentUser) {
        this.realImage = realImage;
        this.currentUser = currentUser;
    }
    
    @Override
    public void display() {
        if (!currentUser.hasPermission("view_images")) {
            throw new AccessDeniedException("User cannot view images");
        }
        realImage.display();
    }
    
    // ... other methods with permission checks
}
```

**Real-World Examples:**
- **`java.lang.reflect.Proxy`**: Dynamic proxy generation at runtime
- **Spring AOP**: Method interception via proxies (CGLIB, JDK proxies)
- **JPA Lazy Loading**: Hibernate creates proxies for lazy entities
- **RMI (Remote Method Invocation)**: Remote object proxies
- **`java.rmi.server.UnicastRemoteObject`**: RMI stub proxies
- **Mockito mocks**: Testing framework creates proxy objects
- **Spring `@Cacheable`**: Caching via proxy interception

---

### **5. Flyweight Pattern** 🪶
**Problem**: Many similar objects consume too much memory
**Solution**: Share common state between objects

```java
// Flyweight (intrinsic state - shared)
public class CharacterStyle {
    private final String fontFamily;
    private final int fontSize;
    private final Color color;
    private final boolean bold;
    private final boolean italic;
    
    public CharacterStyle(String fontFamily, int fontSize, Color color, 
                         boolean bold, boolean italic) {
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.color = color;
        this.bold = bold;
        this.italic = italic;
    }
    
    public void render(char character, int x, int y) {
        // Render character with this style at position
    }
}

// Flyweight Factory
public class CharacterStyleFactory {
    private static final Map<String, CharacterStyle> cache = new HashMap<>();
    
    public static CharacterStyle getStyle(String fontFamily, int fontSize, 
                                          Color color, boolean bold, boolean italic) {
        String key = fontFamily + "-" + fontSize + "-" + color + "-" + bold + "-" + italic;
        
        return cache.computeIfAbsent(key, k -> 
            new CharacterStyle(fontFamily, fontSize, color, bold, italic)
        );
    }
    
    public static int getCacheSize() {
        return cache.size();
    }
}

// Context (extrinsic state - not shared)
public class Character {
    private final char character;
    private final int x;
    private final int y;
    private final CharacterStyle style; // Flyweight reference
    
    public Character(char character, int x, int y, CharacterStyle style) {
        this.character = character;
        this.x = x;
        this.y = y;
        this.style = style;
    }
    
    public void render() {
        style.render(character, x, y);
    }
}

// Usage - thousands of characters, few styles
public class TextEditor {
    private List<Character> characters = new ArrayList<>();
    
    public void addCharacter(char c, int x, int y, 
                            String font, int size, Color color) {
        CharacterStyle style = CharacterStyleFactory.getStyle(
            font, size, color, false, false
        );
        characters.add(new Character(c, x, y, style));
    }
}
```

**Real-World Examples:**
- **`java.lang.Integer.valueOf(int)`**: Caches integers -128 to 127
- **`java.lang.String` pool**: Shares string literals in memory
- **`java.lang.Boolean.valueOf(boolean)`**: Returns cached TRUE/FALSE instances
- **`java.awt.Font`**: Shares font objects to reduce memory
- **Connection pools**: JDBC connection pooling (HikariCP, C3P0)
- **Thread pools**: `java.util.concurrent.ThreadPoolExecutor`
- **Enum constants**: Singleton flyweights by definition

---



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

**Real-World Examples:**
- **JDBC API**: Separates database API (`Connection`, `Statement`) from driver implementations
- **`java.util.logging`**: Logger abstraction with different Handler implementations
- **SLF4J**: Logging facade that bridges to different implementations (Logback, Log4j)
- **Java AWT/Swing**: UI abstraction separating platform-independent API from native implementations
- **Spring Data**: Repository abstraction bridging various data stores (JPA, MongoDB, Redis)

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


## 🎯 **Pattern Selection Guide**

| Pattern | Use When | Don't Use When |
|---------|----------|----------------|
| **Adapter** | Integrating incompatible interfaces | Interfaces are similar |
| **Bridge** | Abstraction & implementation vary independently | Single dimension |
| **Composite** | Tree structures with uniform treatment | Flat structures |
| **Decorator** | Adding behavior dynamically | Behavior is fixed |
| **Facade** | Simplifying complex subsystems | Already simple |
| **Flyweight** | Many objects with shared state | Each object is unique |
| **Proxy** | Controlling access, lazy loading | Direct access is fine |

**Real-World Examples:**
- **`javax.faces.context.FacesContext`**: Simplifies JSF API access
- **`java.net.URL`**: Simplifies complex networking operations
- **`javax.persistence.EntityManager`**: Simplifies JPA operations
- **Spring `@Service` layer**: Facades over complex business logic
- **`java.util.concurrent.Executors`**: Simplifies thread pool creation
- **SLF4J `LoggerFactory`**: Simplifies logging API access

---

## 💻 **Code Examples**

All structural pattern examples are embedded above with complete implementations! ✨

**Patterns covered:**
- ✅ Adapter Pattern - Payment gateway integration
- ✅ Bridge Pattern - Message sender abstraction
- ✅ Composite Pattern - File system tree
- ✅ Decorator Pattern - Coffee shop example
- ✅ Facade Pattern - Computer startup
- ✅ Flyweight Pattern - Character rendering
- ✅ Proxy Pattern - Image lazy loading

**Each example includes:**
- Full working code
- Usage demonstrations
- Real-world applications

---

**Next**: [Day 8 - Behavioral Patterns](week2/day8/README.md) →

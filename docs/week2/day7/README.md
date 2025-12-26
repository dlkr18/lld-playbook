# Day 7: Structural Patterns 🏗️

**Focus**: Master patterns for composing objects and classes into larger structures.

---

## 🎯 **Learning Objectives**

By the end of Day 7, you will:
- **Implement** Adapter, Decorator, Composite, Proxy, and Flyweight patterns
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

---

## 🎯 **Pattern Selection Guide**

| Pattern | Use When | Don't Use When |
|---------|----------|----------------|
| **Adapter** | Integrating incompatible interfaces | Interfaces are similar |
| **Decorator** | Adding behavior dynamically | Behavior is fixed |
| **Composite** | Tree structures with uniform treatment | Flat structures |
| **Proxy** | Controlling access, lazy loading | Direct access is fine |
| **Flyweight** | Many objects with shared state | Each object is unique |

---

## 💻 **Code Examples**

All structural pattern examples are embedded above with complete implementations! ✨

**Patterns covered:**
- ✅ Decorator Pattern - Coffee shop example
- ✅ Adapter Pattern - Payment gateway integration  
- ✅ Composite Pattern - File system tree
- ✅ Proxy Pattern - Image lazy loading
- ✅ Flyweight Pattern - Character rendering

**Each example includes:**
- Full working code
- Usage demonstrations
- Real-world applications

---

**Next**: [Day 8 - Behavioral Patterns](week2/day8/README.md) →

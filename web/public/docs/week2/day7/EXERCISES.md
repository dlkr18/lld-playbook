# Day 7 Exercises: Structural Patterns 📝

---

## 🎯 **Exercise 1: Payment Gateway Adapter**

### **Scenario**
Your company is integrating with three different payment gateways:
- **Stripe** - Uses HTTP REST API
- **PayPal** - Uses SOAP/XML API  
- **Square** - Uses SDK with callbacks

### **Task**
Create an adapter layer so your application uses a unified payment interface.

### **Requirements**
```java
// Target interface (what your app uses)
public interface PaymentGateway {
    PaymentResult charge(Money amount, PaymentDetails details);
    RefundResult refund(String transactionId, Money amount);
    PaymentStatus getStatus(String transactionId);
}
```

### **Deliverables**
1. Adapter for each payment provider
2. Factory to select adapter based on configuration
3. Handle different error types from each provider
4. Unit tests with mocked external calls

---

## 🎯 **Exercise 2: Decorator Chain - Coffee Shop**

### **Scenario**
Build a coffee ordering system where beverages can have multiple additions.

### **Base Beverages**
- Espresso ($2.00)
- House Blend ($1.50)
- Dark Roast ($1.80)
- Decaf ($1.70)

### **Condiments/Additions**
- Milk ($0.30)
- Soy Milk ($0.45)
- Mocha ($0.50)
- Whip ($0.35)
- Vanilla ($0.40)
- Caramel ($0.50)

### **Requirements**
```java
Beverage order = new Mocha(
    new Whip(
        new SoyMilk(
            new Espresso()
        )
    )
);

System.out.println(order.getDescription()); // "Espresso, Soy Milk, Whip, Mocha"
System.out.println(order.cost());           // $3.30
```

### **Additional Features**
1. Size modifiers (Small -$0.20, Large +$0.30)
2. Double shot option (+$0.75)
3. Maximum 5 condiments per beverage

---

## 🎯 **Exercise 3: File System Composite**

### **Task**
Design a file system representation using Composite pattern.

### **Requirements**
```java
public interface FileSystemNode {
    String getName();
    long getSize();
    void display(int indent);
    Optional<FileSystemNode> find(String name);
}
```

### **Supported Operations**
1. Create files and directories
2. Calculate total size (recursively for directories)
3. Display tree structure with proper indentation
4. Find by name (breadth-first or depth-first)
5. Move/copy nodes between directories
6. Delete nodes (recursive for directories)

### **Example Output**
```
root/
├── documents/
│   ├── report.pdf (2.5 MB)
│   └── presentation.pptx (5.0 MB)
├── photos/
│   └── vacation/
│       ├── beach.jpg (3.2 MB)
│       └── sunset.jpg (2.8 MB)
└── notes.txt (0.1 MB)

Total size: 13.6 MB
```

---

## 🎯 **Exercise 4: Image Proxy with Lazy Loading**

### **Scenario**
Build an image gallery application with lazy loading using Proxy pattern.

### **Requirements**
1. **Virtual Proxy**: Load images only when displayed
2. **Protection Proxy**: Check user permissions before access
3. **Caching Proxy**: Cache loaded images in memory

### **Interface**
```java
public interface Image {
    void display();
    int getWidth();
    int getHeight();
    byte[] getData();
}
```

### **Test Cases**
```java
// Should not load until display() called
Image image = new LazyImageProxy("/path/to/large-image.jpg");
// Image not loaded yet

image.display(); // Now loads the image

// Should check permissions
Image protectedImage = new ProtectedImageProxy(image, currentUser);
if (!currentUser.hasPermission("VIEW_IMAGES")) {
    // throw AccessDeniedException
}

// Should cache
CachingImageProxy cached = new CachingImageProxy(image);
cached.display(); // Loads and caches
cached.display(); // Returns from cache
```

---

## 🎯 **Exercise 5: Flyweight - Character Rendering**

### **Scenario**
Build a text editor that efficiently renders millions of characters.

### **Problem**
Each character object takes 100 bytes. A 1M character document would need 100MB!

### **Solution**
Use Flyweight to share character objects.

### **Requirements**
```java
public interface CharacterGlyph {
    void render(int x, int y, Font font, Color color);
}

public class CharacterFactory {
    private Map<Character, CharacterGlyph> cache;
    
    public CharacterGlyph getCharacter(char c);
    public int getCacheSize();
}
```

### **Extrinsic State**
- Position (x, y)
- Font
- Color
- Style (bold, italic)

### **Intrinsic State (shared)**
- Character shape/glyph

### **Metrics**
Track memory savings by comparing:
- Without Flyweight: `numChars * fullCharacterSize`
- With Flyweight: `uniqueChars * fullCharacterSize + numChars * positionSize`

---

## 🎯 **Exercise 6: Bridge Pattern - Remote Control**

### **Scenario**
Design a universal remote control system that works with multiple devices.

### **Abstractions (Remotes)**
- Basic Remote: power, volume up/down
- Advanced Remote: basic + channel buttons, mute
- Smart Remote: advanced + app launching, voice commands

### **Implementations (Devices)**
- TV
- Sound System
- Smart Light
- Air Conditioner

### **Requirements**
```java
// Bridge allows any remote to work with any device
Device tv = new SamsungTV();
Device soundbar = new SonySoundbar();

Remote basicRemote = new BasicRemote(tv);
basicRemote.power();
basicRemote.volumeUp();

SmartRemote smartRemote = new SmartRemote(tv);
smartRemote.launchApp("Netflix");
smartRemote.voiceCommand("Play Stranger Things");
```

### **Key Points**
1. Adding new remote type shouldn't require changing devices
2. Adding new device shouldn't require changing remotes
3. Both hierarchies should evolve independently

---

## 🏋️ **Advanced Challenges**

### **Challenge 1: Multi-Level Decorator**
Create a pizza ordering system where:
- Toppings can be added to toppings (cheese on pepperoni)
- Calculate calories per layer
- Support "remove" operation

### **Challenge 2: Dynamic Proxy**
Implement a dynamic proxy that:
- Logs all method calls with parameters
- Measures execution time
- Caches results for idempotent methods
- Works with any interface

### **Challenge 3: Composite Visitor**
Extend the file system to support operations using Visitor:
- Calculate checksums
- Compress files
- Search content
- Generate reports

---

## 📊 **Grading Rubric**

| Criteria | Points |
|----------|--------|
| **Pattern Implementation** - Correct structure | 25 |
| **Flexibility** - Easy to extend | 20 |
| **Single Responsibility** - Clean separation | 20 |
| **Tests** - Comprehensive coverage | 20 |
| **Documentation** - Clear API docs | 15 |

---

**Solutions**: [EXERCISE_SOLUTIONS.md](week2/day7/EXERCISE_SOLUTIONS.md)

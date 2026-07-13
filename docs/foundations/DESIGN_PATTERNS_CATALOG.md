# Design Patterns Catalog

A comprehensive reference of all 23 Gang of Four design patterns with Java examples, use cases, and real-world applications.

---

## **Pattern Categories**

| Category | Patterns | Purpose |
|----------|----------|---------|
| **Creational** | Singleton, Factory Method, Abstract Factory, Builder, Prototype | Object creation mechanisms |
| **Structural** | Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy | Object composition |
| **Behavioral** | Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor | Object communication |

---

# CREATIONAL PATTERNS

## 1. Singleton Pattern

### **Intent**
Ensure a class has only one instance and provide a global access point.

### **When to Use**
- Database connection pools
- Configuration managers
- Logging frameworks
- Thread pools

### **Implementation**

```java
// Thread-safe Singleton with lazy initialization
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

    // Enum-based Singleton (preferred)
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
}
```

### **Real-World Examples**
- `java.lang.Runtime.getRuntime()`
- `java.awt.Desktop.getDesktop()`
- Spring beans with `@Scope("singleton")`

---

## 2. Factory Method Pattern

### **Intent**
Define an interface for creating objects, let subclasses decide which class to instantiate.

### **When to Use**
- When class doesn't know what subclasses it needs to create
- When subclasses should specify objects to create
- When you want to localize knowledge of helper classes

### **Implementation**

```java
// Product interface
public interface Notification {
    void send(String recipient, String message);
}

// Concrete products
public class EmailNotification implements Notification {
    @Override
    public void send(String recipient, String message) {
        System.out.println("Sending email to " + recipient + ": " + message);
    }
}

public class SMSNotification implements Notification {
    @Override
    public void send(String recipient, String message) {
        System.out.println("Sending SMS to " + recipient + ": " + message);
    }
}

public class PushNotification implements Notification {
    @Override
    public void send(String recipient, String message) {
        System.out.println("Sending push to " + recipient + ": " + message);
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

// Concrete creators
public class EmailNotificationFactory extends NotificationFactory {
    @Override
    protected Notification createNotification() {
        return new EmailNotification();
    }
}

public class SMSNotificationFactory extends NotificationFactory {
    @Override
    protected Notification createNotification() {
        return new SMSNotification();
    }
}

// Usage
NotificationFactory factory = new EmailNotificationFactory();
factory.notifyUser("user@email.com", "Hello!");
```

### **Real-World Examples**
- `java.util.Calendar.getInstance()`
- `java.text.NumberFormat.getInstance()`
- JDBC `DriverManager.getConnection()`

---

## 3. Abstract Factory Pattern

### **Intent**
Provide an interface for creating families of related objects without specifying concrete classes.

### **When to Use**
- When system should be independent of product creation
- When system should be configured with one of multiple product families
- When family of products is designed to work together

### **Implementation**

```java
// Abstract products
public interface Button {
    void render();
    void onClick(Runnable action);
}

public interface Checkbox {
    void render();
    boolean isChecked();
}

public interface TextField {
    void render();
    String getValue();
}

// Concrete products - Windows
public class WindowsButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering Windows-style button");
    }

    @Override
    public void onClick(Runnable action) {
        action.run();
    }
}

// Concrete products - MacOS
public class MacOSButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering MacOS-style button");
    }

    @Override
    public void onClick(Runnable action) {
        action.run();
    }
}

// Abstract factory
public interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
    TextField createTextField();
}

// Concrete factories
public class WindowsFactory implements GUIFactory {
    @Override
    public Button createButton() { return new WindowsButton(); }

    @Override
    public Checkbox createCheckbox() { return new WindowsCheckbox(); }

    @Override
    public TextField createTextField() { return new WindowsTextField(); }
}

public class MacOSFactory implements GUIFactory {
    @Override
    public Button createButton() { return new MacOSButton(); }

    @Override
    public Checkbox createCheckbox() { return new MacOSCheckbox(); }

    @Override
    public TextField createTextField() { return new MacOSTextField(); }
}

// Client
public class Application {
    private final GUIFactory factory;

    public Application(GUIFactory factory) {
        this.factory = factory;
    }

    public void createUI() {
        Button button = factory.createButton();
        Checkbox checkbox = factory.createCheckbox();
        button.render();
        checkbox.render();
    }
}
```

### **Real-World Examples**
- `javax.xml.parsers.DocumentBuilderFactory`
- `javax.xml.transform.TransformerFactory`
- Cross-platform UI toolkits

---

## 4. Builder Pattern

### **Intent**
Separate the construction of complex objects from their representation.

### **When to Use**
- When object has many optional parameters
- When construction has multiple steps
- When you want immutable objects with readable construction

### **Implementation**

```java
public class HttpRequest {

    private final String method;
    private final String url;
    private final Map<String, String> headers;
    private final String body;
    private final int timeout;
    private final boolean followRedirects;

    private HttpRequest(Builder builder) {
        this.method = builder.method;
        this.url = builder.url;
        this.headers = new HashMap<>(builder.headers);
        this.body = builder.body;
        this.timeout = builder.timeout;
        this.followRedirects = builder.followRedirects;
    }

    public static Builder builder(String method, String url) {
        return new Builder(method, url);
    }

    public static class Builder {
        // Required
        private final String method;
        private final String url;

        // Optional with defaults
        private Map<String, String> headers = new HashMap<>();
        private String body = null;
        private int timeout = 30000;
        private boolean followRedirects = true;

        public Builder(String method, String url) {
            this.method = method;
            this.url = url;
        }

        public Builder header(String name, String value) {
            this.headers.put(name, value);
            return this;
        }

        public Builder body(String body) {
            this.body = body;
            return this;
        }

        public Builder timeout(int timeout) {
            this.timeout = timeout;
            return this;
        }

        public Builder followRedirects(boolean follow) {
            this.followRedirects = follow;
            return this;
        }

        public HttpRequest build() {
            validate();
            return new HttpRequest(this);
        }

        private void validate() {
            if (method == null || method.isEmpty()) {
                throw new IllegalStateException("Method is required");
            }
            if (url == null || url.isEmpty()) {
                throw new IllegalStateException("URL is required");
            }
        }
    }
}

// Usage
HttpRequest request = HttpRequest.builder("POST", "https://api.example.com/users")
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer token123")
    .body("{\"name\": \"John\"}")
    .timeout(5000)
    .build();
```

---

## 5. Prototype Pattern

### **Intent**
Create new objects by copying existing ones (prototypes).

### **When to Use**
- When object creation is expensive (database calls, file reads)
- When objects have many shared configurations
- When you need to create objects at runtime based on dynamic types

### **Implementation**

```java
public interface Prototype<T> extends Cloneable {
    T clone();
}

public class Document implements Prototype<Document> {
    private String title;
    private String content;
    private List<String> authors;
    private Map<String, String> metadata;

    public Document() {
        this.authors = new ArrayList<>();
        this.metadata = new HashMap<>();
    }

    // Copy constructor for deep copy
    public Document(Document source) {
        this.title = source.title;
        this.content = source.content;
        this.authors = new ArrayList<>(source.authors);
        this.metadata = new HashMap<>(source.metadata);
    }

    @Override
    public Document clone() {
        return new Document(this);
    }

    // Setters...
}

// Prototype Registry
public class DocumentRegistry {
    private Map<String, Document> prototypes = new HashMap<>();

    public void register(String name, Document prototype) {
        prototypes.put(name, prototype);
    }

    public Document create(String name) {
        Document prototype = prototypes.get(name);
        if (prototype == null) {
            throw new IllegalArgumentException("No prototype: " + name);
        }
        return prototype.clone();
    }
}

// Usage
DocumentRegistry registry = new DocumentRegistry();

Document reportTemplate = new Document();
reportTemplate.setTitle("Quarterly Report");
reportTemplate.addAuthor("Finance Team");
registry.register("quarterly-report", reportTemplate);

Document q1Report = registry.create("quarterly-report");
q1Report.setTitle("Q1 2024 Report");
```

---

# STRUCTURAL PATTERNS

## 6. Adapter Pattern

### **Intent**
Convert the interface of a class into another interface clients expect.

### **When to Use**
- Integrating legacy code
- Using third-party libraries with different interfaces
- Reusing classes with incompatible interfaces

### **Implementation**

```java
// Target interface (what client expects)
public interface MediaPlayer {
    void play(String filename);
}

// Adaptee (existing class with different interface)
public class VLCPlayer {
    public void playVLC(String filename) {
        System.out.println("Playing VLC format: " + filename);
    }
}

public class MP4Player {
    public void playMP4(String filename) {
        System.out.println("Playing MP4 format: " + filename);
    }
}

// Adapter
public class MediaAdapter implements MediaPlayer {

    private final String mediaType;
    private VLCPlayer vlcPlayer;
    private MP4Player mp4Player;

    public MediaAdapter(String mediaType) {
        this.mediaType = mediaType;
        if (mediaType.equalsIgnoreCase("vlc")) {
            vlcPlayer = new VLCPlayer();
        } else if (mediaType.equalsIgnoreCase("mp4")) {
            mp4Player = new MP4Player();
        }
    }

    @Override
    public void play(String filename) {
        if (mediaType.equalsIgnoreCase("vlc")) {
            vlcPlayer.playVLC(filename);
        } else if (mediaType.equalsIgnoreCase("mp4")) {
            mp4Player.playMP4(filename);
        }
    }
}

// Client
public class AudioPlayer implements MediaPlayer {

    @Override
    public void play(String filename) {
        String extension = getExtension(filename);

        if (extension.equals("mp3")) {
            System.out.println("Playing MP3: " + filename);
        } else if (extension.equals("vlc") || extension.equals("mp4")) {
            MediaAdapter adapter = new MediaAdapter(extension);
            adapter.play(filename);
        } else {
            System.out.println("Unsupported format: " + extension);
        }
    }
}
```

---

## 7. Decorator Pattern

### **Intent**
Attach additional responsibilities to objects dynamically.

### **When to Use**
- Adding features to objects without affecting others
- When extension by subclassing is impractical
- When you need to add and remove responsibilities at runtime

### **Implementation**

```java
// Component interface
public interface DataSource {
    void writeData(String data);
    String readData();
}

// Concrete component
public class FileDataSource implements DataSource {
    private final String filename;

    public FileDataSource(String filename) {
        this.filename = filename;
    }

    @Override
    public void writeData(String data) {
        // Write to file
    }

    @Override
    public String readData() {
        // Read from file
        return "file content";
    }
}

// Base decorator
public abstract class DataSourceDecorator implements DataSource {
    protected final DataSource wrappee;

    public DataSourceDecorator(DataSource source) {
        this.wrappee = source;
    }

    @Override
    public void writeData(String data) {
        wrappee.writeData(data);
    }

    @Override
    public String readData() {
        return wrappee.readData();
    }
}

// Concrete decorators
public class EncryptionDecorator extends DataSourceDecorator {

    public EncryptionDecorator(DataSource source) {
        super(source);
    }

    @Override
    public void writeData(String data) {
        super.writeData(encrypt(data));
    }

    @Override
    public String readData() {
        return decrypt(super.readData());
    }

    private String encrypt(String data) {
        // Encryption logic
        return "encrypted:" + data;
    }

    private String decrypt(String data) {
        // Decryption logic
        return data.replace("encrypted:", "");
    }
}

public class CompressionDecorator extends DataSourceDecorator {

    public CompressionDecorator(DataSource source) {
        super(source);
    }

    @Override
    public void writeData(String data) {
        super.writeData(compress(data));
    }

    @Override
    public String readData() {
        return decompress(super.readData());
    }

    private String compress(String data) { return "compressed:" + data; }
    private String decompress(String data) { return data.replace("compressed:", ""); }
}

// Usage - compose decorators
DataSource source = new FileDataSource("data.txt");
source = new CompressionDecorator(source);
source = new EncryptionDecorator(source);
source.writeData("sensitive data");
```

---

## 8. Composite Pattern

### **Intent**
Compose objects into tree structures to represent part-whole hierarchies.

### **Implementation**

```java
public interface Component {
    void render();
    double getPrice();
}

public class Product implements Component {
    private final String name;
    private final double price;

    public Product(String name, double price) {
        this.name = name;
        this.price = price;
    }

    @Override
    public void render() {
        System.out.println("Product: " + name + " - $" + price);
    }

    @Override
    public double getPrice() {
        return price;
    }
}

public class Box implements Component {
    private final String name;
    private final List<Component> children = new ArrayList<>();

    public Box(String name) {
        this.name = name;
    }

    public void add(Component component) {
        children.add(component);
    }

    @Override
    public void render() {
        System.out.println("Box: " + name);
        for (Component child : children) {
            child.render();
        }
    }

    @Override
    public double getPrice() {
        return children.stream()
            .mapToDouble(Component::getPrice)
            .sum();
    }
}

// Usage
Box bigBox = new Box("Big Box");
bigBox.add(new Product("Phone", 999));
bigBox.add(new Product("Charger", 29));

Box smallBox = new Box("Small Box");
smallBox.add(new Product("Earbuds", 199));
smallBox.add(new Product("Case", 49));

bigBox.add(smallBox);
bigBox.render();
System.out.println("Total: $" + bigBox.getPrice());
```

---

# BEHAVIORAL PATTERNS

## 9. Strategy Pattern

### **Intent**
Define a family of algorithms, encapsulate each one, and make them interchangeable.

### **Implementation**

```java
@FunctionalInterface
public interface PaymentStrategy {
    void pay(Money amount);
}

public class CreditCardPayment implements PaymentStrategy {
    private final String cardNumber;
    private final String cvv;

    public CreditCardPayment(String cardNumber, String cvv) {
        this.cardNumber = cardNumber;
        this.cvv = cvv;
    }

    @Override
    public void pay(Money amount) {
        System.out.println("Paying " + amount + " with credit card " +
            cardNumber.substring(cardNumber.length() - 4));
    }
}

public class PayPalPayment implements PaymentStrategy {
    private final String email;

    @Override
    public void pay(Money amount) {
        System.out.println("Paying " + amount + " via PayPal: " + email);
    }
}

public class CryptoPayment implements PaymentStrategy {
    private final String walletAddress;

    @Override
    public void pay(Money amount) {
        System.out.println("Paying " + amount + " with crypto wallet: " + walletAddress);
    }
}

// Context
public class ShoppingCart {
    private List<Product> items = new ArrayList<>();
    private PaymentStrategy paymentStrategy;

    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }

    public void checkout() {
        Money total = calculateTotal();
        paymentStrategy.pay(total);
    }
}

// Usage
ShoppingCart cart = new ShoppingCart();
cart.addItem(new Product("Laptop", Money.dollars(999)));
cart.setPaymentStrategy(new CreditCardPayment("1234-5678-9012-3456", "123"));
cart.checkout();
```

---

## 10. Observer Pattern

### **Intent**
Define a one-to-many dependency between objects so that when one object changes state, all dependents are notified.

### **Implementation**

```java
public interface Observer<T> {
    void update(T event);
}

public interface Subject<T> {
    void attach(Observer<T> observer);
    void detach(Observer<T> observer);
    void notifyObservers(T event);
}

public class StockTicker implements Subject<StockPrice> {
    private final List<Observer<StockPrice>> observers = new CopyOnWriteArrayList<>();
    private final Map<String, StockPrice> prices = new ConcurrentHashMap<>();

    @Override
    public void attach(Observer<StockPrice> observer) {
        observers.add(observer);
    }

    @Override
    public void detach(Observer<StockPrice> observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers(StockPrice event) {
        for (Observer<StockPrice> observer : observers) {
            observer.update(event);
        }
    }

    public void updatePrice(String symbol, double price) {
        StockPrice stockPrice = new StockPrice(symbol, price);
        prices.put(symbol, stockPrice);
        notifyObservers(stockPrice);
    }
}

public class PriceAlert implements Observer<StockPrice> {
    private final String symbol;
    private final double threshold;

    @Override
    public void update(StockPrice event) {
        if (event.getSymbol().equals(symbol) && event.getPrice() >= threshold) {
            System.out.println("ALERT: " + symbol + " reached $" + event.getPrice());
        }
    }
}

// Usage
StockTicker ticker = new StockTicker();
ticker.attach(new PriceAlert("AAPL", 200.0));
ticker.attach(new PriceAlert("GOOGL", 150.0));
ticker.updatePrice("AAPL", 205.0); // Triggers alert
```

---

## 11. Command Pattern

### **Intent**
Encapsulate a request as an object, allowing parameterization, queuing, and undo operations.

### **Implementation**

```java
public interface Command {
    void execute();
    void undo();
}

public class TextEditor {
    private StringBuilder text = new StringBuilder();
    private Deque<Command> history = new ArrayDeque<>();
    private Deque<Command> redoStack = new ArrayDeque<>();

    public void executeCommand(Command command) {
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

    public String getText() { return text.toString(); }
    public StringBuilder getTextBuilder() { return text; }
}

public class InsertCommand implements Command {
    private final TextEditor editor;
    private final int position;
    private final String text;

    public InsertCommand(TextEditor editor, int position, String text) {
        this.editor = editor;
        this.position = position;
        this.text = text;
    }

    @Override
    public void execute() {
        editor.getTextBuilder().insert(position, text);
    }

    @Override
    public void undo() {
        editor.getTextBuilder().delete(position, position + text.length());
    }
}

public class DeleteCommand implements Command {
    private final TextEditor editor;
    private final int start;
    private final int end;
    private String deletedText;

    @Override
    public void execute() {
        deletedText = editor.getText().substring(start, end);
        editor.getTextBuilder().delete(start, end);
    }

    @Override
    public void undo() {
        editor.getTextBuilder().insert(start, deletedText);
    }
}
```

---

# REMAINING STRUCTURAL PATTERNS

## 12. Facade Pattern

### **Intent**
Provide one simple entry point over a complicated subsystem; callers depend on the facade, not the internal wiring.

### **When to Use**
- A subsystem has many collaborating classes and clients only need a few high-level operations.
- You want to decouple clients from internals so internals can change freely.

### **Implementation**
```java
public final class QueryEngine {                 // the facade
    private final InMemoryQueryService inMemory = new InMemoryQueryService();
    private final SqlTranslator sql = new SqlTranslator();
    private final MongoTranslator mongo = new MongoTranslator();

    public QueryResponse execute(QueryRequest r) { return inMemory.execute(r); }
    public SqlStatement  toSql(Query q)          { return sql.translate(q); }
    public String        toMongo(Query q)        { return mongo.translate(q); }
}
// Caller says engine.execute(req) — never touches validator, predicate builder, pipeline.
```

### **Applied in**
`designpatterns/structural/FacadeDemo` · **querydsl** (`QueryEngine`), **ministore** (`MiniStore`). Distinct from Decorator: a facade fronts a *whole subsystem* and adds no new behavior; it just simplifies.

---

## 13. Proxy Pattern

### **Intent**
A stand-in with the same interface as the real object, controlling access to it (lazy creation, caching, access control, remoting).

### **When to Use**
- **Virtual proxy** — defer expensive creation until first use.
- **Protection proxy** — enforce access rules before delegating.
- **Caching/remote proxy** — memoize results, or hide a network call.

### **Implementation**
```java
interface Image { void render(); }

class RealImage implements Image {                 // expensive
    RealImage(String path) { /* load from disk */ }
    public void render() { /* draw */ }
}

class LazyImage implements Image {                 // virtual proxy
    private final String path;
    private RealImage real;                        // created on demand
    LazyImage(String path) { this.path = path; }
    public void render() {
        if (real == null) real = new RealImage(path);   // control access
        real.render();
    }
}
```

### **Applied in**
`designpatterns/structural/ProxyDemo`. Same interface as the target (unlike Decorator, whose job is to *add* behavior, or Facade, which fronts many classes).

---

## 14. Bridge Pattern

### **Intent**
Split an abstraction from its implementation so the two vary independently (avoids a class explosion of every abstraction × every implementation).

### **When to Use**
- You have two orthogonal dimensions (e.g. Shape × Renderer, Message × Channel) that would otherwise combine into N×M subclasses.

### **Implementation**
```java
interface Renderer { void drawCircle(double r); }        // implementation side
class VectorRenderer implements Renderer { public void drawCircle(double r){/*...*/} }
class RasterRenderer implements Renderer { public void drawCircle(double r){/*...*/} }

abstract class Shape {                                    // abstraction side
    protected final Renderer renderer;                    // the "bridge"
    Shape(Renderer r) { this.renderer = r; }
    abstract void draw();
}
class Circle extends Shape {
    private final double radius;
    Circle(Renderer r, double radius){ super(r); this.radius = radius; }
    void draw() { renderer.drawCircle(radius); }
}
// new shape OR new renderer = one class, not N×M.
```

### **Applied in**
`designpatterns/structural/BridgeDemo`. Tell: "these two things vary independently — I don't want a subclass for every combination."

---

## 15. Flyweight Pattern

### **Intent**
Share immutable intrinsic state across many objects to save memory; keep the varying (extrinsic) state outside.

### **When to Use**
- You need a huge number of similar objects (glyphs, tiles, particles) and most of their state is identical/immutable.

### **Implementation**
```java
final class Glyph {                    // intrinsic (shared): the character shape
    private final char c;
    Glyph(char c){ this.c = c; }
    void draw(int x, int y) { /* extrinsic x,y passed in per call */ }
}
class GlyphFactory {
    private final Map<Character, Glyph> pool = new HashMap<>();
    Glyph of(char c) { return pool.computeIfAbsent(c, Glyph::new); }  // reuse
}
// 1M 'a' characters share ONE Glyph('a'); position is passed at draw time.
```

### **Applied in**
`designpatterns/structural/FlyweightDemo`. Interview tell: "millions of near-identical objects, most state immutable → share it."

---

# REMAINING BEHAVIORAL PATTERNS

## 16. State Pattern

### **Intent**
Let an object change its behavior when its internal state changes — it appears to change class. Each state is an object; transitions are explicit.

### **When to Use**
- Behavior depends on a status, and a big `switch(state)` in every method is growing.
- Illegal transitions should be impossible/rejected in one place.

### **Implementation**
```java
interface VendingState {
    VendingState insertCoin(Machine m, Money c);
    VendingState selectProduct(Machine m, String code);
}
class IdleState implements VendingState {
    public VendingState insertCoin(Machine m, Money c){ m.addBalance(c); return new HasMoneyState(); }
    public VendingState selectProduct(Machine m, String code){ throw new IllegalStateException("insert coin first"); }
}
class HasMoneyState implements VendingState { /* ... returns DispensingState ... */ }
// lightweight alternative: an enum with a canTransitionTo(next) table when states carry no behavior.
```

### **Applied in**
`designpatterns/behavioral/StateDemo` · **vendingmachine**, **atm**, **elevator**, order/booking lifecycles. Enum-with-transition-table variant used in **digitalwallet** (`TransactionStatus`).

---

## 17. Template Method Pattern

### **Intent**
Define the skeleton of an algorithm in a base method, letting subclasses fill in specific steps without changing the overall flow.

### **When to Use**
- Several variants share the same fixed sequence but differ in a few steps (the "hook" methods).

### **Implementation**
```java
abstract class ChessGame {
    public final MoveResult makeMove(Move m) {     // the fixed skeleton (final!)
        if (!validTurn(m))        return reject("not your turn");
        if (!pieceCanMove(m))     return reject("illegal for piece");   // hook
        if (!pathClear(m))        return reject("blocked");
        if (wouldLeaveInCheck(m)) return reject("king in check");
        apply(m);
        return evaluateStatus();                    // hook
    }
    protected abstract boolean pieceCanMove(Move m); // subclass/strategy fills in
    protected abstract MoveResult evaluateStatus();
}
```

### **Applied in**
`designpatterns/behavioral/TemplateMethodDemo` · **chess** (`makeMove` pipeline). Note: the *varying step* (piece move rule) is often itself a **Strategy** — the two patterns pair naturally.

---

## 18. Chain of Responsibility Pattern

### **Intent**
Pass a request along a chain of handlers; each either handles it or forwards to the next. Sender is decoupled from which handler acts.

### **When to Use**
- Multiple objects may handle a request and the handler isn't known in advance (filters, middleware, approval chains, dispensers).

### **Implementation**
```java
abstract class Dispenser {
    private Dispenser next;
    Dispenser linkTo(Dispenser n){ this.next = n; return n; }
    void dispense(int amount) {
        int give = handle(amount);           // this denomination handles what it can
        if (amount - give > 0 && next != null) next.dispense(amount - give);
    }
    protected abstract int handle(int amount);
}
// $2000 -> Rs500 handler -> Rs100 handler -> ... each takes its share, forwards the rest.
```

### **Applied in**
`designpatterns/behavioral/ChainOfResponsibilityDemo` · **logging** (appender/filter chain), **atm** (denomination dispensing).

---

## 19. Visitor Pattern

### **Intent**
Add new operations over a fixed set of node types without modifying the nodes — each operation is a visitor; nodes just `accept` it (double dispatch).

### **When to Use**
- A stable object structure (an AST, a tree) needs many *operations* (render, evaluate, validate) that you'd otherwise scatter across every node class.

### **Implementation**
```java
interface Condition { <T> T accept(ConditionVisitor<T> v); }
class Comparison implements Condition {
    public <T> T accept(ConditionVisitor<T> v){ return v.visitComparison(this); }
}
interface ConditionVisitor<T> {                 // each operation = one impl
    T visitComparison(Comparison c);
    T visitLogical(LogicalCondition l);
    T visitNot(NotCondition n);
}
// SqlTranslator, MongoTranslator, PredicateBuilder, QueryValidator all implement it.
```

### **Applied in**
`designpatterns/behavioral/VisitorDemo` · **querydsl** (SQL/Mongo/predicate/validator visitors over the Condition AST). Trade-off: easy to add operations, hard to add node types (the compiler forces every visitor to handle a new node).

---

## 20. Iterator Pattern

### **Intent**
Access the elements of a collection sequentially without exposing its internal representation.

### **When to Use**
- You want uniform traversal over different container structures, or multiple simultaneous traversals.

### **Implementation**
```java
class Playlist implements Iterable<Song> {
    private final Song[] songs;
    public Iterator<Song> iterator() {
        return new Iterator<Song>() {
            private int i = 0;
            public boolean hasNext() { return i < songs.length; }
            public Song next()       { return songs[i++]; }
        };
    }
}
for (Song s : playlist) { /* traversal, internals hidden */ }
```

### **Applied in**
`designpatterns/behavioral/IteratorDemo`. In Java you usually implement `Iterable`/`Iterator` rather than roll your own — but know the pattern by name.

---

## 21. Mediator Pattern

### **Intent**
Centralize how a set of objects interact in a mediator, so they don't refer to each other directly (turns a many-to-many mesh into a hub-and-spoke).

### **When to Use**
- Components are tightly coupled by direct references (chat participants, UI widgets, air-traffic control).

### **Implementation**
```java
interface ChatRoom { void send(String from, String msg); }
class ChatRoomImpl implements ChatRoom {
    private final Map<String, User> users = new HashMap<>();
    public void send(String from, String msg) {
        users.values().forEach(u -> { if (!u.name().equals(from)) u.receive(from, msg); });
    }
}
class User {                       // talks only to the mediator, never to other users
    private final ChatRoom room;
    void post(String msg) { room.send(name, msg); }
}
```

### **Applied in**
`designpatterns/behavioral/MediatorDemo`. Related to Observer, but the mediator holds the *coordination logic*, not just fan-out.

---

## 22. Memento Pattern

### **Intent**
Capture an object's internal state so it can be restored later (undo/snapshots) without exposing its internals.

### **When to Use**
- Undo/redo, checkpoints, transactional rollback of an in-memory object.

### **Implementation**
```java
class Editor {
    private String content = "";
    void type(String s){ content += s; }
    Memento save()               { return new Memento(content); }   // snapshot
    void restore(Memento m)      { this.content = m.state; }
    static final class Memento { private final String state; Memento(String s){ state = s; } }
}
Deque<Editor.Memento> history = new ArrayDeque<>();
history.push(editor.save());   // ... later: editor.restore(history.pop());
```

### **Applied in**
`designpatterns/behavioral/MementoDemo`. Pairs with Command for undo (Command = the action, Memento = the state to roll back to).

---

## 23. Interpreter Pattern

### **Intent**
Represent a grammar as a class hierarchy and evaluate sentences of that language by walking the tree.

### **When to Use**
- You have a small, stable language (filter expressions, arithmetic, rules) worth modeling as an AST you evaluate.

### **Implementation**
```java
interface Expr { boolean eval(Map<String,Object> row); }
class Eq  implements Expr { String f; Object v; public boolean eval(Map<String,Object> r){ return v.equals(r.get(f)); } }
class And implements Expr { Expr a,b; public boolean eval(Map<String,Object> r){ return a.eval(r) && b.eval(r); } }
// the tree IS the program; eval() interprets it per input.
```

### **Applied in**
`designpatterns/behavioral/InterpreterDemo` · **querydsl** (`PredicateBuilder` turns the Condition AST into an evaluable predicate — the in-memory backend literally *interprets* the query). Interpreter is the canonical use case for a query-DSL problem.

---

## **Pattern Selection Quick Reference**

| Problem | Pattern |
|---------|---------|
| Need only one instance | Singleton |
| Create objects without specifying class | Factory Method |
| Create families of related objects | Abstract Factory |
| Complex object construction | Builder |
| Clone objects | Prototype |
| Incompatible interfaces | Adapter |
| Add behavior without subclassing | Decorator |
| Tree structures | Composite |
| Control access to object | Proxy |
| Switchable algorithms | Strategy |
| State-dependent behavior | State |
| Notify multiple objects | Observer |
| Undo/redo operations | Command |
| Pass requests along chain | Chain of Responsibility |
| Define algorithm skeleton | Template Method |
| Simplify a subsystem behind one entry | Facade |
| Add operations to a fixed node tree | Visitor |
| Evaluate a small language / expression tree | Interpreter |
| Two dimensions vary independently | Bridge |
| Share many immutable objects (save memory) | Flyweight |
| Traverse a collection uniformly | Iterator |
| Decouple many-to-many interactions | Mediator |
| Snapshot & restore state (undo) | Memento |

---

## **Code Examples Location**

**All 23 patterns are runnable demos** (each a `*Demo.java` with a `main()`):

```
src/main/java/com/you/lld/designpatterns/
  creational/   Singleton, FactoryMethod, AbstractFactory, Builder, Prototype
  structural/   Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy
  behavioral/   ChainOfResponsibility, Command, Interpreter, Iterator, Mediator,
                Memento, Observer, State, Strategy, TemplateMethod, Visitor
```

Run any one:
```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.designpatterns.behavioral.StateDemo"
```

**Patterns applied in the LLD problems** (pattern → problem that uses it):
Strategy → `ratelimiter`, `ministore` · State → `vendingmachine`, `atm` · Observer → `notification`,
`pubsub` · Composite → `filesystem`, `parkinglot` · Decorator → `lrucache` · Visitor/Interpreter →
`querydsl` · Command → `digitalwallet` · Template Method → `chess` · Facade → `ministore`,
`querydsl` · Chain of Responsibility → `logging`, `atm` · Builder → `querydsl`.

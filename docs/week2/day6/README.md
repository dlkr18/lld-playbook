# Day 6: Creational Patterns 🏗️

**Focus**: Master object creation patterns that provide flexibility, control, and maintainability in complex systems.

---

## 🎯 **Learning Objectives**

By the end of Day 6, you will:
- **Understand** when and why to use creational patterns
- **Implement** Builder, Factory, and Prototype patterns in Java
- **Apply** patterns to real-world scenarios (e-commerce, gaming, enterprise)
- **Evaluate** trade-offs and choose appropriate patterns for different situations
- **Refactor** existing code to use creational patterns effectively

---

## 📚 **Patterns Covered**

### **1. Builder Pattern** 🔨
**Problem**: Creating complex objects with many optional parameters
**Solution**: Step-by-step construction with fluent interface

**Key Benefits:**
- Eliminates telescoping constructor problem
- Immutable objects with validation
- Fluent, readable API
- Optional parameters handling

**Code Examples:**

<details open>
<summary>📄 <strong>User.java</strong> - Complex user creation with Builder</summary>

```java
package com.you.lld.examples.week2.day6.builder;

public class User {
    // Required fields
    private final String userId;
    private final String email;
    
    // Optional fields
    private final String firstName;
    private final String lastName;
    private final int age;
    private final String phoneNumber;
    private final String address;
    
    private User(Builder builder) {
        this.userId = builder.userId;
        this.email = builder.email;
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.age = builder.age;
        this.phoneNumber = builder.phoneNumber;
        this.address = builder.address;
    }
    
    // Static Builder class
    public static class Builder {
        // Required
        private final String userId;
        private final String email;
        
        // Optional - with defaults
        private String firstName = "";
        private String lastName = "";
        private int age = 0;
        private String phoneNumber = "";
        private String address = "";
        
        public Builder(String userId, String email) {
            this.userId = userId;
            this.email = email;
        }
        
        public Builder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }
        
        public Builder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }
        
        public Builder age(int age) {
            this.age = age;
            return this;
        }
        
        public Builder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }
        
        public Builder address(String address) {
            this.address = address;
            return this;
        }
        
        public User build() {
            // Validation
            if (userId == null || userId.isEmpty()) {
                throw new IllegalStateException("userId is required");
            }
            if (email == null || !email.contains("@")) {
                throw new IllegalStateException("valid email is required");
            }
            return new User(this);
        }
    }
    
    // Getters
    public String getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public int getAge() { return age; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getAddress() { return address; }
}
```

**Usage:**
```java
// Clean, readable object creation
User user = new User.Builder("user123", "john@example.com")
    .firstName("John")
    .lastName("Doe")
    .age(30)
    .phoneNumber("+1234567890")
    .build();
```

</details>

**See also:** [All Builder examples](/week2/day6/CODE#builder) including SqlQueryBuilder and HttpRequestBuilder


### **2. Factory Pattern** 🏭
**Problem**: Object creation logic is complex or needs to be centralized
**Solution**: Delegate object creation to specialized factory classes

**Variants Covered:**
- **Simple Factory**: Basic object creation
- **Factory Method**: Subclass decides which class to instantiate
- **Abstract Factory**: Family of related objects

**Key Benefits:**
- Encapsulates object creation logic
- Supports polymorphism and extensibility
- Centralizes configuration and dependencies
- Enables easy testing with mock objects

**Code Examples:**

<details open>
<summary>📄 <strong>PaymentProcessorFactory.java</strong> - Multiple payment methods</summary>

```java
package com.you.lld.examples.week2.day6.factory;

// Payment interface
interface PaymentProcessor {
    boolean processPayment(double amount);
    String getPaymentMethod();
}

// Concrete implementations
class CreditCardProcessor implements PaymentProcessor {
    @Override
    public boolean processPayment(double amount) {
        System.out.println("Processing $" + amount + " via Credit Card");
        return true;
    }
    
    @Override
    public String getPaymentMethod() {
        return "Credit Card";
    }
}

class PayPalProcessor implements PaymentProcessor {
    @Override
    public boolean processPayment(double amount) {
        System.out.println("Processing $" + amount + " via PayPal");
        return true;
    }
    
    @Override
    public String getPaymentMethod() {
        return "PayPal";
    }
}

class BitcoinProcessor implements PaymentProcessor {
    @Override
    public boolean processPayment(double amount) {
        System.out.println("Processing $" + amount + " via Bitcoin");
        return true;
    }
    
    @Override
    public String getPaymentMethod() {
        return "Bitcoin";
    }
}

// Factory
public class PaymentProcessorFactory {
    public static PaymentProcessor createProcessor(String type) {
        switch (type.toUpperCase()) {
            case "CREDIT_CARD":
                return new CreditCardProcessor();
            case "PAYPAL":
                return new PayPalProcessor();
            case "BITCOIN":
                return new BitcoinProcessor();
            default:
                throw new IllegalArgumentException("Unknown payment type: " + type);
        }
    }
}
```

**Usage:**
```java
// Factory handles object creation logic
PaymentProcessor processor = PaymentProcessorFactory.createProcessor("PAYPAL");
processor.processPayment(99.99);

// Easy to add new payment methods without changing client code
PaymentProcessor bitcoin = PaymentProcessorFactory.createProcessor("BITCOIN");
bitcoin.processPayment(0.001);
```

</details>

**See also:** [All Factory examples](/week2/day6/CODE#factory) including DatabaseConnectionFactory and NotificationFactory


### **3. Prototype Pattern** 🧬
**Problem**: Creating objects is expensive or complex, need copies of existing objects
**Solution**: Clone existing objects instead of creating from scratch

**Key Benefits:**
- Avoids expensive object creation
- Supports dynamic configuration
- Enables object copying with modifications
- Useful for caching and object pools

**Code Examples:**

<details open>
<summary>📄 <strong>GameCharacter.java</strong> - RPG character creation with Prototype</summary>

```java
package com.you.lld.examples.week2.day6.prototype;

// Prototype interface
interface Prototype {
    Prototype clone();
}

// Game Character with Prototype
public class GameCharacter implements Prototype {
    private String name;
    private String characterClass;
    private int level;
    private int health;
    private int mana;
    private List<String> skills;
    private Equipment equipment;
    
    public GameCharacter(String name, String characterClass) {
        this.name = name;
        this.characterClass = characterClass;
        this.level = 1;
        this.health = 100;
        this.mana = 50;
        this.skills = new ArrayList<>();
        this.equipment = new Equipment();
    }
    
    // Copy constructor for deep cloning
    private GameCharacter(GameCharacter other) {
        this.name = other.name;
        this.characterClass = other.characterClass;
        this.level = other.level;
        this.health = other.health;
        this.mana = other.mana;
        this.skills = new ArrayList<>(other.skills);
        this.equipment = other.equipment.clone();
    }
    
    @Override
    public GameCharacter clone() {
        return new GameCharacter(this);
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public void levelUp() {
        this.level++;
        this.health += 20;
        this.mana += 10;
    }
    
    public void addSkill(String skill) {
        this.skills.add(skill);
    }
    
    @Override
    public String toString() {
        return String.format("%s the %s (Level %d)", name, characterClass, level);
    }
}
```

**Usage:**
```java
// Create a base warrior character
GameCharacter baseWarrior = new GameCharacter("Template", "Warrior");
baseWarrior.addSkill("Sword Fighting");
baseWarrior.addSkill("Shield Block");

// Clone for new players (much faster than creating from scratch)
GameCharacter player1 = baseWarrior.clone();
player1.setName("Aragorn");

GameCharacter player2 = baseWarrior.clone();
player2.setName("Boromir");
player2.levelUp();

// Each clone is independent
System.out.println(player1); // Aragorn the Warrior (Level 1)
System.out.println(player2); // Boromir the Warrior (Level 2)
```

</details>

**See also:** [All Prototype examples](/week2/day6/CODE#prototype) including DocumentTemplate and Configuration


---

## 🏗️ **Real-World Applications**

### **E-commerce Platform:**
- **Builder**: Product creation with multiple variants, options, and configurations
- **Factory**: Payment processing with different gateways (Stripe, PayPal, etc.)
- **Prototype**: Product templates for quick catalog creation

### **Gaming System:**
- **Builder**: Complex game world generation with terrain, objects, NPCs
- **Factory**: Different enemy types based on game level and difficulty
- **Prototype**: Character templates for quick player creation

### **Enterprise Application:**
- **Builder**: Complex report generation with filters, sorting, formatting
- **Factory**: Different data source connections (MySQL, PostgreSQL, MongoDB)
- **Prototype**: Configuration templates for different environments

---

## 🎓 **Pattern Selection Guide**

### **Use Builder When:**
- ✅ Object has many optional parameters (>4-5)
- ✅ Object creation requires validation
- ✅ You want immutable objects
- ✅ Construction process is complex

### **Use Factory When:**
- ✅ Object creation logic is complex
- ✅ You need to support multiple implementations
- ✅ Creation depends on runtime conditions
- ✅ You want to centralize object creation

### **Use Prototype When:**
- ✅ Object creation is expensive (network calls, file I/O)
- ✅ You need copies of existing objects
- ✅ Objects have complex initialization
- ✅ You want to avoid subclassing

### **Avoid When:**
- ❌ Simple object creation (use constructors)
- ❌ Only one implementation exists (YAGNI principle)
- ❌ Performance is not a concern (for Prototype)
- ❌ Objects are naturally immutable and simple

---

## 💻 **Hands-On Exercises**

### **Exercise 1: E-commerce Product Builder**
Create a `Product` builder that handles:
- Required fields: name, price, category
- Optional fields: description, images, variants, reviews
- Validation: price > 0, name not empty
- Immutable result object

### **Exercise 2: Notification Factory**
Implement a notification system that:
- Supports Email, SMS, Push, Slack notifications
- Uses Factory Method pattern
- Each notification type has different required fields
- Includes retry logic and error handling

### **Exercise 3: Game Character Prototype**
Design a character system that:
- Supports different character classes (Warrior, Mage, Archer)
- Uses Prototype for character templates
- Allows customization after cloning
- Includes deep copying for complex attributes

---

## 🧪 **Testing Strategies**

### **Builder Pattern Testing:**
```java
@Test
void builderShouldCreateValidObject() {
    User user = User.builder()
        .name("John Doe")
        .email("john@example.com")
        .age(30)
        .build();
    
    assertThat(user.getName()).isEqualTo("John Doe");
    assertThat(user.getEmail()).isEqualTo("john@example.com");
}

@Test
void builderShouldValidateRequiredFields() {
    assertThatThrownBy(() -> 
        User.builder().build()
    ).isInstanceOf(IllegalStateException.class);
}
```

### **Factory Pattern Testing:**
```java
@Test
void factoryShouldCreateCorrectImplementation() {
    PaymentProcessor processor = PaymentProcessorFactory
        .create(PaymentMethod.CREDIT_CARD);
    
    assertThat(processor).isInstanceOf(CreditCardProcessor.class);
}

@Test
void factoryShouldHandleUnknownTypes() {
    assertThatThrownBy(() -> 
        PaymentProcessorFactory.create(null)
    ).isInstanceOf(IllegalArgumentException.class);
}
```

### **Prototype Pattern Testing:**
```java
@Test
void prototypeShouldCreateIndependentCopies() {
    GameCharacter original = new Warrior("Conan", 100, 50);
    GameCharacter copy = original.clone();
    
    copy.setName("Barbarian");
    
    assertThat(original.getName()).isEqualTo("Conan");
    assertThat(copy.getName()).isEqualTo("Barbarian");
}
```

---

## 📊 **Performance Considerations**

### **Builder Pattern:**
- **Memory**: Slightly higher due to builder object
- **CPU**: Minimal overhead for method chaining
- **Best Practice**: Reuse builders when possible

### **Factory Pattern:**
- **Memory**: Factory instances can be singletons
- **CPU**: Minimal overhead for delegation
- **Best Practice**: Cache expensive factory operations

### **Prototype Pattern:**
- **Memory**: Depends on cloning implementation (shallow vs deep)
- **CPU**: Cloning can be expensive for complex objects
- **Best Practice**: Implement efficient cloning, consider object pools

---

## 🚀 **Next Steps**

After mastering Day 6:
1. **Practice**: Implement the exercises above
2. **Refactor**: Apply patterns to existing code
3. **Review**: Understand when NOT to use patterns
4. **Advance**: Move to [Day 7: Structural Patterns](week2/day7/README.md)

---

## 📖 **Additional Resources**

- **Code Examples**: [View All Code](/week2/day6/CODE)
- **Tests**: [View All Code](/week2/day6/CODE#tests)
- **Diagrams**: View in `docs/week2/day6/diagrams/`
- **Refactoring**: View in `docs/week2/day6/refactoring/`

**Ready to build better objects?** Let's start coding! 🏗️

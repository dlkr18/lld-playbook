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
- [User.java](/week2/day6/CODE#userjava) - Complex user creation
- [SqlQueryBuilder.java](/week2/day6/CODE#sqlquerybuilderjava) - Dynamic query construction
- [HttpRequestBuilder.java](/week2/day6/CODE#httprequestbuilderjava) - API request building

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
- [PaymentProcessorFactory.java](/week2/day6/CODE#paymentprocessorfactoryjava) - Multiple payment methods
- [DatabaseConnectionFactory.java](/week2/day6/CODE#databaseconnectionfactoryjava) - Different database types
- [NotificationFactory.java](/week2/day6/CODE#notificationfactoryjava) - Email, SMS, Push notifications

### **3. Prototype Pattern** 🧬
**Problem**: Creating objects is expensive or complex, need copies of existing objects
**Solution**: Clone existing objects instead of creating from scratch

**Key Benefits:**
- Avoids expensive object creation
- Supports dynamic configuration
- Enables object copying with modifications
- Useful for caching and object pools

**Code Examples:**
- [GameCharacter.java](/week2/day6/CODE#gamecharacterjava) - RPG character creation
- [DocumentTemplate.java](/week2/day6/CODE#documenttemplatejava) - Document generation
- [Configuration.java](/week2/day6/CODE#configurationjava) - Environment-specific configs

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

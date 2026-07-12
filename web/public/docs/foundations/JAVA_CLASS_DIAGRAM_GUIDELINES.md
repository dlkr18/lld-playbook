# Java Class Diagram Guidelines

## 📋 **Table of Contents**
1. [Core Principles](#core-principles)
2. [Java-Specific Conventions](#java-specific-conventions)
3. [Visibility and Access Modifiers](#visibility-and-access-modifiers)
4. [Method and Field Representation](#method-and-field-representation)
5. [Relationship Types](#relationship-types)
6. [Java Design Patterns in UML](#java-design-patterns-in-uml)
7. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
8. [Professional Examples](#professional-examples)

---

## 🎯 **Core Principles**

### **1. Focus on Design Intent**
```java
// ❌ Don't show every getter/setter
public class User {
    private String name;
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

// ✅ Show meaningful operations only
public class User {
    - name: String
    + authenticate(password: String): boolean
    + updateProfile(profile: UserProfile): void
}
```

### **2. Show Abstractions, Not Implementation**
- **Show WHAT** the class does, not HOW
- Focus on **public contracts** and **key relationships**
- Hide **internal implementation details**

---

## ☕ **Java-Specific Conventions**

### **Class Stereotypes**
```
<<interface>>     - Java interfaces
<<abstract>>      - Abstract classes
<<enumeration>>   - Java enums
<<entity>>        - JPA entities
<<service>>       - Service classes
<<repository>>    - Data access objects
<<controller>>    - Web controllers
```

### **Package Representation**
```
com.company.domain::User
com.company.service::UserService
com.company.repository::UserRepository
```

### **Generic Types**
```java
// Java Code
List<User> users;
Map<String, Order> orderMap;

// UML Representation
- users: List<User>
- orderMap: Map<String, Order>
```

---

## 🔐 **Visibility and Access Modifiers**

### **UML Visibility Symbols**
| Java Modifier | UML Symbol | Meaning |
|---------------|------------|---------|
| `public` | `+` | Accessible everywhere |
| `protected` | `#` | Accessible in package + subclasses |
| `package-private` | `~` | Accessible in same package |
| `private` | `-` | Accessible only within class |

### **Static and Final Modifiers**
```java
// Java Code
public static final String DEFAULT_STATUS = "ACTIVE";
public static int getUserCount() { ... }

// UML Representation
+ DEFAULT_STATUS: String {static, final}
+ getUserCount(): int {static}
```

---

## 📝 **Method and Field Representation**

### **Field Syntax**
```
visibility name: type [multiplicity] = defaultValue {properties}

Examples:
- userId: Long
- name: String = "Unknown"
- addresses: List<Address> [0..*]
- status: UserStatus {final}
```

### **Method Syntax**
```
visibility name(parameter: type): returnType {properties}

Examples:
+ calculateTotal(): Money
+ findByEmail(email: String): Optional<User>
+ process(order: Order): void {abstract}
```

### **Constructor Representation**
```java
// Java Code
public User(String name, String email) { ... }

// UML Representation
+ User(name: String, email: String)
```

---

## 🔗 **Relationship Types**

### **1. Association (Uses)**
```java
public class Order {
    private Customer customer;  // Order uses Customer
}
```
**UML:** `Order -----> Customer`

### **2. Aggregation (Has-A, Weak)**
```java
public class Department {
    private List<Employee> employees;  // Department has Employees
    // Employees can exist without Department
}
```
**UML:** `Department ◇-----> Employee`

### **3. Composition (Part-Of, Strong)**
```java
public class Order {
    private List<OrderLineItem> lineItems;  // OrderLineItems are part of Order
    // LineItems cannot exist without Order
}
```
**UML:** `Order ◆-----> OrderLineItem`

### **4. Inheritance (Is-A)**
```java
public class PremiumUser extends User {
    // PremiumUser is a User
}
```
**UML:** `PremiumUser ----▷ User`

### **5. Interface Implementation**
```java
public class UserService implements Serializable {
    // UserService implements Serializable
}
```
**UML:** `UserService ----▷ <<interface>> Serializable` (dashed line)

### **6. Dependency (Uses Temporarily)**
```java
public class OrderService {
    public void processOrder(Order order) {
        PaymentProcessor processor = new PaymentProcessor();  // Temporary use
        processor.process(order.getPayment());
    }
}
```
**UML:** `OrderService -----> PaymentProcessor` (dashed line)

---

## 🏗️ **Java Design Patterns in UML**

### **Singleton Pattern**
```java
public class DatabaseConnection {
    private static DatabaseConnection instance;
    private DatabaseConnection() {}
    public static DatabaseConnection getInstance() { return instance; }
}
```

**UML Representation:**
```
DatabaseConnection
- instance: DatabaseConnection {static}
- DatabaseConnection()
+ getInstance(): DatabaseConnection {static}
```

### **Factory Pattern**
```java
public abstract class UserFactory {
    public abstract User createUser(UserType type);
}

public class ConcreteUserFactory extends UserFactory {
    public User createUser(UserType type) { ... }
}
```

**UML Representation:**
```
<<abstract>>
UserFactory
+ createUser(type: UserType): User {abstract}
        ▲
        |
ConcreteUserFactory
+ createUser(type: UserType): User
```

### **Strategy Pattern**
```java
public interface PaymentStrategy {
    void pay(double amount);
}

public class CreditCardPayment implements PaymentStrategy { ... }
public class PayPalPayment implements PaymentStrategy { ... }

public class PaymentContext {
    private PaymentStrategy strategy;
    public void setPaymentStrategy(PaymentStrategy strategy) { ... }
}
```

**UML Representation:**
```
PaymentContext -----> <<interface>> PaymentStrategy
                              ▲
                              |
                    ┌─────────┴─────────┐
          CreditCardPayment    PayPalPayment
```

---

## ❌ **Common Mistakes to Avoid**

### **1. Too Much Detail**
```java
❌ DON'T SHOW:
+ getName(): String
+ setName(String name): void
+ getEmail(): String  
+ setEmail(String email): void
+ getId(): Long
+ setId(Long id): void

✅ DO SHOW:
+ authenticate(credentials: LoginCredentials): boolean
+ updateProfile(profile: UserProfile): void
+ deactivateAccount(): void
```

### **2. Wrong Relationship Types**
```java
❌ WRONG:
Order -----> String  // Don't show relationships to primitives

✅ CORRECT:
Order -----> Customer  // Show relationships to domain objects
```

### **3. Implementation Classes**
```java
❌ DON'T SHOW:
- users: ArrayList<User>

✅ DO SHOW:
- users: List<User>  // Show interface, not implementation
```

### **4. Utility Methods**
```java
❌ DON'T SHOW:
+ toString(): String
+ equals(Object obj): boolean
+ hashCode(): int

✅ SHOW ONLY IF BUSINESS-RELEVANT:
+ equals(other: User): boolean  // If User equality is domain-specific
```

---

## 💼 **Professional Examples**

### **E-commerce Domain Model**
```
┌─────────────────────┐    ┌─────────────────────┐
│     <<entity>>      │    │     <<entity>>      │
│       Customer      │    │        Order        │
├─────────────────────┤    ├─────────────────────┤
│ - customerId: Long  │    │ - orderId: Long     │
│ - email: String     │◇──→│ - orderDate: Date   │
│ - status: Status    │    │ - status: Status    │
├─────────────────────┤    ├─────────────────────┤
│ + placeOrder(): Order│   │ + calculateTotal(): │
│ + updateProfile()   │    │   Money             │
│ + deactivate()      │    │ + addLineItem()     │
└─────────────────────┘    │ + cancel()          │
                           └─────────────────────┘
                                      │
                                      │ composition
                                      ▼
                           ┌─────────────────────┐
                           │   OrderLineItem     │
                           ├─────────────────────┤
                           │ - quantity: int     │
                           │ - unitPrice: Money  │
                           ├─────────────────────┤
                           │ + getSubtotal():    │
                           │   Money             │
                           └─────────────────────┘
```

### **Service Layer Architecture**
```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   <<controller>>    │    │    <<service>>      │    │   <<repository>>    │
│   UserController    │    │    UserService      │    │   UserRepository    │
├─────────────────────┤    ├─────────────────────┤    ├─────────────────────┤
│ + createUser()      │───→│ + registerUser()    │───→│ + save(User): User  │
│ + getUserById()     │    │ + findByEmail()     │    │ + findById(): User  │
│ + updateUser()      │    │ + validateUser()    │    │ + delete(Long): void│
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

---

## 📚 **Best Practices Summary**

### **DO:**
- ✅ Show **public interfaces** and **key relationships**
- ✅ Use **meaningful names** that reflect domain concepts
- ✅ Include **business methods**, exclude **technical plumbing**
- ✅ Show **design patterns** and **architectural layers**
- ✅ Use **stereotypes** to clarify class roles
- ✅ Group **related classes** together
- ✅ Show **multiplicity** on associations when important

### **DON'T:**
- ❌ Show **getters/setters** unless business-critical
- ❌ Include **utility methods** (toString, equals, hashCode)
- ❌ Show **implementation details** (ArrayList vs List)
- ❌ Overcrowd with **too many classes** in one diagram
- ❌ Show **primitive relationships** (String, int, etc.)
- ❌ Mix **different abstraction levels**

---

## 🎯 **Interview Tips**

### **When Drawing Class Diagrams:**
1. **Start with core entities** - the main business objects
2. **Add key relationships** - how objects interact
3. **Show important methods** - the operations that matter
4. **Use stereotypes** - clarify architectural roles
5. **Explain your choices** - why you included/excluded elements

### **Sample Interview Question:**
*"Design a class diagram for a library management system."*

**Good Answer Structure:**
```
1. Identify core entities: User, Book, Loan, Author
2. Show key relationships: User borrows Book through Loan
3. Add important methods: borrowBook(), returnBook(), calculateFine()
4. Use stereotypes: <<entity>>, <<service>>, <<repository>>
5. Explain design decisions: Why Loan is separate entity, etc.
```

This systematic approach demonstrates **professional software design thinking**! 🚀

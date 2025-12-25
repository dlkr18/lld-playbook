# Day 19: Review & Refactor 🔄

**Focus**: Apply patterns judiciously, recognize code smells, and refactor effectively.

---

## 🎯 **Learning Objectives**

By the end of Day 19, you will:
- **Recognize** common code smells
- **Apply** refactoring techniques
- **Decide** when to use (and not use) patterns
- **Balance** design principles with pragmatism

---

## 🚨 **Code Smells Catalog**

### **1. Bloaters**

| Smell | Symptom | Refactoring |
|-------|---------|-------------|
| **Long Method** | Methods > 20 lines | Extract Method |
| **Large Class** | Class does too much | Extract Class, Facade |
| **Primitive Obsession** | Using primitives for domain concepts | Replace with Value Objects |
| **Long Parameter List** | Methods with 5+ parameters | Introduce Parameter Object |
| **Data Clumps** | Same data groups appear together | Extract Class |

### **2. Object-Orientation Abusers**

| Smell | Symptom | Refactoring |
|-------|---------|-------------|
| **Switch Statements** | Type-based switching | Replace with Polymorphism |
| **Parallel Inheritance** | Two hierarchies that mirror each other | Merge hierarchies |
| **Lazy Class** | Class that does too little | Inline Class |
| **Speculative Generality** | Unused abstractions | Remove unused code |

### **3. Change Preventers**

| Smell | Symptom | Refactoring |
|-------|---------|-------------|
| **Divergent Change** | One class changes for multiple reasons | Extract Class (SRP) |
| **Shotgun Surgery** | One change requires modifying many classes | Move Method/Field |
| **Parallel Inheritance** | Adding to one hierarchy requires adding to another | Collapse Hierarchy |

### **4. Dispensables**

| Smell | Symptom | Refactoring |
|-------|---------|-------------|
| **Comments** | Comments explaining complex code | Extract Method, Rename |
| **Duplicate Code** | Same code in multiple places | Extract Method/Class |
| **Dead Code** | Unreachable or unused code | Delete |
| **Lazy Class** | Class with minimal functionality | Inline Class |

### **5. Couplers**

| Smell | Symptom | Refactoring |
|-------|---------|-------------|
| **Feature Envy** | Method uses another class more than its own | Move Method |
| **Inappropriate Intimacy** | Classes know too much about each other | Move Method/Field |
| **Message Chains** | `a.getB().getC().getD()` | Hide Delegate |
| **Middle Man** | Class that only delegates | Remove Middle Man |

---

## 🔧 **Refactoring Techniques**

### **Extract Method**
```java
// Before
public void printOwing() {
    printBanner();
    
    // print details
    System.out.println("name: " + name);
    System.out.println("amount: " + getOutstanding());
}

// After
public void printOwing() {
    printBanner();
    printDetails();
}

private void printDetails() {
    System.out.println("name: " + name);
    System.out.println("amount: " + getOutstanding());
}
```

### **Replace Conditional with Polymorphism**
```java
// Before
public double getSpeed() {
    switch (type) {
        case EUROPEAN: return getBaseSpeed();
        case AFRICAN: return getBaseSpeed() - getLoadFactor() * weight;
        case NORWEGIAN_BLUE: return (isNailed) ? 0 : getBaseSpeed(voltage);
        default: throw new RuntimeException("Unknown type");
    }
}

// After
abstract class Bird {
    abstract double getSpeed();
}

class EuropeanBird extends Bird {
    double getSpeed() { return getBaseSpeed(); }
}

class AfricanBird extends Bird {
    double getSpeed() { return getBaseSpeed() - getLoadFactor() * weight; }
}
```

### **Introduce Parameter Object**
```java
// Before
public List<Transaction> findTransactions(
    Date startDate, Date endDate, 
    BigDecimal minAmount, BigDecimal maxAmount,
    String status, String type) {
    // ...
}

// After
public class TransactionFilter {
    private Date startDate;
    private Date endDate;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;
    private String status;
    private String type;
    // Builder pattern...
}

public List<Transaction> findTransactions(TransactionFilter filter) {
    // ...
}
```

---

## ⚖️ **When to Use Patterns**

### **Use Patterns When:**
- ✅ The problem matches the pattern's intent
- ✅ You've seen the need multiple times
- ✅ The code will be read by others
- ✅ The complexity is justified by flexibility needs

### **Don't Use Patterns When:**
- ❌ You're pattern-matching to a problem
- ❌ It's the only place this logic exists
- ❌ Simpler code would work fine
- ❌ You're over-engineering for hypothetical needs

### **Pattern Decision Matrix**

| Situation | Consider |
|-----------|----------|
| Multiple algorithms | Strategy |
| Object creation complexity | Builder/Factory |
| Adding behavior without subclassing | Decorator |
| State-dependent behavior | State |
| Need to undo operations | Command |
| Notify multiple objects | Observer |
| Single instance required | Singleton (carefully!) |

---

## 📊 **Design Principle Trade-offs**

### **SOLID Trade-offs**

| Principle | Benefit | Cost |
|-----------|---------|------|
| **SRP** | Focused classes | More classes to manage |
| **OCP** | Easy extension | More interfaces/abstractions |
| **LSP** | Reliable substitution | Stricter contracts |
| **ISP** | Smaller interfaces | More interfaces |
| **DIP** | Loose coupling | More abstractions |

### **When to Break the Rules**

```java
// Sometimes a simple switch is fine
// Don't create 5 classes for 5 cases that never change

public Money calculateTax(TaxType type, Money amount) {
    switch (type) {
        case STANDARD: return amount.multiply(0.20);
        case REDUCED: return amount.multiply(0.05);
        case ZERO: return Money.ZERO;
        default: throw new IllegalArgumentException();
    }
}

// But if tax rules vary by country, region, product...
// Then Strategy pattern makes sense
```

---

## 🎯 **Refactoring Checklist**

### **Before Refactoring:**
- [ ] Have comprehensive tests
- [ ] Understand the existing code
- [ ] Identify specific improvements
- [ ] Plan small, incremental changes

### **During Refactoring:**
- [ ] Make one change at a time
- [ ] Run tests after each change
- [ ] Commit frequently
- [ ] Keep changes reviewable

### **After Refactoring:**
- [ ] All tests pass
- [ ] Code is cleaner/simpler
- [ ] No new functionality added
- [ ] Documentation updated if needed

---

## 💡 **Pragmatic Guidelines**

### **The Rule of Three**
- First time: Just do it
- Second time: Duplicate if needed
- Third time: Refactor and abstract

### **YAGNI (You Aren't Gonna Need It)**
- Don't build for hypothetical requirements
- Simple today, refactor when needed
- Avoid speculative generality

### **DRY vs. Coupling**
- Don't repeat yourself, BUT
- Don't create coupling for minor duplication
- Duplication in different contexts may be coincidental

### **Readability over Cleverness**
```java
// Clever but hard to read
return items.stream()
    .collect(groupingBy(Item::getCategory, 
        collectingAndThen(reducing((a, b) -> 
            a.getValue() > b.getValue() ? a : b), Optional::get)));

// Clear and maintainable
Map<Category, Item> maxByCategory = new HashMap<>();
for (Item item : items) {
    maxByCategory.merge(item.getCategory(), item, 
        (a, b) -> a.getValue() > b.getValue() ? a : b);
}
return maxByCategory;
```

---

## 🏋️ **Review Exercises**

1. **Identify smells** in your previous implementations
2. **Refactor** one class from this curriculum
3. **Remove** an unnecessary abstraction
4. **Add** a pattern where it's clearly needed
5. **Document** your design decisions

---

**Next**: [Day 20 - Mock Interviews](week4/day20/README.md) →

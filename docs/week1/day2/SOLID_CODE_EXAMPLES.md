# SOLID Principles - Code Examples

Complete Java implementations demonstrating each SOLID principle with **Before** and **After** code examples.

---

## 1. Single Responsibility Principle (SRP)

> **"A class should have one, and only one, reason to change."**

### ❌ **Before: Violating SRP**

This class has **4 different responsibilities**, making it hard to maintain and test:

```java
package com.you.lld.examples.day2.solid.srp;

/**
 * BAD EXAMPLE: Violates Single Responsibility Principle
 * 
 * This class has multiple responsibilities:
 * 1. User data management
 * 2. Email sending
 * 3. Password management
 * 4. Reporting
 * 
 * Problems:
 * - Changes to email logic affect user management
 * - Database changes affect reporting
 * - Hard to test individual features
 * - Violates single responsibility
 */
public class UserManagerBad {
    
    // Responsibility 1: User data management
    public void createUser(String name, String email) {
        // validate user data
        // save to database
    }
    
    // Responsibility 2: Email sending
    public void sendWelcomeEmail(User user) {
        // compose email
        // send via SMTP
    }
    
    // Responsibility 3: Password management
    public void resetPassword(User user) {
        // generate new password
        // update database
        // send email
    }
    
    // Responsibility 4: Reporting
    public void generateUserReport() {
        // query database
        // format report
        // save to file
    }
}
```

**Problems:**
- ✗ 4 reasons to change this class
- ✗ Hard to test email functionality separately
- ✗ Changes to reporting affect user management
- ✗ Violates separation of concerns

---

### ✅ **After: Following SRP**

Split into focused classes, each with a **single responsibility**:

#### **UserService.java** - User Business Logic Only

```java
package com.you.lld.examples.day2.solid.srp;

/**
 * GOOD EXAMPLE: Follows Single Responsibility Principle
 * 
 * This class has a single responsibility: User business logic
 * 
 * Benefits:
 * - Each class has one reason to change
 * - Easy to test and maintain
 * - Changes are isolated
 * - Clear responsibilities
 */
public class UserService {
    private UserRepository userRepository;
    private EmailService emailService;
    
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public void createUser(String name, String email) {
        User user = new User(name, email);
        userRepository.save(user);
        emailService.sendWelcomeEmail(user);  // Delegate to email service
    }
}
```

#### **EmailService.java** - Email Operations Only

```java
package com.you.lld.examples.day2.solid.srp;

/**
 * GOOD EXAMPLE: Single Responsibility - Email Operations
 * 
 * This class is only responsible for sending emails
 */
public class EmailService {
    
    public void sendWelcomeEmail(User user) {
        // Only responsible for sending emails
        String subject = "Welcome!";
        String body = "Hello " + user.getName() + ", welcome to our platform!";
        sendEmail(user.getEmail(), subject, body);
    }
    
    private void sendEmail(String to, String subject, String body) {
        // Email sending implementation
    }
}
```

#### **UserRepository.java** - Data Persistence Only

```java
package com.you.lld.examples.day2.solid.srp;

/**
 * GOOD EXAMPLE: Single Responsibility - Data Access
 * 
 * This class is only responsible for user data persistence
 */
public interface UserRepository {
    void save(User user);
    User findById(String id);
    void delete(String id);
}
```

#### **PasswordService.java** - Password Management Only

```java
package com.you.lld.examples.day2.solid.srp;

/**
 * GOOD EXAMPLE: Single Responsibility - Password Operations
 */
public class PasswordService {
    
    public void resetPassword(User user) {
        String newPassword = generateRandomPassword();
        user.setPassword(hashPassword(newPassword));
        // Only handles password logic
    }
    
    private String generateRandomPassword() {
        // Password generation logic
        return "newPassword123";
    }
    
    private String hashPassword(String password) {
        // Hashing logic
        return password;
    }
}
```

#### **ReportService.java** - Reporting Only

```java
package com.you.lld.examples.day2.solid.srp;

/**
 * GOOD EXAMPLE: Single Responsibility - Report Generation
 */
public class ReportService {
    
    public void generateUserReport(List<User> users) {
        // Only responsible for report generation
        StringBuilder report = new StringBuilder();
        for (User user : users) {
            report.append(user.getName()).append("\n");
        }
        saveReport(report.toString());
    }
    
    private void saveReport(String content) {
        // Save to file
    }
}
```

**Benefits:**
- ✓ Each class has **one reason to change**
- ✓ Easy to **test** individual components
- ✓ **Clear responsibilities** - no confusion
- ✓ **Changes are isolated** - modifying email doesn't affect users

---

## 📊 **Comparison: SRP**

| Aspect | Before (Violation) | After (Following SRP) |
|--------|-------------------|----------------------|
| **Responsibilities** | 4 in one class | 1 per class |
| **Testability** | Hard (must test everything together) | Easy (test each in isolation) |
| **Maintainability** | Poor (changes affect multiple areas) | Excellent (changes localized) |
| **Reasons to Change** | 4 reasons | 1 reason per class |
| **Clarity** | Confusing | Crystal clear |

---

## 🎯 **Key Takeaways**

### **How to Apply SRP:**

1. **Identify Responsibilities**
   - What does this class do?
   - How many different reasons could it change?

2. **Extract Classes**
   - Each responsibility → Separate class
   - Name classes by their responsibility

3. **Use Composition**
   - Inject dependencies
   - Delegate to specialized classes

### **Red Flags (SRP Violations):**

- ⚠️ Class does "AND" operations (User management AND email AND reporting)
- ⚠️ Multiple unrelated methods
- ⚠️ Class name with "AND" or "Manager" suffix
- ⚠️ Hard to name the class clearly
- ⚠️ Changes in one area break another

### **Benefits of SRP:**

- ✅ **Easier Testing** - Mock one thing at a time
- ✅ **Better Organization** - Know where to find code
- ✅ **Less Coupling** - Changes don't ripple
- ✅ **Clearer Naming** - Classes do what their names say
- ✅ **Easier Reuse** - Small, focused classes

---

## 📚 **Related Resources**

- [Complete SOLID Guide](week1/day2/DAY2_SOLID_PRINCIPLES.md) - All 5 principles
- [God Class Refactoring](week1/day2/GOD_CLASS_REFACTORING.md) - Large refactoring example
- [GRASP Principles](week1/day2/DAY2_GRASP_PRINCIPLES.md) - Related design principles

---

## 🔄 **Practice Exercise**

**Identify SRP violations in this class:**

```java
public class OrderProcessor {
    public void processOrder(Order order) {
        // Validate order
        // Calculate taxes
        // Process payment
        // Update inventory
        // Send confirmation email
        // Generate invoice PDF
        // Update analytics
    }
}
```

**How many classes should this become?** (Answer: At least 6-7!)

---

**Remember**: If you can describe a class responsibility with "AND", it probably violates SRP! 🎯



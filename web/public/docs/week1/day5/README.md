# Day 5: Error Modeling & API Contracts 🛡️

**Focus**: Design robust error handling, validation strategies, and clean API contracts.

---

## 🎯 **Learning Objectives**

By the end of Day 5, you will:
- **Design** domain-specific exception hierarchies
- **Implement** validation strategies (fail-fast, accumulate)
- **Create** Result types for error handling
- **Build** fluent builders with validation
- **Define** clean API contracts

---

## 🚨 **Exception Hierarchy Design**

### **Principles:**
1. **Domain-Specific Exceptions**: Don't throw generic exceptions
2. **Hierarchy**: Base exception with specialized subtypes
3. **Recoverability**: Distinguish recoverable vs fatal errors
4. **Information**: Include context for debugging

### **Exception Hierarchy Pattern:**

```java
// Base domain exception
public abstract class DomainException extends RuntimeException {
    
    private final String errorCode;
    private final Map<String, Object> context;
    
    protected DomainException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.context = new HashMap<>();
    }
    
    protected DomainException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.context = new HashMap<>();
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public DomainException withContext(String key, Object value) {
        this.context.put(key, value);
        return this;
    }
    
    public Map<String, Object> getContext() {
        return new HashMap<>(context);
    }
}

// Validation exceptions (client errors)
public class ValidationException extends DomainException {
    
    private final List<ValidationError> errors;
    
    public ValidationException(List<ValidationError> errors) {
        super("VALIDATION_ERROR", "Validation failed: " + errors.size() + " errors");
        this.errors = new ArrayList<>(errors);
    }
    
    public ValidationException(String field, String message) {
        this(Collections.singletonList(new ValidationError(field, message)));
    }
    
    public List<ValidationError> getErrors() {
        return new ArrayList<>(errors);
    }
}

// Business rule violations
public class BusinessRuleException extends DomainException {
    
    public BusinessRuleException(String errorCode, String message) {
        super(errorCode, message);
    }
}

// Resource not found
public class NotFoundException extends DomainException {
    
    public NotFoundException(String resourceType, String resourceId) {
        super("NOT_FOUND", resourceType + " not found: " + resourceId);
        withContext("resourceType", resourceType);
        withContext("resourceId", resourceId);
    }
}

// Conflict (duplicate, concurrent modification)
public class ConflictException extends DomainException {
    
    public ConflictException(String message) {
        super("CONFLICT", message);
    }
}

// Infrastructure errors
public class InfrastructureException extends DomainException {
    
    public InfrastructureException(String message, Throwable cause) {
        super("INFRASTRUCTURE_ERROR", message, cause);
    }
}
```

---

## ✅ **Validation Strategies**

### **1. Fail-Fast Validation**
Stop at first error - good for quick feedback.

```java
public class FailFastValidator<T> {
    
    public void validate(T object, List<ValidationRule<T>> rules) {
        for (ValidationRule<T> rule : rules) {
            if (!rule.isValid(object)) {
                throw new ValidationException(rule.getField(), rule.getMessage());
            }
        }
    }
}

// Usage
validator.validate(user, Arrays.asList(
    new NotEmptyRule("name", user.getName()),
    new EmailRule("email", user.getEmail()),
    new MinLengthRule("password", user.getPassword(), 8)
));
```

### **2. Accumulating Validation**
Collect all errors - good for form validation.

```java
public class AccumulatingValidator<T> {
    
    public ValidationResult validate(T object, List<ValidationRule<T>> rules) {
        List<ValidationError> errors = new ArrayList<>();
        
        for (ValidationRule<T> rule : rules) {
            if (!rule.isValid(object)) {
                errors.add(new ValidationError(rule.getField(), rule.getMessage()));
            }
        }
        
        return new ValidationResult(errors);
    }
}

public class ValidationResult {
    private final List<ValidationError> errors;
    
    public ValidationResult(List<ValidationError> errors) {
        this.errors = new ArrayList<>(errors);
    }
    
    public boolean isValid() {
        return errors.isEmpty();
    }
    
    public List<ValidationError> getErrors() {
        return new ArrayList<>(errors);
    }
    
    public void throwIfInvalid() {
        if (!isValid()) {
            throw new ValidationException(errors);
        }
    }
}
```

### **3. Fluent Validation**

```java
public class Validator<T> {
    
    private final T object;
    private final List<ValidationError> errors = new ArrayList<>();
    
    private Validator(T object) {
        this.object = object;
    }
    
    public static <T> Validator<T> of(T object) {
        return new Validator<>(object);
    }
    
    public Validator<T> notNull(String field, Object value) {
        if (value == null) {
            errors.add(new ValidationError(field, "must not be null"));
        }
        return this;
    }
    
    public Validator<T> notEmpty(String field, String value) {
        if (value == null || value.trim().isEmpty()) {
            errors.add(new ValidationError(field, "must not be empty"));
        }
        return this;
    }
    
    public Validator<T> minLength(String field, String value, int min) {
        if (value != null && value.length() < min) {
            errors.add(new ValidationError(field, "must be at least " + min + " characters"));
        }
        return this;
    }
    
    public Validator<T> positive(String field, Number value) {
        if (value != null && value.doubleValue() <= 0) {
            errors.add(new ValidationError(field, "must be positive"));
        }
        return this;
    }
    
    public Validator<T> matches(String field, String value, Pattern pattern) {
        if (value != null && !pattern.matcher(value).matches()) {
            errors.add(new ValidationError(field, "invalid format"));
        }
        return this;
    }
    
    public Validator<T> satisfies(String field, boolean condition, String message) {
        if (!condition) {
            errors.add(new ValidationError(field, message));
        }
        return this;
    }
    
    public ValidationResult validate() {
        return new ValidationResult(errors);
    }
    
    public T getOrThrow() {
        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }
        return object;
    }
}

// Usage
User user = Validator.of(createUserRequest)
    .notEmpty("name", request.getName())
    .notEmpty("email", request.getEmail())
    .matches("email", request.getEmail(), EMAIL_PATTERN)
    .minLength("password", request.getPassword(), 8)
    .positive("age", request.getAge())
    .satisfies("age", request.getAge() >= 18, "must be at least 18")
    .getOrThrow();
```

---

## 🔄 **Result Type Pattern**

Alternative to exceptions for expected failures.

```java
public class Result<T, E> {
    
    private final T value;
    private final E error;
    private final boolean success;
    
    private Result(T value, E error, boolean success) {
        this.value = value;
        this.error = error;
        this.success = success;
    }
    
    public static <T, E> Result<T, E> success(T value) {
        return new Result<>(value, null, true);
    }
    
    public static <T, E> Result<T, E> failure(E error) {
        return new Result<>(null, error, false);
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public boolean isFailure() {
        return !success;
    }
    
    public T getValue() {
        if (!success) {
            throw new IllegalStateException("Cannot get value from failed result");
        }
        return value;
    }
    
    public E getError() {
        if (success) {
            throw new IllegalStateException("Cannot get error from successful result");
        }
        return error;
    }
    
    public T getOrElse(T defaultValue) {
        return success ? value : defaultValue;
    }
    
    public T getOrThrow() {
        if (!success) {
            if (error instanceof Exception) {
                throw new RuntimeException((Exception) error);
            }
            throw new RuntimeException("Operation failed: " + error);
        }
        return value;
    }
    
    public <U> Result<U, E> map(Function<T, U> mapper) {
        if (success) {
            return Result.success(mapper.apply(value));
        }
        return Result.failure(error);
    }
    
    public <U> Result<U, E> flatMap(Function<T, Result<U, E>> mapper) {
        if (success) {
            return mapper.apply(value);
        }
        return Result.failure(error);
    }
}

// Usage
Result<User, String> result = userService.createUser(request);

if (result.isSuccess()) {
    User user = result.getValue();
    // Handle success
} else {
    String error = result.getError();
    // Handle failure
}

// Or with chaining
String username = userService.findById(userId)
    .map(User::getName)
    .getOrElse("Unknown");
```

---

## 🏗️ **Builder Pattern with Validation**

```java
public class Order {
    
    private final OrderId id;
    private final UserId customerId;
    private final List<OrderItem> items;
    private final Money total;
    private final OrderStatus status;
    private final Instant createdAt;
    
    private Order(Builder builder) {
        this.id = builder.id;
        this.customerId = builder.customerId;
        this.items = new ArrayList<>(builder.items);
        this.total = builder.total;
        this.status = builder.status;
        this.createdAt = builder.createdAt;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private OrderId id;
        private UserId customerId;
        private List<OrderItem> items = new ArrayList<>();
        private Money total;
        private OrderStatus status = OrderStatus.PENDING;
        private Instant createdAt = Instant.now();
        
        public Builder id(OrderId id) {
            this.id = id;
            return this;
        }
        
        public Builder customerId(UserId customerId) {
            this.customerId = customerId;
            return this;
        }
        
        public Builder addItem(OrderItem item) {
            this.items.add(item);
            return this;
        }
        
        public Builder items(List<OrderItem> items) {
            this.items = new ArrayList<>(items);
            return this;
        }
        
        public Builder total(Money total) {
            this.total = total;
            return this;
        }
        
        public Builder status(OrderStatus status) {
            this.status = status;
            return this;
        }
        
        public Builder createdAt(Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        public Order build() {
            validate();
            
            // Auto-calculate total if not provided
            if (total == null) {
                total = calculateTotal();
            }
            
            // Generate ID if not provided
            if (id == null) {
                id = OrderId.generate();
            }
            
            return new Order(this);
        }
        
        private void validate() {
            Validator.of(this)
                .notNull("customerId", customerId)
                .satisfies("items", !items.isEmpty(), "must have at least one item")
                .satisfies("items", items.stream().allMatch(i -> i.getQuantity() > 0), 
                          "all items must have positive quantity")
                .getOrThrow();
        }
        
        private Money calculateTotal() {
            return items.stream()
                .map(item -> item.getPrice().multiply(item.getQuantity()))
                .reduce(Money.ZERO, Money::add);
        }
    }
    
    // Getters...
}
```

---

## 📋 **API Contract Design**

### **Command-Query Separation:**

```java
public interface OrderService {
    
    // Commands (mutate state, return void or minimal info)
    OrderId createOrder(CreateOrderCommand command);
    void cancelOrder(OrderId orderId);
    void addItem(OrderId orderId, AddItemCommand command);
    
    // Queries (read state, return data)
    Order findById(OrderId orderId);
    List<Order> findByCustomer(UserId customerId);
    OrderSummary getOrderSummary(OrderId orderId);
}

// Command objects with validation
public class CreateOrderCommand {
    private final UserId customerId;
    private final List<OrderItemRequest> items;
    private final ShippingAddress shippingAddress;
    
    public CreateOrderCommand(UserId customerId, List<OrderItemRequest> items, 
                             ShippingAddress shippingAddress) {
        Validator.of(this)
            .notNull("customerId", customerId)
            .notNull("items", items)
            .satisfies("items", !items.isEmpty(), "must have at least one item")
            .notNull("shippingAddress", shippingAddress)
            .getOrThrow();
            
        this.customerId = customerId;
        this.items = new ArrayList<>(items);
        this.shippingAddress = shippingAddress;
    }
    
    // Getters...
}
```

### **Service Contract with Clear Error Cases:**

```java
/**
 * Order management service.
 * 
 * @throws NotFoundException if order/customer not found
 * @throws ValidationException if input validation fails
 * @throws BusinessRuleException if business rules violated
 * @throws ConflictException if concurrent modification detected
 */
public interface OrderService {
    
    /**
     * Create a new order.
     * 
     * @param command Order creation details
     * @return The created order ID
     * @throws ValidationException if command is invalid
     * @throws NotFoundException if customer not found
     * @throws BusinessRuleException if customer account is suspended
     */
    OrderId createOrder(CreateOrderCommand command);
    
    /**
     * Cancel an existing order.
     * 
     * @param orderId The order to cancel
     * @throws NotFoundException if order not found
     * @throws BusinessRuleException if order cannot be cancelled (already shipped)
     */
    void cancelOrder(OrderId orderId);
}
```

---

## 🎯 **Best Practices**

### **Exception Handling:**
1. **Be specific**: Domain exceptions > generic exceptions
2. **Include context**: Error codes, affected resources
3. **Fail fast**: Validate early
4. **Document**: Specify exceptions in contracts

### **Validation:**
1. **Validate at boundaries**: API entry points
2. **Use value objects**: Self-validating types
3. **Collect errors**: User-friendly feedback
4. **Separate concerns**: Validation logic separate from business logic

### **API Contracts:**
1. **Clear responsibilities**: Command vs Query
2. **Immutable parameters**: Use value objects
3. **Explicit errors**: Document what can go wrong
4. **Consistent naming**: Follow conventions

---

## 🏋️ **Exercises**

### **Exercise 1: Payment Validation**
Create validation for a payment request:
- Card number (Luhn algorithm)
- Expiry date (not expired)
- CVV (3-4 digits)
- Amount (positive, within limits)

### **Exercise 2: User Registration**
Design error handling for user registration:
- Email already exists
- Username taken
- Password too weak
- Age requirement not met

### **Exercise 3: Order State Machine**
Create state transitions with validation:
- PENDING → CONFIRMED → SHIPPED → DELIVERED
- PENDING → CANCELLED
- Invalid transitions throw exceptions

---

**Next**: [Weekend - Parking Lot System](week1/weekend/README.md) →

# Day 5 Exercises: Error Modeling & Validation 📝

---

## 🎯 **Exercise 1: Exception Hierarchy Design**

### **Scenario**
Design an exception hierarchy for a banking application that handles:
- Account not found
- Insufficient funds
- Invalid transaction amount
- Account frozen/suspended
- Daily limit exceeded
- Duplicate transaction
- Invalid account type for operation

### **Tasks**
1. Create a base `BankingException` class with error codes
2. Design specialized exception classes
3. Include relevant context in each exception
4. Implement `toApiError()` method for API responses

### **Requirements**
```java
// Your exceptions should support:
throw new InsufficientFundsException(accountId, requestedAmount, availableBalance)
    .withContext("transactionId", txnId);

// And convert to API-friendly format:
{
    "errorCode": "INSUFFICIENT_FUNDS",
    "message": "Insufficient funds in account",
    "details": {
        "accountId": "ACC123",
        "requested": 500.00,
        "available": 250.00
    }
}
```

---

## 🎯 **Exercise 2: Fluent Validator**

### **Task**
Create a fluent validation framework for user registration:

### **Requirements**
```java
public class UserRegistration {
    private String email;
    private String password;
    private String confirmPassword;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String phoneNumber;
}
```

### **Validation Rules**
- Email: Required, valid format, not already registered
- Password: Required, min 8 chars, at least 1 uppercase, 1 number, 1 special char
- Confirm Password: Must match password
- First/Last Name: Required, alphabetic only, 2-50 chars
- Date of Birth: Required, must be 18+ years old
- Phone: Optional, valid format if provided

### **Expected Usage**
```java
ValidationResult result = Validator.of(registration)
    .validate("email", r -> r.getEmail())
        .notEmpty()
        .email()
        .custom(email -> !userRepo.existsByEmail(email), "Email already registered")
    .validate("password", r -> r.getPassword())
        .notEmpty()
        .minLength(8)
        .matches(STRONG_PASSWORD_PATTERN, "Password too weak")
    .validate("confirmPassword", r -> r.getConfirmPassword())
        .matches(registration.getPassword(), "Passwords don't match")
    .validate("dateOfBirth", r -> r.getDateOfBirth())
        .notNull()
        .before(LocalDate.now().minusYears(18), "Must be 18 or older")
    .run();

if (!result.isValid()) {
    throw new ValidationException(result.getErrors());
}
```

---

## 🎯 **Exercise 3: Result Type Implementation**

### **Task**
Implement a `Result<T, E>` type for functional error handling.

### **Requirements**
```java
public sealed interface Result<T, E> permits Success, Failure {
    
    boolean isSuccess();
    boolean isFailure();
    
    T getOrThrow();
    T getOrElse(T defaultValue);
    T getOrElse(Supplier<T> supplier);
    
    <U> Result<U, E> map(Function<T, U> mapper);
    <U> Result<U, E> flatMap(Function<T, Result<U, E>> mapper);
    
    Result<T, E> onSuccess(Consumer<T> action);
    Result<T, E> onFailure(Consumer<E> action);
    
    <F> Result<T, F> mapError(Function<E, F> mapper);
    
    Optional<T> toOptional();
}
```

### **Test Cases**
```java
// Success case
Result<User, String> result = userService.findById(userId);
String name = result
    .map(User::getName)
    .getOrElse("Unknown");

// Chaining
Result<Order, OrderError> orderResult = userService.findById(userId)
    .mapError(e -> new OrderError("User not found"))
    .flatMap(user -> cartService.getCart(user.getId()))
    .flatMap(cart -> orderService.createOrder(cart));

// Pattern matching (Java 21+)
switch (result) {
    case Success<User, String> s -> System.out.println("User: " + s.value());
    case Failure<User, String> f -> System.out.println("Error: " + f.error());
}
```

---

## 🎯 **Exercise 4: Builder with Validation**

### **Task**
Create a validated builder for a `PaymentRequest`:

### **Requirements**
```java
public class PaymentRequest {
    private final PaymentId id;
    private final Money amount;
    private final Currency currency;
    private final PaymentMethod method;
    private final String description;
    private final Instant requestedAt;
    
    // Card details (required for card payments)
    private final String cardNumber;
    private final String expiryDate;
    private final String cvv;
    
    // Bank details (required for bank transfer)
    private final String accountNumber;
    private final String routingNumber;
}
```

### **Validation Rules**
- Amount must be positive
- If card payment: cardNumber, expiryDate, cvv required
- If bank transfer: accountNumber, routingNumber required
- Card number must pass Luhn check
- Expiry date must be in future
- CVV must be 3-4 digits

### **Expected Usage**
```java
PaymentRequest request = PaymentRequest.builder()
    .amount(Money.dollars(100))
    .currency(Currency.USD)
    .method(PaymentMethod.CREDIT_CARD)
    .description("Order #123")
    .cardNumber("4111111111111111")
    .expiryDate("12/25")
    .cvv("123")
    .build();  // Throws if validation fails
```

---

## 🎯 **Exercise 5: Domain Error Types**

### **Scenario**
Design error types for an e-commerce order service:

### **Error Categories**
1. **Validation Errors** - Input validation failures
2. **Business Rule Violations** - Domain logic failures
3. **Resource Not Found** - Missing entities
4. **Conflict Errors** - State conflicts
5. **External Service Errors** - Third-party failures

### **Specific Errors Needed**
- Invalid order quantity (must be 1-100)
- Product not available in requested quantity
- Order not found
- Order already cancelled
- Payment declined
- Shipping service unavailable
- Inventory sync failed

### **Tasks**
1. Design error type hierarchy
2. Include error codes for API mapping
3. Support error aggregation (multiple errors)
4. Implement retry hints for recoverable errors

### **Expected Structure**
```java
public sealed interface OrderError permits 
    ValidationError, BusinessRuleError, NotFoundError, 
    ConflictError, ExternalServiceError {
    
    String getCode();
    String getMessage();
    Map<String, Object> getDetails();
    boolean isRetryable();
    Optional<Duration> getSuggestedRetryAfter();
}
```

---

## 🎯 **Exercise 6: API Contract Design**

### **Task**
Design a clean API contract for a User Service:

### **Operations**
1. Register new user
2. Authenticate user
3. Get user profile
4. Update user profile
5. Change password
6. Delete account

### **Requirements**
- Command/Query separation
- Proper error contracts
- Idempotency support
- Rate limiting consideration

### **Deliverables**
1. Service interface with JavaDoc
2. Command and Query objects
3. Response DTOs
4. Error hierarchy

### **Template**
```java
/**
 * User management service.
 * 
 * <p>Thread-safe. All operations are atomic.</p>
 * 
 * @see UserServiceImpl
 */
public interface UserService {
    
    /**
     * Register a new user.
     *
     * @param command Registration details
     * @return The created user's ID
     * @throws ValidationException if input is invalid
     * @throws ConflictException if email already exists
     */
    UserId register(RegisterUserCommand command);
    
    // Define remaining operations...
}
```

---

## 🏋️ **Advanced Challenges**

### **Challenge 1: Async Validation**
Create a validator that supports async checks:
```java
CompletableFuture<ValidationResult> result = AsyncValidator.of(user)
    .validate("email", asyncEmailCheck())
    .validate("username", asyncUsernameCheck())
    .runAsync();
```

### **Challenge 2: Error Recovery**
Implement error recovery with fallbacks:
```java
Result<Product, ProductError> product = productService.getById(id)
    .recover(NotFoundError.class, () -> productService.getDefault())
    .recover(ServiceError.class, () -> cachedProductService.getById(id));
```

### **Challenge 3: Validation DSL**
Create a validation DSL:
```java
@Validated
public class Order {
    @NotEmpty(message = "Order ID required")
    private String orderId;
    
    @Positive(message = "Amount must be positive")
    @Max(value = 10000, message = "Amount too large")
    private Money amount;
    
    @ValidState(from = {PENDING}, to = {CONFIRMED, CANCELLED})
    private OrderStatus status;
}
```

---

## 📊 **Grading Rubric**

| Criteria | Points |
|----------|--------|
| **Error Design** - Clear, informative errors | 20 |
| **Validation** - Comprehensive rule coverage | 20 |
| **API Design** - Clean contracts | 20 |
| **Recoverability** - Handle failures gracefully | 15 |
| **Testing** - Edge cases covered | 15 |
| **Documentation** - Clear JavaDoc | 10 |

---

**Solutions**: [EXERCISE_SOLUTIONS.md](week1/day5/EXERCISE_SOLUTIONS.md)

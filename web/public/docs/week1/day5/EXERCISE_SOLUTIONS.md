# Day 5 Exercise Solutions 🎯

---

## ✅ **Solution 1: Exception Hierarchy Design**

```java
package com.you.lld.banking.exception;

import java.util.HashMap;
import java.util.Map;

/**
 * Base exception for all banking operations.
 */
public abstract class BankingException extends RuntimeException {
    
    private final String errorCode;
    private final Map<String, Object> context = new HashMap<>();
    
    protected BankingException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
    
    protected BankingException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public BankingException withContext(String key, Object value) {
        context.put(key, value);
        return this;
    }
    
    public Map<String, Object> getContext() {
        return new HashMap<>(context);
    }
    
    public ApiError toApiError() {
        return ApiError.builder()
            .errorCode(errorCode)
            .message(getMessage())
            .details(getErrorDetails())
            .build();
    }
    
    protected abstract Map<String, Object> getErrorDetails();
}

// Account exceptions
public class AccountNotFoundException extends BankingException {
    
    private final String accountId;
    
    public AccountNotFoundException(String accountId) {
        super("ACCOUNT_NOT_FOUND", "Account not found: " + accountId);
        this.accountId = accountId;
    }
    
    @Override
    protected Map<String, Object> getErrorDetails() {
        return Map.of("accountId", accountId);
    }
}

public class InsufficientFundsException extends BankingException {
    
    private final String accountId;
    private final Money requestedAmount;
    private final Money availableBalance;
    
    public InsufficientFundsException(String accountId, Money requested, Money available) {
        super("INSUFFICIENT_FUNDS", "Insufficient funds in account");
        this.accountId = accountId;
        this.requestedAmount = requested;
        this.availableBalance = available;
    }
    
    @Override
    protected Map<String, Object> getErrorDetails() {
        return Map.of(
            "accountId", accountId,
            "requested", requestedAmount.getAmount(),
            "available", availableBalance.getAmount()
        );
    }
}

public class AccountFrozenException extends BankingException {
    
    private final String accountId;
    private final String reason;
    private final Instant frozenAt;
    
    public AccountFrozenException(String accountId, String reason, Instant frozenAt) {
        super("ACCOUNT_FROZEN", "Account is frozen: " + reason);
        this.accountId = accountId;
        this.reason = reason;
        this.frozenAt = frozenAt;
    }
    
    @Override
    protected Map<String, Object> getErrorDetails() {
        return Map.of(
            "accountId", accountId,
            "reason", reason,
            "frozenAt", frozenAt.toString()
        );
    }
}

public class DailyLimitExceededException extends BankingException {
    
    private final String accountId;
    private final Money dailyLimit;
    private final Money usedToday;
    private final Money requestedAmount;
    
    public DailyLimitExceededException(String accountId, Money limit, Money used, Money requested) {
        super("DAILY_LIMIT_EXCEEDED", "Daily transaction limit exceeded");
        this.accountId = accountId;
        this.dailyLimit = limit;
        this.usedToday = used;
        this.requestedAmount = requested;
    }
    
    @Override
    protected Map<String, Object> getErrorDetails() {
        return Map.of(
            "accountId", accountId,
            "dailyLimit", dailyLimit.getAmount(),
            "usedToday", usedToday.getAmount(),
            "requested", requestedAmount.getAmount(),
            "remaining", dailyLimit.subtract(usedToday).getAmount()
        );
    }
}

// API Error DTO
public class ApiError {
    private final String errorCode;
    private final String message;
    private final Map<String, Object> details;
    private final Instant timestamp;
    
    // Builder pattern implementation...
}
```

---

## ✅ **Solution 2: Fluent Validator**

```java
package com.you.lld.validation;

import java.util.*;
import java.util.function.*;
import java.util.regex.Pattern;

public class Validator<T> {
    
    private final T target;
    private final List<FieldValidator<?>> validators = new ArrayList<>();
    
    private Validator(T target) {
        this.target = target;
    }
    
    public static <T> Validator<T> of(T target) {
        return new Validator<>(target);
    }
    
    public <V> FieldValidator<V> validate(String fieldName, Function<T, V> extractor) {
        FieldValidator<V> fieldValidator = new FieldValidator<>(this, fieldName, extractor.apply(target));
        validators.add(fieldValidator);
        return fieldValidator;
    }
    
    public ValidationResult run() {
        List<ValidationError> errors = new ArrayList<>();
        for (FieldValidator<?> validator : validators) {
            errors.addAll(validator.validate());
        }
        return new ValidationResult(errors);
    }
    
    public static class FieldValidator<V> {
        
        private final Validator<?> parent;
        private final String fieldName;
        private final V value;
        private final List<Rule<V>> rules = new ArrayList<>();
        
        FieldValidator(Validator<?> parent, String fieldName, V value) {
            this.parent = parent;
            this.fieldName = fieldName;
            this.value = value;
        }
        
        public FieldValidator<V> notNull() {
            return notNull("must not be null");
        }
        
        public FieldValidator<V> notNull(String message) {
            rules.add(new Rule<>(v -> v != null, message));
            return this;
        }
        
        public FieldValidator<V> notEmpty() {
            return notEmpty("must not be empty");
        }
        
        public FieldValidator<V> notEmpty(String message) {
            rules.add(new Rule<>(v -> {
                if (v == null) return false;
                if (v instanceof String) return !((String) v).trim().isEmpty();
                if (v instanceof Collection) return !((Collection<?>) v).isEmpty();
                return true;
            }, message));
            return this;
        }
        
        public FieldValidator<V> minLength(int length) {
            return minLength(length, "must be at least " + length + " characters");
        }
        
        public FieldValidator<V> minLength(int length, String message) {
            rules.add(new Rule<>(v -> v == null || v.toString().length() >= length, message));
            return this;
        }
        
        public FieldValidator<V> maxLength(int length) {
            return maxLength(length, "must not exceed " + length + " characters");
        }
        
        public FieldValidator<V> maxLength(int length, String message) {
            rules.add(new Rule<>(v -> v == null || v.toString().length() <= length, message));
            return this;
        }
        
        public FieldValidator<V> matches(Pattern pattern, String message) {
            rules.add(new Rule<>(v -> v == null || pattern.matcher(v.toString()).matches(), message));
            return this;
        }
        
        public FieldValidator<V> matches(Object expected, String message) {
            rules.add(new Rule<>(v -> Objects.equals(v, expected), message));
            return this;
        }
        
        public FieldValidator<V> email() {
            return email("must be a valid email address");
        }
        
        public FieldValidator<V> email(String message) {
            Pattern emailPattern = Pattern.compile(
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
            );
            return matches(emailPattern, message);
        }
        
        public FieldValidator<V> before(Comparable<?> date, String message) {
            rules.add(new Rule<>(v -> {
                if (v == null) return true;
                if (v instanceof Comparable) {
                    return ((Comparable<Object>) v).compareTo(date) < 0;
                }
                return true;
            }, message));
            return this;
        }
        
        public FieldValidator<V> custom(Predicate<V> predicate, String message) {
            rules.add(new Rule<>(predicate, message));
            return this;
        }
        
        public <U> FieldValidator<U> validate(String fieldName, Function<Object, U> extractor) {
            return parent.validate(fieldName, t -> extractor.apply(value));
        }
        
        public ValidationResult run() {
            return parent.run();
        }
        
        List<ValidationError> validate() {
            List<ValidationError> errors = new ArrayList<>();
            for (Rule<V> rule : rules) {
                if (!rule.test(value)) {
                    errors.add(new ValidationError(fieldName, rule.message, value));
                }
            }
            return errors;
        }
        
        private static class Rule<V> {
            final Predicate<V> predicate;
            final String message;
            
            Rule(Predicate<V> predicate, String message) {
                this.predicate = predicate;
                this.message = message;
            }
            
            boolean test(V value) {
                return predicate.test(value);
            }
        }
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
    
    public Map<String, List<String>> getErrorsByField() {
        Map<String, List<String>> map = new HashMap<>();
        for (ValidationError error : errors) {
            map.computeIfAbsent(error.getField(), k -> new ArrayList<>())
               .add(error.getMessage());
        }
        return map;
    }
    
    public void throwIfInvalid() {
        if (!isValid()) {
            throw new ValidationException(errors);
        }
    }
}

public class ValidationError {
    
    private final String field;
    private final String message;
    private final Object rejectedValue;
    
    public ValidationError(String field, String message, Object rejectedValue) {
        this.field = field;
        this.message = message;
        this.rejectedValue = rejectedValue;
    }
    
    // Getters...
}
```

---

## ✅ **Solution 3: Result Type Implementation**

```java
package com.you.lld.common;

import java.util.Optional;
import java.util.function.*;

public sealed interface Result<T, E> permits Result.Success, Result.Failure {
    
    // Static factories
    static <T, E> Result<T, E> success(T value) {
        return new Success<>(value);
    }
    
    static <T, E> Result<T, E> failure(E error) {
        return new Failure<>(error);
    }
    
    static <T, E extends Throwable> Result<T, E> of(Supplier<T> supplier) {
        try {
            return success(supplier.get());
        } catch (Throwable e) {
            return failure((E) e);
        }
    }
    
    // Query methods
    boolean isSuccess();
    default boolean isFailure() { return !isSuccess(); }
    
    // Value extraction
    T getOrThrow();
    T getOrElse(T defaultValue);
    T getOrElse(Supplier<T> supplier);
    
    // Transformations
    <U> Result<U, E> map(Function<T, U> mapper);
    <U> Result<U, E> flatMap(Function<T, Result<U, E>> mapper);
    <F> Result<T, F> mapError(Function<E, F> mapper);
    
    // Side effects
    Result<T, E> onSuccess(Consumer<T> action);
    Result<T, E> onFailure(Consumer<E> action);
    
    // Conversions
    Optional<T> toOptional();
    
    // Recovery
    Result<T, E> recover(Function<E, T> recovery);
    Result<T, E> recoverWith(Function<E, Result<T, E>> recovery);
    
    // Implementation
    record Success<T, E>(T value) implements Result<T, E> {
        
        @Override
        public boolean isSuccess() { return true; }
        
        @Override
        public T getOrThrow() { return value; }
        
        @Override
        public T getOrElse(T defaultValue) { return value; }
        
        @Override
        public T getOrElse(Supplier<T> supplier) { return value; }
        
        @Override
        public <U> Result<U, E> map(Function<T, U> mapper) {
            return new Success<>(mapper.apply(value));
        }
        
        @Override
        public <U> Result<U, E> flatMap(Function<T, Result<U, E>> mapper) {
            return mapper.apply(value);
        }
        
        @Override
        public <F> Result<T, F> mapError(Function<E, F> mapper) {
            return new Success<>(value);
        }
        
        @Override
        public Result<T, E> onSuccess(Consumer<T> action) {
            action.accept(value);
            return this;
        }
        
        @Override
        public Result<T, E> onFailure(Consumer<E> action) {
            return this;
        }
        
        @Override
        public Optional<T> toOptional() {
            return Optional.of(value);
        }
        
        @Override
        public Result<T, E> recover(Function<E, T> recovery) {
            return this;
        }
        
        @Override
        public Result<T, E> recoverWith(Function<E, Result<T, E>> recovery) {
            return this;
        }
    }
    
    record Failure<T, E>(E error) implements Result<T, E> {
        
        @Override
        public boolean isSuccess() { return false; }
        
        @Override
        public T getOrThrow() {
            if (error instanceof RuntimeException) {
                throw (RuntimeException) error;
            }
            throw new RuntimeException("Result is failure: " + error);
        }
        
        @Override
        public T getOrElse(T defaultValue) { return defaultValue; }
        
        @Override
        public T getOrElse(Supplier<T> supplier) { return supplier.get(); }
        
        @Override
        public <U> Result<U, E> map(Function<T, U> mapper) {
            return new Failure<>(error);
        }
        
        @Override
        public <U> Result<U, E> flatMap(Function<T, Result<U, E>> mapper) {
            return new Failure<>(error);
        }
        
        @Override
        public <F> Result<T, F> mapError(Function<E, F> mapper) {
            return new Failure<>(mapper.apply(error));
        }
        
        @Override
        public Result<T, E> onSuccess(Consumer<T> action) {
            return this;
        }
        
        @Override
        public Result<T, E> onFailure(Consumer<E> action) {
            action.accept(error);
            return this;
        }
        
        @Override
        public Optional<T> toOptional() {
            return Optional.empty();
        }
        
        @Override
        public Result<T, E> recover(Function<E, T> recovery) {
            return new Success<>(recovery.apply(error));
        }
        
        @Override
        public Result<T, E> recoverWith(Function<E, Result<T, E>> recovery) {
            return recovery.apply(error);
        }
    }
}

// Usage example
public class UserServiceExample {
    
    public Result<User, UserError> findUser(UserId id) {
        User user = repository.findById(id);
        if (user == null) {
            return Result.failure(new UserError.NotFound(id));
        }
        return Result.success(user);
    }
    
    public Result<Order, OrderError> placeOrder(UserId userId, Cart cart) {
        return findUser(userId)
            .mapError(e -> new OrderError.UserNotFound(userId))
            .flatMap(user -> validateCart(cart))
            .flatMap(validCart -> processPayment(user, validCart))
            .flatMap(payment -> createOrder(user, validCart, payment));
    }
}
```

---

## ✅ **Solution 4: Builder with Validation**

```java
package com.you.lld.payment;

public class PaymentRequest {
    
    private final PaymentId id;
    private final Money amount;
    private final Currency currency;
    private final PaymentMethod method;
    private final String description;
    private final Instant requestedAt;
    
    // Card details
    private final String cardNumber;
    private final String expiryDate;
    private final String cvv;
    
    // Bank details
    private final String accountNumber;
    private final String routingNumber;
    
    private PaymentRequest(Builder builder) {
        this.id = PaymentId.generate();
        this.amount = builder.amount;
        this.currency = builder.currency;
        this.method = builder.method;
        this.description = builder.description;
        this.requestedAt = Instant.now();
        this.cardNumber = builder.cardNumber;
        this.expiryDate = builder.expiryDate;
        this.cvv = builder.cvv;
        this.accountNumber = builder.accountNumber;
        this.routingNumber = builder.routingNumber;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private Money amount;
        private Currency currency;
        private PaymentMethod method;
        private String description;
        private String cardNumber;
        private String expiryDate;
        private String cvv;
        private String accountNumber;
        private String routingNumber;
        
        public Builder amount(Money amount) {
            this.amount = amount;
            return this;
        }
        
        public Builder currency(Currency currency) {
            this.currency = currency;
            return this;
        }
        
        public Builder method(PaymentMethod method) {
            this.method = method;
            return this;
        }
        
        public Builder description(String description) {
            this.description = description;
            return this;
        }
        
        public Builder cardNumber(String cardNumber) {
            this.cardNumber = cardNumber;
            return this;
        }
        
        public Builder expiryDate(String expiryDate) {
            this.expiryDate = expiryDate;
            return this;
        }
        
        public Builder cvv(String cvv) {
            this.cvv = cvv;
            return this;
        }
        
        public Builder accountNumber(String accountNumber) {
            this.accountNumber = accountNumber;
            return this;
        }
        
        public Builder routingNumber(String routingNumber) {
            this.routingNumber = routingNumber;
            return this;
        }
        
        public PaymentRequest build() {
            validate();
            return new PaymentRequest(this);
        }
        
        private void validate() {
            List<String> errors = new ArrayList<>();
            
            // Common validations
            if (amount == null || amount.isNegativeOrZero()) {
                errors.add("Amount must be positive");
            }
            if (currency == null) {
                errors.add("Currency is required");
            }
            if (method == null) {
                errors.add("Payment method is required");
            }
            
            // Method-specific validations
            if (method != null) {
                switch (method) {
                    case CREDIT_CARD, DEBIT_CARD -> validateCardDetails(errors);
                    case BANK_TRANSFER -> validateBankDetails(errors);
                }
            }
            
            if (!errors.isEmpty()) {
                throw new PaymentValidationException(errors);
            }
        }
        
        private void validateCardDetails(List<String> errors) {
            if (cardNumber == null || cardNumber.isEmpty()) {
                errors.add("Card number is required");
            } else if (!LuhnValidator.isValid(cardNumber)) {
                errors.add("Invalid card number");
            }
            
            if (expiryDate == null || expiryDate.isEmpty()) {
                errors.add("Expiry date is required");
            } else if (!isValidExpiryDate(expiryDate)) {
                errors.add("Invalid or expired card");
            }
            
            if (cvv == null || !cvv.matches("\\d{3,4}")) {
                errors.add("CVV must be 3-4 digits");
            }
        }
        
        private void validateBankDetails(List<String> errors) {
            if (accountNumber == null || accountNumber.isEmpty()) {
                errors.add("Account number is required");
            }
            if (routingNumber == null || !routingNumber.matches("\\d{9}")) {
                errors.add("Routing number must be 9 digits");
            }
        }
        
        private boolean isValidExpiryDate(String expiry) {
            try {
                String[] parts = expiry.split("/");
                int month = Integer.parseInt(parts[0]);
                int year = Integer.parseInt(parts[1]) + 2000;
                YearMonth expiryYm = YearMonth.of(year, month);
                return expiryYm.isAfter(YearMonth.now());
            } catch (Exception e) {
                return false;
            }
        }
    }
}

// Luhn validator for card numbers
public class LuhnValidator {
    
    public static boolean isValid(String cardNumber) {
        String digits = cardNumber.replaceAll("\\D", "");
        if (digits.length() < 13 || digits.length() > 19) {
            return false;
        }
        
        int sum = 0;
        boolean alternate = false;
        
        for (int i = digits.length() - 1; i >= 0; i--) {
            int digit = Character.getNumericValue(digits.charAt(i));
            
            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            alternate = !alternate;
        }
        
        return sum % 10 == 0;
    }
}
```

---

## 📝 **Key Takeaways**

1. **Exception hierarchies** should be meaningful and carry context
2. **Fluent validation** is composable and readable
3. **Result types** make error handling explicit in signatures
4. **Builder validation** prevents invalid object creation
5. **Domain errors** should be specific and actionable

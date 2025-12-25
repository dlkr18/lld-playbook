# Week 2 Day 6 - Creational Patterns

## 📂 19 Java Files

### builder

#### `SqlQueryBuilder.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.builder;

import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;

/**
 * SQL Query Builder demonstrating the Builder pattern for dynamic query construction.
 * 
 * This example shows how Builder pattern can be used for:
 * - Dynamic SQL query construction
 * - Method chaining for readable code
 * - Conditional query building
 * - SQL injection prevention through parameterization
 */
public class SqlQueryBuilder {
    private final StringBuilder query;
    private final List<Object> parameters;
    private final QueryType queryType;
    
    private SqlQueryBuilder(QueryType queryType) {
        this.query = new StringBuilder();
        this.parameters = new ArrayList<>();
        this.queryType = queryType;
    }
    
    // Factory methods for different query types
    public static SqlQueryBuilder select() {
        return new SqlQueryBuilder(QueryType.SELECT);
    }
    
    public static SqlQueryBuilder insert() {
        return new SqlQueryBuilder(QueryType.INSERT);
    }
    
    public static SqlQueryBuilder update() {
        return new SqlQueryBuilder(QueryType.UPDATE);
    }
    
    public static SqlQueryBuilder delete() {
        return new SqlQueryBuilder(QueryType.DELETE);
    }
    
    // SELECT query methods
    public SqlQueryBuilder columns(String... columns) {
        if (queryType != QueryType.SELECT) {
            throw new IllegalStateException("columns() can only be used with SELECT queries");
        }
        
        if (columns.length == 0) {
            query.append("SELECT * ");
        } else {
            query.append("SELECT ");
            StringJoiner joiner = new StringJoiner(", ");
            for (String column : columns) {
                joiner.add(column);
            }
            query.append(joiner.toString()).append(" ");
        }
        return this;
    }
    
    public SqlQueryBuilder from(String table) {
        if (queryType == QueryType.SELECT) {
            query.append("FROM ").append(table).append(" ");
        } else if (queryType == QueryType.DELETE) {
            query.append("DELETE FROM ").append(table).append(" ");
        } else {
            throw new IllegalStateException("from() can only be used with SELECT or DELETE queries");
        }
        return this;
    }
    
    // INSERT query methods
    public SqlQueryBuilder into(String table) {
        if (queryType != QueryType.INSERT) {
            throw new IllegalStateException("into() can only be used with INSERT queries");
        }
        query.append("INSERT INTO ").append(table).append(" ");
        return this;
    }
    
    public SqlQueryBuilder values(String... columns) {
        if (queryType != QueryType.INSERT) {
            throw new IllegalStateException("values() can only be used with INSERT queries");
        }
        
        // Add column names
        query.append("(");
        StringJoiner columnJoiner = new StringJoiner(", ");
        for (String column : columns) {
            columnJoiner.add(column);
        }
        query.append(columnJoiner.toString()).append(") VALUES (");
        
        // Add parameter placeholders
        StringJoiner valueJoiner = new StringJoiner(", ");
        for (int i = 0; i < columns.length; i++) {
            valueJoiner.add("?");
        }
        query.append(valueJoiner.toString()).append(") ");
        
        return this;
    }
    
    // UPDATE query methods
    public SqlQueryBuilder table(String table) {
        if (queryType != QueryType.UPDATE) {
            throw new IllegalStateException("table() can only be used with UPDATE queries");
        }
        query.append("UPDATE ").append(table).append(" ");
        return this;
    }
    
    public SqlQueryBuilder set(String column) {
        if (queryType != QueryType.UPDATE) {
            throw new IllegalStateException("set() can only be used with UPDATE queries");
        }
        
        if (!query.toString().contains("SET")) {
            query.append("SET ");
        } else {
            query.append(", ");
        }
        
        query.append(column).append(" = ? ");
        return this;
    }
    
    // Common WHERE clause methods
    public SqlQueryBuilder where(String condition) {
        query.append("WHERE ").append(condition).append(" ");
        return this;
    }
    
    public SqlQueryBuilder and(String condition) {
        query.append("AND ").append(condition).append(" ");
        return this;
    }
    
    public SqlQueryBuilder or(String condition) {
        query.append("OR ").append(condition).append(" ");
        return this;
    }
    
    // Parameter binding methods
    public SqlQueryBuilder withParameter(Object parameter) {
        parameters.add(parameter);
        return this;
    }
    
    public SqlQueryBuilder withParameters(Object... params) {
        for (Object param : params) {
            parameters.add(param);
        }
        return this;
    }
    
    // JOIN methods for SELECT queries
    public SqlQueryBuilder innerJoin(String table, String condition) {
        if (queryType != QueryType.SELECT) {
            throw new IllegalStateException("JOIN can only be used with SELECT queries");
        }
        query.append("INNER JOIN ").append(table).append(" ON ").append(condition).append(" ");
        return this;
    }
    
    public SqlQueryBuilder leftJoin(String table, String condition) {
        if (queryType != QueryType.SELECT) {
            throw new IllegalStateException("JOIN can only be used with SELECT queries");
        }
        query.append("LEFT JOIN ").append(table).append(" ON ").append(condition).append(" ");
        return this;
    }
    
    // Ordering and grouping
    public SqlQueryBuilder orderBy(String column, SortOrder order) {
        if (queryType != QueryType.SELECT) {
            throw new IllegalStateException("ORDER BY can only be used with SELECT queries");
        }
        query.append("ORDER BY ").append(column).append(" ").append(order.name()).append(" ");
        return this;
    }
    
    public SqlQueryBuilder groupBy(String... columns) {
        if (queryType != QueryType.SELECT) {
            throw new IllegalStateException("GROUP BY can only be used with SELECT queries");
        }
        query.append("GROUP BY ");
        StringJoiner joiner = new StringJoiner(", ");
        for (String column : columns) {
            joiner.add(column);
        }
        query.append(joiner.toString()).append(" ");
        return this;
    }
    
    public SqlQueryBuilder having(String condition) {
        if (queryType != QueryType.SELECT) {
            throw new IllegalStateException("HAVING can only be used with SELECT queries");
        }
        query.append("HAVING ").append(condition).append(" ");
        return this;
    }
    
    public SqlQueryBuilder limit(int count) {
        if (queryType != QueryType.SELECT) {
            throw new IllegalStateException("LIMIT can only be used with SELECT queries");
        }
        query.append("LIMIT ").append(count).append(" ");
        return this;
    }
    
    // Build the final query
    public PreparedQuery build() {
        String finalQuery = query.toString().trim();
        if (finalQuery.isEmpty()) {
            throw new IllegalStateException("Query cannot be empty");
        }
        
        return new PreparedQuery(finalQuery, new ArrayList<>(parameters));
    }
    
    // Enums for type safety
    public enum QueryType {
        SELECT, INSERT, UPDATE, DELETE
    }
    
    public enum SortOrder {
        ASC, DESC
    }
    
    /**
     * Represents a prepared SQL query with parameters.
     * This is the immutable result of the builder.
     */
    public static class PreparedQuery {
        private final String sql;
        private final List<Object> parameters;
        
        public PreparedQuery(String sql, List<Object> parameters) {
            this.sql = sql;
            this.parameters = parameters;
        }
        
        public String getSql() {
            return sql;
        }
        
        public List<Object> getParameters() {
            return new ArrayList<>(parameters);
        }
        
        @Override
        public String toString() {
            return "PreparedQuery{" +
                   "sql='" + sql + '\'' +
                   ", parameters=" + parameters +
                   '}';
        }
    }
}

```
</details>

#### `User.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.builder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * User class demonstrating the Builder pattern.
 * 
 * This example shows how to handle:
 * - Required fields (name, email)
 * - Optional fields (age, phone, address, preferences)
 * - Validation during building
 * - Immutable result object
 * - Fluent API design
 */
public final class User {
    // Required fields
    private final String name;
    private final String email;
    
    // Optional fields
    private final Integer age;
    private final String phone;
    private final String address;
    private final List<String> preferences;
    private final boolean isActive;
    private final LocalDateTime createdAt;
    
    // Private constructor - only accessible through Builder
    private User(Builder builder) {
        this.name = builder.name;
        this.email = builder.email;
        this.age = builder.age;
        this.phone = builder.phone;
        this.address = builder.address;
        this.preferences = builder.preferences != null ? 
            new ArrayList<>(builder.preferences) : new ArrayList<>();
        this.isActive = builder.isActive;
        this.createdAt = builder.createdAt != null ? 
            builder.createdAt : LocalDateTime.now();
    }
    
    // Static method to create builder
    public static Builder builder() {
        return new Builder();
    }
    
    // Getters only - immutable object
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Integer getAge() { return age; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public List<String> getPreferences() { return new ArrayList<>(preferences); }
    public boolean isActive() { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        User user = (User) obj;
        return isActive == user.isActive &&
               Objects.equals(name, user.name) &&
               Objects.equals(email, user.email) &&
               Objects.equals(age, user.age) &&
               Objects.equals(phone, user.phone) &&
               Objects.equals(address, user.address) &&
               Objects.equals(preferences, user.preferences) &&
               Objects.equals(createdAt, user.createdAt);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name, email, age, phone, address, preferences, isActive, createdAt);
    }
    
    @Override
    public String toString() {
        return "User{" +
               "name='" + name + '\'' +
               ", email='" + email + '\'' +
               ", age=" + age +
               ", phone='" + phone + '\'' +
               ", address='" + address + '\'' +
               ", preferences=" + preferences +
               ", isActive=" + isActive +
               ", createdAt=" + createdAt +
               '}';
    }
    
    /**
     * Builder class for User construction.
     * Implements fluent interface pattern for readable object creation.
     */
    public static class Builder {
        // Required fields
        private String name;
        private String email;
        
        // Optional fields with default values
        private Integer age;
        private String phone;
        private String address;
        private List<String> preferences;
        private boolean isActive = true; // Default to active
        private LocalDateTime createdAt;
        
        // Private constructor to prevent external instantiation
        private Builder() {}
        
        // Required field setters
        public Builder name(String name) {
            this.name = name;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        // Optional field setters
        public Builder age(Integer age) {
            this.age = age;
            return this;
        }
        
        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }
        
        public Builder address(String address) {
            this.address = address;
            return this;
        }
        
        public Builder preferences(List<String> preferences) {
            this.preferences = preferences;
            return this;
        }
        
        public Builder addPreference(String preference) {
            if (this.preferences == null) {
                this.preferences = new ArrayList<>();
            }
            this.preferences.add(preference);
            return this;
        }
        
        public Builder isActive(boolean isActive) {
            this.isActive = isActive;
            return this;
        }
        
        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        
        /**
         * Build the User object with validation.
         * @return Immutable User instance
         * @throws IllegalStateException if required fields are missing or invalid
         */
        public User build() {
            validate();
            return new User(this);
        }
        
        /**
         * Validate builder state before creating User.
         * This is where business rules and constraints are enforced.
         */
        private void validate() {
            if (name == null || name.trim().isEmpty()) {
                throw new IllegalStateException("Name is required and cannot be empty");
            }
            
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalStateException("Email is required and cannot be empty");
            }
            
            // Basic email validation
            if (!email.contains("@") || !email.contains(".")) {
                throw new IllegalStateException("Email must be in valid format");
            }
            
            // Age validation if provided
            if (age != null && (age < 0 || age > 150)) {
                throw new IllegalStateException("Age must be between 0 and 150");
            }
            
            // Phone validation if provided
            if (phone != null && phone.trim().length() < 10) {
                throw new IllegalStateException("Phone number must be at least 10 digits");
            }
        }
    }
}

```
</details>

### factory

#### `BankTransferProcessor.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.factory;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Bank transfer processor implementation.
 * Demonstrates a different payment method with different validation requirements.
 */
public class BankTransferProcessor implements PaymentProcessor {
    
    private static final BigDecimal BANK_TRANSFER_FEE = new BigDecimal("1.50"); // Flat fee
    
    @Override
    public PaymentResult processPayment(BigDecimal amount, String currency, PaymentDetails paymentDetails) 
            throws PaymentException {
        
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new PaymentException(
                PaymentException.ErrorCodes.AMOUNT_TOO_SMALL,
                "Amount must be greater than zero",
                PaymentMethod.BANK_TRANSFER
            );
        }
        
        if (!validatePaymentDetails(paymentDetails)) {
            throw new PaymentException(
                PaymentException.ErrorCodes.INVALID_BANK_ACCOUNT,
                "Invalid bank account details",
                PaymentMethod.BANK_TRANSFER
            );
        }
        
        String transactionId = "BT_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        BigDecimal processingFee = getProcessingFee(amount, currency);
        
        // Bank transfers typically take longer to process
        return PaymentResult.builder()
                .success(true)
                .transactionId(transactionId)
                .amount(amount)
                .currency(currency)
                .paymentMethod(PaymentMethod.BANK_TRANSFER)
                .processingFee(processingFee)
                .message("Bank transfer initiated successfully. Processing may take 1-3 business days.")
                .build();
    }
    
    @Override
    public boolean validatePaymentDetails(PaymentDetails paymentDetails) {
        if (paymentDetails == null) {
            return false;
        }
        
        String accountNumber = paymentDetails.getAccountNumber();
        String routingNumber = paymentDetails.getRoutingNumber();
        
        return isValidAccountNumber(accountNumber) && isValidRoutingNumber(routingNumber);
    }
    
    @Override
    public PaymentMethod getSupportedPaymentMethod() {
        return PaymentMethod.BANK_TRANSFER;
    }
    
    @Override
    public boolean supportsCurrency(String currency) {
        // Bank transfers typically support local currency only
        return "USD".equals(currency);
    }
    
    @Override
    public BigDecimal getProcessingFee(BigDecimal amount, String currency) {
        return BANK_TRANSFER_FEE;
    }
    
    private boolean isValidAccountNumber(String accountNumber) {
        return accountNumber != null && 
               accountNumber.matches("\\d{8,17}"); // 8-17 digits
    }
    
    private boolean isValidRoutingNumber(String routingNumber) {
        return routingNumber != null && 
               routingNumber.matches("\\d{9}"); // Exactly 9 digits for US routing numbers
    }
}

```
</details>

#### `ConfigurablePaymentProcessor.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.factory;

/**
 * Interface for payment processors that can be configured.
 * This allows the factory to pass configuration to processors that support it.
 */
public interface ConfigurablePaymentProcessor {
    
    /**
     * Configure the payment processor with the provided configuration.
     * 
     * @param config The configuration to apply
     * @throws IllegalArgumentException if configuration is invalid
     */
    void configure(PaymentProcessorConfig config);
    
    /**
     * Get the current configuration of the processor.
     * 
     * @return Current configuration, or null if not configured
     */
    PaymentProcessorConfig getConfiguration();
    
    /**
     * Check if the processor is properly configured and ready to process payments.
     * 
     * @return true if configured and ready, false otherwise
     */
    boolean isConfigured();
}

```
</details>

#### `CreditCardProcessor.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.factory;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Credit card payment processor implementation.
 * Demonstrates concrete implementation of the PaymentProcessor interface.
 */
public class CreditCardProcessor implements PaymentProcessor, ConfigurablePaymentProcessor {
    
    private static final Set<String> SUPPORTED_CURRENCIES = new HashSet<>(
        Arrays.asList("USD", "EUR", "GBP", "CAD", "AUD", "JPY")
    );
    
    private static final BigDecimal DEFAULT_FEE_PERCENTAGE = new BigDecimal("0.029"); // 2.9%
    private static final BigDecimal DEFAULT_FIXED_FEE = new BigDecimal("0.30");
    
    private PaymentProcessorConfig config;
    
    public CreditCardProcessor() {
        // Default configuration
        this.config = new PaymentProcessorConfig();
        this.config.setProcessingFeePercentage(DEFAULT_FEE_PERCENTAGE);
        this.config.setFixedProcessingFee(DEFAULT_FIXED_FEE);
        this.config.setSandboxMode(true); // Default to sandbox for safety
    }
    
    @Override
    public PaymentResult processPayment(BigDecimal amount, String currency, PaymentDetails paymentDetails) 
            throws PaymentException {
        
        // Validate inputs
        validateAmount(amount);
        validateCurrency(currency);
        
        if (!validatePaymentDetails(paymentDetails)) {
            throw new PaymentException(
                PaymentException.ErrorCodes.INVALID_CARD_NUMBER,
                "Invalid credit card details provided",
                PaymentMethod.CREDIT_CARD
            );
        }
        
        try {
            // Simulate payment processing
            String transactionId = generateTransactionId();
            BigDecimal processingFee = getProcessingFee(amount, currency);
            
            // In a real implementation, this would make API calls to payment gateway
            if (config.isSandboxMode()) {
                return simulatePaymentProcessing(transactionId, amount, currency, processingFee, paymentDetails);
            } else {
                return processRealPayment(transactionId, amount, currency, processingFee, paymentDetails);
            }
            
        } catch (Exception e) {
            throw new PaymentException(
                PaymentException.ErrorCodes.PROCESSING_ERROR,
                "Failed to process credit card payment: " + e.getMessage(),
                PaymentMethod.CREDIT_CARD,
                e
            );
        }
    }
    
    @Override
    public boolean validatePaymentDetails(PaymentDetails paymentDetails) {
        if (paymentDetails == null) {
            return false;
        }
        
        // Validate required fields
        String cardNumber = paymentDetails.getCardNumber();
        String expiryDate = paymentDetails.getExpiryDate();
        String cvv = paymentDetails.getCvv();
        String cardHolderName = paymentDetails.getCardHolderName();
        
        return isValidCardNumber(cardNumber) &&
               isValidExpiryDate(expiryDate) &&
               isValidCvv(cvv) &&
               isValidCardHolderName(cardHolderName);
    }
    
    @Override
    public PaymentMethod getSupportedPaymentMethod() {
        return PaymentMethod.CREDIT_CARD;
    }
    
    @Override
    public boolean supportsCurrency(String currency) {
        return currency != null && SUPPORTED_CURRENCIES.contains(currency.toUpperCase());
    }
    
    @Override
    public BigDecimal getProcessingFee(BigDecimal amount, String currency) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal percentageFee = config.getProcessingFeePercentage() != null ?
            config.getProcessingFeePercentage() : DEFAULT_FEE_PERCENTAGE;
        BigDecimal fixedFee = config.getFixedProcessingFee() != null ?
            config.getFixedProcessingFee() : DEFAULT_FIXED_FEE;
        
        BigDecimal variableFee = amount.multiply(percentageFee);
        return variableFee.add(fixedFee).setScale(2, RoundingMode.HALF_UP);
    }
    
    @Override
    public void configure(PaymentProcessorConfig config) {
        if (config == null) {
            throw new IllegalArgumentException("Configuration cannot be null");
        }
        
        // Validate required configuration
        if (!config.isSandboxMode() && config.getApiKey() == null) {
            throw new IllegalArgumentException("API key is required for production mode");
        }
        
        this.config = config;
    }
    
    @Override
    public PaymentProcessorConfig getConfiguration() {
        return config;
    }
    
    @Override
    public boolean isConfigured() {
        return config != null && (config.isSandboxMode() || config.getApiKey() != null);
    }
    
    // Private helper methods
    
    private void validateAmount(BigDecimal amount) throws PaymentException {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new PaymentException(
                PaymentException.ErrorCodes.AMOUNT_TOO_SMALL,
                "Amount must be greater than zero",
                PaymentMethod.CREDIT_CARD
            );
        }
        
        // Check maximum amount (example limit)
        if (amount.compareTo(new BigDecimal("10000")) > 0) {
            throw new PaymentException(
                PaymentException.ErrorCodes.AMOUNT_TOO_LARGE,
                "Amount exceeds maximum limit of $10,000",
                PaymentMethod.CREDIT_CARD
            );
        }
    }
    
    private void validateCurrency(String currency) throws PaymentException {
        if (!supportsCurrency(currency)) {
            throw new PaymentException(
                PaymentException.ErrorCodes.UNSUPPORTED_CURRENCY,
                "Currency " + currency + " is not supported",
                PaymentMethod.CREDIT_CARD
            );
        }
    }
    
    private boolean isValidCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.trim().isEmpty()) {
            return false;
        }
        
        // Remove spaces and dashes
        String cleanCardNumber = cardNumber.replaceAll("[\\s-]", "");
        
        // Check if all digits
        if (!cleanCardNumber.matches("\\d+")) {
            return false;
        }
        
        // Check length (13-19 digits for most cards)
        if (cleanCardNumber.length() < 13 || cleanCardNumber.length() > 19) {
            return false;
        }
        
        // Luhn algorithm check
        return isValidLuhn(cleanCardNumber);
    }
    
    private boolean isValidLuhn(String cardNumber) {
        int sum = 0;
        boolean alternate = false;
        
        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int digit = Character.getNumericValue(cardNumber.charAt(i));
            
            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit = (digit % 10) + 1;
                }
            }
            
            sum += digit;
            alternate = !alternate;
        }
        
        return sum % 10 == 0;
    }
    
    private boolean isValidExpiryDate(String expiryDate) {
        if (expiryDate == null || expiryDate.trim().isEmpty()) {
            return false;
        }
        
        try {
            // Support MM/YY and MM/YYYY formats
            DateTimeFormatter formatter;
            if (expiryDate.length() == 5) { // MM/YY
                formatter = DateTimeFormatter.ofPattern("MM/yy");
            } else if (expiryDate.length() == 7) { // MM/YYYY
                formatter = DateTimeFormatter.ofPattern("MM/yyyy");
            } else {
                return false;
            }
            
            LocalDate expiry = LocalDate.parse("01/" + expiryDate, 
                DateTimeFormatter.ofPattern("dd/MM/" + (expiryDate.length() == 5 ? "yy" : "yyyy")));
            
            // Check if card is not expired
            return expiry.isAfter(LocalDate.now().withDayOfMonth(1));
            
        } catch (DateTimeParseException e) {
            return false;
        }
    }
    
    private boolean isValidCvv(String cvv) {
        return cvv != null && cvv.matches("\\d{3,4}");
    }
    
    private boolean isValidCardHolderName(String cardHolderName) {
        return cardHolderName != null && 
               cardHolderName.trim().length() >= 2 && 
               cardHolderName.matches("[a-zA-Z\\s]+");
    }
    
    private String generateTransactionId() {
        return "CC_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
    
    private PaymentResult simulatePaymentProcessing(String transactionId, BigDecimal amount, 
                                                   String currency, BigDecimal processingFee, 
                                                   PaymentDetails paymentDetails) {
        
        // Simulate different outcomes based on card number for testing
        String cardNumber = paymentDetails.getCardNumber();
        if (cardNumber != null) {
            String lastFourDigits = cardNumber.replaceAll("[\\s-]", "");
            lastFourDigits = lastFourDigits.substring(lastFourDigits.length() - 4);
            
            // Simulate declined card
            if ("0000".equals(lastFourDigits)) {
                return PaymentResult.failure(
                    PaymentException.ErrorCodes.CARD_DECLINED,
                    "Card was declined by the issuing bank",
                    PaymentMethod.CREDIT_CARD
                );
            }
            
            // Simulate insufficient funds
            if ("0001".equals(lastFourDigits)) {
                return PaymentResult.failure(
                    PaymentException.ErrorCodes.INSUFFICIENT_FUNDS,
                    "Insufficient funds available",
                    PaymentMethod.CREDIT_CARD
                );
            }
        }
        
        // Simulate successful payment
        return PaymentResult.success(transactionId, amount, currency, PaymentMethod.CREDIT_CARD, processingFee);
    }
    
    private PaymentResult processRealPayment(String transactionId, BigDecimal amount, 
                                           String currency, BigDecimal processingFee, 
                                           PaymentDetails paymentDetails) throws PaymentException {
        
        // In a real implementation, this would:
        // 1. Make API calls to payment gateway (Stripe, Square, etc.)
        // 2. Handle authentication and authorization
        // 3. Process webhooks and callbacks
        // 4. Handle 3D Secure authentication
        // 5. Store transaction records
        
        throw new PaymentException(
            PaymentException.ErrorCodes.PROCESSING_ERROR,
            "Real payment processing not implemented in this example",
            PaymentMethod.CREDIT_CARD
        );
    }
}

```
</details>

#### `DebitCardProcessor.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.factory;

import java.math.BigDecimal;

/**
 * Debit card processor - extends credit card processor with different fees.
 * Demonstrates inheritance in factory pattern implementations.
 */
public class DebitCardProcessor extends CreditCardProcessor {
    
    private static final BigDecimal DEBIT_FEE_PERCENTAGE = new BigDecimal("0.015"); // 1.5% (lower than credit)
    private static final BigDecimal DEBIT_FIXED_FEE = new BigDecimal("0.25");
    
    public DebitCardProcessor() {
        super();
        // Override default configuration for debit cards
        getConfiguration().setProcessingFeePercentage(DEBIT_FEE_PERCENTAGE);
        getConfiguration().setFixedProcessingFee(DEBIT_FIXED_FEE);
    }
    
    @Override
    public PaymentMethod getSupportedPaymentMethod() {
        return PaymentMethod.DEBIT_CARD;
    }
    
    @Override
    public PaymentResult processPayment(BigDecimal amount, String currency, PaymentDetails paymentDetails) 
            throws PaymentException {
        
        // Debit cards have additional validation - check for PIN if required
        // In this example, we'll just call the parent implementation
        PaymentResult result = super.processPayment(amount, currency, paymentDetails);
        
        // Modify transaction ID to indicate debit card
        if (result.isSuccess()) {
            String originalTxnId = result.getTransactionId();
            String debitTxnId = originalTxnId.replace("CC_", "DC_");
            
            return PaymentResult.builder()
                    .success(true)
                    .transactionId(debitTxnId)
                    .amount(result.getAmount())
                    .currency(result.getCurrency())
                    .paymentMethod(PaymentMethod.DEBIT_CARD)
                    .processingFee(result.getProcessingFee())
                    .message("Debit card payment processed successfully")
                    .timestamp(result.getTimestamp())
                    .build();
        }
        
        return result;
    }
}

```
</details>

#### `PayPalProcessor.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.factory;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * PayPal payment processor implementation.
 * Simpler implementation focusing on PayPal-specific logic.
 */
public class PayPalProcessor implements PaymentProcessor {
    
    private static final Set<String> SUPPORTED_CURRENCIES = new HashSet<>(
        Arrays.asList("USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF", "SEK", "NOK", "DKK")
    );
    
    private static final BigDecimal PAYPAL_FEE_PERCENTAGE = new BigDecimal("0.034"); // 3.4%
    private static final BigDecimal PAYPAL_FIXED_FEE = new BigDecimal("0.35");
    
    @Override
    public PaymentResult processPayment(BigDecimal amount, String currency, PaymentDetails paymentDetails) 
            throws PaymentException {
        
        // Validate inputs
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new PaymentException(
                PaymentException.ErrorCodes.AMOUNT_TOO_SMALL,
                "Amount must be greater than zero",
                PaymentMethod.PAYPAL
            );
        }
        
        if (!supportsCurrency(currency)) {
            throw new PaymentException(
                PaymentException.ErrorCodes.UNSUPPORTED_CURRENCY,
                "Currency " + currency + " is not supported by PayPal",
                PaymentMethod.PAYPAL
            );
        }
        
        if (!validatePaymentDetails(paymentDetails)) {
            throw new PaymentException(
                PaymentException.ErrorCodes.INVALID_PAYPAL_EMAIL,
                "Invalid PayPal email address",
                PaymentMethod.PAYPAL
            );
        }
        
        try {
            String transactionId = generateTransactionId();
            BigDecimal processingFee = getProcessingFee(amount, currency);
            
            // Simulate PayPal payment processing
            return simulatePayPalPayment(transactionId, amount, currency, processingFee, paymentDetails);
            
        } catch (Exception e) {
            throw new PaymentException(
                PaymentException.ErrorCodes.PROCESSING_ERROR,
                "Failed to process PayPal payment: " + e.getMessage(),
                PaymentMethod.PAYPAL,
                e
            );
        }
    }
    
    @Override
    public boolean validatePaymentDetails(PaymentDetails paymentDetails) {
        if (paymentDetails == null) {
            return false;
        }
        
        String paypalEmail = paymentDetails.getPayPalEmail();
        return isValidEmail(paypalEmail);
    }
    
    @Override
    public PaymentMethod getSupportedPaymentMethod() {
        return PaymentMethod.PAYPAL;
    }
    
    @Override
    public boolean supportsCurrency(String currency) {
        return currency != null && SUPPORTED_CURRENCIES.contains(currency.toUpperCase());
    }
    
    @Override
    public BigDecimal getProcessingFee(BigDecimal amount, String currency) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal variableFee = amount.multiply(PAYPAL_FEE_PERCENTAGE);
        return variableFee.add(PAYPAL_FIXED_FEE).setScale(2, RoundingMode.HALF_UP);
    }
    
    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        // Basic email validation
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }
    
    private String generateTransactionId() {
        return "PP_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
    
    private PaymentResult simulatePayPalPayment(String transactionId, BigDecimal amount, 
                                              String currency, BigDecimal processingFee, 
                                              PaymentDetails paymentDetails) {
        
        String paypalEmail = paymentDetails.getPayPalEmail();
        
        // Simulate different outcomes for testing
        if (paypalEmail.contains("suspended")) {
            return PaymentResult.failure(
                PaymentException.ErrorCodes.PAYPAL_ACCOUNT_SUSPENDED,
                "PayPal account is suspended",
                PaymentMethod.PAYPAL
            );
        }
        
        if (paypalEmail.contains("insufficient")) {
            return PaymentResult.failure(
                PaymentException.ErrorCodes.INSUFFICIENT_FUNDS,
                "Insufficient funds in PayPal account",
                PaymentMethod.PAYPAL
            );
        }
        
        // Simulate successful payment
        return PaymentResult.success(transactionId, amount, currency, PaymentMethod.PAYPAL, processingFee);
    }
}

```
</details>

#### `PaymentDetails.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.factory;

import java.util.HashMap;
import java.util.Map;

/**
 * Payment details container that holds payment-specific information.
 * Different payment methods require different details.
 */
public class PaymentDetails {
    private final Map<String, String> details;
    
    public PaymentDetails() {
        this.details = new HashMap<>();
    }
    
    public PaymentDetails(Map<String, String> details) {
        this.details = new HashMap<>(details);
    }
    
    public void addDetail(String key, String value) {
        details.put(key, value);
    }
    
    public String getDetail(String key) {
        return details.get(key);
    }
    
    public boolean hasDetail(String key) {
        return details.containsKey(key) && details.get(key) != null;
    }
    
    public Map<String, String> getAllDetails() {
        return new HashMap<>(details);
    }
    
    // Convenience methods for common payment details
    
    // Credit/Debit Card details
    public void setCardNumber(String cardNumber) {
        addDetail("cardNumber", cardNumber);
    }
    
    public String getCardNumber() {
        return getDetail("cardNumber");
    }
    
    public void setExpiryDate(String expiryDate) {
        addDetail("expiryDate", expiryDate);
    }
    
    public String getExpiryDate() {
        return getDetail("expiryDate");
    }
    
    public void setCvv(String cvv) {
        addDetail("cvv", cvv);
    }
    
    public String getCvv() {
        return getDetail("cvv");
    }
    
    public void setCardHolderName(String cardHolderName) {
        addDetail("cardHolderName", cardHolderName);
    }
    
    public String getCardHolderName() {
        return getDetail("cardHolderName");
    }
    
    // PayPal details
    public void setPayPalEmail(String email) {
        addDetail("paypalEmail", email);
    }
    
    public String getPayPalEmail() {
        return getDetail("paypalEmail");
    }
    
    // Bank transfer details
    public void setAccountNumber(String accountNumber) {
        addDetail("accountNumber", accountNumber);
    }
    
    public String getAccountNumber() {
        return getDetail("accountNumber");
    }
    
    public void setRoutingNumber(String routingNumber) {
        addDetail("routingNumber", routingNumber);
    }
    
    public String getRoutingNumber() {
        return getDetail("routingNumber");
    }
    
    // Cryptocurrency details
    public void setWalletAddress(String walletAddress) {
        addDetail("walletAddress", walletAddress);
    }
    
    public String getWalletAddress() {
        return getDetail("walletAddress");
    }
    
    public void setCryptocurrencyType(String cryptoType) {
        addDetail("cryptoType", cryptoType);
    }
    
    public String getCryptocurrencyType() {
        return getDetail("cryptoType");
    }
    
    @Override
    public String toString() {
        // Don't expose sensitive details in toString
        Map<String, String> safeDetails = new HashMap<>();
        for (Map.Entry<String, String> entry : details.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            
            // Mask sensitive information
            if (key.equals("cardNumber") && value != null && value.length() > 4) {
                safeDetails.put(key, "**** **** **** " + value.substring(value.length() - 4));
            } else if (key.equals("cvv")) {
                safeDetails.put(key, "***");
            } else {
                safeDetails.put(key, value);
            }
        }
        
        return "PaymentDetails{" + "details=" + safeDetails + '}';
    }
}

```
</details>

#### `PaymentException.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.factory;

/**
 * Exception thrown when payment processing fails.
 * Provides specific error codes and messages for different failure scenarios.
 */
public class PaymentException extends Exception {
    private final String errorCode;
    private final PaymentMethod paymentMethod;
    
    public PaymentException(String errorCode, String message, PaymentMethod paymentMethod) {
        super(message);
        this.errorCode = errorCode;
        this.paymentMethod = paymentMethod;
    }
    
    public PaymentException(String errorCode, String message, PaymentMethod paymentMethod, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.paymentMethod = paymentMethod;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }
    
    // Common error codes
    public static class ErrorCodes {
        public static final String INVALID_CARD_NUMBER = "INVALID_CARD_NUMBER";
        public static final String EXPIRED_CARD = "EXPIRED_CARD";
        public static final String INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS";
        public static final String INVALID_CVV = "INVALID_CVV";
        public static final String CARD_DECLINED = "CARD_DECLINED";
        public static final String INVALID_PAYPAL_EMAIL = "INVALID_PAYPAL_EMAIL";
        public static final String PAYPAL_ACCOUNT_SUSPENDED = "PAYPAL_ACCOUNT_SUSPENDED";
        public static final String INVALID_BANK_ACCOUNT = "INVALID_BANK_ACCOUNT";
        public static final String NETWORK_ERROR = "NETWORK_ERROR";
        public static final String PROCESSING_ERROR = "PROCESSING_ERROR";
        public static final String UNSUPPORTED_CURRENCY = "UNSUPPORTED_CURRENCY";
        public static final String AMOUNT_TOO_SMALL = "AMOUNT_TOO_SMALL";
        public static final String AMOUNT_TOO_LARGE = "AMOUNT_TOO_LARGE";
    }
}

```
</details>

#### `PaymentMethod.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.factory;

/**
 * Enum representing different payment methods supported by the system.
 * Used by the Factory pattern to determine which PaymentProcessor to create.
 */
public enum PaymentMethod {
    CREDIT_CARD("Credit Card", "CC"),
    DEBIT_CARD("Debit Card", "DC"),
    PAYPAL("PayPal", "PP"),
    APPLE_PAY("Apple Pay", "AP"),
    GOOGLE_PAY("Google Pay", "GP"),
    BANK_TRANSFER("Bank Transfer", "BT"),
    CRYPTOCURRENCY("Cryptocurrency", "CR");
    
    private final String displayName;
    private final String code;
    
    PaymentMethod(String displayName, String code) {
        this.displayName = displayName;
        this.code = code;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public String getCode() {
        return code;
    }
    
    /**
     * Get PaymentMethod from code.
     * 
     * @param code The payment method code
     * @return PaymentMethod or null if not found
     */
    public static PaymentMethod fromCode(String code) {
        for (PaymentMethod method : values()) {
            if (method.code.equals(code)) {
                return method;
            }
        }
        return null;
    }
}

```
</details>

#### `PaymentProcessor.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.factory;

import java.math.BigDecimal;

/**
 * Payment processor interface demonstrating the Factory pattern.
 * 
 * This interface defines the contract that all payment processors must implement.
 * Different implementations handle different payment methods (Credit Card, PayPal, etc.)
 */
public interface PaymentProcessor {
    
    /**
     * Process a payment transaction.
     * 
     * @param amount The amount to charge
     * @param currency The currency code (USD, EUR, etc.)
     * @param paymentDetails Payment-specific details (card number, PayPal email, etc.)
     * @return PaymentResult indicating success or failure
     * @throws PaymentException if payment processing fails
     */
    PaymentResult processPayment(BigDecimal amount, String currency, PaymentDetails paymentDetails) throws PaymentException;
    
    /**
     * Validate payment details before processing.
     * 
     * @param paymentDetails The payment details to validate
     * @return true if valid, false otherwise
     */
    boolean validatePaymentDetails(PaymentDetails paymentDetails);
    
    /**
     * Get the supported payment method for this processor.
     * 
     * @return The payment method this processor handles
     */
    PaymentMethod getSupportedPaymentMethod();
    
    /**
     * Check if this processor supports the given currency.
     * 
     * @param currency The currency code to check
     * @return true if supported, false otherwise
     */
    boolean supportsCurrency(String currency);
    
    /**
     * Get the processing fee for a given amount.
     * 
     * @param amount The transaction amount
     * @param currency The currency code
     * @return The processing fee
     */
    BigDecimal getProcessingFee(BigDecimal amount, String currency);
}

```
</details>

#### `PaymentProcessorConfig.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.factory;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Configuration class for payment processors.
 * Contains settings that can be used to customize processor behavior.
 */
public class PaymentProcessorConfig {
    private final Map<String, Object> properties;
    
    public PaymentProcessorConfig() {
        this.properties = new HashMap<>();
    }
    
    public PaymentProcessorConfig(Map<String, Object> properties) {
        this.properties = new HashMap<>(properties);
    }
    
    // Generic property methods
    public void setProperty(String key, Object value) {
        properties.put(key, value);
    }
    
    public Object getProperty(String key) {
        return properties.get(key);
    }
    
    public <T> T getProperty(String key, Class<T> type) {
        Object value = properties.get(key);
        if (value != null && type.isInstance(value)) {
            return type.cast(value);
        }
        return null;
    }
    
    public boolean hasProperty(String key) {
        return properties.containsKey(key);
    }
    
    // Common configuration properties
    
    // API credentials
    public void setApiKey(String apiKey) {
        setProperty("apiKey", apiKey);
    }
    
    public String getApiKey() {
        return getProperty("apiKey", String.class);
    }
    
    public void setSecretKey(String secretKey) {
        setProperty("secretKey", secretKey);
    }
    
    public String getSecretKey() {
        return getProperty("secretKey", String.class);
    }
    
    // Environment settings
    public void setSandboxMode(boolean sandboxMode) {
        setProperty("sandboxMode", sandboxMode);
    }
    
    public boolean isSandboxMode() {
        Boolean value = getProperty("sandboxMode", Boolean.class);
        return value != null ? value : false;
    }
    
    // Timeout settings
    public void setConnectionTimeout(int timeoutMs) {
        setProperty("connectionTimeout", timeoutMs);
    }
    
    public int getConnectionTimeout() {
        Integer value = getProperty("connectionTimeout", Integer.class);
        return value != null ? value : 30000; // Default 30 seconds
    }
    
    public void setReadTimeout(int timeoutMs) {
        setProperty("readTimeout", timeoutMs);
    }
    
    public int getReadTimeout() {
        Integer value = getProperty("readTimeout", Integer.class);
        return value != null ? value : 60000; // Default 60 seconds
    }
    
    // Fee settings
    public void setProcessingFeePercentage(BigDecimal feePercentage) {
        setProperty("processingFeePercentage", feePercentage);
    }
    
    public BigDecimal getProcessingFeePercentage() {
        return getProperty("processingFeePercentage", BigDecimal.class);
    }
    
    public void setFixedProcessingFee(BigDecimal fixedFee) {
        setProperty("fixedProcessingFee", fixedFee);
    }
    
    public BigDecimal getFixedProcessingFee() {
        return getProperty("fixedProcessingFee", BigDecimal.class);
    }
    
    // Retry settings
    public void setMaxRetries(int maxRetries) {
        setProperty("maxRetries", maxRetries);
    }
    
    public int getMaxRetries() {
        Integer value = getProperty("maxRetries", Integer.class);
        return value != null ? value : 3;
    }
    
    public void setRetryDelayMs(int retryDelayMs) {
        setProperty("retryDelayMs", retryDelayMs);
    }
    
    public int getRetryDelayMs() {
        Integer value = getProperty("retryDelayMs", Integer.class);
        return value != null ? value : 1000; // Default 1 second
    }
    
    // Webhook settings
    public void setWebhookUrl(String webhookUrl) {
        setProperty("webhookUrl", webhookUrl);
    }
    
    public String getWebhookUrl() {
        return getProperty("webhookUrl", String.class);
    }
    
    public void setWebhookSecret(String webhookSecret) {
        setProperty("webhookSecret", webhookSecret);
    }
    
    public String getWebhookSecret() {
        return getProperty("webhookSecret", String.class);
    }
    
    @Override
    public String toString() {
        // Don't expose sensitive information
        Map<String, Object> safeProperties = new HashMap<>();
        for (Map.Entry<String, Object> entry : properties.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            
            if (key.toLowerCase().contains("secret") || key.toLowerCase().contains("key")) {
                safeProperties.put(key, "***");
            } else {
                safeProperties.put(key, value);
            }
        }
        
        return "PaymentProcessorConfig{" + "properties=" + safeProperties + '}';
    }
}

```
</details>

#### `PaymentProcessorFactory.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.factory;

import java.util.HashMap;
import java.util.Map;

/**
 * Factory class for creating PaymentProcessor instances.
 * 
 * This demonstrates the Factory pattern by:
 * - Encapsulating object creation logic
 * - Supporting multiple payment processor types
 * - Providing a single point of configuration
 * - Enabling easy addition of new payment methods
 */
public class PaymentProcessorFactory {
    
    // Registry of payment processors
    private static final Map<PaymentMethod, Class<? extends PaymentProcessor>> processorRegistry = new HashMap<>();
    
    // Static initialization of supported processors
    static {
        processorRegistry.put(PaymentMethod.CREDIT_CARD, CreditCardProcessor.class);
        processorRegistry.put(PaymentMethod.DEBIT_CARD, DebitCardProcessor.class);
        processorRegistry.put(PaymentMethod.PAYPAL, PayPalProcessor.class);
        processorRegistry.put(PaymentMethod.BANK_TRANSFER, BankTransferProcessor.class);
        // Add more processors as needed
    }
    
    /**
     * Create a payment processor for the specified payment method.
     * 
     * @param paymentMethod The payment method to create a processor for
     * @return PaymentProcessor instance
     * @throws IllegalArgumentException if payment method is not supported
     */
    public static PaymentProcessor createProcessor(PaymentMethod paymentMethod) {
        if (paymentMethod == null) {
            throw new IllegalArgumentException("Payment method cannot be null");
        }
        
        Class<? extends PaymentProcessor> processorClass = processorRegistry.get(paymentMethod);
        if (processorClass == null) {
            throw new IllegalArgumentException("Unsupported payment method: " + paymentMethod);
        }
        
        try {
            return processorClass.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create payment processor for " + paymentMethod, e);
        }
    }
    
    /**
     * Create a payment processor with configuration.
     * This method demonstrates how factories can handle configuration.
     * 
     * @param paymentMethod The payment method
     * @param config Configuration parameters
     * @return Configured PaymentProcessor instance
     */
    public static PaymentProcessor createProcessor(PaymentMethod paymentMethod, PaymentProcessorConfig config) {
        PaymentProcessor processor = createProcessor(paymentMethod);
        
        // Configure the processor if it supports configuration
        if (processor instanceof ConfigurablePaymentProcessor) {
            ((ConfigurablePaymentProcessor) processor).configure(config);
        }
        
        return processor;
    }
    
    /**
     * Register a new payment processor type.
     * This allows for runtime extension of supported payment methods.
     * 
     * @param paymentMethod The payment method
     * @param processorClass The processor class
     */
    public static void registerProcessor(PaymentMethod paymentMethod, 
                                       Class<? extends PaymentProcessor> processorClass) {
        if (paymentMethod == null || processorClass == null) {
            throw new IllegalArgumentException("Payment method and processor class cannot be null");
        }
        
        processorRegistry.put(paymentMethod, processorClass);
    }
    
    /**
     * Check if a payment method is supported.
     * 
     * @param paymentMethod The payment method to check
     * @return true if supported, false otherwise
     */
    public static boolean isSupported(PaymentMethod paymentMethod) {
        return paymentMethod != null && processorRegistry.containsKey(paymentMethod);
    }
    
    /**
     * Get all supported payment methods.
     * 
     * @return Array of supported payment methods
     */
    public static PaymentMethod[] getSupportedPaymentMethods() {
        return processorRegistry.keySet().toArray(new PaymentMethod[0]);
    }
    
    /**
     * Factory method that automatically selects the best processor based on criteria.
     * This demonstrates intelligent factory selection.
     * 
     * @param amount The transaction amount
     * @param currency The currency
     * @param availableMethods Available payment methods for the user
     * @return Recommended PaymentProcessor
     */
    public static PaymentProcessor createOptimalProcessor(java.math.BigDecimal amount, 
                                                         String currency, 
                                                         PaymentMethod... availableMethods) {
        if (availableMethods == null || availableMethods.length == 0) {
            throw new IllegalArgumentException("At least one payment method must be available");
        }
        
        // Simple selection logic - in real world, this would be more sophisticated
        // considering factors like fees, processing time, success rates, etc.
        
        // For small amounts, prefer digital wallets
        if (amount.compareTo(java.math.BigDecimal.valueOf(50)) < 0) {
            for (PaymentMethod method : availableMethods) {
                if (method == PaymentMethod.APPLE_PAY || method == PaymentMethod.GOOGLE_PAY) {
                    if (isSupported(method)) {
                        return createProcessor(method);
                    }
                }
            }
        }
        
        // For larger amounts, prefer credit cards
        if (amount.compareTo(java.math.BigDecimal.valueOf(1000)) > 0) {
            for (PaymentMethod method : availableMethods) {
                if (method == PaymentMethod.CREDIT_CARD) {
                    return createProcessor(method);
                }
            }
        }
        
        // Default to first available supported method
        for (PaymentMethod method : availableMethods) {
            if (isSupported(method)) {
                return createProcessor(method);
            }
        }
        
        throw new IllegalArgumentException("No supported payment methods available");
    }
}

```
</details>

#### `PaymentResult.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.factory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Result of a payment processing operation.
 * Contains information about the success/failure and transaction details.
 */
public class PaymentResult {
    private final boolean success;
    private final String transactionId;
    private final String message;
    private final BigDecimal amount;
    private final String currency;
    private final PaymentMethod paymentMethod;
    private final LocalDateTime timestamp;
    private final String errorCode;
    private final BigDecimal processingFee;
    
    private PaymentResult(Builder builder) {
        this.success = builder.success;
        this.transactionId = builder.transactionId;
        this.message = builder.message;
        this.amount = builder.amount;
        this.currency = builder.currency;
        this.paymentMethod = builder.paymentMethod;
        this.timestamp = builder.timestamp != null ? builder.timestamp : LocalDateTime.now();
        this.errorCode = builder.errorCode;
        this.processingFee = builder.processingFee;
    }
    
    // Static factory methods for common scenarios
    public static PaymentResult success(String transactionId, BigDecimal amount, String currency, 
                                       PaymentMethod paymentMethod, BigDecimal processingFee) {
        return new Builder()
                .success(true)
                .transactionId(transactionId)
                .amount(amount)
                .currency(currency)
                .paymentMethod(paymentMethod)
                .processingFee(processingFee)
                .message("Payment processed successfully")
                .build();
    }
    
    public static PaymentResult failure(String errorCode, String message, PaymentMethod paymentMethod) {
        return new Builder()
                .success(false)
                .errorCode(errorCode)
                .message(message)
                .paymentMethod(paymentMethod)
                .build();
    }
    
    // Getters
    public boolean isSuccess() { return success; }
    public String getTransactionId() { return transactionId; }
    public String getMessage() { return message; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getErrorCode() { return errorCode; }
    public BigDecimal getProcessingFee() { return processingFee; }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private boolean success;
        private String transactionId;
        private String message;
        private BigDecimal amount;
        private String currency;
        private PaymentMethod paymentMethod;
        private LocalDateTime timestamp;
        private String errorCode;
        private BigDecimal processingFee;
        
        public Builder success(boolean success) {
            this.success = success;
            return this;
        }
        
        public Builder transactionId(String transactionId) {
            this.transactionId = transactionId;
            return this;
        }
        
        public Builder message(String message) {
            this.message = message;
            return this;
        }
        
        public Builder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }
        
        public Builder currency(String currency) {
            this.currency = currency;
            return this;
        }
        
        public Builder paymentMethod(PaymentMethod paymentMethod) {
            this.paymentMethod = paymentMethod;
            return this;
        }
        
        public Builder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }
        
        public Builder errorCode(String errorCode) {
            this.errorCode = errorCode;
            return this;
        }
        
        public Builder processingFee(BigDecimal processingFee) {
            this.processingFee = processingFee;
            return this;
        }
        
        public PaymentResult build() {
            return new PaymentResult(this);
        }
    }
    
    @Override
    public String toString() {
        return "PaymentResult{" +
               "success=" + success +
               ", transactionId='" + transactionId + '\'' +
               ", message='" + message + '\'' +
               ", amount=" + amount +
               ", currency='" + currency + '\'' +
               ", paymentMethod=" + paymentMethod +
               ", timestamp=" + timestamp +
               ", errorCode='" + errorCode + '\'' +
               ", processingFee=" + processingFee +
               '}';
    }
}

```
</details>

### prototype

#### `CharacterRegistry.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.prototype;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Character registry implementing the Prototype pattern.
 * 
 * This class demonstrates:
 * - Prototype registry for managing templates
 * - Cloning performance benefits
 * - Template management and customization
 * - Factory-like interface using prototypes
 */
public class CharacterRegistry {
    
    private final Map<String, GameCharacter> prototypes;
    
    public CharacterRegistry() {
        this.prototypes = new HashMap<>();
        initializeDefaultPrototypes();
    }
    
    /**
     * Initialize the registry with default character prototypes.
     * This simulates expensive character creation that we want to avoid repeating.
     */
    private void initializeDefaultPrototypes() {
        // Create base prototypes - this is expensive initialization
        Warrior basicWarrior = new Warrior("Template Warrior");
        basicWarrior.levelUpTo(5); // Pre-level for better starting point
        basicWarrior.getEquipment().setWeapon("Steel Sword");
        basicWarrior.getEquipment().setArmor("Plate Mail");
        
        Mage basicMage = new Mage("Template Mage");
        basicMage.levelUpTo(5);
        basicMage.getEquipment().setWeapon("Crystal Staff");
        basicMage.getEquipment().addAccessory("Mana Crystal");
        
        // Register prototypes
        registerPrototype("warrior", basicWarrior);
        registerPrototype("mage", basicMage);
        
        // Create specialized variants
        Warrior berserker = basicWarrior.createBerserkerVariant("Template Berserker");
        berserker.levelUpTo(7);
        registerPrototype("berserker", berserker);
        
        Mage fireMage = basicMage.createElementalSpecialist("Template Fire Mage", "fire");
        fireMage.levelUpTo(6);
        registerPrototype("fire_mage", fireMage);
        
        Mage iceMage = basicMage.createElementalSpecialist("Template Ice Mage", "ice");
        iceMage.levelUpTo(6);
        registerPrototype("ice_mage", iceMage);
        
        // Create high-level templates for advanced players
        Warrior eliteWarrior = (Warrior) basicWarrior.clone();
        eliteWarrior.setName("Elite Warrior Template");
        eliteWarrior.levelUpTo(20);
        eliteWarrior.getEquipment().setWeapon("Legendary Sword");
        eliteWarrior.getEquipment().setArmor("Dragon Scale Mail");
        eliteWarrior.addSkill(new GameCharacter.Skill("Dragon Slayer", "Bonus damage vs dragons", 1));
        registerPrototype("elite_warrior", eliteWarrior);
        
        Mage archmage = (Mage) basicMage.clone();
        archmage.setName("Archmage Template");
        archmage.levelUpTo(25);
        archmage.getEquipment().setWeapon("Staff of Power");
        archmage.addSkill(new GameCharacter.Skill("Time Stop", "Freezes time briefly", 1));
        archmage.addSkill(new GameCharacter.Skill("Teleport", "Instantly move to location", 3));
        registerPrototype("archmage", archmage);
    }
    
    /**
     * Register a new prototype in the registry.
     * 
     * @param key The key to identify the prototype
     * @param prototype The prototype character to register
     */
    public void registerPrototype(String key, GameCharacter prototype) {
        if (key == null || prototype == null) {
            throw new IllegalArgumentException("Key and prototype cannot be null");
        }
        prototypes.put(key.toLowerCase(), prototype);
    }
    
    /**
     * Create a new character by cloning a registered prototype.
     * 
     * @param prototypeKey The key of the prototype to clone
     * @param characterName The name for the new character
     * @return Cloned and customized character
     * @throws IllegalArgumentException if prototype key is not found
     */
    public GameCharacter createCharacter(String prototypeKey, String characterName) {
        if (prototypeKey == null || characterName == null) {
            throw new IllegalArgumentException("Prototype key and character name cannot be null");
        }
        
        GameCharacter prototype = prototypes.get(prototypeKey.toLowerCase());
        if (prototype == null) {
            throw new IllegalArgumentException("Prototype not found: " + prototypeKey);
        }
        
        GameCharacter newCharacter = prototype.clone();
        newCharacter.setName(characterName);
        return newCharacter;
    }
    
    /**
     * Create a character with additional customization.
     * 
     * @param prototypeKey The key of the prototype to clone
     * @param characterName The name for the new character
     * @param targetLevel The level to set the character to
     * @return Cloned and customized character
     */
    public GameCharacter createCharacter(String prototypeKey, String characterName, int targetLevel) {
        GameCharacter character = createCharacter(prototypeKey, characterName);
        character.levelUpTo(targetLevel);
        return character;
    }
    
    /**
     * Create multiple characters from the same prototype.
     * Demonstrates the performance benefit of cloning vs. creating from scratch.
     * 
     * @param prototypeKey The prototype to use
     * @param names Array of names for the characters
     * @return Array of cloned characters
     */
    public GameCharacter[] createMultipleCharacters(String prototypeKey, String... names) {
        if (names == null || names.length == 0) {
            return new GameCharacter[0];
        }
        
        GameCharacter[] characters = new GameCharacter[names.length];
        for (int i = 0; i < names.length; i++) {
            characters[i] = createCharacter(prototypeKey, names[i]);
        }
        
        return characters;
    }
    
    /**
     * Get a list of all available prototype keys.
     * 
     * @return Set of prototype keys
     */
    public Set<String> getAvailablePrototypes() {
        return prototypes.keySet();
    }
    
    /**
     * Check if a prototype exists in the registry.
     * 
     * @param prototypeKey The key to check
     * @return true if prototype exists, false otherwise
     */
    public boolean hasPrototype(String prototypeKey) {
        return prototypeKey != null && prototypes.containsKey(prototypeKey.toLowerCase());
    }
    
    /**
     * Get a copy of a prototype for inspection (without creating a character).
     * 
     * @param prototypeKey The prototype key
     * @return Copy of the prototype, or null if not found
     */
    public GameCharacter getPrototypeCopy(String prototypeKey) {
        if (!hasPrototype(prototypeKey)) {
            return null;
        }
        
        return prototypes.get(prototypeKey.toLowerCase()).clone();
    }
    
    /**
     * Remove a prototype from the registry.
     * 
     * @param prototypeKey The key of the prototype to remove
     * @return true if removed, false if not found
     */
    public boolean removePrototype(String prototypeKey) {
        if (prototypeKey == null) {
            return false;
        }
        
        return prototypes.remove(prototypeKey.toLowerCase()) != null;
    }
    
    /**
     * Clear all prototypes from the registry.
     */
    public void clearPrototypes() {
        prototypes.clear();
    }
    
    /**
     * Get the number of registered prototypes.
     * 
     * @return Number of prototypes
     */
    public int getPrototypeCount() {
        return prototypes.size();
    }
    
    /**
     * Demonstrate performance comparison between cloning and creating from scratch.
     * This method shows why the Prototype pattern is useful for expensive object creation.
     */
    public void demonstratePerformance() {
        System.out.println("=== Prototype Pattern Performance Demo ===");
        
        int iterations = 1000;
        
        // Measure cloning performance
        long startTime = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            createCharacter("elite_warrior", "Clone" + i);
        }
        long cloneTime = System.nanoTime() - startTime;
        
        // Measure creation from scratch performance
        startTime = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            Warrior warrior = new Warrior("Fresh" + i);
            warrior.levelUpTo(20);
            warrior.getEquipment().setWeapon("Legendary Sword");
            warrior.getEquipment().setArmor("Dragon Scale Mail");
            warrior.addSkill(new GameCharacter.Skill("Dragon Slayer", "Bonus damage vs dragons", 1));
        }
        long createTime = System.nanoTime() - startTime;
        
        System.out.printf("Cloning %d characters: %.2f ms%n", iterations, cloneTime / 1_000_000.0);
        System.out.printf("Creating %d characters from scratch: %.2f ms%n", iterations, createTime / 1_000_000.0);
        System.out.printf("Cloning is %.1fx faster%n", (double) createTime / cloneTime);
    }
}

```
</details>

#### `GameCharacter.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.prototype;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Game character demonstrating the Prototype pattern.
 * 
 * This example shows:
 * - Deep cloning of complex objects
 * - Prototype registry for character templates
 * - Customization after cloning
 * - Performance benefits of cloning vs. creation
 */
public abstract class GameCharacter implements Cloneable {
    
    protected String name;
    protected int level;
    protected int health;
    protected int mana;
    protected int experience;
    protected CharacterClass characterClass;
    
    // Complex nested objects that need deep cloning
    protected Stats stats;
    protected Equipment equipment;
    protected List<Skill> skills;
    protected Map<String, Object> attributes;
    
    protected GameCharacter(String name, CharacterClass characterClass) {
        this.name = name;
        this.characterClass = characterClass;
        this.level = 1;
        this.experience = 0;
        this.stats = new Stats();
        this.equipment = new Equipment();
        this.skills = new ArrayList<>();
        this.attributes = new HashMap<>();
        
        initializeDefaults();
    }
    
    /**
     * Initialize character with class-specific defaults.
     * This is called during construction and represents expensive initialization.
     */
    protected abstract void initializeDefaults();
    
    /**
     * Clone this character to create a new instance.
     * Implements deep cloning for all complex objects.
     */
    @Override
    public GameCharacter clone() {
        try {
            GameCharacter cloned = (GameCharacter) super.clone();
            
            // Deep clone complex objects
            cloned.stats = this.stats.clone();
            cloned.equipment = this.equipment.clone();
            cloned.skills = new ArrayList<>();
            for (Skill skill : this.skills) {
                cloned.skills.add(skill.clone());
            }
            cloned.attributes = new HashMap<>(this.attributes);
            
            return cloned;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException("Clone not supported", e);
        }
    }
    
    /**
     * Create a customized copy of this character.
     * This method demonstrates how prototypes can be customized after cloning.
     */
    public GameCharacter createCustomizedCopy(String newName, int targetLevel) {
        GameCharacter copy = this.clone();
        copy.setName(newName);
        copy.levelUpTo(targetLevel);
        return copy;
    }
    
    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public int getLevel() { return level; }
    public int getHealth() { return health; }
    public int getMana() { return mana; }
    public int getExperience() { return experience; }
    public CharacterClass getCharacterClass() { return characterClass; }
    
    public Stats getStats() { return stats; }
    public Equipment getEquipment() { return equipment; }
    public List<Skill> getSkills() { return new ArrayList<>(skills); }
    
    public void addSkill(Skill skill) {
        if (skill != null && !skills.contains(skill)) {
            skills.add(skill);
        }
    }
    
    public void setAttribute(String key, Object value) {
        attributes.put(key, value);
    }
    
    public Object getAttribute(String key) {
        return attributes.get(key);
    }
    
    /**
     * Level up the character to the target level.
     * This demonstrates how cloned objects can be modified.
     */
    public void levelUpTo(int targetLevel) {
        if (targetLevel <= this.level) {
            return;
        }
        
        int levelsToGain = targetLevel - this.level;
        for (int i = 0; i < levelsToGain; i++) {
            levelUp();
        }
    }
    
    protected void levelUp() {
        this.level++;
        this.health += getHealthPerLevel();
        this.mana += getManaPerLevel();
        this.stats.increaseForLevelUp(characterClass);
    }
    
    protected abstract int getHealthPerLevel();
    protected abstract int getManaPerLevel();
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        GameCharacter that = (GameCharacter) obj;
        return level == that.level &&
               health == that.health &&
               mana == that.mana &&
               experience == that.experience &&
               Objects.equals(name, that.name) &&
               characterClass == that.characterClass &&
               Objects.equals(stats, that.stats) &&
               Objects.equals(equipment, that.equipment) &&
               Objects.equals(skills, that.skills);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name, level, health, mana, experience, characterClass, stats, equipment, skills);
    }
    
    @Override
    public String toString() {
        return String.format("%s (Level %d %s) - HP: %d, MP: %d, XP: %d", 
                           name, level, characterClass, health, mana, experience);
    }
    
    // Enums and nested classes
    
    public enum CharacterClass {
        WARRIOR, MAGE, ARCHER, ROGUE, PALADIN, NECROMANCER
    }
    
    /**
     * Character stats that need deep cloning.
     */
    public static class Stats implements Cloneable {
        private int strength;
        private int intelligence;
        private int dexterity;
        private int constitution;
        private int wisdom;
        private int charisma;
        
        public Stats() {
            this.strength = 10;
            this.intelligence = 10;
            this.dexterity = 10;
            this.constitution = 10;
            this.wisdom = 10;
            this.charisma = 10;
        }
        
        public Stats(int str, int intel, int dex, int con, int wis, int cha) {
            this.strength = str;
            this.intelligence = intel;
            this.dexterity = dex;
            this.constitution = con;
            this.wisdom = wis;
            this.charisma = cha;
        }
        
        @Override
        public Stats clone() {
            try {
                return (Stats) super.clone();
            } catch (CloneNotSupportedException e) {
                return new Stats(strength, intelligence, dexterity, constitution, wisdom, charisma);
            }
        }
        
        public void increaseForLevelUp(CharacterClass characterClass) {
            switch (characterClass) {
                case WARRIOR:
                    strength += 2;
                    constitution += 1;
                    break;
                case MAGE:
                    intelligence += 2;
                    wisdom += 1;
                    break;
                case ARCHER:
                    dexterity += 2;
                    constitution += 1;
                    break;
                case ROGUE:
                    dexterity += 1;
                    intelligence += 1;
                    charisma += 1;
                    break;
                case PALADIN:
                    strength += 1;
                    wisdom += 1;
                    charisma += 1;
                    break;
                case NECROMANCER:
                    intelligence += 1;
                    wisdom += 2;
                    break;
            }
        }
        
        // Getters
        public int getStrength() { return strength; }
        public int getIntelligence() { return intelligence; }
        public int getDexterity() { return dexterity; }
        public int getConstitution() { return constitution; }
        public int getWisdom() { return wisdom; }
        public int getCharisma() { return charisma; }
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            Stats stats = (Stats) obj;
            return strength == stats.strength &&
                   intelligence == stats.intelligence &&
                   dexterity == stats.dexterity &&
                   constitution == stats.constitution &&
                   wisdom == stats.wisdom &&
                   charisma == stats.charisma;
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(strength, intelligence, dexterity, constitution, wisdom, charisma);
        }
    }
    
    /**
     * Equipment that needs deep cloning.
     */
    public static class Equipment implements Cloneable {
        private String weapon;
        private String armor;
        private String helmet;
        private String boots;
        private List<String> accessories;
        
        public Equipment() {
            this.accessories = new ArrayList<>();
        }
        
        @Override
        public Equipment clone() {
            try {
                Equipment cloned = (Equipment) super.clone();
                cloned.accessories = new ArrayList<>(this.accessories);
                return cloned;
            } catch (CloneNotSupportedException e) {
                throw new RuntimeException("Clone not supported", e);
            }
        }
        
        // Getters and setters
        public String getWeapon() { return weapon; }
        public void setWeapon(String weapon) { this.weapon = weapon; }
        
        public String getArmor() { return armor; }
        public void setArmor(String armor) { this.armor = armor; }
        
        public String getHelmet() { return helmet; }
        public void setHelmet(String helmet) { this.helmet = helmet; }
        
        public String getBoots() { return boots; }
        public void setBoots(String boots) { this.boots = boots; }
        
        public List<String> getAccessories() { return new ArrayList<>(accessories); }
        public void addAccessory(String accessory) { accessories.add(accessory); }
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            Equipment equipment = (Equipment) obj;
            return Objects.equals(weapon, equipment.weapon) &&
                   Objects.equals(armor, equipment.armor) &&
                   Objects.equals(helmet, equipment.helmet) &&
                   Objects.equals(boots, equipment.boots) &&
                   Objects.equals(accessories, equipment.accessories);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(weapon, armor, helmet, boots, accessories);
        }
    }
    
    /**
     * Skill that needs cloning.
     */
    public static class Skill implements Cloneable {
        private final String name;
        private final String description;
        private int level;
        private int maxLevel;
        
        public Skill(String name, String description, int maxLevel) {
            this.name = name;
            this.description = description;
            this.level = 1;
            this.maxLevel = maxLevel;
        }
        
        @Override
        public Skill clone() {
            try {
                return (Skill) super.clone();
            } catch (CloneNotSupportedException e) {
                Skill cloned = new Skill(name, description, maxLevel);
                cloned.level = this.level;
                return cloned;
            }
        }
        
        public String getName() { return name; }
        public String getDescription() { return description; }
        public int getLevel() { return level; }
        public int getMaxLevel() { return maxLevel; }
        
        public void levelUp() {
            if (level < maxLevel) {
                level++;
            }
        }
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            Skill skill = (Skill) obj;
            return Objects.equals(name, skill.name);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(name);
        }
        
        @Override
        public String toString() {
            return String.format("%s (Level %d/%d)", name, level, maxLevel);
        }
    }
}

```
</details>

#### `Mage.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.prototype;

/**
 * Mage character implementation.
 * Demonstrates different initialization compared to Warrior.
 */
public class Mage extends GameCharacter {
    
    public Mage(String name) {
        super(name, CharacterClass.MAGE);
    }
    
    @Override
    protected void initializeDefaults() {
        // Mages start with high mana and intelligence
        this.health = 60;
        this.mana = 150;
        
        // Set mage-specific stats
        this.stats = new Stats(8, 16, 10, 9, 15, 12); // High INT and WIS
        
        // Default mage equipment
        this.equipment.setWeapon("Wooden Staff");
        this.equipment.setArmor("Robes");
        this.equipment.setHelmet("Wizard Hat");
        this.equipment.setBoots("Cloth Shoes");
        this.equipment.addAccessory("Spell Component Pouch");
        
        // Default mage skills
        addSkill(new Skill("Fireball", "Launches a ball of fire", 10));
        addSkill(new Skill("Ice Shard", "Shoots sharp ice projectiles", 8));
        addSkill(new Skill("Heal", "Restores health to target", 5));
        addSkill(new Skill("Mana Shield", "Absorbs damage using mana", 3));
        
        // Mage-specific attributes
        setAttribute("combatStyle", "Ranged Magic");
        setAttribute("primaryWeapon", "Staff");
        setAttribute("armorProficiency", "Light");
        setAttribute("spellSchool", "Evocation");
    }
    
    @Override
    protected int getHealthPerLevel() {
        return 3; // Mages gain less health per level
    }
    
    @Override
    protected int getManaPerLevel() {
        return 8; // Mages gain more mana per level
    }
    
    /**
     * Mage-specific method for creating an elemental specialist variant.
     */
    public Mage createElementalSpecialist(String name, String element) {
        Mage specialist = (Mage) this.clone();
        specialist.setName(name);
        
        // Customize based on element
        switch (element.toLowerCase()) {
            case "fire":
                specialist.equipment.setWeapon("Flame Staff");
                specialist.addSkill(new Skill("Meteor", "Summons a meteor", 5));
                specialist.addSkill(new Skill("Fire Wall", "Creates a wall of fire", 3));
                specialist.setAttribute("spellSchool", "Pyromancy");
                break;
                
            case "ice":
                specialist.equipment.setWeapon("Frost Staff");
                specialist.addSkill(new Skill("Blizzard", "Creates an ice storm", 5));
                specialist.addSkill(new Skill("Freeze", "Freezes target in place", 3));
                specialist.setAttribute("spellSchool", "Cryomancy");
                break;
                
            case "lightning":
                specialist.equipment.setWeapon("Storm Staff");
                specialist.addSkill(new Skill("Lightning Bolt", "Strikes with lightning", 5));
                specialist.addSkill(new Skill("Chain Lightning", "Lightning jumps between targets", 3));
                specialist.setAttribute("spellSchool", "Electromancy");
                break;
                
            default:
                specialist.setAttribute("spellSchool", "Generalist");
        }
        
        return specialist;
    }
}

```
</details>

#### `Warrior.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6.prototype;

/**
 * Warrior character implementation.
 * Demonstrates concrete prototype with specific initialization.
 */
public class Warrior extends GameCharacter {
    
    public Warrior(String name) {
        super(name, CharacterClass.WARRIOR);
    }
    
    @Override
    protected void initializeDefaults() {
        // Warriors start with high health and strength
        this.health = 120;
        this.mana = 20;
        
        // Set warrior-specific stats
        this.stats = new Stats(16, 8, 12, 15, 10, 9); // High STR and CON
        
        // Default warrior equipment
        this.equipment.setWeapon("Iron Sword");
        this.equipment.setArmor("Chain Mail");
        this.equipment.setHelmet("Iron Helmet");
        this.equipment.setBoots("Leather Boots");
        
        // Default warrior skills
        addSkill(new Skill("Sword Mastery", "Increases damage with swords", 10));
        addSkill(new Skill("Shield Block", "Blocks incoming attacks", 5));
        addSkill(new Skill("Berserker Rage", "Increases attack speed and damage", 3));
        
        // Warrior-specific attributes
        setAttribute("combatStyle", "Melee");
        setAttribute("primaryWeapon", "Sword");
        setAttribute("armorProficiency", "Heavy");
    }
    
    @Override
    protected int getHealthPerLevel() {
        return 8; // Warriors gain more health per level
    }
    
    @Override
    protected int getManaPerLevel() {
        return 1; // Warriors gain little mana per level
    }
    
    /**
     * Warrior-specific method for creating a berserker variant.
     */
    public Warrior createBerserkerVariant(String name) {
        Warrior berserker = (Warrior) this.clone();
        berserker.setName(name);
        
        // Modify for berserker style
        berserker.stats = new Stats(18, 6, 14, 17, 8, 7); // Higher STR, lower INT/WIS
        berserker.equipment.setWeapon("Two-Handed Axe");
        berserker.equipment.setArmor("Studded Leather"); // Lighter armor for speed
        
        // Add berserker-specific skills
        berserker.addSkill(new Skill("Dual Wield", "Wield two weapons", 5));
        berserker.addSkill(new Skill("Bloodlust", "Gain health from kills", 3));
        
        berserker.setAttribute("combatStyle", "Berserker");
        berserker.setAttribute("primaryWeapon", "Axe");
        berserker.setAttribute("armorProficiency", "Medium");
        
        return berserker;
    }
}

```
</details>

### 📦 Root

#### `CreationalPatternsDemo.java`

<details>
<summary>📄 Click to view source</summary>

```java
package com.you.lld.examples.week2.day6;

import com.you.lld.examples.week2.day6.builder.SqlQueryBuilder;
import com.you.lld.examples.week2.day6.builder.User;
import com.you.lld.examples.week2.day6.factory.*;
import com.you.lld.examples.week2.day6.prototype.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

/**
 * Comprehensive demonstration of all three creational patterns.
 * 
 * This class shows practical usage of:
 * - Builder Pattern: Complex object construction
 * - Factory Pattern: Object creation based on type
 * - Prototype Pattern: Cloning expensive objects
 */
public class CreationalPatternsDemo {
    
    public static void main(String[] args) {
        System.out.println("=== CREATIONAL PATTERNS DEMONSTRATION ===\n");
        
        demonstrateBuilderPattern();
        System.out.println("\n" + "==================================================\n");
        
        demonstrateFactoryPattern();
        System.out.println("\n" + "==================================================\n");
        
        demonstratePrototypePattern();
    }
    
    /**
     * Demonstrate the Builder pattern with User and SQL Query builders.
     */
    private static void demonstrateBuilderPattern() {
        System.out.println("🔨 BUILDER PATTERN DEMONSTRATION");
        System.out.println("Solving the telescoping constructor problem with fluent interfaces\n");
        
        // Example 1: User Builder
        System.out.println("1. User Builder Example:");
        
        try {
            // Build a simple user
            User simpleUser = User.builder()
                    .name("John Doe")
                    .email("john@example.com")
                    .build();
            
            System.out.println("Simple User: " + simpleUser);
            
            // Build a complex user with all optional fields
            User complexUser = User.builder()
                    .name("Jane Smith")
                    .email("jane@example.com")
                    .age(28)
                    .phone("555-0123")
                    .address("123 Main St, Anytown, USA")
                    .addPreference("Dark Mode")
                    .addPreference("Email Notifications")
                    .addPreference("Two-Factor Auth")
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            
            System.out.println("Complex User: " + complexUser);
            
            // Demonstrate validation
            try {
                User.builder()
                        .name("") // Invalid empty name
                        .email("invalid-email") // Invalid email format
                        .build();
            } catch (IllegalStateException e) {
                System.out.println("Validation caught: " + e.getMessage());
            }
            
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
        
        System.out.println();
        
        // Example 2: SQL Query Builder
        System.out.println("2. SQL Query Builder Example:");
        
        // Simple SELECT query
        SqlQueryBuilder.PreparedQuery selectQuery = SqlQueryBuilder.select()
                .columns("id", "name", "email")
                .from("users")
                .where("age > ?")
                .withParameter(18)
                .orderBy("name", SqlQueryBuilder.SortOrder.ASC)
                .limit(10)
                .build();
        
        System.out.println("SELECT Query: " + selectQuery.getSql());
        System.out.println("Parameters: " + selectQuery.getParameters());
        
        // Complex JOIN query
        SqlQueryBuilder.PreparedQuery joinQuery = SqlQueryBuilder.select()
                .columns("u.name", "p.title", "c.name as category")
                .from("users u")
                .innerJoin("posts p", "u.id = p.user_id")
                .leftJoin("categories c", "p.category_id = c.id")
                .where("u.active = ?")
                .and("p.published_at > ?")
                .withParameters(true, "2024-01-01")
                .orderBy("p.published_at", SqlQueryBuilder.SortOrder.DESC)
                .build();
        
        System.out.println("JOIN Query: " + joinQuery.getSql());
        System.out.println("Parameters: " + joinQuery.getParameters());
        
        // INSERT query
        SqlQueryBuilder.PreparedQuery insertQuery = SqlQueryBuilder.insert()
                .into("users")
                .values("name", "email", "age")
                .withParameters("Alice Johnson", "alice@example.com", 25)
                .build();
        
        System.out.println("INSERT Query: " + insertQuery.getSql());
        System.out.println("Parameters: " + insertQuery.getParameters());
    }
    
    /**
     * Demonstrate the Factory pattern with payment processors.
     */
    private static void demonstrateFactoryPattern() {
        System.out.println("🏭 FACTORY PATTERN DEMONSTRATION");
        System.out.println("Encapsulating object creation logic and supporting multiple implementations\n");
        
        // Example 1: Basic Factory Usage
        System.out.println("1. Basic Payment Processor Creation:");
        
        PaymentMethod[] methods = {
            PaymentMethod.CREDIT_CARD,
            PaymentMethod.PAYPAL,
            PaymentMethod.BANK_TRANSFER
        };
        
        for (PaymentMethod method : methods) {
            if (PaymentProcessorFactory.isSupported(method)) {
                PaymentProcessor processor = PaymentProcessorFactory.createProcessor(method);
                System.out.printf("Created %s processor: %s%n", 
                                method.getDisplayName(), 
                                processor.getClass().getSimpleName());
            }
        }
        
        System.out.println("\nSupported payment methods: " + 
                          Arrays.toString(PaymentProcessorFactory.getSupportedPaymentMethods()));
        
        // Example 2: Processing Payments
        System.out.println("\n2. Payment Processing Examples:");
        
        // Credit Card Payment
        try {
            PaymentProcessor ccProcessor = PaymentProcessorFactory.createProcessor(PaymentMethod.CREDIT_CARD);
            
            PaymentDetails ccDetails = new PaymentDetails();
            ccDetails.setCardNumber("4111 1111 1111 1111"); // Test Visa number
            ccDetails.setExpiryDate("12/25");
            ccDetails.setCvv("123");
            ccDetails.setCardHolderName("John Doe");
            
            PaymentResult result = ccProcessor.processPayment(
                new BigDecimal("99.99"), 
                "USD", 
                ccDetails
            );
            
            System.out.println("Credit Card Payment: " + 
                             (result.isSuccess() ? "SUCCESS" : "FAILED"));
            System.out.println("Transaction ID: " + result.getTransactionId());
            System.out.println("Processing Fee: $" + result.getProcessingFee());
            
        } catch (PaymentException e) {
            System.out.println("Payment failed: " + e.getMessage());
        }
        
        // PayPal Payment
        try {
            PaymentProcessor paypalProcessor = PaymentProcessorFactory.createProcessor(PaymentMethod.PAYPAL);
            
            PaymentDetails paypalDetails = new PaymentDetails();
            paypalDetails.setPayPalEmail("user@example.com");
            
            PaymentResult result = paypalProcessor.processPayment(
                new BigDecimal("49.99"), 
                "USD", 
                paypalDetails
            );
            
            System.out.println("PayPal Payment: " + 
                             (result.isSuccess() ? "SUCCESS" : "FAILED"));
            System.out.println("Transaction ID: " + result.getTransactionId());
            System.out.println("Processing Fee: $" + result.getProcessingFee());
            
        } catch (PaymentException e) {
            System.out.println("PayPal payment failed: " + e.getMessage());
        }
        
        // Example 3: Optimal Processor Selection
        System.out.println("\n3. Intelligent Processor Selection:");
        
        PaymentMethod[] availableMethods = {
            PaymentMethod.CREDIT_CARD, 
            PaymentMethod.PAYPAL, 
            PaymentMethod.BANK_TRANSFER
        };
        
        // Small amount - should prefer digital wallets (but we don't have them implemented)
        PaymentProcessor smallAmountProcessor = PaymentProcessorFactory.createOptimalProcessor(
            new BigDecimal("25.00"), 
            "USD", 
            availableMethods
        );
        System.out.println("For $25: Recommended " + 
                          smallAmountProcessor.getSupportedPaymentMethod().getDisplayName());
        
        // Large amount - should prefer credit cards
        PaymentProcessor largeAmountProcessor = PaymentProcessorFactory.createOptimalProcessor(
            new BigDecimal("1500.00"), 
            "USD", 
            availableMethods
        );
        System.out.println("For $1500: Recommended " + 
                          largeAmountProcessor.getSupportedPaymentMethod().getDisplayName());
    }
    
    /**
     * Demonstrate the Prototype pattern with game characters.
     */
    private static void demonstratePrototypePattern() {
        System.out.println("🧬 PROTOTYPE PATTERN DEMONSTRATION");
        System.out.println("Cloning expensive objects instead of creating from scratch\n");
        
        // Create character registry
        CharacterRegistry registry = new CharacterRegistry();
        
        // Example 1: Basic Character Creation
        System.out.println("1. Basic Character Creation from Prototypes:");
        
        System.out.println("Available prototypes: " + registry.getAvailablePrototypes());
        
        GameCharacter warrior1 = registry.createCharacter("warrior", "Conan the Barbarian");
        GameCharacter warrior2 = registry.createCharacter("warrior", "Aragorn", 10);
        GameCharacter mage1 = registry.createCharacter("mage", "Gandalf the Grey");
        
        System.out.println("Created: " + warrior1);
        System.out.println("Created: " + warrior2);
        System.out.println("Created: " + mage1);
        
        // Example 2: Specialized Characters
        System.out.println("\n2. Specialized Character Creation:");
        
        GameCharacter berserker = registry.createCharacter("berserker", "Bjorn Ironside");
        GameCharacter fireMage = registry.createCharacter("fire_mage", "Pyro Pete");
        GameCharacter eliteWarrior = registry.createCharacter("elite_warrior", "Sir Lancelot");
        
        System.out.println("Created: " + berserker);
        System.out.println("Created: " + fireMage);
        System.out.println("Created: " + eliteWarrior);
        
        // Example 3: Mass Character Creation
        System.out.println("\n3. Mass Character Creation:");
        
        String[] npcNames = {"Guard1", "Guard2", "Guard3", "Merchant", "Blacksmith"};
        GameCharacter[] npcs = registry.createMultipleCharacters("warrior", npcNames);
        
        System.out.println("Created " + npcs.length + " NPC warriors:");
        for (GameCharacter npc : npcs) {
            System.out.println("  - " + npc.getName() + " (Level " + npc.getLevel() + ")");
        }
        
        // Example 4: Character Customization
        System.out.println("\n4. Character Customization After Cloning:");
        
        GameCharacter baseMage = registry.createCharacter("mage", "Apprentice Mage");
        System.out.println("Base mage: " + baseMage);
        System.out.println("Base mage skills: " + baseMage.getSkills());
        
        // Clone and customize
        Mage customMage = (Mage) baseMage.clone();
        customMage.setName("Master Elementalist");
        customMage.levelUpTo(15);
        customMage.addSkill(new GameCharacter.Skill("Summon Elemental", "Summons an elemental ally", 3));
        customMage.getEquipment().setWeapon("Staff of the Elements");
        
        System.out.println("Customized mage: " + customMage);
        System.out.println("Custom mage skills: " + customMage.getSkills());
        
        // Verify original wasn't affected
        System.out.println("Original mage unchanged: " + baseMage);
        
        // Example 5: Performance Demonstration
        System.out.println("\n5. Performance Comparison:");
        registry.demonstratePerformance();
        
        // Example 6: Custom Prototype Registration
        System.out.println("\n6. Custom Prototype Registration:");
        
        // Create a custom character
        Warrior customWarrior = new Warrior("Custom Template");
        customWarrior.levelUpTo(15);
        customWarrior.getEquipment().setWeapon("Excalibur");
        customWarrior.getEquipment().setArmor("Enchanted Plate");
        customWarrior.addSkill(new GameCharacter.Skill("Holy Strike", "Divine damage attack", 5));
        customWarrior.setAttribute("alignment", "Lawful Good");
        
        // Register as new prototype
        registry.registerPrototype("paladin", customWarrior);
        
        // Use the new prototype
        GameCharacter paladin1 = registry.createCharacter("paladin", "Sir Galahad");
        GameCharacter paladin2 = registry.createCharacter("paladin", "Joan of Arc", 20);
        
        System.out.println("Created custom paladin: " + paladin1);
        System.out.println("Created high-level paladin: " + paladin2);
        System.out.println("Updated prototype count: " + registry.getPrototypeCount());
    }
}

```
</details>


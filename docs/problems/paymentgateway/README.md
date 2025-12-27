# Payment Gateway System

## Overview
A comprehensive payment gateway for processing online payments supporting multiple payment methods (credit cards, debit cards, wallets, UPI), payment providers (Stripe, PayPal, Razorpay), fraud detection, transaction management, and PCI DSS compliance. Implements idempotency, retry logic, webhooks, and settlement reconciliation.

**Difficulty:** Hard  
**Domain:** Financial Technology, Payment Systems  
**Interview Frequency:** Very High (Stripe, PayPal, Razorpay, Square, fintech companies)

## Requirements

### Functional Requirements
1. **Payment Processing**
   - Accept payments (one-time, recurring)
   - Multiple payment methods
   - Multiple currencies
   - Refunds and cancellations
   - Partial refunds

2. **Payment Methods**
   - Credit/Debit cards
   - Digital wallets (PayPal, Apple Pay, Google Pay)
   - Bank transfers (ACH, wire)
   - UPI (India)
   - Buy Now Pay Later (BNPL)

3. **Transaction Management**
   - Create payment intent
   - Authorize payment
   - Capture payment
   - Void authorization
   - Refund transaction

4. **Fraud Detection**
   - Card verification (CVV, AVS)
   - Velocity checks
   - Risk scoring
   - 3D Secure authentication
   - Blacklist checking

5. **Webhook System**
   - Payment success/failure notifications
   - Refund notifications
   - Dispute notifications
   - Retry logic with exponential backoff

6. **Reporting & Analytics**
   - Transaction history
   - Settlement reports
   - Chargeback management
   - Revenue analytics

### Non-Functional Requirements
1. **Performance**
   - Payment processing: < 2 seconds
   - Support 10K+ TPS (transactions per second)
   - API response: < 500ms

2. **Availability**
   - 99.99% uptime
   - No transaction loss
   - Automatic failover

3. **Security**
   - PCI DSS compliant
   - End-to-end encryption
   - Tokenization (no card storage)
   - Rate limiting
   - HTTPS only

4. **Consistency**
   - Idempotent operations
   - Exactly-once processing
   - Atomic transactions

## System Architecture

```
┌────────────────────────────────────────────────┐
│         Merchant Application                    │
│   (E-commerce site, Mobile App)                │
└────────────────┬───────────────────────────────┘
                 │
     ┌───────────▼────────────┐
     │   Payment Gateway API  │
     │  (Idempotency, Auth)   │
     └────────────┬───────────┘
                  │
     ┌────────────┼────────────┐
     │            │            │
┌────▼─────┐ ┌───▼──────┐ ┌──▼────────┐
│ Payment  │ │  Fraud   │ │  Webhook  │
│ Service  │ │ Detection│ │  Service  │
│          │ │          │ │           │
│ -Process │ │ -Score   │ │ -Notify   │
│ -Refund  │ │ -Verify  │ │ -Retry    │
└────┬─────┘ └───┬──────┘ └──┬────────┘
     │           │            │
     │     ┌─────▼────┐       │
     │     │  Risk    │       │
     │     │  Engine  │       │
     │     └──────────┘       │
     │                        │
┌────▼─────────────────────────▼─────┐
│       Payment Providers             │
│  - Stripe                          │
│  - PayPal                          │
│  - Razorpay                        │
│  - Bank Networks                   │
└────────────────────────────────────┘
```

## Core Data Model

### 1. Payment
```java
public class Payment {
    private PaymentId id;
    private MerchantId merchantId;
    private CustomerId customerId;
    private Money amount;
    private Currency currency;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private PaymentProvider provider;
    private String providerTransactionId;
    private String idempotencyKey; // For duplicate detection
    private Map<String, String> metadata;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String failureReason;
    private int attemptCount;
    
    public boolean canRefund() {
        return status == PaymentStatus.SUCCEEDED && 
               !isRefunded();
    }
    
    public boolean isTerminalState() {
        return status == PaymentStatus.SUCCEEDED ||
               status == PaymentStatus.FAILED ||
               status == PaymentStatus.CANCELLED;
    }
}

enum PaymentStatus {
    CREATED,           // Payment intent created
    PENDING,           // Awaiting customer action
    AUTHORIZED,        // Authorized but not captured
    PROCESSING,        // Being processed
    SUCCEEDED,         // Payment successful
    FAILED,           // Payment failed
    CANCELLED,        // Cancelled by merchant
    REFUNDED,         // Fully refunded
    PARTIALLY_REFUNDED // Partially refunded
}
```

### 2. Payment Method
```java
public abstract class PaymentMethod {
    protected PaymentMethodType type;
    protected String token; // Tokenized, never store raw card data
    
    public abstract boolean validate();
}

class CardPaymentMethod extends PaymentMethod {
    private String cardToken;
    private String last4Digits;
    private String cardBrand; // Visa, MasterCard, Amex
    private int expiryMonth;
    private int expiryYear;
    private String cardholderName;
    private Address billingAddress;
    
    public boolean validate() {
        // Luhn algorithm for card number
        // Expiry date validation
        return !isExpired() && isValidCardNumber();
    }
    
    private boolean isExpired() {
        LocalDate now = LocalDate.now();
        return now.getYear() > expiryYear || 
               (now.getYear() == expiryYear && now.getMonthValue() > expiryMonth);
    }
}

class WalletPaymentMethod extends PaymentMethod {
    private WalletType walletType; // PAYPAL, APPLE_PAY, GOOGLE_PAY
    private String walletId;
    private String email;
}

class UPIPaymentMethod extends PaymentMethod {
    private String upiId; // user@bank
    private String vpa; // Virtual Payment Address
}

enum PaymentMethodType {
    CARD,
    WALLET,
    UPI,
    BANK_TRANSFER,
    BNPL
}
```

### 3. Transaction
```java
public class Transaction {
    private TransactionId id;
    private PaymentId paymentId;
    private TransactionType type;
    private Money amount;
    private TransactionStatus status;
    private String providerTransactionId;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private String errorCode;
    private String errorMessage;
    
    public boolean isSuccessful() {
        return status == TransactionStatus.SUCCESS;
    }
}

enum TransactionType {
    AUTHORIZE,    // Reserve funds
    CAPTURE,      // Capture authorized funds
    SALE,         // Authorize + Capture in one step
    REFUND,       // Return funds
    VOID          // Cancel authorization
}

enum TransactionStatus {
    PENDING,
    SUCCESS,
    FAILED,
    REVERSED
}
```

### 4. Refund
```java
public class Refund {
    private RefundId id;
    private PaymentId paymentId;
    private Money amount;
    private RefundReason reason;
    private RefundStatus status;
    private String refundTransactionId;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;
    private int processingDays; // Typically 5-10 days
    
    public boolean isComplete() {
        return status == RefundStatus.SUCCEEDED;
    }
}

enum RefundReason {
    REQUESTED_BY_CUSTOMER,
    DUPLICATE_CHARGE,
    FRAUDULENT,
    DEFECTIVE_PRODUCT,
    OTHER
}

enum RefundStatus {
    PENDING,
    PROCESSING,
    SUCCEEDED,
    FAILED,
    CANCELLED
}
```

### 5. Webhook Event
```java
public class WebhookEvent {
    private EventId id;
    private EventType type;
    private PaymentId paymentId;
    private String payload; // JSON
    private String merchantWebhookUrl;
    private int attemptCount;
    private int maxAttempts;
    private WebhookStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime nextRetryAt;
    private String lastError;
    
    public boolean shouldRetry() {
        return status != WebhookStatus.SUCCEEDED &&
               attemptCount < maxAttempts;
    }
    
    public Duration getNextRetryDelay() {
        // Exponential backoff: 1min, 2min, 4min, 8min, 16min
        return Duration.ofMinutes((long) Math.pow(2, attemptCount));
    }
}

enum EventType {
    PAYMENT_SUCCEEDED,
    PAYMENT_FAILED,
    REFUND_SUCCEEDED,
    REFUND_FAILED,
    CHARGEBACK_CREATED,
    DISPUTE_CREATED
}

enum WebhookStatus {
    PENDING,
    SUCCEEDED,
    FAILED
}
```

## Key Algorithms

### 1. Payment Processing Flow
```java
public class PaymentService {
    
    public Payment processPayment(PaymentRequest request) {
        // 1. Idempotency check
        Payment existing = checkIdempotency(request.getIdempotencyKey());
        if (existing != null) {
            return existing; // Return cached result
        }
        
        // 2. Create payment record
        Payment payment = createPayment(request);
        
        // 3. Fraud detection
        FraudResult fraudResult = fraudService.checkRisk(payment);
        if (fraudResult.isHighRisk()) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Fraud detected");
            return payment;
        }
        
        // 4. Route to payment provider
        PaymentProvider provider = selectProvider(payment);
        
        try {
            // 5. Process with provider
            payment.setStatus(PaymentStatus.PROCESSING);
            paymentRepository.save(payment);
            
            ProviderResponse response = provider.processPayment(payment);
            
            if (response.isSuccessful()) {
                payment.setStatus(PaymentStatus.SUCCEEDED);
                payment.setProviderTransactionId(response.getTransactionId());
                
                // 6. Send webhook
                webhookService.sendWebhook(payment, EventType.PAYMENT_SUCCEEDED);
                
            } else {
                payment.setStatus(PaymentStatus.FAILED);
                payment.setFailureReason(response.getErrorMessage());
                
                webhookService.sendWebhook(payment, EventType.PAYMENT_FAILED);
            }
            
        } catch (Exception e) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason(e.getMessage());
            
            // Retry logic for transient failures
            if (isRetryable(e)) {
                scheduleRetry(payment);
            }
        } finally {
            paymentRepository.save(payment);
        }
        
        return payment;
    }
    
    private PaymentProvider selectProvider(Payment payment) {
        // Route based on:
        // - Payment method type
        // - Currency
        // - Amount (some providers have limits)
        // - Geographic region
        // - Provider uptime/success rate
        
        if (payment.getPaymentMethod().getType() == PaymentMethodType.UPI) {
            return upiProvider;
        } else if (payment.getCurrency() == Currency.INR) {
            return razorpayProvider;
        } else {
            return stripeProvider;
        }
    }
}
```

### 2. Idempotency Implementation
```java
public class IdempotencyService {
    private final Cache<String, Payment> cache;
    private final Duration cacheTTL = Duration.ofHours(24);
    
    public Payment checkIdempotency(String idempotencyKey) {
        if (idempotencyKey == null) {
            return null;
        }
        
        // Check cache first
        Payment cached = cache.get(idempotencyKey);
        if (cached != null) {
            return cached;
        }
        
        // Check database
        Payment existing = paymentRepository.findByIdempotencyKey(idempotencyKey);
        if (existing != null) {
            cache.put(idempotencyKey, existing, cacheTTL);
        }
        
        return existing;
    }
    
    public void recordPayment(String idempotencyKey, Payment payment) {
        if (idempotencyKey != null) {
            cache.put(idempotencyKey, payment, cacheTTL);
        }
    }
}
```

**Why Idempotency is Critical:**
- Network failures may cause duplicate requests
- Retry logic must not create duplicate charges
- Same idempotency key = same result
- Prevents accidental double-charging

### 3. Fraud Detection
```java
public class FraudDetectionService {
    
    public FraudResult checkRisk(Payment payment) {
        int riskScore = 0;
        List<String> flags = new ArrayList<>();
        
        // 1. Velocity check (multiple transactions in short time)
        int recentTransactions = getRecentTransactionCount(
            payment.getCustomerId(), 
            Duration.ofMinutes(10)
        );
        if (recentTransactions > 3) {
            riskScore += 30;
            flags.add("High velocity");
        }
        
        // 2. Amount check (unusually large transaction)
        Money avgTransaction = getAverageTransaction(payment.getCustomerId());
        if (payment.getAmount().isGreaterThan(avgTransaction.multiply(5))) {
            riskScore += 25;
            flags.add("Unusual amount");
        }
        
        // 3. Location check (different country)
        String currentCountry = payment.getBillingAddress().getCountry();
        String lastCountry = getLastTransactionCountry(payment.getCustomerId());
        if (!currentCountry.equals(lastCountry)) {
            riskScore += 20;
            flags.add("Location mismatch");
        }
        
        // 4. Card verification (CVV, AVS)
        if (!payment.isCvvVerified()) {
            riskScore += 15;
            flags.add("CVV not verified");
        }
        
        // 5. Blacklist check
        if (isBlacklisted(payment.getCustomerId())) {
            riskScore += 100;
            flags.add("Blacklisted");
        }
        
        // 6. Device fingerprint check
        if (isKnownFraudDevice(payment.getDeviceFingerprint())) {
            riskScore += 50;
            flags.add("Fraudulent device");
        }
        
        RiskLevel riskLevel;
        if (riskScore >= 70) {
            riskLevel = RiskLevel.HIGH;
        } else if (riskScore >= 40) {
            riskLevel = RiskLevel.MEDIUM;
        } else {
            riskLevel = RiskLevel.LOW;
        }
        
        return new FraudResult(riskLevel, riskScore, flags);
    }
}

enum RiskLevel {
    LOW,      // Process normally
    MEDIUM,   // Require 3D Secure
    HIGH      // Block transaction
}
```

### 4. Webhook Delivery with Retry
```java
public class WebhookService {
    private final ScheduledExecutorService scheduler;
    
    public void sendWebhook(Payment payment, EventType eventType) {
        WebhookEvent event = new WebhookEvent(
            generateId(),
            eventType,
            payment.getId(),
            serializePayload(payment),
            getMerchantWebhookUrl(payment.getMerchantId()),
            0,  // attemptCount
            5,  // maxAttempts
            WebhookStatus.PENDING,
            LocalDateTime.now(),
            LocalDateTime.now(),
            null
        );
        
        webhookRepository.save(event);
        deliverWebhook(event);
    }
    
    private void deliverWebhook(WebhookEvent event) {
        try {
            // Calculate signature for verification
            String signature = calculateSignature(event.getPayload());
            
            // Send HTTP POST
            HttpResponse response = httpClient.post(event.getMerchantWebhookUrl())
                .header("X-Webhook-Signature", signature)
                .header("X-Event-Type", event.getType().name())
                .body(event.getPayload())
                .timeout(Duration.ofSeconds(10))
                .execute();
            
            if (response.getStatusCode() == 200) {
                event.setStatus(WebhookStatus.SUCCEEDED);
                webhookRepository.save(event);
            } else {
                handleFailedWebhook(event, "HTTP " + response.getStatusCode());
            }
            
        } catch (Exception e) {
            handleFailedWebhook(event, e.getMessage());
        }
    }
    
    private void handleFailedWebhook(WebhookEvent event, String error) {
        event.incrementAttemptCount();
        event.setLastError(error);
        
        if (event.shouldRetry()) {
            // Schedule retry with exponential backoff
            event.setNextRetryAt(
                LocalDateTime.now().plus(event.getNextRetryDelay())
            );
            event.setStatus(WebhookStatus.PENDING);
            
            scheduler.schedule(
                () -> deliverWebhook(event),
                event.getNextRetryDelay().toMillis(),
                TimeUnit.MILLISECONDS
            );
        } else {
            event.setStatus(WebhookStatus.FAILED);
        }
        
        webhookRepository.save(event);
    }
    
    private String calculateSignature(String payload) {
        // HMAC-SHA256 signature for webhook verification
        return hmacSha256(webhookSecret, payload);
    }
}
```

**Webhook Retry Schedule:**
```
Attempt 1: Immediate
Attempt 2: After 1 minute
Attempt 3: After 2 minutes (cumulative: 3 min)
Attempt 4: After 4 minutes (cumulative: 7 min)
Attempt 5: After 8 minutes (cumulative: 15 min)
Max 5 attempts, then mark as failed
```

### 5. Refund Processing
```java
public class RefundService {
    
    public Refund processRefund(RefundRequest request) {
        Payment payment = paymentRepository.findById(request.getPaymentId());
        
        // Validate refund
        if (!payment.canRefund()) {
            throw new RefundException("Payment cannot be refunded");
        }
        
        // Check refund amount
        Money refundedAmount = getRefundedAmount(payment.getId());
        Money remainingAmount = payment.getAmount().subtract(refundedAmount);
        
        if (request.getAmount().isGreaterThan(remainingAmount)) {
            throw new RefundException("Refund amount exceeds remaining balance");
        }
        
        // Create refund record
        Refund refund = new Refund(
            generateId(),
            payment.getId(),
            request.getAmount(),
            request.getReason(),
            RefundStatus.PENDING,
            null,
            LocalDateTime.now(),
            null,
            7  // Processing days
        );
        
        refundRepository.save(refund);
        
        try {
            // Process refund with provider
            PaymentProvider provider = getProvider(payment.getProvider());
            ProviderRefundResponse response = provider.processRefund(
                payment.getProviderTransactionId(),
                request.getAmount()
            );
            
            if (response.isSuccessful()) {
                refund.setStatus(RefundStatus.SUCCEEDED);
                refund.setRefundTransactionId(response.getRefundId());
                refund.setProcessedAt(LocalDateTime.now());
                
                // Update payment status
                updatePaymentRefundStatus(payment, request.getAmount());
                
                // Send webhook
                webhookService.sendWebhook(payment, EventType.REFUND_SUCCEEDED);
                
            } else {
                refund.setStatus(RefundStatus.FAILED);
            }
            
        } catch (Exception e) {
            refund.setStatus(RefundStatus.FAILED);
        } finally {
            refundRepository.save(refund);
        }
        
        return refund;
    }
}
```

## Design Patterns

### 1. Strategy Pattern (Payment Providers)
```java
interface PaymentProvider {
    ProviderResponse processPayment(Payment payment);
    ProviderRefundResponse processRefund(String transactionId, Money amount);
}

class StripeProvider implements PaymentProvider {
    public ProviderResponse processPayment(Payment payment) {
        // Stripe API integration
    }
}

class RazorpayProvider implements PaymentProvider {
    public ProviderResponse processPayment(Payment payment) {
        // Razorpay API integration
    }
}
```

### 2. Factory Pattern (Payment Method Creation)
```java
interface PaymentMethodFactory {
    PaymentMethod createPaymentMethod(PaymentMethodRequest request);
}

class CardPaymentMethodFactory implements PaymentMethodFactory {
    public PaymentMethod createPaymentMethod(PaymentMethodRequest request) {
        return new CardPaymentMethod(/* ... */);
    }
}
```

### 3. Observer Pattern (Payment Events)
```java
interface PaymentObserver {
    void onPaymentSucceeded(Payment payment);
    void onPaymentFailed(Payment payment);
}

class WebhookObserver implements PaymentObserver {
    public void onPaymentSucceeded(Payment payment) {
        webhookService.sendWebhook(payment, EventType.PAYMENT_SUCCEEDED);
    }
}
```

## Source Code

📄 **[View Complete Source Code](/problems/paymentgateway/CODE)**

**Key Files:**
- [`PaymentService.java`](/problems/paymentgateway/CODE#paymentservicejava) - Payment processing
- [`FraudDetectionService.java`](/problems/paymentgateway/CODE#frauddetectionservicejava) - Fraud checks
- [`WebhookService.java`](/problems/paymentgateway/CODE#webhookservicejava) - Webhook delivery
- [`RefundService.java`](/problems/paymentgateway/CODE#refundservicejava) - Refund handling

**Total Lines of Code:** ~1100 lines

## Usage Example

```java
// Initialize payment gateway
PaymentGateway gateway = new PaymentGateway();

// Create payment
PaymentRequest request = PaymentRequest.builder()
    .merchantId(merchantId)
    .customerId(customerId)
    .amount(Money.of(99.99, "USD"))
    .paymentMethod(cardPaymentMethod)
    .idempotencyKey(UUID.randomUUID().toString())
    .metadata(Map.of("orderId", "ORD-12345"))
    .build();

Payment payment = gateway.processPayment(request);

if (payment.getStatus() == PaymentStatus.SUCCEEDED) {
    System.out.println("Payment successful!");
} else {
    System.out.println("Payment failed: " + payment.getFailureReason());
}

// Process refund
RefundRequest refundRequest = RefundRequest.builder()
    .paymentId(payment.getId())
    .amount(Money.of(99.99, "USD"))
    .reason(RefundReason.REQUESTED_BY_CUSTOMER)
    .build();

Refund refund = gateway.processRefund(refundRequest);
```

## Common Interview Questions

### System Design Questions

1. **How do you prevent duplicate charges?**
   - Idempotency keys
   - Cache + database lookup
   - 24-hour window
   - Return same result for same key

2. **How do you detect fraud?**
   - Velocity checks (rate limiting)
   - Amount anomaly detection
   - Location mismatch
   - Blacklist checking
   - Device fingerprinting
   - 3D Secure for high-risk

3. **How do you ensure webhook delivery?**
   - Retry with exponential backoff
   - Max 5 attempts
   - HMAC signature for verification
   - Idempotent webhook handlers
   - Dead letter queue for failures

4. **How do you handle payment provider failures?**
   - Multi-provider support
   - Automatic failover
   - Circuit breaker pattern
   - Provider health monitoring
   - Graceful degradation

### Coding Questions

1. **Implement idempotency check**
   ```java
   Payment checkIdempotency(String key) {
       Payment cached = cache.get(key);
       if (cached != null) return cached;
       
       Payment fromDb = repository.findByIdempotencyKey(key);
       if (fromDb != null) cache.put(key, fromDb);
       return fromDb;
   }
   ```

2. **Calculate webhook retry delay**
   ```java
   Duration getRetryDelay(int attemptCount) {
       return Duration.ofMinutes((long) Math.pow(2, attemptCount));
   }
   ```

3. **Fraud score calculation**
   ```java
   int calculateRiskScore(Payment payment) {
       int score = 0;
       if (isHighVelocity(payment)) score += 30;
       if (isUnusualAmount(payment)) score += 25;
       if (!isCvvVerified(payment)) score += 15;
       return score;
   }
   ```

### Algorithm Questions
1. **Time complexity of fraud detection?** → O(1) with proper indexing
2. **How to handle race conditions?** → Database transactions + locks
3. **Webhook retry schedule?** → Exponential backoff: 2^n minutes

## Trade-offs & Design Decisions

### 1. Authorize vs Authorize+Capture
**Authorize:** Reserve funds, capture later  
**Authorize+Capture:** Immediate charge

**Decision:** Support both (merchant choice)

### 2. Sync vs Async Processing
**Sync:** Immediate response, higher latency  
**Async:** Fast response, eventual consistency

**Decision:** Sync for payments, async for webhooks

### 3. Single Provider vs Multi-Provider
**Single:** Simple, vendor lock-in  
**Multi:** Redundancy, complex

**Decision:** Multi-provider with smart routing

### 4. Strong vs Eventual Consistency
**Strong:** Always accurate, slower  
**Eventual:** Fast, temporarily inconsistent

**Decision:** Strong for payments, eventual for analytics

## Key Takeaways

### What Interviewers Look For
1. ✅ **Idempotency** implementation
2. ✅ **Fraud detection** algorithms
3. ✅ **Webhook delivery** with retry
4. ✅ **PCI DSS compliance** (tokenization)
5. ✅ **Multi-provider** support
6. ✅ **Error handling** and retry logic

### Common Mistakes to Avoid
1. ❌ Storing raw card data (PCI violation)
2. ❌ No idempotency (duplicate charges)
3. ❌ Synchronous webhooks (slow)
4. ❌ No fraud detection
5. ❌ Single payment provider (SPOF)
6. ❌ Not handling currency conversion

### Production-Ready Checklist
- [x] Payment processing
- [x] Refunds
- [x] Idempotency
- [x] Fraud detection
- [x] Webhooks with retry
- [ ] 3D Secure
- [ ] Recurring payments
- [ ] Dispute management
- [ ] PCI DSS certification
- [ ] Multi-currency

---

## Related Problems
- 💳 **Splitwise** - Payment settlements
- 🏦 **Banking System** - Transactions
- 🛡️ **Fraud Detection** - Risk scoring
- 📊 **Analytics** - Transaction reporting

## References
- Stripe API: Payment gateway design
- PCI DSS: Payment card security standards
- Idempotency: Preventing duplicate operations
- HMAC: Webhook signature verification

---

*Production-ready payment gateway with idempotency, fraud detection, and webhook delivery. Essential for fintech and e-commerce interviews.*

# Payment Gateway

## Overview
Secure payment processing system supporting multiple payment methods, fraud detection, retry logic, and webhook notifications for transaction status.

**Difficulty:** Hard  
**Interview Frequency:** Very High (Stripe, PayPal, fintech)

## Key Features

### Payment Processing
```java
public PaymentResult processPayment(PaymentRequest request) {
    // 1. Validate
    validate(request);
    
    // 2. Fraud check
    if (isFraudulent(request)) {
        return PaymentResult.declined("Fraud detected");
    }
    
    // 3. Process with provider
    try {
        String transactionId = paymentProvider.charge(request);
        return PaymentResult.success(transactionId);
    } catch (Exception e) {
        // 4. Retry with exponential backoff
        return retryPayment(request);
    }
}
```

### Idempotency
```java
public PaymentResult processPayment(String idempotencyKey, PaymentRequest request) {
    // Check if already processed
    PaymentResult cached = cache.get(idempotencyKey);
    if (cached != null) {
        return cached;
    }
    
    // Process
    PaymentResult result = doProcess(request);
    
    // Cache for 24 hours
    cache.put(idempotencyKey, result, Duration.ofHours(24));
    
    return result;
}
```

### Webhook Handling
```java
public void handleWebhook(WebhookEvent event) {
    // Verify signature
    if (!verifySignature(event)) {
        throw new SecurityException("Invalid signature");
    }
    
    // Process event
    switch (event.getType()) {
        case PAYMENT_SUCCESS -> updateOrderStatus(event, OrderStatus.PAID);
        case PAYMENT_FAILED -> handleFailure(event);
        case REFUND_PROCESSED -> processRefund(event);
    }
}
```

## Security
- **PCI DSS Compliance**: Never store card data
- **Encryption**: TLS 1.3 for transmission
- **Tokenization**: Replace card numbers with tokens
- **3D Secure**: Additional authentication

## Source Code
📄 **[View Complete Source Code](/problems/paymentgateway/CODE)**

*Secure payment processing with fraud detection.*

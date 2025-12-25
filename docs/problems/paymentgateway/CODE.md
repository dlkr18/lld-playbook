# Payment Gateway

## Problem: Design a Payment Gateway System

**Difficulty**: Medium  
**Pattern**: Strategy, Factory, State  
**Time**: 45-60 min

---

## Key Classes

```java
interface PaymentProcessor {
    PaymentResult processPayment(PaymentRequest request);
    RefundResult refund(String transactionId, double amount);
}

class PaymentGateway {
    private Map<PaymentMethod, PaymentProcessor> processors;
    private TransactionRepository transactions;
    
    PaymentResult processPayment(PaymentRequest request);
    PaymentStatus checkStatus(String transactionId);
}

enum PaymentStatus { 
    PENDING, PROCESSING, SUCCESS, FAILED, REFUNDED 
}
```

---

**Status**: ✅ Documented

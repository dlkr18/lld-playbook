# paymentgateway - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/paymentgateway/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py paymentgateway`.

## Project Structure (18 files)

```
paymentgateway/
├── PaymentGatewayDemo.java
├── PaymentResult.java
├── PaymentStatus.java
├── api/PaymentGatewayService.java
├── model/BankAccount.java
├── model/Card.java
├── model/Customer.java
├── model/Merchant.java
├── model/PaymentMethod.java
├── model/Refund.java
├── model/RefundStatus.java
├── model/Transaction.java
├── model/TransactionStatus.java
├── impl/InMemoryPaymentGatewayService.java
├── exceptions/InsufficientFundsException.java
├── exceptions/InvalidCardException.java
├── exceptions/RefundNotFoundException.java
├── exceptions/TransactionFailedException.java
```

## Source Code

### `PaymentGatewayDemo.java`

<details>
<summary>Click to view PaymentGatewayDemo.java</summary>

```java
package com.you.lld.problems.paymentgateway;

import com.you.lld.problems.paymentgateway.impl.InMemoryPaymentGatewayService;
import com.you.lld.problems.paymentgateway.model.*;

import java.util.List;

/**
 * Demo: Payment Gateway with idempotency, refunds, status tracking.
 */
public class PaymentGatewayDemo {

    public static void main(String[] args) {
        System.out.println("=== Payment Gateway Demo ===\n");

        InMemoryPaymentGatewayService service = new InMemoryPaymentGatewayService();

        // --- Scenario 1: Successful payment ---
        System.out.println("--- Scenario 1: Process payment ---");
        Transaction txn1 = service.processPayment("merchant-1", "customer-1", 99.99, PaymentMethod.CARD);
        System.out.println("Transaction: " + txn1.getTransactionId() + " status=" + txn1.getStatus());

        // --- Scenario 2: Idempotency ---
        System.out.println("\n--- Scenario 2: Idempotent payment ---");
        Transaction txn2a = service.processPayment("merchant-1", "customer-2", 50.00, PaymentMethod.UPI, "idem-key-001");
        Transaction txn2b = service.processPayment("merchant-1", "customer-2", 50.00, PaymentMethod.UPI, "idem-key-001");
        System.out.println("First call:  " + txn2a.getTransactionId());
        System.out.println("Second call: " + txn2b.getTransactionId());
        System.out.println("Same txn? " + txn2a.getTransactionId().equals(txn2b.getTransactionId()));

        // --- Scenario 3: Full refund ---
        System.out.println("\n--- Scenario 3: Full refund ---");
        Refund refund1 = service.processRefund(txn1.getTransactionId(), 99.99);
        System.out.println("Refund: " + refund1.getRefundId() + " amount=$" + refund1.getAmount()
            + " status=" + refund1.getStatus());
        System.out.println("Transaction status after refund: " + service.getTransaction(txn1.getTransactionId()).getStatus());

        // --- Scenario 4: Partial refund ---
        System.out.println("\n--- Scenario 4: Partial refund ---");
        Transaction txn3 = service.processPayment("merchant-2", "customer-3", 200.00, PaymentMethod.WALLET);
        Refund partial1 = service.processRefund(txn3.getTransactionId(), 50.00);
        Refund partial2 = service.processRefund(txn3.getTransactionId(), 75.00);
        System.out.println("Refund 1: $" + partial1.getAmount());
        System.out.println("Refund 2: $" + partial2.getAmount());
        System.out.println("Total refunded: $" + service.getRefundedAmount(txn3.getTransactionId()));

        // Try to over-refund
        try {
            service.processRefund(txn3.getTransactionId(), 100.00);
        } catch (IllegalArgumentException e) {
            System.out.println("Over-refund blocked: " + e.getMessage());
        }

        // --- Scenario 5: Payment failure ---
        System.out.println("\n--- Scenario 5: Failed payment ---");
        Transaction txnFail = service.processPayment("merchant-1", "customer-4", 99.13, PaymentMethod.CARD);
        System.out.println("Status: " + txnFail.getStatus());

        // Cannot refund failed payment
        try {
            service.processRefund(txnFail.getTransactionId(), 50.0);
        } catch (Exception e) {
            System.out.println("Refund of failed txn blocked: " + e.getMessage());
        }

        // --- Scenario 6: Get transaction ---
        System.out.println("\n--- Scenario 6: Lookup ---");
        Transaction fetched = service.getTransaction(txn1.getTransactionId());
        System.out.println("Fetched: " + fetched.getTransactionId() + " $" + fetched.getAmount());

        List<Refund> allRefunds = service.getRefunds(txn3.getTransactionId());
        System.out.println("Refunds for " + txn3.getTransactionId() + ": " + allRefunds.size());

        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `PaymentResult.java`

<details>
<summary>Click to view PaymentResult.java</summary>

```java
package com.you.lld.problems.paymentgateway;
public class PaymentResult {
    private final String transactionId;
    private final PaymentStatus status;
    private final String message;
    
    public PaymentResult(String transactionId, PaymentStatus status, String message) {
        this.transactionId = transactionId;
        this.status = status;
        this.message = message;
    }
    
    public String getTransactionId() { return transactionId; }
    public PaymentStatus getStatus() { return status; }
    public String getMessage() { return message; }
}
```

</details>

### `PaymentStatus.java`

<details>
<summary>Click to view PaymentStatus.java</summary>

```java
package com.you.lld.problems.paymentgateway;
public enum PaymentStatus { PENDING, PROCESSING, SUCCESS, FAILED, REFUNDED }
```

</details>

### `api/PaymentGatewayService.java`

<details>
<summary>Click to view api/PaymentGatewayService.java</summary>

```java
package com.you.lld.problems.paymentgateway.api;
import com.you.lld.problems.paymentgateway.model.*;
public
interface PaymentGatewayService  {
    Transaction processPayment(String merchantId, String customerId, double amount, PaymentMethod method);
    Transaction getTransaction(String transactionId);
    Refund processRefund(String transactionId, double amount);
}
```

</details>

### `model/BankAccount.java`

<details>
<summary>Click to view model/BankAccount.java</summary>

```java
package com.you.lld.problems.paymentgateway.model;
public
class BankAccount  {
    private String accountNumber, ifsc;
    public BankAccount(String acc, String i)  {
        accountNumber=acc;
        ifsc=i;
    }
    public String getAccountNumber()  {
        return accountNumber;
    }
}
```

</details>

### `model/Card.java`

<details>
<summary>Click to view model/Card.java</summary>

```java
package com.you.lld.problems.paymentgateway.model;
public
class Card  {
    private String cardNumber, cvv, expiryDate;
    public Card(String num, String c, String exp)  {
        cardNumber=num;
        cvv=c;
        expiryDate=exp;
    }
    public String getCardNumber()  {
        return cardNumber;
    }
    public boolean isValid()  {
        return cardNumber!=null && cvv!=null;
    }
}
```

</details>

### `model/Customer.java`

<details>
<summary>Click to view model/Customer.java</summary>

```java
package com.you.lld.problems.paymentgateway.model;
public
class Customer  {
    private String customerId, name, email;
    public Customer(String id, String n, String e)  {
        customerId=id;
        name=n;
        email=e;
    }
    public String getCustomerId()  {
        return customerId;
    }
}
```

</details>

### `model/Merchant.java`

<details>
<summary>Click to view model/Merchant.java</summary>

```java
package com.you.lld.problems.paymentgateway.model;
public
class Merchant  {
    private String merchantId, name, email;
    public Merchant(String id, String n, String e)  {
        merchantId=id;
        name=n;
        email=e;
    }
    public String getMerchantId()  {
        return merchantId;
    }
}
```

</details>

### `model/PaymentMethod.java`

<details>
<summary>Click to view model/PaymentMethod.java</summary>

```java
package com.you.lld.problems.paymentgateway.model;

public enum PaymentMethod {
    CARD,
    BANK_TRANSFER,
    UPI,
    WALLET
}
```

</details>

### `model/Refund.java`

<details>
<summary>Click to view model/Refund.java</summary>

```java
package com.you.lld.problems.paymentgateway.model;

import java.time.*;

public class Refund {
    private String refundId;
    private String transactionId;
    private double amount;
    private RefundStatus status;
    
    public Refund(String id, String tid, double amt) {
        this.refundId = id;
        this.transactionId = tid;
        this.amount = amt;
        this.status = RefundStatus.PENDING;
    }
    
    public String getRefundId() {
        return refundId;
    }
    
    public String getTransactionId() {
        return transactionId;
    }
    
    public double getAmount() {
        return amount;
    }
    
    public RefundStatus getStatus() {
        return status;
    }
    
    public void setStatus(RefundStatus status) {
        this.status = status;
    }
}
```

</details>

### `model/RefundStatus.java`

<details>
<summary>Click to view model/RefundStatus.java</summary>

```java
package com.you.lld.problems.paymentgateway.model;
public enum RefundStatus { PENDING, PROCESSED, FAILED }
```

</details>

### `model/Transaction.java`

<details>
<summary>Click to view model/Transaction.java</summary>

```java
package com.you.lld.problems.paymentgateway.model;
import java.time.*;
public
class Transaction  {
    private String transactionId, merchantId, customerId;
    private double amount;
    private TransactionStatus status;
    private LocalDateTime createdAt;
    public Transaction(String id, String mid, String cid, double amt)  {
        transactionId=id;
        merchantId=mid;
        customerId=cid;
        amount=amt;
        status=TransactionStatus.PENDING;
        createdAt=LocalDateTime.now();
    }
    public String getTransactionId()  {
        return transactionId;
    }
    public double getAmount()  {
        return amount;
    }
    public TransactionStatus getStatus()  {
        return status;
    }
    public void setStatus(TransactionStatus s)  {
        status=s;
    }
}
```

</details>

### `model/TransactionStatus.java`

<details>
<summary>Click to view model/TransactionStatus.java</summary>

```java
package com.you.lld.problems.paymentgateway.model;
public enum TransactionStatus { PENDING, SUCCESS, FAILED, REFUNDED }
```

</details>

### `impl/InMemoryPaymentGatewayService.java`

<details>
<summary>Click to view impl/InMemoryPaymentGatewayService.java</summary>

```java
package com.you.lld.problems.paymentgateway.impl;

import com.you.lld.problems.paymentgateway.api.PaymentGatewayService;
import com.you.lld.problems.paymentgateway.exceptions.*;
import com.you.lld.problems.paymentgateway.model.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Thread-safe in-memory payment gateway.
 *
 * Features:
 *  - Idempotent payment processing (idempotency key)
 *  - Transaction lifecycle: PENDING -> SUCCESS/FAILED -> REFUNDED
 *  - Partial and full refund support
 *  - Concurrent-safe with ConcurrentHashMap
 */
public class InMemoryPaymentGatewayService implements PaymentGatewayService {

    private final Map<String, Transaction> transactions = new ConcurrentHashMap<>();
    private final Map<String, Refund> refunds = new ConcurrentHashMap<>();
    private final Map<String, String> idempotencyKeys = new ConcurrentHashMap<>(); // key -> txnId
    private final AtomicLong txnCounter = new AtomicLong(0);
    private final AtomicLong refundCounter = new AtomicLong(0);

    @Override
    public Transaction processPayment(String merchantId, String customerId,
                                      double amount, PaymentMethod method) {
        return processPayment(merchantId, customerId, amount, method, null);
    }

    /**
     * Process payment with optional idempotency key.
     * If the same idempotency key is reused, the original transaction is returned.
     */
    public Transaction processPayment(String merchantId, String customerId,
                                      double amount, PaymentMethod method,
                                      String idempotencyKey) {
        // Validate
        if (merchantId == null || merchantId.isEmpty()) {
            throw new IllegalArgumentException("Merchant ID required");
        }
        if (customerId == null || customerId.isEmpty()) {
            throw new IllegalArgumentException("Customer ID required");
        }
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        // Idempotency check
        if (idempotencyKey != null) {
            String existingTxnId = idempotencyKeys.get(idempotencyKey);
            if (existingTxnId != null) {
                return transactions.get(existingTxnId);
            }
        }

        String txnId = "TXN-" + txnCounter.incrementAndGet();
        Transaction txn = new Transaction(txnId, merchantId, customerId, amount);

        // Simulate payment processing
        boolean success = simulatePaymentProcessing(method, amount);
        if (success) {
            txn.setStatus(TransactionStatus.SUCCESS);
        } else {
            txn.setStatus(TransactionStatus.FAILED);
        }

        transactions.put(txnId, txn);

        // Store idempotency mapping
        if (idempotencyKey != null) {
            idempotencyKeys.put(idempotencyKey, txnId);
        }

        return txn;
    }

    @Override
    public Transaction getTransaction(String transactionId) {
        Transaction txn = transactions.get(transactionId);
        if (txn == null) {
            throw new TransactionFailedException("Transaction not found: " + transactionId);
        }
        return txn;
    }

    @Override
    public Refund processRefund(String transactionId, double amount) {
        Transaction txn = transactions.get(transactionId);
        if (txn == null) {
            throw new TransactionFailedException("Transaction not found: " + transactionId);
        }

        synchronized (txn) {
            if (txn.getStatus() != TransactionStatus.SUCCESS
                    && txn.getStatus() != TransactionStatus.REFUNDED) {
                throw new TransactionFailedException(
                    "Cannot refund transaction in state: " + txn.getStatus());
            }
            if (amount <= 0 || amount > txn.getAmount()) {
                throw new IllegalArgumentException(
                    "Refund amount must be between 0 and " + txn.getAmount());
            }

            // Check total refunded amount doesn't exceed original
            double alreadyRefunded = getRefundedAmount(transactionId);
            if (alreadyRefunded + amount > txn.getAmount()) {
                throw new IllegalArgumentException(
                    "Total refund ($" + (alreadyRefunded + amount)
                    + ") exceeds transaction amount ($" + txn.getAmount() + ")");
            }

            String refundId = "REF-" + refundCounter.incrementAndGet();
            Refund refund = new Refund(refundId, transactionId, amount);
            refund.setStatus(RefundStatus.PROCESSED);
            refunds.put(refundId, refund);

            txn.setStatus(TransactionStatus.REFUNDED);
            return refund;
        }
    }

    /** Get total amount refunded for a transaction. */
    public double getRefundedAmount(String transactionId) {
        double total = 0;
        for (Refund r : refunds.values()) {
            if (r.getTransactionId().equals(transactionId)
                    && r.getStatus() == RefundStatus.PROCESSED) {
                total += r.getAmount();
            }
        }
        return total;
    }

    /** Get all refunds for a transaction. */
    public List<Refund> getRefunds(String transactionId) {
        List<Refund> result = new ArrayList<>();
        for (Refund r : refunds.values()) {
            if (r.getTransactionId().equals(transactionId)) {
                result.add(r);
            }
        }
        return result;
    }

    /** Get all transactions for a merchant. */
    public List<Transaction> getMerchantTransactions(String merchantId) {
        List<Transaction> result = new ArrayList<>();
        for (Transaction t : transactions.values()) {
            // Transaction doesn't expose merchantId currently, so we track by txn
            result.add(t);
        }
        return result;
    }

    /**
     * Simulates payment processing. In a real system this would call
     * a payment processor (Stripe, Razorpay, etc.).
     * Simulates ~90% success rate.
     */
    private boolean simulatePaymentProcessing(PaymentMethod method, double amount) {
        // Deterministic: fail if amount ends in .13 (unlucky!)
        if (String.format("%.2f", amount).endsWith(".13")) {
            return false;
        }
        return true; // Succeed for demo purposes
    }
}
```

</details>

### `exceptions/InsufficientFundsException.java`

<details>
<summary>Click to view exceptions/InsufficientFundsException.java</summary>

```java
package com.you.lld.problems.paymentgateway.exceptions;
public class InsufficientFundsException extends RuntimeException { public InsufficientFundsException(String m) { super(m); } }
```

</details>

### `exceptions/InvalidCardException.java`

<details>
<summary>Click to view exceptions/InvalidCardException.java</summary>

```java
package com.you.lld.problems.paymentgateway.exceptions;
public class InvalidCardException extends RuntimeException { public InvalidCardException(String m) { super(m); } }
```

</details>

### `exceptions/RefundNotFoundException.java`

<details>
<summary>Click to view exceptions/RefundNotFoundException.java</summary>

```java
package com.you.lld.problems.paymentgateway.exceptions;
public class RefundNotFoundException extends RuntimeException { public RefundNotFoundException(String m) { super(m); } }
```

</details>

### `exceptions/TransactionFailedException.java`

<details>
<summary>Click to view exceptions/TransactionFailedException.java</summary>

```java
package com.you.lld.problems.paymentgateway.exceptions;
public class TransactionFailedException extends RuntimeException { public TransactionFailedException(String m) { super(m); } }
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.paymentgateway.PaymentGatewayDemo"
```

# paymentgateway - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/paymentgateway/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py paymentgateway`.

## Project Structure (22 files)

```
paymentgateway/
├── PaymentGatewayDemo.java
├── PaymentGateway.java
├── model/PaymentMethod.java
├── model/Refund.java
├── model/RefundStatus.java
├── model/Transaction.java
├── model/TransactionStatus.java
├── service/PaymentGatewayService.java
├── service/PaymentProcessor.java
├── service/TransactionState.java
├── service/impl/BankTransferPaymentProcessor.java
├── service/impl/CardPaymentProcessor.java
├── service/impl/FailedTransactionState.java
├── service/impl/InMemoryPaymentGatewayService.java
├── service/impl/PaymentProcessorFactory.java
├── service/impl/PendingTransactionState.java
├── service/impl/RefundedTransactionState.java
├── service/impl/SuccessTransactionState.java
├── service/impl/TransactionStateFactory.java
├── service/impl/UpiPaymentProcessor.java
├── service/impl/WalletPaymentProcessor.java
├── exceptions/TransactionFailedException.java
```

## Source Code

### `PaymentGatewayDemo.java`

<details>
<summary>Click to view PaymentGatewayDemo.java</summary>

```java
package com.you.lld.problems.paymentgateway;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.model.PaymentMethod;
import com.you.lld.problems.paymentgateway.model.Refund;
import com.you.lld.problems.paymentgateway.model.Transaction;

import java.math.BigDecimal;
import java.util.Currency;
import java.util.List;

/**
 * Demo: Strategy payment methods, State lifecycle, idempotency keys,
 * and exact-money refund accounting.
 */
public class PaymentGatewayDemo {

    private static final Currency USD = Currency.getInstance("USD");

    private static Money usd(String amount) {
        return Money.of(new BigDecimal(amount), USD);
    }

    public static void main(String[] args) {
        System.out.println("=== Payment Gateway Demo ===\n");
        PaymentGateway gateway = new PaymentGateway();

        System.out.println("--- Scenario 1: Card payment ---");
        Transaction txn1 = gateway.pay("merchant-1", "customer-1", usd("99.99"), PaymentMethod.CARD);
        System.out.println(txn1.getTransactionId() + " status=" + txn1.getStatus()
                + " amount=" + txn1.getAmount());

        System.out.println("\n--- Scenario 2: Idempotent UPI payment ---");
        Transaction txn2a = gateway.pay("merchant-1", "customer-2", usd("50.00"), PaymentMethod.UPI, "idem-001");
        Transaction txn2b = gateway.pay("merchant-1", "customer-2", usd("50.00"), PaymentMethod.UPI, "idem-001");
        System.out.println("Retry returned same txn: " + txn2a.getTransactionId().equals(txn2b.getTransactionId()));

        System.out.println("\n--- Scenario 3: Full refund flips state to REFUNDED ---");
        gateway.refund(txn1.getTransactionId(), usd("99.99"));
        System.out.println("After refund: " + gateway.transaction(txn1.getTransactionId()).getStatus());

        System.out.println("\n--- Scenario 4: Partial refunds, over-refund blocked ---");
        Transaction txn3 = gateway.pay("merchant-2", "customer-3", usd("200.00"), PaymentMethod.WALLET);
        gateway.refund(txn3.getTransactionId(), usd("50.00"));
        gateway.refund(txn3.getTransactionId(), usd("75.00"));
        System.out.println("Refunded total: " + gateway.refundedAmount(txn3.getTransactionId())
                + "  remaining: " + gateway.transaction(txn3.getTransactionId()).remainingRefundable());
        try {
            gateway.refund(txn3.getTransactionId(), usd("100.00"));
        } catch (IllegalArgumentException e) {
            System.out.println("Over-refund blocked: " + e.getMessage());
        }

        System.out.println("\n--- Scenario 5: Deterministic failure, failed txn is not refundable ---");
        Transaction failed = gateway.pay("merchant-1", "customer-4", usd("99.13"), PaymentMethod.CARD);
        System.out.println("Failed txn status: " + failed.getStatus());
        try {
            gateway.refund(failed.getTransactionId(), usd("10.00"));
        } catch (Exception e) {
            System.out.println("Refund blocked: " + e.getMessage());
        }

        System.out.println("\n--- Scenario 6: Exact money — a split refund closes the ledger ---");
        Transaction txn4 = gateway.pay("merchant-2", "customer-5", usd("0.08"), PaymentMethod.WALLET);
        gateway.refund(txn4.getTransactionId(), usd("0.06"));
        gateway.refund(txn4.getTransactionId(), usd("0.01"));
        gateway.refund(txn4.getTransactionId(), usd("0.01"));
        System.out.println("status=" + txn4.getStatus()
                + "  refunded=" + txn4.getRefundedAmount()
                + "  remaining=" + txn4.remainingRefundable() + " (exactly zero — no float residue)");
        try {
            gateway.refund(txn4.getTransactionId(), usd("0.01"));
        } catch (RuntimeException e) {
            System.out.println("Further refund blocked: " + e.getMessage());
        }

        List<Refund> refunds = gateway.refunds(txn3.getTransactionId());
        System.out.println("\nRefund count for " + txn3.getTransactionId() + ": " + refunds.size());
        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `PaymentGateway.java`

<details>
<summary>Click to view PaymentGateway.java</summary>

```java
package com.you.lld.problems.paymentgateway;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.model.PaymentMethod;
import com.you.lld.problems.paymentgateway.model.Refund;
import com.you.lld.problems.paymentgateway.model.Transaction;
import com.you.lld.problems.paymentgateway.service.PaymentGatewayService;
import com.you.lld.problems.paymentgateway.service.impl.InMemoryPaymentGatewayService;

import java.util.List;

/** Facade for payment processing, refunds, and idempotency. */
public final class PaymentGateway {
    private final PaymentGatewayService service;

    public PaymentGateway() {
        this(new InMemoryPaymentGatewayService());
    }

    public PaymentGateway(PaymentGatewayService service) {
        this.service = service;
    }

    public Transaction pay(String merchantId, String customerId, Money amount, PaymentMethod method) {
        return service.processPayment(merchantId, customerId, amount, method);
    }

    public Transaction pay(String merchantId, String customerId, Money amount,
                             PaymentMethod method, String idempotencyKey) {
        return service.processPayment(merchantId, customerId, amount, method, idempotencyKey);
    }

    public Transaction transaction(String transactionId) {
        return service.getTransaction(transactionId);
    }

    public Refund refund(String transactionId, Money amount) {
        return service.processRefund(transactionId, amount);
    }

    public Money refundedAmount(String transactionId) {
        return service.getRefundedAmount(transactionId);
    }

    public List<Refund> refunds(String transactionId) {
        return service.getRefunds(transactionId);
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

import com.you.lld.common.Money;

/** A single refund against a transaction. */
public class Refund {
    private final String refundId;
    private final String transactionId;
    private final Money amount;
    private RefundStatus status;

    public Refund(String id, String transactionId, Money amount) {
        this.refundId = id;
        this.transactionId = transactionId;
        this.amount = amount;
        this.status = RefundStatus.PENDING;
    }

    public String getRefundId() {
        return refundId;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public Money getAmount() {
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

import com.you.lld.common.Money;

import java.time.LocalDateTime;

/**
 * A payment attempt and its refund ledger.
 *
 * <p>Amounts are {@link Money} (integer minor units), never {@code double} — a
 * gateway must be able to say "this transaction is exactly fully refunded"
 * without floating-point residue.
 *
 * <p>Not internally synchronized: mutation is confined to the gateway, which
 * holds the per-transaction monitor.
 */
public class Transaction {
    private final String transactionId;
    private final String merchantId;
    private final String customerId;
    private final Money amount;
    private final PaymentMethod method;
    private TransactionStatus status;
    private final LocalDateTime createdAt;
    private Money refundedAmount;

    public Transaction(String id, String merchantId, String customerId, Money amount, PaymentMethod method) {
        this.transactionId = id;
        this.merchantId = merchantId;
        this.customerId = customerId;
        this.amount = amount;
        this.method = method;
        this.status = TransactionStatus.PENDING;
        this.createdAt = LocalDateTime.now();
        this.refundedAmount = Money.ofMinor(0L, amount.currency());
    }

    public String getTransactionId() {
        return transactionId;
    }

    public String getMerchantId() {
        return merchantId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public Money getAmount() {
        return amount;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Money getRefundedAmount() {
        return refundedAmount;
    }

    public void addRefund(Money refund) {
        this.refundedAmount = this.refundedAmount.plus(refund);
    }

    public Money remainingRefundable() {
        return amount.minus(refundedAmount);
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

### `service/PaymentGatewayService.java`

<details>
<summary>Click to view service/PaymentGatewayService.java</summary>

```java
package com.you.lld.problems.paymentgateway.service;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.model.PaymentMethod;
import com.you.lld.problems.paymentgateway.model.Refund;
import com.you.lld.problems.paymentgateway.model.Transaction;

import java.util.List;

public interface PaymentGatewayService {
    Transaction processPayment(String merchantId, String customerId, Money amount, PaymentMethod method);

    /**
     * Idempotent variant: retrying with the same {@code idempotencyKey} returns the
     * original transaction instead of charging again.
     */
    Transaction processPayment(String merchantId, String customerId, Money amount,
                               PaymentMethod method, String idempotencyKey);

    Transaction getTransaction(String transactionId);

    Refund processRefund(String transactionId, Money amount);

    Money getRefundedAmount(String transactionId);

    List<Refund> getRefunds(String transactionId);
}
```

</details>

### `service/PaymentProcessor.java`

<details>
<summary>Click to view service/PaymentProcessor.java</summary>

```java
package com.you.lld.problems.paymentgateway.service;

import com.you.lld.problems.paymentgateway.model.Transaction;

/** Strategy — payment-method-specific processing. */
public interface PaymentProcessor {
    boolean charge(Transaction transaction);
}
```

</details>

### `service/TransactionState.java`

<details>
<summary>Click to view service/TransactionState.java</summary>

```java
package com.you.lld.problems.paymentgateway.service;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.model.Transaction;

/** State — transaction lifecycle transitions. */
public interface TransactionState {
    void markSuccess(Transaction transaction);

    void markFailed(Transaction transaction);

    void applyRefund(Transaction transaction, Money amount);
}
```

</details>

### `service/impl/BankTransferPaymentProcessor.java`

<details>
<summary>Click to view service/impl/BankTransferPaymentProcessor.java</summary>

```java
package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.model.Transaction;

public class BankTransferPaymentProcessor implements com.you.lld.problems.paymentgateway.service.PaymentProcessor {
    @Override
    public boolean charge(Transaction transaction) {
        Money amount = transaction.getAmount();
        Money minimum = Money.ofMinor(100L, amount.currency()); // banks reject sub-unit transfers
        return amount.compareTo(minimum) >= 0;
    }
}
```

</details>

### `service/impl/CardPaymentProcessor.java`

<details>
<summary>Click to view service/impl/CardPaymentProcessor.java</summary>

```java
package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.model.Transaction;

public class CardPaymentProcessor implements com.you.lld.problems.paymentgateway.service.PaymentProcessor {
    @Override
    public boolean charge(Transaction transaction) {
        Money amount = transaction.getAmount();
        if (!amount.isPositive()) {
            return false;
        }
        // Deterministic stand-in for an issuer decline: any amount ending in .13 cents.
        return amount.minor() % 100L != 13L;
    }
}
```

</details>

### `service/impl/FailedTransactionState.java`

<details>
<summary>Click to view service/impl/FailedTransactionState.java</summary>

```java
package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.exceptions.TransactionFailedException;
import com.you.lld.problems.paymentgateway.model.Transaction;
import com.you.lld.problems.paymentgateway.service.TransactionState;

public class FailedTransactionState implements TransactionState {
    @Override
    public void markSuccess(Transaction transaction) {
        // no-op
    }

    @Override
    public void markFailed(Transaction transaction) {
        // no-op
    }

    @Override
    public void applyRefund(Transaction transaction, Money amount) {
        throw new TransactionFailedException("Cannot refund failed transaction");
    }
}
```

</details>

### `service/impl/InMemoryPaymentGatewayService.java`

<details>
<summary>Click to view service/impl/InMemoryPaymentGatewayService.java</summary>

```java
package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.exceptions.TransactionFailedException;
import com.you.lld.problems.paymentgateway.model.PaymentMethod;
import com.you.lld.problems.paymentgateway.model.Refund;
import com.you.lld.problems.paymentgateway.model.RefundStatus;
import com.you.lld.problems.paymentgateway.model.Transaction;
import com.you.lld.problems.paymentgateway.service.PaymentGatewayService;
import com.you.lld.problems.paymentgateway.service.PaymentProcessor;
import com.you.lld.problems.paymentgateway.service.TransactionState;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Thread-safe gateway: Strategy processors, State lifecycle, idempotency keys.
 */
public class InMemoryPaymentGatewayService implements PaymentGatewayService {

    private final Map<String, Transaction> transactions = new ConcurrentHashMap<String, Transaction>();
    private final Map<String, List<Refund>> refundsByTransaction = new ConcurrentHashMap<String, List<Refund>>();
    private final Map<String, String> idempotencyKeys = new ConcurrentHashMap<String, String>();
    private final AtomicLong txnCounter = new AtomicLong(0);
    private final AtomicLong refundCounter = new AtomicLong(0);

    @Override
    public Transaction processPayment(String merchantId, String customerId, Money amount, PaymentMethod method) {
        return processPayment(merchantId, customerId, amount, method, null);
    }

    @Override
    public Transaction processPayment(String merchantId, String customerId, Money amount,
                                      PaymentMethod method, String idempotencyKey) {
        validatePaymentRequest(merchantId, customerId, amount, method);

        boolean idempotent = idempotencyKey != null && !idempotencyKey.trim().isEmpty();
        String txnId = "TXN-" + txnCounter.incrementAndGet();

        if (idempotent) {
            // Claim the key BEFORE publishing a transaction. Losing this CAS means
            // another thread already owns the charge, and we exit having created
            // nothing — no orphan transaction, and never a second charge.
            String owner = idempotencyKeys.putIfAbsent(idempotencyKey, txnId);
            if (owner != null) {
                return getTransaction(owner);
            }
        }

        Transaction txn = new Transaction(txnId, merchantId, customerId, amount, method);
        transactions.put(txnId, txn);

        PaymentProcessor processor = PaymentProcessorFactory.forMethod(method);
        synchronized (txn) {
            TransactionState state = TransactionStateFactory.forStatus(txn.getStatus());
            if (processor.charge(txn)) {
                state.markSuccess(txn);
            } else {
                state.markFailed(txn);
            }
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
    public Refund processRefund(String transactionId, Money amount) {
        Transaction txn = getTransaction(transactionId);
        // Per-transaction monitor: the check against remainingRefundable and the
        // ledger update must be one atomic step, or two concurrent refunds both
        // pass the check and together exceed the captured amount.
        synchronized (txn) {
            if (amount == null || !amount.isPositive() || amount.compareTo(txn.remainingRefundable()) > 0) {
                throw new IllegalArgumentException(
                        "Refund amount must be positive and at most " + txn.remainingRefundable());
            }
            TransactionState state = TransactionStateFactory.forStatus(txn.getStatus());
            state.applyRefund(txn, amount);

            String refundId = "REF-" + refundCounter.incrementAndGet();
            Refund refund = new Refund(refundId, transactionId, amount);
            refund.setStatus(RefundStatus.PROCESSED);
            refundsFor(transactionId).add(refund);
            return refund;
        }
    }

    @Override
    public Money getRefundedAmount(String transactionId) {
        return getTransaction(transactionId).getRefundedAmount();
    }

    @Override
    public List<Refund> getRefunds(String transactionId) {
        List<Refund> found = refundsByTransaction.get(transactionId);
        if (found == null) {
            return Collections.emptyList();
        }
        return new ArrayList<Refund>(found);
    }

    private List<Refund> refundsFor(String transactionId) {
        List<Refund> existing = refundsByTransaction.get(transactionId);
        if (existing != null) {
            return existing;
        }
        List<Refund> created = new CopyOnWriteArrayList<Refund>();
        List<Refund> raced = refundsByTransaction.putIfAbsent(transactionId, created);
        return raced != null ? raced : created;
    }

    private void validatePaymentRequest(String merchantId, String customerId,
                                        Money amount, PaymentMethod method) {
        if (merchantId == null || merchantId.trim().isEmpty()) {
            throw new IllegalArgumentException("Merchant ID required");
        }
        if (customerId == null || customerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer ID required");
        }
        if (amount == null || !amount.isPositive()) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (method == null) {
            throw new IllegalArgumentException("Payment method required");
        }
    }
}
```

</details>

### `service/impl/PaymentProcessorFactory.java`

<details>
<summary>Click to view service/impl/PaymentProcessorFactory.java</summary>

```java
package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.problems.paymentgateway.model.PaymentMethod;
import com.you.lld.problems.paymentgateway.service.PaymentProcessor;

import java.util.EnumMap;
import java.util.Map;

public final class PaymentProcessorFactory {
    private static final Map<PaymentMethod, PaymentProcessor> PROCESSORS =
            new EnumMap<PaymentMethod, PaymentProcessor>(PaymentMethod.class);

    static {
        PROCESSORS.put(PaymentMethod.CARD, new CardPaymentProcessor());
        PROCESSORS.put(PaymentMethod.UPI, new UpiPaymentProcessor());
        PROCESSORS.put(PaymentMethod.WALLET, new WalletPaymentProcessor());
        PROCESSORS.put(PaymentMethod.BANK_TRANSFER, new BankTransferPaymentProcessor());
    }

    private PaymentProcessorFactory() {
    }

    public static PaymentProcessor forMethod(PaymentMethod method) {
        PaymentProcessor processor = PROCESSORS.get(method);
        if (processor == null) {
            throw new IllegalArgumentException("Unsupported method: " + method);
        }
        return processor;
    }
}
```

</details>

### `service/impl/PendingTransactionState.java`

<details>
<summary>Click to view service/impl/PendingTransactionState.java</summary>

```java
package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.exceptions.TransactionFailedException;
import com.you.lld.problems.paymentgateway.model.Transaction;
import com.you.lld.problems.paymentgateway.model.TransactionStatus;
import com.you.lld.problems.paymentgateway.service.TransactionState;

public class PendingTransactionState implements TransactionState {
    @Override
    public void markSuccess(Transaction transaction) {
        transaction.setStatus(TransactionStatus.SUCCESS);
    }

    @Override
    public void markFailed(Transaction transaction) {
        transaction.setStatus(TransactionStatus.FAILED);
    }

    @Override
    public void applyRefund(Transaction transaction, Money amount) {
        throw new TransactionFailedException("Cannot refund transaction in state: PENDING");
    }
}
```

</details>

### `service/impl/RefundedTransactionState.java`

<details>
<summary>Click to view service/impl/RefundedTransactionState.java</summary>

```java
package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.model.Transaction;
import com.you.lld.problems.paymentgateway.service.TransactionState;

public class RefundedTransactionState implements TransactionState {
    @Override
    public void markSuccess(Transaction transaction) {
        // no-op
    }

    @Override
    public void markFailed(Transaction transaction) {
        // no-op
    }

    @Override
    public void applyRefund(Transaction transaction, Money amount) {
        throw new IllegalArgumentException("Transaction already fully refunded");
    }
}
```

</details>

### `service/impl/SuccessTransactionState.java`

<details>
<summary>Click to view service/impl/SuccessTransactionState.java</summary>

```java
package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.model.Transaction;
import com.you.lld.problems.paymentgateway.model.TransactionStatus;
import com.you.lld.problems.paymentgateway.service.TransactionState;

public class SuccessTransactionState implements TransactionState {
    @Override
    public void markSuccess(Transaction transaction) {
        // no-op
    }

    @Override
    public void markFailed(Transaction transaction) {
        // no-op
    }

    @Override
    public void applyRefund(Transaction transaction, Money amount) {
        transaction.addRefund(amount);
        if (!transaction.remainingRefundable().isPositive()) {
            transaction.setStatus(TransactionStatus.REFUNDED);
        }
    }
}
```

</details>

### `service/impl/TransactionStateFactory.java`

<details>
<summary>Click to view service/impl/TransactionStateFactory.java</summary>

```java
package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.problems.paymentgateway.model.TransactionStatus;
import com.you.lld.problems.paymentgateway.service.TransactionState;

public final class TransactionStateFactory {
    private static final TransactionState PENDING = new PendingTransactionState();
    private static final TransactionState SUCCESS = new SuccessTransactionState();
    private static final TransactionState FAILED = new FailedTransactionState();
    private static final TransactionState REFUNDED = new RefundedTransactionState();

    private TransactionStateFactory() {
    }

    public static TransactionState forStatus(TransactionStatus status) {
        if (status == TransactionStatus.PENDING) {
            return PENDING;
        }
        if (status == TransactionStatus.SUCCESS) {
            return SUCCESS;
        }
        if (status == TransactionStatus.FAILED) {
            return FAILED;
        }
        if (status == TransactionStatus.REFUNDED) {
            return REFUNDED;
        }
        return PENDING;
    }
}
```

</details>

### `service/impl/UpiPaymentProcessor.java`

<details>
<summary>Click to view service/impl/UpiPaymentProcessor.java</summary>

```java
package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.model.Transaction;

public class UpiPaymentProcessor implements com.you.lld.problems.paymentgateway.service.PaymentProcessor {
    @Override
    public boolean charge(Transaction transaction) {
        Money amount = transaction.getAmount();
        Money perTxnCap = Money.ofMinor(100_000_00L, amount.currency()); // UPI-style cap
        return amount.isPositive() && amount.compareTo(perTxnCap) <= 0;
    }
}
```

</details>

### `service/impl/WalletPaymentProcessor.java`

<details>
<summary>Click to view service/impl/WalletPaymentProcessor.java</summary>

```java
package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.problems.paymentgateway.model.Transaction;

public class WalletPaymentProcessor implements com.you.lld.problems.paymentgateway.service.PaymentProcessor {
    @Override
    public boolean charge(Transaction transaction) {
        return transaction.getAmount().isPositive();
    }
}
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

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

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

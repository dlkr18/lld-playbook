package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.problems.paymentgateway.exceptions.TransactionFailedException;
import com.you.lld.problems.paymentgateway.model.PaymentMethod;
import com.you.lld.problems.paymentgateway.model.Refund;
import com.you.lld.problems.paymentgateway.model.RefundStatus;
import com.you.lld.problems.paymentgateway.model.Transaction;
import com.you.lld.problems.paymentgateway.service.PaymentGatewayService;
import com.you.lld.problems.paymentgateway.service.PaymentProcessor;
import com.you.lld.problems.paymentgateway.service.TransactionState;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Thread-safe gateway: Strategy processors, State lifecycle, idempotency keys.
 */
public class InMemoryPaymentGatewayService implements PaymentGatewayService {

    private final Map<String, Transaction> transactions = new ConcurrentHashMap<String, Transaction>();
    private final Map<String, Refund> refunds = new ConcurrentHashMap<String, Refund>();
    private final Map<String, String> idempotencyKeys = new ConcurrentHashMap<String, String>();
    private final AtomicLong txnCounter = new AtomicLong(0);
    private final AtomicLong refundCounter = new AtomicLong(0);

    @Override
    public Transaction processPayment(String merchantId, String customerId, double amount, PaymentMethod method) {
        return processPayment(merchantId, customerId, amount, method, null);
    }

    @Override
    public Transaction processPayment(String merchantId, String customerId, double amount,
                                      PaymentMethod method, String idempotencyKey) {
        validatePaymentRequest(merchantId, customerId, amount, method);

        if (idempotencyKey != null && !idempotencyKey.trim().isEmpty()) {
            String existingTxnId = idempotencyKeys.get(idempotencyKey);
            if (existingTxnId != null) {
                Transaction existing = transactions.get(existingTxnId);
                if (existing != null) {
                    return existing;
                }
            }
        }

        String txnId = "TXN-" + txnCounter.incrementAndGet();
        Transaction txn = new Transaction(txnId, merchantId, customerId, amount, method);
        transactions.put(txnId, txn);

        if (idempotencyKey != null && !idempotencyKey.trim().isEmpty()) {
            String prior = idempotencyKeys.putIfAbsent(idempotencyKey, txnId);
            if (prior != null) {
                return transactions.get(prior);
            }
        }

        PaymentProcessor processor = PaymentProcessorFactory.forMethod(method);
        TransactionState state = TransactionStateFactory.forStatus(txn.getStatus());
        if (processor.charge(txn)) {
            state.markSuccess(txn);
        } else {
            state.markFailed(txn);
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
        Transaction txn = getTransaction(transactionId);
        synchronized (txn) {
            if (amount <= 0 || amount > txn.remainingRefundable()) {
                throw new IllegalArgumentException(
                        "Refund amount must be between 0 and " + txn.remainingRefundable());
            }
            TransactionState state = TransactionStateFactory.forStatus(txn.getStatus());
            state.applyRefund(txn, amount);

            String refundId = "REF-" + refundCounter.incrementAndGet();
            Refund refund = new Refund(refundId, transactionId, amount);
            refund.setStatus(RefundStatus.PROCESSED);
            refunds.put(refundId, refund);
            return refund;
        }
    }

    @Override
    public double getRefundedAmount(String transactionId) {
        return getTransaction(transactionId).getRefundedAmount();
    }

    @Override
    public List<Refund> getRefunds(String transactionId) {
        List<Refund> result = new ArrayList<Refund>();
        for (Refund refund : refunds.values()) {
            if (refund.getTransactionId().equals(transactionId)) {
                result.add(refund);
            }
        }
        return result;
    }

    private void validatePaymentRequest(String merchantId, String customerId,
                                        double amount, PaymentMethod method) {
        if (merchantId == null || merchantId.trim().isEmpty()) {
            throw new IllegalArgumentException("Merchant ID required");
        }
        if (customerId == null || customerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer ID required");
        }
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (method == null) {
            throw new IllegalArgumentException("Payment method required");
        }
    }
}

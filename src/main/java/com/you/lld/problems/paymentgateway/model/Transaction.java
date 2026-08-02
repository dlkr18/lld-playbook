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

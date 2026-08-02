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

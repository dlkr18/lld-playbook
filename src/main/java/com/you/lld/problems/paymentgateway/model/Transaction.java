package com.you.lld.problems.paymentgateway.model;

import java.time.LocalDateTime;

public class Transaction {
    private final String transactionId;
    private final String merchantId;
    private final String customerId;
    private final double amount;
    private final PaymentMethod method;
    private TransactionStatus status;
    private final LocalDateTime createdAt;
    private double refundedAmount;

    public Transaction(String id, String merchantId, String customerId, double amount, PaymentMethod method) {
        this.transactionId = id;
        this.merchantId = merchantId;
        this.customerId = customerId;
        this.amount = amount;
        this.method = method;
        this.status = TransactionStatus.PENDING;
        this.createdAt = LocalDateTime.now();
        this.refundedAmount = 0.0;
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

    public double getAmount() {
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

    public double getRefundedAmount() {
        return refundedAmount;
    }

    public void addRefund(double amount) {
        this.refundedAmount += amount;
    }

    public double remainingRefundable() {
        return amount - refundedAmount;
    }
}

package com.you.lld.problems.amazon.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Payment {
    private final String id;
    private final String orderId;
    private final String userId;
    private final BigDecimal amount;
    private final PaymentMethod method;
    private PaymentStatus status;
    private LocalDateTime paymentDate;
    private String transactionId;
    
    public Payment(String id, String orderId, String userId, BigDecimal amount, PaymentMethod method) {
        this.id = id;
        this.orderId = orderId;
        this.userId = userId;
        this.amount = amount;
        this.method = method;
        this.status = PaymentStatus.PENDING;
    }
    
    public void process(String transactionId) {
        this.transactionId = transactionId;
        this.status = PaymentStatus.PROCESSING;
        this.paymentDate = LocalDateTime.now();
    }
    
    public void confirm() {
        if (status != PaymentStatus.PROCESSING) {
            throw new IllegalStateException("Payment must be processing before confirmation");
        }
        this.status = PaymentStatus.COMPLETED;
    }
    
    public void fail() {
        this.status = PaymentStatus.FAILED;
    }
    
    public void refund() {
        if (status != PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Can only refund completed payments");
        }
        this.status = PaymentStatus.REFUNDED;
    }
    
    public String getId() { return id; }
    public String getOrderId() { return orderId; }
    public String getUserId() { return userId; }
    public BigDecimal getAmount() { return amount; }
    public PaymentMethod getMethod() { return method; }
    public PaymentStatus getStatus() { return status; }
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public String getTransactionId() { return transactionId; }
    
    @Override
    public String toString() {
        return "Payment{id='" + id + "', orderId='" + orderId + "', amount=" + amount + 
               ", method=" + method + ", status=" + status + "}";
    }
}



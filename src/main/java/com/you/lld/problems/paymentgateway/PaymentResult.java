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

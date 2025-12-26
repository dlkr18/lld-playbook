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

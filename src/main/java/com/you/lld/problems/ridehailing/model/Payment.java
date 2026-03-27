package com.you.lld.problems.ridehailing.model;

import java.time.LocalDateTime;

/**
 * Payment for a completed or cancelled trip.
 * Tracks lifecycle: PENDING -> COMPLETED / FAILED / REFUNDED.
 */
public class Payment {
    private final String paymentId;
    private final String tripId;
    private final double amount;
    private final LocalDateTime createdAt;
    private PaymentStatus status;

    public Payment(String paymentId, String tripId, double amount) {
        this.paymentId = paymentId;
        this.tripId = tripId;
        this.amount = amount;
        this.createdAt = LocalDateTime.now();
        this.status = PaymentStatus.PENDING;
    }

    public void complete() { this.status = PaymentStatus.COMPLETED; }
    public void fail() { this.status = PaymentStatus.FAILED; }
    public void refund() { this.status = PaymentStatus.REFUNDED; }

    public String getPaymentId() { return paymentId; }
    public String getTripId() { return tripId; }
    public double getAmount() { return amount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public PaymentStatus getStatus() { return status; }

    @Override
    public String toString() {
        return "Payment[" + paymentId + "] $" + String.format("%.2f", amount)
                + " (" + status + ")";
    }
}

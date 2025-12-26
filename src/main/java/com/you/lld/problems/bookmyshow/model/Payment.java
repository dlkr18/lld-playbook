package com.you.lld.problems.bookmyshow.model;

import java.time.LocalDateTime;

public class Payment {
    private final String id;
    private final String bookingId;
    private final double amount;
    private final PaymentMethod method;
    private final LocalDateTime paymentTime;
    private PaymentStatus status;

    public Payment(String id, String bookingId, double amount, 
                   PaymentMethod method, LocalDateTime paymentTime) {
        this.id = id;
        this.bookingId = bookingId;
        this.amount = amount;
        this.method = method;
        this.paymentTime = paymentTime;
        this.status = PaymentStatus.PENDING;
    }

    public String getId() { return id; }
    public String getBookingId() { return bookingId; }
    public double getAmount() { return amount; }
    public PaymentMethod getMethod() { return method; }
    public LocalDateTime getPaymentTime() { return paymentTime; }
    public PaymentStatus getStatus() { return status; }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Payment{id='" + id + "', amount=" + amount + ", method=" + method + ", status=" + status + '}';
    }
}

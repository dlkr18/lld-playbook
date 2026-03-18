package com.you.lld.problems.amazon.impl;

import com.you.lld.problems.amazon.api.PaymentService;
import com.you.lld.problems.amazon.model.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe in-memory payment service.
 */
public class PaymentServiceImpl implements PaymentService {

    private final Map<String, Payment> payments = new ConcurrentHashMap<>();

    @Override
    public Payment initiatePayment(String orderId, String userId, BigDecimal amount, PaymentMethod method) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        String paymentId = "PAY-" + UUID.randomUUID().toString().substring(0, 8);
        Payment payment = new Payment(paymentId, orderId, userId, amount, method);
        payments.put(paymentId, payment);
        return payment;
    }

    @Override
    public void processPayment(String paymentId, String transactionId) {
        Payment payment = getPaymentOrThrow(paymentId);
        payment.process(transactionId);
    }

    @Override
    public void confirmPayment(String paymentId) {
        Payment payment = getPaymentOrThrow(paymentId);
        payment.confirm();
    }

    @Override
    public void failPayment(String paymentId) {
        Payment payment = getPaymentOrThrow(paymentId);
        payment.fail();
    }

    @Override
    public void refundPayment(String paymentId) {
        Payment payment = getPaymentOrThrow(paymentId);
        payment.refund();
    }

    @Override
    public Payment getPayment(String paymentId) {
        return payments.get(paymentId);
    }

    @Override
    public PaymentStatus getPaymentStatus(String paymentId) {
        Payment payment = getPaymentOrThrow(paymentId);
        return payment.getStatus();
    }

    private Payment getPaymentOrThrow(String paymentId) {
        Payment payment = payments.get(paymentId);
        if (payment == null) {
            throw new IllegalArgumentException("Payment not found: " + paymentId);
        }
        return payment;
    }
}

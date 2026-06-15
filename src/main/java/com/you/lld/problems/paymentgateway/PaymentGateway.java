package com.you.lld.problems.paymentgateway;

import com.you.lld.problems.paymentgateway.model.PaymentMethod;
import com.you.lld.problems.paymentgateway.model.Refund;
import com.you.lld.problems.paymentgateway.model.Transaction;
import com.you.lld.problems.paymentgateway.service.PaymentGatewayService;
import com.you.lld.problems.paymentgateway.service.impl.InMemoryPaymentGatewayService;

import java.util.List;

/** Facade for payment processing, refunds, and idempotency. */
public final class PaymentGateway {
    private final PaymentGatewayService service;

    public PaymentGateway() {
        this(new InMemoryPaymentGatewayService());
    }

    public PaymentGateway(PaymentGatewayService service) {
        this.service = service;
    }

    public Transaction pay(String merchantId, String customerId, double amount, PaymentMethod method) {
        return service.processPayment(merchantId, customerId, amount, method);
    }

    public Transaction pay(String merchantId, String customerId, double amount,
                             PaymentMethod method, String idempotencyKey) {
        return service.processPayment(merchantId, customerId, amount, method, idempotencyKey);
    }

    public Transaction transaction(String transactionId) {
        return service.getTransaction(transactionId);
    }

    public Refund refund(String transactionId, double amount) {
        return service.processRefund(transactionId, amount);
    }

    public double refundedAmount(String transactionId) {
        return service.getRefundedAmount(transactionId);
    }

    public List<Refund> refunds(String transactionId) {
        return service.getRefunds(transactionId);
    }
}

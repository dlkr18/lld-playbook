package com.you.lld.problems.paymentgateway.service;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.model.PaymentMethod;
import com.you.lld.problems.paymentgateway.model.Refund;
import com.you.lld.problems.paymentgateway.model.Transaction;

import java.util.List;

public interface PaymentGatewayService {
    Transaction processPayment(String merchantId, String customerId, Money amount, PaymentMethod method);

    /**
     * Idempotent variant: retrying with the same {@code idempotencyKey} returns the
     * original transaction instead of charging again.
     */
    Transaction processPayment(String merchantId, String customerId, Money amount,
                               PaymentMethod method, String idempotencyKey);

    Transaction getTransaction(String transactionId);

    Refund processRefund(String transactionId, Money amount);

    Money getRefundedAmount(String transactionId);

    List<Refund> getRefunds(String transactionId);
}

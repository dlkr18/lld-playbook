package com.you.lld.problems.paymentgateway.service;

import com.you.lld.problems.paymentgateway.model.PaymentMethod;
import com.you.lld.problems.paymentgateway.model.Refund;
import com.you.lld.problems.paymentgateway.model.Transaction;

import java.util.List;

public interface PaymentGatewayService {
    Transaction processPayment(String merchantId, String customerId, double amount, PaymentMethod method);
    Transaction processPayment(String merchantId, String customerId, double amount,
                               PaymentMethod method, String idempotencyKey);
    Transaction getTransaction(String transactionId);
    Refund processRefund(String transactionId, double amount);
    double getRefundedAmount(String transactionId);
    List<Refund> getRefunds(String transactionId);
}

package com.you.lld.problems.paymentgateway.api;
import com.you.lld.problems.paymentgateway.model.*;
public interface PaymentGatewayService { Transaction processPayment(String merchantId, String customerId, double amount, PaymentMethod method); Transaction getTransaction(String transactionId); Refund processRefund(String transactionId, double amount); }
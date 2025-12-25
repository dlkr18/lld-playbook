package com.you.lld.problems.paymentgateway;
import com.you.lld.problems.paymentgateway.api.*;
import com.you.lld.problems.paymentgateway.impl.*;
import com.you.lld.problems.paymentgateway.model.*;
public class PaymentGatewayDemo { public static void main(String[] args) { System.out.println("Payment Gateway Demo"); PaymentGatewayService service = new InMemoryPaymentGatewayService(); Transaction txn = service.processPayment("M1","C1",99.99,PaymentMethod.CARD); System.out.println("Transaction " + txn.getTransactionId() + ": " + txn.getStatus()); Refund refund = service.processRefund(txn.getTransactionId(), 50.0); System.out.println("Refund processed"); } }
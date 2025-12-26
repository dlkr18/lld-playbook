package com.you.lld.problems.paymentgateway;

import com.you.lld.problems.paymentgateway.api.*;
import com.you.lld.problems.paymentgateway.impl.*;
import com.you.lld.problems.paymentgateway.model.*;

public class PaymentGatewayDemo {
    public static void main(String[] args) {
        System.out.println("=== Payment Gateway System Demo ===\n");
        
        PaymentGatewayService service = new InMemoryPaymentGatewayService();
        
        // Process a payment
        Transaction txn = service.processPayment("M1", "C1", 99.99, PaymentMethod.CARD);
        System.out.println("✅ Transaction " + txn.getTransactionId() + ": " + txn.getStatus());
        
        // Process a refund
        Refund refund = service.processRefund(txn.getTransactionId(), 50.0);
        System.out.println("✅ Refund processed: $" + refund.getAmount());
        
        System.out.println("\n✅ Demo completed successfully!");
    }
}
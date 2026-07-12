package com.you.lld.problems.paymentgateway;

import com.you.lld.problems.paymentgateway.model.PaymentMethod;
import com.you.lld.problems.paymentgateway.model.Transaction;

import java.util.List;

/**
 * Demo: Strategy payment methods, State lifecycle, idempotency keys.
 */
public class PaymentGatewayDemo {

    public static void main(String[] args) {
        System.out.println("=== Payment Gateway Demo ===\n");
        PaymentGateway gateway = new PaymentGateway();

        System.out.println("--- Scenario 1: Card payment ---");
        Transaction txn1 = gateway.pay("merchant-1", "customer-1", 99.99, PaymentMethod.CARD);
        System.out.println(txn1.getTransactionId() + " status=" + txn1.getStatus());

        System.out.println("\n--- Scenario 2: Idempotent UPI payment ---");
        Transaction txn2a = gateway.pay("merchant-1", "customer-2", 50.00, PaymentMethod.UPI, "idem-001");
        Transaction txn2b = gateway.pay("merchant-1", "customer-2", 50.00, PaymentMethod.UPI, "idem-001");
        System.out.println("Same txn: " + txn2a.getTransactionId().equals(txn2b.getTransactionId()));

        System.out.println("\n--- Scenario 3: Full refund ---");
        gateway.refund(txn1.getTransactionId(), 99.99);
        System.out.println("After refund: " + gateway.transaction(txn1.getTransactionId()).getStatus());

        System.out.println("\n--- Scenario 4: Partial refunds ---");
        Transaction txn3 = gateway.pay("merchant-2", "customer-3", 200.00, PaymentMethod.WALLET);
        gateway.refund(txn3.getTransactionId(), 50.00);
        gateway.refund(txn3.getTransactionId(), 75.00);
        System.out.println("Refunded total: $" + gateway.refundedAmount(txn3.getTransactionId()));
        try {
            gateway.refund(txn3.getTransactionId(), 100.00);
        } catch (IllegalArgumentException e) {
            System.out.println("Over-refund blocked: " + e.getMessage());
        }

        System.out.println("\n--- Scenario 5: Deterministic failure ---");
        Transaction failed = gateway.pay("merchant-1", "customer-4", 99.13, PaymentMethod.CARD);
        System.out.println("Failed txn status: " + failed.getStatus());
        try {
            gateway.refund(failed.getTransactionId(), 10.0);
        } catch (Exception e) {
            System.out.println("Refund blocked: " + e.getMessage());
        }

        List<com.you.lld.problems.paymentgateway.model.Refund> refunds = gateway.refunds(txn3.getTransactionId());
        System.out.println("Refund count for " + txn3.getTransactionId() + ": " + refunds.size());
        System.out.println("\n=== Demo complete ===");
    }
}

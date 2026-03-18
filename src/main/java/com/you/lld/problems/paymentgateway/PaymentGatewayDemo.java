package com.you.lld.problems.paymentgateway;

import com.you.lld.problems.paymentgateway.impl.InMemoryPaymentGatewayService;
import com.you.lld.problems.paymentgateway.model.*;

import java.util.List;

/**
 * Demo: Payment Gateway with idempotency, refunds, status tracking.
 */
public class PaymentGatewayDemo {

    public static void main(String[] args) {
        System.out.println("=== Payment Gateway Demo ===\n");

        InMemoryPaymentGatewayService service = new InMemoryPaymentGatewayService();

        // --- Scenario 1: Successful payment ---
        System.out.println("--- Scenario 1: Process payment ---");
        Transaction txn1 = service.processPayment("merchant-1", "customer-1", 99.99, PaymentMethod.CARD);
        System.out.println("Transaction: " + txn1.getTransactionId() + " status=" + txn1.getStatus());

        // --- Scenario 2: Idempotency ---
        System.out.println("\n--- Scenario 2: Idempotent payment ---");
        Transaction txn2a = service.processPayment("merchant-1", "customer-2", 50.00, PaymentMethod.UPI, "idem-key-001");
        Transaction txn2b = service.processPayment("merchant-1", "customer-2", 50.00, PaymentMethod.UPI, "idem-key-001");
        System.out.println("First call:  " + txn2a.getTransactionId());
        System.out.println("Second call: " + txn2b.getTransactionId());
        System.out.println("Same txn? " + txn2a.getTransactionId().equals(txn2b.getTransactionId()));

        // --- Scenario 3: Full refund ---
        System.out.println("\n--- Scenario 3: Full refund ---");
        Refund refund1 = service.processRefund(txn1.getTransactionId(), 99.99);
        System.out.println("Refund: " + refund1.getRefundId() + " amount=$" + refund1.getAmount()
            + " status=" + refund1.getStatus());
        System.out.println("Transaction status after refund: " + service.getTransaction(txn1.getTransactionId()).getStatus());

        // --- Scenario 4: Partial refund ---
        System.out.println("\n--- Scenario 4: Partial refund ---");
        Transaction txn3 = service.processPayment("merchant-2", "customer-3", 200.00, PaymentMethod.WALLET);
        Refund partial1 = service.processRefund(txn3.getTransactionId(), 50.00);
        Refund partial2 = service.processRefund(txn3.getTransactionId(), 75.00);
        System.out.println("Refund 1: $" + partial1.getAmount());
        System.out.println("Refund 2: $" + partial2.getAmount());
        System.out.println("Total refunded: $" + service.getRefundedAmount(txn3.getTransactionId()));

        // Try to over-refund
        try {
            service.processRefund(txn3.getTransactionId(), 100.00);
        } catch (IllegalArgumentException e) {
            System.out.println("Over-refund blocked: " + e.getMessage());
        }

        // --- Scenario 5: Payment failure ---
        System.out.println("\n--- Scenario 5: Failed payment ---");
        Transaction txnFail = service.processPayment("merchant-1", "customer-4", 99.13, PaymentMethod.CARD);
        System.out.println("Status: " + txnFail.getStatus());

        // Cannot refund failed payment
        try {
            service.processRefund(txnFail.getTransactionId(), 50.0);
        } catch (Exception e) {
            System.out.println("Refund of failed txn blocked: " + e.getMessage());
        }

        // --- Scenario 6: Get transaction ---
        System.out.println("\n--- Scenario 6: Lookup ---");
        Transaction fetched = service.getTransaction(txn1.getTransactionId());
        System.out.println("Fetched: " + fetched.getTransactionId() + " $" + fetched.getAmount());

        List<Refund> allRefunds = service.getRefunds(txn3.getTransactionId());
        System.out.println("Refunds for " + txn3.getTransactionId() + ": " + allRefunds.size());

        System.out.println("\n=== Demo complete ===");
    }
}

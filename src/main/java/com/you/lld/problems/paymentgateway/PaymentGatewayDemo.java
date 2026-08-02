package com.you.lld.problems.paymentgateway;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.model.PaymentMethod;
import com.you.lld.problems.paymentgateway.model.Refund;
import com.you.lld.problems.paymentgateway.model.Transaction;

import java.math.BigDecimal;
import java.util.Currency;
import java.util.List;

/**
 * Demo: Strategy payment methods, State lifecycle, idempotency keys,
 * and exact-money refund accounting.
 */
public class PaymentGatewayDemo {

    private static final Currency USD = Currency.getInstance("USD");

    private static Money usd(String amount) {
        return Money.of(new BigDecimal(amount), USD);
    }

    public static void main(String[] args) {
        System.out.println("=== Payment Gateway Demo ===\n");
        PaymentGateway gateway = new PaymentGateway();

        System.out.println("--- Scenario 1: Card payment ---");
        Transaction txn1 = gateway.pay("merchant-1", "customer-1", usd("99.99"), PaymentMethod.CARD);
        System.out.println(txn1.getTransactionId() + " status=" + txn1.getStatus()
                + " amount=" + txn1.getAmount());

        System.out.println("\n--- Scenario 2: Idempotent UPI payment ---");
        Transaction txn2a = gateway.pay("merchant-1", "customer-2", usd("50.00"), PaymentMethod.UPI, "idem-001");
        Transaction txn2b = gateway.pay("merchant-1", "customer-2", usd("50.00"), PaymentMethod.UPI, "idem-001");
        System.out.println("Retry returned same txn: " + txn2a.getTransactionId().equals(txn2b.getTransactionId()));

        System.out.println("\n--- Scenario 3: Full refund flips state to REFUNDED ---");
        gateway.refund(txn1.getTransactionId(), usd("99.99"));
        System.out.println("After refund: " + gateway.transaction(txn1.getTransactionId()).getStatus());

        System.out.println("\n--- Scenario 4: Partial refunds, over-refund blocked ---");
        Transaction txn3 = gateway.pay("merchant-2", "customer-3", usd("200.00"), PaymentMethod.WALLET);
        gateway.refund(txn3.getTransactionId(), usd("50.00"));
        gateway.refund(txn3.getTransactionId(), usd("75.00"));
        System.out.println("Refunded total: " + gateway.refundedAmount(txn3.getTransactionId())
                + "  remaining: " + gateway.transaction(txn3.getTransactionId()).remainingRefundable());
        try {
            gateway.refund(txn3.getTransactionId(), usd("100.00"));
        } catch (IllegalArgumentException e) {
            System.out.println("Over-refund blocked: " + e.getMessage());
        }

        System.out.println("\n--- Scenario 5: Deterministic failure, failed txn is not refundable ---");
        Transaction failed = gateway.pay("merchant-1", "customer-4", usd("99.13"), PaymentMethod.CARD);
        System.out.println("Failed txn status: " + failed.getStatus());
        try {
            gateway.refund(failed.getTransactionId(), usd("10.00"));
        } catch (Exception e) {
            System.out.println("Refund blocked: " + e.getMessage());
        }

        System.out.println("\n--- Scenario 6: Exact money — a split refund closes the ledger ---");
        Transaction txn4 = gateway.pay("merchant-2", "customer-5", usd("0.08"), PaymentMethod.WALLET);
        gateway.refund(txn4.getTransactionId(), usd("0.06"));
        gateway.refund(txn4.getTransactionId(), usd("0.01"));
        gateway.refund(txn4.getTransactionId(), usd("0.01"));
        System.out.println("status=" + txn4.getStatus()
                + "  refunded=" + txn4.getRefundedAmount()
                + "  remaining=" + txn4.remainingRefundable() + " (exactly zero — no float residue)");
        try {
            gateway.refund(txn4.getTransactionId(), usd("0.01"));
        } catch (RuntimeException e) {
            System.out.println("Further refund blocked: " + e.getMessage());
        }

        List<Refund> refunds = gateway.refunds(txn3.getTransactionId());
        System.out.println("\nRefund count for " + txn3.getTransactionId() + ": " + refunds.size());
        System.out.println("\n=== Demo complete ===");
    }
}

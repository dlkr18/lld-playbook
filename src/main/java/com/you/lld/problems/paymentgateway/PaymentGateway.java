package com.you.lld.problems.paymentgateway;
import java.util.*;

public class PaymentGateway {
    private final Map<String, PaymentResult> transactions;
    
    public PaymentGateway() {
        this.transactions = new HashMap<>();
    }
    
    public PaymentResult processPayment(PaymentMethod method, double amount, Map<String, String> details) {
        String txnId = UUID.randomUUID().toString();
        PaymentStatus status = amount > 0 ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
        PaymentResult result = new PaymentResult(txnId, status, "Payment processed");
        transactions.put(txnId, result);
        return result;
    }
    
    public PaymentResult getStatus(String transactionId) {
        return transactions.get(transactionId);
    }
}

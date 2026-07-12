package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.problems.paymentgateway.model.Transaction;

public class CardPaymentProcessor implements com.you.lld.problems.paymentgateway.service.PaymentProcessor {
    @Override
    public boolean charge(Transaction transaction) {
        if (transaction.getAmount() <= 0) {
            return false;
        }
        return !String.format("%.2f", transaction.getAmount()).endsWith(".13");
    }
}

package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.model.Transaction;

public class CardPaymentProcessor implements com.you.lld.problems.paymentgateway.service.PaymentProcessor {
    @Override
    public boolean charge(Transaction transaction) {
        Money amount = transaction.getAmount();
        if (!amount.isPositive()) {
            return false;
        }
        // Deterministic stand-in for an issuer decline: any amount ending in .13 cents.
        return amount.minor() % 100L != 13L;
    }
}

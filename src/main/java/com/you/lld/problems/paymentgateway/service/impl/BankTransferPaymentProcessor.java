package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.model.Transaction;

public class BankTransferPaymentProcessor implements com.you.lld.problems.paymentgateway.service.PaymentProcessor {
    @Override
    public boolean charge(Transaction transaction) {
        Money amount = transaction.getAmount();
        Money minimum = Money.ofMinor(100L, amount.currency()); // banks reject sub-unit transfers
        return amount.compareTo(minimum) >= 0;
    }
}

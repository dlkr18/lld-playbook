package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.paymentgateway.model.Transaction;

public class UpiPaymentProcessor implements com.you.lld.problems.paymentgateway.service.PaymentProcessor {
    @Override
    public boolean charge(Transaction transaction) {
        Money amount = transaction.getAmount();
        Money perTxnCap = Money.ofMinor(100_000_00L, amount.currency()); // UPI-style cap
        return amount.isPositive() && amount.compareTo(perTxnCap) <= 0;
    }
}

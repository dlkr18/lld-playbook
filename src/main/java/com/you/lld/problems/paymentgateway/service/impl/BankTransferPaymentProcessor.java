package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.problems.paymentgateway.model.Transaction;

public class BankTransferPaymentProcessor implements com.you.lld.problems.paymentgateway.service.PaymentProcessor {
    @Override
    public boolean charge(Transaction transaction) {
        return transaction.getAmount() >= 1.0;
    }
}

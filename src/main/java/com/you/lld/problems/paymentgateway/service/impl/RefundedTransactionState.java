package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.problems.paymentgateway.model.Transaction;
import com.you.lld.problems.paymentgateway.service.TransactionState;

public class RefundedTransactionState implements TransactionState {
    @Override
    public void markSuccess(Transaction transaction) {
        // no-op
    }

    @Override
    public void markFailed(Transaction transaction) {
        // no-op
    }

    @Override
    public void applyRefund(Transaction transaction, double amount) {
        throw new IllegalArgumentException("Transaction already fully refunded");
    }
}

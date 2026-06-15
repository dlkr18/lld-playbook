package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.problems.paymentgateway.exceptions.TransactionFailedException;
import com.you.lld.problems.paymentgateway.model.Transaction;
import com.you.lld.problems.paymentgateway.service.TransactionState;

public class FailedTransactionState implements TransactionState {
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
        throw new TransactionFailedException("Cannot refund failed transaction");
    }
}

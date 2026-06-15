package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.problems.paymentgateway.exceptions.TransactionFailedException;
import com.you.lld.problems.paymentgateway.model.Transaction;
import com.you.lld.problems.paymentgateway.model.TransactionStatus;
import com.you.lld.problems.paymentgateway.service.TransactionState;

public class PendingTransactionState implements TransactionState {
    @Override
    public void markSuccess(Transaction transaction) {
        transaction.setStatus(TransactionStatus.SUCCESS);
    }

    @Override
    public void markFailed(Transaction transaction) {
        transaction.setStatus(TransactionStatus.FAILED);
    }

    @Override
    public void applyRefund(Transaction transaction, double amount) {
        throw new TransactionFailedException("Cannot refund transaction in state: PENDING");
    }
}

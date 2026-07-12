package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.problems.paymentgateway.model.Transaction;
import com.you.lld.problems.paymentgateway.model.TransactionStatus;
import com.you.lld.problems.paymentgateway.service.TransactionState;

public class SuccessTransactionState implements TransactionState {
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
        transaction.addRefund(amount);
        if (transaction.remainingRefundable() <= 0.0) {
            transaction.setStatus(TransactionStatus.REFUNDED);
        }
    }
}

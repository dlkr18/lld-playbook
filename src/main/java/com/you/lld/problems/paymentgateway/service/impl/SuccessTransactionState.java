package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.common.Money;
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
    public void applyRefund(Transaction transaction, Money amount) {
        transaction.addRefund(amount);
        if (!transaction.remainingRefundable().isPositive()) {
            transaction.setStatus(TransactionStatus.REFUNDED);
        }
    }
}

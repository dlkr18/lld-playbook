package com.you.lld.problems.paymentgateway.service.impl;

import com.you.lld.problems.paymentgateway.model.TransactionStatus;
import com.you.lld.problems.paymentgateway.service.TransactionState;

public final class TransactionStateFactory {
    private static final TransactionState PENDING = new PendingTransactionState();
    private static final TransactionState SUCCESS = new SuccessTransactionState();
    private static final TransactionState FAILED = new FailedTransactionState();
    private static final TransactionState REFUNDED = new RefundedTransactionState();

    private TransactionStateFactory() {
    }

    public static TransactionState forStatus(TransactionStatus status) {
        if (status == TransactionStatus.PENDING) {
            return PENDING;
        }
        if (status == TransactionStatus.SUCCESS) {
            return SUCCESS;
        }
        if (status == TransactionStatus.FAILED) {
            return FAILED;
        }
        if (status == TransactionStatus.REFUNDED) {
            return REFUNDED;
        }
        return PENDING;
    }
}

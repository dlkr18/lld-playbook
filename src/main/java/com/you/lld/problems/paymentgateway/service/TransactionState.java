package com.you.lld.problems.paymentgateway.service;

import com.you.lld.problems.paymentgateway.model.Transaction;

/** State — transaction lifecycle transitions. */
public interface TransactionState {
    void markSuccess(Transaction transaction);

    void markFailed(Transaction transaction);

    void applyRefund(Transaction transaction, double amount);
}

package com.you.lld.problems.digitalwallet.service;

import com.you.lld.problems.digitalwallet.model.Transaction;

/**
 * Observer notified after a transaction reaches a terminal state (COMPLETED /
 * FAILED / REVERSED). Used for push notifications, fraud signals, analytics —
 * decoupled from the money-movement core.
 */
public interface TransactionObserver {
    void onTransaction(Transaction transaction);
}

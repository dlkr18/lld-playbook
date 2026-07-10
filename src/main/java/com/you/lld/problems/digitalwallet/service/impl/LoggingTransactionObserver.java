package com.you.lld.problems.digitalwallet.service.impl;

import com.you.lld.problems.digitalwallet.model.Transaction;
import com.you.lld.problems.digitalwallet.service.TransactionObserver;

/**
 * Simple observer that prints a notification line whenever a transaction reaches
 * a terminal state. Stands in for push-notification / email / SMS fan-out.
 */
public final class LoggingTransactionObserver implements TransactionObserver {

    private final String channel;

    public LoggingTransactionObserver(String channel) {
        this.channel = channel;
    }

    @Override
    public void onTransaction(Transaction transaction) {
        System.out.println("  [" + channel + " notify] " + transaction);
    }
}

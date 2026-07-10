package com.you.lld.problems.digitalwallet.model;

/**
 * The business intent behind a movement of funds. Every type is internally
 * realised as the same primitive: a double-entry movement of money from one
 * account to another (see {@code DefaultTransactionService}).
 */
public enum TransactionType {
    /** Cash flows in from the outside world (system cash account) into a wallet. */
    TOP_UP,
    /** Cash flows out of a wallet back to the outside world. */
    WITHDRAWAL,
    /** Peer-to-peer movement between two wallets. */
    TRANSFER,
    /** Compensating movement that undoes a previously completed transaction. */
    REVERSAL
}

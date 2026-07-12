package com.you.lld.problems.digitalwallet.service;

import com.you.lld.problems.digitalwallet.model.Money;
import com.you.lld.problems.digitalwallet.model.Transaction;

import java.util.List;

/**
 * Executes and records money movements. All operations are thread-safe; transfers
 * are atomic (all-or-nothing) and deadlock-free (accounts are locked in a global
 * order), and can be made idempotent by supplying an idempotency key.
 */
public interface TransactionService {

    /** Credit a wallet from the outside world. */
    Transaction topUp(String accountId, Money amount);

    /** Debit a wallet back to the outside world; rejected if funds are insufficient. */
    Transaction withdraw(String accountId, Money amount);

    /** Move funds between two wallets atomically. Not idempotent (no key supplied). */
    Transaction transfer(String fromAccountId, String toAccountId, Money amount);

    /**
     * Idempotent transfer: replaying the same {@code idempotencyKey} returns the
     * original transaction and does NOT move funds a second time.
     */
    Transaction transfer(String fromAccountId, String toAccountId, Money amount, String idempotencyKey);

    /** Reverse a previously completed transaction with a compensating movement. */
    Transaction reverse(long transactionId);

    /** Full transaction history for an account, most-recent last. */
    List<Transaction> history(String accountId);

    /** Look up a single transaction by id. */
    Transaction getTransaction(long transactionId);

    /** Register an observer for terminal transaction events. */
    void registerObserver(TransactionObserver observer);
}

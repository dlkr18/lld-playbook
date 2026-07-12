package com.you.lld.problems.digitalwallet.service;

import com.you.lld.problems.digitalwallet.model.Transaction;

/**
 * Command pattern: a self-contained, executable unit of work that produces a
 * {@link Transaction}. Top-up, withdraw, transfer and reversal are each modelled
 * as a command, which keeps their distinct pre-conditions (funds check, limit
 * policy, idempotency) explicit while sharing the same locked-movement core.
 */
public interface WalletCommand {
    Transaction execute();
}

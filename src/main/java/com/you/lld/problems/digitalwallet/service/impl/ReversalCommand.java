package com.you.lld.problems.digitalwallet.service.impl;

import com.you.lld.problems.digitalwallet.model.Account;
import com.you.lld.problems.digitalwallet.model.Transaction;
import com.you.lld.problems.digitalwallet.model.TransactionStatus;
import com.you.lld.problems.digitalwallet.model.TransactionType;
import com.you.lld.problems.digitalwallet.service.WalletCommand;

/**
 * Command: compensate a completed transaction by moving the same amount back the
 * other way, then flip the original to {@link TransactionStatus#REVERSED}.
 *
 * <p>If the compensating movement itself fails (e.g. the recipient already spent
 * the money), the original is left COMPLETED and the failure propagates — we
 * never leave the ledger unbalanced.
 */
final class ReversalCommand implements WalletCommand {
    private final DefaultTransactionService service;
    private final Transaction original;

    ReversalCommand(DefaultTransactionService service, Transaction original) {
        this.service = service;
        this.original = original;
    }

    @Override
    public Transaction execute() {
        if (original.status() != TransactionStatus.COMPLETED) {
            throw new IllegalStateException("Only COMPLETED transactions can be reversed; txn#"
                    + original.id() + " is " + original.status());
        }
        Account revFrom = resolve(original.toAccountId());   // money flows back...
        Account revTo = resolve(original.fromAccountId());   // ...to the original payer
        Transaction compensating =
                service.performMovement(TransactionType.REVERSAL, revFrom, revTo, original.amount(), null);
        original.markReversed();
        service.notifyObservers(original);
        return compensating;
    }

    private Account resolve(String accountId) {
        Account system = service.systemAccount();
        if (system.id().equals(accountId)) {
            return system;
        }
        // User accounts are looked up via the movement core's account service.
        return service.accountFor(accountId);
    }
}

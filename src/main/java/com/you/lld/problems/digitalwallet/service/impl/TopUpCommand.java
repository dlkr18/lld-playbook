package com.you.lld.problems.digitalwallet.service.impl;

import com.you.lld.problems.digitalwallet.model.Account;
import com.you.lld.problems.digitalwallet.model.Money;
import com.you.lld.problems.digitalwallet.model.Transaction;
import com.you.lld.problems.digitalwallet.model.TransactionType;
import com.you.lld.problems.digitalwallet.service.WalletCommand;

/**
 * Command: bring cash into a wallet. Modelled as a movement from the system cash
 * account (which may go negative) into the target wallet — a genuine double-entry.
 */
final class TopUpCommand implements WalletCommand {
    private final DefaultTransactionService service;
    private final Account system;
    private final Account target;
    private final Money amount;

    TopUpCommand(DefaultTransactionService service, Account system, Account target, Money amount) {
        this.service = service;
        this.system = system;
        this.target = target;
        this.amount = amount;
    }

    @Override
    public Transaction execute() {
        return service.performMovement(TransactionType.TOP_UP, system, target, amount, null);
    }
}

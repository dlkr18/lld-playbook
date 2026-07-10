package com.you.lld.problems.digitalwallet.service.impl;

import com.you.lld.problems.digitalwallet.model.Account;
import com.you.lld.problems.digitalwallet.model.Money;
import com.you.lld.problems.digitalwallet.model.Transaction;
import com.you.lld.problems.digitalwallet.model.TransactionType;
import com.you.lld.problems.digitalwallet.service.WalletCommand;

/**
 * Command: send cash out of a wallet. Movement from the wallet to the system
 * cash account; the funds check applies because a wallet cannot overdraw.
 */
final class WithdrawCommand implements WalletCommand {
    private final DefaultTransactionService service;
    private final Account source;
    private final Account system;
    private final Money amount;

    WithdrawCommand(DefaultTransactionService service, Account source, Account system, Money amount) {
        this.service = service;
        this.source = source;
        this.system = system;
        this.amount = amount;
    }

    @Override
    public Transaction execute() {
        return service.performMovement(TransactionType.WITHDRAWAL, source, system, amount, null);
    }
}

package com.you.lld.problems.digitalwallet.service.impl;

import com.you.lld.problems.digitalwallet.model.Account;
import com.you.lld.problems.digitalwallet.model.Money;
import com.you.lld.problems.digitalwallet.model.Transaction;
import com.you.lld.problems.digitalwallet.model.TransactionType;
import com.you.lld.problems.digitalwallet.service.TransferPolicy;
import com.you.lld.problems.digitalwallet.service.WalletCommand;

/**
 * Command: peer-to-peer transfer between two wallets. Runs the {@link TransferPolicy}
 * gate first, then the atomic locked movement, then accrues policy usage on success.
 */
final class TransferCommand implements WalletCommand {
    private final DefaultTransactionService service;
    private final TransferPolicy policy;
    private final Account from;
    private final Account to;
    private final Money amount;
    private final String idempotencyKey;

    TransferCommand(DefaultTransactionService service, TransferPolicy policy,
                    Account from, Account to, Money amount, String idempotencyKey) {
        this.service = service;
        this.policy = policy;
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.idempotencyKey = idempotencyKey;
    }

    @Override
    public Transaction execute() {
        policy.validate(from, to, amount);
        Transaction txn = service.performMovement(TransactionType.TRANSFER, from, to, amount, idempotencyKey);
        policy.onCompleted(from, to, amount);
        return txn;
    }
}

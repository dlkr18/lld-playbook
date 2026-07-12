package com.you.lld.problems.digitalwallet.service.impl;

import com.you.lld.problems.digitalwallet.model.Account;
import com.you.lld.problems.digitalwallet.model.Money;
import com.you.lld.problems.digitalwallet.service.TransferPolicy;

/** Null-object policy: imposes no limits. Handy default and for tests. */
public final class UnlimitedTransferPolicy implements TransferPolicy {
    @Override
    public void validate(Account from, Account to, Money amount) {
        // no-op: everything allowed
    }

    @Override
    public void onCompleted(Account from, Account to, Money amount) {
        // no-op: nothing to accrue
    }
}

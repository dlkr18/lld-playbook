package com.you.lld.problems.digitalwallet.service;

import com.you.lld.problems.digitalwallet.model.Account;
import com.you.lld.problems.digitalwallet.model.Money;

/**
 * Strategy for pre-transfer risk/limit checks (e.g. per-transaction cap, daily
 * outgoing limit, KYC tier). Swapping the policy changes the rules without
 * touching the transfer execution flow.
 */
public interface TransferPolicy {

    /**
     * Validate an about-to-happen transfer of {@code amount} out of {@code from}.
     * Implementations throw {@link LimitExceededException} to veto it.
     */
    void validate(Account from, Account to, Money amount);

    /** Record that a transfer completed, so stateful policies can accrue usage. */
    void onCompleted(Account from, Account to, Money amount);
}

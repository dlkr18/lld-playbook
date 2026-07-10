package com.you.lld.problems.digitalwallet.service;

import com.you.lld.problems.digitalwallet.model.Account;
import com.you.lld.problems.digitalwallet.model.Money;

/**
 * Owns the lifecycle and lookup of {@link Account}s. Balances themselves are
 * mutated through the account objects (which are individually thread-safe);
 * this service is the registry.
 */
public interface AccountService {

    /** Create a new wallet with zero balance and return its generated id. */
    Account createAccount(String ownerName);

    /** Look up an account by id, or throw if it does not exist. */
    Account getAccount(String accountId);

    /** Convenience: current balance of an account. */
    Money getBalance(String accountId);
}

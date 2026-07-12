package com.you.lld.problems.digitalwallet.service.impl;

import com.you.lld.problems.digitalwallet.model.Account;
import com.you.lld.problems.digitalwallet.model.Money;
import com.you.lld.problems.digitalwallet.service.AccountService;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * In-memory account registry. Accounts live in a {@link ConcurrentHashMap};
 * per-account balance safety lives inside {@link Account} itself.
 */
public final class InMemoryAccountService implements AccountService {

    private final ConcurrentMap<String, Account> accounts = new ConcurrentHashMap<String, Account>();
    private final AtomicLong idSeq = new AtomicLong(0);

    @Override
    public Account createAccount(String ownerName) {
        if (ownerName == null || ownerName.trim().isEmpty()) {
            throw new IllegalArgumentException("ownerName must not be blank");
        }
        String id = "ACC-" + idSeq.incrementAndGet();
        Account account = new Account(id, ownerName, false);
        accounts.put(id, account);
        return account;
    }

    @Override
    public Account getAccount(String accountId) {
        Account account = accounts.get(accountId);
        if (account == null) {
            throw new IllegalArgumentException("No such account: " + accountId);
        }
        return account;
    }

    @Override
    public Money getBalance(String accountId) {
        return getAccount(accountId).balance();
    }
}

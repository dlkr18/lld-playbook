package com.you.lld.problems.atm.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Bank account with synchronized balance operations.
 *
 * All money-mutating ops are synchronized on the account instance.
 * getBalance() is also synchronized to guarantee visibility.
 */
public final class Account {

    private final String accountNumber;
    private BigDecimal balance;
    private final List<Transaction> transactions = new ArrayList<>();

    public Account(String accountNumber, BigDecimal initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    public synchronized boolean debit(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) return false;
        if (amount.compareTo(balance) > 0) return false;
        balance = balance.subtract(amount);
        return true;
    }

    public synchronized void credit(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("amount must be positive");
        balance = balance.add(amount);
    }

    public synchronized BigDecimal getBalance() { return balance; }

    public synchronized void addTransaction(Transaction txn) { transactions.add(txn); }
    public synchronized List<Transaction> getTransactions()   { return new ArrayList<>(transactions); }

    public String getAccountNumber() { return accountNumber; }

    @Override public String toString() { return "Account{" + accountNumber + ", $" + getBalance() + "}"; }
}

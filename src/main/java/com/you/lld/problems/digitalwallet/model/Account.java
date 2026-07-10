package com.you.lld.problems.digitalwallet.model;

import java.util.Objects;
import java.util.concurrent.locks.ReentrantLock;

/**
 * A wallet account: an owner, a mutable balance, and its own lock.
 *
 * <p><b>Thread-safety.</b> The balance is guarded by the account's own
 * {@link ReentrantLock}. Single-account operations ({@link #credit}/{@link #debit})
 * take the lock themselves. Two-account operations (transfers) acquire BOTH
 * accounts' locks up front in a global order (by {@link #id()}) via the
 * transaction service, then reuse them here — the lock is reentrant, so the
 * inner acquisition is free. This is what makes debit-A-then-credit-B atomic
 * while remaining deadlock-free.
 *
 * <p>A "system" account (the external-cash counterparty for top-ups/withdrawals)
 * is allowed to go negative; ordinary wallets are not.
 */
public final class Account {
    private final String id;
    private final String ownerName;
    private final boolean allowOverdraft;
    private final ReentrantLock lock = new ReentrantLock();

    private Money balance;

    public Account(String id, String ownerName, boolean allowOverdraft) {
        this.id = Objects.requireNonNull(id, "id");
        this.ownerName = Objects.requireNonNull(ownerName, "ownerName");
        this.allowOverdraft = allowOverdraft;
        this.balance = Money.ZERO;
    }

    public String id() { return id; }
    public String ownerName() { return ownerName; }
    public boolean allowsOverdraft() { return allowOverdraft; }

    /** The per-account lock. Exposed so the service can order-lock two accounts. */
    public ReentrantLock lock() { return lock; }

    public Money balance() {
        lock.lock();
        try {
            return balance;
        } finally {
            lock.unlock();
        }
    }

    /** Add funds. Caller may or may not already hold the lock (reentrant). */
    public void credit(Money amount) {
        requirePositive(amount);
        lock.lock();
        try {
            balance = balance.plus(amount);
        } finally {
            lock.unlock();
        }
    }

    /**
     * Remove funds. Throws {@link IllegalStateException} if the withdrawal would
     * drive a non-overdraft account negative — the balance is left untouched.
     */
    public void debit(Money amount) {
        requirePositive(amount);
        lock.lock();
        try {
            Money next = balance.minus(amount);
            if (next.isNegative() && !allowOverdraft) {
                throw new IllegalStateException(
                        "Insufficient funds in " + id + ": balance=" + balance + " debit=" + amount);
            }
            balance = next;
        } finally {
            lock.unlock();
        }
    }

    private static void requirePositive(Money amount) {
        if (amount == null || !amount.isPositive()) {
            throw new IllegalArgumentException("Amount must be positive: " + amount);
        }
    }

    @Override
    public String toString() {
        return "Account{" + id + ", owner=" + ownerName + ", balance=" + balance() + "}";
    }
}

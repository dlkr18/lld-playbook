package com.you.lld.problems.digitalwallet.service.impl;

import com.you.lld.problems.digitalwallet.model.EntryDirection;
import com.you.lld.problems.digitalwallet.model.LedgerEntry;
import com.you.lld.problems.digitalwallet.model.Money;
import com.you.lld.problems.digitalwallet.service.LedgerService;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

/**
 * In-memory append-only double-entry ledger.
 *
 * <p>{@link #record} appends a DEBIT/CREDIT pair for a single transaction under
 * one lock, so a reader never observes a half-written movement. Because every
 * write is a balanced pair, {@link #totalBalance()} is invariably zero.
 */
public final class InMemoryLedgerService implements LedgerService {

    private final List<LedgerEntry> entries = new ArrayList<LedgerEntry>();
    private final AtomicLong entryIdSeq = new AtomicLong(0);
    private final Object lock = new Object();

    @Override
    public List<LedgerEntry> record(long transactionId, String debitAccountId,
                                    String creditAccountId, Money amount) {
        if (amount == null || !amount.isPositive()) {
            throw new IllegalArgumentException("Ledger amount must be positive: " + amount);
        }
        if (debitAccountId.equals(creditAccountId)) {
            throw new IllegalArgumentException("Debit and credit accounts must differ");
        }
        Instant now = Instant.now();
        synchronized (lock) {
            LedgerEntry debit = new LedgerEntry(entryIdSeq.incrementAndGet(), transactionId,
                    debitAccountId, EntryDirection.DEBIT, amount, now);
            LedgerEntry credit = new LedgerEntry(entryIdSeq.incrementAndGet(), transactionId,
                    creditAccountId, EntryDirection.CREDIT, amount, now);
            entries.add(debit);
            entries.add(credit);
            List<LedgerEntry> pair = new ArrayList<LedgerEntry>(2);
            pair.add(debit);
            pair.add(credit);
            return Collections.unmodifiableList(pair);
        }
    }

    @Override
    public List<LedgerEntry> entriesFor(String accountId) {
        List<LedgerEntry> out = new ArrayList<LedgerEntry>();
        synchronized (lock) {
            for (LedgerEntry e : entries) {
                if (e.accountId().equals(accountId)) {
                    out.add(e);
                }
            }
        }
        return out;
    }

    @Override
    public Money totalBalance() {
        Money sum = Money.ZERO;
        synchronized (lock) {
            for (LedgerEntry e : entries) {
                sum = sum.plus(e.signedAmount());
            }
        }
        return sum;
    }

    @Override
    public Money reconciledBalance(String accountId) {
        Money sum = Money.ZERO;
        synchronized (lock) {
            for (LedgerEntry e : entries) {
                if (e.accountId().equals(accountId)) {
                    sum = sum.plus(e.signedAmount());
                }
            }
        }
        return sum;
    }
}

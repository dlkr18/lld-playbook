package com.you.lld.problems.digitalwallet.service;

import com.you.lld.problems.digitalwallet.model.EntryDirection;
import com.you.lld.problems.digitalwallet.model.LedgerEntry;
import com.you.lld.problems.digitalwallet.model.Money;

import java.util.List;

/**
 * Append-only double-entry ledger. Every recorded movement produces a balanced
 * pair of {@link LedgerEntry} rows (one DEBIT, one CREDIT of equal amount) so
 * the signed sum across the entire ledger is always exactly zero.
 */
public interface LedgerService {

    /**
     * Atomically append a balanced set of entries for one transaction and return
     * the immutable, id-stamped entries. Rejects a set that does not net to zero.
     */
    List<LedgerEntry> record(long transactionId, String debitAccountId,
                             String creditAccountId, Money amount);

    /** All entries touching an account, in insertion order. */
    List<LedgerEntry> entriesFor(String accountId);

    /** Signed sum of every entry ever recorded. Invariant: always {@code Money.ZERO}. */
    Money totalBalance();

    /** Signed sum of a single account's entries — must equal its live balance. */
    Money reconciledBalance(String accountId);
}

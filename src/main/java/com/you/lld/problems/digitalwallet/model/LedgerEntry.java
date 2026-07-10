package com.you.lld.problems.digitalwallet.model;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * One immutable line in the double-entry ledger: "account X was debited/credited
 * by amount A as part of transaction T at time t".
 *
 * <p>Entries are append-only and never mutated — the ledger is the source of
 * truth and audit trail. The {@code amount} is always stored as a positive
 * value; direction carries the sign. {@link #signedAmount()} projects it back
 * to a signed contribution for balance reconciliation.
 */
public final class LedgerEntry implements Serializable {
    private static final long serialVersionUID = 1L;

    private final long entryId;
    private final long transactionId;
    private final String accountId;
    private final EntryDirection direction;
    private final Money amount; // always positive
    private final Instant timestamp;

    public LedgerEntry(long entryId, long transactionId, String accountId,
                       EntryDirection direction, Money amount, Instant timestamp) {
        if (amount == null || !amount.isPositive()) {
            throw new IllegalArgumentException("Ledger entry amount must be positive: " + amount);
        }
        this.entryId = entryId;
        this.transactionId = transactionId;
        this.accountId = Objects.requireNonNull(accountId, "accountId");
        this.direction = Objects.requireNonNull(direction, "direction");
        this.amount = amount;
        this.timestamp = Objects.requireNonNull(timestamp, "timestamp");
    }

    public long entryId() { return entryId; }
    public long transactionId() { return transactionId; }
    public String accountId() { return accountId; }
    public EntryDirection direction() { return direction; }
    public Money amount() { return amount; }
    public Instant timestamp() { return timestamp; }

    /** +amount for CREDIT, −amount for DEBIT. Signed sum of all entries must be zero. */
    public Money signedAmount() {
        return direction == EntryDirection.CREDIT ? amount : amount.negate();
    }

    @Override
    public String toString() {
        return String.format("Entry#%d txn#%d %-6s %-10s %s",
                entryId, transactionId, direction, accountId, amount);
    }
}

package com.you.lld.problems.digitalwallet.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * An auditable record of one attempted movement of funds.
 *
 * <p>A transaction is created in {@link TransactionStatus#PENDING} and then
 * transitions exactly once to a terminal-ish state. Status changes are guarded
 * and validated against {@link TransactionStatus#canTransitionTo} so an illegal
 * transition (e.g. FAILED → COMPLETED) throws rather than silently corrupting
 * the audit trail.
 *
 * <p>{@code fromAccountId}/{@code toAccountId} always describe the money flow:
 * money leaves {@code from} and arrives at {@code to}. For a top-up the source
 * is the system cash account; for a withdrawal the destination is.
 */
public final class Transaction {
    private final long id;
    private final TransactionType type;
    private final String fromAccountId;
    private final String toAccountId;
    private final Money amount;
    private final String idempotencyKey; // nullable
    private final Instant createdAt;

    private TransactionStatus status;
    private String failureReason;
    private final List<LedgerEntry> entries = new ArrayList<LedgerEntry>(2);

    public Transaction(long id, TransactionType type, String fromAccountId,
                       String toAccountId, Money amount, String idempotencyKey) {
        this.id = id;
        this.type = Objects.requireNonNull(type, "type");
        this.fromAccountId = Objects.requireNonNull(fromAccountId, "fromAccountId");
        this.toAccountId = Objects.requireNonNull(toAccountId, "toAccountId");
        this.amount = Objects.requireNonNull(amount, "amount");
        if (!amount.isPositive()) {
            throw new IllegalArgumentException("Transaction amount must be positive: " + amount);
        }
        this.idempotencyKey = idempotencyKey;
        this.createdAt = Instant.now();
        this.status = TransactionStatus.PENDING;
    }

    public long id() { return id; }
    public TransactionType type() { return type; }
    public String fromAccountId() { return fromAccountId; }
    public String toAccountId() { return toAccountId; }
    public Money amount() { return amount; }
    public String idempotencyKey() { return idempotencyKey; }
    public Instant createdAt() { return createdAt; }

    public synchronized TransactionStatus status() { return status; }
    public synchronized String failureReason() { return failureReason; }

    public synchronized List<LedgerEntry> entries() {
        return Collections.unmodifiableList(new ArrayList<LedgerEntry>(entries));
    }

    /** PENDING → COMPLETED, attaching the balanced pair of ledger entries. */
    public synchronized void markCompleted(List<LedgerEntry> ledgerEntries) {
        transitionTo(TransactionStatus.COMPLETED);
        this.entries.clear();
        this.entries.addAll(ledgerEntries);
    }

    /** PENDING → FAILED with a human-readable reason. */
    public synchronized void markFailed(String reason) {
        transitionTo(TransactionStatus.FAILED);
        this.failureReason = reason;
    }

    /** COMPLETED → REVERSED once a compensating transaction has been recorded. */
    public synchronized void markReversed() {
        transitionTo(TransactionStatus.REVERSED);
    }

    private void transitionTo(TransactionStatus target) {
        if (!status.canTransitionTo(target)) {
            throw new IllegalStateException(
                    "Illegal transaction state transition " + status + " → " + target);
        }
        this.status = target;
    }

    @Override
    public String toString() {
        return String.format("Txn#%d %-10s %s→%s %s [%s]%s",
                id, type, fromAccountId, toAccountId, amount, status,
                failureReason == null ? "" : " (" + failureReason + ")");
    }
}

package com.you.lld.problems.digitalwallet.model;

/**
 * Lifecycle state of a {@link Transaction}, modelled as a small state machine.
 *
 * <p>Rather than a class-per-state (GoF State) we encode the legal transitions
 * directly on the enum via {@link #canTransitionTo(TransactionStatus)}. For a
 * strictly linear lifecycle with no per-state behaviour this is the cleaner,
 * less ceremonious form of the same pattern and keeps the invariant in one place.
 *
 * <pre>
 *   PENDING ──▶ COMPLETED ──▶ REVERSED
 *      │
 *      └──────▶ FAILED
 * </pre>
 */
public enum TransactionStatus {
    PENDING,
    COMPLETED,
    FAILED,
    REVERSED;

    public boolean isTerminal() {
        return this == FAILED || this == REVERSED;
    }

    public boolean canTransitionTo(TransactionStatus target) {
        switch (this) {
            case PENDING:
                return target == COMPLETED || target == FAILED;
            case COMPLETED:
                return target == REVERSED;
            case FAILED:
            case REVERSED:
            default:
                return false;
        }
    }
}

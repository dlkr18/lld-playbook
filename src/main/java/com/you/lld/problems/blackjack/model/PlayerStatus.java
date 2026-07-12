package com.you.lld.problems.blackjack.model;

/**
 * Per-player lifecycle within a single round.
 *
 * <p>A player starts {@link #PLAYING}; once they stand, double-down (which
 * takes one card then auto-stands) or bust, they are "done" and the table
 * moves on. {@link #done()} lets the orchestrator advance the turn cursor
 * without caring which terminal state was reached.
 */
public enum PlayerStatus {
    /** Still deciding — may hit, stand or double. */
    PLAYING,
    /** Chose to stop; total stands as-is. */
    STANDING,
    /** Total exceeded 21 — loses immediately regardless of the dealer. */
    BUST;

    public boolean done() {
        return this != PLAYING;
    }
}

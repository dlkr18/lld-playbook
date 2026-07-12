package com.you.lld.problems.blackjack.model;

/**
 * The phases of a single round, driving the orchestrator's state machine.
 *
 * <p>Legal progression is strictly linear:
 * <pre>
 *   BETTING -> PLAYER_TURN -> DEALER_TURN -> SETTLEMENT -> DONE
 * </pre>
 * Each {@code Blackjack} operation asserts the expected phase before running
 * and advances to the next, so illegal calls (e.g. hitting before cards are
 * dealt, or settling twice) fail fast with a clear error instead of silently
 * corrupting state.
 */
public enum RoundState {
    /** Bets are placed; no cards dealt yet. */
    BETTING,
    /** Opening cards dealt; players act in seat order. */
    PLAYER_TURN,
    /** All players done; dealer draws per its strategy. */
    DEALER_TURN,
    /** Hands are compared and payouts computed. */
    SETTLEMENT,
    /** Round is closed; results are frozen and readable. */
    DONE
}

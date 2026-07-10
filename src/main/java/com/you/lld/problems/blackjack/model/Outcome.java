package com.you.lld.problems.blackjack.model;

/**
 * The settled result of one player's hand versus the dealer.
 *
 * <p>{@link #BLACKJACK} is kept distinct from {@link #WIN} because it pays a
 * different ratio (typically 3:2 rather than 1:1) — the {@code PayoutStrategy}
 * keys off this enum to compute the amount returned to the player.
 */
public enum Outcome {
    /** Two-card 21 that the dealer did not match — pays 3:2 by default. */
    BLACKJACK,
    /** Player total beats the dealer (or the dealer busted) — pays 1:1. */
    WIN,
    /** Equal totals — the bet is returned, no profit. */
    PUSH,
    /** Player busted or the dealer's total is higher — bet is lost. */
    LOSE
}

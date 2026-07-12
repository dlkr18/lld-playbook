package com.you.lld.problems.blackjack.service;

import com.you.lld.common.Money;
import com.you.lld.problems.blackjack.model.Outcome;

/**
 * Converts a settled {@link Outcome} into the player's net profit (Strategy
 * pattern).
 *
 * <p>Only the <em>ratios</em> vary between houses — 3:2 versus 6:5 on a
 * blackjack, for instance — while deciding <em>which</em> outcome occurred is
 * invariant game logic owned by the orchestrator. Splitting it this way keeps
 * the rules that genuinely change behind an interface and the rules that never
 * change in one place.
 */
public interface PayoutStrategy {

    /**
     * @param bet     the amount the player wagered on this hand
     * @param outcome how the hand resolved against the dealer
     * @return signed net profit: positive when the player wins, zero on a
     *         push, negative when the bet is lost
     */
    Money netPayout(Money bet, Outcome outcome);

    /** Short human-readable name of the rule (e.g. "3:2") for demo output. */
    String describe();
}

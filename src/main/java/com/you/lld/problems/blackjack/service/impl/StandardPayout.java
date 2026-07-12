package com.you.lld.problems.blackjack.service.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.blackjack.model.Outcome;
import com.you.lld.problems.blackjack.service.PayoutStrategy;

/**
 * The classic table: a natural blackjack pays 3:2, an ordinary win pays 1:1,
 * a push returns the stake and a loss forfeits it.
 *
 * <p>Ratios are applied on {@link Money}'s integer minor units via
 * {@code percent} (basis points), so there is no floating-point drift:
 * 150% of a $10 bet is exactly $15.
 */
public final class StandardPayout implements PayoutStrategy {

    private static final int BLACKJACK_BASIS_POINTS = 15000; // 3:2 -> 150% profit

    @Override
    public Money netPayout(Money bet, Outcome outcome) {
        switch (outcome) {
            case BLACKJACK:
                return bet.percent(BLACKJACK_BASIS_POINTS);
            case WIN:
                return bet; // 1:1
            case PUSH:
                return bet.times(0);
            case LOSE:
                return bet.times(-1);
            default:
                throw new IllegalStateException("Unhandled outcome: " + outcome);
        }
    }

    @Override
    public String describe() {
        return "3:2 blackjack, 1:1 win";
    }
}

package com.you.lld.problems.blackjack.service.impl;

import com.you.lld.common.Money;
import com.you.lld.problems.blackjack.model.Outcome;
import com.you.lld.problems.blackjack.service.PayoutStrategy;

/**
 * A stingier modern table: a natural blackjack pays only 6:5 instead of 3:2.
 * Everything else matches {@link StandardPayout}. Included to demonstrate that
 * payout rules are a hot-swappable strategy — the orchestrator is oblivious to
 * which table it is running.
 */
public final class SixToFivePayout implements PayoutStrategy {

    private static final int BLACKJACK_BASIS_POINTS = 12000; // 6:5 -> 120% profit

    @Override
    public Money netPayout(Money bet, Outcome outcome) {
        switch (outcome) {
            case BLACKJACK:
                return bet.percent(BLACKJACK_BASIS_POINTS);
            case WIN:
                return bet;
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
        return "6:5 blackjack, 1:1 win";
    }
}

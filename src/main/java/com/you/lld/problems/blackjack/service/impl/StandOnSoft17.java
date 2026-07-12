package com.you.lld.problems.blackjack.service.impl;

import com.you.lld.problems.blackjack.model.Hand;
import com.you.lld.problems.blackjack.service.DealerStrategy;

/**
 * "S17" house rule: the dealer draws to 16 and stands on <em>every</em> 17,
 * soft or hard. This is the more player-friendly of the two common rules.
 */
public final class StandOnSoft17 implements DealerStrategy {

    private static final int STAND_AT = 17;

    @Override
    public boolean shouldHit(Hand dealerHand) {
        return dealerHand.value() < STAND_AT;
    }

    @Override
    public String describe() {
        return "S17 (stand on all 17s)";
    }
}

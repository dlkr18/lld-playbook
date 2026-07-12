package com.you.lld.problems.blackjack.service.impl;

import com.you.lld.problems.blackjack.model.Hand;
import com.you.lld.problems.blackjack.service.DealerStrategy;

/**
 * "H17" house rule: the dealer draws to 16, stands on hard 17, but <em>hits</em>
 * a soft 17 (e.g. A-6). Hitting a soft 17 cannot bust and slightly favours the
 * house, so many casinos prefer it.
 */
public final class HitOnSoft17 implements DealerStrategy {

    private static final int STAND_AT = 17;

    @Override
    public boolean shouldHit(Hand dealerHand) {
        if (dealerHand.value() < STAND_AT) {
            return true;
        }
        // Exactly 17: hit only when it is soft (an Ace is being counted as 11).
        return dealerHand.value() == STAND_AT && dealerHand.isSoft();
    }

    @Override
    public String describe() {
        return "H17 (hit soft 17)";
    }
}

package com.you.lld.problems.blackjack.service;

import com.you.lld.problems.blackjack.model.Hand;

/**
 * The dealer's fixed drawing policy (Strategy pattern).
 *
 * <p>The dealer has no free will: it keeps hitting until the policy says stop.
 * The only real variation between house rules is what to do on a
 * <em>soft 17</em> (an Ace counted as 11 totalling 17) — "stand on all 17s"
 * (S17) versus "hit soft 17" (H17). Encapsulating the decision here lets those
 * rule sets be swapped without touching the round loop.
 *
 * @see com.you.lld.problems.blackjack.service.impl.StandOnSoft17
 * @see com.you.lld.problems.blackjack.service.impl.HitOnSoft17
 */
public interface DealerStrategy {

    /**
     * @param dealerHand the dealer's current hand
     * @return {@code true} if the dealer must draw another card
     */
    boolean shouldHit(Hand dealerHand);

    /** Short human-readable name of the rule (e.g. "S17") for demo output. */
    String describe();
}

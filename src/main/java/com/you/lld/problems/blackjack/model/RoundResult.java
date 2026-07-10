package com.you.lld.problems.blackjack.model;

import com.you.lld.common.Money;

import java.util.Objects;

/**
 * Immutable settlement record for one player at the end of a round: what they
 * bet, how it resolved and the net change to their chips.
 *
 * <p>{@code netPayout} is the signed profit: {@code +bet} for a 1:1 win,
 * {@code +1.5 * bet} for a natural blackjack, {@code 0} for a push and
 * {@code -bet} for a loss. Summing it across players gives the house result.
 */
public final class RoundResult {

    private final String playerName;
    private final Outcome outcome;
    private final Money bet;
    private final Money netPayout;

    public RoundResult(String playerName, Outcome outcome, Money bet, Money netPayout) {
        this.playerName = Objects.requireNonNull(playerName, "playerName");
        this.outcome = Objects.requireNonNull(outcome, "outcome");
        this.bet = Objects.requireNonNull(bet, "bet");
        this.netPayout = Objects.requireNonNull(netPayout, "netPayout");
    }

    public String playerName() {
        return playerName;
    }

    public Outcome outcome() {
        return outcome;
    }

    public Money bet() {
        return bet;
    }

    public Money netPayout() {
        return netPayout;
    }

    @Override
    public String toString() {
        return String.format("%-8s %-9s bet=%s net=%s", playerName, outcome, bet, netPayout);
    }
}

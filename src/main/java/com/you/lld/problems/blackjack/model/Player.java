package com.you.lld.problems.blackjack.model;

import com.you.lld.common.Money;

import java.util.Objects;

/**
 * A seated player for one round: identity, wager, hand and lifecycle status.
 *
 * <p>Modelled as a mutable round-scoped aggregate (the hand grows, the status
 * changes, the bet can double). It carries no cross-hand comparison logic —
 * deciding win/lose/push is the orchestrator's job — so the entity stays a
 * simple, self-validating state holder.
 */
public final class Player {

    private final String name;
    private final Hand hand = new Hand();
    private Money bet;
    private PlayerStatus status = PlayerStatus.PLAYING;
    private boolean doubled;

    public Player(String name, Money bet) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Player name must not be blank");
        }
        Objects.requireNonNull(bet, "bet");
        if (!bet.isPositive()) {
            throw new IllegalArgumentException("Bet must be positive, got " + bet);
        }
        this.name = name;
        this.bet = bet;
    }

    public String name() {
        return name;
    }

    public Hand hand() {
        return hand;
    }

    public Money bet() {
        return bet;
    }

    public PlayerStatus status() {
        return status;
    }

    public void setStatus(PlayerStatus status) {
        this.status = Objects.requireNonNull(status, "status");
    }

    public boolean isDone() {
        return status.done();
    }

    public boolean isDoubled() {
        return doubled;
    }

    /** Doubles the wager (used by double-down); the caller deals exactly one card and stands. */
    public void doubleBet() {
        this.bet = bet.times(2);
        this.doubled = true;
    }

    @Override
    public String toString() {
        return name + " " + hand + " bet=" + bet;
    }
}

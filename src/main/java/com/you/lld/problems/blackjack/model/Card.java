package com.you.lld.problems.blackjack.model;

import java.util.Objects;

/**
 * An immutable playing card: a (Suit, Rank) pair.
 *
 * <p>Value object — two cards are equal iff their suit and rank match, which
 * guarantees a standard deck contains 52 <em>distinct</em> cards. Being
 * immutable, a Card can be shared freely between a deck, a hand and the
 * discard pile without defensive copying.
 */
public final class Card {

    private final Suit suit;
    private final Rank rank;

    public Card(Suit suit, Rank rank) {
        this.suit = Objects.requireNonNull(suit, "suit");
        this.rank = Objects.requireNonNull(rank, "rank");
    }

    public Suit suit() {
        return suit;
    }

    public Rank rank() {
        return rank;
    }

    /** Base value of this card (Ace = 1; soft promotion is decided by the Hand). */
    public int baseValue() {
        return rank.baseValue();
    }

    public boolean isAce() {
        return rank.isAce();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Card card = (Card) o;
        return suit == card.suit && rank == card.rank;
    }

    @Override
    public int hashCode() {
        return Objects.hash(suit, rank);
    }

    /** Compact label such as "AS" (Ace of Spades) or "10H" (Ten of Hearts). */
    @Override
    public String toString() {
        return rank.symbol() + suit.symbol();
    }
}

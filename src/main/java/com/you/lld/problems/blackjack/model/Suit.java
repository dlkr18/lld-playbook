package com.you.lld.problems.blackjack.model;

/**
 * The four suits of a standard French-deck playing card.
 *
 * <p>Suit does not affect a card's value in Blackjack; it exists so that the
 * 52 cards in a deck are distinguishable (a deck holds exactly one card per
 * (Suit, Rank) pair). The single-character symbol is used for compact,
 * human-readable rendering in the demo.
 */
public enum Suit {
    HEARTS("H"),
    DIAMONDS("D"),
    CLUBS("C"),
    SPADES("S");

    private final String symbol;

    Suit(String symbol) {
        this.symbol = symbol;
    }

    public String symbol() {
        return symbol;
    }
}

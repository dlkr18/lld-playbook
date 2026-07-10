package com.you.lld.problems.blackjack.model;

/**
 * The thirteen ranks of a standard playing card, each carrying its
 * <em>base</em> Blackjack value.
 *
 * <p>The base value is the value used when an Ace counts as 1. Face cards
 * (Jack, Queen, King) are worth 10. The Ace's "soft" promotion to 11 is
 * <strong>not</strong> encoded here — that is a property of a {@link Hand}
 * (a single Ace can be 11 only if doing so does not bust the hand), so it is
 * computed in {@link Hand#value()} rather than baked into the enum.
 */
public enum Rank {
    TWO("2", 2),
    THREE("3", 3),
    FOUR("4", 4),
    FIVE("5", 5),
    SIX("6", 6),
    SEVEN("7", 7),
    EIGHT("8", 8),
    NINE("9", 9),
    TEN("10", 10),
    JACK("J", 10),
    QUEEN("Q", 10),
    KING("K", 10),
    ACE("A", 1);

    private final String symbol;
    private final int baseValue;

    Rank(String symbol, int baseValue) {
        this.symbol = symbol;
        this.baseValue = baseValue;
    }

    public String symbol() {
        return symbol;
    }

    /** Value when an Ace is counted as 1; 10 for all face cards. */
    public int baseValue() {
        return baseValue;
    }

    public boolean isAce() {
        return this == ACE;
    }
}

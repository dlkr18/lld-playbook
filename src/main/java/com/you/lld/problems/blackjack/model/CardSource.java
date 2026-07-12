package com.you.lld.problems.blackjack.model;

/**
 * Abstraction over anything the table can draw cards from — a single
 * {@link Deck} or a multi-deck {@link Shoe}.
 *
 * <p>The orchestrator depends only on this interface (Dependency Inversion),
 * so the exact number of decks and the reshuffle policy are pluggable without
 * touching game logic. It lives in {@code model} rather than {@code service}
 * because it describes a <em>thing cards come from</em> (a value/aggregate
 * abstraction), not an injected business strategy.
 */
public interface CardSource {

    /**
     * Removes and returns the top card.
     *
     * @throws IllegalStateException if the source is empty
     */
    Card deal();

    /** Number of cards still available to deal. */
    int remaining();

    /**
     * Whether the source has been drawn past its reshuffle point (the "cut
     * card"). Single decks report {@code true} only when exhausted; a shoe
     * reports {@code true} once penetration crosses its threshold. Callers may
     * use this between rounds to decide when to rebuild the source.
     */
    boolean needsReshuffle();
}

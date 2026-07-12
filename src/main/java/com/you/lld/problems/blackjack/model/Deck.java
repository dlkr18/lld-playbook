package com.you.lld.problems.blackjack.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

/**
 * A drawable pile of cards backed by a single 52-card French deck.
 *
 * <p>Construction goes through the static factory methods (a Factory-method
 * idiom) so a caller can never hand-assemble an invalid deck:
 * <ul>
 *   <li>{@link #standardOrdered()} — 52 distinct cards in canonical order.</li>
 *   <li>{@link #shuffled(long)} — a standard deck shuffled with a
 *       <em>seeded</em> {@link Random} so games are perfectly reproducible.</li>
 *   <li>{@link #of(List)} / {@link #of(Card...)} — a scripted deck for tests
 *       and demos that need a specific deal order.</li>
 * </ul>
 *
 * <p>The pile is dealt front-to-back via a {@code dealt} cursor rather than by
 * mutating the list, which keeps the deal order predictable for scripted
 * decks and avoids repeated list shifts.
 *
 * <p><strong>Thread-safety:</strong> not thread-safe by design. A Blackjack
 * table is dealt from by exactly one thread (the round loop), so guarding the
 * cursor with a lock would be pure overhead. See {@code INTERVIEW.md}.
 */
public final class Deck implements CardSource {

    private final List<Card> cards;
    private int dealt;

    private Deck(List<Card> cards) {
        this.cards = cards;
        this.dealt = 0;
    }

    /** All 52 cards, Suit-major then Rank-major, unshuffled. */
    public static Deck standardOrdered() {
        List<Card> all = new ArrayList<Card>(52);
        for (Suit suit : Suit.values()) {
            for (Rank rank : Rank.values()) {
                all.add(new Card(suit, rank));
            }
        }
        return new Deck(all);
    }

    /** A standard 52-card deck shuffled deterministically from {@code seed}. */
    public static Deck shuffled(long seed) {
        Deck deck = standardOrdered();
        Collections.shuffle(deck.cards, new Random(seed));
        return deck;
    }

    /** A scripted deck; the first element is dealt first ("top of deck"). */
    public static Deck of(List<Card> orderedCards) {
        return new Deck(new ArrayList<Card>(orderedCards));
    }

    /** A scripted deck; the first argument is dealt first ("top of deck"). */
    public static Deck of(Card... orderedCards) {
        List<Card> list = new ArrayList<Card>(orderedCards.length);
        for (Card c : orderedCards) {
            list.add(c);
        }
        return new Deck(list);
    }

    @Override
    public Card deal() {
        if (isEmpty()) {
            throw new IllegalStateException("Deck is exhausted; cannot deal");
        }
        return cards.get(dealt++);
    }

    @Override
    public int remaining() {
        return cards.size() - dealt;
    }

    public boolean isEmpty() {
        return remaining() == 0;
    }

    /** A single deck asks to be reshuffled only once it has been used up. */
    @Override
    public boolean needsReshuffle() {
        return isEmpty();
    }
}

package com.you.lld.problems.blackjack.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

/**
 * A casino "shoe": several standard decks shuffled together and dealt as one
 * pile, with a cut-card penetration threshold that signals when to rebuild.
 *
 * <p>Real Blackjack is almost never dealt from a single 52-card deck (that
 * invites card counting); casinos use 4-8 decks and reshuffle when a set
 * fraction has been dealt. Modelling that here gives {@link CardSource} a
 * second, genuinely different implementation and lets the demo show the
 * orchestrator running unchanged against either source.
 *
 * <p><strong>Thread-safety:</strong> same rationale as {@link Deck} — dealt
 * from a single round thread, so it is intentionally unsynchronised.
 */
public final class Shoe implements CardSource {

    private final List<Card> cards;
    private final int reshuffleAt; // deal cursor value at/after which we reshuffle
    private int dealt;

    private Shoe(List<Card> cards, int reshuffleAt) {
        this.cards = cards;
        this.reshuffleAt = reshuffleAt;
        this.dealt = 0;
    }

    /**
     * Builds a shoe of {@code numDecks} standard decks shuffled with the given
     * seed, reshuffling once ~75% of the cards have been dealt (a typical
     * casino penetration).
     */
    public static Shoe of(int numDecks, long seed) {
        if (numDecks < 1) {
            throw new IllegalArgumentException("A shoe needs at least one deck, got " + numDecks);
        }
        List<Card> all = new ArrayList<Card>(numDecks * 52);
        for (int d = 0; d < numDecks; d++) {
            for (Suit suit : Suit.values()) {
                for (Rank rank : Rank.values()) {
                    all.add(new Card(suit, rank));
                }
            }
        }
        Collections.shuffle(all, new Random(seed));
        int cut = (int) (all.size() * 0.75);
        return new Shoe(all, cut);
    }

    @Override
    public Card deal() {
        if (dealt >= cards.size()) {
            throw new IllegalStateException("Shoe is exhausted; cannot deal");
        }
        return cards.get(dealt++);
    }

    @Override
    public int remaining() {
        return cards.size() - dealt;
    }

    @Override
    public boolean needsReshuffle() {
        return dealt >= reshuffleAt;
    }
}

package com.you.lld.problems.blackjack.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * A player's or dealer's set of cards, plus the Blackjack value rules.
 *
 * <p>This is a small mutable aggregate — cards are added as the hand is dealt
 * and hit — but its <em>valuation is pure</em>: {@link #value()} derives the
 * best total from the cards alone, so it can be unit-tested in isolation.
 *
 * <p><b>Ace (soft/hard) valuation.</b> Each Ace is worth 1 or 11. Because two
 * Aces valued at 11 already total 22 (a bust), <em>at most one</em> Ace in any
 * hand can ever count as 11. So the algorithm is:
 * <ol>
 *   <li>Sum every card with the Ace counted as 1 (the "hard" total).</li>
 *   <li>If the hand holds at least one Ace and adding 10 keeps the total
 *       {@code <= 21}, promote a single Ace to 11 (the "soft" total).</li>
 * </ol>
 * This yields the highest non-busting total automatically. A hand where an
 * Ace is counted as 11 is a <em>soft</em> hand (it cannot bust on the next
 * hit); otherwise it is <em>hard</em>.
 */
public final class Hand {

    private static final int BLACKJACK = 21;
    private static final int ACE_PROMOTION = 10; // 11 - 1

    private final List<Card> cards = new ArrayList<Card>();

    public void add(Card card) {
        if (card == null) {
            throw new IllegalArgumentException("Cannot add a null card to a hand");
        }
        cards.add(card);
    }

    /** Best total for this hand, treating one Ace as 11 when it does not bust. */
    public int value() {
        int hard = 0;
        boolean hasAce = false;
        for (Card card : cards) {
            hard += card.baseValue();
            if (card.isAce()) {
                hasAce = true;
            }
        }
        if (hasAce && hard + ACE_PROMOTION <= BLACKJACK) {
            return hard + ACE_PROMOTION;
        }
        return hard;
    }

    /** True when an Ace is being counted as 11 (e.g. A-6 = soft 17). */
    public boolean isSoft() {
        int hard = 0;
        boolean hasAce = false;
        for (Card card : cards) {
            hard += card.baseValue();
            if (card.isAce()) {
                hasAce = true;
            }
        }
        return hasAce && hard + ACE_PROMOTION <= BLACKJACK;
    }

    public boolean isBust() {
        return value() > BLACKJACK;
    }

    /** A "natural": exactly two cards totalling 21 (an Ace with a ten-value card). */
    public boolean isBlackjack() {
        return cards.size() == 2 && value() == BLACKJACK;
    }

    public int size() {
        return cards.size();
    }

    /** Unmodifiable view of the cards, in the order they were dealt. */
    public List<Card> cards() {
        return Collections.unmodifiableList(cards);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < cards.size(); i++) {
            if (i > 0) {
                sb.append(" ");
            }
            sb.append(cards.get(i));
        }
        sb.append("] (");
        sb.append(isSoft() ? "soft " : "");
        sb.append(value());
        if (isBust()) {
            sb.append(", BUST");
        } else if (isBlackjack()) {
            sb.append(", BLACKJACK");
        }
        sb.append(")");
        return sb.toString();
    }
}

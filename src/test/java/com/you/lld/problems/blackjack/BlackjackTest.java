package com.you.lld.problems.blackjack;

import com.you.lld.common.Money;
import com.you.lld.problems.blackjack.model.Card;
import com.you.lld.problems.blackjack.model.Deck;
import com.you.lld.problems.blackjack.model.Hand;
import com.you.lld.problems.blackjack.model.Outcome;
import com.you.lld.problems.blackjack.model.Rank;
import com.you.lld.problems.blackjack.model.RoundResult;
import com.you.lld.problems.blackjack.model.RoundState;
import com.you.lld.problems.blackjack.model.Suit;
import com.you.lld.problems.blackjack.service.impl.HitOnSoft17;
import com.you.lld.problems.blackjack.service.impl.StandOnSoft17;
import com.you.lld.problems.blackjack.service.impl.StandardPayout;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.Currency;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Unit and integration tests for the Blackjack / Deck-of-Cards design.
 *
 * <p>Determinism comes from two sources: seeded shuffles for the deck tests and
 * fully scripted {@link Deck#of} decks for the round-level tests, so no test
 * depends on chance.
 */
@DisplayName("Blackjack Tests")
class BlackjackTest {

    private static final Currency USD = Currency.getInstance("USD");
    private static final Money TEN = Money.ofMinor(1000, USD); // $10.00

    private static Card card(Rank rank, Suit suit) {
        return new Card(suit, rank);
    }

    private static Hand handOf(Card... cards) {
        Hand hand = new Hand();
        for (Card c : cards) {
            hand.add(c);
        }
        return hand;
    }

    @Nested
    @DisplayName("Deck")
    class DeckTests {

        @Test
        @DisplayName("A standard deck has 52 unique cards")
        void standardDeckHas52UniqueCards() {
            Deck deck = Deck.standardOrdered();
            assertEquals(52, deck.remaining());

            Set<Card> seen = new HashSet<Card>();
            while (deck.remaining() > 0) {
                seen.add(deck.deal());
            }
            assertEquals(52, seen.size(), "all 52 cards must be distinct");
        }

        @Test
        @DisplayName("Dealing reduces the number of cards remaining")
        void dealingReducesRemaining() {
            Deck deck = Deck.shuffled(7L);
            assertEquals(52, deck.remaining());

            deck.deal();
            deck.deal();
            deck.deal();

            assertEquals(49, deck.remaining());
        }

        @Test
        @DisplayName("A seeded shuffle is reproducible")
        void seededShuffleIsReproducible() {
            Deck a = Deck.shuffled(123L);
            Deck b = Deck.shuffled(123L);
            for (int i = 0; i < 52; i++) {
                assertEquals(a.deal(), b.deal(), "same seed must give the same order");
            }
        }

        @Test
        @DisplayName("Dealing from an exhausted deck throws")
        void dealingFromExhaustedDeckThrows() {
            Deck deck = Deck.of(card(Rank.ACE, Suit.SPADES));
            deck.deal();
            assertThrows(IllegalStateException.class, deck::deal);
        }
    }

    @Nested
    @DisplayName("Hand valuation")
    class HandValuationTests {

        @Test
        @DisplayName("A hand with no ace sums its ranks")
        void noAceSumsRanks() {
            Hand hand = handOf(card(Rank.TEN, Suit.HEARTS), card(Rank.SEVEN, Suit.CLUBS));
            assertEquals(17, hand.value());
            assertFalse(hand.isSoft());
        }

        @Test
        @DisplayName("Ace + Six is a soft 17")
        void aceSixIsSoft17() {
            Hand hand = handOf(card(Rank.ACE, Suit.SPADES), card(Rank.SIX, Suit.DIAMONDS));
            assertEquals(17, hand.value());
            assertTrue(hand.isSoft(), "the Ace is counted as 11");
        }

        @Test
        @DisplayName("Multiple aces never over-count: A + A + 9 = 21, not 31")
        void multipleAcesDoNotOverCount() {
            Hand hand = handOf(card(Rank.ACE, Suit.SPADES), card(Rank.ACE, Suit.HEARTS),
                    card(Rank.NINE, Suit.CLUBS));
            assertEquals(21, hand.value());
            assertTrue(hand.isSoft(), "exactly one Ace is 11, the other is 1");
        }

        @Test
        @DisplayName("An Ace demotes to 1 when 11 would bust: A + 6 + 10 = 17")
        void aceDemotesToAvoidBust() {
            Hand hand = handOf(card(Rank.ACE, Suit.SPADES), card(Rank.SIX, Suit.DIAMONDS),
                    card(Rank.TEN, Suit.CLUBS));
            assertEquals(17, hand.value());
            assertFalse(hand.isSoft(), "the Ace must count as 1 here");
        }

        @Test
        @DisplayName("A total over 21 is a bust")
        void overTwentyOneIsBust() {
            Hand hand = handOf(card(Rank.KING, Suit.HEARTS), card(Rank.QUEEN, Suit.CLUBS),
                    card(Rank.FIVE, Suit.SPADES));
            assertEquals(25, hand.value());
            assertTrue(hand.isBust());
        }

        @Test
        @DisplayName("Two-card 21 is a blackjack; three-card 21 is not")
        void blackjackDetection() {
            Hand natural = handOf(card(Rank.ACE, Suit.SPADES), card(Rank.KING, Suit.CLUBS));
            assertTrue(natural.isBlackjack());

            Hand threeCard = handOf(card(Rank.SEVEN, Suit.SPADES), card(Rank.SEVEN, Suit.CLUBS),
                    card(Rank.SEVEN, Suit.HEARTS));
            assertEquals(21, threeCard.value());
            assertFalse(threeCard.isBlackjack(), "21 on three cards is not a natural");
        }
    }

    @Nested
    @DisplayName("Dealer draw strategy")
    class DealerStrategyTests {

        @Test
        @DisplayName("S17 dealer stands on 17 and does not draw further")
        void dealerStandsOn17() {
            Deck deck = Deck.of(
                    card(Rank.TEN, Suit.HEARTS),   // player
                    card(Rank.TEN, Suit.CLUBS),    // dealer
                    card(Rank.NINE, Suit.SPADES),  // player -> 19
                    card(Rank.SEVEN, Suit.DIAMONDS)); // dealer -> 17

            Blackjack game = Blackjack.builder()
                    .cardSource(deck)
                    .dealerStrategy(new StandOnSoft17())
                    .payoutStrategy(new StandardPayout())
                    .player("P", TEN)
                    .build();

            game.deal();
            game.stand();
            List<Card> drew = game.playDealer();

            assertTrue(drew.isEmpty(), "dealer already at 17 must not draw");
            assertEquals(17, game.dealerHand().value());
        }

        @Test
        @DisplayName("H17 dealer hits a soft 17 but S17 stands on it")
        void h17HitsSoft17ButS17Stands() {
            // Dealer opens A-6 (soft 17); player stands on 20.
            Card[] script = {
                    card(Rank.TEN, Suit.HEARTS),   // player
                    card(Rank.ACE, Suit.CLUBS),    // dealer
                    card(Rank.TEN, Suit.SPADES),   // player -> 20
                    card(Rank.SIX, Suit.DIAMONDS), // dealer -> soft 17
                    card(Rank.TWO, Suit.CLUBS)     // only H17 draws this -> hard 19
            };

            Blackjack s17 = Blackjack.builder().cardSource(Deck.of(script))
                    .dealerStrategy(new StandOnSoft17()).payoutStrategy(new StandardPayout())
                    .player("P", TEN).build();
            s17.deal();
            s17.stand();
            assertTrue(s17.playDealer().isEmpty(), "S17 stands on soft 17");
            assertEquals(17, s17.dealerHand().value());

            Blackjack h17 = Blackjack.builder().cardSource(Deck.of(script))
                    .dealerStrategy(new HitOnSoft17()).payoutStrategy(new StandardPayout())
                    .player("P", TEN).build();
            h17.deal();
            h17.stand();
            assertEquals(1, h17.playDealer().size(), "H17 draws one card on soft 17");
            assertEquals(19, h17.dealerHand().value());
        }
    }

    @Nested
    @DisplayName("Settlement")
    class SettlementTests {

        @Test
        @DisplayName("A natural blackjack pays 3:2")
        void blackjackPays3to2() {
            Deck deck = Deck.of(
                    card(Rank.ACE, Suit.SPADES),    // player
                    card(Rank.TEN, Suit.HEARTS),    // dealer
                    card(Rank.KING, Suit.CLUBS),    // player -> blackjack
                    card(Rank.SEVEN, Suit.DIAMONDS)); // dealer -> 17

            Blackjack game = Blackjack.builder()
                    .cardSource(deck)
                    .dealerStrategy(new StandOnSoft17())
                    .payoutStrategy(new StandardPayout())
                    .player("P", TEN)
                    .build();

            game.deal();
            game.playDealer();
            List<RoundResult> results = game.settle();

            assertEquals(1, results.size());
            RoundResult r = results.get(0);
            assertEquals(Outcome.BLACKJACK, r.outcome());
            // $10 bet -> 3:2 -> $15.00 net profit = 1500 minor units.
            assertEquals(Money.ofMinor(1500, USD), r.netPayout());
            assertEquals(RoundState.DONE, game.state());
        }

        @Test
        @DisplayName("A bust loses even when the dealer also busts")
        void bustLosesRegardlessOfDealer() {
            Deck deck = Deck.of(
                    card(Rank.TEN, Suit.HEARTS),   // player
                    card(Rank.TEN, Suit.CLUBS),    // dealer
                    card(Rank.SEVEN, Suit.SPADES), // player -> 17
                    card(Rank.SIX, Suit.DIAMONDS), // dealer -> 16
                    card(Rank.NINE, Suit.CLUBS));  // player hits -> 26 BUST

            Blackjack game = Blackjack.builder()
                    .cardSource(deck)
                    .dealerStrategy(new StandOnSoft17())
                    .payoutStrategy(new StandardPayout())
                    .player("P", TEN)
                    .build();

            game.deal();
            game.hit(); // player busts

            assertFalse(game.hasPendingPlayer(), "bust ends the player's turn");
            game.playDealer();
            RoundResult r = game.settle().get(0);
            assertEquals(Outcome.LOSE, r.outcome());
            assertEquals(Money.ofMinor(-1000, USD), r.netPayout());
        }

        @Test
        @DisplayName("Equal totals push and return the stake")
        void equalTotalsPush() {
            Deck deck = Deck.of(
                    card(Rank.TEN, Suit.HEARTS),   // player
                    card(Rank.NINE, Suit.CLUBS),   // dealer
                    card(Rank.EIGHT, Suit.SPADES), // player -> 18
                    card(Rank.NINE, Suit.DIAMONDS)); // dealer -> 18

            Blackjack game = Blackjack.builder()
                    .cardSource(deck)
                    .dealerStrategy(new StandOnSoft17())
                    .payoutStrategy(new StandardPayout())
                    .player("P", TEN)
                    .build();

            game.deal();
            game.stand();
            game.playDealer();
            RoundResult r = game.settle().get(0);

            assertEquals(Outcome.PUSH, r.outcome());
            assertTrue(r.netPayout().isZero());
        }
    }

    @Nested
    @DisplayName("State machine guards")
    class StateMachineTests {

        private Blackjack freshGame() {
            return Blackjack.builder()
                    .cardSource(Deck.shuffled(1L))
                    .dealerStrategy(new StandOnSoft17())
                    .payoutStrategy(new StandardPayout())
                    .player("P", TEN)
                    .build();
        }

        @Test
        @DisplayName("Hitting before the deal is rejected")
        void cannotHitBeforeDeal() {
            Blackjack game = freshGame();
            assertThrows(IllegalStateException.class, game::hit);
        }

        @Test
        @DisplayName("Settling before the dealer plays is rejected")
        void cannotSettleBeforeDealerPlays() {
            Blackjack game = freshGame();
            game.deal();
            game.stand(); // player turn now over -> DEALER_TURN
            assertThrows(IllegalStateException.class, game::settle);
        }

        @Test
        @DisplayName("A blank player name is rejected by the builder")
        void rejectsBlankPlayerName() {
            assertThrows(IllegalArgumentException.class, () ->
                    Blackjack.builder()
                            .cardSource(Deck.shuffled(1L))
                            .dealerStrategy(new StandOnSoft17())
                            .payoutStrategy(new StandardPayout())
                            .player("   ", TEN));
        }
    }
}

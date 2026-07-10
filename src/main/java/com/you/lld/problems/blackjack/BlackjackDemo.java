package com.you.lld.problems.blackjack;

import com.you.lld.common.Money;
import com.you.lld.problems.blackjack.model.Card;
import com.you.lld.problems.blackjack.model.Deck;
import com.you.lld.problems.blackjack.model.Hand;
import com.you.lld.problems.blackjack.model.Player;
import com.you.lld.problems.blackjack.model.Rank;
import com.you.lld.problems.blackjack.model.RoundResult;
import com.you.lld.problems.blackjack.model.Shoe;
import com.you.lld.problems.blackjack.model.Suit;
import com.you.lld.problems.blackjack.service.DealerStrategy;
import com.you.lld.problems.blackjack.service.PayoutStrategy;
import com.you.lld.problems.blackjack.service.impl.HitOnSoft17;
import com.you.lld.problems.blackjack.service.impl.SixToFivePayout;
import com.you.lld.problems.blackjack.service.impl.StandOnSoft17;
import com.you.lld.problems.blackjack.service.impl.StandardPayout;

import java.util.Currency;
import java.util.List;

/**
 * Interview-style walkthrough of the Blackjack design. Each scenario proves one
 * design point and prints readable output.
 *
 * <p>Run:
 * <pre>
 *   mvn -q compile exec:java \
 *     -Dexec.mainClass="com.you.lld.problems.blackjack.BlackjackDemo"
 * </pre>
 */
public final class BlackjackDemo {

    private static final Currency USD = Currency.getInstance("USD");
    private static final Money TEN = Money.ofMinor(1000, USD); // $10.00

    public static void main(String[] args) {
        aceValuationShowcase();
        scenario1_standAndDealerStandsOn17();
        scenario2_naturalBlackjackPays3to2();
        scenario3_doubleDownWins();
        scenario4_playerBusts();
        scenario5_pluggableRules();
    }

    // ------------------------------------------------------------------- helpers

    private static Card card(Rank rank, Suit suit) {
        return new Card(suit, rank);
    }

    private static void banner(String title) {
        System.out.println("\n=== " + title + " ===");
    }

    private static void showHands(Blackjack game) {
        for (Player p : game.players()) {
            System.out.println("  " + p);
        }
        System.out.println("  Dealer " + game.dealerHand());
    }

    private static void showResults(List<RoundResult> results) {
        System.out.println("  -- settlement --");
        for (RoundResult r : results) {
            System.out.println("  " + r);
        }
    }

    // ------------------------------------------------------------------- showcase

    /** Design point: Ace soft/hard valuation picks the best non-busting total. */
    private static void aceValuationShowcase() {
        banner("Ace (soft/hard) valuation");
        printHandValue("Ten + King", card(Rank.TEN, Suit.HEARTS), card(Rank.KING, Suit.SPADES));
        printHandValue("Ace + Six (soft 17)", card(Rank.ACE, Suit.CLUBS), card(Rank.SIX, Suit.DIAMONDS));
        printHandValue("Ace + Ace + Nine", card(Rank.ACE, Suit.CLUBS), card(Rank.ACE, Suit.HEARTS),
                card(Rank.NINE, Suit.SPADES));
        printHandValue("Ace + Six + Ten (Ace demoted to 1)", card(Rank.ACE, Suit.CLUBS),
                card(Rank.SIX, Suit.DIAMONDS), card(Rank.TEN, Suit.SPADES));
    }

    private static void printHandValue(String label, Card... cards) {
        Hand hand = new Hand();
        for (Card c : cards) {
            hand.add(c);
        }
        System.out.println("  " + label + " -> " + hand);
    }

    // ------------------------------------------------------------------ scenario 1

    /**
     * Design point: clean state machine + dealer draw Strategy (S17). The player
     * stands on 19; the dealer must draw to at least 17 and then stands.
     */
    private static void scenario1_standAndDealerStandsOn17() {
        banner("Scenario 1: player stands, dealer draws to 17 (S17)");
        // Deal order (1 player): P, D, P, D, then dealer draws.
        Deck deck = Deck.of(
                card(Rank.TEN, Suit.HEARTS),   // Alice
                card(Rank.SEVEN, Suit.CLUBS),  // Dealer up
                card(Rank.NINE, Suit.SPADES),  // Alice  -> 19
                card(Rank.SIX, Suit.DIAMONDS), // Dealer -> 13
                card(Rank.FOUR, Suit.CLUBS));  // Dealer draw -> 17, stands

        Blackjack game = Blackjack.builder()
                .cardSource(deck)
                .dealerStrategy(new StandOnSoft17())
                .payoutStrategy(new StandardPayout())
                .player("Alice", TEN)
                .build();

        game.deal();
        System.out.println("  Dealer shows: " + game.dealerUpCard());
        System.out.println("  Alice stands on " + game.currentPlayer().hand().value());
        game.stand();
        List<Card> drew = game.playDealer();
        System.out.println("  Dealer draws: " + drew + " under " + game.dealerStrategy().describe());
        showHands(game);
        showResults(game.settle());
    }

    // ------------------------------------------------------------------ scenario 2

    /** Design point: a natural blackjack pays 3:2 via the payout Strategy. */
    private static void scenario2_naturalBlackjackPays3to2() {
        banner("Scenario 2: natural blackjack pays 3:2");
        Deck deck = Deck.of(
                card(Rank.ACE, Suit.SPADES),    // Bob
                card(Rank.TEN, Suit.HEARTS),    // Dealer up
                card(Rank.KING, Suit.CLUBS),    // Bob -> blackjack (21)
                card(Rank.SEVEN, Suit.DIAMONDS)); // Dealer -> 17

        Blackjack game = Blackjack.builder()
                .cardSource(deck)
                .dealerStrategy(new StandOnSoft17())
                .payoutStrategy(new StandardPayout())
                .player("Bob", TEN)
                .build();

        game.deal();
        System.out.println("  Bob is dealt a natural: " + game.players().get(0).hand());
        System.out.println("  hasPendingPlayer=" + game.hasPendingPlayer() + " (naturals do not act)");
        game.playDealer();
        showHands(game);
        List<RoundResult> results = game.settle();
        showResults(results);
        System.out.println("  $10 bet -> net " + results.get(0).netPayout() + " (3:2)");
    }

    // ------------------------------------------------------------------ scenario 3

    /** Design point: double-down doubles the wager, takes one card, then stands. */
    private static void scenario3_doubleDownWins() {
        banner("Scenario 3: double-down (H17 dealer)");
        Deck deck = Deck.of(
                card(Rank.FIVE, Suit.HEARTS),   // Dan
                card(Rank.ACE, Suit.CLUBS),     // Dealer up (soft)
                card(Rank.SIX, Suit.SPADES),    // Dan -> 11 (classic double)
                card(Rank.SIX, Suit.DIAMONDS),  // Dealer -> soft 17
                card(Rank.NINE, Suit.CLUBS),    // Dan's double card -> 20
                card(Rank.TEN, Suit.HEARTS));   // Dealer hits soft 17 -> hard 17, stands

        Blackjack game = Blackjack.builder()
                .cardSource(deck)
                .dealerStrategy(new HitOnSoft17())
                .payoutStrategy(new StandardPayout())
                .player("Dan", TEN)
                .build();

        game.deal();
        System.out.println("  Dan doubles on " + game.currentPlayer().hand().value()
                + " (bet " + game.currentPlayer().bet() + ")");
        game.doubleDown();
        System.out.println("  Dan after double: " + game.players().get(0).hand()
                + " bet now " + game.players().get(0).bet());
        List<Card> drew = game.playDealer();
        System.out.println("  Dealer draws: " + drew + " under " + game.dealerStrategy().describe());
        showHands(game);
        showResults(game.settle());
    }

    // ------------------------------------------------------------------ scenario 4

    /** Design point: bust detection ends the turn and loses regardless of dealer. */
    private static void scenario4_playerBusts() {
        banner("Scenario 4: player busts");
        Deck deck = Deck.of(
                card(Rank.TEN, Suit.HEARTS),   // Carol
                card(Rank.NINE, Suit.CLUBS),   // Dealer up
                card(Rank.SEVEN, Suit.SPADES), // Carol -> 17
                card(Rank.NINE, Suit.DIAMONDS),// Dealer -> 18
                card(Rank.TEN, Suit.CLUBS));   // Carol hits -> 27, BUST

        Blackjack game = Blackjack.builder()
                .cardSource(deck)
                .dealerStrategy(new StandOnSoft17())
                .payoutStrategy(new StandardPayout())
                .player("Carol", TEN)
                .build();

        game.deal();
        System.out.println("  Carol hits on " + game.currentPlayer().hand().value() + "...");
        Card c = game.hit();
        System.out.println("  drew " + c + " -> " + game.players().get(0).hand());
        System.out.println("  hasPendingPlayer=" + game.hasPendingPlayer() + " (bust ends the turn)");
        game.playDealer();
        showHands(game);
        showResults(game.settle());
    }

    // ------------------------------------------------------------------ scenario 5

    /**
     * Design point: rules are pluggable. (a) The SAME scripted deal under S17
     * vs H17 produces opposite results. (b) A seeded 6-deck shoe with a 6:5
     * payout runs the identical orchestrator, and the seed makes it reproducible.
     */
    private static void scenario5_pluggableRules() {
        banner("Scenario 5a: same deal, S17 vs H17 -> opposite outcomes");
        // Eve stands on 18; dealer opens A-6 = soft 17.
        Card[] script = {
                card(Rank.TEN, Suit.HEARTS),   // Eve
                card(Rank.ACE, Suit.CLUBS),    // Dealer up
                card(Rank.EIGHT, Suit.SPADES), // Eve -> 18
                card(Rank.SIX, Suit.DIAMONDS), // Dealer -> soft 17
                card(Rank.FIVE, Suit.CLUBS),   // (only H17 draws from here)
                card(Rank.FOUR, Suit.HEARTS),
                card(Rank.THREE, Suit.SPADES)
        };
        System.out.println("  S17: " + runFixedDeal(new StandOnSoft17(), script));
        System.out.println("  H17: " + runFixedDeal(new HitOnSoft17(), script));

        banner("Scenario 5b: seeded 6-deck shoe + 6:5 payout (reproducible)");
        long seed = 42L;
        System.out.println("  first run:  " + runShoeRound(seed));
        System.out.println("  second run: " + runShoeRound(seed) + "  <- identical (same seed)");
    }

    /** Runs Eve's fixed deal against a given dealer strategy; returns her result. */
    private static String runFixedDeal(DealerStrategy dealerStrategy, Card[] script) {
        Blackjack game = Blackjack.builder()
                .cardSource(Deck.of(script))
                .dealerStrategy(dealerStrategy)
                .payoutStrategy(new StandardPayout())
                .player("Eve", TEN)
                .build();
        game.deal();
        game.stand();
        game.playDealer();
        RoundResult r = game.settle().get(0);
        return "Eve " + game.players().get(0).hand().value()
                + " vs Dealer " + game.dealerHand().value() + " -> " + r.outcome();
    }

    /** Plays one round from a seeded 6-deck shoe with a basic "hit below 17" player. */
    private static String runShoeRound(long seed) {
        PayoutStrategy payout = new SixToFivePayout();
        Blackjack game = Blackjack.builder()
                .cardSource(Shoe.of(6, seed))
                .dealerStrategy(new StandOnSoft17())
                .payoutStrategy(payout)
                .player("Frank", TEN)
                .build();
        game.deal();
        while (game.hasPendingPlayer()) {
            if (game.currentPlayer().hand().value() < 17) {
                game.hit();
            } else {
                game.stand();
            }
        }
        game.playDealer();
        RoundResult r = game.settle().get(0);
        return "Frank " + game.players().get(0).hand()
                + " vs Dealer " + game.dealerHand() + " -> " + r.outcome()
                + " (" + payout.describe() + ")";
    }

    private BlackjackDemo() {
    }
}

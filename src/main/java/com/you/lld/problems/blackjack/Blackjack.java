package com.you.lld.problems.blackjack;

import com.you.lld.common.Money;
import com.you.lld.problems.blackjack.model.Card;
import com.you.lld.problems.blackjack.model.CardSource;
import com.you.lld.problems.blackjack.model.Hand;
import com.you.lld.problems.blackjack.model.Outcome;
import com.you.lld.problems.blackjack.model.Player;
import com.you.lld.problems.blackjack.model.PlayerStatus;
import com.you.lld.problems.blackjack.model.RoundResult;
import com.you.lld.problems.blackjack.model.RoundState;
import com.you.lld.problems.blackjack.service.DealerStrategy;
import com.you.lld.problems.blackjack.service.PayoutStrategy;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * The table / round orchestrator — the "god object" that owns one round of
 * Blackjack and enforces its lifecycle.
 *
 * <p><b>State machine.</b> A round advances strictly through
 * {@code BETTING -> PLAYER_TURN -> DEALER_TURN -> SETTLEMENT -> DONE}
 * (see {@link RoundState}). Rather than a class-per-state hierarchy — overkill
 * for five linear phases — the machine is a single enum guard: every public
 * operation asserts the phase it requires and advances it, so out-of-order
 * calls fail fast. Collaborators (the {@link CardSource}, {@link DealerStrategy}
 * and {@link PayoutStrategy}) are injected via the {@link Builder}, keeping the
 * orchestrator decoupled from concrete rules.
 *
 * <p><b>Thread-safety.</b> Deliberately none. A single Blackjack table is
 * inherently single-threaded — players and the dealer act in strict turn order,
 * so two actions never occur concurrently on one round. Adding locks would only
 * add cost and obscure the sequential logic. Concurrency belongs at a higher
 * layer (many independent tables), where each {@code Blackjack} instance is
 * confined to its own thread and shares no mutable state.
 */
public final class Blackjack {

    private static final int TARGET = 21;

    private final CardSource cardSource;
    private final DealerStrategy dealerStrategy;
    private final PayoutStrategy payoutStrategy;
    private final List<Player> players;
    private final Hand dealerHand = new Hand();

    private RoundState state = RoundState.BETTING;
    private int currentPlayerIndex = 0;
    private List<RoundResult> results = Collections.emptyList();

    private Blackjack(CardSource cardSource,
                      DealerStrategy dealerStrategy,
                      PayoutStrategy payoutStrategy,
                      List<Player> players) {
        this.cardSource = cardSource;
        this.dealerStrategy = dealerStrategy;
        this.payoutStrategy = payoutStrategy;
        this.players = players;
    }

    public static Builder builder() {
        return new Builder();
    }

    // ---------------------------------------------------------------- phase 1: deal

    /**
     * Deals the opening two cards to each player and the dealer, then flags any
     * naturals and opens the players' turn.
     *
     * <p>Cards are dealt casino-style: one card to every player in seat order,
     * one to the dealer, then a second round in the same order.
     */
    public Blackjack deal() {
        requireState(RoundState.BETTING);
        for (int round = 0; round < 2; round++) {
            for (Player player : players) {
                player.hand().add(cardSource.deal());
            }
            dealerHand.add(cardSource.deal());
        }
        // A player dealt a natural does not act — lock them as standing.
        for (Player player : players) {
            if (player.hand().isBlackjack()) {
                player.setStatus(PlayerStatus.STANDING);
            }
        }
        state = RoundState.PLAYER_TURN;
        currentPlayerIndex = 0;
        advancePastDonePlayers();
        return this;
    }

    // ------------------------------------------------------------- phase 2: player turn

    /** The player who must act now. */
    public Player currentPlayer() {
        requireState(RoundState.PLAYER_TURN);
        if (!hasPendingPlayer()) {
            throw new IllegalStateException("No player is pending; the dealer must play");
        }
        return players.get(currentPlayerIndex);
    }

    /** Whether any seated player still has a decision to make. */
    public boolean hasPendingPlayer() {
        return state == RoundState.PLAYER_TURN && currentPlayerIndex < players.size();
    }

    /** Current player draws one card; a bust ends their turn. */
    public Card hit() {
        Player player = currentPlayer();
        Card card = cardSource.deal();
        player.hand().add(card);
        if (player.hand().isBust()) {
            player.setStatus(PlayerStatus.BUST);
            advancePastDonePlayers();
        }
        return card;
    }

    /** Current player stops; their total stands. */
    public void stand() {
        Player player = currentPlayer();
        player.setStatus(PlayerStatus.STANDING);
        advancePastDonePlayers();
    }

    /**
     * Current player doubles the wager, takes exactly one card and is then
     * done. Only legal as the opening decision (a two-card hand).
     */
    public Card doubleDown() {
        Player player = currentPlayer();
        if (player.hand().size() != 2) {
            throw new IllegalStateException("Double-down is only allowed on the opening two-card hand");
        }
        player.doubleBet();
        Card card = cardSource.deal();
        player.hand().add(card);
        player.setStatus(player.hand().isBust() ? PlayerStatus.BUST : PlayerStatus.STANDING);
        advancePastDonePlayers();
        return card;
    }

    private void advancePastDonePlayers() {
        while (currentPlayerIndex < players.size() && players.get(currentPlayerIndex).isDone()) {
            currentPlayerIndex++;
        }
        if (currentPlayerIndex >= players.size()) {
            state = RoundState.DEALER_TURN;
        }
    }

    // ------------------------------------------------------------- phase 3: dealer turn

    /**
     * Dealer draws according to its {@link DealerStrategy}. If every player has
     * already busted the dealer stands pat, since the outcome is decided.
     *
     * @return the cards the dealer drew, in order (empty if it stood)
     */
    public List<Card> playDealer() {
        requireState(RoundState.DEALER_TURN);
        List<Card> drawn = new ArrayList<Card>();
        if (anyPlayerLive()) {
            while (dealerStrategy.shouldHit(dealerHand)) {
                Card card = cardSource.deal();
                dealerHand.add(card);
                drawn.add(card);
            }
        }
        state = RoundState.SETTLEMENT;
        return drawn;
    }

    private boolean anyPlayerLive() {
        for (Player player : players) {
            if (player.status() != PlayerStatus.BUST) {
                return true;
            }
        }
        return false;
    }

    // -------------------------------------------------------------- phase 4: settlement

    /**
     * Compares each player against the dealer, applies the payout strategy and
     * closes the round.
     *
     * @return one immutable {@link RoundResult} per player, in seat order
     */
    public List<RoundResult> settle() {
        requireState(RoundState.SETTLEMENT);
        List<RoundResult> settled = new ArrayList<RoundResult>(players.size());
        for (Player player : players) {
            Outcome outcome = resolve(player);
            Money net = payoutStrategy.netPayout(player.bet(), outcome);
            settled.add(new RoundResult(player.name(), outcome, player.bet(), net));
        }
        this.results = Collections.unmodifiableList(settled);
        state = RoundState.DONE;
        return results;
    }

    /** Pure comparison of one player's hand against the dealer's final hand. */
    private Outcome resolve(Player player) {
        Hand hand = player.hand();
        if (hand.isBust()) {
            return Outcome.LOSE;
        }
        boolean dealerBlackjack = dealerHand.isBlackjack();
        if (hand.isBlackjack()) {
            return dealerBlackjack ? Outcome.PUSH : Outcome.BLACKJACK;
        }
        if (dealerBlackjack) {
            return Outcome.LOSE;
        }
        if (dealerHand.isBust()) {
            return Outcome.WIN;
        }
        int diff = hand.value() - dealerHand.value();
        if (diff > 0) {
            return Outcome.WIN;
        }
        if (diff < 0) {
            return Outcome.LOSE;
        }
        return Outcome.PUSH;
    }

    // ----------------------------------------------------------------------- accessors

    public RoundState state() {
        return state;
    }

    public Hand dealerHand() {
        return dealerHand;
    }

    /** The dealer's face-up card (the first one dealt). */
    public Card dealerUpCard() {
        if (dealerHand.size() == 0) {
            throw new IllegalStateException("No cards dealt yet");
        }
        return dealerHand.cards().get(0);
    }

    public List<Player> players() {
        return Collections.unmodifiableList(players);
    }

    public List<RoundResult> results() {
        return results;
    }

    public DealerStrategy dealerStrategy() {
        return dealerStrategy;
    }

    public PayoutStrategy payoutStrategy() {
        return payoutStrategy;
    }

    public int cardsRemaining() {
        return cardSource.remaining();
    }

    private void requireState(RoundState expected) {
        if (state != expected) {
            throw new IllegalStateException(
                    "Illegal operation in state " + state + "; expected " + expected);
        }
    }

    // --------------------------------------------------------------------------- builder

    /**
     * Fluent builder for a round. Collects the injected strategies and the
     * seated players, then validates before producing an immutable table.
     */
    public static final class Builder {
        private CardSource cardSource;
        private DealerStrategy dealerStrategy;
        private PayoutStrategy payoutStrategy;
        private final List<Player> players = new ArrayList<Player>();

        public Builder cardSource(CardSource cardSource) {
            this.cardSource = Objects.requireNonNull(cardSource, "cardSource");
            return this;
        }

        public Builder dealerStrategy(DealerStrategy dealerStrategy) {
            this.dealerStrategy = Objects.requireNonNull(dealerStrategy, "dealerStrategy");
            return this;
        }

        public Builder payoutStrategy(PayoutStrategy payoutStrategy) {
            this.payoutStrategy = Objects.requireNonNull(payoutStrategy, "payoutStrategy");
            return this;
        }

        /** Seats a player with the given wager. */
        public Builder player(String name, Money bet) {
            this.players.add(new Player(name, bet));
            return this;
        }

        public Blackjack build() {
            Objects.requireNonNull(cardSource, "cardSource must be set");
            Objects.requireNonNull(dealerStrategy, "dealerStrategy must be set");
            Objects.requireNonNull(payoutStrategy, "payoutStrategy must be set");
            if (players.isEmpty()) {
                throw new IllegalStateException("At least one player must be seated");
            }
            return new Blackjack(cardSource, dealerStrategy, payoutStrategy,
                    new ArrayList<Player>(players));
        }
    }
}

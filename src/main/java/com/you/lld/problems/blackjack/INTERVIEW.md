# Blackjack / Deck of Cards — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute low-level-design walkthrough. Sections mirror how you would drive the interview: clarify → requirements → entities → relationships → patterns → key implementation → follow-ups → trade-offs.

---

## 1. Clarifying questions (5–10 min)

Before modelling anything, pin the scope. Blackjack has enormous rule variance, so the first move is to bound it.

- **How many decks?** One 52-card deck, or a multi-deck shoe? *Decision:* support both behind one abstraction; casinos use 4–8 deck shoes, single-deck is the teaching case.
- **Single player vs multiple at the table?** *Decision:* multiple players share the table and one dealer; each plays against the dealer independently (players don't compete with each other).
- **Which player actions?** Hit/stand are mandatory; double-down and split are common. *Decision:* implement hit/stand/double-down; treat split as a scoped follow-up (it changes the "one hand per player" invariant).
- **Dealer rule?** Stand on all 17 (S17) or hit soft 17 (H17)? *Decision:* make it a pluggable policy so both work.
- **Payouts?** Blackjack 3:2 or 6:5? Insurance/surrender? *Decision:* 3:2 and 6:5 as pluggable payout rules; skip insurance/surrender initially.
- **Do we need betting/bankrolls?** *Decision:* model a wager per hand and a signed net payout at settlement; a persistent bankroll ledger is out of scope.
- **Reproducibility / testability?** *Decision:* all randomness comes from a seeded RNG so games replay identically, and tests can script exact deals.
- **Concurrency?** Is one table accessed by multiple threads? *Decision:* no — a table is a turn-based, single-threaded unit; scale out with many independent tables.

**Assumptions stated back:** N players + 1 dealer, one hand per player, hit/stand/double, S17/H17 pluggable, 3:2/6:5 pluggable, seeded RNG, single-threaded table.

---

## 2. Functional requirements

1. Represent a standard 52-card deck: 4 suits × 13 ranks, all distinct.
2. Shuffle reproducibly (seeded RNG); support a multi-deck shoe with a reshuffle threshold.
3. Deal opening hands casino-style (round-robin, two cards each).
4. Compute a hand's value with Ace as 1 or 11 (soft/hard), detect bust (>21) and natural blackjack (two-card 21).
5. Player actions: hit, stand, double-down.
6. Dealer plays a fixed policy: draw to 16, stand on 17 — with soft-17 behaviour swappable (S17 vs H17).
7. Settle each player vs dealer into WIN / LOSE / PUSH / BLACKJACK and compute the net payout (1:1, 3:2 or 6:5, push returns stake).

## 3. Non-functional requirements

- **Reproducibility:** identical seed ⇒ identical game. Randomness confined to the deck/shoe factory.
- **Extensibility:** new dealer rules, payout rules, and additional card sources drop in without editing the orchestrator (Open/Closed).
- **Correctness & clarity:** state transitions are explicit and guarded; no silent illegal states.
- **Testability:** hand valuation is a pure function; round logic is exercised with fully scripted decks.
- **No premature concurrency:** the table is single-threaded by design; that decision is documented, not accidental.

---

## 4. Core entities

Each entity below lists its **layer** and an **internal summary**.

- **Suit** *(model / enum)* — HEARTS, DIAMONDS, CLUBS, SPADES. Purely for card distinctness; no value impact.
- **Rank** *(model / enum)* — TWO…KING, ACE. Carries `baseValue()` (Ace = 1, face = 10). Deliberately does **not** encode the Ace's 11 — that is a hand-level decision.
- **Card** *(model / value object)* — immutable `(Suit, Rank)` with `equals`/`hashCode`, guaranteeing 52 distinct cards. Shareable without copying.
- **CardSource** *(model / interface)* — `deal()`, `remaining()`, `needsReshuffle()`. The abstraction the orchestrator draws from.
- **Deck** *(model)* — a single 52-card `CardSource`. Front-to-back cursor over a list; static factories `standardOrdered()`, `shuffled(seed)`, `of(cards…)`. A single deck asks to reshuffle only when exhausted.
- **Shoe** *(model)* — N decks shuffled together with a ~75% penetration cut card; `needsReshuffle()` fires early. Second, genuinely different `CardSource`.
- **Hand** *(model / mutable aggregate)* — a growing list of cards with **pure** valuation: `value()`, `isSoft()`, `isBust()`, `isBlackjack()`. The soft/hard Ace rule lives here.
- **PlayerStatus** *(model / enum)* — PLAYING / STANDING / BUST; `done()` collapses the two terminal states so the turn cursor can advance uniformly.
- **Player** *(model / round-scoped entity)* — name, `Money` bet (can double), `Hand`, `PlayerStatus`. Self-validating; carries no cross-hand comparison logic.
- **Outcome** *(model / enum)* — BLACKJACK / WIN / PUSH / LOSE. BLACKJACK is separate from WIN because it pays a different ratio.
- **RoundState** *(model / enum)* — BETTING → PLAYER_TURN → DEALER_TURN → SETTLEMENT → DONE. Drives the orchestrator's guard.
- **RoundResult** *(model / value object)* — immutable `(playerName, outcome, bet, netPayout)`; summing `netPayout` gives the house result.
- **DealerStrategy** *(service / interface)* — `shouldHit(dealerHand)`. Impls: **StandOnSoft17**, **HitOnSoft17**.
- **PayoutStrategy** *(service / interface)* — `netPayout(bet, outcome)`. Impls: **StandardPayout** (3:2), **SixToFivePayout** (6:5).
- **Blackjack** *(orchestrator / root)* — owns the round: the `CardSource`, both strategies, the players and the dealer hand; runs the state machine; produces `RoundResult`s. Built via a fluent **Builder**.

---

## 5. Relationships

- `Blackjack` **has-a** `CardSource`, one `DealerStrategy`, one `PayoutStrategy` (composition of injected collaborators).
- `Blackjack` **has** many `Player`s and exactly one dealer `Hand`.
- `Player` **has-a** `Hand`; a `Hand` **has** many `Card`s.
- `Deck` and `Shoe` **implement** `CardSource`; `StandOnSoft17`/`HitOnSoft17` implement `DealerStrategy`; `StandardPayout`/`SixToFivePayout` implement `PayoutStrategy`.
- `Blackjack` **produces** `RoundResult`s at settlement.

The orchestrator depends only on interfaces (`CardSource`, `DealerStrategy`, `PayoutStrategy`) and model types — never on a concrete rule — which is what makes the rules pluggable.

---

## 6. Design patterns (and why, vs alternatives)

- **Strategy — dealer draw policy & payout rules.** These are the *only* dimensions that vary between real tables. Encapsulating each behind an interface keeps the round loop closed to modification. *Alternative:* a boolean flag / `switch` in the orchestrator — rejected because every new rule reopens and bloats the god object.
- **State machine (enum-guarded) — round lifecycle.** Five strictly one-way phases. Every public method calls `requireState(...)` then advances, so "hit before deal" or "settle twice" throw immediately with a clear message. *Alternative:* the GoF **State** pattern (a class per phase). Rejected here: with five linear transitions and no shared per-state data, a class hierarchy is more indirection than the problem earns. (If actions became wildly phase-dependent, promoting to State classes is the natural next step — noted as a follow-up.)
- **Factory method — deck/shoe construction.** `Deck.shuffled(seed)` / `Shoe.of(n, seed)` are the only way to get a playable pile, so the seed and the shuffle are captured at one boundary and a caller can't forget to shuffle. *Alternative:* a public constructor taking a pre-built list — kept only as the scripted `of(...)` test hook, not the normal path.
- **Builder — assembling a round.** A round needs a card source, two strategies and ≥1 seated player; a telescoping constructor would be unreadable. The builder validates once in `build()` and returns an immutable table.
- **Dependency inversion — `CardSource`.** The orchestrator neither knows nor cares whether it's drawing from one deck or six; the demo proves the identical loop runs against both.

---

## 7. Key implementation details

### 7.1 Ace soft/hard valuation (the crux)

```java
int hard = 0; boolean hasAce = false;
for (Card c : cards) { hard += c.baseValue(); if (c.isAce()) hasAce = true; }
return (hasAce && hard + 10 <= 21) ? hard + 10 : hard;   // promote ONE ace to 11
```

The insight that removes all special-casing: **at most one Ace can ever count as 11**, because two 11s = 22 is already a bust. So we compute the hard total (all Aces = 1) and, if the hand holds any Ace and adding 10 doesn't bust, promote exactly one. This single expression correctly yields:

- `A + 6` → hard 7, +10 = **soft 17**
- `A + A + 9` → hard 11, +10 = **21** (one Ace 11, one Ace 1 — never 31)
- `A + 6 + 10` → hard 17, +10 = 27 > 21 ⇒ stays **17** (Ace demoted)

`isSoft()` is the same predicate (`hasAce && hard + 10 <= 21`); a soft hand can't bust on the next hit, which is exactly what H17 keys off. A **natural blackjack** is `size == 2 && value == 21`, kept distinct from a three-card 21 so it can beat a dealer 21 and pay 3:2.

### 7.2 The round state machine

`deal()` requires `BETTING`, deals two round-robin cards to each player then the dealer, flags any naturals as `STANDING` (they don't act), and moves to `PLAYER_TURN`. `hit()/stand()/doubleDown()` act on the current player and call `advancePastDonePlayers()`, which walks the seat cursor past everyone who is done; when it runs off the end it flips to `DEALER_TURN`. `playDealer()` draws per the strategy (skipping the draw entirely if every player already busted — the result is decided), then `SETTLEMENT`. `settle()` compares each player and closes to `DONE`. Because each method guards its phase, the sequence is self-enforcing rather than relying on the caller's discipline.

### 7.3 Outcome resolution (invariant, so not a strategy)

Ordered checks in the orchestrator: player bust ⇒ LOSE (even if the dealer also busts); player natural ⇒ PUSH vs dealer natural else BLACKJACK; dealer natural ⇒ LOSE; dealer bust ⇒ WIN; otherwise compare totals for WIN/LOSE/PUSH. The payout *amount* is then delegated to `PayoutStrategy` — the split between "what happened" (fixed) and "what it pays" (variable) is deliberate.

---

## 8. Likely follow-ups (with concise answers)

- **Add split pairs.** Break the "one hand per player" assumption: a player holds a *list* of hands, each with its own bet; the turn loop iterates hands, not players. `Player` would own `List<Hand>`; the state machine is unaffected. This is the main reason split was scoped out — it's a data-model change, not a rules change.
- **Insurance / surrender.** New player options offered when the dealer shows an Ace; add actions in `PLAYER_TURN` and a side-bet resolution before settlement. Fits as new `Outcome`s + a pre-settlement hook.
- **Card counting / true count.** The `Shoe` already exposes penetration; a counter would observe dealt cards (an Observer on `deal()`). Reshuffle policy is already pluggable via `needsReshuffle()`.
- **Multiple tables / a casino.** Each `Blackjack` is thread-confined; run many on a pool. No shared mutable state means no locking — the concurrency story is "shard by table."
- **Different card games (Poker, War) from the same deck.** `Deck`/`Card`/`Shoe`/`Hand` are game-agnostic and reusable; only the orchestrator + strategies are Blackjack-specific.
- **Persistence / replay.** Persist the seed + the action log; the seeded RNG guarantees an identical replay. This is why randomness is centralised in the factory.
- **Why not compute value incrementally?** Recomputing from scratch is O(cards) on a hand of ≤ ~11 cards — negligible, and a pure function is far easier to reason about and test than a running counter with Ace bookkeeping.

---

## 9. Trade-offs

- **Enum state machine vs State classes.** Chose the enum for brevity and fail-fast guards; accepted that a future with many phase-specific behaviours might warrant promoting to classes.
- **Single-threaded table.** Simpler, faster, and matches the domain (turn-based). Trade-off: a single table can't be driven concurrently — acceptable, since real concurrency is across tables.
- **`Money` in minor units with `percent` (basis points).** No floating-point drift (150% of $10 is exactly $15), at the cost of truncation on odd ratios/odd stakes — fine for whole-chip betting; a real system would define rounding rules per jurisdiction.
- **Outcome logic in the orchestrator, not a strategy.** Keeps invariant rules in one readable place; the cost is that a truly exotic variant (e.g. a push-22 rule) would touch the orchestrator rather than a plug-in. Judged the right default for clarity.
- **Recompute-on-read hand value.** Favoured simplicity/purity over micro-optimising an already trivial computation.
```

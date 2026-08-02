# Online Auction (eBay-style) — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> The part everyone underestimates is **proxy (automatic) bidding**. It looks like
> "keep bidding one increment until someone stops", and implementing it that way
> is both wrong and, as §7.2 shows, capable of blowing the stack.

---

## 1. Clarifying Questions (first 5 minutes)

1. **Auction format?** English ascending-price with a fixed end time. (Dutch,
   sealed-bid, and Vickrey are different algorithms behind the same interface — a
   good place to mention Strategy if asked to extend.)
2. **Proxy bidding?** Yes — a bidder registers a **maximum** and the system bids on
   their behalf. This is eBay's core mechanic and the interesting part of the
   problem.
3. **What price does a proxy actually pay?** The rule I'd confirm out loud: the
   winner pays the **second-highest maximum plus one increment**, capped at their
   own maximum. Not their full maximum — that's a Vickrey-ish property that
   surprises people, and getting it wrong is a correctness bug, not a detail.
4. **Bid increment?** Fixed per auction. Real sites scale it with price; that's a
   Strategy.
5. **Can a seller bid on their own auction?** No — shill bidding.
6. **How does an auction end?** At `endTime`, automatically, without anyone
   calling in. That means a scheduler.
7. **Concurrency?** Yes — the closing seconds of a popular auction are the whole
   stress case.
8. **Retractions, reserve prices, sniping protection?** Out of core scope; I'll
   name where each attaches.

---

## 2. Functional Requirements

- Create an auction for an item with a starting price, increment, and time window.
- Place a manual bid; reject anything not above the current price.
- **Register a proxy bid** (a maximum); the system bids automatically up to it.
- Auctions transition `SCHEDULED → ACTIVE → COMPLETED`, or `CANCELLED`.
- Auctions end automatically at `endTime`.
- Sellers may not bid on their own auctions.
- Query current price, winning bidder, and full bid history.

## 3. Non-Functional Requirements

- **Correct proxy settlement**: winner = highest ceiling, price = second ceiling +
  increment, capped.
- **Bounded work per bid** — no unbounded loops or recursion.
- **Thread-safe bidding**: concurrent bids must not both win.
- **Legal transitions only**, enforced by the state objects.
- Automatic expiry without polling from clients.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `Auction` | model (aggregate root) | `currentPrice`, `bidIncrement`, `winningBidderId`, bid list, time window, and its current `AuctionState`. **Every mutator is `synchronized`** — the auction is the unit of mutual exclusion. |
| `AuctionStatus` | model (enum) | `SCHEDULED`, `ACTIVE`, `COMPLETED`, `CANCELLED`. |
| `Bid` / `BidStatus` | model | An immutable-ish record of one bid; `accept()`, `reject()`, `supersede()` mark its fate so history reads correctly. |
| `ProxyBid` | model | `(bidderId, maxAmount)` — the ceiling, **not** a bid. The distinction matters: a proxy is standing authorization, and only the settlement turns it into an actual `Bid`. |
| `Item` | model | What's being sold. |
| `AuctionState` | state (interface) | `placeBid`, `start`, `end`, `cancel`, `status`. |
| `Scheduled` / `Active` / `Completed` / `CancelledAuctionState` | state | One class per phase. Only `ActiveAuctionState.placeBid` accepts a bid; the rest return `false` by construction. |
| `AuctionService` | service (interface) | The contract. |
| `AuctionServiceImpl` | service/impl | Auction registry, per-auction proxy map, expiry scheduler, and proxy settlement. |
| `AuctionSystem` | root | Facade. |

---

## 5. Relationships

- `AuctionServiceImpl` **owns** `auctions` (id → `Auction`) and `proxyBids`
  (auctionId → bidderId → `ProxyBid`) — a nested map, so one bidder has at most one
  standing ceiling per auction and re-registering replaces it.
- An `Auction` **has-a** `AuctionState`; `transitionTo` swaps it. The auction holds
  the data, the state holds the behaviour.
- A `ProxyBid` **produces** `Bid`s but is not one. Settlement reads all ceilings and
  emits at most **one** bid.
- The expiry `ScheduledExecutorService` **drives** `Auction.end()` — the only actor
  that isn't a user request.

---

## 6. Design Patterns (name + why vs alternatives)

- **State — `AuctionState` + four classes.** This is the case where State genuinely
  pays for itself (unlike, say, a two-state order flag): each phase answers
  `placeBid` differently, and `ActiveAuctionState` is the *only* one that can accept
  one. Adding a `PAUSED` phase is a new class, not a new branch in five methods.
  *Alternative:* `if (status == ACTIVE)` guards scattered through the service —
  rejected: the rule gets duplicated at every entry point and drifts.
- **Aggregate root — `Auction`.** All bid mutation goes through the auction's own
  monitor, so the "current price and winning bidder move together" invariant can't
  be violated from outside.
- **Facade — `AuctionSystem`.**
- **Scheduled sweeper** for expiry — a daemon single-thread executor, named thread,
  1 s tick.
- *(Considered, not forced)* **Strategy** for the increment rule (fixed vs
  price-scaled) and for the auction format (English/Dutch/sealed). Both are the
  right shape; neither has a second implementation today.
- *(Considered, not forced)* **Observer** for outbid notifications — the natural
  hook is the settlement step, and it's what a real system needs first.

---

## 7. Key Implementation Details

### 7.1 The auction is the lock

```java
public synchronized boolean placeBid(Bid bid) { return state.placeBid(this, bid); }
public synchronized void recordAcceptedBid(Bid bid) {
    bids.add(bid);
    currentPrice = bid.getAmount();
    winningBidderId = bid.getBidderId();
    ...
}
```

`placeBid` reads `currentPrice`, compares, and then writes both `currentPrice` and
`winningBidderId`. That's a compound action over two fields, so atomics don't help
— and locking on the aggregate means two auctions never contend. The demo's
concurrent-bid scenario confirms exactly one of several simultaneous bids wins.

Note what *isn't* under the lock: proxy settlement runs after `placeBid` returns.
That's deliberate — settlement calls back into the auction, and holding the lock
across it would be needless contention (`synchronized` is reentrant, so it wouldn't
deadlock, but it would serialize more than necessary).

### 7.2 Proxy bidding was mutually recursive — one frame per increment (the headline)

```java
placeBid(...)                       // service
  └─> auction.placeBid(bid)
  └─> resolveProxyCounterBids(...)  // finds a proxy that can beat the new price
        └─> placeBid(...)           // ...which resolves proxies again
              └─> resolveProxyCounterBids(...)
                    └─> ...
```

Each cycle advanced the price by exactly one `bidIncrement`. So the recursion depth
is `(difference between the two ceilings) / increment`. Two bidders with maxima of
500 000 and 499 999 at a 1.00 increment means ~500 000 frames:

```
alice proxy registered, price = 2.00
*** StackOverflowError — proxy resolution recurses once per bid increment ***
```

The demo never caught it because its proxy maxima are a few increments apart.
That's the general lesson: **an algorithm whose cost is proportional to a *value*
rather than to the number of *entities* is a landmine**, and small test data hides it.

The fix is to stop simulating the bidding war and just compute its outcome. The
ascending auction between two ceilings has a known fixed point — you don't need to
iterate to it:

```java
// Highest and second-highest ceilings, one pass.
ProxyBid best = null, runnerUp = null;
for (ProxyBid proxy : proxies.values()) { ... }

BigDecimal toBeat = null;
if (!best.getBidderId().equals(auction.getWinningBidderId())) {
    toBeat = current;                    // someone else holds the price: must beat it
}
if (runnerUp != null) {
    toBeat = (toBeat == null) ? runnerUp.getMaxAmount() : toBeat.max(runnerUp.getMaxAmount());
}
if (toBeat == null) return;              // leader unopposed: price stays put

BigDecimal target = toBeat.add(auction.getBidIncrement()).min(best.getMaxAmount());
if (target.compareTo(current) > 0) placeRawBid(auctionId, best.getBidderId(), target);
```

Three things this gets right that the loop version didn't:

- **O(proxies), not O(price range).** One pass, one bid. No recursion at all.
- **The leader still raises the price when a rival ceiling appears.** The naive
  "skip if already winning" short-circuit is wrong: if Alice leads at 2.00 and Bob
  registers a 499 999 ceiling, the price *must* jump. But an unopposed leader must
  **not** bid against itself — which is why `toBeat` starts as `null` and only
  becomes non-null when there's genuine competition.
- **`.min(best.getMaxAmount())` caps at the ceiling**, so a bidder never pays more
  than authorized even when the rival's ceiling is only a fraction of an increment
  below.

Breaking the recursion structurally required splitting `placeBid` (public, resolves
proxies) from `placeRawBid` (private, records only). Settlement uses the raw one, so
there is no path back into resolution.

Verified against the standard rule set:

| Scenario | Result |
|---|---|
| Lone proxy (max 100) on a 10.00 auction | opens at 11.00 |
| Alice 100 vs Bob 50 | 51.00, Alice |
| Same, registered in the reverse order | 51.00, Alice — order-independent |
| Alice 100 vs Bob 99.50 (sub-increment gap) | 100.00, Alice — capped at her max |
| Alice 100, manual bid 40 by Carol | 41.00, Alice |
| Alice 100, manual bid 150 by Carol | 150.00, Carol — ceiling exceeded |

### 7.3 Automatic expiry

```java
expiryScheduler.scheduleAtFixedRate(this::expireAuctions, 1, 1, TimeUnit.SECONDS);
```

on a **daemon** thread with a name (`auction-expiry`), so it never blocks JVM exit
and is identifiable in a thread dump. `ActiveAuctionState.placeBid` *also* checks
`now > endTime` and rejects — belt and braces, because the sweeper runs at most once
a second and a bid can land in that window. The state check is the authority; the
sweeper just makes the status eventually correct for queries.

---

## 8. Likely Follow-ups (with concise answers)

- **Sniping (bids in the final second)?** Anti-sniping / "soft close": any bid in
  the last N seconds extends `endTime` by N. One field plus a line in the accept
  path — and it changes the auction from a fixed deadline to a quiescence
  condition, which is worth saying.
- **Reserve price?** A minimum below which the item doesn't sell. `end()` checks
  `currentPrice >= reserve`, otherwise `COMPLETED` with no winner. Hidden from
  bidders, so it's not just a higher starting price.
- **Sweeper doesn't scale.** `expireAuctions` scans **every** auction every second —
  O(auctions) per tick forever. Replace with a `DelayQueue`/priority queue keyed on
  `endTime` so only auctions that are actually due are touched. (The
  `asynctaskprocessor` problem in this repo is exactly that machinery.)
- **Persistence and multi-node?** Bids become rows; the auction's monitor becomes a
  row lock or a conditional update `UPDATE auction SET price=?, winner=? WHERE id=? AND price < ?`.
  Proxy ceilings are rows too, and settlement becomes a small transaction.
- **Outbid notifications?** Observer on the settlement step — fire outside the
  auction's lock so a slow notifier can't stall bidding.
- **Bid retraction?** Generally disallowed mid-auction (it enables manipulation);
  if required, `Bid.supersede()`-style tombstoning plus a recompute of the current
  price from the remaining history.
- **Dutch / sealed-bid formats?** A `BiddingStrategy` alongside `AuctionState`:
  Dutch descends until someone accepts; sealed-bid hides all bids until close then
  settles once. The state machine is unchanged; only the accept rule differs.
- **How would you test it?** The §7.2 table as parameterized tests (they're all
  one-liners), plus the far-apart-ceilings case as an explicit regression against
  the recursion, plus N threads bidding at the close to assert exactly one winner.

---

## 9. Trade-offs

- **`synchronized` on the aggregate vs finer locks:** the invariant spans
  `currentPrice` + `winningBidderId` + the bid list, so it needs one lock; costs
  serialization within a single hot auction, which is exactly the moment you care.
  Sharding a single auction isn't possible — the price *is* the shared state.
- **Computing the settlement vs simulating the bidding war:** O(proxies) and no
  stack risk, but the code no longer reads like the story of an auction, so the
  comment has to carry the intent. Worth it — the readable version is unbounded.
- **Settlement outside the auction lock:** less contention, but the price can move
  between `placeBid` returning and settlement running. Benign here (settlement
  re-reads `currentPrice` and no-ops if it's stale), and worth stating rather than
  assuming.
- **Fixed increment vs price-scaled:** simple and predictable; unrealistic at both
  ends of the price range (a 1.00 increment on a 500 000 item is absurd — and was
  precisely what made the recursion so deep).
- **Polling sweeper vs delay queue:** trivial to reason about and correct, but O(n)
  per second forever. Named in §8 as the first thing to fix at scale.
- **`ProxyBid` separate from `Bid`:** keeps "authorization" and "action" distinct,
  which is what makes the settlement rule expressible at all; costs a second concept
  bidders must understand.
- **In-memory:** right scope; §8 covers the durable version.

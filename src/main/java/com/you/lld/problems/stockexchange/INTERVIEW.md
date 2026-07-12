# Stock Exchange — SDE2/SDE3 Interview Walkthrough

**Problem:** Design an order-matching engine with price-time priority, partial fills, trade recording, and cancellation.

---

## 1. Clarifying Questions

- Order types? (Limit buy/sell — market orders as extension.)
- Matching rule? (Price-time priority; trade at resting maker price.)
- Partial fills? (Yes — `PARTIALLY_FILLED` status, remainder on book.)
- Symbols? (Per-symbol `OrderBook`.)
- Cancellation? (Remove from heap by order ID.)
- Concurrency? (`synchronized` on `OrderBook`; concurrent registries.)
- Market data? (Best bid/ask exposed after match.)

---

## 2. Functional Requirements

1. **Submit buy/sell** — limit orders enter matching engine.
2. **Match** — cross when buy price ≥ sell price.
3. **Trade price** — execute at resting (maker) order price.
4. **Partial fill** — fill min(buy qty, sell qty); leave remainder.
5. **Rest unmatched** — add to appropriate priority queue.
6. **Cancel** — remove open quantity from book.
7. **Query** — order status, trade history, best bid/ask.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Time complexity** | O(log n) insert/remove per order in heaps |
| **Fairness** | FIFO among same price level (`createdAt` tie-break) |
| **Thread-safety** | `synchronized` book methods; `ConcurrentHashMap` orders |
| **Correctness** | No crossed book after match completes |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `Order` | model | Limit order | Side, price, qty, status, timestamp |
| `Trade` | model | Execution | Buy/sell IDs, price, qty, time |
| `OrderBook` | model | Per-symbol book | Buy max-heap, sell min-heap |
| `OrderType`, `OrderStatus` | model | Enums | BUY/SELL; NEW, FILLED, PARTIAL, CANCELLED |
| `StockExchangeService` | service | API | buy, sell, cancel, queries |
| `OrderMatchingEngine` | impl | Matcher | Symbol → OrderBook map |
| `StockExchange` | orchestrator | Facade | Demo entry |

---

## 5. Relationships

- `StockExchange` **delegates** to `OrderMatchingEngine`.
- Engine **owns** `Map<symbol, OrderBook>` and trade registry.
- `OrderBook.match()` **pops** crossing top-of-book orders, **invokes** callback to record trades.
- Incoming order **matches first**, **rests** if quantity remains.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **Priority Queues** | Natural price-time ordering vs sorted lists |
| **Callback** (`MatchCallback`) | Book owns loop; engine records trades — separation of concerns |
| **Facade** (`StockExchange`) | Simple buy/sell API for interview |

---

## 7. Key Implementation Details

### 7.1 Price-time comparator

Buy heap: higher price wins; tie earlier `createdAt`. Sell heap: lower price wins; tie earlier time.

### 7.2 Matching loop

While buy heap peek price ≥ sell heap peek price: execute trade at **sell** (maker) price, reduce quantities, re-insert partial remainders.

### 7.3 No immediate match

If incoming buy price < best ask, resting order added to buy heap — spread remains.

---

## 8. Likely Follow-Up Q&A

**Q: Market order?**  
A: Walk book at any price until qty filled or book empty.

**Q: Stop loss?**  
A: Trigger converts to market/limit when price hits — separate trigger book.

**Q: Order book depth API?**  
A: Aggregate by price level from heap snapshots.

**Q: FIFO within price?**  
A: `createdAt` in comparator — standard price-time priority.

**Q: Multi-symbol scale?**  
A: Shard engine per symbol; single-threaded book per symbol avoids lock contention.

**Q: Decimal prices?**  
A: `BigDecimal` or fixed-point long ticks.

**Q: Regulatory audit?**  
A: Append-only trade log with sequence numbers.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| Heap per side | Fast top-of-book; cancel-by-id needs auxiliary map |
| synchronized book | Simple; per-symbol actor model scales further |
| Maker price execution | Standard exchange rule; aggressive order pays spread |
| In-memory | Microsecond demo; persistence + WAL in prod |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.stockexchange.StockExchangeDemo"`

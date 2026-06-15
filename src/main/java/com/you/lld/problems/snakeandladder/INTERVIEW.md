# Snake and Ladder — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a multiplayer snake-and-ladder board game with configurable snakes/ladders, dice rolling, exact-win rule, and game event notifications.

---

## 1. Clarifying Questions

- Players? (2+ turn rotation.)
- Board size? (Configurable via builder — classic 100.)
- Snakes/ladders? (Start/end pairs; builder validates no duplicates.)
- Win rule? (Exact landing on last cell — overshoot stays put.)
- Dice? (Random 1–6; fixed strategy for tests.)
- Chains? (Ladder top landing on snake head resolves in loop, max 20 hops.)
- Thread-safety? (`synchronized playTurn()`.)

---

## 2. Functional Requirements

1. **Build board** — size, snakes, ladders with validation.
2. **Register players** — join before game start.
3. **Play turn** — roll dice, move, apply snake/ladder, check win.
4. **Exact win** — roll exceeding finish position = no move.
5. **Snake/ladder resolution** — teleport and chain until stable.
6. **Events** — emit SNAKE_HIT, LADDER_HIT, GAME_WON to listeners.
7. **Stats** — turns played, snakes hit (demo metrics).

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Validation** | Builder fails on duplicate heads or out-of-bounds |
| **Extensibility** | `DiceStrategy` swappable; `GameEventListener` pluggable |
| **Determinism** | `FixedDiceStrategy` for reproducible demos |
| **Concurrency** | Synchronized turns for multi-threaded triggers |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `Board` | model | Grid logic | Size, snake/ladder maps, resolve position |
| `Snake`, `Ladder` | model | Teleporters | Head/tail or bottom/top cells |
| `Player` | model | Participant | Name, current position |
| `GameResult`, `GameStats` | model | Outcome DTOs | Winner, counters |
| `BoardBuilder` | builder | Fluent setup | addSnake, addLadder, validate, build |
| `DiceStrategy` | service | Roll API | random or fixed sequence |
| `RandomDiceStrategy` / `FixedDiceStrategy` | impl | Dice variants | 1–6 output |
| `GameEvent`, `GameEventListener` | observer | Events | onEvent(GameEvent) |
| `LoggingGameEventListener` | impl | Demo listener | Prints events |
| `SnakeAndLadderGame` | orchestrator | Engine | Turn loop, sync |
| `SnakeAndLadder` | facade | Entry + builder | Wires game |

---

## 5. Relationships

- `SnakeAndLadder` **creates** `SnakeAndLadderGame` via `BoardBuilder`.
- `BoardBuilder` **produces** immutable `Board`.
- Game **iterates** players circularly; **calls** `DiceStrategy.roll()`.
- After move, **board.resolve()** applies snakes/ladders; **notifies** listeners.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **Builder** (`BoardBuilder`) | Fluent config with validation at `build()` |
| **Strategy** (`DiceStrategy`) | Test vs prod dice without changing engine |
| **Observer** (`GameEventListener`) | UI/logging decoupled from turn logic |

---

## 7. Key Implementation Details

### 7.1 Exact win rule

If `position + roll > boardSize`, player stays — prevents overshoot win.

### 7.2 Snake/ladder chains

After landing, while maps contain position, jump to tail/top; cap iterations at 20 to prevent infinite loops from misconfiguration.

### 7.3 Builder validation

Reject duplicate snake heads, ladder bottoms out of range, or head ≤ tail invariants at build time.

---

## 8. Likely Follow-Up Q&A

**Q: Multiple players on same cell?**  
A: Allowed — no capture rule in baseline.

**Q: Skip turn on six?**  
A: Classic rule extension — roll again on 6.

**Q: Online multiplayer?**  
A: Server holds authoritative `SnakeAndLadderGame`; clients send roll requests.

**Q: Weighted dice?**  
A: New `DiceStrategy` implementation.

**Q: Undo turn?**  
A: Snapshot player positions before roll — command pattern.

**Q: Board generation random?**  
A: Builder factory with random valid snake/ladder placement.

**Q: Observer failure?**  
A: Catch listener exceptions — don't block game progress.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| Builder validation | Fail fast; runtime board edits not supported |
| synchronized playTurn | Safe; serializes all turns |
| Chain cap 20 | Prevents infinite loop; misconfig surfaces as error |
| In-memory state | Fine for game session; persist for resume |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.snakeandladder.SnakeAndLadderDemo"`

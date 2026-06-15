# Chess — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a two-player chess game with legal move validation, check detection, and checkmate/stalemate evaluation.

---

## 1. Clarifying Questions

- Rules in scope? (Standard moves; no castling/en passant/promotion in baseline.)
- Players? (Two human alternation — WHITE moves first.)
- Check/checkmate? (Required — block moves that leave own king in check.)
- Notation? (Algebraic from/to positions.)
- Draw conditions? (Stalemate; threefold repetition out of scope.)
- Board mutability? (Immutable `Board` with `withMove()` for simulation.)
- Thread-safety? (`synchronized makeMove` on game instance.)

---

## 2. Functional Requirements

1. **Setup** — standard initial board.
2. **Make move** — validate piece rules, path clear, not leaving king in check.
3. **Turn alternation** — white/black switch after valid move.
4. **Check detection** — after move, flag if opponent king attacked.
5. **Checkmate** — opponent has no legal moves while in check.
6. **Stalemate** — no legal moves, not in check (draw).
7. **Query board** — read-only view for UI.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Correctness** | Strategy per piece; immutable board for what-if |
| **Extensibility** | Add castling via `KingMoveStrategy` extension |
| **Performance** | Move gen O(pieces) acceptable for 8×8 |
| **Concurrency** | `synchronized makeMove` for shared game instance |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `Board` | model | Immutable grid | `withMove()` returns new board |
| `Piece`, `PieceType`, `Color` | model | Chess pieces | Type + color on square |
| `Position` | model | Square | Row, col, algebraic parse |
| `MoveStrategy` | service | Piece rules | `canMove(board, from, to)` |
| `PawnMoveStrategy`, `RookMoveStrategy`, … | impl | Per-piece logic | Direction, range, capture |
| `MoveStrategyFactory` | impl | Factory | PieceType → strategy |
| `ChessGame` | service | Game API | makeMove, status |
| `AbstractChessGame` | impl | Template Method | Fixed move pipeline |
| `ChessGameImpl` | impl | Concrete game | Check/checkmate hooks |
| `Chess` | orchestrator | Facade | Interview entry |

---

## 5. Relationships

- `Chess` **delegates** to `ChessGameImpl`.
- `AbstractChessGame` **owns** current `Board` and active `Color`.
- `makeMove` **uses** `MoveStrategyFactory` for piece at source.
- Check simulation **uses** `board.withMove()` — no undo stack needed.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **Strategy** (`MoveStrategy` per piece) | vs 500-line switch — add piece rules independently |
| **Immutable Board** | Safe simulation for `wouldLeaveInCheck` |
| **Template Method** (`AbstractChessGame.makeMove`) | Fixed validate→apply→evaluate; subclasses customize messages |

---

## 7. Key Implementation Details

### 7.1 Immutable board simulation

Before committing move, `board.withMove(from, to)` produces hypothetical board; attack king square — if in check, reject.

### 7.2 Template move pipeline

`makeMove` final flow: validate turn → strategy.canMove → path clear → not in check → apply → switch turn → evaluate checkmate.

### 7.3 Path clearance

Sliding pieces (rook/bishop/queen) use `Board.isPathClear(from, to)`.

---

## 8. Likely Follow-Up Q&A

**Q: Add castling?**  
A: Extend `KingMoveStrategy` with rook unmoved flags on board state.

**Q: En passant?**  
A: Track last double pawn push on board metadata.

**Q: Promotion?**  
A: On pawn reaching rank 8, prompt piece choice — new `withMove(promotionType)`.

**Q: Move generation for AI?**  
A: Iterate all pieces of color, collect legal moves using same validators.

**Q: Threefold repetition?**  
A: Hash board + side-to-move in history set.

**Q: 50-move rule?**  
A: Counter half-moves since capture/pawn move.

**Q: Online play?**  
A: Server authoritative `synchronized makeMove`; clients optimistic UI.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| Immutable board | Allocates per simulation; correct and simple |
| Strategy per piece | Many classes; clean Open/Closed |
| No special rules baseline | Faster interview; follow-ups show depth |
| Full scan for check | Acceptable on 8×8; bitboards for engines |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.chess.ChessDemo"`

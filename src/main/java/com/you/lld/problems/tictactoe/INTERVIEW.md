# Tic Tac Toe — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a 3×3 Tic Tac Toe game with turn management, O(1) win detection, undo, and clean game-phase handling.

---

## 1. Clarifying Questions

- Board size fixed 3×3? (Yes — extensible to N×N as follow-up.)
- Two human players or AI? (Two players; AI is extension.)
- Undo allowed? (Yes — pop last move from history.)
- Win condition? (Three in a row — row, column, or diagonal.)
- Draw handling? (Full board, no winner → Finished state.)
- Input format? (Algebraic `a1`–`c3` for interview clarity.)
- Concurrent play? (Single game instance — one move at a time.)

---

## 2. Functional Requirements

1. **Start game** — empty board, X moves first, phase → InProgress.
2. **Make move** — validate cell empty, place mark, check win/draw, switch player.
3. **Win detection** — declare winner, phase → Finished.
4. **Draw** — board full with no winner.
5. **Undo** — revert last move, restore player turn and win counters.
6. **Invalid ops** — moves on finished game or occupied cell rejected by state.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Performance** | O(1) per move for win check (incremental counters) |
| **Correctness** | State pattern enforces valid transitions |
| **Extensibility** | N×N board needs generalized `WinChecker` |
| **Simplicity** | No threads required; single orchestrator instance |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `Board` | model | 3×3 grid | `char[][]`; place/clear cell |
| `Player` | model | X or O | Enum-like marker |
| `Position` | model | Cell coordinate | Row, col from algebraic notation |
| `Move` | model | Move record | Player, position, timestamp |
| `MoveResult` | model | Outcome DTO | Win, draw, continue, error |
| `GamePhase` | model | Phase enum | NOT_STARTED, IN_PROGRESS, FINISHED |
| `WinChecker` | service | Incremental win | Row/col/diag counters per player |
| `GameState` | state | Phase behavior | `makeMove()`, `start()` |
| `NotStartedState` / `InProgressState` / `FinishedState` | state | Concrete phases | Delegate valid ops only |
| `MoveHistory` | command | Undo stack | `Deque<Move>` push/pop |
| `TicTacToe` | orchestrator | Game facade | Board, state, checker, history |

---

## 5. Relationships

- `TicTacToe` **owns** `Board`, `GameState`, `WinChecker`, `MoveHistory`.
- `GameState` **mutates** orchestrator on transition (set next state).
- `InProgressState.makeMove()` **updates** board, **calls** `WinChecker.registerMove()`.
- `MoveHistory` **records** moves for undo; undo **calls** `WinChecker.unregisterMove()`.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **State** (`GameState`) | vs phase enum + if-chain in every method — Finished rejects moves cleanly |
| **Command** (`MoveHistory`) | Encapsulates undo; vs storing full board snapshots (memory heavy) |
| **Incremental algorithm** (`WinChecker`) | O(1) vs O(n²) scan after each move |

---

## 7. Key Implementation Details

### 7.1 O(1) win check

Maintain `rowX[]`, `rowO[]`, `colX[]`, `colO[]`, two diagonals. On move at (r,c), increment counter for that player on row r, col c, and diagonals if applicable. Win when any counter reaches 3.

### 7.2 Undo

Pop `MoveHistory` → clear cell on board → `unregisterMove()` decrements same counters → restore `currentPlayer` to mover.

### 7.3 State-driven flow

`FinishedState.makeMove()` returns error `MoveResult` without touching board — orchestrator stays thin.

---

## 8. Likely Follow-Up Q&A

**Q: Extend to N×N?**  
A: Generalize counters to size N; win when any line sum equals N; still O(1) per move.

**Q: Minimax AI?**  
A: Use immutable board copies or undo stack for search; keep `WinChecker` for leaf evaluation.

**Q: Thread-safe online game?**  
A: `synchronized makeMove()` or per-game lock; validate version for optimistic concurrency.

**Q: Why not scan board each time?**  
A: 3×3 scan is trivial but doesn't scale; incremental is standard interview answer.

**Q: Multiple undos?**  
A: Stack supports unlimited undo until empty; redo needs second stack (extension).

**Q: Invalid notation?**  
A: `Position.parse()` throws or returns optional; state never sees bad input.

**Q: Connect-4 variant?**  
A: Gravity column drop changes placement rule; win check uses vertical/horizontal/diag from last cell only.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| Incremental counters | O(1) win; must keep undo in sync |
| State classes | More files; vs single class with `switch(phase)` |
| 3×3 fixed | Simple; N×N adds edge cases (diagonals only when r==c) |
| Algebraic notation | UX friendly; direct (row,col) API also valid |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.tictactoe.TicTacToeDemo"`

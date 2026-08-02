# Minesweeper — SDE2/SDE3 Interview Walkthrough

A full 70–100 minute walkthrough: clarify → requirements → entities →
relationships → patterns (with rationale) → key implementations → follow-ups →
trade-offs.

> The interesting question isn't the flood fill — it's **when the mines are
> placed.** Deferring placement until after the first click is the whole trick, and
> getting the exclusion zone one cell too small silently breaks the guarantee
> players actually care about (§7.2).

---

## 1. Clarifying Questions (first 5 minutes)

1. **Can the first click be a mine?** No — and the standard is stronger than that:
   the first click should **open a region**, not just survive. Those are two
   different requirements and only one of them was met.
2. **When are mines placed, then?** Not at construction — after the first click, so
   the click itself can be excluded. This is the design insight the problem is
   really testing.
3. **What does clicking an empty cell do?** Flood-fills the connected zero-adjacency
   region, stopping *on* numbered cells (they're revealed but don't expand).
4. **Flags?** Toggle on unrevealed cells; a flagged cell can't be revealed, including
   by the flood fill.
5. **Win condition?** All non-mine cells revealed. Note that flags are irrelevant —
   you can win with zero flags placed, and flagging every mine doesn't win.
6. **Chording** (click a number with the right count of adjacent flags to open the
   rest)? A real feature; out of scope here and worth naming.
7. **Board sizes?** Presets — 9×9/10, 16×16/40, 16×30/99.

---

## 2. Functional Requirements

- Create a board of given dimensions and mine count, or from a `Difficulty` preset.
- `reveal(row, col)` — first click places mines; flood-fill on a zero cell; hitting a
  mine loses and exposes all mines.
- `toggleFlag(row, col)` on unrevealed cells.
- Win when every safe cell is revealed.
- Reject out-of-bounds input identically on both entry points.

## 3. Non-Functional Requirements

- **First click never a mine, and always opens a region** (with a documented
  fallback for boards too dense to allow it).
- Flood fill must not recurse past numbered cells, and must terminate.
- Exactly `mineCount` mines, always.
- Mine placement must be **seedable** so games are reproducible and testable.

---

## 4. Core Entities

| Entity | Layer | Internal summary |
|--------|-------|------------------|
| `Cell` | model | `row`, `col`, `isMine`, `isRevealed`, `isFlagged`, `adjacentMines`, `displayChar()`. |
| `Board` | model | `Cell[][]`, `minesPlaced` flag, `computeAdjacentCounts()`, `revealBfs()`, `revealAllMines()`, `countRevealedSafeCells()`, `inBounds()`. |
| `GameStatus` | model (enum) | `IN_PROGRESS`, `WON`, `LOST`. |
| `Difficulty` | model (enum) | `BEGINNER` / `INTERMEDIATE` / `EXPERT` with dimensions and mine counts. |
| `BoardGenerator` | service (interface) | `placeMines(board, safeRow, safeCol)` — the seam that makes first-click safety pluggable. |
| `RandomBoardGenerator` | service/impl | Uniform random placement excluding the first click's 3×3, seedable. |
| `Minesweeper` | root | Orchestrator: input validation, deferred placement, status transitions. |

**Deleted as dead code:** a duplicate root-level `Difficulty` enum with *different
constant names* (`EASY`/`MEDIUM`/`HARD` vs the live
`BEGINNER`/`INTERMEDIATE`/`EXPERT`) and zero references — a genuine trap for anyone
importing the wrong one.

---

## 5. Relationships

- `Minesweeper` **has-a** `Board` and a `BoardGenerator`; it owns the *rules*, the
  board owns the *grid operations*.
- `Board` **owns** its `Cell`s.
- `Board.minesPlaced` is the flag that makes deferred generation work — it's what
  distinguishes the first click from every subsequent one.
- `adjacentMines` is **computed once** after placement (`computeAdjacentCounts`)
  rather than counted per reveal — placement happens once, reveals happen constantly.

---

## 6. Design Patterns (name + why vs alternatives)

- **Strategy — `BoardGenerator`.** Placement policy is a real axis of variation:
  uniform random, seeded/reproducible, fixed layouts for tests, or a
  "guaranteed no-guess" generator that solves the board and rejects layouts needing a
  coin flip. Injecting it also makes `Minesweeper` testable with a deterministic
  board, which is otherwise impossible.
- **Deferred initialization.** Mines are placed on first reveal, not in the
  constructor. *Alternative:* place at construction and relocate a mine if the first
  click hits one — that works for the weak guarantee but gets fiddly for the 3×3
  exclusion (you'd relocate up to nine).
- **BFS flood fill with an explicit queue** rather than recursion — bounded stack on
  a large board.
- **Package-private constructor injection** — `Minesweeper(Board, BoardGenerator)` is
  package-private for tests while the public constructors stay simple.
- *(Considered, rejected)* **State classes** for `GameStatus`. Three states, and the
  only behaviour is "reject input unless IN_PROGRESS" — a guard clause, not a
  hierarchy.
- *(Considered, not built)* **Observer** for UI updates on cell reveal / game end.

---

## 7. Key Implementation Details

### 7.1 Mines are placed after the first click

```java
if (!board.isMinesPlaced()) {
    generator.placeMines(board, row, col);
    board.setMinesPlaced(true);
}
```

This is the core idea. There is no way to guarantee a safe first click on a board
generated in advance without either relocating mines or re-rolling the whole board;
deferring placement makes the guarantee trivially true by construction. Verified over
20,000 games: **0 first-click losses.**

### 7.2 The exclusion zone was one ring too small (the headline)

```java
if ((r == safeRow && c == safeCol) || board.getCell(r, c).isMine()) continue;   // was
```

Only the clicked cell was protected. That satisfies "the first click is never a
mine" — but not the guarantee players actually rely on, which is that the first
click **opens an area**. A cell only seeds the flood fill when its `adjacentMines`
is zero, so leaving the eight neighbours minable meant the opening move very often
revealed a lone number and expanded nothing:

```
first click revealed exactly 1 cell in 13435/20000 games (67.2%)
```

Two thirds of games opened with a dead click. Excluding the full 3×3 neighbourhood:

```
first click revealed exactly 1 cell in 0/20000 games (0.0%)   OK — always opens an area
```

The subtle part is **what happens when the board is too dense to clear nine cells**.
A 3×3 board with 8 mines can't leave a 3×3 hole, and a naive `while` loop looking for
a legal square would spin forever. So the generator measures first and degrades
deliberately:

```java
int protectedCells = countProtected(board, safeRow, safeCol);   // clipped 3x3 — smaller at an edge
boolean protectNeighbours = board.getMineCount() <= totalCells - protectedCells;
```

falling back to protecting just the clicked cell. Still never a mine on the first
click, just no guaranteed opening. Verified on the pathological cases — 3×3/8,
2×2/3, 4×4/15, 5×5/24 all place the exact mine count and complete in ≤2 ms.

`countProtected` clips to the board, which matters: clicking a corner protects 4
cells, not 9, and using a hardcoded 9 would make the fallback trigger too eagerly on
small boards.

### 7.3 The flood fill, and why it can't reveal a mine

```java
cell.setRevealed(true);
if (cell.getAdjacentMines() == 0 && !cell.isMine()) {
    // enqueue all eight neighbours
}
```

Worth stating explicitly, because it looks like a hole: neighbours are enqueued
without checking whether they're mines, so why can't the fill reveal one? Because
expansion only happens from a cell with **zero adjacent mines** — and if any
neighbour were a mine, that count wouldn't be zero. The invariant makes the check
unnecessary. This is exactly the sort of thing to say out loud rather than leave the
interviewer wondering whether you missed it.

Two other properties:

- **Flagged cells are skipped** (`if (cell.isRevealed() || cell.isFlagged()) continue`),
  so a flag genuinely protects a cell from an expanding fill.
- **Termination** is guaranteed because every dequeued cell is either already
  revealed (skipped) or gets marked revealed, and a revealed cell is never
  re-expanded. The queue can hold duplicates; the revealed check absorbs them.

### 7.4 Consistent bounds handling

`reveal` validated bounds and threw `IllegalArgumentException("out of bounds")`.
`toggleFlag` didn't, so the same mistake surfaced as a raw
`ArrayIndexOutOfBoundsException` from the backing array:

```
reveal(99,99)     -> IllegalArgumentException: out of bounds   OK
toggleFlag(99,99) -> ArrayIndexOutOfBoundsException            *** leaks internals ***
```

Same input class, same error now, either way in. It's small, but two entry points
into the same state disagreeing about what invalid input means is exactly the kind of
inconsistency that becomes a caller's bug.

### 7.5 Seeded generation

`RandomBoardGenerator` used an unseeded `Random` with no way to inject one, which
makes the class untestable — you cannot assert anything about a layout you can't
reproduce. Added a `RandomBoardGenerator(long seed)` constructor. The statistical
harness in §7.2 works without it, but any test asserting *specific* board content
needs it.

---

## 8. Likely Follow-ups (with concise answers)

- **Guarantee a board solvable without guessing?** The real hard version. Generate,
  run a constraint solver over it, reject and regenerate if any step requires a coin
  flip. Expensive, and it's why some implementations solve lazily instead — deciding
  mine positions as the player reveals, consistent with everything revealed so far.
- **Chording?** Click a revealed number whose adjacent flag count equals its value →
  reveal all unflagged neighbours. Easy to add; note it can lose the game instantly if
  the flags are wrong, which is the point of it.
- **Very large boards?** `Cell[][]` is fine to millions; beyond that store mines in a
  `Set<Long>` of packed coordinates and compute adjacency on demand — sparse
  representation for a sparse board. `countRevealedSafeCells()` also scans the whole
  grid on every reveal; a running counter makes it O(1) and is the first thing to fix.
- **Undo?** Snapshot the revealed/flagged bitsets, or record a move log and replay —
  cheap because the mine layout is immutable after placement.
- **Timer and best scores?** Start on first reveal (the same event that places mines),
  stop on win/loss.
- **Concurrency?** Single-player, no locking needed. A shared/co-op board would need
  the reveal path synchronized — the flood fill is a compound read-modify-write over
  many cells.
- **Why BFS over DFS?** Either is correct; BFS with an explicit `ArrayDeque` avoids a
  deep recursive stack on a large open region. Recursion on a 16×30 board is fine, on
  a 1000×1000 board it isn't.
- **How would you test it?** The statistical harness used here: 20,000 games asserting
  zero first-click losses and zero single-cell openings, plus the dense-board cases
  asserting the fallback places the exact mine count and terminates.

---

## 9. Trade-offs

- **Deferred placement:** makes first-click safety exact rather than approximate, at
  the cost of `Board` carrying a `minesPlaced` flag and `reveal` having a branch that
  only matters once.
- **3×3 exclusion with a density fallback:** delivers the guarantee on every realistic
  board and degrades predictably on absurd ones. The alternative — always excluding
  nine cells — deadlocks on dense boards; the old behaviour never deadlocked but
  silently failed the guarantee two thirds of the time.
- **Rejection sampling for placement:** simple and unbiased, but its expected cost
  rises as the board fills. A partial Fisher–Yates over the eligible cells would be
  O(mines) worst-case with no retries — better, and more code.
- **Precomputed `adjacentMines`:** O(cells × 8) once, then O(1) per reveal. Right
  trade, since placement happens once and reveals happen constantly.
- **`countRevealedSafeCells()` scanning the grid per reveal:** O(cells) on every move
  where a counter would be O(1). Negligible at 16×30, wrong at scale (§8).
- **Flags don't participate in the win condition:** matches real Minesweeper, and
  occasionally surprises people who expect "flag all mines" to win.
- **`Cell` is fully mutable:** natural for a grid game and keeps the flood fill
  simple; it does mean no cheap snapshotting for undo without copying the grid.

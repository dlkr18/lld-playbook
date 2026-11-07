# minesweeper - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/minesweeper/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py minesweeper`.

## Project Structure (8 files)

```
minesweeper/
├── MinesweeperDemo.java
├── Minesweeper.java
├── model/Board.java
├── model/Cell.java
├── model/Difficulty.java
├── model/GameStatus.java
├── service/BoardGenerator.java
├── service/impl/RandomBoardGenerator.java
```

## Source Code

### `MinesweeperDemo.java`

<details>
<summary>Click to view MinesweeperDemo.java</summary>

```java
package com.you.lld.problems.minesweeper;

import com.you.lld.problems.minesweeper.model.Difficulty;
import com.you.lld.problems.minesweeper.model.GameStatus;

public class MinesweeperDemo {

    public static void main(String[] args) {
        System.out.println("=== Minesweeper Demo ===\n");
        demoBfsCascade();
        demoFlagBlocksReveal();
        demoHitMine();
        demoWin();
        demoDifficultyPreset();
        System.out.println("\n=== Demo complete ===");
    }

    private static void demoBfsCascade() {
        System.out.println("--- 1. BFS cascade on zero region ---");
        Minesweeper game = new Minesweeper(5, 5, 3);
        game.reveal(0, 0);
        System.out.println("  status=" + game.getStatus());
        game.getBoard().print();
    }

    private static void demoFlagBlocksReveal() {
        System.out.println("\n--- 2. Flag blocks reveal ---");
        Minesweeper game = new Minesweeper(4, 4, 2);
        game.reveal(0, 0);
        game.toggleFlag(0, 1);
        System.out.println("  flagged (0,1): " + game.getBoard().getCell(0, 1).isFlagged());
        game.reveal(0, 1);
        System.out.println("  still hidden: " + !game.getBoard().getCell(0, 1).isRevealed());
    }

    private static void demoHitMine() {
        System.out.println("\n--- 3. Hit mine -> LOST ---");
        Minesweeper game = new Minesweeper(3, 3, 1);
        game.reveal(0, 0);
        for (int r = 0; r < 3; r++) {
            for (int c = 0; c < 3; c++) {
                if (game.getBoard().getCell(r, c).isMine()
                        && !game.getBoard().getCell(r, c).isRevealed()) {
                    game.reveal(r, c);
                    System.out.println("  status=" + game.getStatus());
                    return;
                }
            }
        }
    }

    private static void demoWin() {
        System.out.println("\n--- 4. Win when all safe cells revealed ---");
        Minesweeper game = new Minesweeper(2, 2, 1);
        for (int r = 0; r < 2; r++) {
            for (int c = 0; c < 2; c++) {
                if (!game.getBoard().getCell(r, c).isMine()) {
                    game.reveal(r, c);
                }
            }
        }
        // first reveal places mines; re-scan safely
        Minesweeper g2 = new Minesweeper(2, 2, 1);
        g2.reveal(0, 0);
        for (int r = 0; r < 2; r++) {
            for (int c = 0; c < 2; c++) {
                if (!g2.getBoard().getCell(r, c).isMine() && !g2.getBoard().getCell(r, c).isRevealed()) {
                    g2.reveal(r, c);
                }
            }
        }
        System.out.println("  status=" + g2.getStatus());
    }

    private static void demoDifficultyPreset() {
        System.out.println("\n--- 5. Difficulty preset ---");
        Minesweeper game = new Minesweeper(Difficulty.BEGINNER);
        System.out.println("  board=" + game.getBoard().getRows() + "x" + game.getBoard().getCols()
                + ", mines=" + game.getBoard().getMineCount());
        game.reveal(4, 4);
        System.out.println("  status after first click=" + game.getStatus());
    }
}
```

</details>

### `Minesweeper.java`

<details>
<summary>Click to view Minesweeper.java</summary>

```java
package com.you.lld.problems.minesweeper;

import com.you.lld.problems.minesweeper.model.Board;
import com.you.lld.problems.minesweeper.model.Difficulty;
import com.you.lld.problems.minesweeper.model.GameStatus;
import com.you.lld.problems.minesweeper.model.Cell;
import com.you.lld.problems.minesweeper.service.BoardGenerator;
import com.you.lld.problems.minesweeper.service.impl.RandomBoardGenerator;

public final class Minesweeper {

    private final Board board;
    private final BoardGenerator generator;
    private GameStatus status = GameStatus.IN_PROGRESS;

    public Minesweeper(int rows, int cols, int mines) {
        this(new Board(rows, cols, mines), new RandomBoardGenerator());
    }

    public Minesweeper(Difficulty difficulty) {
        this(difficulty.getRows(), difficulty.getCols(), difficulty.getMines());
    }

    Minesweeper(Board board, BoardGenerator generator) {
        this.board = board;
        this.generator = generator;
    }

    public GameStatus getStatus() {
        return status;
    }

    public Board getBoard() {
        return board;
    }

    public boolean reveal(int row, int col) {
        if (status != GameStatus.IN_PROGRESS) {
            return false;
        }
        if (!board.inBounds(row, col)) {
            throw new IllegalArgumentException("out of bounds");
        }
        Cell cell = board.getCell(row, col);
        if (cell.isFlagged() || cell.isRevealed()) {
            return false;
        }

        if (!board.isMinesPlaced()) {
            generator.placeMines(board, row, col);
            board.setMinesPlaced(true);
        }

        if (cell.isMine()) {
            cell.setRevealed(true);
            board.revealAllMines();
            status = GameStatus.LOST;
            return false;
        }

        board.revealBfs(row, col);
        if (board.countRevealedSafeCells() == board.totalSafeCells()) {
            status = GameStatus.WON;
        }
        return true;
    }

    public boolean toggleFlag(int row, int col) {
        if (status != GameStatus.IN_PROGRESS) {
            return false;
        }
        // reveal() bounds-checks; this did not, so an out-of-range flag surfaced as a
        // raw ArrayIndexOutOfBoundsException from the backing array instead of the
        // domain error. Same input class, same error, either way in.
        if (!board.inBounds(row, col)) {
            throw new IllegalArgumentException("out of bounds");
        }
        Cell cell = board.getCell(row, col);
        if (cell.isRevealed()) {
            return false;
        }
        cell.setFlagged(!cell.isFlagged());
        return true;
    }
}
```

</details>

### `model/Board.java`

<details>
<summary>Click to view model/Board.java</summary>

```java
package com.you.lld.problems.minesweeper.model;

import java.util.ArrayDeque;
import java.util.Deque;

public final class Board {

    private final int rows;
    private final int cols;
    private final int mineCount;
    private final Cell[][] cells;
    private boolean minesPlaced;

    public Board(int rows, int cols, int mineCount) {
        if (mineCount >= rows * cols) {
            throw new IllegalArgumentException("too many mines for board size");
        }
        this.rows = rows;
        this.cols = cols;
        this.mineCount = mineCount;
        this.cells = new Cell[rows][cols];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                cells[r][c] = new Cell(r, c);
            }
        }
    }

    public int getRows() {
        return rows;
    }

    public int getCols() {
        return cols;
    }

    public int getMineCount() {
        return mineCount;
    }

    public boolean isMinesPlaced() {
        return minesPlaced;
    }

    public void setMinesPlaced(boolean minesPlaced) {
        this.minesPlaced = minesPlaced;
    }

    public Cell getCell(int row, int col) {
        return cells[row][col];
    }

    public void computeAdjacentCounts() {
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (cells[r][c].isMine()) {
                    continue;
                }
                int count = 0;
                for (int dr = -1; dr <= 1; dr++) {
                    for (int dc = -1; dc <= 1; dc++) {
                        if (dr == 0 && dc == 0) {
                            continue;
                        }
                        int nr = r + dr;
                        int nc = c + dc;
                        if (inBounds(nr, nc) && cells[nr][nc].isMine()) {
                            count++;
                        }
                    }
                }
                cells[r][c].setAdjacentMines(count);
            }
        }
    }

    public void revealBfs(int startRow, int startCol) {
        Deque<int[]> queue = new ArrayDeque<int[]>();
        queue.add(new int[] {startRow, startCol});
        while (!queue.isEmpty()) {
            int[] pos = queue.removeFirst();
            int r = pos[0];
            int c = pos[1];
            Cell cell = cells[r][c];
            if (cell.isRevealed() || cell.isFlagged()) {
                continue;
            }
            cell.setRevealed(true);
            if (cell.getAdjacentMines() == 0 && !cell.isMine()) {
                for (int dr = -1; dr <= 1; dr++) {
                    for (int dc = -1; dc <= 1; dc++) {
                        if (dr == 0 && dc == 0) {
                            continue;
                        }
                        int nr = r + dr;
                        int nc = c + dc;
                        if (inBounds(nr, nc) && !cells[nr][nc].isRevealed()) {
                            queue.addLast(new int[] {nr, nc});
                        }
                    }
                }
            }
        }
    }

    public void revealAllMines() {
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (cells[r][c].isMine()) {
                    cells[r][c].setRevealed(true);
                }
            }
        }
    }

    public int countRevealedSafeCells() {
        int count = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                Cell cell = cells[r][c];
                if (cell.isRevealed() && !cell.isMine()) {
                    count++;
                }
            }
        }
        return count;
    }

    public int totalSafeCells() {
        return rows * cols - mineCount;
    }

    public boolean inBounds(int row, int col) {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }

    public void print() {
        for (int r = 0; r < rows; r++) {
            StringBuilder line = new StringBuilder();
            for (int c = 0; c < cols; c++) {
                line.append(cells[r][c].displayChar()).append(' ');
            }
            System.out.println(line.toString());
        }
    }
}
```

</details>

### `model/Cell.java`

<details>
<summary>Click to view model/Cell.java</summary>

```java
package com.you.lld.problems.minesweeper.model;

public final class Cell {

    private final int row;
    private final int col;
    private boolean mine;
    private boolean revealed;
    private boolean flagged;
    private int adjacentMines;

    public Cell(int row, int col) {
        this.row = row;
        this.col = col;
    }

    public int getRow() {
        return row;
    }

    public int getCol() {
        return col;
    }

    public boolean hasMine() {
        return mine;
    }

    public void placeMine() {
        this.mine = true;
    }

    public void reveal() {
        this.revealed = true;
    }

    public void toggleFlag() {
        this.flagged = !this.flagged;
    }

    public boolean isMine() {
        return mine;
    }

    public void setMine(boolean mine) {
        this.mine = mine;
    }

    public boolean isRevealed() {
        return revealed;
    }

    public void setRevealed(boolean revealed) {
        this.revealed = revealed;
    }

    public boolean isFlagged() {
        return flagged;
    }

    public void setFlagged(boolean flagged) {
        this.flagged = flagged;
    }

    public int getAdjacentMines() {
        return adjacentMines;
    }

    public void setAdjacentMines(int adjacentMines) {
        this.adjacentMines = adjacentMines;
    }

    public char displayChar() {
        if (!revealed) {
            return flagged ? 'F' : '.';
        }
        if (mine) {
            return '*';
        }
        if (adjacentMines == 0) {
            return ' ';
        }
        return (char) ('0' + adjacentMines);
    }
}
```

</details>

### `model/Difficulty.java`

<details>
<summary>Click to view model/Difficulty.java</summary>

```java
package com.you.lld.problems.minesweeper.model;

public enum Difficulty {
    BEGINNER(9, 9, 10),
    INTERMEDIATE(16, 16, 40),
    EXPERT(16, 30, 99);

    private final int rows;
    private final int cols;
    private final int mines;

    Difficulty(int rows, int cols, int mines) {
        this.rows = rows;
        this.cols = cols;
        this.mines = mines;
    }

    public int getRows() {
        return rows;
    }

    public int getCols() {
        return cols;
    }

    public int getMines() {
        return mines;
    }
}
```

</details>

### `model/GameStatus.java`

<details>
<summary>Click to view model/GameStatus.java</summary>

```java
package com.you.lld.problems.minesweeper.model;

public enum GameStatus {
    IN_PROGRESS,
    WON,
    LOST
}
```

</details>

### `service/BoardGenerator.java`

<details>
<summary>Click to view service/BoardGenerator.java</summary>

```java
package com.you.lld.problems.minesweeper.service;

import com.you.lld.problems.minesweeper.model.Board;

public interface BoardGenerator {

    void placeMines(Board board, int safeRow, int safeCol);
}
```

</details>

### `service/impl/RandomBoardGenerator.java`

<details>
<summary>Click to view service/impl/RandomBoardGenerator.java</summary>

```java
package com.you.lld.problems.minesweeper.service.impl;

import com.you.lld.problems.minesweeper.model.Board;
import com.you.lld.problems.minesweeper.service.BoardGenerator;
import java.util.Random;

/**
 * Places mines after the first click, keeping the clicked cell <b>and its
 * neighbours</b> clear.
 *
 * <p>Excluding only the clicked cell satisfies the weak guarantee ("the first click
 * is never a mine") but not the one players actually expect: that the first click
 * <em>opens a region</em>. A cell is only a flood-fill seed when it has zero
 * adjacent mines, so leaving the neighbours minable meant the opening move revealed
 * a bare number 67% of the time on a 9x9/10 board.
 */
public final class RandomBoardGenerator implements BoardGenerator {

    private final Random random;

    public RandomBoardGenerator() {
        this.random = new Random();
    }

    /** Seeded, so a game can be replayed exactly — the only way to test this class. */
    public RandomBoardGenerator(long seed) {
        this.random = new Random(seed);
    }

    @Override
    public void placeMines(Board board, int safeRow, int safeCol) {
        int totalCells = board.getRows() * board.getCols();
        int protectedCells = countProtected(board, safeRow, safeCol);

        // A dense board may not leave room to keep all nine cells clear. Rather than
        // loop forever, fall back to protecting just the clicked cell — still never a
        // mine on the first click, just no guaranteed opening.
        boolean protectNeighbours = board.getMineCount() <= totalCells - protectedCells;

        int placed = 0;
        while (placed < board.getMineCount()) {
            int r = random.nextInt(board.getRows());
            int c = random.nextInt(board.getCols());
            if (board.getCell(r, c).isMine()) {
                continue;
            }
            boolean excluded = protectNeighbours
                    ? isWithinOne(r, c, safeRow, safeCol)
                    : (r == safeRow && c == safeCol);
            if (excluded) {
                continue;
            }
            board.getCell(r, c).setMine(true);
            placed++;
        }
        board.computeAdjacentCounts();
    }

    private static boolean isWithinOne(int r, int c, int row, int col) {
        return Math.abs(r - row) <= 1 && Math.abs(c - col) <= 1;
    }

    /** Size of the clipped 3x3 around the first click (smaller at an edge or corner). */
    private static int countProtected(Board board, int safeRow, int safeCol) {
        int count = 0;
        for (int dr = -1; dr <= 1; dr++) {
            for (int dc = -1; dc <= 1; dc++) {
                if (board.inBounds(safeRow + dr, safeCol + dc)) {
                    count++;
                }
            }
        }
        return count;
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.minesweeper.MinesweeperDemo"
```

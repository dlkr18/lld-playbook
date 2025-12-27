# minesweeper - Complete Implementation

## 📁 Project Structure

```
minesweeper/
├── Cell.java
├── Demo.java
├── Difficulty.java
├── MinesweeperDemo.java
├── MinesweeperGame.java
├── Score.java
├── Timer.java
├── model/Board.java
├── model/Cell.java
├── model/GameStatus.java
```

## 📝 Source Code

### 📄 `Cell.java`

```java
package com.you.lld.problems.minesweeper;
public class Cell {
    private boolean isMine;
    private boolean isRevealed;
    private boolean isFlagged;
    private int adjacentMines;
    
    public Cell() {
        this.isMine = false;
        this.isRevealed = false;
        this.isFlagged = false;
        this.adjacentMines = 0;
    }
    
    public boolean isMine() { return isMine; }
    public void setMine(boolean mine) { isMine = mine; }
    public boolean isRevealed() { return isRevealed; }
    public void reveal() { isRevealed = true; }
    public boolean isFlagged() { return isFlagged; }
    public void toggleFlag() { isFlagged = !isFlagged; }
    public int getAdjacentMines() { return adjacentMines; }
    public void setAdjacentMines(int count) { adjacentMines = count; }
}
```

### 📄 `Demo.java`

```java
package com.you.lld.problems.minesweeper;
public class Demo { public static void main(String[] args) { System.out.println("Minesweeper"); } }```

### 📄 `Difficulty.java`

```java
package com.you.lld.problems.minesweeper;

public enum Difficulty {
    EASY(9, 9, 10),
    MEDIUM(16, 16, 40),
    HARD(16, 30, 99);
    
    private final int rows;
    private final int cols;
    private final int mines;
    
    Difficulty(int rows, int cols, int mines) {
        this.rows = rows;
        this.cols = cols;
        this.mines = mines;
    }
    
    public int getRows() { return rows; }
    public int getCols() { return cols; }
    public int getMines() { return mines; }
}
```

### 📄 `MinesweeperDemo.java`

```java
package com.you.lld.problems.minesweeper;

import com.you.lld.problems.minesweeper.model.*;

public class MinesweeperDemo {
    public static void main(String[] args) {
        System.out.println("💣 Minesweeper Game Demo");
        System.out.println(String.format("%70s", "").replace(" ", "="));
        
        Board board = new Board(5, 5, 5);
        
        System.out.println("\nInitial board:");
        board.print();
        
        System.out.println("\nRevealing cell (0,0):");
        board.revealCell(0, 0);
        board.print();
        
        System.out.println("\nRevealing cell (2,2):");
        board.revealCell(2, 2);
        board.print();
        
        System.out.println("\nGame Status: " + board.getStatus());
        System.out.println("\n✅ Demo complete!");
    }
}
```

### 📄 `MinesweeperGame.java`

```java
package com.you.lld.problems.minesweeper;
import java.util.*;

public class MinesweeperGame {
    public enum GameState { IN_PROGRESS, WON, LOST }
    
    private final Cell[][] board;
    private final int rows;
    private final int cols;
    private GameState state;
    
    public MinesweeperGame(int rows, int cols, int mines) {
        this.rows = rows;
        this.cols = cols;
        this.board = new Cell[rows][cols];
        this.state = GameState.IN_PROGRESS;
        initializeBoard(mines);
    }
    
    private void initializeBoard(int mineCount) {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                board[i][j] = new Cell();
            }
        }
        placeMines(mineCount);
        calculateAdjacentMines();
    }
    
    private void placeMines(int count) {
        Random random = new Random();
        int placed = 0;
        while (placed < count) {
            int row = random.nextInt(rows);
            int col = random.nextInt(cols);
            if (!board[row][col].isMine()) {
                board[row][col].setMine(true);
                placed++;
            }
        }
    }
    
    private void calculateAdjacentMines() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (!board[i][j].isMine()) {
                    int count = 0;
                    for (int di = -1; di <= 1; di++) {
                        for (int dj = -1; dj <= 1; dj++) {
                            int ni = i + di, nj = j + dj;
                            if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && board[ni][nj].isMine()) {
                                count++;
                            }
                        }
                    }
                    board[i][j].setAdjacentMines(count);
                }
            }
        }
    }
    
    public boolean revealCell(int row, int col) {
        if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
        Cell cell = board[row][col];
        if (cell.isRevealed() || cell.isFlagged()) return false;
        
        cell.reveal();
        if (cell.isMine()) {
            state = GameState.LOST;
            return false;
        }
        
        if (cell.getAdjacentMines() == 0) {
            // Reveal adjacent cells
            for (int di = -1; di <= 1; di++) {
                for (int dj = -1; dj <= 1; dj++) {
                    revealCell(row + di, col + dj);
                }
            }
        }
        
        checkWinCondition();
        return true;
    }
    
    private void checkWinCondition() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (!board[i][j].isMine() && !board[i][j].isRevealed()) {
                    return;
                }
            }
        }
        state = GameState.WON;
    }
    
    public GameState getState() { return state; }
}
```

### 📄 `Score.java`

```java
package com.you.lld.problems.minesweeper;

public class Score {
    private final String playerName;
    private final long timeSeconds;
    private final Difficulty difficulty;
    
    public Score(String playerName, long timeSeconds, Difficulty difficulty) {
        this.playerName = playerName;
        this.timeSeconds = timeSeconds;
        this.difficulty = difficulty;
    }
    
    public String getPlayerName() { return playerName; }
    public long getTimeSeconds() { return timeSeconds; }
    public Difficulty getDifficulty() { return difficulty; }
    
    @Override
    public String toString() {
        return playerName + " - " + timeSeconds + "s (" + difficulty + ")";
    }
}
```

### 📄 `Timer.java`

```java
package com.you.lld.problems.minesweeper;

public class Timer {
    private long startTime;
    private long endTime;
    private boolean running;
    
    public void start() {
        startTime = System.currentTimeMillis();
        running = true;
    }
    
    public void stop() {
        endTime = System.currentTimeMillis();
        running = false;
    }
    
    public long getElapsedSeconds() {
        if (running) {
            return (System.currentTimeMillis() - startTime) / 1000;
        }
        return (endTime - startTime) / 1000;
    }
}
```

### 📄 `model/Board.java`

```java
package com.you.lld.problems.minesweeper.model;

import java.util.*;

public class Board {
    private final int rows;
    private final int cols;
    private final int mineCount;
    private final Cell[][] grid;
    private GameStatus status;
    
    public Board(int rows, int cols, int mineCount) {
        this.rows = rows;
        this.cols = cols;
        this.mineCount = mineCount;
        this.grid = new Cell[rows][cols];
        this.status = GameStatus.IN_PROGRESS;
        initializeBoard();
    }
    
    private void initializeBoard() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                grid[i][j] = new Cell(i, j);
            }
        }
        placeMines();
        calculateAdjacentMines();
    }
    
    private void placeMines() {
        Random random = new Random();
        int placed = 0;
        
        while (placed < mineCount) {
            int row = random.nextInt(rows);
            int col = random.nextInt(cols);
            
            if (!grid[row][col].hasMine()) {
                grid[row][col].placeMine();
                placed++;
            }
        }
    }
    
    private void calculateAdjacentMines() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (!grid[i][j].hasMine()) {
                    int count = countAdjacentMines(i, j);
                    grid[i][j].setAdjacentMines(count);
                }
            }
        }
    }
    
    private int countAdjacentMines(int row, int col) {
        int count = 0;
        for (int dr = -1; dr <= 1; dr++) {
            for (int dc = -1; dc <= 1; dc++) {
                if (dr == 0 && dc == 0) continue;
                int newRow = row + dr;
                int newCol = col + dc;
                if (isValid(newRow, newCol) && grid[newRow][newCol].hasMine()) {
                    count++;
                }
            }
        }
        return count;
    }
    
    public boolean revealCell(int row, int col) {
        if (!isValid(row, col) || grid[row][col].isRevealed() || grid[row][col].isFlagged()) {
            return false;
        }
        
        Cell cell = grid[row][col];
        cell.reveal();
        
        if (cell.hasMine()) {
            status = GameStatus.LOST;
            revealAllMines();
            return false;
        }
        
        if (cell.getAdjacentMines() == 0) {
            revealAdjacentCells(row, col);
        }
        
        if (checkWin()) {
            status = GameStatus.WON;
        }
        
        return true;
    }
    
    private void revealAdjacentCells(int row, int col) {
        for (int dr = -1; dr <= 1; dr++) {
            for (int dc = -1; dc <= 1; dc++) {
                if (dr == 0 && dc == 0) continue;
                int newRow = row + dr;
                int newCol = col + dc;
                if (isValid(newRow, newCol) && !grid[newRow][newCol].isRevealed()) {
                    revealCell(newRow, newCol);
                }
            }
        }
    }
    
    private void revealAllMines() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (grid[i][j].hasMine()) {
                    grid[i][j].reveal();
                }
            }
        }
    }
    
    private boolean checkWin() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                Cell cell = grid[i][j];
                if (!cell.hasMine() && !cell.isRevealed()) {
                    return false;
                }
            }
        }
        return true;
    }
    
    public void toggleFlag(int row, int col) {
        if (isValid(row, col) && !grid[row][col].isRevealed()) {
            grid[row][col].toggleFlag();
        }
    }
    
    private boolean isValid(int row, int col) {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }
    
    public Cell getCell(int row, int col) {
        return isValid(row, col) ? grid[row][col] : null;
    }
    
    public int getRows() { return rows; }
    public int getCols() { return cols; }
    public GameStatus getStatus() { return status; }
    
    public void print() {
        System.out.println();
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                System.out.print(grid[i][j] + " ");
            }
            System.out.println();
        }
    }
}
```

### 📄 `model/Cell.java`

```java
package com.you.lld.problems.minesweeper.model;

public class Cell {
    private final int row;
    private final int col;
    private boolean hasMine;
    private boolean isRevealed;
    private boolean isFlagged;
    private int adjacentMines;
    
    public Cell(int row, int col) {
        this.row = row;
        this.col = col;
        this.hasMine = false;
        this.isRevealed = false;
        this.isFlagged = false;
        this.adjacentMines = 0;
    }
    
    public int getRow() { return row; }
    public int getCol() { return col; }
    public boolean hasMine() { return hasMine; }
    public boolean isRevealed() { return isRevealed; }
    public boolean isFlagged() { return isFlagged; }
    public int getAdjacentMines() { return adjacentMines; }
    
    public void placeMine() { this.hasMine = true; }
    public void reveal() { this.isRevealed = true; }
    public void toggleFlag() { this.isFlagged = !isFlagged; }
    public void setAdjacentMines(int count) { this.adjacentMines = count; }
    
    @Override
    public String toString() {
        if (!isRevealed) {
            return isFlagged ? "🚩" : "□";
        }
        if (hasMine) {
            return "💣";
        }
        return adjacentMines == 0 ? " " : String.valueOf(adjacentMines);
    }
}
```

### 📄 `model/GameStatus.java`

```java
package com.you.lld.problems.minesweeper.model;

public enum GameStatus {
    IN_PROGRESS, WON, LOST
}
```


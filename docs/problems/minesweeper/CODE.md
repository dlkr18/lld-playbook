# Minesweeper Game

## Problem: Design the Minesweeper Game

**Difficulty**: Medium  
**Pattern**: Strategy, State  
**Time**: 45-60 min

---

## Key Classes

```java
class MinesweeperGame {
    private Cell[][] board;
    private int rows, cols, mines;
    private GameState state;
    
    void initializeBoard(int rows, int cols, int mineCount);
    RevealResult revealCell(int row, int col);
    void flagCell(int row, int col);
}

class Cell {
    boolean isMine;
    boolean isRevealed;
    boolean isFlagged;
    int adjacentMines;
}

enum GameState { IN_PROGRESS, WON, LOST }

class RevealResult {
    boolean gameOver;
    boolean won;
    List<Cell> revealedCells;
}
```

---

**Status**: ✅ Documented

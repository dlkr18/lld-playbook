# Minesweeper Game

## Overview
A Minesweeper game with customizable board sizes, mine placement, cell revelation, flagging, and win/loss detection. Implements flood-fill algorithm for revealing adjacent empty cells.

**Difficulty:** Medium  
**Domain:** Gaming, Algorithms  
**Interview Frequency:** Medium (Algorithm design)

## Game Rules
- Board: MxN grid with K mines
- Cell states: Hidden, Revealed, Flagged
- Numbers: Count of adjacent mines (8 neighbors)
- Win: Reveal all non-mine cells
- Lose: Reveal a mine

## Key Algorithms

#### Mine Placement (Random)
```java
public void placeMines(int count) {
    Random rand = new Random();
    int placed = 0;
    
    while (placed < count) {
        int row = rand.nextInt(rows);
        int col = rand.nextInt(cols);
        
        if (!board[row][col].isMine()) {
            board[row][col].setMine(true);
            placed++;
        }
    }
    
    // Calculate adjacent mine counts
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (!board[i][j].isMine()) {
                board[i][j].setAdjacentMines(
                    countAdjacentMines(i, j)
                );
            }
        }
    }
}
```

#### Flood Fill (Reveal Empty Cells)
```java
public void reveal(int row, int col) {
    if (outOfBounds(row, col) || board[row][col].isRevealed()) {
        return;
    }
    
    board[row][col].reveal();
    
    if (board[row][col].isMine()) {
        gameOver = true;
        return;
    }
    
    // If cell has no adjacent mines, reveal neighbors
    if (board[row][col].getAdjacentMines() == 0) {
        for (int[] dir : DIRECTIONS) {
            reveal(row + dir[0], col + dir[1]);
        }
    }
}

private static final int[][] DIRECTIONS = {
    {-1,-1}, {-1,0}, {-1,1},
    {0,-1},          {0,1},
    {1,-1},  {1,0},  {1,1}
};
```

**Time Complexity:** O(M*N) worst case  
**Space Complexity:** O(M*N) for recursion

## Design Patterns

### State Pattern (Cell States)
```java
enum CellState {
    HIDDEN, REVEALED, FLAGGED
}

interface CellStateHandler {
    void reveal();
    void flag();
}
```

## Source Code
📄 **[View Complete Source Code](/problems/minesweeper/CODE)**

*Classic puzzle game with flood-fill algorithm for cell revelation.*

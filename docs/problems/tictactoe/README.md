# Tic Tac Toe Game

## Overview
A Tic Tac Toe game with AI opponent, win detection, and extensible board sizes (3x3, 4x4, NxN). Implements minimax algorithm for optimal AI moves and clean game state management.

**Difficulty:** Medium  
**Domain:** Gaming, AI  
**Interview Frequency:** High (Game logic, algorithms)

## Game Rules
- Board: 3x3 grid
- Players: X and O
- Win: 3 in a row (horizontal, vertical, diagonal)
- Draw: Board full, no winner

## Key Algorithms

#### Win Detection (O(N))
```java
public boolean checkWin(Player player) {
    char symbol = player.getSymbol();
    
    // Check rows
    for (int i = 0; i < 3; i++) {
        if (board[i][0] == symbol && 
            board[i][1] == symbol && 
            board[i][2] == symbol) {
            return true;
        }
    }
    
    // Check columns
    for (int j = 0; j < 3; j++) {
        if (board[0][j] == symbol && 
            board[1][j] == symbol && 
            board[2][j] == symbol) {
            return true;
        }
    }
    
    // Check diagonals
    if (board[0][0] == symbol && 
        board[1][1] == symbol && 
        board[2][2] == symbol) {
        return true;
    }
    if (board[0][2] == symbol && 
        board[1][1] == symbol && 
        board[2][0] == symbol) {
        return true;
    }
    
    return false;
}
```

**Time Complexity:** O(N²) for NxN board  
**Space Complexity:** O(1)

#### Minimax Algorithm (AI)
```java
public int minimax(Board board, boolean isMaximizing) {
    if (board.hasWinner('X')) return 10;
    if (board.hasWinner('O')) return -10;
    if (board.isFull()) return 0;
    
    if (isMaximizing) {
        int bestScore = Integer.MIN_VALUE;
        for (Move move : board.getAvailableMoves()) {
            board.makeMove(move, 'X');
            int score = minimax(board, false);
            board.undoMove(move);
            bestScore = Math.max(bestScore, score);
        }
        return bestScore;
    } else {
        int bestScore = Integer.MAX_VALUE;
        for (Move move : board.getAvailableMoves()) {
            board.makeMove(move, 'O');
            int score = minimax(board, true);
            board.undoMove(move);
            bestScore = Math.min(bestScore, score);
        }
        return bestScore;
    }
}
```

**Time Complexity:** O(b^d) where b=branching factor, d=depth  
**Space Complexity:** O(d) for recursion

## Design Patterns

### Strategy Pattern (AI difficulty)
```java
interface AIStrategy {
    Move getMove(Board board);
}

class EasyAI implements AIStrategy {
    public Move getMove(Board board) {
        return board.getRandomMove();
    }
}

class HardAI implements AIStrategy {
    public Move getMove(Board board) {
        return minimaxMove(board);
    }
}
```

## Source Code
📄 **[View Complete Source Code](/problems/tictactoe/CODE)**

*Classic game with AI opponent using minimax algorithm.*

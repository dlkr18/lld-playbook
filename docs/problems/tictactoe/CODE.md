# Tic Tac Toe Game - Complete Implementation

## 🎯 Problem Statement

Design a classic Tic Tac Toe game where:
- Two players (X and O) take turns
- 3x3 board
- First to get 3 in a row (horizontal, vertical, or diagonal) wins
- Handle draw conditions

---

## 📋 Complete Java Implementation

All source code is available at:
```
src/main/java/com/you/lld/problems/tictactoe/
```

### Key Classes:

1. **Board** - 3x3 game board with cell management
2. **Player** - Represents X or O
3. **Position** - Row/column coordinates
4. **TicTacToeGame** - Main game logic and win detection
5. **GameState** - PLAYING, WON, DRAW
6. **Move** - Represents a player's move
7. **MoveResult** - Result of applying a move

---

## 🎮 Usage Example

```java
// Create game
TicTacToeGame game = new TicTacToeGame();

// Players take turns
game.makeMove(0, 0); // X plays top-left
game.makeMove(1, 1); // O plays center
game.makeMove(0, 1); // X plays top-middle
game.makeMove(2, 2); // O plays bottom-right
game.makeMove(0, 2); // X plays top-right - X WINS!

// Check result
if (game.getState() == GameState.WON) {
    System.out.println("Winner: " + game.getWinner());
}
```

---

## 🔑 Key Design Decisions

### 1. Win Detection Algorithm
- Check row, column, and diagonals after each move
- O(1) time complexity
- Early termination

### 2. State Pattern (Optional)
- Can use State pattern for game states
- PLAYING → WON/DRAW
- Prevents invalid moves after game ends

### 3. Position Value Object
- Validates row/column bounds
- Immutable

---

## 📊 Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Make Move | O(1) | O(1) |
| Check Win | O(1) | O(1) |
| Check Draw | O(1) | O(1) |
| Full Game | O(1) | O(1) |

All operations are O(1) because board size is fixed (3x3)

---

## 🎯 Interview Tips

**Common Questions:**
- How do you detect a win efficiently?
- How to extend to NxN board?
- How to implement undo feature?
- How to add AI player?

**Follow-up Enhancements:**
- Extend to NxN board
- Add undo/redo functionality
- Implement AI (Minimax algorithm)
- Add game history/replay
- Support custom win conditions (4 in a row, etc.)

---

**Difficulty:** Easy  
**Patterns:** State Pattern (for game states)  
**Time to Complete:** 30-45 minutes in an interview

**View Full Implementation:** `src/main/java/com/you/lld/problems/tictactoe/`

# Snake and Ladder Game - Complete Implementation

## 🎯 Problem Statement

Design a Snake and Ladder board game where:
- Multiple players take turns rolling a dice
- Landing on a snake's head slides you down to its tail
- Landing on a ladder's bottom climbs you up to its top
- First player to reach the end wins

---

## 📋 Complete Java Implementation

All source code is available at:
```
src/main/java/com/you/lld/problems/snakeandladder/
```

### Key Classes:

1. **Player** - Game participant with position tracking
2. **Board** - Game board with snakes and ladders (Built using Builder pattern)
3. **Snake** - Slides player down
4. **Ladder** - Climbs player up
5. **Dice** - Random number generator
6. **SnakeAndLadderGame** - Main game orchestrator

---

## 🎮 Usage Example

```java
// Create board with snakes and ladders
Board board = Board.builder(100)
    .addSnake(98, 28)  // Big snake near the end
    .addSnake(62, 18)
    .addSnake(54, 31)
    .addLadder(4, 56)  // Big ladder at start
    .addLadder(12, 50)
    .addLadder(42, 76)
    .build();

// Create game
SnakeAndLadderGame game = new SnakeAndLadderGame(board);

// Add players
game.addPlayer("Alice");
game.addPlayer("Bob");
game.addPlayer("Charlie");

// Start game (runs until someone wins)
game.start();

System.out.println("Winner: " + game.getWinner().getName());
```

---

## 🔑 Key Design Decisions

### 1. Builder Pattern for Board
- Fluent API for board construction
- Validates snake/ladder placement
- Immutable once built

### 2. Queue for Turn Management
- Natural FIFO ordering
- Easy to implement round-robin turns
- Players re-queue after each turn

### 3. Value Object for PlayerId
- Type-safe player identification
- UUID generation for uniqueness

---

## 📊 Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Roll Dice | O(1) | O(1) |
| Check Snake/Ladder | O(S + L) | O(1) |
| Play Turn | O(S + L) | O(1) |
| Full Game | O(N × T × (S + L)) | O(P) |

Where:
- N = Number of players
- T = Average turns per player
- S = Number of snakes
- L = Number of ladders
- P = Number of players

---

## 🎯 Interview Tips

**Common Questions:**
- How do you handle multiple snakes/ladders at same position?
- What if a player rolls beyond the board size?
- How to make the game extensible (power-ups, obstacles)?

**Follow-up Enhancements:**
- Add "exact match" rule (must roll exact number to win)
- Support different dice types (2 dice, weighted dice)
- Add game replay/history
- Implement save/load game state
- Add multiplayer over network

---

**Difficulty:** Easy  
**Patterns:** Builder, Queue-based Turn Management  
**Time to Complete:** 30-45 minutes in an interview

**View Full Implementation:** `src/main/java/com/you/lld/problems/snakeandladder/`

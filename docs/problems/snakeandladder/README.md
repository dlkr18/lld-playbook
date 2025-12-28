# Snake and Ladder Game

## Overview
A classic board game implementation supporting multiple players, dice rolls, snakes, ladders, game state management, and win conditions. Implements turn-based gameplay, board configuration, position tracking, and special rules like exact landing to win.

**Difficulty:** Easy-Medium  
**Domain:** Game Development, Simulation  
**Interview Frequency:** Medium (Game companies, general interviews)

## Requirements

### Functional Requirements
1. **Game Setup**
   - Configure board size (typically 100 squares)
   - Add snakes (head → tail positions)
   - Add ladders (bottom → top positions)
   - Add players (2-4 players)
   - Set starting position (usually 0)

2. **Gameplay**
   - Roll dice (1-6)
   - Move player by dice value
   - Handle snake encounters (slide down)
   - Handle ladder encounters (climb up)
   - Turn-based play
   - Track player positions

3. **Win Condition**
   - Reach exactly square 100
   - If roll exceeds 100, stay at current position
   - First player to reach 100 wins

4. **Game State**
   - Current player turn
   - All player positions
   - Game status (in progress, finished)
   - Move history
   - Winner tracking

### Non-Functional Requirements
1. **Extensibility**
   - Support different board sizes
   - Configurable number of snakes/ladders
   - Multiple dice support
   - Custom rules

2. **Validation**
   - Valid snake/ladder positions
   - No overlapping snakes/ladders
   - Valid player count


## Class Diagram

![Snakeandladder Class Diagram](diagrams/class-diagram.png)

## System Architecture

```
┌────────────────────────────────────────┐
│         Game Controller                 │
│  - Start game                          │
│  - Process turn                        │
│  - Check win condition                 │
└────────────┬───────────────────────────┘
             │
   ┌─────────┼─────────┐
   │         │         │
┌──▼───┐ ┌──▼────┐ ┌──▼─────┐
│Board │ │Player │ │  Dice  │
│      │ │Manager│ │        │
│-Snakes│ │-Track │ │-Roll  │
│-Ladder│ │-Move  │ │-Random│
└──────┘ └───────┘ └────────┘
```

## Core Data Model

### 1. Board
```java
public class Board {
    private int size;
    private Map<Integer, Integer> snakes;   // head → tail
    private Map<Integer, Integer> ladders;  // bottom → top
    
    public Board(int size) {
        this.size = size;
        this.snakes = new HashMap<>();
        this.ladders = new HashMap<>();
    }
    
    public void addSnake(int head, int tail) {
        if (head <= tail || head > size || tail < 1) {
            throw new IllegalArgumentException("Invalid snake position");
        }
        if (snakes.containsKey(head) || ladders.containsKey(head)) {
            throw new IllegalArgumentException("Position already occupied");
        }
        snakes.put(head, tail);
    }
    
    public void addLadder(int bottom, int top) {
        if (bottom >= top || bottom < 1 || top > size) {
            throw new IllegalArgumentException("Invalid ladder position");
        }
        if (snakes.containsKey(bottom) || ladders.containsKey(bottom)) {
            throw new IllegalArgumentException("Position already occupied");
        }
        ladders.put(bottom, top);
    }
    
    public int getNextPosition(int currentPosition) {
        // Check for snake
        if (snakes.containsKey(currentPosition)) {
            return snakes.get(currentPosition);
        }
        
        // Check for ladder
        if (ladders.containsKey(currentPosition)) {
            return ladders.get(currentPosition);
        }
        
        return currentPosition;
    }
    
    public boolean isWinningPosition(int position) {
        return position == size;
    }
}
```

### 2. Player
```java
public class Player {
    private String id;
    private String name;
    private int position;
    private PlayerStatus status;
    private int turnCount;
    
    public Player(String id, String name) {
        this.id = id;
        this.name = name;
        this.position = 0;
        this.status = PlayerStatus.ACTIVE;
        this.turnCount = 0;
    }
    
    public void move(int steps) {
        position += steps;
        turnCount++;
    }
    
    public void setPosition(int position) {
        this.position = position;
    }
    
    public boolean hasWon(int boardSize) {
        return position == boardSize;
    }
}

enum PlayerStatus {
    ACTIVE,
    WON,
    FORFEITED
}
```

### 3. Dice
```java
public class Dice {
    private int sides;
    private Random random;
    
    public Dice() {
        this(6); // Standard 6-sided dice
    }
    
    public Dice(int sides) {
        if (sides < 2) {
            throw new IllegalArgumentException("Dice must have at least 2 sides");
        }
        this.sides = sides;
        this.random = new Random();
    }
    
    public int roll() {
        return random.nextInt(sides) + 1;
    }
    
    public int getSides() {
        return sides;
    }
}
```

### 4. Game
```java
public class Game {
    private String gameId;
    private Board board;
    private List<Player> players;
    private Dice dice;
    private int currentPlayerIndex;
    private GameStatus status;
    private Player winner;
    private List<Move> moveHistory;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    
    public Game(String gameId, Board board, List<Player> players, Dice dice) {
        if (players.size() < 2) {
            throw new IllegalArgumentException("At least 2 players required");
        }
        
        this.gameId = gameId;
        this.board = board;
        this.players = new ArrayList<>(players);
        this.dice = dice;
        this.currentPlayerIndex = 0;
        this.status = GameStatus.NOT_STARTED;
        this.moveHistory = new ArrayList<>();
    }
    
    public void start() {
        if (status != GameStatus.NOT_STARTED) {
            throw new IllegalStateException("Game already started");
        }
        status = GameStatus.IN_PROGRESS;
        startTime = LocalDateTime.now();
    }
    
    public Move playTurn() {
        if (status != GameStatus.IN_PROGRESS) {
            throw new IllegalStateException("Game not in progress");
        }
        
        Player currentPlayer = players.get(currentPlayerIndex);
        
        // Roll dice
        int diceValue = dice.roll();
        
        // Calculate new position
        int newPosition = currentPlayer.getPosition() + diceValue;
        
        // Check if exceeds board size (exact landing rule)
        if (newPosition > board.getSize()) {
            // Stay at current position
            newPosition = currentPlayer.getPosition();
        } else {
            // Apply snake/ladder
            int finalPosition = board.getNextPosition(newPosition);
            
            Move move = new Move(
                currentPlayer,
                currentPlayer.getPosition(),
                newPosition,
                finalPosition,
                diceValue,
                LocalDateTime.now()
            );
            
            currentPlayer.setPosition(finalPosition);
            moveHistory.add(move);
            
            // Check win condition
            if (currentPlayer.hasWon(board.getSize())) {
                currentPlayer.setStatus(PlayerStatus.WON);
                winner = currentPlayer;
                status = GameStatus.FINISHED;
                endTime = LocalDateTime.now();
                return move;
            }
            
            // Move to next player
            currentPlayerIndex = (currentPlayerIndex + 1) % players.size();
            
            return move;
        }
        
        // No move made (exact landing rule)
        Move move = new Move(
            currentPlayer,
            currentPlayer.getPosition(),
            currentPlayer.getPosition(),
            currentPlayer.getPosition(),
            diceValue,
            LocalDateTime.now()
        );
        moveHistory.add(move);
        
        currentPlayerIndex = (currentPlayerIndex + 1) % players.size();
        
        return move;
    }
    
    public Player getCurrentPlayer() {
        return players.get(currentPlayerIndex);
    }
}

enum GameStatus {
    NOT_STARTED,
    IN_PROGRESS,
    FINISHED
}
```

### 5. Move
```java
public class Move {
    private Player player;
    private int startPosition;
    private int diceRoll;
    private int landPosition;    // After dice roll
    private int finalPosition;   // After snake/ladder
    private MoveType moveType;
    private LocalDateTime timestamp;
    
    public Move(Player player, int startPosition, int landPosition, 
                int finalPosition, int diceRoll, LocalDateTime timestamp) {
        this.player = player;
        this.startPosition = startPosition;
        this.landPosition = landPosition;
        this.finalPosition = finalPosition;
        this.diceRoll = diceRoll;
        this.timestamp = timestamp;
        
        // Determine move type
        if (finalPosition < landPosition) {
            this.moveType = MoveType.SNAKE;
        } else if (finalPosition > landPosition) {
            this.moveType = MoveType.LADDER;
        } else {
            this.moveType = MoveType.NORMAL;
        }
    }
    
    public String getDescription() {
        StringBuilder sb = new StringBuilder();
        sb.append(player.getName())
          .append(" rolled ")
          .append(diceRoll)
          .append(", moved from ")
          .append(startPosition)
          .append(" to ")
          .append(landPosition);
        
        if (moveType == MoveType.SNAKE) {
            sb.append(" (snake! slid down to ")
              .append(finalPosition)
              .append(")");
        } else if (moveType == MoveType.LADDER) {
            sb.append(" (ladder! climbed up to ")
              .append(finalPosition)
              .append(")");
        }
        
        return sb.toString();
    }
}

enum MoveType {
    NORMAL,
    SNAKE,
    LADDER
}
```

## Key Algorithms

### 1. Game Flow
```java
public class GameController {
    
    public void playGame(Game game) {
        game.start();
        
        System.out.println("Game started! " + game.getPlayers().size() + " players");
        
        while (game.getStatus() == GameStatus.IN_PROGRESS) {
            Player currentPlayer = game.getCurrentPlayer();
            
            System.out.println("\n" + currentPlayer.getName() + "'s turn");
            System.out.println("Current position: " + currentPlayer.getPosition());
            
            // Play turn
            Move move = game.playTurn();
            
            System.out.println(move.getDescription());
            
            // Check if game ended
            if (game.getStatus() == GameStatus.FINISHED) {
                System.out.println("\n🎉 " + game.getWinner().getName() + " wins!");
                System.out.println("Total turns: " + game.getWinner().getTurnCount());
                break;
            }
        }
    }
}
```

### 2. Board Configuration
```java
public class BoardConfiguration {
    
    public static Board createClassicBoard() {
        Board board = new Board(100);
        
        // Add snakes
        board.addSnake(99, 54);
        board.addSnake(95, 72);
        board.addSnake(92, 51);
        board.addSnake(83, 19);
        board.addSnake(73, 1);
        board.addSnake(69, 33);
        board.addSnake(64, 36);
        board.addSnake(59, 17);
        board.addSnake(55, 7);
        board.addSnake(52, 29);
        board.addSnake(48, 9);
        board.addSnake(46, 5);
        board.addSnake(44, 22);
        
        // Add ladders
        board.addLadder(2, 23);
        board.addLadder(4, 68);
        board.addLadder(6, 45);
        board.addLadder(20, 59);
        board.addLadder(30, 96);
        board.addLadder(52, 72);
        board.addLadder(57, 96);
        board.addLadder(71, 92);
        
        return board;
    }
    
    public static Board createRandomBoard(int size, int snakeCount, int ladderCount) {
        Board board = new Board(size);
        Random random = new Random();
        
        // Add snakes
        for (int i = 0; i < snakeCount; i++) {
            int head = random.nextInt(size - 10) + 10;
            int tail = random.nextInt(head - 5) + 1;
            
            try {
                board.addSnake(head, tail);
            } catch (IllegalArgumentException e) {
                // Position occupied, skip
            }
        }
        
        // Add ladders
        for (int i = 0; i < ladderCount; i++) {
            int bottom = random.nextInt(size - 10) + 1;
            int top = random.nextInt(size - bottom - 5) + bottom + 5;
            
            try {
                board.addLadder(bottom, top);
            } catch (IllegalArgumentException e) {
                // Position occupied, skip
            }
        }
        
        return board;
    }
}
```

### 3. Game Statistics
```java
public class GameStatistics {
    
    public static Map<String, Object> calculateStatistics(Game game) {
        Map<String, Object> stats = new HashMap<>();
        
        // Game duration
        if (game.getEndTime() != null) {
            Duration duration = Duration.between(game.getStartTime(), game.getEndTime());
            stats.put("durationMinutes", duration.toMinutes());
        }
        
        // Total moves
        stats.put("totalMoves", game.getMoveHistory().size());
        
        // Snakes encountered
        long snakeCount = game.getMoveHistory().stream()
            .filter(m -> m.getMoveType() == MoveType.SNAKE)
            .count();
        stats.put("snakesEncountered", snakeCount);
        
        // Ladders encountered
        long ladderCount = game.getMoveHistory().stream()
            .filter(m -> m.getMoveType() == MoveType.LADDER)
            .count();
        stats.put("laddersEncountered", ladderCount);
        
        // Average dice roll
        double avgDice = game.getMoveHistory().stream()
            .mapToInt(Move::getDiceRoll)
            .average()
            .orElse(0.0);
        stats.put("averageDiceRoll", avgDice);
        
        // Winner stats
        if (game.getWinner() != null) {
            stats.put("winner", game.getWinner().getName());
            stats.put("winnerTurns", game.getWinner().getTurnCount());
        }
        
        // Per-player statistics
        Map<String, Integer> playerTurns = new HashMap<>();
        for (Player player : game.getPlayers()) {
            playerTurns.put(player.getName(), player.getTurnCount());
        }
        stats.put("playerTurns", playerTurns);
        
        return stats;
    }
    
    public static int calculateShortestPath(Board board, int start, int end) {
        // BFS to find shortest path considering snakes and ladders
        Queue<int[]> queue = new LinkedList<>();
        boolean[] visited = new boolean[board.getSize() + 1];
        
        queue.offer(new int[]{start, 0}); // {position, moves}
        visited[start] = true;
        
        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int position = current[0];
            int moves = current[1];
            
            if (position == end) {
                return moves;
            }
            
            // Try all dice rolls (1-6)
            for (int dice = 1; dice <= 6; dice++) {
                int nextPos = position + dice;
                
                if (nextPos > board.getSize()) {
                    continue;
                }
                
                // Apply snake/ladder
                nextPos = board.getNextPosition(nextPos);
                
                if (!visited[nextPos]) {
                    visited[nextPos] = true;
                    queue.offer(new int[]{nextPos, moves + 1});
                }
            }
        }
        
        return -1; // Unreachable
    }
}
```

## Design Patterns

### 1. Builder Pattern (Game Setup)
```java
Game game = Game.builder()
    .board(BoardConfiguration.createClassicBoard())
    .addPlayer(new Player("p1", "Alice"))
    .addPlayer(new Player("p2", "Bob"))
    .dice(new Dice(6))
    .build();
```

### 2. Strategy Pattern (Win Conditions)
```java
interface WinCondition {
    boolean hasWon(Player player, Board board);
}

class ExactLandingWinCondition implements WinCondition {
    public boolean hasWon(Player player, Board board) {
        return player.getPosition() == board.getSize();
    }
}

class AnyLandingWinCondition implements WinCondition {
    public boolean hasWon(Player player, Board board) {
        return player.getPosition() >= board.getSize();
    }
}
```

### 3. Observer Pattern (Game Events)
```java
interface GameObserver {
    void onMove(Move move);
    void onGameEnd(Player winner);
}

class ConsoleObserver implements GameObserver {
    public void onMove(Move move) {
        System.out.println(move.getDescription());
    }
    
    public void onGameEnd(Player winner) {
        System.out.println(winner.getName() + " wins!");
    }
}
```

## Source Code

📄 **[View Complete Source Code](/problems/snakeandladder/CODE)**

**Key Files:**
- [`Game.java`](/problems/snakeandladder/CODE#gamejava) - Game logic
- [`Board.java`](/problems/snakeandladder/CODE#boardjava) - Board management
- [`Player.java`](/problems/snakeandladder/CODE#playerjava) - Player state
- [`Dice.java`](/problems/snakeandladder/CODE#dicejava) - Dice rolling

**Total Lines of Code:** ~500 lines

## Usage Example

```java
// Create board
Board board = BoardConfiguration.createClassicBoard();

// Create players
List<Player> players = List.of(
    new Player("p1", "Alice"),
    new Player("p2", "Bob"),
    new Player("p3", "Charlie")
);

// Create game
Game game = new Game("game1", board, players, new Dice(6));

// Play game
GameController controller = new GameController();
controller.playGame(game);

// Get statistics
Map<String, Object> stats = GameStatistics.calculateStatistics(game);
System.out.println("Game stats: " + stats);
```

## Common Interview Questions

### System Design Questions

1. **How would you add support for multiple dice?**
   - List<Dice> instead of single dice
   - Sum of all dice rolls
   - Different rules for multiple dice

2. **How would you implement undo functionality?**
   - Command pattern for moves
   - Stack of commands
   - Undo restores previous state

3. **How would you make it multiplayer online?**
   - WebSocket for real-time updates
   - Server-side game state
   - Client synchronization

### Coding Questions

1. **Find shortest path to win**
   ```java
   int shortestPath(Board board) {
       Queue<int[]> queue = new LinkedList<>();
       queue.offer(new int[]{0, 0}); // {pos, moves}
       boolean[] visited = new boolean[101];
       
       while (!queue.isEmpty()) {
           int[] curr = queue.poll();
           if (curr[0] == 100) return curr[1];
           
           for (int dice = 1; dice <= 6; dice++) {
               int next = curr[0] + dice;
               if (next > 100 || visited[next]) continue;
               next = board.getNextPosition(next);
               visited[next] = true;
               queue.offer(new int[]{next, curr[1] + 1});
           }
       }
       return -1;
   }
   ```

2. **Validate board configuration**
   ```java
   boolean isValidBoard(Board board) {
       // No snake/ladder to itself
       // No cycles
       // All snakes go down, ladders go up
   }
   ```

### Algorithm Questions
1. **Time complexity of shortest path?** → O(N) using BFS where N=board size
2. **How to detect infinite loops?** → Check for cycles in board configuration
3. **Probability of winning in K moves?** → Dynamic programming

## Trade-offs & Design Decisions

### 1. Exact Landing vs Any Landing
**Exact:** Traditional rule, more challenging  
**Any:** Simpler, faster games

**Decision:** Exact landing (traditional)

### 2. Multiple Snakes/Ladders per Square
**Allow:** More complex board  
**Disallow:** Simpler rules

**Decision:** Disallow (one per square)

### 3. Deterministic vs Random Dice
**Deterministic:** Testable, reproducible  
**Random:** Fun, unpredictable

**Decision:** Random (real game experience)

## Key Takeaways

### What Interviewers Look For
1. ✅ **Clean OOP design**
2. ✅ **Game state management**
3. ✅ **Turn-based logic**
4. ✅ **Win condition checking**
5. ✅ **Edge case handling**
6. ✅ **Extensibility**

### Common Mistakes to Avoid
1. ❌ Allowing invalid board configurations
2. ❌ Not handling exact landing rule
3. ❌ Missing snake/ladder checks
4. ❌ Poor separation of concerns
5. ❌ Not validating player moves
6. ❌ Mutable shared state

### Production-Ready Checklist
- [x] Board configuration
- [x] Multiple players
- [x] Snake/ladder logic
- [x] Win condition
- [x] Move validation
- [ ] Save/load game
- [ ] Multiplayer online
- [ ] AI players
- [ ] Custom rules
- [ ] Animations

---

## Related Problems
- 🎮 **Chess** - Turn-based strategy
- 🎯 **Tic Tac Toe** - Simple game logic
- 💣 **Minesweeper** - Board games
- 🎲 **Ludo** - Dice-based games

## References
- Classic Board Games: Traditional rules
- BFS Algorithm: Shortest path finding
- Game State Management: FSM patterns

---

*Production-ready Snake and Ladder game with configurable boards, multiple players, and statistics tracking. Essential for game design and OOP interviews.*

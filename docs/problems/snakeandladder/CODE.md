# snakeandladder - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/snakeandladder/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py snakeandladder`.

## Project Structure (9 files)

```
snakeandladder/
├── SnakeAndLadderDemo.java
├── SnakeAndLadderGame.java
├── model/Dice.java
├── model/GameResult.java
├── model/Ladder.java
├── model/Player.java
├── model/Snake.java
├── config/GameConfig.java
├── stats/GameStats.java
```

## Source Code

### `SnakeAndLadderDemo.java`

<details>
<summary>Click to view SnakeAndLadderDemo.java</summary>

```java
package com.you.lld.problems.snakeandladder;

import com.you.lld.problems.snakeandladder.model.*;

import java.util.Arrays;
import java.util.List;

/**
 * Demo: configurable Snake and Ladder game.
 */
public class SnakeAndLadderDemo {

    public static void main(String[] args) {
        System.out.println("=== Snake and Ladder Demo ===\n");

        List<Snake> snakes = Arrays.asList(
            new Snake(99, 10),
            new Snake(65, 25),
            new Snake(45, 7),
            new Snake(52, 11),
            new Snake(88, 36)
        );

        List<Ladder> ladders = Arrays.asList(
            new Ladder(2, 38),
            new Ladder(7, 14),
            new Ladder(15, 31),
            new Ladder(28, 84),
            new Ladder(51, 67),
            new Ladder(71, 91)
        );

        List<Player> players = Arrays.asList(
            new Player("Alice"),
            new Player("Bob")
        );

        SnakeAndLadderGame game = new SnakeAndLadderGame(
            100, snakes, ladders, players, 6
        );

        System.out.println("Board: 100 cells, " + snakes.size() + " snakes, "
            + ladders.size() + " ladders, 2 players\n");

        // Play turn by turn, printing first 30 turns then skip to end
        int turn = 0;
        while (!game.isGameOver()) {
            String log = game.playTurn();
            turn++;
            if (turn <= 30) {
                System.out.println("Turn " + turn + ": " + log);
            }
        }

        if (turn > 30) {
            System.out.println("... (skipped " + (turn - 30) + " turns) ...");
        }

        System.out.println("\nResult: " + game.getWinner().getName() + " wins in " + turn + " turns!");
        System.out.println("Stats: " + game.getStats());

        System.out.println("\nFinal positions:");
        for (Player p : game.getPlayers()) {
            System.out.println("  " + p.getName() + " -> " + p.getPosition());
        }

        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `SnakeAndLadderGame.java`

<details>
<summary>Click to view SnakeAndLadderGame.java</summary>

```java
package com.you.lld.problems.snakeandladder;

import com.you.lld.problems.snakeandladder.model.*;
import com.you.lld.problems.snakeandladder.stats.GameStats;

import java.util.*;

/**
 * Core game engine for Snake and Ladder.
 *
 * Hard problems handled:
 *  - Configurable board (size, snakes, ladders)
 *  - Exact landing on last cell to win (overshoot = stay)
 *  - Snake/ladder chain detection (land on ladder top which is a snake head)
 *  - Turn rotation, game-over detection
 *  - Stats tracking (rolls, snake/ladder hits per player)
 */
public class SnakeAndLadderGame {

    private final int boardSize;
    private final Map<Integer, Integer> snakeMap;   // head -> tail
    private final Map<Integer, Integer> ladderMap;  // bottom -> top
    private final List<Player> players;
    private final Dice dice;
    private final GameStats stats;

    private int currentPlayerIndex;
    private boolean gameOver;
    private Player winner;

    public SnakeAndLadderGame(int boardSize, List<Snake> snakes, List<Ladder> ladders,
                              List<Player> players, int diceSides) {
        if (players == null || players.size() < 2) {
            throw new IllegalArgumentException("Need at least 2 players");
        }
        this.boardSize = boardSize;
        this.players = new ArrayList<>(players);
        this.dice = new Dice(diceSides);
        this.stats = new GameStats();
        this.currentPlayerIndex = 0;
        this.gameOver = false;

        // Build lookup maps
        this.snakeMap = new HashMap<>();
        for (Snake s : snakes) {
            if (snakeMap.containsKey(s.getHead()) || s.getHead() > boardSize) {
                throw new IllegalArgumentException("Invalid snake: " + s);
            }
            snakeMap.put(s.getHead(), s.getTail());
        }
        this.ladderMap = new HashMap<>();
        for (Ladder l : ladders) {
            if (ladderMap.containsKey(l.getBottom()) || l.getTop() > boardSize) {
                throw new IllegalArgumentException("Invalid ladder: " + l);
            }
            ladderMap.put(l.getBottom(), l.getTop());
        }
    }

    /** Play one turn for the current player. Returns description of what happened. Thread-safe. */
    public synchronized String playTurn() {
        if (gameOver) {
            return "Game is already over. Winner: " + winner.getName();
        }

        Player player = players.get(currentPlayerIndex);
        int roll = dice.roll();
        stats.recordRoll(roll);

        int oldPos = player.getPosition();
        int newPos = oldPos + roll;

        StringBuilder log = new StringBuilder();
        log.append(player.getName()).append(" rolled ").append(roll);

        // Overshoot: must land exactly on boardSize
        if (newPos > boardSize) {
            log.append(" -> stays at ").append(oldPos).append(" (overshoot)");
            advanceTurn();
            return log.toString();
        }

        player.setPosition(newPos);
        log.append(" -> moves ").append(oldPos).append("->").append(newPos);

        // Resolve snakes and ladders (chain: land on ladder that leads to snake, etc.)
        newPos = resolvePosition(newPos, log);
        player.setPosition(newPos);

        // Win check
        if (newPos == boardSize) {
            gameOver = true;
            winner = player;
            log.append(" *** ").append(player.getName()).append(" WINS! ***");
            return log.toString();
        }

        advanceTurn();
        return log.toString();
    }

    /** Play the entire game until someone wins. Returns GameResult. */
    public GameResult playFull() {
        int moves = 0;
        while (!gameOver) {
            playTurn();
            moves++;
            if (moves > 10_000) {
                throw new RuntimeException("Game exceeded 10000 moves, likely infinite loop");
            }
        }
        return new GameResult(winner, moves);
    }

    // --- Getters ---

    public boolean isGameOver()         { return gameOver; }
    public Player getWinner()           { return winner; }
    public Player getCurrentPlayer()    { return players.get(currentPlayerIndex); }
    public List<Player> getPlayers()    { return Collections.unmodifiableList(players); }
    public GameStats getStats()         { return stats; }

    // --- Internals ---

    private int resolvePosition(int pos, StringBuilder log) {
        // Keep resolving until no more snakes or ladders
        int maxChain = 20; // safety
        while (maxChain-- > 0) {
            if (snakeMap.containsKey(pos)) {
                int dest = snakeMap.get(pos);
                log.append(" [SNAKE ").append(pos).append("->").append(dest).append("]");
                stats.recordSnakeHit();
                pos = dest;
            } else if (ladderMap.containsKey(pos)) {
                int dest = ladderMap.get(pos);
                log.append(" [LADDER ").append(pos).append("->").append(dest).append("]");
                stats.recordLadderHit();
                pos = dest;
            } else {
                break;
            }
        }
        return pos;
    }

    private void advanceTurn() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.size();
    }
}
```

</details>

### `model/Dice.java`

<details>
<summary>Click to view model/Dice.java</summary>

```java
package com.you.lld.problems.snakeandladder.model;

import java.util.Random;

public class Dice {
    private final int sides;
    private final Random random;
    
    public Dice(int sides) {
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

</details>

### `model/GameResult.java`

<details>
<summary>Click to view model/GameResult.java</summary>

```java
package com.you.lld.problems.snakeandladder.model;

public class GameResult {
    private final Player winner;
    private final int totalMoves;
    
    public GameResult(Player winner, int totalMoves) {
        this.winner = winner;
        this.totalMoves = totalMoves;
    }
    
    public Player getWinner() { return winner; }
    public int getTotalMoves() { return totalMoves; }
    
    @Override
    public String toString() {
        return "Winner: " + winner.getName() + " in " + totalMoves + " moves";
    }
}
```

</details>

### `model/Ladder.java`

<details>
<summary>Click to view model/Ladder.java</summary>

```java
package com.you.lld.problems.snakeandladder.model;

public class Ladder {
    private final int bottom;
    private final int top;
    
    public Ladder(int bottom, int top) {
        if (bottom >= top) {
            throw new IllegalArgumentException("Ladder bottom must be < top");
        }
        this.bottom = bottom;
        this.top = top;
    }
    
    public int getBottom() { return bottom; }
    public int getTop() { return top; }
    
    @Override
    public String toString() {
        return "Ladder{" + bottom + "→" + top + "}";
    }
}
```

</details>

### `model/Player.java`

<details>
<summary>Click to view model/Player.java</summary>

```java
package com.you.lld.problems.snakeandladder.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Represents a player in the Snake and Ladder game.
 */
public class Player {
    
    private final PlayerId id;
    private final String name;
    private int position;
    
    public Player(String name) {
        this.id = PlayerId.generate();
        this.name = Objects.requireNonNull(name, "Name cannot be null");
        this.position = 0; // Start position
    }
    
    public PlayerId getId() {
        return id;
    }
    
    public String getName() {
        return name;
    }
    
    public int getPosition() {
        return position;
    }
    
    public void setPosition(int position) {
        if (position < 0) {
            throw new IllegalArgumentException("Position cannot be negative");
        }
        this.position = position;
    }
    
    public void move(int steps) {
        this.position += steps;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Player)) return false;
        Player other = (Player) obj;
        return id.equals(other.id);
    }
    
    @Override
    public int hashCode() {
        return id.hashCode();
    }
    
    @Override
    public String toString() {
        return "Player{name='" + name + "', position=" + position + "}";
    }
}

/**
 * Value object for Player ID.
 */
class PlayerId {
    
    private final String value;
    
    private PlayerId(String value) {
        this.value = value;
    }
    
    public static PlayerId generate() {
        return new PlayerId(UUID.randomUUID().toString());
    }
    
    public static PlayerId of(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Player ID cannot be empty");
        }
        return new PlayerId(value);
    }
    
    public String getValue() {
        return value;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof PlayerId)) return false;
        return value.equals(((PlayerId) obj).value);
    }
    
    @Override
    public int hashCode() {
        return value.hashCode();
    }
    
    @Override
    public String toString() {
        return value;
    }
}
```

</details>

### `model/Snake.java`

<details>
<summary>Click to view model/Snake.java</summary>

```java
package com.you.lld.problems.snakeandladder.model;

public class Snake {
    private final int head;
    private final int tail;
    
    public Snake(int head, int tail) {
        if (head <= tail) {
            throw new IllegalArgumentException("Snake head must be > tail");
        }
        this.head = head;
        this.tail = tail;
    }
    
    public int getHead() { return head; }
    public int getTail() { return tail; }
    
    @Override
    public String toString() {
        return "Snake{" + head + "→" + tail + "}";
    }
}
```

</details>

### `config/GameConfig.java`

<details>
<summary>Click to view config/GameConfig.java</summary>

```java
package com.you.lld.problems.snakeandladder.config;

public class GameConfig {
    private final int boardSize;
    private final int numSnakes;
    private final int numLadders;
    private final int diceSides;
    
    public GameConfig(int boardSize, int numSnakes, int numLadders, int diceSides) {
        this.boardSize = boardSize;
        this.numSnakes = numSnakes;
        this.numLadders = numLadders;
        this.diceSides = diceSides;
    }
    
    public static GameConfig standard() {
        return new GameConfig(100, 8, 8, 6);
    }
    
    public int getBoardSize() { return boardSize; }
    public int getNumSnakes() { return numSnakes; }
    public int getNumLadders() { return numLadders; }
    public int getDiceSides() { return diceSides; }
}
```

</details>

### `stats/GameStats.java`

<details>
<summary>Click to view stats/GameStats.java</summary>

```java
package com.you.lld.problems.snakeandladder.stats;

import java.util.*;

public class GameStats {
    private int totalRolls;
    private final Map<Integer, Integer> rollFrequency;
    private int snakeHits;
    private int ladderHits;
    
    public GameStats() {
        this.rollFrequency = new HashMap<>();
        this.totalRolls = 0;
        this.snakeHits = 0;
        this.ladderHits = 0;
    }
    
    public void recordRoll(int value) {
        totalRolls++;
        rollFrequency.merge(value, 1, Integer::sum);
    }
    
    public void recordSnakeHit() {
        snakeHits++;
    }
    
    public void recordLadderHit() {
        ladderHits++;
    }
    
    public int getTotalRolls() { return totalRolls; }
    public int getSnakeHits() { return snakeHits; }
    public int getLadderHits() { return ladderHits; }
    
    @Override
    public String toString() {
        return "GameStats{rolls=" + totalRolls + ", snakes=" + snakeHits + 
               ", ladders=" + ladderHits + "}";
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.snakeandladder.SnakeAndLadderDemo"
```

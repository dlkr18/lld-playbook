# snakeandladder - Complete Implementation

## 📁 Project Structure

```
snakeandladder/
├── config/GameConfig.java
├── model/Dice.java
├── model/GameResult.java
├── model/Ladder.java
├── model/Player.java
├── model/Snake.java
├── stats/GameStats.java
```

## 📝 Source Code

### 📄 `config/GameConfig.java`

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

### 📄 `model/Dice.java`

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

### 📄 `model/GameResult.java`

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

### 📄 `model/Ladder.java`

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

### 📄 `model/Player.java`

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

### 📄 `model/Snake.java`

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

### 📄 `stats/GameStats.java`

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


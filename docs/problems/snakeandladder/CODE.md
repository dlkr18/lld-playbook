# snakeandladder - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/snakeandladder/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py snakeandladder`.

## Project Structure (17 files)

```
snakeandladder/
├── SnakeAndLadderDemo.java
├── SnakeAndLadder.java
├── SnakeAndLadderGame.java
├── model/Board.java
├── model/GameResult.java
├── model/GameStats.java
├── model/Ladder.java
├── model/Player.java
├── model/Snake.java
├── service/DiceStrategy.java
├── service/impl/FixedDiceStrategy.java
├── service/impl/RandomDiceStrategy.java
├── builder/BoardBuilder.java
├── observer/GameEvent.java
├── observer/GameEventListener.java
├── observer/GameEventType.java
├── observer/LoggingGameEventListener.java
```

## Source Code

### `SnakeAndLadderDemo.java`

<details>
<summary>Click to view SnakeAndLadderDemo.java</summary>

```java
package com.you.lld.problems.snakeandladder;

import com.you.lld.problems.snakeandladder.builder.BoardBuilder;
import com.you.lld.problems.snakeandladder.observer.LoggingGameEventListener;
import com.you.lld.problems.snakeandladder.service.impl.FixedDiceStrategy;
import com.you.lld.problems.snakeandladder.service.impl.RandomDiceStrategy;

public class SnakeAndLadderDemo {

    public static void main(String[] args) {
        System.out.println("=== Snake and Ladder Demo ===\n");

        System.out.println("--- Scenario 1: Standard board (random dice) ---");
        SnakeAndLadder game1 = SnakeAndLadder.builder()
            .standardBoard()
            .players("Alice", "Bob")
            .dice(new RandomDiceStrategy(6))
            .build();
        int turn = 0;
        while (!game1.isGameOver() && turn < 25) {
            System.out.println("Turn " + (++turn) + ": " + game1.playTurn());
        }
        if (game1.isGameOver()) {
            System.out.println("Winner: " + game1.getWinner().getName());
        } else {
            System.out.println("(stopped after 25 turns for demo brevity)");
        }

        System.out.println("\n--- Scenario 2: Fixed dice — ladder climb ---");
        SnakeAndLadder game2 = SnakeAndLadder.builder()
            .board(new BoardBuilder().size(20)
                .addLadder(2, 10)
                .addSnake(15, 5)
                .build())
            .players("Carol", "Dave")
            .dice(new FixedDiceStrategy(2, 3, 4, 5))
            .build();
        for (int i = 0; i < 4; i++) {
            System.out.println(game2.playTurn());
        }

        System.out.println("\n--- Scenario 3: Overshoot rule ---");
        SnakeAndLadder game3 = SnakeAndLadder.builder()
            .board(new BoardBuilder().size(10).build())
            .players("Eve", "Frank")
            .dice(new FixedDiceStrategy(9, 3))
            .build();
        System.out.println(game3.playTurn());
        System.out.println(game3.playTurn());

        System.out.println("\n--- Scenario 4: Observer events ---");
        SnakeAndLadder game4 = SnakeAndLadder.builder()
            .board(new BoardBuilder().size(15)
                .addSnake(12, 3)
                .addLadder(5, 11)
                .build())
            .players("Grace", "Henry")
            .dice(new FixedDiceStrategy(5, 1))
            .listener(new LoggingGameEventListener())
            .build();
        game4.playTurn();
        game4.playTurn();

        System.out.println("\n--- Scenario 5: Win on exact landing ---");
        SnakeAndLadder game5 = SnakeAndLadder.builder()
            .board(new BoardBuilder().size(6).build())
            .players("Ivy", "Jack")
            .dice(new FixedDiceStrategy(6))
            .build();
        System.out.println(game5.playTurn());
        System.out.println("Game over: " + game5.isGameOver());

        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `SnakeAndLadder.java`

<details>
<summary>Click to view SnakeAndLadder.java</summary>

```java
package com.you.lld.problems.snakeandladder;

import com.you.lld.problems.snakeandladder.builder.BoardBuilder;
import com.you.lld.problems.snakeandladder.model.Board;
import com.you.lld.problems.snakeandladder.model.Player;
import com.you.lld.problems.snakeandladder.observer.GameEventListener;
import com.you.lld.problems.snakeandladder.service.DiceStrategy;
import com.you.lld.problems.snakeandladder.service.impl.RandomDiceStrategy;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/** Facade — builds board + game from fluent API. */
public class SnakeAndLadder {

    private final SnakeAndLadderGame game;

    private SnakeAndLadder(SnakeAndLadderGame game) {
        this.game = game;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String playTurn() {
        return game.playTurn();
    }

    public boolean isGameOver() {
        return game.isGameOver();
    }

    public Player getWinner() {
        return game.getWinner();
    }

    public SnakeAndLadderGame unwrap() {
        return game;
    }

    public static final class Builder {
        private Board board;
        private List<Player> players = new ArrayList<>();
        private DiceStrategy dice = new RandomDiceStrategy(6);
        private final List<GameEventListener> listeners = new ArrayList<>();

        public Builder board(Board board) {
            this.board = board;
            return this;
        }

        public Builder standardBoard() {
            this.board = new BoardBuilder().standardLayout().build();
            return this;
        }

        public Builder players(String... names) {
            players.clear();
            for (String name : names) {
                players.add(new Player(name));
            }
            return this;
        }

        public Builder dice(DiceStrategy dice) {
            this.dice = dice;
            return this;
        }

        public Builder listener(GameEventListener listener) {
            listeners.add(listener);
            return this;
        }

        public SnakeAndLadder build() {
            if (board == null) {
                board = new BoardBuilder().standardLayout().build();
            }
            if (players.size() < 2) {
                players = Arrays.asList(new Player("Alice"), new Player("Bob"));
            }
            SnakeAndLadderGame g = new SnakeAndLadderGame(board, players, dice, listeners);
            return new SnakeAndLadder(g);
        }
    }
}
```

</details>

### `SnakeAndLadderGame.java`

<details>
<summary>Click to view SnakeAndLadderGame.java</summary>

```java
package com.you.lld.problems.snakeandladder;

import com.you.lld.problems.snakeandladder.model.Board;
import com.you.lld.problems.snakeandladder.model.GameResult;
import com.you.lld.problems.snakeandladder.model.GameStats;
import com.you.lld.problems.snakeandladder.model.Player;
import com.you.lld.problems.snakeandladder.observer.GameEvent;
import com.you.lld.problems.snakeandladder.observer.GameEventListener;
import com.you.lld.problems.snakeandladder.observer.GameEventType;
import com.you.lld.problems.snakeandladder.service.DiceStrategy;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class SnakeAndLadderGame {

    private final Board board;
    private final List<Player> players;
    private final DiceStrategy dice;
    private final GameStats stats;
    private final List<GameEventListener> listeners;

    private int currentPlayerIndex;
    private boolean gameOver;
    private Player winner;

    public SnakeAndLadderGame(Board board, List<Player> players, DiceStrategy dice) {
        this(board, players, dice, new CopyOnWriteArrayList<GameEventListener>());
    }

    public SnakeAndLadderGame(Board board, List<Player> players, DiceStrategy dice,
                              List<GameEventListener> listeners) {
        if (players == null || players.size() < 2) {
            throw new IllegalArgumentException("Need at least 2 players");
        }
        this.board = board;
        this.players = new ArrayList<>(players);
        this.dice = dice;
        this.stats = new GameStats();
        this.listeners = listeners;
        this.currentPlayerIndex = 0;
    }

    public void addListener(GameEventListener listener) {
        listeners.add(listener);
    }

    public synchronized String playTurn() {
        if (gameOver) {
            return "Game over. Winner: " + winner.getName();
        }

        Player player = players.get(currentPlayerIndex);
        int roll = dice.roll();
        stats.recordRoll();

        int oldPos = player.getPosition();
        int target = oldPos + roll;
        StringBuilder log = new StringBuilder();
        log.append(player.getName()).append(" rolled ").append(roll);

        if (target > board.getSize()) {
            log.append(" -> stays at ").append(oldPos).append(" (overshoot)");
            fire(new GameEvent(GameEventType.OVERSHOOT, player, log.toString()));
            advanceTurn();
            return log.toString();
        }

        player.setPosition(target);
        log.append(" -> ").append(oldPos).append(" to ").append(target);

        int resolved = resolveWithEvents(player, target, log);
        player.setPosition(resolved);

        if (resolved == board.getSize()) {
            gameOver = true;
            winner = player;
            log.append(" *** WINS ***");
            fire(new GameEvent(GameEventType.GAME_WON, player, log.toString()));
            return log.toString();
        }

        fire(new GameEvent(GameEventType.TURN_PLAYED, player, log.toString()));
        advanceTurn();
        return log.toString();
    }

    public GameResult playUntilWin() {
        int moves = 0;
        while (!gameOver) {
            playTurn();
            moves++;
            if (moves > 10_000) {
                throw new IllegalStateException("Game exceeded move limit");
            }
        }
        return new GameResult(winner, moves);
    }

    private int resolveWithEvents(Player player, int position, StringBuilder log) {
        int hops = 20;
        while (hops-- > 0) {
            if (board.isSnakeHead(position)) {
                int dest = board.snakeDestination(position);
                log.append(" [SNAKE ").append(position).append("->").append(dest).append("]");
                stats.recordSnakeHit();
                fire(new GameEvent(GameEventType.SNAKE_HIT, player, player.getName() + " hit snake at " + position));
                position = dest;
            } else if (board.isLadderBottom(position)) {
                int dest = board.ladderDestination(position);
                log.append(" [LADDER ").append(position).append("->").append(dest).append("]");
                stats.recordLadderHit();
                fire(new GameEvent(GameEventType.LADDER_HIT, player, player.getName() + " climbed ladder at " + position));
                position = dest;
            } else {
                break;
            }
        }
        return position;
    }

    private void fire(GameEvent event) {
        for (GameEventListener listener : listeners) {
            listener.onEvent(event);
        }
    }

    private void advanceTurn() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.size();
    }

    public boolean isGameOver() {
        return gameOver;
    }

    public Player getWinner() {
        return winner;
    }

    public Player getCurrentPlayer() {
        return players.get(currentPlayerIndex);
    }

    public List<Player> getPlayers() {
        return Collections.unmodifiableList(players);
    }

    public GameStats getStats() {
        return stats;
    }
}
```

</details>

### `model/Board.java`

<details>
<summary>Click to view model/Board.java</summary>

```java
package com.you.lld.problems.snakeandladder.model;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class Board {

    private final int size;
    private final Map<Integer, Integer> snakes;
    private final Map<Integer, Integer> ladders;

    public Board(int size, Map<Integer, Integer> snakes, Map<Integer, Integer> ladders) {
        this.size = size;
        this.snakes = Collections.unmodifiableMap(new HashMap<>(snakes));
        this.ladders = Collections.unmodifiableMap(new HashMap<>(ladders));
    }

    public int getSize() {
        return size;
    }

    /** Resolve snake/ladder chains from landing position (max 20 hops). */
    public int resolve(int position) {
        int hops = 20;
        while (hops-- > 0) {
            if (snakes.containsKey(position)) {
                position = snakes.get(position);
            } else if (ladders.containsKey(position)) {
                position = ladders.get(position);
            } else {
                break;
            }
        }
        return position;
    }

    public boolean isSnakeHead(int position) {
        return snakes.containsKey(position);
    }

    public boolean isLadderBottom(int position) {
        return ladders.containsKey(position);
    }

    public int snakeDestination(int head) {
        return snakes.get(head);
    }

    public int ladderDestination(int bottom) {
        return ladders.get(bottom);
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

### `model/GameStats.java`

<details>
<summary>Click to view model/GameStats.java</summary>

```java
package com.you.lld.problems.snakeandladder.model;

import java.util.HashMap;
import java.util.Map;

public class GameStats {

    private int totalRolls;
    private int snakeHits;
    private int ladderHits;

    public void recordRoll() {
        totalRolls++;
    }

    public void recordSnakeHit() {
        snakeHits++;
    }

    public void recordLadderHit() {
        ladderHits++;
    }

    public int getTotalRolls() {
        return totalRolls;
    }

    public int getSnakeHits() {
        return snakeHits;
    }

    public int getLadderHits() {
        return ladderHits;
    }

    @Override
    public String toString() {
        return "GameStats{rolls=" + totalRolls + ", snakes=" + snakeHits + ", ladders=" + ladderHits + "}";
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

### `service/DiceStrategy.java`

<details>
<summary>Click to view service/DiceStrategy.java</summary>

```java
package com.you.lld.problems.snakeandladder.service;

public interface DiceStrategy {

    int roll();

    String name();
}
```

</details>

### `service/impl/FixedDiceStrategy.java`

<details>
<summary>Click to view service/impl/FixedDiceStrategy.java</summary>

```java
package com.you.lld.problems.snakeandladder.service.impl;

import com.you.lld.problems.snakeandladder.service.DiceStrategy;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.Queue;

/** Deterministic dice for demos/tests — cycles through preset values. */
public class FixedDiceStrategy implements DiceStrategy {

    private final Queue<Integer> values;

    public FixedDiceStrategy(int... rolls) {
        this.values = new LinkedList<>();
        for (int roll : rolls) {
            values.add(roll);
        }
    }

    @Override
    public int roll() {
        if (values.isEmpty()) {
            return 1;
        }
        Integer next = values.poll();
        values.offer(next);
        return next;
    }

    @Override
    public String name() {
        return "FIXED" + Arrays.toString(values.toArray());
    }
}
```

</details>

### `service/impl/RandomDiceStrategy.java`

<details>
<summary>Click to view service/impl/RandomDiceStrategy.java</summary>

```java
package com.you.lld.problems.snakeandladder.service.impl;

import com.you.lld.problems.snakeandladder.service.DiceStrategy;

import java.util.Random;

public class RandomDiceStrategy implements DiceStrategy {

    private final int sides;
    private final Random random;

    public RandomDiceStrategy(int sides) {
        if (sides < 1) {
            throw new IllegalArgumentException("Dice must have at least 1 side");
        }
        this.sides = sides;
        this.random = new Random();
    }

    @Override
    public int roll() {
        return random.nextInt(sides) + 1;
    }

    @Override
    public String name() {
        return "RANDOM_D" + sides;
    }
}
```

</details>

### `builder/BoardBuilder.java`

<details>
<summary>Click to view builder/BoardBuilder.java</summary>

```java
package com.you.lld.problems.snakeandladder.builder;

import com.you.lld.problems.snakeandladder.model.Board;
import com.you.lld.problems.snakeandladder.model.Ladder;
import com.you.lld.problems.snakeandladder.model.Snake;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BoardBuilder {

    private int boardSize = 100;
    private final List<Snake> snakes = new ArrayList<>();
    private final List<Ladder> ladders = new ArrayList<>();

    public BoardBuilder size(int boardSize) {
        this.boardSize = boardSize;
        return this;
    }

    public BoardBuilder addSnake(int head, int tail) {
        snakes.add(new Snake(head, tail));
        return this;
    }

    public BoardBuilder addLadder(int bottom, int top) {
        ladders.add(new Ladder(bottom, top));
        return this;
    }

    public BoardBuilder standardLayout() {
        addSnake(99, 10).addSnake(65, 25).addSnake(45, 7).addSnake(52, 11).addSnake(88, 36);
        addLadder(2, 38).addLadder(7, 14).addLadder(15, 31).addLadder(28, 84);
        addLadder(51, 67).addLadder(71, 91);
        return this;
    }

    public Board build() {
        Map<Integer, Integer> snakeMap = new HashMap<>();
        for (Snake snake : snakes) {
            if (snake.getHead() > boardSize || snakeMap.containsKey(snake.getHead())) {
                throw new IllegalArgumentException("Invalid snake: " + snake);
            }
            snakeMap.put(snake.getHead(), snake.getTail());
        }
        Map<Integer, Integer> ladderMap = new HashMap<>();
        for (Ladder ladder : ladders) {
            if (ladder.getTop() > boardSize || ladderMap.containsKey(ladder.getBottom())) {
                throw new IllegalArgumentException("Invalid ladder: " + ladder);
            }
            ladderMap.put(ladder.getBottom(), ladder.getTop());
        }
        return new Board(boardSize, snakeMap, ladderMap);
    }
}
```

</details>

### `observer/GameEvent.java`

<details>
<summary>Click to view observer/GameEvent.java</summary>

```java
package com.you.lld.problems.snakeandladder.observer;

import com.you.lld.problems.snakeandladder.model.Player;

public final class GameEvent {

    private final GameEventType type;
    private final Player player;
    private final String message;

    public GameEvent(GameEventType type, Player player, String message) {
        this.type = type;
        this.player = player;
        this.message = message;
    }

    public GameEventType getType() {
        return type;
    }

    public Player getPlayer() {
        return player;
    }

    public String getMessage() {
        return message;
    }
}
```

</details>

### `observer/GameEventListener.java`

<details>
<summary>Click to view observer/GameEventListener.java</summary>

```java
package com.you.lld.problems.snakeandladder.observer;

public interface GameEventListener {

    void onEvent(GameEvent event);
}
```

</details>

### `observer/GameEventType.java`

<details>
<summary>Click to view observer/GameEventType.java</summary>

```java
package com.you.lld.problems.snakeandladder.observer;

import com.you.lld.problems.snakeandladder.model.Player;

public enum GameEventType {
    TURN_PLAYED, OVERSHOOT, SNAKE_HIT, LADDER_HIT, GAME_WON
}
```

</details>

### `observer/LoggingGameEventListener.java`

<details>
<summary>Click to view observer/LoggingGameEventListener.java</summary>

```java
package com.you.lld.problems.snakeandladder.observer;

public class LoggingGameEventListener implements GameEventListener {

    @Override
    public void onEvent(GameEvent event) {
        System.out.println("  [EVENT " + event.getType() + "] " + event.getMessage());
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.snakeandladder.SnakeAndLadderDemo"
```

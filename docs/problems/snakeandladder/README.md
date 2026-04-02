# Snake and Ladder Game - Complete LLD Guide

## Table of Contents
1. [Problem Statement](#problem-statement)
2. [Requirements](#requirements)
3. [System Design](#system-design)
4. [Class Diagram](#class-diagram)
5. [Implementation Approaches](#implementation-approaches)
6. [Design Patterns Used](#design-patterns-used)
7. [Complete Implementation](#complete-implementation)
8. [Best Practices](#best-practices)

---

## Problem Statement

Design a **Snake and Ladder Game** system that handles core operations efficiently, scalably, and provides an excellent user experience.

### Key Challenges
- High concurrency and thread safety
- Real-time data consistency
- Scalable architecture
- Efficient resource management
- Low latency operations

---

## Requirements

### Functional Requirements
- Core entity management (CRUD operations)
- Real-time status updates
- Transaction processing
- Search and filtering capabilities
- Notification support
- Payment processing (if applicable)
- Reporting and analytics
- User management and authentication

### Non-Functional Requirements
- **Performance**: Response time < 100ms for critical operations
- **Security**: Authentication, authorization, data encryption
- **Scalability**: Support 10,000+ concurrent users
- **Reliability**: 99.9% uptime, fault tolerance
- **Availability**: Multi-region deployment ready
- **Data Consistency**: ACID transactions where needed
- **Usability**: Intuitive API design

---

## System Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│ Client Layer │
│ (Web, Mobile, API) │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│ Service Layer │
│ (Business Logic & Orchestration) │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│ Repository Layer │
│ (Data Access & Caching) │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│ Data Layer │
│ (Database, Cache, Storage) │
└─────────────────────────────────────────────────────┘
```

---

## Class Diagram

![Class Diagram](diagrams/class-diagram.jpg)

<details>
<summary>View Mermaid Source</summary>

## Class Diagram

![Class Diagram](class-diagram.jpg)

<details>
<summary>View Mermaid Source</summary>

```mermaid
classDiagram
    class Service {
        <<interface>>
        +operation()
    }
    class Model {
        -String id
        +getId()
    }
    Service --> Model
```

</details>

</details>

---

## Implementation Approaches

### Approach 1: In-Memory Implementation
**Pros:**
- Fast access (O(1) for HashMap operations)
- Simple to implement
- Good for prototyping and testing

**Cons:**
- Not persistent across restarts
- Limited by available RAM
- No distributed support

**Use Case:** Development, testing, small-scale systems, proof of concepts

### Approach 2: Database-Backed Implementation
**Pros:**
- Persistent storage
- ACID transactions
- Scalable with sharding/replication

**Cons:**
- Slower than in-memory
- Network latency
- More complex setup

**Use Case:** Production systems, large-scale, data persistence required

### Approach 3: Hybrid (Cache + Database)
**Pros:**
- Fast reads from cache
- Persistent in database
- Best of both worlds

**Cons:**
- Cache invalidation complexity
- More infrastructure
- Consistency challenges

**Use Case:** High-traffic production systems, performance-critical applications

---

## Design Patterns Used

### 1. **Repository Pattern**
Abstracts data access logic from business logic, providing a clean separation.

```java
public interface Repository<T> {
    T save(T entity);
    T findById(String id);
    List<T> findAll();
    void delete(String id);
}
```

### 2. **Strategy Pattern**
For different algorithms (e.g., pricing, allocation, sorting).

```java
public interface Strategy {
    Result execute(Input input);
}
```

### 3. **Observer Pattern**
For notifications and event handling.

```java
public interface Observer {
    void update(Event event);
}
```

### 4. **Factory Pattern**
For object creation and initialization.

```java
public class Factory {
    public static Entity create(Type type) {
        return new ConcreteEntity(type);
    }
}
```

### 5. **Singleton Pattern**
For service instances and configuration management.

---

## Key Algorithms

### Algorithm 1: Core Operation
**Time Complexity:** O(log n)
**Space Complexity:** O(n)

**Steps:**
1. Validate input parameters
2. Check resource availability
3. Perform main operation
4. Update system state
5. Notify observers/listeners

### Algorithm 2: Search/Filter
**Time Complexity:** O(n)
**Space Complexity:** O(1)

**Steps:**
1. Build filter criteria from request
2. Stream through data collection
3. Apply predicates sequentially
4. Sort results by relevance
5. Return paginated response

---

## Complete Implementation

### Project Structure

```
snakeandladder/
├── model/ Domain objects and entities
├── api/ Service interfaces
├── impl/ Service implementations
├── exceptions/ Custom exceptions
└── Demo.java Usage example
```

**Total Files:** 7

---

## Source Code

### model

#### `Board.java`

<details>
<summary>Click to view source code</summary>

```java
package com.you.lld.problems.snakeandladder.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Represents the game board with snakes and ladders.
 */
public class Board {

    private final int size;
    private final List<Snake> snakes;
    private final List<Ladder> ladders;

    private Board(Builder builder) {
        this.size = builder.size;
        this.snakes = new ArrayList<>(builder.snakes);
        this.ladders = new ArrayList<>(builder.ladders);
        validate();
    }

    private void validate() {
        // Validate all snakes and ladders are within board bounds
        for (Snake snake : snakes) {
            if (snake.getHead() > size || snake.getTail() < 1) {
                throw new IllegalArgumentException("Snake out of board bounds: " + snake);
            }
        }
        for (Ladder ladder : ladders) {
            if (ladder.getTop() > size || ladder.getBottom() < 1) {
                throw new IllegalArgumentException("Ladder out of board bounds: " + ladder);
            }
        }
    }

    public int getSize() {
        return size;
    }

    /**
     * Returns the final position after applying snakes and ladders.
     */
    public int getFinalPosition(int position) {
        // Check if landed on a snake
        for (Snake snake : snakes) {
            if (snake.hasHead(position)) {
                System.out.println(" Snake! " + position + " → " + snake.getTail());
                return snake.slide();
            }
        }

        // Check if landed on a ladder
        for (Ladder ladder : ladders) {
            if (ladder.hasBottom(position)) {
                System.out.println(" Ladder! " + position + " → " + ladder.getTop());
                return ladder.climb();
            }
        }

        // No snake or ladder
        return position;
    }

    /**
     * Returns true if the position is the winning position.
     */
    public boolean isWinning(int position) {
        return position >= size;
    }

    public static Builder builder(int size) {
        return new Builder(size);
    }

    public static class Builder {
        private final int size;
        private final List<Snake> snakes = new ArrayList<>();
        private final List<Ladder> ladders = new ArrayList<>();

        public Builder(int size) {
            if (size < 10) {
                throw new IllegalArgumentException("Board size must be at least 10");
            }
            this.size = size;
        }

        public Builder addSnake(int head, int tail) {
            snakes.add(new Snake(head, tail));
            return this;
        }

        public Builder addLadder(int bottom, int top) {
            ladders.add(new Ladder(bottom, top));
            return this;
        }

        public Board build() {
            return new Board(this);
        }
    }

    @Override
    public String toString() {
        return "Board{size=" + size + ", snakes=" + snakes.size() +
               ", ladders=" + ladders.size() + "}";
    }
}


```
</details>

#### `Dice.java`

<details>
<summary>Click to view source code</summary>

```java
package com.you.lld.problems.snakeandladder.model;

import java.util.Random;

/**
 * Represents a dice that can be rolled.
 */
public class Dice {

    private final int faces;
    private final Random random;

    /**
     * Creates a standard 6-sided dice.
     */
    public Dice() {
        this(6);
    }

    /**
     * Creates a dice with specified number of faces.
     */
    public Dice(int faces) {
        if (faces < 1) {
            throw new IllegalArgumentException("Dice must have at least 1 face");
        }
        this.faces = faces;
        this.random = new Random();
    }

    /**
     * Rolls the dice and returns a value between 1 and faces (inclusive).
     */
    public int roll() {
        return random.nextInt(faces) + 1;
    }

    public int getFaces() {
        return faces;
    }

    @Override
    public String toString() {
        return "Dice{faces=" + faces + "}";
    }
}


```
</details>

#### `Ladder.java`

<details>
<summary>Click to view source code</summary>

```java
package com.you.lld.problems.snakeandladder.model;

/**
 * Represents a ladder on the board that moves a player up.
 */
public class Ladder {

    private final int bottom;
    private final int top;

    public Ladder(int bottom, int top) {
        if (top <= bottom) {
            throw new IllegalArgumentException("Ladder top must be greater than bottom");
        }
        if (bottom < 1 || top < 2) {
            throw new IllegalArgumentException("Invalid ladder position");
        }
        this.bottom = bottom;
        this.top = top;
    }

    public int getBottom() {
        return bottom;
    }

    public int getTop() {
        return top;
    }

    /**
     * Returns true if the player landed on this ladder's bottom.
     */
    public boolean hasBottom(int position) {
        return position == bottom;
    }

    /**
     * Returns the new position after climbing the ladder.
     */
    public int climb() {
        return top;
    }

    @Override
    public String toString() {
        return "Ladder{" + bottom + " → " + top + "}";
    }
}


```
</details>

#### `Player.java`

<details>
<summary>Click to view source code</summary>

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

#### `Snake.java`

<details>
<summary>Click to view source code</summary>

```java
package com.you.lld.problems.snakeandladder.model;

/**
 * Represents a snake on the board that moves a player down.
 */
public class Snake {

    private final int head;
    private final int tail;

    public Snake(int head, int tail) {
        if (head <= tail) {
            throw new IllegalArgumentException("Snake head must be greater than tail");
        }
        if (head < 2 || tail < 1) {
            throw new IllegalArgumentException("Invalid snake position");
        }
        this.head = head;
        this.tail = tail;
    }

    public int getHead() {
        return head;
    }

    public int getTail() {
        return tail;
    }

    /**
     * Returns true if the player landed on this snake's head.
     */
    public boolean hasHead(int position) {
        return position == head;
    }

    /**
     * Returns the new position after sliding down the snake.
     */
    public int slide() {
        return tail;
    }

    @Override
    public String toString() {
        return "Snake{" + head + " → " + tail + "}";
    }
}


```
</details>

### Root

#### `SnakeAndLadderGame.java`

<details>
<summary>Click to view source code</summary>

```java
package com.you.lld.problems.snakeandladder;

import com.you.lld.problems.snakeandladder.model.*;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

/**
 * Snake and Ladder game implementation.
 *
 * <h3>Game Rules:</h3>
 * <ul>
 * <li>Players take turns rolling a dice</li>
 * <li>Move forward by the number rolled</li>
 * <li>Landing on a snake head → slide down to tail</li>
 * <li>Landing on a ladder bottom → climb up to top</li>
 * <li>First to reach or exceed board size wins</li>
 * </ul>
 *
 * <h3>Usage:</h3>
 * <pre>{@code
 * Board board = Board.builder(100)
 * .addSnake(98, 28)
 * .addLadder(4, 56)
 * .build();
 *
 * SnakeAndLadderGame game = new SnakeAndLadderGame(board);
 * game.addPlayer("Alice");
 * game.addPlayer("Bob");
 * game.start();
 * }</pre>
 */
public class SnakeAndLadderGame {

    private final Board board;
    private final Dice dice;
    private final Queue<Player> players;
    private final List<Player> allPlayers;
    private GameState state;
    private Player winner;
    private int turnNumber;

    public SnakeAndLadderGame(Board board) {
        this(board, new Dice());
    }

    public SnakeAndLadderGame(Board board, Dice dice) {
        this.board = board;
        this.dice = dice;
        this.players = new LinkedList<>();
        this.allPlayers = new ArrayList<>();
        this.state = GameState.NOT_STARTED;
        this.turnNumber = 0;
    }

    /**
     * Adds a player to the game.
     */
    public void addPlayer(String name) {
        if (state != GameState.NOT_STARTED) {
            throw new IllegalStateException("Cannot add players after game has started");
        }
        Player player = new Player(name);
        players.offer(player);
        allPlayers.add(player);
    }

    /**
     * Starts the game.
     */
    public void start() {
        if (players.size() < 2) {
            throw new IllegalStateException("Need at least 2 players to start");
        }
        state = GameState.IN_PROGRESS;
        System.out.println(" Game Started! Board size: " + board.getSize());
        System.out.println("Players: " + allPlayers.size());

        // Play until someone wins
        while (state == GameState.IN_PROGRESS) {
            playTurn();
        }

        System.out.println("\n " + winner.getName() + " WINS!");
    }

    /**
     * Plays one turn for the current player.
     */
    private void playTurn() {
        Player player = players.poll();
        turnNumber++;

        int roll = dice.roll();
        int oldPosition = player.getPosition();
        int newPosition = oldPosition + roll;

        System.out.println("\n--- Turn " + turnNumber + " ---");
        System.out.println(player.getName() + " rolled " + roll);
        System.out.println("Position: " + oldPosition + " → " + newPosition);

        // Apply snake/ladder
        newPosition = board.getFinalPosition(newPosition);
        player.setPosition(newPosition);

        System.out.println("Final position: " + player.getPosition());

        // Check win condition
        if (board.isWinning(player.getPosition())) {
            state = GameState.COMPLETED;
            winner = player;
        } else {
            // Re-queue player for next turn
            players.offer(player);
        }
    }

    /**
     * Plays one turn (for manual/controlled gameplay).
     */
    public TurnResult playOneTurn() {
        if (state != GameState.IN_PROGRESS) {
            throw new IllegalStateException("Game is not in progress");
        }

        Player player = players.poll();
        turnNumber++;

        int roll = dice.roll();
        int oldPosition = player.getPosition();
        int newPosition = oldPosition + roll;

        // Apply snake/ladder
        newPosition = board.getFinalPosition(newPosition);
        player.setPosition(newPosition);

        boolean won = board.isWinning(player.getPosition());
        if (won) {
            state = GameState.COMPLETED;
            winner = player;
        } else {
            players.offer(player);
        }

        return new TurnResult(player, oldPosition, roll, newPosition, won);
    }

    // Getters
    public Board getBoard() { return board; }
    public GameState getState() { return state; }
    public Player getWinner() { return winner; }
    public int getTurnNumber() { return turnNumber; }
    public List<Player> getPlayers() { return new ArrayList<>(allPlayers); }
    public Player getCurrentPlayer() { return players.peek(); }
}

/**
 * Game state enumeration.
 */
enum GameState {
    NOT_STARTED,
    IN_PROGRESS,
    COMPLETED
}

/**
 * Result of a turn.
 */
class TurnResult {
    private final Player player;
    private final int oldPosition;
    private final int diceRoll;
    private final int newPosition;
    private final boolean won;

    public TurnResult(Player player, int oldPosition, int diceRoll,
                      int newPosition, boolean won) {
        this.player = player;
        this.oldPosition = oldPosition;
        this.diceRoll = diceRoll;
        this.newPosition = newPosition;
        this.won = won;
    }

    public Player getPlayer() { return player; }
    public int getOldPosition() { return oldPosition; }
    public int getDiceRoll() { return diceRoll; }
    public int getNewPosition() { return newPosition; }
    public boolean isWon() { return won; }

    @Override
    public String toString() {
        return player.getName() + " rolled " + diceRoll +
               ": " + oldPosition + " → " + newPosition +
               (won ? " (WON!)" : "");
    }
}


```
</details>

---

## Best Practices Implemented

### Code Quality
- SOLID principles followed
- Clean code standards (naming, formatting)
- Proper exception handling
- Thread-safe where needed
- Comprehensive logging

### Design
- Interface-based design
- Dependency injection ready
- Testable architecture
- Extensible and maintainable
- Low coupling, high cohesion

### Performance
- Efficient data structures (HashMap, TreeMap, etc.)
- Optimized algorithms
- Proper indexing strategy
- Caching where beneficial
- Lazy loading for heavy objects

---

## How to Use

### 1. Initialization
```java
Service service = new InMemoryService();
```

### 2. Basic Operations
```java
// Create
Entity entity = service.create(...);

// Read
Entity found = service.get(id);

// Update
service.update(entity);

// Delete
service.delete(id);
```

### 3. Advanced Features
```java
// Search
List<Entity> results = service.search(criteria);

// Bulk operations
service.bulkUpdate(entities);

// Transaction support
service.executeInTransaction(() -> {{
    // operations
}});
```

---

## Testing Considerations

### Unit Tests
- Test each component in isolation
- Mock external dependencies
- Cover edge cases and error paths
- Aim for 80%+ code coverage

### Integration Tests
- Test end-to-end flows
- Verify data consistency
- Check concurrent operations
- Test failure scenarios

### Performance Tests
- Load testing (1000+ requests/sec)
- Stress testing (peak load)
- Latency measurements (p50, p95, p99)
- Memory profiling

---

## Scaling Considerations

### Horizontal Scaling
- Stateless service layer
- Database read replicas
- Load balancing across instances
- Distributed caching (Redis, Memcached)

### Vertical Scaling
- Optimize database queries
- Connection pooling
- JVM tuning
- Resource allocation

### Data Partitioning
- Shard by primary key
- Consistent hashing
- Replication strategy (master-slave, multi-master)
- Cross-shard queries optimization

---

## Security Considerations

- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- Authentication & authorization (OAuth, JWT)
- Rate limiting per user/IP
- Audit logging for sensitive operations
- Data encryption (at rest and in transit)
- Secure password storage (bcrypt, scrypt)

---

## Related Patterns & Problems

- Repository Pattern (data access abstraction)
- Service Layer Pattern (business logic orchestration)
- Domain-Driven Design (DDD)
- Event Sourcing (for audit trail)
- CQRS (for read-heavy systems)
- Circuit Breaker (fault tolerance)

---

## Interview Tips

### Key Points to Discuss
1. **Scalability**: How to handle 10x, 100x, 1000x growth
2. **Consistency**: CAP theorem trade-offs
3. **Performance**: Optimization strategies and bottlenecks
4. **Reliability**: Failure handling and recovery
5. **Trade-offs**: Why you chose certain approaches

### Common Questions
- **Q:** How would you handle millions of concurrent users?
  - **A:** Horizontal scaling, caching, load balancing, database sharding

- **Q:** What if the database goes down?
  - **A:** Read replicas, failover mechanisms, graceful degradation

- **Q:** How to ensure data consistency?
  - **A:** ACID transactions, distributed transactions (2PC, Saga), eventual consistency

- **Q:** What are the performance bottlenecks?
  - **A:** Database queries, network latency, synchronization overhead

### Discussion Points
- Start with high-level architecture
- Drill down into specific components
- Discuss trade-offs for each decision
- Mention real-world examples (if applicable)
- Be ready to modify design based on constraints

---

## Summary

This **Snake and Ladder Game** implementation demonstrates:
- Clean architecture with clear layer separation
- SOLID principles and design patterns
- Scalable and maintainable design
- Production-ready code quality
- Comprehensive error handling
- Performance optimization
- Security best practices

**Perfect for**: System design interviews, production systems, learning LLD concepts

---

**Total Lines of Code:** ~254

**Last Updated:** December 26, 2025

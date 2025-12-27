# Snake and Ladder Board Game

## Overview
A digital implementation of the classic Snake and Ladder board game supporting multiple players, customizable boards, dice rolls, and win detection. Demonstrates object-oriented design with game state management.

**Difficulty:** Medium  
**Domain:** Gaming, Simulation  
**Interview Frequency:** Medium (Gaming companies, OOP interviews)

## Game Rules
- Board: 100 cells (1-100)
- Players: 2-4 players
- Dice: Single die (1-6)
- Ladders: Climb up (e.g., 4→14, 9→31)
- Snakes: Slide down (e.g., 17→7, 54→34)
- Win: First to reach cell 100

## Key Algorithms

#### Move Player
```java
public void movePlayer(Player player, int diceValue) {
    int currentPos = player.getPosition();
    int newPos = currentPos + diceValue;
    
    if (newPos > 100) {
        return; // No move
    }
    
    // Check for ladder/snake
    if (ladders.containsKey(newPos)) {
        newPos = ladders.get(newPos);
        System.out.println("Ladder! " + player.getName() + " climbs to " + newPos);
    } else if (snakes.containsKey(newPos)) {
        newPos = snakes.get(newPos);
        System.out.println("Snake! " + player.getName() + " slides to " + newPos);
    }
    
    player.setPosition(newPos);
    
    if (newPos == 100) {
        declareWinner(player);
    }
}
```

#### Dice Roll
```java
public int rollDice() {
    return ThreadLocalRandom.current().nextInt(1, 7);
}
```

## Design Patterns

### State Pattern
```java
interface GameState {
    void play();
}

class InProgressState implements GameState {
    public void play() {
        while (!gameOver) {
            Player current = players.get(currentPlayerIndex);
            int roll = rollDice();
            movePlayer(current, roll);
            nextTurn();
        }
    }
}
```

## Source Code
📄 **[View Complete Source Code](/problems/snakeandladder/CODE)**

## Usage Example
```java
Game game = new Game();
game.addPlayer("Alice");
game.addPlayer("Bob");
game.addLadder(4, 14);
game.addLadder(9, 31);
game.addSnake(17, 7);
game.addSnake(54, 34);
game.start();
```

*Classic board game demonstrating OOP principles and game state management.*

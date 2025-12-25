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
 *   <li>Players take turns rolling a dice</li>
 *   <li>Move forward by the number rolled</li>
 *   <li>Landing on a snake head → slide down to tail</li>
 *   <li>Landing on a ladder bottom → climb up to top</li>
 *   <li>First to reach or exceed board size wins</li>
 * </ul>
 * 
 * <h3>Usage:</h3>
 * <pre>{@code
 * Board board = Board.builder(100)
 *     .addSnake(98, 28)
 *     .addLadder(4, 56)
 *     .build();
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
        System.out.println("🎮 Game Started! Board size: " + board.getSize());
        System.out.println("Players: " + allPlayers.size());
        
        // Play until someone wins
        while (state == GameState.IN_PROGRESS) {
            playTurn();
        }
        
        System.out.println("\n🏆 " + winner.getName() + " WINS!");
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


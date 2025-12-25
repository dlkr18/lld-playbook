package com.you.lld.problems.tictactoe;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * TicTacToe game implementation.
 * 
 * <h3>Usage:</h3>
 * <pre>{@code
 * TicTacToeGame game = new TicTacToeGame();
 * game.start();
 * 
 * game.makeMove(new Position(1, 1)); // X plays center
 * game.makeMove(new Position(0, 0)); // O plays corner
 * 
 * if (game.getState() == GameState.X_WON) {
 *     System.out.println("X wins!");
 * }
 * }</pre>
 */
public class TicTacToeGame {
    
    private Board board;
    private Player currentPlayer;
    private GameState state;
    private final List<Move> moveHistory;
    
    public TicTacToeGame() {
        this.board = new Board();
        this.currentPlayer = Player.X;
        this.state = GameState.NOT_STARTED;
        this.moveHistory = new ArrayList<>();
    }
    
    /**
     * Starts a new game.
     */
    public void start() {
        this.board = new Board();
        this.currentPlayer = Player.X;
        this.state = GameState.IN_PROGRESS;
        this.moveHistory.clear();
    }
    
    /**
     * Makes a move at the specified position.
     * 
     * @return Result of the move
     */
    public MoveResult makeMove(Position position) {
        // Validate game state
        if (state == GameState.NOT_STARTED) {
            return MoveResult.error("Game not started. Call start() first.");
        }
        if (state != GameState.IN_PROGRESS) {
            return MoveResult.error("Game is over. State: " + state);
        }
        
        // Validate move
        if (!board.isValidMove(position)) {
            return MoveResult.error("Invalid move: " + position);
        }
        
        // Make the move
        board.makeMove(position, currentPlayer);
        moveHistory.add(new Move(currentPlayer, position));
        
        // Check for winner
        Optional<Player> winner = board.getWinner();
        if (winner.isPresent()) {
            state = winner.get() == Player.X ? GameState.X_WON : GameState.O_WON;
            return MoveResult.gameOver(true, state, winner.get());
        }
        
        // Check for draw
        if (board.isFull()) {
            state = GameState.DRAW;
            return MoveResult.gameOver(true, state, null);
        }
        
        // Switch player
        currentPlayer = currentPlayer.opponent();
        return MoveResult.success(currentPlayer);
    }
    
    /**
     * Makes a move using algebraic notation (e.g., "a1", "b2").
     */
    public MoveResult makeMove(String notation) {
        try {
            Position pos = Position.fromNotation(notation);
            return makeMove(pos);
        } catch (IllegalArgumentException e) {
            return MoveResult.error("Invalid notation: " + notation);
        }
    }
    
    /**
     * Returns all legal moves from current position.
     */
    public List<Position> getLegalMoves() {
        if (state != GameState.IN_PROGRESS) {
            return List.of();
        }
        return board.getEmptyPositions();
    }
    
    /**
     * Undoes the last move.
     */
    public boolean undo() {
        if (moveHistory.isEmpty()) {
            return false;
        }
        
        // Replay all moves except the last one
        List<Move> history = new ArrayList<>(moveHistory);
        start();
        
        for (int i = 0; i < history.size() - 1; i++) {
            Move move = history.get(i);
            board.makeMove(move.getPosition(), move.getPlayer());
            moveHistory.add(move);
        }
        
        if (!moveHistory.isEmpty()) {
            currentPlayer = moveHistory.get(moveHistory.size() - 1).getPlayer().opponent();
        }
        
        return true;
    }
    
    /**
     * Resets the game to initial state.
     */
    public void reset() {
        this.board = new Board();
        this.currentPlayer = Player.X;
        this.state = GameState.NOT_STARTED;
        this.moveHistory.clear();
    }
    
    // Getters
    public Board getBoard() { return board.copy(); }
    public Player getCurrentPlayer() { return currentPlayer; }
    public GameState getState() { return state; }
    public List<Move> getMoveHistory() { return new ArrayList<>(moveHistory); }
    
    public boolean isGameOver() {
        return state == GameState.X_WON || 
               state == GameState.O_WON || 
               state == GameState.DRAW;
    }
}

/**
 * Represents the state of the game.
 */
enum GameState {
    NOT_STARTED,
    IN_PROGRESS,
    X_WON,
    O_WON,
    DRAW
}

/**
 * Represents a move in the game.
 */
class Move {
    private final Player player;
    private final Position position;
    
    public Move(Player player, Position position) {
        this.player = player;
        this.position = position;
    }
    
    public Player getPlayer() { return player; }
    public Position getPosition() { return position; }
    
    @Override
    public String toString() {
        return player + " at " + position;
    }
}

/**
 * Result of a move attempt.
 */
class MoveResult {
    private final boolean valid;
    private final String message;
    private final GameState newState;
    private final Player nextPlayer;
    private final Player winner;
    
    private MoveResult(boolean valid, String message, GameState newState, 
                       Player nextPlayer, Player winner) {
        this.valid = valid;
        this.message = message;
        this.newState = newState;
        this.nextPlayer = nextPlayer;
        this.winner = winner;
    }
    
    public static MoveResult success(Player nextPlayer) {
        return new MoveResult(true, "Move successful", 
            GameState.IN_PROGRESS, nextPlayer, null);
    }
    
    public static MoveResult gameOver(boolean valid, GameState state, Player winner) {
        String msg = winner != null ? winner + " wins!" : "Draw!";
        return new MoveResult(valid, msg, state, null, winner);
    }
    
    public static MoveResult error(String message) {
        return new MoveResult(false, message, null, null, null);
    }
    
    public boolean isValid() { return valid; }
    public String getMessage() { return message; }
    public GameState getNewState() { return newState; }
    public Player getNextPlayer() { return nextPlayer; }
    public Player getWinner() { return winner; }
    public boolean isGameOver() { 
        return newState == GameState.X_WON || 
               newState == GameState.O_WON || 
               newState == GameState.DRAW; 
    }
}

package com.you.lld.problems.tictactoe;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Represents a TicTacToe game board.
 * 
 * <p>The board is a 3x3 grid where players can place their marks (X or O).
 * Thread-safe through immutable design - use copy() for modifications.
 */
public class Board {
    
    public static final int SIZE = 3;
    
    private final Player[][] grid;
    
    /**
     * Creates an empty board.
     */
    public Board() {
        this.grid = new Player[SIZE][SIZE];
    }
    
    /**
     * Copy constructor for creating board variations.
     */
    private Board(Player[][] source) {
        this.grid = new Player[SIZE][SIZE];
        for (int row = 0; row < SIZE; row++) {
            System.arraycopy(source[row], 0, grid[row], 0, SIZE);
        }
    }
    
    /**
     * Creates a copy of this board.
     */
    public Board copy() {
        return new Board(this.grid);
    }
    
    /**
     * Checks if a position is valid for a move.
     */
    public boolean isValidMove(Position pos) {
        return isInBounds(pos) && grid[pos.getRow()][pos.getCol()] == null;
    }
    
    /**
     * Makes a move on the board.
     * 
     * @throws IllegalArgumentException if position is invalid
     * @throws IllegalStateException if position is occupied
     */
    public void makeMove(Position pos, Player player) {
        if (!isInBounds(pos)) {
            throw new IllegalArgumentException("Position out of bounds: " + pos);
        }
        if (grid[pos.getRow()][pos.getCol()] != null) {
            throw new IllegalStateException("Position already occupied: " + pos);
        }
        grid[pos.getRow()][pos.getCol()] = player;
    }
    
    /**
     * Returns the player at a position, or null if empty.
     */
    public Player getPlayerAt(Position pos) {
        if (!isInBounds(pos)) return null;
        return grid[pos.getRow()][pos.getCol()];
    }
    
    /**
     * Checks if the board is full (draw condition).
     */
    public boolean isFull() {
        for (int row = 0; row < SIZE; row++) {
            for (int col = 0; col < SIZE; col++) {
                if (grid[row][col] == null) {
                    return false;
                }
            }
        }
        return true;
    }
    
    /**
     * Returns all empty positions.
     */
    public List<Position> getEmptyPositions() {
        List<Position> empty = new ArrayList<>();
        for (int row = 0; row < SIZE; row++) {
            for (int col = 0; col < SIZE; col++) {
                if (grid[row][col] == null) {
                    empty.add(new Position(row, col));
                }
            }
        }
        return empty;
    }
    
    /**
     * Determines the winner, if any.
     * 
     * @return The winning player, or empty if no winner
     */
    public Optional<Player> getWinner() {
        // Check rows
        for (int row = 0; row < SIZE; row++) {
            Player winner = checkLine(grid[row][0], grid[row][1], grid[row][2]);
            if (winner != null) return Optional.of(winner);
        }
        
        // Check columns
        for (int col = 0; col < SIZE; col++) {
            Player winner = checkLine(grid[0][col], grid[1][col], grid[2][col]);
            if (winner != null) return Optional.of(winner);
        }
        
        // Check diagonals
        Player winner = checkLine(grid[0][0], grid[1][1], grid[2][2]);
        if (winner != null) return Optional.of(winner);
        
        winner = checkLine(grid[0][2], grid[1][1], grid[2][0]);
        if (winner != null) return Optional.of(winner);
        
        return Optional.empty();
    }
    
    /**
     * Checks if three cells form a winning line.
     */
    private Player checkLine(Player a, Player b, Player c) {
        if (a != null && a == b && b == c) {
            return a;
        }
        return null;
    }
    
    private boolean isInBounds(Position pos) {
        return pos.getRow() >= 0 && pos.getRow() < SIZE &&
               pos.getCol() >= 0 && pos.getCol() < SIZE;
    }
    
    /**
     * Returns a string representation of the board.
     */
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("-------------\n");
        for (int row = 0; row < SIZE; row++) {
            sb.append("| ");
            for (int col = 0; col < SIZE; col++) {
                Player p = grid[row][col];
                sb.append(p == null ? " " : p.getSymbol()).append(" | ");
            }
            sb.append("\n-------------\n");
        }
        return sb.toString();
    }
}

/**
 * Represents a position on the board.
 */
class Position {
    
    private final int row;
    private final int col;
    
    public Position(int row, int col) {
        this.row = row;
        this.col = col;
    }
    
    public int getRow() { return row; }
    public int getCol() { return col; }
    
    /**
     * Creates a position from algebraic notation (e.g., "a1", "b2", "c3").
     */
    public static Position fromNotation(String notation) {
        if (notation == null || notation.length() != 2) {
            throw new IllegalArgumentException("Invalid notation: " + notation);
        }
        char colChar = Character.toLowerCase(notation.charAt(0));
        char rowChar = notation.charAt(1);
        
        int col = colChar - 'a';
        int row = rowChar - '1';
        
        if (col < 0 || col >= Board.SIZE || row < 0 || row >= Board.SIZE) {
            throw new IllegalArgumentException("Position out of bounds: " + notation);
        }
        
        return new Position(row, col);
    }
    
    /**
     * Returns the algebraic notation for this position.
     */
    public String toNotation() {
        char colChar = (char) ('a' + col);
        char rowChar = (char) ('1' + row);
        return "" + colChar + rowChar;
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Position)) return false;
        Position other = (Position) obj;
        return row == other.row && col == other.col;
    }
    
    @Override
    public int hashCode() {
        return 31 * row + col;
    }
    
    @Override
    public String toString() {
        return toNotation();
    }
}

/**
 * Represents a player in the game.
 */
enum Player {
    X('X'),
    O('O');
    
    private final char symbol;
    
    Player(char symbol) {
        this.symbol = symbol;
    }
    
    public char getSymbol() { return symbol; }
    
    public Player opponent() {
        return this == X ? O : X;
    }
}

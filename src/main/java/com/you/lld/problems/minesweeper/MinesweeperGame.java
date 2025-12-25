package com.you.lld.problems.minesweeper;
import java.util.*;

public class MinesweeperGame {
    public enum GameState { IN_PROGRESS, WON, LOST }
    
    private final Cell[][] board;
    private final int rows;
    private final int cols;
    private GameState state;
    
    public MinesweeperGame(int rows, int cols, int mines) {
        this.rows = rows;
        this.cols = cols;
        this.board = new Cell[rows][cols];
        this.state = GameState.IN_PROGRESS;
        initializeBoard(mines);
    }
    
    private void initializeBoard(int mineCount) {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                board[i][j] = new Cell();
            }
        }
        placeMines(mineCount);
        calculateAdjacentMines();
    }
    
    private void placeMines(int count) {
        Random random = new Random();
        int placed = 0;
        while (placed < count) {
            int row = random.nextInt(rows);
            int col = random.nextInt(cols);
            if (!board[row][col].isMine()) {
                board[row][col].setMine(true);
                placed++;
            }
        }
    }
    
    private void calculateAdjacentMines() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (!board[i][j].isMine()) {
                    int count = 0;
                    for (int di = -1; di <= 1; di++) {
                        for (int dj = -1; dj <= 1; dj++) {
                            int ni = i + di, nj = j + dj;
                            if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && board[ni][nj].isMine()) {
                                count++;
                            }
                        }
                    }
                    board[i][j].setAdjacentMines(count);
                }
            }
        }
    }
    
    public boolean revealCell(int row, int col) {
        if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
        Cell cell = board[row][col];
        if (cell.isRevealed() || cell.isFlagged()) return false;
        
        cell.reveal();
        if (cell.isMine()) {
            state = GameState.LOST;
            return false;
        }
        
        if (cell.getAdjacentMines() == 0) {
            // Reveal adjacent cells
            for (int di = -1; di <= 1; di++) {
                for (int dj = -1; dj <= 1; dj++) {
                    revealCell(row + di, col + dj);
                }
            }
        }
        
        checkWinCondition();
        return true;
    }
    
    private void checkWinCondition() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (!board[i][j].isMine() && !board[i][j].isRevealed()) {
                    return;
                }
            }
        }
        state = GameState.WON;
    }
    
    public GameState getState() { return state; }
}

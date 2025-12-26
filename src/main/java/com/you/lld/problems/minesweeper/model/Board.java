package com.you.lld.problems.minesweeper.model;

import java.util.*;

public class Board {
    private final int rows;
    private final int cols;
    private final int mineCount;
    private final Cell[][] grid;
    private GameStatus status;
    
    public Board(int rows, int cols, int mineCount) {
        this.rows = rows;
        this.cols = cols;
        this.mineCount = mineCount;
        this.grid = new Cell[rows][cols];
        this.status = GameStatus.IN_PROGRESS;
        initializeBoard();
    }
    
    private void initializeBoard() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                grid[i][j] = new Cell(i, j);
            }
        }
        placeMines();
        calculateAdjacentMines();
    }
    
    private void placeMines() {
        Random random = new Random();
        int placed = 0;
        
        while (placed < mineCount) {
            int row = random.nextInt(rows);
            int col = random.nextInt(cols);
            
            if (!grid[row][col].hasMine()) {
                grid[row][col].placeMine();
                placed++;
            }
        }
    }
    
    private void calculateAdjacentMines() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (!grid[i][j].hasMine()) {
                    int count = countAdjacentMines(i, j);
                    grid[i][j].setAdjacentMines(count);
                }
            }
        }
    }
    
    private int countAdjacentMines(int row, int col) {
        int count = 0;
        for (int dr = -1; dr <= 1; dr++) {
            for (int dc = -1; dc <= 1; dc++) {
                if (dr == 0 && dc == 0) continue;
                int newRow = row + dr;
                int newCol = col + dc;
                if (isValid(newRow, newCol) && grid[newRow][newCol].hasMine()) {
                    count++;
                }
            }
        }
        return count;
    }
    
    public boolean revealCell(int row, int col) {
        if (!isValid(row, col) || grid[row][col].isRevealed() || grid[row][col].isFlagged()) {
            return false;
        }
        
        Cell cell = grid[row][col];
        cell.reveal();
        
        if (cell.hasMine()) {
            status = GameStatus.LOST;
            revealAllMines();
            return false;
        }
        
        if (cell.getAdjacentMines() == 0) {
            revealAdjacentCells(row, col);
        }
        
        if (checkWin()) {
            status = GameStatus.WON;
        }
        
        return true;
    }
    
    private void revealAdjacentCells(int row, int col) {
        for (int dr = -1; dr <= 1; dr++) {
            for (int dc = -1; dc <= 1; dc++) {
                if (dr == 0 && dc == 0) continue;
                int newRow = row + dr;
                int newCol = col + dc;
                if (isValid(newRow, newCol) && !grid[newRow][newCol].isRevealed()) {
                    revealCell(newRow, newCol);
                }
            }
        }
    }
    
    private void revealAllMines() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (grid[i][j].hasMine()) {
                    grid[i][j].reveal();
                }
            }
        }
    }
    
    private boolean checkWin() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                Cell cell = grid[i][j];
                if (!cell.hasMine() && !cell.isRevealed()) {
                    return false;
                }
            }
        }
        return true;
    }
    
    public void toggleFlag(int row, int col) {
        if (isValid(row, col) && !grid[row][col].isRevealed()) {
            grid[row][col].toggleFlag();
        }
    }
    
    private boolean isValid(int row, int col) {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }
    
    public Cell getCell(int row, int col) {
        return isValid(row, col) ? grid[row][col] : null;
    }
    
    public int getRows() { return rows; }
    public int getCols() { return cols; }
    public GameStatus getStatus() { return status; }
    
    public void print() {
        System.out.println();
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                System.out.print(grid[i][j] + " ");
            }
            System.out.println();
        }
    }
}

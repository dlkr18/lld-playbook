package com.you.lld.problems.minesweeper.model;

public class Cell {
    private final int row;
    private final int col;
    private boolean hasMine;
    private boolean isRevealed;
    private boolean isFlagged;
    private int adjacentMines;
    
    public Cell(int row, int col) {
        this.row = row;
        this.col = col;
        this.hasMine = false;
        this.isRevealed = false;
        this.isFlagged = false;
        this.adjacentMines = 0;
    }
    
    public int getRow() { return row; }
    public int getCol() { return col; }
    public boolean hasMine() { return hasMine; }
    public boolean isRevealed() { return isRevealed; }
    public boolean isFlagged() { return isFlagged; }
    public int getAdjacentMines() { return adjacentMines; }
    
    public void placeMine() { this.hasMine = true; }
    public void reveal() { this.isRevealed = true; }
    public void toggleFlag() { this.isFlagged = !isFlagged; }
    public void setAdjacentMines(int count) { this.adjacentMines = count; }
    
    @Override
    public String toString() {
        if (!isRevealed) {
            return isFlagged ? "🚩" : "□";
        }
        if (hasMine) {
            return "💣";
        }
        return adjacentMines == 0 ? " " : String.valueOf(adjacentMines);
    }
}

package com.you.lld.problems.minesweeper.model;

public final class Cell {

    private final int row;
    private final int col;
    private boolean mine;
    private boolean revealed;
    private boolean flagged;
    private int adjacentMines;

    public Cell(int row, int col) {
        this.row = row;
        this.col = col;
    }

    public int getRow() {
        return row;
    }

    public int getCol() {
        return col;
    }

    public boolean hasMine() {
        return mine;
    }

    public void placeMine() {
        this.mine = true;
    }

    public void reveal() {
        this.revealed = true;
    }

    public void toggleFlag() {
        this.flagged = !this.flagged;
    }

    public boolean isMine() {
        return mine;
    }

    public void setMine(boolean mine) {
        this.mine = mine;
    }

    public boolean isRevealed() {
        return revealed;
    }

    public void setRevealed(boolean revealed) {
        this.revealed = revealed;
    }

    public boolean isFlagged() {
        return flagged;
    }

    public void setFlagged(boolean flagged) {
        this.flagged = flagged;
    }

    public int getAdjacentMines() {
        return adjacentMines;
    }

    public void setAdjacentMines(int adjacentMines) {
        this.adjacentMines = adjacentMines;
    }

    public char displayChar() {
        if (!revealed) {
            return flagged ? 'F' : '.';
        }
        if (mine) {
            return '*';
        }
        if (adjacentMines == 0) {
            return ' ';
        }
        return (char) ('0' + adjacentMines);
    }
}

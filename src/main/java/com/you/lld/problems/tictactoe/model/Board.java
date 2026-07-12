package com.you.lld.problems.tictactoe.model;

import java.util.ArrayList;
import java.util.List;

public class Board {

    public static final int SIZE = 3;
    public static final int WIN_LENGTH = 3;

    private final Player[][] grid;

    public Board() {
        this.grid = new Player[SIZE][SIZE];
    }

    public boolean isValidMove(Position pos) {
        return inBounds(pos) && grid[pos.getRow()][pos.getCol()] == null;
    }

    public void place(Position pos, Player player) {
        if (!isValidMove(pos)) {
            throw new IllegalStateException("Invalid move: " + pos);
        }
        grid[pos.getRow()][pos.getCol()] = player;
    }

    public void clear(Position pos) {
        if (inBounds(pos)) {
            grid[pos.getRow()][pos.getCol()] = null;
        }
    }

    public Player get(Position pos) {
        return inBounds(pos) ? grid[pos.getRow()][pos.getCol()] : null;
    }

    public boolean isFull() {
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                if (grid[r][c] == null) {
                    return false;
                }
            }
        }
        return true;
    }

    public List<Position> emptyPositions() {
        List<Position> empty = new ArrayList<>();
        for (int r = 0; r < SIZE; r++) {
            for (int c = 0; c < SIZE; c++) {
                if (grid[r][c] == null) {
                    empty.add(new Position(r, c));
                }
            }
        }
        return empty;
    }

    private boolean inBounds(Position pos) {
        return pos.getRow() >= 0 && pos.getRow() < SIZE
            && pos.getCol() >= 0 && pos.getCol() < SIZE;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("-------------\n");
        for (int r = 0; r < SIZE; r++) {
            sb.append("| ");
            for (int c = 0; c < SIZE; c++) {
                Player p = grid[r][c];
                sb.append(p == null ? " " : p.getSymbol()).append(" | ");
            }
            sb.append("\n-------------\n");
        }
        return sb.toString();
    }
}

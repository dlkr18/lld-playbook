package com.you.lld.problems.minesweeper.model;

import java.util.ArrayDeque;
import java.util.Deque;

public final class Board {

    private final int rows;
    private final int cols;
    private final int mineCount;
    private final Cell[][] cells;
    private boolean minesPlaced;

    public Board(int rows, int cols, int mineCount) {
        if (mineCount >= rows * cols) {
            throw new IllegalArgumentException("too many mines for board size");
        }
        this.rows = rows;
        this.cols = cols;
        this.mineCount = mineCount;
        this.cells = new Cell[rows][cols];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                cells[r][c] = new Cell(r, c);
            }
        }
    }

    public int getRows() {
        return rows;
    }

    public int getCols() {
        return cols;
    }

    public int getMineCount() {
        return mineCount;
    }

    public boolean isMinesPlaced() {
        return minesPlaced;
    }

    public void setMinesPlaced(boolean minesPlaced) {
        this.minesPlaced = minesPlaced;
    }

    public Cell getCell(int row, int col) {
        return cells[row][col];
    }

    public void computeAdjacentCounts() {
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (cells[r][c].isMine()) {
                    continue;
                }
                int count = 0;
                for (int dr = -1; dr <= 1; dr++) {
                    for (int dc = -1; dc <= 1; dc++) {
                        if (dr == 0 && dc == 0) {
                            continue;
                        }
                        int nr = r + dr;
                        int nc = c + dc;
                        if (inBounds(nr, nc) && cells[nr][nc].isMine()) {
                            count++;
                        }
                    }
                }
                cells[r][c].setAdjacentMines(count);
            }
        }
    }

    public void revealBfs(int startRow, int startCol) {
        Deque<int[]> queue = new ArrayDeque<int[]>();
        queue.add(new int[] {startRow, startCol});
        while (!queue.isEmpty()) {
            int[] pos = queue.removeFirst();
            int r = pos[0];
            int c = pos[1];
            Cell cell = cells[r][c];
            if (cell.isRevealed() || cell.isFlagged()) {
                continue;
            }
            cell.setRevealed(true);
            if (cell.getAdjacentMines() == 0 && !cell.isMine()) {
                for (int dr = -1; dr <= 1; dr++) {
                    for (int dc = -1; dc <= 1; dc++) {
                        if (dr == 0 && dc == 0) {
                            continue;
                        }
                        int nr = r + dr;
                        int nc = c + dc;
                        if (inBounds(nr, nc) && !cells[nr][nc].isRevealed()) {
                            queue.addLast(new int[] {nr, nc});
                        }
                    }
                }
            }
        }
    }

    public void revealAllMines() {
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (cells[r][c].isMine()) {
                    cells[r][c].setRevealed(true);
                }
            }
        }
    }

    public int countRevealedSafeCells() {
        int count = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                Cell cell = cells[r][c];
                if (cell.isRevealed() && !cell.isMine()) {
                    count++;
                }
            }
        }
        return count;
    }

    public int totalSafeCells() {
        return rows * cols - mineCount;
    }

    public boolean inBounds(int row, int col) {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }

    public void print() {
        for (int r = 0; r < rows; r++) {
            StringBuilder line = new StringBuilder();
            for (int c = 0; c < cols; c++) {
                line.append(cells[r][c].displayChar()).append(' ');
            }
            System.out.println(line.toString());
        }
    }
}

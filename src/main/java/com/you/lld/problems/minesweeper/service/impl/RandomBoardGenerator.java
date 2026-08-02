package com.you.lld.problems.minesweeper.service.impl;

import com.you.lld.problems.minesweeper.model.Board;
import com.you.lld.problems.minesweeper.service.BoardGenerator;
import java.util.Random;

/**
 * Places mines after the first click, keeping the clicked cell <b>and its
 * neighbours</b> clear.
 *
 * <p>Excluding only the clicked cell satisfies the weak guarantee ("the first click
 * is never a mine") but not the one players actually expect: that the first click
 * <em>opens a region</em>. A cell is only a flood-fill seed when it has zero
 * adjacent mines, so leaving the neighbours minable meant the opening move revealed
 * a bare number 67% of the time on a 9x9/10 board.
 */
public final class RandomBoardGenerator implements BoardGenerator {

    private final Random random;

    public RandomBoardGenerator() {
        this.random = new Random();
    }

    /** Seeded, so a game can be replayed exactly — the only way to test this class. */
    public RandomBoardGenerator(long seed) {
        this.random = new Random(seed);
    }

    @Override
    public void placeMines(Board board, int safeRow, int safeCol) {
        int totalCells = board.getRows() * board.getCols();
        int protectedCells = countProtected(board, safeRow, safeCol);

        // A dense board may not leave room to keep all nine cells clear. Rather than
        // loop forever, fall back to protecting just the clicked cell — still never a
        // mine on the first click, just no guaranteed opening.
        boolean protectNeighbours = board.getMineCount() <= totalCells - protectedCells;

        int placed = 0;
        while (placed < board.getMineCount()) {
            int r = random.nextInt(board.getRows());
            int c = random.nextInt(board.getCols());
            if (board.getCell(r, c).isMine()) {
                continue;
            }
            boolean excluded = protectNeighbours
                    ? isWithinOne(r, c, safeRow, safeCol)
                    : (r == safeRow && c == safeCol);
            if (excluded) {
                continue;
            }
            board.getCell(r, c).setMine(true);
            placed++;
        }
        board.computeAdjacentCounts();
    }

    private static boolean isWithinOne(int r, int c, int row, int col) {
        return Math.abs(r - row) <= 1 && Math.abs(c - col) <= 1;
    }

    /** Size of the clipped 3x3 around the first click (smaller at an edge or corner). */
    private static int countProtected(Board board, int safeRow, int safeCol) {
        int count = 0;
        for (int dr = -1; dr <= 1; dr++) {
            for (int dc = -1; dc <= 1; dc++) {
                if (board.inBounds(safeRow + dr, safeCol + dc)) {
                    count++;
                }
            }
        }
        return count;
    }
}

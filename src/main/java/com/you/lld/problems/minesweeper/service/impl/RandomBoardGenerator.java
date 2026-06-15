package com.you.lld.problems.minesweeper.service.impl;

import com.you.lld.problems.minesweeper.model.Board;
import com.you.lld.problems.minesweeper.model.Cell;
import com.you.lld.problems.minesweeper.service.BoardGenerator;
import java.util.Random;

public final class RandomBoardGenerator implements BoardGenerator {

    private final Random random = new Random();

    @Override
    public void placeMines(Board board, int safeRow, int safeCol) {
        int placed = 0;
        while (placed < board.getMineCount()) {
            int r = random.nextInt(board.getRows());
            int c = random.nextInt(board.getCols());
            if ((r == safeRow && c == safeCol) || board.getCell(r, c).isMine()) {
                continue;
            }
            board.getCell(r, c).setMine(true);
            placed++;
        }
        board.computeAdjacentCounts();
    }
}

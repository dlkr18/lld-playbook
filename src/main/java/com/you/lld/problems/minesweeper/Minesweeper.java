package com.you.lld.problems.minesweeper;

import com.you.lld.problems.minesweeper.model.Board;
import com.you.lld.problems.minesweeper.model.Difficulty;
import com.you.lld.problems.minesweeper.model.GameStatus;
import com.you.lld.problems.minesweeper.model.Cell;
import com.you.lld.problems.minesweeper.service.BoardGenerator;
import com.you.lld.problems.minesweeper.service.impl.RandomBoardGenerator;

public final class Minesweeper {

    private final Board board;
    private final BoardGenerator generator;
    private GameStatus status = GameStatus.IN_PROGRESS;

    public Minesweeper(int rows, int cols, int mines) {
        this(new Board(rows, cols, mines), new RandomBoardGenerator());
    }

    public Minesweeper(Difficulty difficulty) {
        this(difficulty.getRows(), difficulty.getCols(), difficulty.getMines());
    }

    Minesweeper(Board board, BoardGenerator generator) {
        this.board = board;
        this.generator = generator;
    }

    public GameStatus getStatus() {
        return status;
    }

    public Board getBoard() {
        return board;
    }

    public boolean reveal(int row, int col) {
        if (status != GameStatus.IN_PROGRESS) {
            return false;
        }
        if (!board.inBounds(row, col)) {
            throw new IllegalArgumentException("out of bounds");
        }
        Cell cell = board.getCell(row, col);
        if (cell.isFlagged() || cell.isRevealed()) {
            return false;
        }

        if (!board.isMinesPlaced()) {
            generator.placeMines(board, row, col);
            board.setMinesPlaced(true);
        }

        if (cell.isMine()) {
            cell.setRevealed(true);
            board.revealAllMines();
            status = GameStatus.LOST;
            return false;
        }

        board.revealBfs(row, col);
        if (board.countRevealedSafeCells() == board.totalSafeCells()) {
            status = GameStatus.WON;
        }
        return true;
    }

    public boolean toggleFlag(int row, int col) {
        if (status != GameStatus.IN_PROGRESS) {
            return false;
        }
        Cell cell = board.getCell(row, col);
        if (cell.isRevealed()) {
            return false;
        }
        cell.setFlagged(!cell.isFlagged());
        return true;
    }
}

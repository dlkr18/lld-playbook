package com.you.lld.problems.tictactoe;

/**
 * Validates moves and game state for TicTacToe.
 */
public class GameValidator {
    public static boolean isValidMove(Board board, int row, int col) {
        if (row < 0 || row >= Board.SIZE || col < 0 || col >= Board.SIZE) {
            return false;
        }
        Position pos = new Position(row, col);
        return board.isValidMove(pos);
    }

    public static boolean isGameOver(Board board) {
        return board.getWinner().isPresent() || board.isFull();
    }
}

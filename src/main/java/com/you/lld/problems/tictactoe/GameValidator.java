package com.you.lld.problems.tictactoe;

public class GameValidator {
    public static boolean isValidMove(Board board, int row, int col) {
        if (row < 0 || row >= 3 || col < 0 || col >= 3) {
            return false;
        }
        return true;
    }
}

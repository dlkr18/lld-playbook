package com.you.lld.problems.tictactoe;

import java.util.Optional;

/**
 * Utility class for checking win/draw conditions on a TicTacToe board.
 * Delegates to Board's built-in getWinner() and isFull() methods.
 */
public class WinChecker {
    public static boolean checkWin(Board board, Player player) {
        Optional<Player> winner = board.getWinner();
        return winner.isPresent() && winner.get() == player;
    }
    
    public static boolean checkDraw(Board board) {
        return board.isFull() && !board.getWinner().isPresent();
    }
}

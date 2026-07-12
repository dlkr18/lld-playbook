package com.you.lld.problems.tictactoe.service;

import com.you.lld.problems.tictactoe.model.Board;
import com.you.lld.problems.tictactoe.model.Player;
import com.you.lld.problems.tictactoe.model.Position;

import java.util.Optional;

/**
 * O(1) win detection — increment row/col/diagonal counters per move instead of scanning the board.
 */
public class WinChecker {

    private final int[] rowX = new int[Board.SIZE];
    private final int[] rowO = new int[Board.SIZE];
    private final int[] colX = new int[Board.SIZE];
    private final int[] colO = new int[Board.SIZE];
    private int diagX;
    private int diagO;
    private int antiDiagX;
    private int antiDiagO;
    private int movesPlayed;

    public Optional<Player> registerMove(Position pos, Player player) {
        movesPlayed++;
        int r = pos.getRow();
        int c = pos.getCol();

        if (player == Player.X) {
            if (++rowX[r] == Board.WIN_LENGTH) return Optional.of(Player.X);
            if (++colX[c] == Board.WIN_LENGTH) return Optional.of(Player.X);
            if (r == c && ++diagX == Board.WIN_LENGTH) return Optional.of(Player.X);
            if (r + c == Board.SIZE - 1 && ++antiDiagX == Board.WIN_LENGTH) return Optional.of(Player.X);
        } else {
            if (++rowO[r] == Board.WIN_LENGTH) return Optional.of(Player.O);
            if (++colO[c] == Board.WIN_LENGTH) return Optional.of(Player.O);
            if (r == c && ++diagO == Board.WIN_LENGTH) return Optional.of(Player.O);
            if (r + c == Board.SIZE - 1 && ++antiDiagO == Board.WIN_LENGTH) return Optional.of(Player.O);
        }
        return Optional.empty();
    }

    public void unregisterMove(Position pos, Player player) {
        movesPlayed--;
        int r = pos.getRow();
        int c = pos.getCol();
        if (player == Player.X) {
            rowX[r]--;
            colX[c]--;
            if (r == c) diagX--;
            if (r + c == Board.SIZE - 1) antiDiagX--;
        } else {
            rowO[r]--;
            colO[c]--;
            if (r == c) diagO--;
            if (r + c == Board.SIZE - 1) antiDiagO--;
        }
    }

    public int getMovesPlayed() {
        return movesPlayed;
    }

    public void reset() {
        for (int i = 0; i < Board.SIZE; i++) {
            rowX[i] = 0;
            rowO[i] = 0;
            colX[i] = 0;
            colO[i] = 0;
        }
        diagX = diagO = antiDiagX = antiDiagO = 0;
        movesPlayed = 0;
    }
}

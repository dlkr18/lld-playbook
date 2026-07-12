package com.you.lld.problems.tictactoe.model;

public final class MoveResult {

    private final boolean valid;
    private final String message;
    private final GamePhase phase;
    private final Player nextPlayer;
    private final Player winner;

    private MoveResult(boolean valid, String message, GamePhase phase, Player nextPlayer, Player winner) {
        this.valid = valid;
        this.message = message;
        this.phase = phase;
        this.nextPlayer = nextPlayer;
        this.winner = winner;
    }

    public static MoveResult success(Player nextPlayer) {
        return new MoveResult(true, "Move successful", GamePhase.IN_PROGRESS, nextPlayer, null);
    }

    public static MoveResult gameOver(GamePhase phase, Player winner) {
        String msg = winner != null ? winner + " wins!" : "Draw!";
        return new MoveResult(true, msg, phase, null, winner);
    }

    public static MoveResult error(String message) {
        return new MoveResult(false, message, null, null, null);
    }

    public boolean isValid() {
        return valid;
    }

    public String getMessage() {
        return message;
    }

    public GamePhase getPhase() {
        return phase;
    }

    public Player getNextPlayer() {
        return nextPlayer;
    }

    public Player getWinner() {
        return winner;
    }

    public boolean isGameOver() {
        return phase == GamePhase.X_WON || phase == GamePhase.O_WON || phase == GamePhase.DRAW;
    }
}

package com.you.lld.problems.tictactoe;

import com.you.lld.problems.tictactoe.command.MoveHistory;
import com.you.lld.problems.tictactoe.model.Board;
import com.you.lld.problems.tictactoe.model.GamePhase;
import com.you.lld.problems.tictactoe.model.Move;
import com.you.lld.problems.tictactoe.model.MoveResult;
import com.you.lld.problems.tictactoe.model.Player;
import com.you.lld.problems.tictactoe.model.Position;
import com.you.lld.problems.tictactoe.service.WinChecker;
import com.you.lld.problems.tictactoe.state.GameState;
import com.you.lld.problems.tictactoe.state.NotStartedState;

import java.util.Collections;
import java.util.List;

public class TicTacToe {

    private Board board;
    private Player currentPlayer;
    private GamePhase phase;
    private GameState state;
    private final WinChecker winChecker;
    private final MoveHistory moveHistory;

    public TicTacToe() {
        this.board = new Board();
        this.currentPlayer = Player.X;
        this.phase = GamePhase.NOT_STARTED;
        this.state = new NotStartedState();
        this.winChecker = new WinChecker();
        this.moveHistory = new MoveHistory();
    }

    public void start() {
        state.start(this);
    }

    public MoveResult makeMove(Position position) {
        return state.makeMove(this, position);
    }

    public MoveResult makeMove(String notation) {
        try {
            return makeMove(Position.fromNotation(notation));
        } catch (IllegalArgumentException e) {
            return MoveResult.error("Invalid notation: " + notation);
        }
    }

    public boolean undo() {
        return moveHistory.undo(this);
    }

    public List<Position> getLegalMoves() {
        if (phase != GamePhase.IN_PROGRESS) {
            return Collections.emptyList();
        }
        return board.emptyPositions();
    }

    public void reset() {
        resetBoard();
        phase = GamePhase.NOT_STARTED;
        state = new NotStartedState();
    }

    // Hooks for state objects in subpackages

    public void resetBoard() {
        board = new Board();
        currentPlayer = Player.X;
        winChecker.reset();
        moveHistory.clear();
    }

    public void recordMove(Move move) {
        moveHistory.push(move);
    }

    public void switchPlayer() {
        currentPlayer = currentPlayer.opponent();
    }

    public void setPhase(GamePhase phase) {
        this.phase = phase;
    }

    public void setState(GameState state) {
        this.state = state;
    }

    public void setCurrentPlayer(Player player) {
        this.currentPlayer = player;
    }

    public Board getBoard() {
        return board;
    }

    public Player getCurrentPlayer() {
        return currentPlayer;
    }

    public GamePhase getPhase() {
        return phase;
    }

    public WinChecker getWinChecker() {
        return winChecker;
    }

    public int getMoveCount() {
        return moveHistory.size();
    }

    public boolean isGameOver() {
        return phase == GamePhase.X_WON || phase == GamePhase.O_WON || phase == GamePhase.DRAW;
    }
}

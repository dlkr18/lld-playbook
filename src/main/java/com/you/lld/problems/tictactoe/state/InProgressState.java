package com.you.lld.problems.tictactoe.state;

import com.you.lld.problems.tictactoe.TicTacToe;
import com.you.lld.problems.tictactoe.model.GamePhase;
import com.you.lld.problems.tictactoe.model.Move;
import com.you.lld.problems.tictactoe.model.MoveResult;
import com.you.lld.problems.tictactoe.model.Player;
import com.you.lld.problems.tictactoe.model.Position;

import java.util.Optional;

public class InProgressState implements GameState {

    @Override
    public MoveResult makeMove(TicTacToe game, Position position) {
        if (!game.getBoard().isValidMove(position)) {
            return MoveResult.error("Invalid move: " + position);
        }

        Player current = game.getCurrentPlayer();
        game.getBoard().place(position, current);
        game.recordMove(new Move(current, position));

        Optional<Player> winner = game.getWinChecker().registerMove(position, current);
        if (winner.isPresent()) {
            GamePhase phase = winner.get() == Player.X ? GamePhase.X_WON : GamePhase.O_WON;
            game.setPhase(phase);
            game.setState(new FinishedState());
            return MoveResult.gameOver(phase, winner.get());
        }
        if (game.getBoard().isFull()) {
            game.setPhase(GamePhase.DRAW);
            game.setState(new FinishedState());
            return MoveResult.gameOver(GamePhase.DRAW, null);
        }
        game.switchPlayer();
        return MoveResult.success(game.getCurrentPlayer());
    }

    @Override
    public void start(TicTacToe game) {
        game.resetBoard();
    }
}

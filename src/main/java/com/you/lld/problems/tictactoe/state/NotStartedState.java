package com.you.lld.problems.tictactoe.state;

import com.you.lld.problems.tictactoe.TicTacToe;
import com.you.lld.problems.tictactoe.model.GamePhase;
import com.you.lld.problems.tictactoe.model.MoveResult;

public class NotStartedState implements GameState {

    @Override
    public MoveResult makeMove(TicTacToe game, com.you.lld.problems.tictactoe.model.Position position) {
        return MoveResult.error("Game not started. Call start() first.");
    }

    @Override
    public void start(TicTacToe game) {
        game.resetBoard();
        game.setPhase(GamePhase.IN_PROGRESS);
        game.setState(new InProgressState());
    }
}

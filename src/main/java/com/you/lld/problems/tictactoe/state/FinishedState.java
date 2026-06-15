package com.you.lld.problems.tictactoe.state;

import com.you.lld.problems.tictactoe.TicTacToe;
import com.you.lld.problems.tictactoe.model.MoveResult;
import com.you.lld.problems.tictactoe.model.Position;

public class FinishedState implements GameState {

    @Override
    public MoveResult makeMove(TicTacToe game, Position position) {
        return MoveResult.error("Game is over. Phase: " + game.getPhase());
    }

    @Override
    public void start(TicTacToe game) {
        game.resetBoard();
        game.setPhase(com.you.lld.problems.tictactoe.model.GamePhase.IN_PROGRESS);
        game.setState(new InProgressState());
    }
}

package com.you.lld.problems.tictactoe.state;

import com.you.lld.problems.tictactoe.TicTacToe;
import com.you.lld.problems.tictactoe.model.MoveResult;
import com.you.lld.problems.tictactoe.model.Position;

public interface GameState {

    MoveResult makeMove(TicTacToe game, Position position);

    void start(TicTacToe game);
}

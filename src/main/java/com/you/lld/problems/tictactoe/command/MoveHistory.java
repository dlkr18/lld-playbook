package com.you.lld.problems.tictactoe.command;

import com.you.lld.problems.tictactoe.TicTacToe;
import com.you.lld.problems.tictactoe.model.Move;

import java.util.ArrayDeque;
import java.util.Deque;

/** Command pattern — stack of moves for O(1) undo. */
public class MoveHistory {

    private final Deque<Move> stack = new ArrayDeque<>();

    public void push(Move move) {
        stack.push(move);
    }

    public boolean undo(TicTacToe game) {
        if (stack.isEmpty()) {
            return false;
        }
        Move last = stack.pop();
        game.getBoard().clear(last.getPosition());
        game.getWinChecker().unregisterMove(last.getPosition(), last.getPlayer());
        game.setCurrentPlayer(last.getPlayer());
        if (game.getPhase() != com.you.lld.problems.tictactoe.model.GamePhase.IN_PROGRESS) {
            game.setPhase(com.you.lld.problems.tictactoe.model.GamePhase.IN_PROGRESS);
            game.setState(new com.you.lld.problems.tictactoe.state.InProgressState());
        }
        return true;
    }

    public void clear() {
        stack.clear();
    }

    public int size() {
        return stack.size();
    }
}

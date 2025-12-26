package com.you.lld.problems.tictactoe;

public interface AIStrategy {
    Move getNextMove(Board board, Player player);
}

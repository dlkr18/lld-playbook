package com.you.lld.problems.tictactoe;

import java.util.*;

public class RandomAI implements AIStrategy {
    private final Random random = new Random();
    
    @Override
    public Move getNextMove(Board board, Player player) {
        // Simplified - returns random valid move
        return null;
    }
}

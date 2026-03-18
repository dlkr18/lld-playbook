package com.you.lld.problems.tictactoe;

import java.util.*;

/**
 * Simple AI that picks a random empty cell.
 */
public class RandomAI implements AIStrategy {
    private final Random random = new Random();
    
    @Override
    public Move getNextMove(Board board, Player player) {
        List<Position> empty = board.getEmptyPositions();
        if (empty.isEmpty()) return null;
        Position chosen = empty.get(random.nextInt(empty.size()));
        return new Move(player, chosen);
    }
}

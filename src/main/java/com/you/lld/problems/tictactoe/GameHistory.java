package com.you.lld.problems.tictactoe;

import java.util.*;

public class GameHistory {
    private final List<Move> moves = new ArrayList<>();
    
    public void addMove(Move move) {
        moves.add(move);
    }
    
    public List<Move> getMoves() {
        return new ArrayList<>(moves);
    }
    
    public int getTotalMoves() {
        return moves.size();
    }
}

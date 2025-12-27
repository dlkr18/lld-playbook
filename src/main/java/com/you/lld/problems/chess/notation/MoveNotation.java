package com.you.lld.problems.chess.notation;

import com.you.lld.problems.chess.model.*;

public class MoveNotation {
    public static String toAlgebraic(Position from, Position to) {
        return positionToString(from) + positionToString(to);
    }
    
    private static String positionToString(Position pos) {
        char file = (char) ('a' + pos.getCol());
        int rank = 8 - pos.getRow();
        return "" + file + rank;
    }
}

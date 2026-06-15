package com.you.lld.problems.chess.service.impl;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Position;
import com.you.lld.problems.chess.service.MoveStrategy;

public class RookMoveStrategy implements MoveStrategy {
    @Override
    public boolean canMove(Board board, Position from, Position to) {
        int dr = to.getRow() - from.getRow();
        int dc = to.getCol() - from.getCol();
        if (dr != 0 && dc != 0) {
            return false;
        }
        return board.isPathClear(from, to);
    }
}

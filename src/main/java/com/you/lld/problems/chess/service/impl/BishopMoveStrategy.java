package com.you.lld.problems.chess.service.impl;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Position;
import com.you.lld.problems.chess.service.MoveStrategy;

public class BishopMoveStrategy implements MoveStrategy {
    @Override
    public boolean canMove(Board board, Position from, Position to) {
        int absDr = Math.abs(to.getRow() - from.getRow());
        int absDc = Math.abs(to.getCol() - from.getCol());
        if (absDr != absDc) {
            return false;
        }
        return board.isPathClear(from, to);
    }
}

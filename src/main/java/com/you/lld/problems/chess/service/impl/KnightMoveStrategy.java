package com.you.lld.problems.chess.service.impl;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Position;
import com.you.lld.problems.chess.service.MoveStrategy;

public class KnightMoveStrategy implements MoveStrategy {
    @Override
    public boolean canMove(Board board, Position from, Position to) {
        int absDr = Math.abs(to.getRow() - from.getRow());
        int absDc = Math.abs(to.getCol() - from.getCol());
        return (absDr == 2 && absDc == 1) || (absDr == 1 && absDc == 2);
    }
}

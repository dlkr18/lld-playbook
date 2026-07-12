package com.you.lld.problems.chess.service.impl;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Position;
import com.you.lld.problems.chess.service.MoveStrategy;

public class QueenMoveStrategy implements MoveStrategy {
    private final RookMoveStrategy rook = new RookMoveStrategy();
    private final BishopMoveStrategy bishop = new BishopMoveStrategy();

    @Override
    public boolean canMove(Board board, Position from, Position to) {
        return rook.canMove(board, from, to) || bishop.canMove(board, from, to);
    }
}

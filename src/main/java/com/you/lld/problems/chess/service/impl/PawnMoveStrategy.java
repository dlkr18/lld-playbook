package com.you.lld.problems.chess.service.impl;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Color;
import com.you.lld.problems.chess.model.Piece;
import com.you.lld.problems.chess.model.Position;
import com.you.lld.problems.chess.service.MoveStrategy;

public class PawnMoveStrategy implements MoveStrategy {
    @Override
    public boolean canMove(Board board, Position from, Position to) {
        Piece piece = board.getPiece(from);
        if (piece == null) {
            return false;
        }
        int dr = to.getRow() - from.getRow();
        int dc = to.getCol() - from.getCol();
        int absDr = Math.abs(dr);
        int absDc = Math.abs(dc);
        int direction = piece.getColor() == Color.WHITE ? -1 : 1;
        boolean isCapture = board.getPiece(to) != null;

        if (dc == 0 && !isCapture) {
            if (dr == direction) {
                return true;
            }
            int startRow = piece.getColor() == Color.WHITE ? 6 : 1;
            if (from.getRow() == startRow && dr == 2 * direction) {
                Position mid = new Position(from.getRow() + direction, from.getCol());
                return board.getPiece(mid) == null;
            }
        }
        return absDc == 1 && dr == direction && isCapture;
    }
}

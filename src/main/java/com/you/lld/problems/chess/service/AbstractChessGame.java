package com.you.lld.problems.chess.service;

import com.you.lld.problems.chess.model.Board;
import com.you.lld.problems.chess.model.Color;
import com.you.lld.problems.chess.model.Piece;
import com.you.lld.problems.chess.model.Position;
import com.you.lld.problems.chess.service.impl.MoveStrategyFactory;

/**
 * Template Method — fixed game flow; subclasses may hook post-move evaluation.
 */
public abstract class AbstractChessGame implements ChessGame {
    protected Board board;
    protected Color currentPlayer;
    protected boolean gameOver;

    protected AbstractChessGame() {
        this.board = Board.initial();
        this.currentPlayer = Color.WHITE;
        this.gameOver = false;
    }

    @Override
    public final synchronized boolean makeMove(Position from, Position to) {
        if (gameOver || !isValidMove(from, to)) {
            return false;
        }
        board = board.withMove(from, to);
        currentPlayer = currentPlayer == Color.WHITE ? Color.BLACK : Color.WHITE;
        evaluateAfterMove();
        return true;
    }

    protected void evaluateAfterMove() {
        if (isInCheck(currentPlayer)) {
            if (!hasAnyLegalMove(currentPlayer)) {
                gameOver = true;
                onCheckmate(currentPlayer);
            } else {
                onCheck(currentPlayer);
            }
        }
    }

    protected abstract void onCheck(Color playerInCheck);

    protected abstract void onCheckmate(Color playerInCheck);

    @Override
    public boolean isValidMove(Position from, Position to) {
        if (!from.isValid() || !to.isValid() || from.equals(to)) {
            return false;
        }
        Piece piece = board.getPiece(from);
        if (piece == null || piece.getColor() != currentPlayer) {
            return false;
        }
        Piece target = board.getPiece(to);
        if (target != null && target.getColor() == currentPlayer) {
            return false;
        }
        if (!MoveStrategyFactory.forType(piece.getType()).canMove(board, from, to)) {
            return false;
        }
        return !wouldLeaveInCheck(from, to, currentPlayer);
    }

    public boolean isInCheck(Color color) {
        Position kingPos = board.findKing(color);
        if (kingPos == null) {
            return false;
        }
        Color opponent = color == Color.WHITE ? Color.BLACK : Color.WHITE;
        return isSquareAttackedBy(kingPos, opponent);
    }

    private boolean isSquareAttackedBy(Position target, Color attackerColor) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Position pos = new Position(r, c);
                Piece piece = board.getPiece(pos);
                if (piece != null && piece.getColor() == attackerColor) {
                    if (MoveStrategyFactory.forType(piece.getType()).canMove(board, pos, target)) {
                        Piece targetPiece = board.getPiece(target);
                        if (targetPiece == null || targetPiece.getColor() != attackerColor) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    private boolean wouldLeaveInCheck(Position from, Position to, Color color) {
        Board next = board.withMove(from, to);
        Position kingPos = next.findKing(color);
        if (kingPos == null) {
            return true;
        }
        Color opponent = color == Color.WHITE ? Color.BLACK : Color.WHITE;
        return isSquareAttackedOnBoard(next, kingPos, opponent);
    }

    private boolean isSquareAttackedOnBoard(Board snapshot, Position target, Color attackerColor) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Position pos = new Position(r, c);
                Piece piece = snapshot.getPiece(pos);
                if (piece != null && piece.getColor() == attackerColor) {
                    if (MoveStrategyFactory.forType(piece.getType()).canMove(snapshot, pos, target)) {
                        Piece targetPiece = snapshot.getPiece(target);
                        if (targetPiece == null || targetPiece.getColor() != attackerColor) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    private boolean hasAnyLegalMove(Color color) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Piece piece = board.getPiece(new Position(r, c));
                if (piece != null && piece.getColor() == color) {
                    for (int tr = 0; tr < 8; tr++) {
                        for (int tc = 0; tc < 8; tc++) {
                            Position from = new Position(r, c);
                            Position to = new Position(tr, tc);
                            Color saved = currentPlayer;
                            currentPlayer = color;
                            boolean legal = isValidMove(from, to);
                            currentPlayer = saved;
                            if (legal) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    @Override
    public Color getCurrentPlayer() {
        return currentPlayer;
    }

    @Override
    public boolean isGameOver() {
        return gameOver;
    }

    @Override
    public Board getBoard() {
        return board;
    }
}

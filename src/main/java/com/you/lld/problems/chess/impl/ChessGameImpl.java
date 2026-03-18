package com.you.lld.problems.chess.impl;

import com.you.lld.problems.chess.api.ChessGame;
import com.you.lld.problems.chess.model.*;

/**
 * Chess game with piece-specific move validation and basic check detection.
 * Thread-safe: all state-mutating methods are synchronized.
 */
public class ChessGameImpl implements ChessGame {
    private final Board board;
    private Color currentPlayer;
    private boolean gameOver;

    public ChessGameImpl() {
        this.board = new Board();
        this.board.initialize();
        this.currentPlayer = Color.WHITE;
        this.gameOver = false;
    }

    @Override
    public synchronized boolean makeMove(Position from, Position to) {
        if (gameOver || !isValidMove(from, to)) {
            return false;
        }

        board.movePiece(from, to);
        currentPlayer = (currentPlayer == Color.WHITE) ? Color.BLACK : Color.WHITE;

        // Check if opponent is in check/checkmate
        if (isInCheck(currentPlayer)) {
            if (!hasAnyLegalMove(currentPlayer)) {
                gameOver = true;
                System.out.println("Checkmate! " +
                    (currentPlayer == Color.WHITE ? "Black" : "White") + " wins!");
            } else {
                System.out.println(currentPlayer + " is in check!");
            }
        }
        return true;
    }

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
            return false; // Can't capture own piece
        }

        // Piece-specific movement validation
        if (!isValidPieceMove(piece, from, to)) {
            return false;
        }

        // Ensure move doesn't leave own king in check
        return !wouldLeaveInCheck(from, to, currentPlayer);
    }

    private boolean isValidPieceMove(Piece piece, Position from, Position to) {
        int dr = to.getRow() - from.getRow();
        int dc = to.getCol() - from.getCol();
        int absDr = Math.abs(dr);
        int absDc = Math.abs(dc);

        switch (piece.getType()) {
            case PAWN:
                return isValidPawnMove(piece, from, to, dr, dc, absDr, absDc);
            case ROOK:
                return isValidRookMove(from, to, dr, dc);
            case KNIGHT:
                return (absDr == 2 && absDc == 1) || (absDr == 1 && absDc == 2);
            case BISHOP:
                return isValidBishopMove(from, to, absDr, absDc);
            case QUEEN:
                return isValidRookMove(from, to, dr, dc) || isValidBishopMove(from, to, absDr, absDc);
            case KING:
                return absDr <= 1 && absDc <= 1;
            default:
                return false;
        }
    }

    private boolean isValidPawnMove(Piece piece, Position from, Position to,
                                    int dr, int dc, int absDr, int absDc) {
        int direction = (piece.getColor() == Color.WHITE) ? -1 : 1; // White moves up (decreasing row)
        boolean isCapture = board.getPiece(to) != null;

        // Normal move forward
        if (dc == 0 && !isCapture) {
            if (dr == direction) return true;
            // Two-square initial move
            int startRow = (piece.getColor() == Color.WHITE) ? 6 : 1;
            if (from.getRow() == startRow && dr == 2 * direction) {
                // Check path is clear
                Position mid = new Position(from.getRow() + direction, from.getCol());
                return board.getPiece(mid) == null;
            }
        }

        // Diagonal capture
        if (absDc == 1 && dr == direction && isCapture) {
            return true;
        }

        return false;
    }

    private boolean isValidRookMove(Position from, Position to, int dr, int dc) {
        if (dr != 0 && dc != 0) return false; // Must be along rank or file
        return isPathClear(from, to);
    }

    private boolean isValidBishopMove(Position from, Position to, int absDr, int absDc) {
        if (absDr != absDc) return false; // Must be diagonal
        return isPathClear(from, to);
    }

    /** Check that all squares between from and to are empty. */
    private boolean isPathClear(Position from, Position to) {
        int dr = Integer.signum(to.getRow() - from.getRow());
        int dc = Integer.signum(to.getCol() - from.getCol());

        int r = from.getRow() + dr;
        int c = from.getCol() + dc;
        while (r != to.getRow() || c != to.getCol()) {
            if (board.getPiece(new Position(r, c)) != null) return false;
            r += dr;
            c += dc;
        }
        return true;
    }

    /** Check if the given color's king is currently in check. */
    public boolean isInCheck(Color color) {
        Position kingPos = findKing(color);
        if (kingPos == null) return false;
        Color opponent = (color == Color.WHITE) ? Color.BLACK : Color.WHITE;
        return isSquareAttackedBy(kingPos, opponent);
    }

    /** Check if any piece of attackerColor attacks the given square. */
    private boolean isSquareAttackedBy(Position target, Color attackerColor) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Position pos = new Position(r, c);
                Piece piece = board.getPiece(pos);
                if (piece != null && piece.getColor() == attackerColor) {
                    if (isValidPieceMove(piece, pos, target)) {
                        // Also need to check the target isn't own color for the attacker
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

    private Position findKing(Color color) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Piece piece = board.getPiece(new Position(r, c));
                if (piece != null && piece.getType() == PieceType.KING && piece.getColor() == color) {
                    return new Position(r, c);
                }
            }
        }
        return null;
    }

    /** Simulate a move and check if it leaves the player's king in check. */
    private boolean wouldLeaveInCheck(Position from, Position to, Color color) {
        Piece saved = board.getPiece(to);
        board.movePiece(from, to);
        boolean inCheck = isInCheck(color);
        // Undo
        board.movePiece(to, from);
        board.setPiece(to, saved);
        return inCheck;
    }

    /** Check if the given color has any legal move (for checkmate detection). */
    private boolean hasAnyLegalMove(Color color) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Piece piece = board.getPiece(new Position(r, c));
                if (piece != null && piece.getColor() == color) {
                    for (int tr = 0; tr < 8; tr++) {
                        for (int tc = 0; tc < 8; tc++) {
                            Position from = new Position(r, c);
                            Position to = new Position(tr, tc);
                            if (from.equals(to)) continue;
                            Piece target = board.getPiece(to);
                            if (target != null && target.getColor() == color) continue;
                            if (isValidPieceMove(piece, from, to)
                                    && !wouldLeaveInCheck(from, to, color)) {
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

    public Board getBoard() {
        return board;
    }
}

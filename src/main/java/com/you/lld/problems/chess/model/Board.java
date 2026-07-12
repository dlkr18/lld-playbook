package com.you.lld.problems.chess.model;

/**
 * Immutable 8x8 board. Every move returns a new {@link Board} instance.
 */
public final class Board {
    private final Piece[][] grid;

    public Board() {
        this.grid = new Piece[8][8];
    }

    private Board(Piece[][] grid) {
        this.grid = new Piece[8][8];
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                this.grid[r][c] = grid[r][c];
            }
        }
    }

    public static Board initial() {
        Board board = new Board();
        for (int i = 0; i < 8; i++) {
            board.grid[1][i] = new Piece(PieceType.PAWN, Color.BLACK);
            board.grid[6][i] = new Piece(PieceType.PAWN, Color.WHITE);
        }
        board.grid[0][0] = new Piece(PieceType.ROOK, Color.BLACK);
        board.grid[0][7] = new Piece(PieceType.ROOK, Color.BLACK);
        board.grid[7][0] = new Piece(PieceType.ROOK, Color.WHITE);
        board.grid[7][7] = new Piece(PieceType.ROOK, Color.WHITE);
        board.grid[0][1] = new Piece(PieceType.KNIGHT, Color.BLACK);
        board.grid[0][6] = new Piece(PieceType.KNIGHT, Color.BLACK);
        board.grid[7][1] = new Piece(PieceType.KNIGHT, Color.WHITE);
        board.grid[7][6] = new Piece(PieceType.KNIGHT, Color.WHITE);
        board.grid[0][2] = new Piece(PieceType.BISHOP, Color.BLACK);
        board.grid[0][5] = new Piece(PieceType.BISHOP, Color.BLACK);
        board.grid[7][2] = new Piece(PieceType.BISHOP, Color.WHITE);
        board.grid[7][5] = new Piece(PieceType.BISHOP, Color.WHITE);
        board.grid[0][3] = new Piece(PieceType.QUEEN, Color.BLACK);
        board.grid[7][3] = new Piece(PieceType.QUEEN, Color.WHITE);
        board.grid[0][4] = new Piece(PieceType.KING, Color.BLACK);
        board.grid[7][4] = new Piece(PieceType.KING, Color.WHITE);
        return board;
    }

    public Piece getPiece(Position pos) {
        return grid[pos.getRow()][pos.getCol()];
    }

    public Board withMove(Position from, Position to) {
        Piece piece = getPiece(from);
        if (piece == null) {
            throw new IllegalArgumentException("No piece at " + from);
        }
        Piece[][] next = copyGrid();
        next[to.getRow()][to.getCol()] = piece.withMoved();
        next[from.getRow()][from.getCol()] = null;
        return new Board(next);
    }

    public boolean isPathClear(Position from, Position to) {
        int dr = Integer.signum(to.getRow() - from.getRow());
        int dc = Integer.signum(to.getCol() - from.getCol());
        int r = from.getRow() + dr;
        int c = from.getCol() + dc;
        while (r != to.getRow() || c != to.getCol()) {
            if (getPiece(new Position(r, c)) != null) {
                return false;
            }
            r += dr;
            c += dc;
        }
        return true;
    }

    public Position findKing(Color color) {
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                Piece piece = grid[r][c];
                if (piece != null && piece.getType() == PieceType.KING && piece.getColor() == color) {
                    return new Position(r, c);
                }
            }
        }
        return null;
    }

    private Piece[][] copyGrid() {
        Piece[][] copy = new Piece[8][8];
        for (int r = 0; r < 8; r++) {
            for (int c = 0; c < 8; c++) {
                copy[r][c] = grid[r][c];
            }
        }
        return copy;
    }
}

package com.you.lld.problems.chess.model;

public class Board {
    private final Piece[][] grid = new Piece[8][8];
    
    public void initialize() {
        // Pawns
        for (int i = 0; i < 8; i++) {
            grid[1][i] = new Piece(PieceType.PAWN, Color.BLACK);
            grid[6][i] = new Piece(PieceType.PAWN, Color.WHITE);
        }
        
        // Rooks
        grid[0][0] = new Piece(PieceType.ROOK, Color.BLACK);
        grid[0][7] = new Piece(PieceType.ROOK, Color.BLACK);
        grid[7][0] = new Piece(PieceType.ROOK, Color.WHITE);
        grid[7][7] = new Piece(PieceType.ROOK, Color.WHITE);
        
        // Knights
        grid[0][1] = new Piece(PieceType.KNIGHT, Color.BLACK);
        grid[0][6] = new Piece(PieceType.KNIGHT, Color.BLACK);
        grid[7][1] = new Piece(PieceType.KNIGHT, Color.WHITE);
        grid[7][6] = new Piece(PieceType.KNIGHT, Color.WHITE);
        
        // Bishops
        grid[0][2] = new Piece(PieceType.BISHOP, Color.BLACK);
        grid[0][5] = new Piece(PieceType.BISHOP, Color.BLACK);
        grid[7][2] = new Piece(PieceType.BISHOP, Color.WHITE);
        grid[7][5] = new Piece(PieceType.BISHOP, Color.WHITE);
        
        // Queens
        grid[0][3] = new Piece(PieceType.QUEEN, Color.BLACK);
        grid[7][3] = new Piece(PieceType.QUEEN, Color.WHITE);
        
        // Kings
        grid[0][4] = new Piece(PieceType.KING, Color.BLACK);
        grid[7][4] = new Piece(PieceType.KING, Color.WHITE);
    }
    
    public Piece getPiece(Position pos) {
        return grid[pos.getRow()][pos.getCol()];
    }
    
    public void setPiece(Position pos, Piece piece) {
        grid[pos.getRow()][pos.getCol()] = piece;
    }
    
    public void movePiece(Position from, Position to) {
        Piece piece = getPiece(from);
        setPiece(to, piece);
        setPiece(from, null);
        if (piece != null) {
            piece.setMoved();
        }
    }
}

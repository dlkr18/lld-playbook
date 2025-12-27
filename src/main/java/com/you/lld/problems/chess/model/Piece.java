package com.you.lld.problems.chess.model;

public class Piece {
    private final PieceType type;
    private final Color color;
    private boolean hasMoved;
    
    public Piece(PieceType type, Color color) {
        this.type = type;
        this.color = color;
        this.hasMoved = false;
    }
    
    public PieceType getType() { return type; }
    public Color getColor() { return color; }
    public boolean hasMoved() { return hasMoved; }
    
    public void setMoved() {
        this.hasMoved = true;
    }
    
    @Override
    public String toString() {
        return color + "_" + type;
    }
}

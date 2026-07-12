package com.you.lld.problems.chess.model;

/** Immutable chess piece. */
public final class Piece {
    private final PieceType type;
    private final Color color;
    private final boolean hasMoved;

    public Piece(PieceType type, Color color) {
        this(type, color, false);
    }

    private Piece(PieceType type, Color color, boolean hasMoved) {
        this.type = type;
        this.color = color;
        this.hasMoved = hasMoved;
    }

    public PieceType getType() {
        return type;
    }

    public Color getColor() {
        return color;
    }

    public boolean hasMoved() {
        return hasMoved;
    }

    public Piece withMoved() {
        if (hasMoved) {
            return this;
        }
        return new Piece(type, color, true);
    }

    @Override
    public String toString() {
        return color + "_" + type;
    }
}

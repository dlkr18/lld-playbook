package com.you.lld.problems.tictactoe.model;

public final class Position {

    private final int row;
    private final int col;

    public Position(int row, int col) {
        this.row = row;
        this.col = col;
    }

    public int getRow() {
        return row;
    }

    public int getCol() {
        return col;
    }

    public static Position fromNotation(String notation) {
        if (notation == null || notation.length() != 2) {
            throw new IllegalArgumentException("Invalid notation: " + notation);
        }
        int col = Character.toLowerCase(notation.charAt(0)) - 'a';
        int row = notation.charAt(1) - '1';
        if (col < 0 || col >= Board.SIZE || row < 0 || row >= Board.SIZE) {
            throw new IllegalArgumentException("Position out of bounds: " + notation);
        }
        return new Position(row, col);
    }

    public String toNotation() {
        return "" + (char) ('a' + col) + (char) ('1' + row);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof Position)) {
            return false;
        }
        Position other = (Position) obj;
        return row == other.row && col == other.col;
    }

    @Override
    public int hashCode() {
        return 31 * row + col;
    }

    @Override
    public String toString() {
        return toNotation();
    }
}

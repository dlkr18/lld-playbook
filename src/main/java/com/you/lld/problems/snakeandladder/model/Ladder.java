package com.you.lld.problems.snakeandladder.model;

/**
 * Represents a ladder on the board that moves a player up.
 */
public class Ladder {
    
    private final int bottom;
    private final int top;
    
    public Ladder(int bottom, int top) {
        if (top <= bottom) {
            throw new IllegalArgumentException("Ladder top must be greater than bottom");
        }
        if (bottom < 1 || top < 2) {
            throw new IllegalArgumentException("Invalid ladder position");
        }
        this.bottom = bottom;
        this.top = top;
    }
    
    public int getBottom() {
        return bottom;
    }
    
    public int getTop() {
        return top;
    }
    
    /**
     * Returns true if the player landed on this ladder's bottom.
     */
    public boolean hasBottom(int position) {
        return position == bottom;
    }
    
    /**
     * Returns the new position after climbing the ladder.
     */
    public int climb() {
        return top;
    }
    
    @Override
    public String toString() {
        return "Ladder{" + bottom + " → " + top + "}";
    }
}


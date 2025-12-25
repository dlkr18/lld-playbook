package com.you.lld.problems.snakeandladder.model;

/**
 * Represents a snake on the board that moves a player down.
 */
public class Snake {
    
    private final int head;
    private final int tail;
    
    public Snake(int head, int tail) {
        if (head <= tail) {
            throw new IllegalArgumentException("Snake head must be greater than tail");
        }
        if (head < 2 || tail < 1) {
            throw new IllegalArgumentException("Invalid snake position");
        }
        this.head = head;
        this.tail = tail;
    }
    
    public int getHead() {
        return head;
    }
    
    public int getTail() {
        return tail;
    }
    
    /**
     * Returns true if the player landed on this snake's head.
     */
    public boolean hasHead(int position) {
        return position == head;
    }
    
    /**
     * Returns the new position after sliding down the snake.
     */
    public int slide() {
        return tail;
    }
    
    @Override
    public String toString() {
        return "Snake{" + head + " → " + tail + "}";
    }
}


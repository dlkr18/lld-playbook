package com.you.lld.problems.snakeandladder.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Represents the game board with snakes and ladders.
 */
public class Board {
    
    private final int size;
    private final List<Snake> snakes;
    private final List<Ladder> ladders;
    
    private Board(Builder builder) {
        this.size = builder.size;
        this.snakes = new ArrayList<>(builder.snakes);
        this.ladders = new ArrayList<>(builder.ladders);
        validate();
    }
    
    private void validate() {
        // Validate all snakes and ladders are within board bounds
        for (Snake snake : snakes) {
            if (snake.getHead() > size || snake.getTail() < 1) {
                throw new IllegalArgumentException("Snake out of board bounds: " + snake);
            }
        }
        for (Ladder ladder : ladders) {
            if (ladder.getTop() > size || ladder.getBottom() < 1) {
                throw new IllegalArgumentException("Ladder out of board bounds: " + ladder);
            }
        }
    }
    
    public int getSize() {
        return size;
    }
    
    /**
     * Returns the final position after applying snakes and ladders.
     */
    public int getFinalPosition(int position) {
        // Check if landed on a snake
        for (Snake snake : snakes) {
            if (snake.hasHead(position)) {
                System.out.println("🐍 Snake! " + position + " → " + snake.getTail());
                return snake.slide();
            }
        }
        
        // Check if landed on a ladder
        for (Ladder ladder : ladders) {
            if (ladder.hasBottom(position)) {
                System.out.println("🪜 Ladder! " + position + " → " + ladder.getTop());
                return ladder.climb();
            }
        }
        
        // No snake or ladder
        return position;
    }
    
    /**
     * Returns true if the position is the winning position.
     */
    public boolean isWinning(int position) {
        return position >= size;
    }
    
    public static Builder builder(int size) {
        return new Builder(size);
    }
    
    public static class Builder {
        private final int size;
        private final List<Snake> snakes = new ArrayList<>();
        private final List<Ladder> ladders = new ArrayList<>();
        
        public Builder(int size) {
            if (size < 10) {
                throw new IllegalArgumentException("Board size must be at least 10");
            }
            this.size = size;
        }
        
        public Builder addSnake(int head, int tail) {
            snakes.add(new Snake(head, tail));
            return this;
        }
        
        public Builder addLadder(int bottom, int top) {
            ladders.add(new Ladder(bottom, top));
            return this;
        }
        
        public Board build() {
            return new Board(this);
        }
    }
    
    @Override
    public String toString() {
        return "Board{size=" + size + ", snakes=" + snakes.size() + 
               ", ladders=" + ladders.size() + "}";
    }
}


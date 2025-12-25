package com.you.lld.problems.snakeandladder.model;

import java.util.Random;

/**
 * Represents a dice that can be rolled.
 */
public class Dice {
    
    private final int faces;
    private final Random random;
    
    /**
     * Creates a standard 6-sided dice.
     */
    public Dice() {
        this(6);
    }
    
    /**
     * Creates a dice with specified number of faces.
     */
    public Dice(int faces) {
        if (faces < 1) {
            throw new IllegalArgumentException("Dice must have at least 1 face");
        }
        this.faces = faces;
        this.random = new Random();
    }
    
    /**
     * Rolls the dice and returns a value between 1 and faces (inclusive).
     */
    public int roll() {
        return random.nextInt(faces) + 1;
    }
    
    public int getFaces() {
        return faces;
    }
    
    @Override
    public String toString() {
        return "Dice{faces=" + faces + "}";
    }
}


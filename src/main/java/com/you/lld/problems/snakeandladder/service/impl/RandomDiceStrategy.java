package com.you.lld.problems.snakeandladder.service.impl;

import com.you.lld.problems.snakeandladder.service.DiceStrategy;

import java.util.Random;

public class RandomDiceStrategy implements DiceStrategy {

    private final int sides;
    private final Random random;

    public RandomDiceStrategy(int sides) {
        if (sides < 1) {
            throw new IllegalArgumentException("Dice must have at least 1 side");
        }
        this.sides = sides;
        this.random = new Random();
    }

    @Override
    public int roll() {
        return random.nextInt(sides) + 1;
    }

    @Override
    public String name() {
        return "RANDOM_D" + sides;
    }
}

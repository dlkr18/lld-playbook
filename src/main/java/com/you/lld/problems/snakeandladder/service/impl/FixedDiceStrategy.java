package com.you.lld.problems.snakeandladder.service.impl;

import com.you.lld.problems.snakeandladder.service.DiceStrategy;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.Queue;

/** Deterministic dice for demos/tests — cycles through preset values. */
public class FixedDiceStrategy implements DiceStrategy {

    private final Queue<Integer> values;

    public FixedDiceStrategy(int... rolls) {
        this.values = new LinkedList<>();
        for (int roll : rolls) {
            values.add(roll);
        }
    }

    @Override
    public int roll() {
        if (values.isEmpty()) {
            return 1;
        }
        Integer next = values.poll();
        values.offer(next);
        return next;
    }

    @Override
    public String name() {
        return "FIXED" + Arrays.toString(values.toArray());
    }
}

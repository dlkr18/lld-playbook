package com.you.lld.problems.snakeandladder.model;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class Board {

    private final int size;
    private final Map<Integer, Integer> snakes;
    private final Map<Integer, Integer> ladders;

    public Board(int size, Map<Integer, Integer> snakes, Map<Integer, Integer> ladders) {
        this.size = size;
        this.snakes = Collections.unmodifiableMap(new HashMap<>(snakes));
        this.ladders = Collections.unmodifiableMap(new HashMap<>(ladders));
    }

    public int getSize() {
        return size;
    }

    /** Resolve snake/ladder chains from landing position (max 20 hops). */
    public int resolve(int position) {
        int hops = 20;
        while (hops-- > 0) {
            if (snakes.containsKey(position)) {
                position = snakes.get(position);
            } else if (ladders.containsKey(position)) {
                position = ladders.get(position);
            } else {
                break;
            }
        }
        return position;
    }

    public boolean isSnakeHead(int position) {
        return snakes.containsKey(position);
    }

    public boolean isLadderBottom(int position) {
        return ladders.containsKey(position);
    }

    public int snakeDestination(int head) {
        return snakes.get(head);
    }

    public int ladderDestination(int bottom) {
        return ladders.get(bottom);
    }
}

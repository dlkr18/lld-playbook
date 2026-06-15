package com.you.lld.problems.snakeandladder.model;

import java.util.HashMap;
import java.util.Map;

public class GameStats {

    private int totalRolls;
    private int snakeHits;
    private int ladderHits;

    public void recordRoll() {
        totalRolls++;
    }

    public void recordSnakeHit() {
        snakeHits++;
    }

    public void recordLadderHit() {
        ladderHits++;
    }

    public int getTotalRolls() {
        return totalRolls;
    }

    public int getSnakeHits() {
        return snakeHits;
    }

    public int getLadderHits() {
        return ladderHits;
    }

    @Override
    public String toString() {
        return "GameStats{rolls=" + totalRolls + ", snakes=" + snakeHits + ", ladders=" + ladderHits + "}";
    }
}

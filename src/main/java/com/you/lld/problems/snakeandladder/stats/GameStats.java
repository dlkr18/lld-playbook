package com.you.lld.problems.snakeandladder.stats;

import java.util.*;

public class GameStats {
    private int totalRolls;
    private final Map<Integer, Integer> rollFrequency;
    private int snakeHits;
    private int ladderHits;
    
    public GameStats() {
        this.rollFrequency = new HashMap<>();
        this.totalRolls = 0;
        this.snakeHits = 0;
        this.ladderHits = 0;
    }
    
    public void recordRoll(int value) {
        totalRolls++;
        rollFrequency.merge(value, 1, Integer::sum);
    }
    
    public void recordSnakeHit() {
        snakeHits++;
    }
    
    public void recordLadderHit() {
        ladderHits++;
    }
    
    public int getTotalRolls() { return totalRolls; }
    public int getSnakeHits() { return snakeHits; }
    public int getLadderHits() { return ladderHits; }
    
    @Override
    public String toString() {
        return "GameStats{rolls=" + totalRolls + ", snakes=" + snakeHits + 
               ", ladders=" + ladderHits + "}";
    }
}

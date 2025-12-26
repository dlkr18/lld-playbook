package com.you.lld.problems.minesweeper;

public class Score {
    private final String playerName;
    private final long timeSeconds;
    private final Difficulty difficulty;
    
    public Score(String playerName, long timeSeconds, Difficulty difficulty) {
        this.playerName = playerName;
        this.timeSeconds = timeSeconds;
        this.difficulty = difficulty;
    }
    
    public String getPlayerName() { return playerName; }
    public long getTimeSeconds() { return timeSeconds; }
    public Difficulty getDifficulty() { return difficulty; }
    
    @Override
    public String toString() {
        return playerName + " - " + timeSeconds + "s (" + difficulty + ")";
    }
}

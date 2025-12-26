package com.you.lld.problems.snakeandladder.config;

public class GameConfig {
    private final int boardSize;
    private final int numSnakes;
    private final int numLadders;
    private final int diceSides;
    
    public GameConfig(int boardSize, int numSnakes, int numLadders, int diceSides) {
        this.boardSize = boardSize;
        this.numSnakes = numSnakes;
        this.numLadders = numLadders;
        this.diceSides = diceSides;
    }
    
    public static GameConfig standard() {
        return new GameConfig(100, 8, 8, 6);
    }
    
    public int getBoardSize() { return boardSize; }
    public int getNumSnakes() { return numSnakes; }
    public int getNumLadders() { return numLadders; }
    public int getDiceSides() { return diceSides; }
}

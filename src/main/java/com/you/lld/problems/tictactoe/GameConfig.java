package com.you.lld.problems.tictactoe;

public class GameConfig {
    private final int boardSize;
    private final boolean allowUndo;
    
    public GameConfig(int boardSize, boolean allowUndo) {
        this.boardSize = boardSize;
        this.allowUndo = allowUndo;
    }
    
    public static GameConfig standard() {
        return new GameConfig(3, false);
    }
    
    public int getBoardSize() { return boardSize; }
    public boolean isAllowUndo() { return allowUndo; }
}

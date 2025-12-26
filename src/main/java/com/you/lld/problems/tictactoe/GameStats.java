package com.you.lld.problems.tictactoe;

public class GameStats {
    private int xWins;
    private int oWins;
    private int draws;
    
    public void recordXWin() { xWins++; }
    public void recordOWin() { oWins++; }
    public void recordDraw() { draws++; }
    
    public int getXWins() { return xWins; }
    public int getOWins() { return oWins; }
    public int getDraws() { return draws; }
    public int getTotalGames() { return xWins + oWins + draws; }
}

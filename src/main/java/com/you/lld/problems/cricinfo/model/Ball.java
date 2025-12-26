package com.you.lld.problems.cricinfo.model;

public class Ball {
    private final int overNumber;
    private final int ballNumber;
    private final Player bowler;
    private final Player batsman;
    private int runs;
    private boolean isWicket;
    
    public Ball(int overNumber, int ballNumber, Player bowler, Player batsman) {
        this.overNumber = overNumber;
        this.ballNumber = ballNumber;
        this.bowler = bowler;
        this.batsman = batsman;
        this.runs = 0;
        this.isWicket = false;
    }
    
    public void setRuns(int runs) { this.runs = runs; }
    public void setWicket(boolean wicket) { this.isWicket = wicket; }
    
    public int getRuns() { return runs; }
    public boolean isWicket() { return isWicket; }
    public Player getBowler() { return bowler; }
    public Player getBatsman() { return batsman; }
    
    @Override
    public String toString() {
        String result = overNumber + "." + ballNumber + ": " + batsman.getName() + " scored " + runs;
        if (isWicket) {
            result += " (OUT!)";
        }
        return result;
    }
}

package com.you.lld.problems.snakeandladder.model;

public class GameResult {
    private final Player winner;
    private final int totalMoves;
    
    public GameResult(Player winner, int totalMoves) {
        this.winner = winner;
        this.totalMoves = totalMoves;
    }
    
    public Player getWinner() { return winner; }
    public int getTotalMoves() { return totalMoves; }
    
    @Override
    public String toString() {
        return "Winner: " + winner.getName() + " in " + totalMoves + " moves";
    }
}

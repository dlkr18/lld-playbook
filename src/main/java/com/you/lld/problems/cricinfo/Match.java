package com.you.lld.problems.cricinfo;
import java.time.LocalDateTime;

public class Match {
    public enum MatchStatus { SCHEDULED, LIVE, COMPLETED, ABANDONED }
    
    private final String matchId;
    private final String team1Id;
    private final String team2Id;
    private MatchStatus status;
    private int team1Score;
    private int team2Score;
    private LocalDateTime startTime;
    
    public Match(String matchId, String team1Id, String team2Id) {
        this.matchId = matchId;
        this.team1Id = team1Id;
        this.team2Id = team2Id;
        this.status = MatchStatus.SCHEDULED;
        this.team1Score = 0;
        this.team2Score = 0;
    }
    
    public String getMatchId() { return matchId; }
    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }
    public void updateScore(String teamId, int runs) {
        if (teamId.equals(team1Id)) team1Score += runs;
        else if (teamId.equals(team2Id)) team2Score += runs;
    }
    public int getTeam1Score() { return team1Score; }
    public int getTeam2Score() { return team2Score; }
}

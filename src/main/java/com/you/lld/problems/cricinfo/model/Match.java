package com.you.lld.problems.cricinfo.model;

import java.time.LocalDateTime;

public class Match {
    private final String id;
    private final Team team1;
    private final Team team2;
    private final String venue;
    private final LocalDateTime startTime;
    private MatchStatus status;
    private Team winner;
    private int team1Score;
    private int team2Score;
    
    public Match(String id, Team team1, Team team2, String venue, LocalDateTime startTime) {
        this.id = id;
        this.team1 = team1;
        this.team2 = team2;
        this.venue = venue;
        this.startTime = startTime;
        this.status = MatchStatus.SCHEDULED;
        this.team1Score = 0;
        this.team2Score = 0;
    }
    
    public void start() { this.status = MatchStatus.IN_PROGRESS; }
    
    public void end(Team winner) {
        this.status = MatchStatus.COMPLETED;
        this.winner = winner;
        winner.recordWin();
        Team loser = (winner == team1) ? team2 : team1;
        loser.recordLoss();
    }
    
    public void setScore(Team team, int score) {
        if (team == team1) {
            this.team1Score = score;
        } else if (team == team2) {
            this.team2Score = score;
        }
    }
    
    public String getId() { return id; }
    public Team getTeam1() { return team1; }
    public Team getTeam2() { return team2; }
    public MatchStatus getStatus() { return status; }
    public Team getWinner() { return winner; }
    public int getTeam1Score() { return team1Score; }
    public int getTeam2Score() { return team2Score; }
    
    @Override
    public String toString() {
        return team1.getName() + " vs " + team2.getName() + " at " + venue + " - " + status;
    }
}

package com.you.lld.problems.cricinfo;
import java.util.*;

public class Cricinfo {
    private final Map<String, Match> matches;
    private final Map<String, Team> teams;
    
    public Cricinfo() {
        this.matches = new HashMap<>();
        this.teams = new HashMap<>();
    }
    
    public void addTeam(Team team) {
        teams.put(team.getTeamId(), team);
    }
    
    public void scheduleMatch(Match match) {
        matches.put(match.getMatchId(), match);
    }
    
    public void updateScore(String matchId, String teamId, int runs) {
        Match match = matches.get(matchId);
        if (match != null) {
            match.updateScore(teamId, runs);
        }
    }
    
    public Match getLiveScore(String matchId) {
        return matches.get(matchId);
    }
}

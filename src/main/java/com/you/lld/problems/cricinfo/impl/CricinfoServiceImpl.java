package com.you.lld.problems.cricinfo.impl;

import com.you.lld.problems.cricinfo.api.CricinfoService;
import com.you.lld.problems.cricinfo.model.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class CricinfoServiceImpl implements CricinfoService {
    private final Map<String, Team> teams = new ConcurrentHashMap<>();
    private final Map<String, Player> players = new ConcurrentHashMap<>();
    private final Map<String, Match> matches = new ConcurrentHashMap<>();
    
    @Override
    public String createTeam(String name, String country) {
        String teamId = UUID.randomUUID().toString();
        Team team = new Team(teamId, name, country);
        teams.put(teamId, team);
        System.out.println("Team created: " + name);
        return teamId;
    }
    
    @Override
    public String addPlayer(String teamId, String name, String country, PlayerRole role) {
        Team team = teams.get(teamId);
        if (team == null) {
            throw new IllegalArgumentException("Team not found");
        }
        
        String playerId = UUID.randomUUID().toString();
        Player player = new Player(playerId, name, country, role);
        players.put(playerId, player);
        team.addPlayer(player);
        System.out.println("Player added: " + name + " to " + team.getName());
        return playerId;
    }
    
    @Override
    public String scheduleMatch(String team1Id, String team2Id, String venue) {
        Team team1 = teams.get(team1Id);
        Team team2 = teams.get(team2Id);
        
        if (team1 == null || team2 == null) {
            throw new IllegalArgumentException("Team not found");
        }
        
        String matchId = UUID.randomUUID().toString();
        Match match = new Match(matchId, team1, team2, venue, LocalDateTime.now().plusDays(1));
        matches.put(matchId, match);
        System.out.println("Match scheduled: " + team1.getName() + " vs " + team2.getName());
        return matchId;
    }
    
    @Override
    public void startMatch(String matchId) {
        Match match = matches.get(matchId);
        if (match != null) {
            match.start();
            System.out.println("Match started: " + match);
        }
    }
    
    @Override
    public void endMatch(String matchId, String winnerId) {
        Match match = matches.get(matchId);
        Team winner = teams.get(winnerId);
        
        if (match != null && winner != null) {
            match.end(winner);
            System.out.println("Match ended. Winner: " + winner.getName());
        }
    }
    
    @Override
    public Match getMatch(String matchId) {
        return matches.get(matchId);
    }
    
    @Override
    public List<Match> getAllMatches() {
        return new ArrayList<>(matches.values());
    }
}

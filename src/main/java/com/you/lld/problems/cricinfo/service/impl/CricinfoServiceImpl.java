package com.you.lld.problems.cricinfo.service.impl;

import com.you.lld.problems.cricinfo.service.CricinfoService;
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
        return matchId;
    }
    
    @Override
    public void startMatch(String matchId) {
        Match match = matches.get(matchId);
        if (match == null) {
            throw new IllegalArgumentException("Match not found: " + matchId);
        }
        if (match.getStatus() != MatchStatus.SCHEDULED) {
            throw new IllegalStateException("Cannot start match -- current status: " + match.getStatus());
        }
        match.start();
    }
    
    @Override
    public void endMatch(String matchId, String winnerId) {
        Match match = matches.get(matchId);
        if (match == null) {
            throw new IllegalArgumentException("Match not found: " + matchId);
        }
        if (match.getStatus() != MatchStatus.IN_PROGRESS) {
            throw new IllegalStateException("Cannot end match -- current status: " + match.getStatus());
        }
        Team winner = teams.get(winnerId);
        if (winner == null) {
            throw new IllegalArgumentException("Team not found: " + winnerId);
        }
        match.end(winner);
    }
    
    @Override
    public Innings startInnings(String matchId, String battingTeamId) {
        Match match = requireMatch(matchId);
        Team batting = requireTeam(battingTeamId);
        return match.startInnings(batting);
    }

    @Override
    public Ball recordBall(String matchId, String bowlerId, String batsmanId,
                           int runs, boolean wicket, DeliveryType type) {
        Match match = requireMatch(matchId);
        Player bowler = requirePlayer(bowlerId);
        Player batsman = requirePlayer(batsmanId);

        // Ball numbering is derived from the innings so far, not passed in by the
        // caller — otherwise the over count is whatever the client claims it is.
        Innings innings = match.currentInnings();
        int over = innings.getCompletedOvers();
        int ballInOver = innings.getBallsIntoCurrentOver() + 1;

        Ball ball = new Ball(over, ballInOver, bowler, batsman, runs, wicket, type);
        match.recordBall(ball);
        return ball;
    }

    private Match requireMatch(String matchId) {
        Match match = matches.get(matchId);
        if (match == null) {
            throw new IllegalArgumentException("Match not found: " + matchId);
        }
        return match;
    }

    private Team requireTeam(String teamId) {
        Team team = teams.get(teamId);
        if (team == null) {
            throw new IllegalArgumentException("Team not found: " + teamId);
        }
        return team;
    }

    private Player requirePlayer(String playerId) {
        Player player = players.get(playerId);
        if (player == null) {
            throw new IllegalArgumentException("Player not found: " + playerId);
        }
        return player;
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

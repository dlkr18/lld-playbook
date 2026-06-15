package com.you.lld.problems.cricinfo;

import com.you.lld.problems.cricinfo.model.Match;
import com.you.lld.problems.cricinfo.model.PlayerRole;
import com.you.lld.problems.cricinfo.service.CricinfoService;
import com.you.lld.problems.cricinfo.service.impl.CricinfoServiceImpl;

import java.util.List;

/** Facade for cricket scores — teams, matches, live score updates (Observer-ready). */
public class Cricinfo {
    private final CricinfoService service;

    public Cricinfo() {
        this(new CricinfoServiceImpl());
    }

    public Cricinfo(CricinfoService service) {
        this.service = service;
    }

    public String createTeam(String name, String country) {
        return service.createTeam(name, country);
    }

    public String addPlayer(String teamId, String name, String country, PlayerRole role) {
        return service.addPlayer(teamId, name, country, role);
    }

    public String scheduleMatch(String team1Id, String team2Id, String venue) {
        return service.scheduleMatch(team1Id, team2Id, venue);
    }

    public void startMatch(String matchId) {
        service.startMatch(matchId);
    }

    public void updateScore(String matchId, String teamId, int runs) {
        if (service instanceof CricinfoServiceImpl) {
            ((CricinfoServiceImpl) service).updateScore(matchId, teamId, runs);
        }
    }

    public void endMatch(String matchId, String winnerId) {
        service.endMatch(matchId, winnerId);
    }

    public Match getMatch(String matchId) {
        return service.getMatch(matchId);
    }

    public List<Match> getAllMatches() {
        return service.getAllMatches();
    }
}

package com.you.lld.problems.cricinfo.api;

import com.you.lld.problems.cricinfo.model.*;
import java.util.List;

public interface CricinfoService {
    String createTeam(String name, String country);
    String addPlayer(String teamId, String name, String country, PlayerRole role);
    String scheduleMatch(String team1Id, String team2Id, String venue);
    void startMatch(String matchId);
    void endMatch(String matchId, String winnerId);
    Match getMatch(String matchId);
    List<Match> getAllMatches();
}

package com.you.lld.problems.cricinfo.service;

import com.you.lld.problems.cricinfo.model.*;
import java.util.List;

public interface CricinfoService {
    String createTeam(String name, String country);
    String addPlayer(String teamId, String name, String country, PlayerRole role);
    String scheduleMatch(String team1Id, String team2Id, String venue);
    void startMatch(String matchId);
    void endMatch(String matchId, String winnerId);

    /** Opens an innings with the given team batting. */
    Innings startInnings(String matchId, String battingTeamId);

    /**
     * Records one delivery. This is the ONLY way runs enter the system — the
     * scoreboard is derived from the balls, so the two cannot disagree.
     */
    Ball recordBall(String matchId, String bowlerId, String batsmanId,
                    int runs, boolean wicket, DeliveryType type);
    Match getMatch(String matchId);
    List<Match> getAllMatches();
}

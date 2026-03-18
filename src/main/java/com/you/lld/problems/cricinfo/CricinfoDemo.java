package com.you.lld.problems.cricinfo;

import com.you.lld.problems.cricinfo.impl.CricinfoServiceImpl;
import com.you.lld.problems.cricinfo.model.PlayerRole;

import java.util.List;

/**
 * Demo: Cricinfo with teams, players, match scheduling, lifecycle.
 */
public class CricinfoDemo {

    public static void main(String[] args) {
        System.out.println("=== Cricinfo Demo ===\n");

        CricinfoServiceImpl service = new CricinfoServiceImpl();

        // Create teams
        System.out.println("--- Teams ---");
        String t1 = service.createTeam("India", "India");
        String t2 = service.createTeam("Australia", "Australia");
        System.out.println("Created: India=" + t1 + ", Australia=" + t2);

        // Add players
        System.out.println("\n--- Players ---");
        service.addPlayer(t1, "Virat Kohli", "India", PlayerRole.BATSMAN);
        service.addPlayer(t1, "Jasprit Bumrah", "India", PlayerRole.BOWLER);
        service.addPlayer(t1, "Ravindra Jadeja", "India", PlayerRole.ALL_ROUNDER);
        service.addPlayer(t2, "Steve Smith", "Australia", PlayerRole.BATSMAN);
        service.addPlayer(t2, "Pat Cummins", "Australia", PlayerRole.BOWLER);
        System.out.println("Added players to both teams");

        // Schedule match
        System.out.println("\n--- Match ---");
        String matchId = service.scheduleMatch(t1, t2, "MCG, Melbourne");
        System.out.println("Scheduled match: " + matchId);

        com.you.lld.problems.cricinfo.model.Match match = service.getMatch(matchId);
        System.out.println("Status: " + match.getStatus());

        // Start match
        service.startMatch(matchId);
        match = service.getMatch(matchId);
        System.out.println("Started: " + match.getStatus());

        // End match
        service.endMatch(matchId, t1);
        match = service.getMatch(matchId);
        System.out.println("Ended: " + match.getStatus());

        // All matches
        System.out.println("\n--- All matches ---");
        List<com.you.lld.problems.cricinfo.model.Match> matches = service.getAllMatches();
        System.out.println("Total matches: " + matches.size());

        System.out.println("\n=== Demo complete ===");
    }
}

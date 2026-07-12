package com.you.lld.problems.cricinfo;

import com.you.lld.problems.cricinfo.model.Match;
import com.you.lld.problems.cricinfo.model.PlayerRole;

/**
 * SDE3 demo: teams, match lifecycle, live score updates.
 */
public class CricinfoDemo {

    public static void main(String[] args) {
        System.out.println("=== Cricinfo (SDE3) ===\n");
        Cricinfo cricinfo = new Cricinfo();

        // 1. Teams + squads
        System.out.println("--- 1. Teams ---");
        String india = cricinfo.createTeam("India", "India");
        String aus = cricinfo.createTeam("Australia", "Australia");
        cricinfo.addPlayer(india, "Virat Kohli", "India", PlayerRole.BATSMAN);
        cricinfo.addPlayer(aus, "Steve Smith", "Australia", PlayerRole.BATSMAN);
        System.out.println("Squads registered");

        // 2. Schedule + start
        System.out.println("\n--- 2. Match lifecycle ---");
        String matchId = cricinfo.scheduleMatch(india, aus, "MCG");
        cricinfo.startMatch(matchId);
        Match match = cricinfo.getMatch(matchId);
        System.out.println("Status after start: " + match.getStatus());

        // 3. Live score
        System.out.println("\n--- 3. Live score ---");
        cricinfo.updateScore(matchId, india, 156);
        cricinfo.updateScore(matchId, aus, 142);
        System.out.println("India 156, Australia 142");

        // 4. Result
        System.out.println("\n--- 4. Result ---");
        cricinfo.endMatch(matchId, india);
        System.out.println("Winner: India, status=" + cricinfo.getMatch(matchId).getStatus());

        // 5. Invalid transition guard
        System.out.println("\n--- 5. State guards ---");
        try {
            cricinfo.startMatch(matchId);
        } catch (IllegalStateException e) {
            System.out.println("Re-start blocked: " + e.getMessage());
        }

        System.out.println("\n=== Demo complete ===");
    }
}

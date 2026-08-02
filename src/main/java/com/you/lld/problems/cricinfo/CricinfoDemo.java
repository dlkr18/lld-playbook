package com.you.lld.problems.cricinfo;

import com.you.lld.problems.cricinfo.model.DeliveryType;
import com.you.lld.problems.cricinfo.model.Innings;
import com.you.lld.problems.cricinfo.model.Match;
import com.you.lld.problems.cricinfo.model.PlayerRole;

/**
 * SDE3 demo: teams, match lifecycle, ball-by-ball scoring, derived scorecard.
 */
public class CricinfoDemo {

    public static void main(String[] args) {
        System.out.println("=== Cricinfo (SDE3) ===\n");
        Cricinfo cricinfo = new Cricinfo();

        // 1. Teams + squads
        System.out.println("--- 1. Teams ---");
        String india = cricinfo.createTeam("India", "India");
        String aus = cricinfo.createTeam("Australia", "Australia");
        String kohli = cricinfo.addPlayer(india, "Virat Kohli", "India", PlayerRole.BATSMAN);
        String smith = cricinfo.addPlayer(aus, "Steve Smith", "Australia", PlayerRole.BATSMAN);
        String starc = cricinfo.addPlayer(aus, "Mitchell Starc", "Australia", PlayerRole.BOWLER);
        String bumrah = cricinfo.addPlayer(india, "Jasprit Bumrah", "India", PlayerRole.BOWLER);
        System.out.println("Squads registered");

        // 2. Schedule + start
        System.out.println("\n--- 2. Match lifecycle ---");
        String matchId = cricinfo.scheduleMatch(india, aus, "MCG");
        cricinfo.startMatch(matchId);
        Match match = cricinfo.getMatch(matchId);
        System.out.println("Status after start: " + match.getStatus());

        // 3. Ball-by-ball — the score is DERIVED from these, never set directly
        System.out.println("\n--- 3. First innings, ball by ball ---");
        cricinfo.startInnings(matchId, india);
        cricinfo.recordBall(matchId, starc, kohli, 4, false);
        cricinfo.recordBall(matchId, starc, kohli, 1, false);
        cricinfo.recordBall(matchId, starc, kohli, 0, false);
        cricinfo.recordBall(matchId, starc, kohli, 2, false, DeliveryType.WIDE);
        cricinfo.recordBall(matchId, starc, kohli, 6, false);
        cricinfo.recordBall(matchId, starc, kohli, 0, true);
        Innings first = match.currentInnings();
        System.out.println("  " + first);
        System.out.println("  legal balls bowled: " + first.getLegalBalls()
                + "  (the wide did not advance the over)");
        System.out.println("  Kohli off the bat: " + first.runsFor(first.getBalls().get(0).getBatsman())
                + ", extras: " + first.getExtras()
                + ", Starc wickets: " + first.wicketsFor(first.getBalls().get(0).getBowler()));
        System.out.println("  team total " + first.getRuns() + " = 11 off the bat + 3 extras"
                + "  (individual scores never sum to the team total)");

        // 4. Guards
        System.out.println("\n--- 4. Guards ---");
        try {
            cricinfo.endMatch(matchId, cricinfo.createTeam("England", "England"));
        } catch (IllegalArgumentException e) {
            System.out.println("  Third-team win blocked: " + e.getMessage());
        }
        try {
            cricinfo.recordBall(matchId, starc, kohli, 0, true, DeliveryType.WIDE);
        } catch (IllegalArgumentException e) {
            System.out.println("  Wicket off a wide blocked: " + e.getMessage());
        }

        // 5. Result
        System.out.println("\n--- 5. Result ---");
        cricinfo.endMatch(matchId, india);
        System.out.println("  Winner: India, status=" + cricinfo.getMatch(matchId).getStatus()
                + ", India " + match.getTeam1Score() + " (derived from " + first.getBalls().size() + " balls)");

        System.out.println("\n--- 6. State guards ---");
        try {
            cricinfo.startMatch(matchId);
        } catch (IllegalStateException e) {
            System.out.println("  Re-start blocked: " + e.getMessage());
        }

        System.out.println("\n=== Demo complete ===");
    }
}

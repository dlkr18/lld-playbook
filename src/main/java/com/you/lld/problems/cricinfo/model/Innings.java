package com.you.lld.problems.cricinfo.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * One team's batting innings, as an append-only sequence of {@link Ball}s.
 *
 * <p><b>Every statistic here is derived, never stored.</b> Runs, wickets and overs
 * are computed from the ball list, so there is no possibility of the scoreboard
 * disagreeing with the ball-by-ball record — which is exactly the bug that a
 * mutable {@code setScore(team, runs)} invites.
 *
 * <p>Not thread-safe on its own: mutation goes through {@link Match}, which holds
 * the monitor.
 */
public final class Innings {

    public static final int ALL_OUT_WICKETS = 10;
    private static final int BALLS_PER_OVER = 6;

    private final Team battingTeam;
    private final Team bowlingTeam;
    private final int maxOvers;
    private final List<Ball> balls = new ArrayList<Ball>();

    public Innings(Team battingTeam, Team bowlingTeam, int maxOvers) {
        if (battingTeam == null || bowlingTeam == null) {
            throw new IllegalArgumentException("Both teams required");
        }
        if (battingTeam.equals(bowlingTeam)) {
            throw new IllegalArgumentException("A team cannot bowl to itself");
        }
        if (maxOvers <= 0) {
            throw new IllegalArgumentException("maxOvers must be positive");
        }
        this.battingTeam = battingTeam;
        this.bowlingTeam = bowlingTeam;
        this.maxOvers = maxOvers;
    }

    public void record(Ball ball) {
        if (isComplete()) {
            throw new IllegalStateException("Innings is already complete ("
                    + getWickets() + " wickets, " + oversText() + " overs)");
        }
        balls.add(ball);
    }

    /** Total runs off the bat plus extras. */
    public int getRuns() {
        int total = 0;
        for (Ball b : balls) {
            total += b.totalRuns();
        }
        return total;
    }

    public int getWickets() {
        int total = 0;
        for (Ball b : balls) {
            if (b.isWicket()) {
                total++;
            }
        }
        return total;
    }

    /** Wides and no-balls are re-bowled, so they do not advance the over. */
    public int getLegalBalls() {
        int total = 0;
        for (Ball b : balls) {
            if (b.countsTowardOver()) {
                total++;
            }
        }
        return total;
    }

    public int getCompletedOvers() {
        return getLegalBalls() / BALLS_PER_OVER;
    }

    public int getBallsIntoCurrentOver() {
        return getLegalBalls() % BALLS_PER_OVER;
    }

    /** Cricket's "12.4" notation: completed overs, then balls into the current one. */
    public String oversText() {
        return getCompletedOvers() + "." + getBallsIntoCurrentOver();
    }

    public boolean isComplete() {
        return getWickets() >= ALL_OUT_WICKETS || getCompletedOvers() >= maxOvers;
    }

    /** Runs per over — the number every commentator quotes. */
    public double getRunRate() {
        int legal = getLegalBalls();
        return legal == 0 ? 0.0 : (getRuns() * (double) BALLS_PER_OVER) / legal;
    }

    /**
     * Runs credited to the batsman personally.
     *
     * <p>Extras are runs to the <em>team</em>, not to the batsman: byes/leg-byes
     * were never hit, and runs off a wide are by definition not off the bat. Only
     * a legal delivery or a no-ball (which can be hit) scores for the batsman —
     * which is why a team total and the sum of individual scores differ.
     */
    public int runsFor(Player batsman) {
        int total = 0;
        for (Ball b : balls) {
            boolean offTheBat = b.getType() == DeliveryType.LEGAL || b.getType() == DeliveryType.NO_BALL;
            if (offTheBat && b.getBatsman().equals(batsman)) {
                total += b.getRuns();
            }
        }
        return total;
    }

    /** Runs that went to the team but not to any batsman — wides, no-ball penalties, byes. */
    public int getExtras() {
        int total = 0;
        for (Ball b : balls) {
            total += b.getType().penaltyRuns();
            if (b.getType() == DeliveryType.BYE || b.getType() == DeliveryType.WIDE) {
                total += b.getRuns();
            }
        }
        return total;
    }

    public int wicketsFor(Player bowler) {
        int total = 0;
        for (Ball b : balls) {
            if (b.isWicket() && b.getBowler().equals(bowler)) {
                total++;
            }
        }
        return total;
    }

    public Team getBattingTeam() {
        return battingTeam;
    }

    public Team getBowlingTeam() {
        return bowlingTeam;
    }

    public int getMaxOvers() {
        return maxOvers;
    }

    public List<Ball> getBalls() {
        return Collections.unmodifiableList(balls);
    }

    @Override
    public String toString() {
        return battingTeam.getName() + " " + getRuns() + "/" + getWickets()
                + " (" + oversText() + " ov, RR " + String.format("%.2f", getRunRate()) + ")";
    }
}

package com.you.lld.problems.cricinfo.model;

/**
 * One delivery — the atomic scoring event.
 *
 * <p>Immutable: a ball that has been bowled cannot change. Everything above it
 * ({@link Innings} runs, wickets, overs; player statistics) is <b>derived</b> from
 * the sequence of balls rather than stored alongside it, so the two can never
 * disagree.
 */
public final class Ball {

    private final int overNumber;
    private final int ballNumber;
    private final Player bowler;
    private final Player batsman;
    private final int runs;
    private final boolean wicket;
    private final DeliveryType type;

    public Ball(int overNumber, int ballNumber, Player bowler, Player batsman,
                int runs, boolean wicket, DeliveryType type) {
        if (runs < 0) {
            throw new IllegalArgumentException("Runs cannot be negative");
        }
        if (type == null) {
            throw new IllegalArgumentException("Delivery type required");
        }
        if (wicket && !type.canTakeWicket()) {
            throw new IllegalArgumentException("A batsman cannot be dismissed off a " + type);
        }
        this.overNumber = overNumber;
        this.ballNumber = ballNumber;
        this.bowler = bowler;
        this.batsman = batsman;
        this.runs = runs;
        this.wicket = wicket;
        this.type = type;
    }

    /** Convenience for an ordinary legal delivery. */
    public static Ball legal(int overNumber, int ballNumber, Player bowler, Player batsman,
                             int runs, boolean wicket) {
        return new Ball(overNumber, ballNumber, bowler, batsman, runs, wicket, DeliveryType.LEGAL);
    }

    /** Runs credited to the batting side, including the penalty run for an extra. */
    public int totalRuns() {
        return runs + type.penaltyRuns();
    }

    public boolean countsTowardOver() {
        return type.countsTowardOver();
    }

    public int getOverNumber() {
        return overNumber;
    }

    public int getBallNumber() {
        return ballNumber;
    }

    public Player getBowler() {
        return bowler;
    }

    public Player getBatsman() {
        return batsman;
    }

    public int getRuns() {
        return runs;
    }

    public boolean isWicket() {
        return wicket;
    }

    public DeliveryType getType() {
        return type;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder()
                .append(overNumber).append('.').append(ballNumber)
                .append(": ").append(batsman.getName())
                .append(" scored ").append(totalRuns());
        if (type != DeliveryType.LEGAL) {
            sb.append(" (").append(type).append(')');
        }
        if (wicket) {
            sb.append(" (OUT!)");
        }
        return sb.toString();
    }
}

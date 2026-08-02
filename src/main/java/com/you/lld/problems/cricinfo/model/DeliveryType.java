package com.you.lld.problems.cricinfo.model;

/**
 * Delivery kinds, and the two cricket rules that follow from them.
 *
 * <p>Encoding "does this count toward the over" and "does it concede a penalty
 * run" on the enum keeps those rules in one place instead of scattering
 * {@code if (type == WIDE)} through the scoring code.
 */
public enum DeliveryType {
    /** An ordinary delivery: counts toward the over, no penalty. */
    LEGAL(true, 0, true),
    /** Wide: does not count toward the over, concedes one run, no dismissal off it. */
    WIDE(false, 1, false),
    /** No-ball: does not count toward the over, concedes one run, batsman not out. */
    NO_BALL(false, 1, false),
    /** Bye/leg-bye: a legal delivery; runs are recorded but not credited to the batsman. */
    BYE(true, 0, true);

    private final boolean countsTowardOver;
    private final int penaltyRuns;
    private final boolean canTakeWicket;

    DeliveryType(boolean countsTowardOver, int penaltyRuns, boolean canTakeWicket) {
        this.countsTowardOver = countsTowardOver;
        this.penaltyRuns = penaltyRuns;
        this.canTakeWicket = canTakeWicket;
    }

    public boolean countsTowardOver() {
        return countsTowardOver;
    }

    public int penaltyRuns() {
        return penaltyRuns;
    }

    public boolean canTakeWicket() {
        return canTakeWicket;
    }
}

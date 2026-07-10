package com.you.lld.problems.meetingscheduler.model;

import java.time.temporal.ChronoUnit;

/**
 * Recurrence cadence for repeating meetings. Each constant knows how to advance
 * a timestamp to the next occurrence, keeping the expansion logic declarative.
 */
public enum Frequency {

    DAILY(ChronoUnit.DAYS, 1),
    WEEKLY(ChronoUnit.WEEKS, 1);

    private final ChronoUnit unit;
    private final int step;

    Frequency(ChronoUnit unit, int step) {
        this.unit = unit;
        this.step = step;
    }

    public ChronoUnit getUnit() {
        return unit;
    }

    public int getStep() {
        return step;
    }
}

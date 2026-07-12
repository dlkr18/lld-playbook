package com.you.lld.problems.meetingscheduler.model;

/**
 * Immutable description of a repeating meeting: repeat every {@code frequency}
 * for {@code occurrences} total instances (including the first).
 */
public final class RecurrenceRule {

    private final Frequency frequency;
    private final int occurrences;

    public RecurrenceRule(Frequency frequency, int occurrences) {
        if (frequency == null) {
            throw new IllegalArgumentException("frequency must not be null");
        }
        if (occurrences < 1) {
            throw new IllegalArgumentException("occurrences must be >= 1");
        }
        this.frequency = frequency;
        this.occurrences = occurrences;
    }

    public Frequency getFrequency() {
        return frequency;
    }

    public int getOccurrences() {
        return occurrences;
    }

    @Override
    public String toString() {
        return frequency + " x" + occurrences;
    }
}

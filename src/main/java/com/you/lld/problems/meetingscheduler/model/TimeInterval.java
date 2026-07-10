package com.you.lld.problems.meetingscheduler.model;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Immutable half-open time interval {@code [start, end)}.
 *
 * <p>Half-open semantics are the crux of correct conflict detection: a meeting
 * that ends at 10:00 does NOT conflict with one that starts at 10:00. This lets
 * back-to-back meetings share a boundary instant without overlapping.
 *
 * <p>Self-validating value object (no business logic beyond validation).
 */
public final class TimeInterval {

    private final LocalDateTime start;
    private final LocalDateTime end;

    public TimeInterval(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            throw new IllegalArgumentException("start/end must not be null");
        }
        if (!start.isBefore(end)) {
            throw new IllegalArgumentException(
                "start must be strictly before end (got start=" + start + ", end=" + end + ")");
        }
        this.start = start;
        this.end = end;
    }

    public static TimeInterval of(LocalDateTime start, Duration duration) {
        if (duration == null || duration.isZero() || duration.isNegative()) {
            throw new IllegalArgumentException("duration must be positive");
        }
        return new TimeInterval(start, start.plus(duration));
    }

    public LocalDateTime getStart() {
        return start;
    }

    public LocalDateTime getEnd() {
        return end;
    }

    public Duration getDuration() {
        return Duration.between(start, end);
    }

    /**
     * Overlap test for half-open intervals. Two intervals {@code [s1,e1)} and
     * {@code [s2,e2)} overlap iff {@code s1 < e2 AND s2 < e1}. Touching at a
     * boundary (e1 == s2) is NOT an overlap.
     */
    public boolean overlaps(TimeInterval other) {
        return this.start.isBefore(other.end) && other.start.isBefore(this.end);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TimeInterval that = (TimeInterval) o;
        return start.equals(that.start) && end.equals(that.end);
    }

    @Override
    public int hashCode() {
        return 31 * start.hashCode() + end.hashCode();
    }

    @Override
    public String toString() {
        return "[" + start + " -> " + end + ")";
    }
}

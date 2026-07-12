package com.you.lld.problems.carrental.model;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

/**
 * A half-open rental window {@code [pickup, dropoff)} — pickup day inclusive,
 * drop-off day exclusive. Immutable, self-validating value object.
 *
 * <p>The half-open convention is the crux of the overlap logic: it makes
 * back-to-back rentals legal. A car returned on day D can be handed to the next
 * customer whose window starts on day D, because {@code [.., D)} and
 * {@code [D, ..)} do not overlap.
 */
public final class DateRange {
    private final LocalDate pickup;   // inclusive
    private final LocalDate dropoff;  // exclusive

    public DateRange(LocalDate pickup, LocalDate dropoff) {
        if (pickup == null || dropoff == null) {
            throw new IllegalArgumentException("pickup and dropoff required");
        }
        if (!dropoff.isAfter(pickup)) {
            throw new IllegalArgumentException(
                    "dropoff (" + dropoff + ") must be after pickup (" + pickup + ")");
        }
        this.pickup = pickup;
        this.dropoff = dropoff;
    }

    public LocalDate getPickup() {
        return pickup;
    }

    public LocalDate getDropoff() {
        return dropoff;
    }

    /** Number of billable days = full days in the half-open window (always &ge; 1). */
    public long days() {
        return ChronoUnit.DAYS.between(pickup, dropoff);
    }

    /**
     * Two half-open intervals overlap iff each starts before the other ends.
     * Touching endpoints (back-to-back) are NOT an overlap.
     */
    public boolean overlaps(DateRange other) {
        return this.pickup.isBefore(other.dropoff) && other.pickup.isBefore(this.dropoff);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DateRange that = (DateRange) o;
        return pickup.equals(that.pickup) && dropoff.equals(that.dropoff);
    }

    @Override
    public int hashCode() {
        return Objects.hash(pickup, dropoff);
    }

    @Override
    public String toString() {
        return "[" + pickup + " -> " + dropoff + ") (" + days() + "d)";
    }
}

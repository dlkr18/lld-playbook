package com.you.lld.problems.hotelbooking.model;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Immutable half-open date interval {@code [checkIn, checkOut)}.
 *
 * <p>The check-out day is <b>exclusive</b>: a guest checking out on the 5th and
 * another checking in on the 5th do NOT overlap (the room is free that night for
 * the second guest). Modelling stays as half-open intervals is what makes
 * "back-to-back" bookings work and keeps overlap arithmetic simple.
 *
 * <p>This value object carries no business logic beyond self-validation and the
 * pure {@link #overlaps(DateRange)} / {@link #nights()} calculations.
 */
public final class DateRange {

    private final LocalDate checkIn;   // inclusive
    private final LocalDate checkOut;  // exclusive

    public DateRange(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            throw new IllegalArgumentException("checkIn/checkOut must not be null");
        }
        if (!checkIn.isBefore(checkOut)) {
            throw new IllegalArgumentException(
                    "checkIn (" + checkIn + ") must be strictly before checkOut (" + checkOut + ")");
        }
        this.checkIn = checkIn;
        this.checkOut = checkOut;
    }

    public LocalDate checkIn() {
        return checkIn;
    }

    public LocalDate checkOut() {
        return checkOut;
    }

    /** Number of billable nights in the stay. */
    public long nights() {
        return ChronoUnit.DAYS.between(checkIn, checkOut);
    }

    /**
     * Two half-open intervals [a,b) and [c,d) overlap iff a &lt; d AND c &lt; b.
     * With the check-out boundary exclusive, adjacency (b == c) is NOT overlap,
     * so a stay ending on day X and one starting on day X can share a room.
     */
    public boolean overlaps(DateRange other) {
        return this.checkIn.isBefore(other.checkOut) && other.checkIn.isBefore(this.checkOut);
    }

    /** Whether {@code day} falls within the billable nights of this stay. */
    public boolean contains(LocalDate day) {
        return !day.isBefore(checkIn) && day.isBefore(checkOut);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DateRange that = (DateRange) o;
        return checkIn.equals(that.checkIn) && checkOut.equals(that.checkOut);
    }

    @Override
    public int hashCode() {
        return 31 * checkIn.hashCode() + checkOut.hashCode();
    }

    @Override
    public String toString() {
        return "[" + checkIn + " -> " + checkOut + ", " + nights() + " night(s)]";
    }
}

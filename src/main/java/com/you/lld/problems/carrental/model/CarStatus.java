package com.you.lld.problems.carrental.model;

/**
 * Physical availability of a car in the fleet.
 *
 * <p>Note: {@code RENTED} is NOT tracked here. Whether a car is free on a given
 * date range is derived from its reservations (a time-boxed question), not from
 * a single mutable flag. This enum only captures whether the car is part of the
 * bookable fleet at all.
 */
public enum CarStatus {
    /** In service and bookable (subject to reservation overlap checks). */
    ACTIVE,
    /** Temporarily withdrawn (servicing, repair) — excluded from search. */
    MAINTENANCE,
    /** Permanently removed from the fleet. */
    RETIRED
}

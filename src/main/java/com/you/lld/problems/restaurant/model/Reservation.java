package com.you.lld.problems.restaurant.model;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * A booking of one table for a half-open time window {@code [start, end)}.
 *
 * <p>A reservation is a claim on a <b>time range</b>, not on the table forever.
 * Modelling it as a bare instant (and flipping the table to RESERVED) meant one
 * booking for next Tuesday made the table unbookable and unseatable for every
 * other moment — see the overlap check in the service.
 */
public class Reservation {

    /** How long a table is held for a sitting. Real systems vary this by party size. */
    public static final Duration DEFAULT_SITTING = Duration.ofMinutes(90);

    private final String reservationId;
    private final String customerId;
    private final String tableId;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
    private final int partySize;

    public Reservation(String id, String customerId, String tableId,
                       LocalDateTime startTime, int partySize) {
        this(id, customerId, tableId, startTime, startTime.plus(DEFAULT_SITTING), partySize);
    }

    public Reservation(String id, String customerId, String tableId,
                       LocalDateTime startTime, LocalDateTime endTime, int partySize) {
        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException("Reservation must start before it ends");
        }
        if (partySize <= 0) {
            throw new IllegalArgumentException("Party size must be positive");
        }
        this.reservationId = id;
        this.customerId = customerId;
        this.tableId = tableId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.partySize = partySize;
    }

    /** Half-open overlap: a booking ending at 19:00 does not clash with one starting at 19:00. */
    public boolean overlaps(LocalDateTime otherStart, LocalDateTime otherEnd) {
        return startTime.isBefore(otherEnd) && otherStart.isBefore(endTime);
    }

    public boolean coversInstant(LocalDateTime instant) {
        return !instant.isBefore(startTime) && instant.isBefore(endTime);
    }

    public String getReservationId() {
        return reservationId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public String getTableId() {
        return tableId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public int getPartySize() {
        return partySize;
    }

    @Override
    public String toString() {
        return reservationId + "{table=" + tableId + ", " + startTime + " -> " + endTime
                + ", party=" + partySize + "}";
    }
}

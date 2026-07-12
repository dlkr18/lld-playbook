package com.you.lld.problems.airlinebooking.model;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * A booking record identified by its PNR. This is the <b>context</b> of the
 * State pattern: it holds the current {@link BookingState} and delegates all
 * lifecycle transitions to it.
 *
 * <p>The PNR is issued at hold time and remains stable through confirmation,
 * mirroring real airline reservations where a record locator is created the
 * moment a seat is reserved.
 *
 * <p><b>Thread-safety:</b> lifecycle transitions are {@code synchronized} on the
 * booking instance so a user-initiated {@code confirm} and the background
 * expiry sweeper cannot corrupt the state field. The authoritative "who wins"
 * decision, however, is made by the per-seat compare-and-set in the inventory;
 * the orchestrator only mutates booking state <em>after</em> winning that CAS.
 */
public final class Booking {

    private final String pnr;
    private final Flight flight;
    private final Seat seat;
    private final Passenger passenger;
    private final BigDecimal fare;
    private final Instant holdExpiry;

    private BookingState state;

    public Booking(String pnr,
                   Flight flight,
                   Seat seat,
                   Passenger passenger,
                   BigDecimal fare,
                   Instant holdExpiry) {
        if (pnr == null || pnr.trim().isEmpty()) {
            throw new IllegalArgumentException("PNR is required");
        }
        if (flight == null || seat == null || passenger == null) {
            throw new IllegalArgumentException("Flight, seat and passenger are required");
        }
        if (fare == null) {
            throw new IllegalArgumentException("Fare is required");
        }
        if (holdExpiry == null) {
            throw new IllegalArgumentException("Hold expiry is required");
        }
        this.pnr = pnr.trim();
        this.flight = flight;
        this.seat = seat;
        this.passenger = passenger;
        this.fare = fare;
        this.holdExpiry = holdExpiry;
        this.state = HeldState.INSTANCE;
    }

    public String pnr() {
        return pnr;
    }

    public Flight flight() {
        return flight;
    }

    public Seat seat() {
        return seat;
    }

    public Passenger passenger() {
        return passenger;
    }

    public BigDecimal fare() {
        return fare;
    }

    public Instant holdExpiry() {
        return holdExpiry;
    }

    /** True if this booking's hold TTL has elapsed as of {@code now}. */
    public boolean isHoldExpired(Instant now) {
        return now.isAfter(holdExpiry);
    }

    public synchronized BookingStatus status() {
        return state.status();
    }

    /** Package-private hook used by state objects to advance the context. */
    void setState(BookingState newState) {
        this.state = newState;
    }

    public synchronized void confirm() {
        state.confirm(this);
    }

    public synchronized void cancel() {
        state.cancel(this);
    }

    public synchronized void expire() {
        state.expire(this);
    }

    @Override
    public String toString() {
        return "PNR " + pnr + " [" + status() + "] "
                + passenger.name() + " " + flight.flightNumber()
                + " seat " + seat.number() + " (" + seat.seatClass() + ") fare=" + fare;
    }
}

package com.you.lld.problems.airlinebooking.model;

/**
 * Terminal state: the hold's TTL elapsed before confirmation and its seat was
 * released back to the pool. All further lifecycle transitions are rejected.
 */
public final class ExpiredState implements BookingState {

    public static final ExpiredState INSTANCE = new ExpiredState();

    private ExpiredState() {
    }

    @Override
    public void confirm(Booking booking) {
        throw new IllegalStateException("Hold " + booking.pnr() + " has expired; cannot confirm");
    }

    @Override
    public void cancel(Booking booking) {
        throw new IllegalStateException("Expired hold " + booking.pnr() + " cannot be cancelled");
    }

    @Override
    public void expire(Booking booking) {
        throw new IllegalStateException("Hold " + booking.pnr() + " is already expired");
    }

    @Override
    public BookingStatus status() {
        return BookingStatus.EXPIRED;
    }
}

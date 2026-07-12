package com.you.lld.problems.hotelbooking.model;

/**
 * Terminal state — the stay completed normally. No further transitions; the
 * reservation no longer blocks availability.
 */
public final class CheckedOutState implements ReservationState {

    public static final CheckedOutState INSTANCE = new CheckedOutState();

    private CheckedOutState() {
    }

    @Override
    public ReservationStatus status() {
        return ReservationStatus.CHECKED_OUT;
    }

    @Override
    public void checkIn(Reservation reservation) {
        throw new IllegalStateException("stay already completed");
    }

    @Override
    public void checkOut(Reservation reservation) {
        throw new IllegalStateException("already checked out");
    }

    @Override
    public void cancel(Reservation reservation) {
        throw new IllegalStateException("cannot cancel a completed stay");
    }

    @Override
    public void markNoShow(Reservation reservation) {
        throw new IllegalStateException("stay already completed");
    }
}

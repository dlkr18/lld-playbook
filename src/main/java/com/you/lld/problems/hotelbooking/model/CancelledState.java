package com.you.lld.problems.hotelbooking.model;

/**
 * Terminal state — the reservation was cancelled before check-in. It stops
 * blocking availability, which is what frees the room's dates for re-booking.
 */
public final class CancelledState implements ReservationState {

    public static final CancelledState INSTANCE = new CancelledState();

    private CancelledState() {
    }

    @Override
    public ReservationStatus status() {
        return ReservationStatus.CANCELLED;
    }

    @Override
    public void checkIn(Reservation reservation) {
        throw new IllegalStateException("reservation was cancelled");
    }

    @Override
    public void checkOut(Reservation reservation) {
        throw new IllegalStateException("reservation was cancelled");
    }

    @Override
    public void cancel(Reservation reservation) {
        throw new IllegalStateException("already cancelled");
    }

    @Override
    public void markNoShow(Reservation reservation) {
        throw new IllegalStateException("reservation was cancelled");
    }
}

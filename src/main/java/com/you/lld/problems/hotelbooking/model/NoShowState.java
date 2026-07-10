package com.you.lld.problems.hotelbooking.model;

/**
 * Terminal state — the guest never arrived. Like {@link CancelledState} it stops
 * blocking availability (so the room can be resold or reported), but it is a
 * distinct status for billing / analytics (a no-show may still be charged).
 */
public final class NoShowState implements ReservationState {

    public static final NoShowState INSTANCE = new NoShowState();

    private NoShowState() {
    }

    @Override
    public ReservationStatus status() {
        return ReservationStatus.NO_SHOW;
    }

    @Override
    public void checkIn(Reservation reservation) {
        throw new IllegalStateException("reservation marked no-show");
    }

    @Override
    public void checkOut(Reservation reservation) {
        throw new IllegalStateException("reservation marked no-show");
    }

    @Override
    public void cancel(Reservation reservation) {
        throw new IllegalStateException("reservation marked no-show");
    }

    @Override
    public void markNoShow(Reservation reservation) {
        throw new IllegalStateException("already marked no-show");
    }
}

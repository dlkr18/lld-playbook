package com.you.lld.problems.hotelbooking.model;

/**
 * The guest has arrived and occupies the room. Still blocks availability. The
 * only legal next step is check-out; cancelling or marking no-show now is
 * illegal (they have already shown up).
 */
public final class CheckedInState implements ReservationState {

    public static final CheckedInState INSTANCE = new CheckedInState();

    private CheckedInState() {
    }

    @Override
    public ReservationStatus status() {
        return ReservationStatus.CHECKED_IN;
    }

    @Override
    public void checkIn(Reservation reservation) {
        throw new IllegalStateException("already checked in");
    }

    @Override
    public void checkOut(Reservation reservation) {
        reservation.setState(CheckedOutState.INSTANCE);
    }

    @Override
    public void cancel(Reservation reservation) {
        throw new IllegalStateException("cannot cancel a checked-in stay; check out instead");
    }

    @Override
    public void markNoShow(Reservation reservation) {
        throw new IllegalStateException("guest has checked in; not a no-show");
    }
}

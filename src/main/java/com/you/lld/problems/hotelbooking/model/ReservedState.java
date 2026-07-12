package com.you.lld.problems.hotelbooking.model;

/**
 * Initial state after a successful reservation. The room is held for the guest
 * and this reservation blocks availability for its date range. From here the
 * guest can check in, cancel, or be marked a no-show.
 */
public final class ReservedState implements ReservationState {

    public static final ReservedState INSTANCE = new ReservedState();

    private ReservedState() {
    }

    @Override
    public ReservationStatus status() {
        return ReservationStatus.RESERVED;
    }

    @Override
    public void checkIn(Reservation reservation) {
        reservation.setState(CheckedInState.INSTANCE);
    }

    @Override
    public void checkOut(Reservation reservation) {
        throw new IllegalStateException("cannot check out before checking in");
    }

    @Override
    public void cancel(Reservation reservation) {
        reservation.setState(CancelledState.INSTANCE);
    }

    @Override
    public void markNoShow(Reservation reservation) {
        reservation.setState(NoShowState.INSTANCE);
    }
}

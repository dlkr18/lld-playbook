package com.you.lld.problems.carrental.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Initial state: the car is booked but not yet collected. Legal transitions:
 * {@code pickUp} -> PICKED_UP, {@code cancel} -> CANCELLED.
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
    public void pickUp(Reservation reservation, LocalDateTime at) {
        reservation.markPickedUp(at);
        reservation.setState(PickedUpState.INSTANCE);
    }

    @Override
    public Charges returnCar(Reservation reservation, LocalDateTime at, BigDecimal lateFee) {
        throw new IllegalStateException(
                "Cannot return reservation " + reservation.getId() + ": it was never picked up");
    }

    @Override
    public void cancel(Reservation reservation) {
        reservation.setState(CancelledState.INSTANCE);
    }
}

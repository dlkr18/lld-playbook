package com.you.lld.problems.carrental.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Active-rental state: the customer holds the car. Legal transition:
 * {@code returnCar} -> RETURNED. Cannot be cancelled (must be returned) and
 * cannot be picked up again.
 */
public final class PickedUpState implements ReservationState {

    public static final PickedUpState INSTANCE = new PickedUpState();

    private PickedUpState() {
    }

    @Override
    public ReservationStatus status() {
        return ReservationStatus.PICKED_UP;
    }

    @Override
    public void pickUp(Reservation reservation, LocalDateTime at) {
        throw new IllegalStateException(
                "Reservation " + reservation.getId() + " is already picked up");
    }

    @Override
    public Charges returnCar(Reservation reservation, LocalDateTime at, BigDecimal lateFee) {
        Charges charges = new Charges(reservation.getBaseCost(), lateFee);
        reservation.markReturned(at, charges);
        reservation.setState(ReturnedState.INSTANCE);
        return charges;
    }

    @Override
    public void cancel(Reservation reservation) {
        throw new IllegalStateException(
                "Reservation " + reservation.getId() + " is an active rental; return the car instead of cancelling");
    }
}

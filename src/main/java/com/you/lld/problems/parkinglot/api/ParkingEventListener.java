package com.you.lld.problems.parkinglot.api;

import com.you.lld.problems.parkinglot.model.ParkingTicket;
import com.you.lld.problems.parkinglot.model.Payment;
import com.you.lld.problems.parkinglot.model.Vehicle;
import com.you.lld.problems.parkinglot.model.VehicleType;

/**
 * Observer hook for parking lifecycle events.
 *
 * The service fans out to every registered listener on state transitions.
 * Default methods allow listeners to override only what they care about.
 *
 * Listeners should be non-blocking — the service iterates synchronously.
 * Heavy work should be pushed onto the listener's own executor.
 */
public interface ParkingEventListener {

    default void onVehicleEntered(ParkingTicket ticket) {}

    default void onVehicleExited(ParkingTicket ticket, Payment payment) {}

    /** Fired when allocation fails because no compatible space is available. */
    default void onLotFull(Vehicle vehicle, VehicleType vehicleType) {}
}

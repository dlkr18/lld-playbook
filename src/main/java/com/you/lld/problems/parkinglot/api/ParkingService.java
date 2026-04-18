package com.you.lld.problems.parkinglot.api;

import com.you.lld.common.Money;
import com.you.lld.problems.parkinglot.api.exceptions.InvalidTicketException;
import com.you.lld.problems.parkinglot.api.exceptions.InvalidVehicleException;
import com.you.lld.problems.parkinglot.api.exceptions.ParkingFullException;
import com.you.lld.problems.parkinglot.api.exceptions.PaymentFailedException;
import com.you.lld.problems.parkinglot.model.OccupancyReport;
import com.you.lld.problems.parkinglot.model.Payment;
import com.you.lld.problems.parkinglot.model.PaymentMethod;
import com.you.lld.problems.parkinglot.model.Vehicle;

/**
 * Core facade for the parking lot system.
 *
 * Orchestrates:
 *   - Vehicle entry    (allocation strategy -> atomic claim -> issue ticket)
 *   - Fee calculation  (pricing strategy)
 *   - Vehicle exit     (calc fee -> process payment -> release space -> close ticket)
 *   - Availability + occupancy reporting
 *   - Event listener registration for external observers
 *
 * Errors use the checked ParkingException hierarchy so callers must either
 * handle them explicitly or propagate them — consistent with the business
 * rules of a real-world parking system.
 */
public interface ParkingService {

    /**
     * Allocate a space and issue a ticket.
     * @throws ParkingFullException    if no compatible space is available
     * @throws InvalidVehicleException if the vehicle is null, has no license, or is already inside
     */
    ParkingTicketResult enterVehicle(Vehicle vehicle)
        throws ParkingFullException, InvalidVehicleException;

    /**
     * Calculate fee (pricing strategy) and process payment; vacate on success.
     * @throws InvalidTicketException  if the ticket is unknown or already closed
     * @throws PaymentFailedException  if the payment gateway rejects
     */
    Payment exitVehicle(String ticketId, PaymentMethod paymentMethod)
        throws InvalidTicketException, PaymentFailedException;

    /** Read-only fee preview using the current pricing strategy. */
    Money calculateParkingFee(String ticketId) throws InvalidTicketException;

    /** True if at least one compatible-and-unoccupied space exists for this vehicle. */
    boolean checkAvailability(Vehicle vehicle);

    /** Snapshot of current lot occupancy. */
    OccupancyReport getOccupancyReport();

    /** Register an observer. Listeners are invoked synchronously in registration order. */
    void addEventListener(ParkingEventListener listener);

    /** Remove a previously registered listener. No-op if not registered. */
    void removeEventListener(ParkingEventListener listener);
}

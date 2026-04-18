package com.you.lld.problems.parkinglot.impl;

import com.you.lld.problems.parkinglot.api.ParkingEventListener;
import com.you.lld.problems.parkinglot.model.ParkingTicket;
import com.you.lld.problems.parkinglot.model.Payment;
import com.you.lld.problems.parkinglot.model.Vehicle;
import com.you.lld.problems.parkinglot.model.VehicleType;

/**
 * Audit-style listener that prints every lifecycle event.
 * Useful for demos and debugging; in prod you'd replace with a metrics/logging sink.
 */
public class LoggingEventListener implements ParkingEventListener {

    @Override
    public void onVehicleEntered(ParkingTicket ticket) {
        System.out.println("[event] entered: " + ticket.getVehicle().getLicenseNumber()
            + " -> " + ticket.getParkingSpace().getSpaceId()
            + " (ticket " + ticket.getTicketId() + ")");
    }

    @Override
    public void onVehicleExited(ParkingTicket ticket, Payment payment) {
        System.out.println("[event] exited: " + ticket.getVehicle().getLicenseNumber()
            + " from " + ticket.getParkingSpace().getSpaceId()
            + " paid " + payment.getAmount()
            + " via " + payment.getPaymentMethod());
    }

    @Override
    public void onLotFull(Vehicle vehicle, VehicleType vehicleType) {
        System.out.println("[event] lot full for vehicle type " + vehicleType
            + " (vehicle " + (vehicle != null ? vehicle.getLicenseNumber() : "?") + ")");
    }
}

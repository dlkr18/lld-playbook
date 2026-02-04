package com.you.lld.problems.parkinglot.event;

import com.you.lld.problems.parkinglot.model.ParkingTicket;

/**
 * Event triggered when a vehicle exits the parking lot.
 */
public class VehicleExitEvent extends ParkingEvent {
    
    private final double parkingFee;
    
    public VehicleExitEvent(ParkingTicket ticket, double parkingFee) {
        super(ticket);
        this.parkingFee = parkingFee;
    }
    
    public double getParkingFee() {
        return parkingFee;
    }
    
    @Override
    public String getEventType() {
        return "VEHICLE_EXIT";
    }
    
    @Override
    public String toString() {
        return "VehicleExitEvent{" +
                "ticketId='" + getTicket().getId() + '\'' +
                ", vehicle='" + getTicket().getVehicle().getLicensePlate() + '\'' +
                ", fee=" + parkingFee +
                ", timestamp=" + getTimestamp() +
                '}';
    }
}

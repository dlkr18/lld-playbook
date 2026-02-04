package com.you.lld.problems.parkinglot.event;

import com.you.lld.problems.parkinglot.model.ParkingTicket;

/**
 * Event triggered when a vehicle enters the parking lot.
 */
public class VehicleEntryEvent extends ParkingEvent {
    
    public VehicleEntryEvent(ParkingTicket ticket) {
        super(ticket);
    }
    
    @Override
    public String getEventType() {
        return "VEHICLE_ENTRY";
    }
    
    @Override
    public String toString() {
        return "VehicleEntryEvent{" +
                "ticketId='" + getTicket().getId() + '\'' +
                ", vehicle='" + getTicket().getVehicle().getLicensePlate() + '\'' +
                ", spaceId='" + getTicket().getSpace().getId() + '\'' +
                ", timestamp=" + getTimestamp() +
                '}';
    }
}

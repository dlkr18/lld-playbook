package com.you.lld.problems.parkinglot.mapper;

import com.you.lld.problems.parkinglot.dto.ParkingResponse;
import com.you.lld.problems.parkinglot.model.ParkingTicket;

/**
 * Mapper for converting between ParkingTicket and DTOs.
 */
public class ParkingMapper {
    
    /**
     * Convert ParkingTicket to ParkingResponse DTO.
     */
    public static ParkingResponse toResponse(ParkingTicket ticket) {
        ParkingResponse response = new ParkingResponse();
        
        response.setTicketId(ticket.getId());
        response.setLicensePlate(ticket.getVehicle().getLicensePlate());
        response.setVehicleType(ticket.getVehicle().getVehicleType());
        response.setSpaceId(ticket.getSpace().getId());
        response.setFloor(ticket.getSpace().getFloor());
        response.setEntryTime(ticket.getEntryTime());
        response.setExitTime(ticket.getExitTime());
        
        // Set parking fee if payment exists
        if (ticket.getPayment() != null) {
            response.setParkingFee(
                ticket.getPayment().getAmount().toBigDecimal().doubleValue()
            );
            response.setCurrency(
                ticket.getPayment().getAmount().currency().getCurrencyCode()
            );
        }
        
        // Set status
        if (ticket.getExitTime() == null) {
            response.setStatus("ACTIVE");
        } else {
            response.setStatus("COMPLETED");
        }
        
        return response;
    }
    
    /**
     * Convert to simple response (for listings).
     */
    public static ParkingResponse toSimpleResponse(ParkingTicket ticket) {
        ParkingResponse response = new ParkingResponse();
        
        response.setTicketId(ticket.getId());
        response.setLicensePlate(ticket.getVehicle().getLicensePlate());
        response.setVehicleType(ticket.getVehicle().getVehicleType());
        response.setSpaceId(ticket.getSpace().getId());
        response.setFloor(ticket.getSpace().getFloor());
        response.setEntryTime(ticket.getEntryTime());
        response.setStatus(ticket.getExitTime() == null ? "ACTIVE" : "COMPLETED");
        
        return response;
    }
}

package com.you.lld.problems.parkinglot.factory;

import com.you.lld.problems.parkinglot.model.ParkingSpace;
import com.you.lld.problems.parkinglot.model.ParkingTicket;
import com.you.lld.problems.parkinglot.model.Vehicle;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Factory for creating ParkingTicket objects.
 */
public class ParkingTicketFactory {
    
    /**
     * Create a new parking ticket.
     */
    public static ParkingTicket createTicket(Vehicle vehicle, ParkingSpace space) {
        String ticketId = generateTicketId();
        LocalDateTime entryTime = LocalDateTime.now();
        
        return new ParkingTicket(ticketId, vehicle, space, entryTime);
    }
    
    /**
     * Generate unique ticket ID.
     * Format: TKT-{timestamp}-{random}
     */
    private static String generateTicketId() {
        long timestamp = System.currentTimeMillis();
        String random = UUID.randomUUID().toString().substring(0, 8);
        return "TKT-" + timestamp + "-" + random;
    }
    
    /**
     * Create ticket with specific ID (for testing).
     */
    public static ParkingTicket createTicketWithId(
            String ticketId, 
            Vehicle vehicle, 
            ParkingSpace space,
            LocalDateTime entryTime) {
        return new ParkingTicket(ticketId, vehicle, space, entryTime);
    }
}

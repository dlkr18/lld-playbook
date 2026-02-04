package com.you.lld.problems.parkinglot.event;

import com.you.lld.problems.parkinglot.model.ParkingTicket;

import java.time.LocalDateTime;

/**
 * Base class for parking-related events.
 */
public abstract class ParkingEvent {
    
    private final String eventId;
    private final LocalDateTime timestamp;
    private final ParkingTicket ticket;
    
    protected ParkingEvent(ParkingTicket ticket) {
        this.eventId = java.util.UUID.randomUUID().toString();
        this.timestamp = LocalDateTime.now();
        this.ticket = ticket;
    }
    
    public String getEventId() { return eventId; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public ParkingTicket getTicket() { return ticket; }
    
    public abstract String getEventType();
}

package com.you.lld.problems.bookmyshow.event;

import com.you.lld.problems.bookmyshow.model.Booking;

import java.time.LocalDateTime;

/**
 * Base class for booking-related events.
 * Enables event-driven architecture for notifications, analytics, etc.
 */
public abstract class BookingEvent {
    
    private final String eventId;
    private final LocalDateTime timestamp;
    private final Booking booking;
    
    protected BookingEvent(Booking booking) {
        this.eventId = java.util.UUID.randomUUID().toString();
        this.timestamp = LocalDateTime.now();
        this.booking = booking;
    }
    
    public String getEventId() { return eventId; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public Booking getBooking() { return booking; }
    
    public abstract String getEventType();
}

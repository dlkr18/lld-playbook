package com.you.lld.problems.bookmyshow.event;

import com.you.lld.problems.bookmyshow.model.Booking;

/**
 * Event triggered when a booking is cancelled.
 */
public class BookingCancelledEvent extends BookingEvent {
    
    private final String reason;
    
    public BookingCancelledEvent(Booking booking, String reason) {
        super(booking);
        this.reason = reason;
    }
    
    public String getReason() {
        return reason;
    }
    
    @Override
    public String getEventType() {
        return "BOOKING_CANCELLED";
    }
    
    @Override
    public String toString() {
        return "BookingCancelledEvent{" +
                "bookingId='" + getBooking().getId() + '\'' +
                ", reason='" + reason + '\'' +
                ", timestamp=" + getTimestamp() +
                '}';
    }
}

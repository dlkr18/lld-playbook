package com.you.lld.problems.bookmyshow.event;

import com.you.lld.problems.bookmyshow.model.Booking;

/**
 * Event triggered when a booking is confirmed.
 */
public class BookingConfirmedEvent extends BookingEvent {
    
    private final String paymentId;
    
    public BookingConfirmedEvent(Booking booking, String paymentId) {
        super(booking);
        this.paymentId = paymentId;
    }
    
    public String getPaymentId() {
        return paymentId;
    }
    
    @Override
    public String getEventType() {
        return "BOOKING_CONFIRMED";
    }
    
    @Override
    public String toString() {
        return "BookingConfirmedEvent{" +
                "bookingId='" + getBooking().getId() + '\'' +
                ", paymentId='" + paymentId + '\'' +
                ", timestamp=" + getTimestamp() +
                '}';
    }
}

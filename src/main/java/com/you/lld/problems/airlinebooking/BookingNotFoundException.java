package com.you.lld.problems.airlinebooking;

/**
 * Thrown when a PNR does not correspond to any known booking.
 */
public class BookingNotFoundException extends RuntimeException {

    public BookingNotFoundException(String message) {
        super(message);
    }
}

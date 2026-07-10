package com.you.lld.problems.airlinebooking;

/**
 * Thrown when a seat cannot be held or confirmed because another passenger
 * already holds/booked it, or because the caller's hold has expired.
 */
public class SeatUnavailableException extends RuntimeException {

    public SeatUnavailableException(String message) {
        super(message);
    }
}

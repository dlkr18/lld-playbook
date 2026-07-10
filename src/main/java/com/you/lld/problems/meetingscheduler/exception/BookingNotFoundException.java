package com.you.lld.problems.meetingscheduler.exception;

/** Thrown when cancelling / looking up a booking id that does not exist. */
public class BookingNotFoundException extends RuntimeException {
    public BookingNotFoundException(String bookingId) {
        super("no booking with id '" + bookingId + "'");
    }
}

package com.you.lld.problems.meetingscheduler.exception;

/**
 * Thrown when a requested interval overlaps an existing confirmed booking in the
 * target room. Unchecked: callers that "try to book" should expect this and it
 * should not force a checked-exception signature through every layer.
 */
public class BookingConflictException extends RuntimeException {
    public BookingConflictException(String message) {
        super(message);
    }
}

package com.you.lld.problems.hotelbooking;

/**
 * Thrown when a room cannot be reserved because it is already booked for an
 * overlapping date range (or, for {@code reserveAny}, when no room of the
 * requested type is free for the dates).
 */
public class RoomNotAvailableException extends RuntimeException {

    public RoomNotAvailableException(String message) {
        super(message);
    }
}

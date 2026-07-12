package com.you.lld.problems.meetingscheduler.exception;

/** Thrown when {@code bookAny}/suggestion cannot find any room satisfying the request. */
public class NoRoomAvailableException extends RuntimeException {
    public NoRoomAvailableException(String message) {
        super(message);
    }
}

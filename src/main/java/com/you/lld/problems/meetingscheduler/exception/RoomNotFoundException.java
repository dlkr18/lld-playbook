package com.you.lld.problems.meetingscheduler.exception;

/** Thrown when an operation references a room id that was never registered. */
public class RoomNotFoundException extends RuntimeException {
    public RoomNotFoundException(String roomId) {
        super("no room registered with id '" + roomId + "'");
    }
}

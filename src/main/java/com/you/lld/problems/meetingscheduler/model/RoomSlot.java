package com.you.lld.problems.meetingscheduler.model;

/**
 * Immutable pairing of a candidate {@link Room} with a concrete free
 * {@link TimeInterval} in it. This is the unit an
 * {@code AllocationStrategy} chooses between — both "which room for a fixed
 * interval" and "which (room, earliest-slot)" reduce to picking one of these.
 */
public final class RoomSlot {

    private final Room room;
    private final TimeInterval slot;

    public RoomSlot(Room room, TimeInterval slot) {
        if (room == null) {
            throw new IllegalArgumentException("room must not be null");
        }
        if (slot == null) {
            throw new IllegalArgumentException("slot must not be null");
        }
        this.room = room;
        this.slot = slot;
    }

    public Room getRoom() {
        return room;
    }

    public TimeInterval getSlot() {
        return slot;
    }

    @Override
    public String toString() {
        return room.getId() + "@" + slot;
    }
}

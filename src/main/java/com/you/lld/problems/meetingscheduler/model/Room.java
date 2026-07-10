package com.you.lld.problems.meetingscheduler.model;

/**
 * Immutable meeting room. Identity is {@code id}; capacity and location are
 * descriptive attributes used by allocation strategies and the capacity filter.
 */
public final class Room {

    private final String id;
    private final int capacity;
    private final String location;

    public Room(String id, int capacity, String location) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("room id must not be blank");
        }
        if (capacity <= 0) {
            throw new IllegalArgumentException("capacity must be positive");
        }
        if (location == null || location.trim().isEmpty()) {
            throw new IllegalArgumentException("location must not be blank");
        }
        this.id = id;
        this.capacity = capacity;
        this.location = location;
    }

    public String getId() {
        return id;
    }

    public int getCapacity() {
        return capacity;
    }

    public String getLocation() {
        return location;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return id.equals(((Room) o).id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @Override
    public String toString() {
        return "Room{" + id + ", cap=" + capacity + ", @" + location + "}";
    }
}

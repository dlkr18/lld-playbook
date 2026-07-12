package com.you.lld.problems.hotelbooking.model;

/**
 * A physical, bookable room in a {@link Hotel}. Immutable identity object; the
 * room itself holds no reservation state — availability is derived from the set
 * of reservations against it (kept in the orchestrator), which keeps the entity
 * free of business logic and makes concurrency reasoning explicit.
 */
public final class Room {

    private final String id;
    private final String hotelId;
    private final RoomType type;

    public Room(String id, String hotelId, RoomType type) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("room id required");
        }
        if (hotelId == null || hotelId.trim().isEmpty()) {
            throw new IllegalArgumentException("hotelId required");
        }
        if (type == null) {
            throw new IllegalArgumentException("room type required");
        }
        this.id = id;
        this.hotelId = hotelId;
        this.type = type;
    }

    public String id() {
        return id;
    }

    public String hotelId() {
        return hotelId;
    }

    public RoomType type() {
        return type;
    }

    public int capacity() {
        return type.capacity();
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
        return "Room{" + id + ", " + type + ", cap=" + capacity() + "}";
    }
}

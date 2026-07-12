package com.you.lld.problems.hotelbooking.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * A hotel and its rooms. Rooms are grouped logically by {@link RoomType} via
 * {@link #roomsOfType(RoomType)}. Immutable after construction (the room set is
 * fixed for the lifetime of the hotel object), so it can be shared freely.
 */
public final class Hotel {

    private final String id;
    private final String name;
    private final List<Room> rooms;

    public Hotel(String id, String name, List<Room> rooms) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("hotel id required");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("hotel name required");
        }
        if (rooms == null || rooms.isEmpty()) {
            throw new IllegalArgumentException("hotel must have at least one room");
        }
        this.id = id;
        this.name = name;
        this.rooms = Collections.unmodifiableList(new ArrayList<Room>(rooms));
    }

    public String id() {
        return id;
    }

    public String name() {
        return name;
    }

    public List<Room> rooms() {
        return rooms;
    }

    public List<Room> roomsOfType(RoomType type) {
        List<Room> result = new ArrayList<Room>();
        for (Room room : rooms) {
            if (room.type() == type) {
                result.add(room);
            }
        }
        return result;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return id.equals(((Hotel) o).id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @Override
    public String toString() {
        return "Hotel{" + id + ", " + name + ", rooms=" + rooms.size() + "}";
    }
}

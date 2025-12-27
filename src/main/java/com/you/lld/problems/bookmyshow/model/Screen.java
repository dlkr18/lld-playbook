package com.you.lld.problems.bookmyshow.model;

import java.util.List;

public class Screen {
    private final String id;
    private final String name;
    private final String theaterId;
    private final List<Seat> seats;

    public Screen(String id, String name, String theaterId, List<Seat> seats) {
        this.id = id;
        this.name = name;
        this.theaterId = theaterId;
        this.seats = seats;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getTheaterId() { return theaterId; }
    public List<Seat> getSeats() { return seats; }

    @Override
    public String toString() {
        return "Screen{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", seats=" + seats.size() +
                '}';
    }
}


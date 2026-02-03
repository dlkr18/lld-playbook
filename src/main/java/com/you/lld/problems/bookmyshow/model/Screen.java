package com.you.lld.problems.bookmyshow.model;

import java.util.ArrayList;
import java.util.List;

public class Screen {
    private final String id;
    private final String name;
    private final String theaterId;
    private List<Seat> seats;
    private final int capacity;

    public Screen(String id, String theaterId, String name, int capacity) {
        this.id = id;
        this.name = name;
        this.theaterId = theaterId;
        this.capacity = capacity;
        this.seats = new ArrayList<>();
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getTheaterId() { return theaterId; }
    public List<Seat> getSeats() { return seats; }
    public int getCapacity() { return capacity; }
    
    public void setSeats(List<Seat> seats) {
        this.seats = seats;
    }

    @Override
    public String toString() {
        return "Screen{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", seats=" + seats.size() +
                ", capacity=" + capacity +
                '}';
    }
}


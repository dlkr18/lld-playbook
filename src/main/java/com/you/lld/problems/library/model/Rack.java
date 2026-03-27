package com.you.lld.problems.library.model;

/**
 * Physical shelf location in the library.
 */
public class Rack {
    private final String id;
    private final int floor;
    private final String section;

    public Rack(String id, int floor, String section) {
        this.id = id;
        this.floor = floor;
        this.section = section;
    }

    public String getId() { return id; }
    public int getFloor() { return floor; }
    public String getSection() { return section; }

    @Override
    public String toString() {
        return "Rack[" + id + ", floor=" + floor + ", section=" + section + "]";
    }
}

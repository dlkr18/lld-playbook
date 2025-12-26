package com.you.lld.problems.elevator.model;

public class Request {
    private final int floor;
    private final Direction direction;
    private final long timestamp;
    
    public Request(int floor, Direction direction) {
        this.floor = floor;
        this.direction = direction;
        this.timestamp = System.currentTimeMillis();
    }
    
    public int getFloor() { return floor; }
    public Direction getDirection() { return direction; }
    public long getTimestamp() { return timestamp; }
    
    @Override
    public String toString() {
        return "Request{floor=" + floor + ", direction=" + direction + "}";
    }
}

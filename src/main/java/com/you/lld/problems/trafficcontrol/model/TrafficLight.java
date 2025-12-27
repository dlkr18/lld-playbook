package com.you.lld.problems.trafficcontrol.model;

public class TrafficLight {
    private final String id;
    private final String intersectionId;
    private final Direction direction;
    private Signal currentSignal;
    private int greenDuration;
    private int yellowDuration;
    private int redDuration;
    
    public TrafficLight(String id, String intersectionId, Direction direction) {
        this.id = id;
        this.intersectionId = intersectionId;
        this.direction = direction;
        this.currentSignal = Signal.RED;
        this.greenDuration = 30;
        this.yellowDuration = 5;
        this.redDuration = 35;
    }
    
    public void changeSignal(Signal signal) {
        this.currentSignal = signal;
        System.out.println("Light " + id + " (" + direction + "): " + signal);
    }
    
    public String getId() { return id; }
    public Direction getDirection() { return direction; }
    public Signal getCurrentSignal() { return currentSignal; }
    public int getGreenDuration() { return greenDuration; }
    public int getYellowDuration() { return yellowDuration; }
    public int getRedDuration() { return redDuration; }
    
    @Override
    public String toString() {
        return "TrafficLight{id='" + id + "', direction=" + direction + 
               ", signal=" + currentSignal + "}";
    }
}

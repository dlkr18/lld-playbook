package com.you.lld.problems.trafficcontrol;
public class TrafficLight {
    public enum Signal { RED, YELLOW, GREEN }
    
    private final String id;
    private Signal currentSignal;
    private int duration;
    
    public TrafficLight(String id) {
        this.id = id;
        this.currentSignal = Signal.RED;
        this.duration = 30;
    }
    
    public String getId() { return id; }
    public Signal getCurrentSignal() { return currentSignal; }
    public void setSignal(Signal signal) { this.currentSignal = signal; }
    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
}

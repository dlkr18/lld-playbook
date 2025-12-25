package com.you.lld.problems.ridehailing;
public class Rider {
    private final String riderId;
    private String name;
    private String location;
    
    public Rider(String riderId, String name, String location) {
        this.riderId = riderId;
        this.name = name;
        this.location = location;
    }
    
    public String getRiderId() { return riderId; }
    public String getName() { return name; }
    public String getLocation() { return location; }
}

package com.you.lld.problems.trafficcontrol.model;

import java.util.*;

public class Intersection {
    private final String id;
    private final String name;
    private final Map<Direction, TrafficLight> lights;
    private boolean emergencyMode;
    
    public Intersection(String id, String name) {
        this.id = id;
        this.name = name;
        this.lights = new HashMap<>();
        this.emergencyMode = false;
        initializeLights();
    }
    
    private void initializeLights() {
        for (Direction direction : Direction.values()) {
            String lightId = id + "_" + direction;
            lights.put(direction, new TrafficLight(lightId, id, direction));
        }
    }
    
    public void setEmergencyMode(boolean emergency) {
        this.emergencyMode = emergency;
        if (emergency) {
            for (TrafficLight light : lights.values()) {
                light.changeSignal(Signal.RED);
            }
        }
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public Map<Direction, TrafficLight> getLights() { return new HashMap<>(lights); }
    public boolean isEmergencyMode() { return emergencyMode; }
    
    @Override
    public String toString() {
        return "Intersection{id='" + id + "', name='" + name + "', emergency=" + emergencyMode + "}";
    }
}

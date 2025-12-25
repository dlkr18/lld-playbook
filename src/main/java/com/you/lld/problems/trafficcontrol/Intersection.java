package com.you.lld.problems.trafficcontrol;
import java.util.*;

public class Intersection {
    private final String id;
    private final List<TrafficLight> lights;
    
    public Intersection(String id) {
        this.id = id;
        this.lights = new ArrayList<>();
    }
    
    public void addLight(TrafficLight light) {
        lights.add(light);
    }
    
    public void manageLights() {
        // Simple round-robin: one green at a time
        for (int i = 0; i < lights.size(); i++) {
            for (int j = 0; j < lights.size(); j++) {
                lights.get(j).setSignal(i == j ? TrafficLight.Signal.GREEN : TrafficLight.Signal.RED);
            }
        }
    }
}

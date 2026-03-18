package com.you.lld.problems.trafficcontrol.impl;

import com.you.lld.problems.trafficcontrol.api.TrafficController;
import com.you.lld.problems.trafficcontrol.model.*;
import java.util.*;
import java.util.concurrent.*;

public class TrafficControllerImpl implements TrafficController {
    private final Map<String, Intersection> intersections = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    private ScheduledFuture<?> cycleTask;
    
    public void addIntersection(Intersection intersection) {
        intersections.put(intersection.getId(), intersection);
    }
    
    @Override
    public void startCycle() {
        if (cycleTask != null && !cycleTask.isDone()) {
            return;
        }
        
        cycleTask = scheduler.scheduleAtFixedRate(() -> {
            for (Intersection intersection : intersections.values()) {
                if (!intersection.isEmergencyMode()) {
                    cycleLights(intersection);
                }
            }
        }, 0, 10, TimeUnit.SECONDS);
        
        System.out.println("Traffic cycle started");
    }
    
    /**
     * Non-blocking light cycle: toggles between N-S and E-W green on each invocation.
     * No Thread.sleep() -- relies on the scheduler's fixed-rate interval.
     * Light changes are synchronized on the intersection to prevent concurrent modification.
     */
    private void cycleLights(Intersection intersection) {
        Map<Direction, TrafficLight> lights = intersection.getLights();
        synchronized (intersection) {
            Signal northSignal = lights.get(Direction.NORTH).getCurrentSignal();
            if (northSignal == Signal.GREEN || northSignal == Signal.YELLOW) {
                // Switch to East-West green
                lights.get(Direction.NORTH).changeSignal(Signal.RED);
                lights.get(Direction.SOUTH).changeSignal(Signal.RED);
                lights.get(Direction.EAST).changeSignal(Signal.GREEN);
                lights.get(Direction.WEST).changeSignal(Signal.GREEN);
            } else {
                // Switch to North-South green
                lights.get(Direction.NORTH).changeSignal(Signal.GREEN);
                lights.get(Direction.SOUTH).changeSignal(Signal.GREEN);
                lights.get(Direction.EAST).changeSignal(Signal.RED);
                lights.get(Direction.WEST).changeSignal(Signal.RED);
            }
        }
    }
    
    @Override
    public void stopCycle() {
        if (cycleTask != null) {
            cycleTask.cancel(false);
            System.out.println("Traffic cycle stopped");
        }
    }
    
    @Override
    public void enableEmergencyMode(String intersectionId) {
        Intersection intersection = intersections.get(intersectionId);
        if (intersection != null) {
            intersection.setEmergencyMode(true);
            System.out.println("Emergency mode enabled for " + intersectionId);
        }
    }
    
    @Override
    public void disableEmergencyMode(String intersectionId) {
        Intersection intersection = intersections.get(intersectionId);
        if (intersection != null) {
            intersection.setEmergencyMode(false);
            System.out.println("Emergency mode disabled for " + intersectionId);
        }
    }
    
    @Override
    public Intersection getIntersection(String intersectionId) {
        return intersections.get(intersectionId);
    }
    
    public void shutdown() {
        stopCycle();
        scheduler.shutdown();
    }
}

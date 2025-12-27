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
    
    private void cycleLights(Intersection intersection) {
        Map<Direction, TrafficLight> lights = intersection.getLights();
        
        // North-South green
        lights.get(Direction.NORTH).changeSignal(Signal.GREEN);
        lights.get(Direction.SOUTH).changeSignal(Signal.GREEN);
        lights.get(Direction.EAST).changeSignal(Signal.RED);
        lights.get(Direction.WEST).changeSignal(Signal.RED);
        
        try {
            Thread.sleep(5000);
            
            // Yellow transition
            lights.get(Direction.NORTH).changeSignal(Signal.YELLOW);
            lights.get(Direction.SOUTH).changeSignal(Signal.YELLOW);
            Thread.sleep(2000);
            
            // East-West green
            lights.get(Direction.NORTH).changeSignal(Signal.RED);
            lights.get(Direction.SOUTH).changeSignal(Signal.RED);
            lights.get(Direction.EAST).changeSignal(Signal.GREEN);
            lights.get(Direction.WEST).changeSignal(Signal.GREEN);
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
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

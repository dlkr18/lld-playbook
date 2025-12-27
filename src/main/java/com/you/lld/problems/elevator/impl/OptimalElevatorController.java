package com.you.lld.problems.elevator.impl;

import com.you.lld.problems.elevator.api.ElevatorController;
import com.you.lld.problems.elevator.model.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Elevator Controller using SCAN algorithm
 * 
 * Strategy:
 * - Assign request to nearest elevator moving in same direction
 * - If no elevator moving in that direction, assign to nearest idle elevator
 * - Uses SCAN (elevator continues in same direction until no more requests)
 */
public class OptimalElevatorController implements ElevatorController {
    
    private final Map<Integer, Elevator> elevators = new ConcurrentHashMap<>();
    private final Queue<Request> pendingRequests = new LinkedList<>();
    private final int minFloor;
    private final int maxFloor;
    
    public OptimalElevatorController(int numElevators, int minFloor, int maxFloor) {
        this.minFloor = minFloor;
        this.maxFloor = maxFloor;
        
        for (int i = 0; i < numElevators; i++) {
            elevators.put(i, new Elevator(i, minFloor, maxFloor));
        }
    }
    
    @Override
    public void requestElevator(int floor, Direction direction) {
        Request request = new Request(floor, direction);
        System.out.println("📞 Request: " + request);
        
        Elevator best = findBestElevator(floor, direction);
        if (best != null) {
            best.addDestination(floor);
            System.out.println("   → Assigned to Elevator " + best.getId());
        } else {
            pendingRequests.offer(request);
            System.out.println("   → Queued (no elevator available)");
        }
    }
    
    @Override
    public void selectFloor(int elevatorId, int floor) {
        Elevator elevator = elevators.get(elevatorId);
        if (elevator != null) {
            elevator.addDestination(floor);
            System.out.println("🎯 Elevator " + elevatorId + " → Floor " + floor);
        }
    }
    
    @Override
    public Elevator getElevatorStatus(int elevatorId) {
        return elevators.get(elevatorId);
    }
    
    @Override
    public void step() {
        // Move all elevators
        for (Elevator elevator : elevators.values()) {
            elevator.moveToNextFloor();
        }
        
        // Process pending requests
        while (!pendingRequests.isEmpty()) {
            Request request = pendingRequests.peek();
            Elevator best = findBestElevator(request.getFloor(), request.getDirection());
            if (best != null) {
                pendingRequests.poll();
                best.addDestination(request.getFloor());
            } else {
                break;
            }
        }
    }
    
    private Elevator findBestElevator(int floor, Direction direction) {
        Elevator bestMoving = null;
        int bestMovingDistance = Integer.MAX_VALUE;
        
        Elevator bestIdle = null;
        int bestIdleDistance = Integer.MAX_VALUE;
        
        for (Elevator elevator : elevators.values()) {
            int distance = elevator.distanceToFloor(floor);
            
            if (elevator.isIdle()) {
                if (distance < bestIdleDistance) {
                    bestIdle = elevator;
                    bestIdleDistance = distance;
                }
            } else if (elevator.getDirection() == direction) {
                // Check if elevator is moving toward this floor
                boolean movingToward = (direction == Direction.UP && 
                                       elevator.getCurrentFloor() <= floor) ||
                                      (direction == Direction.DOWN && 
                                       elevator.getCurrentFloor() >= floor);
                if (movingToward && distance < bestMovingDistance) {
                    bestMoving = elevator;
                    bestMovingDistance = distance;
                }
            }
        }
        
        return bestMoving != null ? bestMoving : bestIdle;
    }
    
    public void printStatus() {
        System.out.println("📊 Elevator Status:");
        for (Elevator elevator : elevators.values()) {
            System.out.println("   " + elevator);
        }
        System.out.println();
    }
}

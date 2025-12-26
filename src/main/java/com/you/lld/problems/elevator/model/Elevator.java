package com.you.lld.problems.elevator.model;

import java.util.*;

public class Elevator {
    private final int id;
    private int currentFloor;
    private Direction direction;
    private ElevatorStatus status;
    private final Set<Integer> destinationFloors;
    private final int minFloor;
    private final int maxFloor;
    
    public Elevator(int id, int minFloor, int maxFloor) {
        this.id = id;
        this.currentFloor = 0;
        this.direction = Direction.IDLE;
        this.status = ElevatorStatus.IDLE;
        this.destinationFloors = new TreeSet<>();
        this.minFloor = minFloor;
        this.maxFloor = maxFloor;
    }
    
    public void addDestination(int floor) {
        if (floor >= minFloor && floor <= maxFloor) {
            destinationFloors.add(floor);
        }
    }
    
    public void moveToNextFloor() {
        if (destinationFloors.isEmpty()) {
            status = ElevatorStatus.IDLE;
            direction = Direction.IDLE;
            return;
        }
        
        // Determine direction
        if (direction == Direction.IDLE) {
            int nextFloor = getNextDestination();
            direction = nextFloor > currentFloor ? Direction.UP : Direction.DOWN;
        }
        
        // Move
        if (direction == Direction.UP) {
            currentFloor++;
            status = ElevatorStatus.MOVING_UP;
        } else {
            currentFloor--;
            status = ElevatorStatus.MOVING_DOWN;
        }
        
        // Check if reached destination
        if (destinationFloors.contains(currentFloor)) {
            destinationFloors.remove(currentFloor);
            System.out.println("  [Elevator " + id + "] Reached floor " + currentFloor);
        }
        
        // Check if need to change direction
        if (destinationFloors.isEmpty()) {
            direction = Direction.IDLE;
            status = ElevatorStatus.IDLE;
        } else if (direction == Direction.UP && currentFloor >= maxFloor) {
            direction = Direction.DOWN;
        } else if (direction == Direction.DOWN && currentFloor <= minFloor) {
            direction = Direction.UP;
        }
    }
    
    private int getNextDestination() {
        return destinationFloors.isEmpty() ? currentFloor : destinationFloors.iterator().next();
    }
    
    public boolean isIdle() {
        return status == ElevatorStatus.IDLE;
    }
    
    public int distanceToFloor(int floor) {
        return Math.abs(currentFloor - floor);
    }
    
    // Getters
    public int getId() { return id; }
    public int getCurrentFloor() { return currentFloor; }
    public Direction getDirection() { return direction; }
    public ElevatorStatus getStatus() { return status; }
    public Set<Integer> getDestinationFloors() { return new TreeSet<>(destinationFloors); }
    
    @Override
    public String toString() {
        return "Elevator{id=" + id + ", floor=" + currentFloor + 
               ", direction=" + direction + ", destinations=" + destinationFloors + "}";
    }
}

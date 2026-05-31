# elevator - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/elevator/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py elevator`.

## Project Structure (9 files)

```
elevator/
├── ElevatorDemo.java
├── api/ElevatorController.java
├── model/Direction.java
├── model/Elevator.java
├── model/ElevatorStatus.java
├── model/Request.java
├── impl/OptimalElevatorController.java
├── metrics/ElevatorMetrics.java
├── scheduler/ElevatorScheduler.java
```

## Source Code

### `ElevatorDemo.java`

<details>
<summary>Click to view ElevatorDemo.java</summary>

```java
package com.you.lld.problems.elevator;

import com.you.lld.problems.elevator.impl.OptimalElevatorController;
import com.you.lld.problems.elevator.model.Direction;

/**
 * Demo: Elevator system with SCAN algorithm, multi-elevator dispatch, step simulation.
 */
public class ElevatorDemo {

    public static void main(String[] args) {
        System.out.println("=== Elevator System Demo ===\n");

        // 3 elevators, floors 0–20
        OptimalElevatorController controller = new OptimalElevatorController(3, 0, 20);

        // --- Scenario 1: Basic request ---
        System.out.println("--- Scenario 1: Single request ---");
        controller.requestElevator(5, Direction.UP);
        controller.printStatus();

        // Step until elevator reaches floor 5
        for (int i = 0; i < 6; i++) {
            controller.step();
        }
        controller.printStatus();

        // --- Scenario 2: Multiple requests ---
        System.out.println("--- Scenario 2: Multiple requests ---");
        controller.requestElevator(3, Direction.UP);
        controller.requestElevator(10, Direction.DOWN);
        controller.requestElevator(15, Direction.UP);

        controller.printStatus();

        for (int i = 0; i < 16; i++) {
            controller.step();
        }
        controller.printStatus();

        // --- Scenario 3: Floor selection inside elevator ---
        System.out.println("--- Scenario 3: Passenger selects floor inside elevator ---");
        controller.selectFloor(0, 12);
        controller.selectFloor(0, 18);
        System.out.println("Elevator 0 destinations: " + 
            controller.getElevatorStatus(0).getDestinationFloors());

        for (int i = 0; i < 20; i++) {
            controller.step();
        }
        controller.printStatus();

        // --- Scenario 4: Concurrent requests from different floors ---
        System.out.println("--- Scenario 4: Rush hour simulation ---");
        controller.requestElevator(1, Direction.UP);
        controller.requestElevator(2, Direction.UP);
        controller.requestElevator(3, Direction.UP);
        controller.requestElevator(8, Direction.DOWN);
        controller.requestElevator(12, Direction.DOWN);

        // Simulate 25 steps
        for (int i = 0; i < 25; i++) {
            controller.step();
        }
        controller.printStatus();

        System.out.println("=== Demo complete ===");
    }
}
```

</details>

### `api/ElevatorController.java`

<details>
<summary>Click to view api/ElevatorController.java</summary>

```java
package com.you.lld.problems.elevator.api;

import com.you.lld.problems.elevator.model.*;

public interface ElevatorController {
    void requestElevator(int floor, Direction direction);
    void selectFloor(int elevatorId, int floor);
    Elevator getElevatorStatus(int elevatorId);
    void step(); // Simulate one time step
}
```

</details>

### `model/Direction.java`

<details>
<summary>Click to view model/Direction.java</summary>

```java
package com.you.lld.problems.elevator.model;

public enum Direction {
    UP, DOWN, IDLE
}
```

</details>

### `model/Elevator.java`

<details>
<summary>Click to view model/Elevator.java</summary>

```java
package com.you.lld.problems.elevator.model;

import java.util.*;
import java.util.concurrent.ConcurrentSkipListSet;

/**
 * Thread-safe elevator model. Uses ConcurrentSkipListSet for destinations
 * so floor requests from multiple threads are safe.
 */
public class Elevator {
    private final int id;
    private volatile int currentFloor;
    private volatile Direction direction;
    private volatile ElevatorStatus status;
    private final Set<Integer> destinationFloors;
    private final int minFloor;
    private final int maxFloor;
    
    public Elevator(int id, int minFloor, int maxFloor) {
        this.id = id;
        this.currentFloor = 0;
        this.direction = Direction.IDLE;
        this.status = ElevatorStatus.IDLE;
        this.destinationFloors = new ConcurrentSkipListSet<>();
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
```

</details>

### `model/ElevatorStatus.java`

<details>
<summary>Click to view model/ElevatorStatus.java</summary>

```java
package com.you.lld.problems.elevator.model;

public enum ElevatorStatus {
    IDLE, MOVING_UP, MOVING_DOWN, MAINTENANCE
}
```

</details>

### `model/Request.java`

<details>
<summary>Click to view model/Request.java</summary>

```java
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
```

</details>

### `impl/OptimalElevatorController.java`

<details>
<summary>Click to view impl/OptimalElevatorController.java</summary>

```java
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
```

</details>

### `metrics/ElevatorMetrics.java`

<details>
<summary>Click to view metrics/ElevatorMetrics.java</summary>

```java
package com.you.lld.problems.elevator.metrics;

public class ElevatorMetrics {
    private int totalTrips;
    private long totalWaitTime;
    private int floorsTraversed;
    
    public void recordTrip(long waitTime, int floors) {
        totalTrips++;
        totalWaitTime += waitTime;
        floorsTraversed += floors;
    }
    
    public double getAverageWaitTime() {
        return totalTrips == 0 ? 0 : (double) totalWaitTime / totalTrips;
    }
    
    public int getTotalTrips() { return totalTrips; }
    public int getFloorsTraversed() { return floorsTraversed; }
}
```

</details>

### `scheduler/ElevatorScheduler.java`

<details>
<summary>Click to view scheduler/ElevatorScheduler.java</summary>

```java
package com.you.lld.problems.elevator.scheduler;

import com.you.lld.problems.elevator.model.*;
import java.util.List;

public interface ElevatorScheduler {
    Elevator selectElevator(Request request, List<Elevator> elevators);
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.elevator.ElevatorDemo"
```

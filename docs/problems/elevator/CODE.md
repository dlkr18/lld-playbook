# elevator - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/elevator/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py elevator`.

## Project Structure (12 files)

```
elevator/
├── ElevatorDemo.java
├── ElevatorSystem.java
├── api/ElevatorController.java
├── model/Direction.java
├── model/Elevator.java
├── model/ElevatorStatus.java
├── model/Request.java
├── impl/OptimalElevatorController.java
├── metrics/ElevatorMetrics.java
├── scheduler/ElevatorScheduler.java
├── scheduler/LookElevatorScheduler.java
├── scheduler/ScanElevatorScheduler.java
```

## Source Code

### `ElevatorDemo.java`

<details>
<summary>Click to view ElevatorDemo.java</summary>

```java
package com.you.lld.problems.elevator;

import com.you.lld.problems.elevator.model.Direction;

public class ElevatorDemo {

    public static void main(String[] args) {
        System.out.println("=== Elevator System Demo ===\n");

        ElevatorSystem scan = new ElevatorSystem(3, 0, 20, false);
        System.out.println("--- SCAN scheduler ---");
        scan.request(5, Direction.UP);
        runSteps(scan, 6);
        scan.request(10, Direction.DOWN);
        scan.request(15, Direction.UP);
        runSteps(scan, 10);

        ElevatorSystem look = new ElevatorSystem(2, 0, 10, true);
        System.out.println("\n--- LOOK scheduler ---");
        look.request(3, Direction.UP);
        look.request(7, Direction.DOWN);
        runSteps(look, 12);

        System.out.println("\n=== Demo complete ===");
    }

    private static void runSteps(ElevatorSystem system, int steps) {
        for (int i = 0; i < steps; i++) {
            system.step();
        }
        system.controller().printStatus();
    }
}
```

</details>

### `ElevatorSystem.java`

<details>
<summary>Click to view ElevatorSystem.java</summary>

```java
package com.you.lld.problems.elevator;

import com.you.lld.problems.elevator.impl.OptimalElevatorController;
import com.you.lld.problems.elevator.model.Direction;
import com.you.lld.problems.elevator.model.Elevator;
import com.you.lld.problems.elevator.scheduler.ElevatorScheduler;
import com.you.lld.problems.elevator.scheduler.LookElevatorScheduler;
import com.you.lld.problems.elevator.scheduler.ScanElevatorScheduler;

/** Facade for multi-elevator simulation with pluggable scheduling. */
public class ElevatorSystem {
    private final OptimalElevatorController controller;

    public ElevatorSystem(int numElevators, int minFloor, int maxFloor, boolean useLook) {
        ElevatorScheduler scheduler = useLook ? new LookElevatorScheduler() : new ScanElevatorScheduler();
        this.controller = new OptimalElevatorController(numElevators, minFloor, maxFloor, scheduler);
    }

    public void request(int floor, Direction direction) {
        controller.requestElevator(floor, direction);
    }

    public void selectFloor(int elevatorId, int floor) {
        controller.selectFloor(elevatorId, floor);
    }

    public void step() {
        controller.step();
    }

    public Elevator status(int id) {
        return controller.getElevatorStatus(id);
    }

    public OptimalElevatorController controller() {
        return controller;
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
import com.you.lld.problems.elevator.model.Direction;
import com.you.lld.problems.elevator.model.Elevator;
import com.you.lld.problems.elevator.model.Request;
import com.you.lld.problems.elevator.scheduler.ElevatorScheduler;
import com.you.lld.problems.elevator.scheduler.ScanElevatorScheduler;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;

public class OptimalElevatorController implements ElevatorController {
    private final Map<Integer, Elevator> elevators = new ConcurrentHashMap<Integer, Elevator>();
    private final Queue<Request> pendingRequests = new LinkedList<Request>();
    private final ElevatorScheduler scheduler;

    public OptimalElevatorController(int numElevators, int minFloor, int maxFloor) {
        this(numElevators, minFloor, maxFloor, new ScanElevatorScheduler());
    }

    public OptimalElevatorController(int numElevators, int minFloor, int maxFloor, ElevatorScheduler scheduler) {
        this.scheduler = scheduler;
        for (int i = 0; i < numElevators; i++) {
            elevators.put(i, new Elevator(i, minFloor, maxFloor));
        }
    }

    @Override
    public void requestElevator(int floor, Direction direction) {
        Request request = new Request(floor, direction);
        dispatch(request);
    }

    private void dispatch(Request request) {
        Elevator best = scheduler.selectElevator(request, new ArrayList<Elevator>(elevators.values()));
        if (best != null) {
            best.addDestination(request.getFloor());
        } else {
            pendingRequests.offer(request);
        }
    }

    @Override
    public void selectFloor(int elevatorId, int floor) {
        Elevator elevator = elevators.get(elevatorId);
        if (elevator != null) {
            elevator.addDestination(floor);
        }
    }

    @Override
    public Elevator getElevatorStatus(int elevatorId) {
        return elevators.get(elevatorId);
    }

    @Override
    public void step() {
        for (Elevator elevator : elevators.values()) {
            elevator.moveToNextFloor();
        }
        while (!pendingRequests.isEmpty()) {
            Request request = pendingRequests.peek();
            Elevator best = scheduler.selectElevator(request, new ArrayList<Elevator>(elevators.values()));
            if (best == null) {
                break;
            }
            pendingRequests.poll();
            best.addDestination(request.getFloor());
        }
    }

    public void printStatus() {
        for (Elevator elevator : elevators.values()) {
            System.out.println("  " + elevator);
        }
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

### `scheduler/LookElevatorScheduler.java`

<details>
<summary>Click to view scheduler/LookElevatorScheduler.java</summary>

```java
package com.you.lld.problems.elevator.scheduler;

import com.you.lld.problems.elevator.model.Elevator;
import com.you.lld.problems.elevator.model.Request;
import java.util.List;

/**
 * LOOK variant: pick the elevator with minimum distance regardless of direction,
 * but prefer non-idle cars already serving nearby floors (reduces reversal).
 */
public class LookElevatorScheduler implements ElevatorScheduler {
    @Override
    public Elevator selectElevator(Request request, List<Elevator> elevators) {
        Elevator best = null;
        int bestScore = Integer.MAX_VALUE;
        for (Elevator elevator : elevators) {
            int distance = elevator.distanceToFloor(request.getFloor());
            int penalty = elevator.isIdle() ? 0 : 1;
            int score = distance * 10 + penalty;
            if (score < bestScore) {
                bestScore = score;
                best = elevator;
            }
        }
        return best;
    }
}
```

</details>

### `scheduler/ScanElevatorScheduler.java`

<details>
<summary>Click to view scheduler/ScanElevatorScheduler.java</summary>

```java
package com.you.lld.problems.elevator.scheduler;

import com.you.lld.problems.elevator.model.Direction;
import com.you.lld.problems.elevator.model.Elevator;
import com.you.lld.problems.elevator.model.Request;
import java.util.List;

/** Nearest idle or same-direction elevator moving toward the request floor. */
public class ScanElevatorScheduler implements ElevatorScheduler {
    @Override
    public Elevator selectElevator(Request request, List<Elevator> elevators) {
        Elevator bestMoving = null;
        int bestMovingDistance = Integer.MAX_VALUE;
        Elevator bestIdle = null;
        int bestIdleDistance = Integer.MAX_VALUE;

        for (Elevator elevator : elevators) {
            int distance = elevator.distanceToFloor(request.getFloor());
            if (elevator.isIdle()) {
                if (distance < bestIdleDistance) {
                    bestIdle = elevator;
                    bestIdleDistance = distance;
                }
            } else if (elevator.getDirection() == request.getDirection()) {
                boolean toward = (request.getDirection() == Direction.UP
                        && elevator.getCurrentFloor() <= request.getFloor())
                        || (request.getDirection() == Direction.DOWN
                        && elevator.getCurrentFloor() >= request.getFloor());
                if (toward && distance < bestMovingDistance) {
                    bestMoving = elevator;
                    bestMovingDistance = distance;
                }
            }
        }
        return bestMoving != null ? bestMoving : bestIdle;
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.elevator.ElevatorDemo"
```

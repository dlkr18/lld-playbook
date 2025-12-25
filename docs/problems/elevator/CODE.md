# Elevator System - Scheduling & Control 🛗

Production-ready **elevator control system** with **multiple scheduling algorithms**, **state management**, and **optimal dispatching**. Classic real-time control system design.

---

## 🎯 **Core Features**

✅ **Multi-Elevator System** - Coordinate multiple elevators  
✅ **Scheduling Algorithms** - SCAN, SSTF, LOOK, FCFS  
✅ **State Management** - Moving up/down, idle, maintenance  
✅ **Request Handling** - Internal & external requests  
✅ **Optimal Dispatch** - Assign closest elevator  
✅ **Energy Optimization** - Minimize travel distance  

---

## 📚 **System Architecture**

### **1. Components**

```
ElevatorController
 ├── Elevator (state machine)
 │    ├── Current Floor
 │    ├── Direction (UP/DOWN/IDLE)
 │    └── Request Queue
 ├── SchedulingAlgorithm
 └── DispatchStrategy
```

### **2. Elevator States**

```java
public enum ElevatorState {
    IDLE,           // No requests, stationary
    MOVING_UP,      // Traveling upward
    MOVING_DOWN,    // Traveling downward
    DOOR_OPENING,   // Doors opening
    DOOR_OPEN,      // Doors fully open
    DOOR_CLOSING,   // Doors closing
    MAINTENANCE     // Out of service
}
```

---

## 💻 **Scheduling Algorithms**

### **1. SCAN (Elevator Algorithm)**

```java
/**
 * SCAN: Services all requests in one direction, then reverses.
 * 
 * Example:
 * Current: Floor 5, Direction: UP
 * Requests: [7, 3, 9, 2, 10]
 * 
 * Order: 5 → 7 → 9 → 10 → (reverse) → 3 → 2
 */
public class SCANScheduler implements SchedulingAlgorithm {
    
    @Override
    public List<Integer> scheduleRequests(
            int currentFloor, 
            Direction direction,
            Set<Integer> requests) {
        
        List<Integer> upRequests = requests.stream()
            .filter(f -> f > currentFloor)
            .sorted()
            .collect(Collectors.toList());
        
        List<Integer> downRequests = requests.stream()
            .filter(f -> f < currentFloor)
            .sorted(Collections.reverseOrder())
            .collect(Collectors.toList());
        
        if (direction == Direction.UP) {
            upRequests.addAll(downRequests);
            return upRequests;
        } else {
            downRequests.addAll(upRequests);
            return downRequests;
        }
    }
}
```

### **2. SSTF (Shortest Seek Time First)**

```java
/**
 * SSTF: Always go to nearest floor.
 * 
 * Example:
 * Current: Floor 5
 * Requests: [7, 3, 9, 2, 10]
 * 
 * Order: 5 → 7 → 3 → 2 → 9 → 10
 * (nearest at each step)
 */
public class SSTFScheduler implements SchedulingAlgorithm {
    
    @Override
    public List<Integer> scheduleRequests(
            int currentFloor,
            Direction direction, 
            Set<Integer> requests) {
        
        List<Integer> scheduled = new ArrayList<>();
        int current = currentFloor;
        Set<Integer> remaining = new HashSet<>(requests);
        
        while (!remaining.isEmpty()) {
            // Find nearest floor
            int nearest = remaining.stream()
                .min(Comparator.comparingInt(f -> Math.abs(f - current)))
                .get();
            
            scheduled.add(nearest);
            remaining.remove(nearest);
            current = nearest;
        }
        
        return scheduled;
    }
}
```

### **3. FCFS (First Come First Served)**

```java
/**
 * FCFS: Handle requests in arrival order.
 * Simple but inefficient.
 */
public class FCFSScheduler implements SchedulingAlgorithm {
    
    private final Queue<Integer> requestQueue = new LinkedList<>();
    
    @Override
    public List<Integer> scheduleRequests(...) {
        return new ArrayList<>(requestQueue);
    }
}
```

---

## 🚀 **Dispatching Strategy**

```java
/**
 * Assigns incoming requests to optimal elevator.
 */
public class OptimalDispatcher implements DispatchStrategy {
    
    @Override
    public Elevator assignRequest(int requestedFloor, Direction direction, List<Elevator> elevators) {
        
        // Filter available elevators
        List<Elevator> available = elevators.stream()
            .filter(e -> e.getState() != ElevatorState.MAINTENANCE)
            .collect(Collectors.toList());
        
        // Priority 1: Elevator moving in same direction toward the floor
        Optional<Elevator> sameDirection = available.stream()
            .filter(e -> isSameDirection(e, requestedFloor, direction))
            .min(Comparator.comparingInt(e -> distance(e, requestedFloor)))
            .orElse(null);
        
        if (sameDirection != null) return sameDirection;
        
        // Priority 2: Idle elevator (closest)
        Optional<Elevator> idle = available.stream()
            .filter(e -> e.getState() == ElevatorState.IDLE)
            .min(Comparator.comparingInt(e -> distance(e, requestedFloor)))
            .orElse(null);
        
        if (idle != null) return idle;
        
        // Priority 3: Any available elevator
        return available.stream()
            .min(Comparator.comparingInt(e -> distance(e, requestedFloor)))
            .orElseThrow(() -> new NoElevatorAvailableException());
    }
    
    private boolean isSameDirection(Elevator e, int floor, Direction dir) {
        int currentFloor = e.getCurrentFloor();
        Direction elevatorDir = e.getDirection();
        
        if (dir == Direction.UP && elevatorDir == Direction.UP) {
            return floor >= currentFloor;
        } else if (dir == Direction.DOWN && elevatorDir == Direction.DOWN) {
            return floor <= currentFloor;
        }
        return false;
    }
    
    private int distance(Elevator e, int floor) {
        return Math.abs(e.getCurrentFloor() - floor);
    }
}
```

---

## 📝 **Usage Examples**

### **Example 1: Request Elevator**

```java
ElevatorSystem system = new ElevatorSystem(numElevators = 4, floors = 10);

// External request (button pressed outside elevator)
system.requestElevator(floor = 3, direction = Direction.UP);

// System assigns optimal elevator
Elevator assigned = system.getAssignedElevator(3);
System.out.println("Elevator " + assigned.getId() + " dispatched to floor 3");
```

### **Example 2: Internal Request**

```java
// User enters elevator and presses floor 7
Elevator elevator = system.getElevator(elevatorId);
elevator.addRequest(destinationFloor = 7);

// Elevator moves to floor 7
while (elevator.getCurrentFloor() != 7) {
    elevator.move();
    Thread.sleep(1000);  // Simulate 1 sec per floor
}

elevator.openDoors();
```

---

## 🎯 **Design Patterns**

- **State**: Elevator state machine
- **Strategy**: Different scheduling algorithms
- **Observer**: Notify on floor arrival
- **Factory**: Create elevators with different capacities
- **Singleton**: Central elevator controller

---

## 📊 **Performance Metrics**

- **Average Wait Time**: Time from request to elevator arrival
- **Average Travel Time**: Time from entry to destination
- **Energy Efficiency**: Total distance traveled
- **Throughput**: Requests handled per hour

---

## 🔗 **Related Resources**

- [Weekend 2: Elevator Project](week2/weekend/README.md)
- [State Pattern](foundations/DESIGN_PATTERNS_CATALOG.md)
- [Strategy Pattern](week2/day8/README.md)

---

**Implementation Guide**: Placeholder for future implementation in `src/main/java/com/you/lld/problems/elevator/`

---

✨ **Optimal elevator scheduling with multiple algorithms!** 🛗


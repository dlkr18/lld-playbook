# Traffic Signal Control System

## Overview
A traffic light management system for controlling traffic signals at intersections, coordinating multiple lights, handling emergency vehicles, implementing timing strategies, and optimizing traffic flow. Supports fixed-time, actuated (sensor-based), and adaptive control modes.

**Difficulty:** Easy-Medium  
**Domain:** IoT, Control Systems  
**Interview Frequency:** Medium (Smart city, IoT, simulation companies)

## Requirements

### Functional Requirements
1. **Signal Management**
   - Control traffic lights (Red, Yellow, Green)
   - Define signal timing (duration per state)
   - Multi-direction support (North, South, East, West)
   - Pedestrian signals

2. **Intersection Control**
   - Coordinate multiple signals
   - Prevent conflicts (no simultaneous green)
   - Safe transitions (yellow buffer)
   - All-red phase for clearance

3. **Control Modes**
   - **Fixed-time:** Pre-programmed cycles
   - **Actuated:** Sensor-triggered adjustments
   - **Adaptive:** Real-time optimization
   - **Manual:** Override for emergencies

4. **Emergency Handling**
   - Emergency vehicle preemption
   - All-red emergency mode
   - Manual override capability

5. **Monitoring**
   - Signal status tracking
   - Traffic flow metrics
   - System health monitoring
   - Violation detection

### Non-Functional Requirements
1. **Safety**
   - No conflicting greens
   - Minimum red clearance time
   - Fail-safe to all-red

2. **Reliability**
   - 99.99% uptime
   - Fault detection
   - Automatic recovery

3. **Real-time**
   - Sub-second response time
   - Precise timing control

## Core Data Model

### 1. Traffic Light
```java
public class TrafficLight {
    private LightId id;
    private Direction direction;
    private LightColor currentColor;
    private int remainingTime; // seconds
    private LocalDateTime lastChanged;
    
    public void changeColor(LightColor newColor) {
        this.currentColor = newColor;
        this.lastChanged = LocalDateTime.now();
    }
    
    public boolean canChange() {
        // Minimum time in current state
        return Duration.between(lastChanged, LocalDateTime.now())
            .getSeconds() >= getMinDuration(currentColor);
    }
    
    private int getMinDuration(LightColor color) {
        switch (color) {
            case RED: return 5;
            case YELLOW: return 3;
            case GREEN: return 10;
            default: return 0;
        }
    }
}

enum LightColor {
    RED,
    YELLOW,
    GREEN,
    FLASHING_RED,
    FLASHING_YELLOW
}

enum Direction {
    NORTH,
    SOUTH,
    EAST,
    WEST
}
```

### 2. Intersection
```java
public class Intersection {
    private IntersectionId id;
    private String name;
    private Map<Direction, TrafficLight> lights;
    private ControlMode mode;
    private SignalPhase currentPhase;
    private LocalDateTime phaseStartTime;
    
    public void executePhase(SignalPhase phase) {
        // Change lights according to phase
        for (Direction dir : Direction.values()) {
            TrafficLight light = lights.get(dir);
            LightColor color = phase.getColorForDirection(dir);
            light.changeColor(color);
        }
        
        this.currentPhase = phase;
        this.phaseStartTime = LocalDateTime.now();
    }
    
    public boolean isConflictFree() {
        // Check no two conflicting directions have green
        boolean northSouthGreen = 
            lights.get(Direction.NORTH).getCurrentColor() == LightColor.GREEN ||
            lights.get(Direction.SOUTH).getCurrentColor() == LightColor.GREEN;
        
        boolean eastWestGreen = 
            lights.get(Direction.EAST).getCurrentColor() == LightColor.GREEN ||
            lights.get(Direction.WEST).getCurrentColor() == LightColor.GREEN;
        
        return !(northSouthGreen && eastWestGreen);
    }
}

enum ControlMode {
    FIXED_TIME,     // Pre-programmed cycle
    ACTUATED,       // Sensor-based
    ADAPTIVE,       // Real-time optimization
    EMERGENCY,      // Emergency override
    MANUAL          // Manual control
}
```

### 3. Signal Phase
```java
public class SignalPhase {
    private String name;
    private Map<Direction, LightColor> directionColors;
    private int duration; // seconds
    private SignalPhase nextPhase;
    
    public SignalPhase(String name, int duration) {
        this.name = name;
        this.duration = duration;
        this.directionColors = new HashMap<>();
    }
    
    public void setColor(Direction direction, LightColor color) {
        directionColors.put(direction, color);
    }
    
    public LightColor getColorForDirection(Direction direction) {
        return directionColors.getOrDefault(direction, LightColor.RED);
    }
    
    public boolean isValid() {
        // Validate no conflicting greens
        boolean northSouthGreen = 
            directionColors.get(Direction.NORTH) == LightColor.GREEN ||
            directionColors.get(Direction.SOUTH) == LightColor.GREEN;
        
        boolean eastWestGreen = 
            directionColors.get(Direction.EAST) == LightColor.GREEN ||
            directionColors.get(Direction.WEST) == LightColor.GREEN;
        
        return !(northSouthGreen && eastWestGreen);
    }
}
```

## Key Algorithms

### 1. Fixed-Time Signal Control
```java
public class FixedTimeController {
    private List<SignalPhase> phases;
    private int currentPhaseIndex;
    
    public FixedTimeController() {
        initializePhases();
    }
    
    private void initializePhases() {
        phases = new ArrayList<>();
        
        // Phase 1: North-South Green
        SignalPhase phase1 = new SignalPhase("NS-Green", 30);
        phase1.setColor(Direction.NORTH, LightColor.GREEN);
        phase1.setColor(Direction.SOUTH, LightColor.GREEN);
        phase1.setColor(Direction.EAST, LightColor.RED);
        phase1.setColor(Direction.WEST, LightColor.RED);
        phases.add(phase1);
        
        // Phase 2: North-South Yellow
        SignalPhase phase2 = new SignalPhase("NS-Yellow", 3);
        phase2.setColor(Direction.NORTH, LightColor.YELLOW);
        phase2.setColor(Direction.SOUTH, LightColor.YELLOW);
        phase2.setColor(Direction.EAST, LightColor.RED);
        phase2.setColor(Direction.WEST, LightColor.RED);
        phases.add(phase2);
        
        // Phase 3: All Red (clearance)
        SignalPhase phase3 = new SignalPhase("All-Red", 2);
        phase3.setColor(Direction.NORTH, LightColor.RED);
        phase3.setColor(Direction.SOUTH, LightColor.RED);
        phase3.setColor(Direction.EAST, LightColor.RED);
        phase3.setColor(Direction.WEST, LightColor.RED);
        phases.add(phase3);
        
        // Phase 4: East-West Green
        SignalPhase phase4 = new SignalPhase("EW-Green", 30);
        phase4.setColor(Direction.NORTH, LightColor.RED);
        phase4.setColor(Direction.SOUTH, LightColor.RED);
        phase4.setColor(Direction.EAST, LightColor.GREEN);
        phase4.setColor(Direction.WEST, LightColor.GREEN);
        phases.add(phase4);
        
        // Phase 5: East-West Yellow
        SignalPhase phase5 = new SignalPhase("EW-Yellow", 3);
        phase5.setColor(Direction.NORTH, LightColor.RED);
        phase5.setColor(Direction.SOUTH, LightColor.RED);
        phase5.setColor(Direction.EAST, LightColor.YELLOW);
        phase5.setColor(Direction.WEST, LightColor.YELLOW);
        phases.add(phase5);
        
        // Phase 6: All Red (clearance)
        phases.add(phase3); // Reuse all-red phase
        
        currentPhaseIndex = 0;
    }
    
    @Scheduled(fixedRate = 1000) // Run every second
    public void update(Intersection intersection) {
        SignalPhase currentPhase = phases.get(currentPhaseIndex);
        
        Duration elapsed = Duration.between(
            intersection.getPhaseStartTime(),
            LocalDateTime.now()
        );
        
        if (elapsed.getSeconds() >= currentPhase.getDuration()) {
            // Move to next phase
            currentPhaseIndex = (currentPhaseIndex + 1) % phases.size();
            SignalPhase nextPhase = phases.get(currentPhaseIndex);
            
            intersection.executePhase(nextPhase);
            
            logger.info("Intersection {} transitioned to phase: {}", 
                intersection.getId(), nextPhase.getName());
        }
    }
}
```

### 2. Emergency Vehicle Preemption
```java
public class EmergencyPreemptionService {
    
    public void handleEmergencyVehicle(IntersectionId intersectionId, 
                                      Direction approachDirection) {
        Intersection intersection = getIntersection(intersectionId);
        
        logger.warn("Emergency vehicle detected at {} from {}", 
            intersectionId, approachDirection);
        
        // 1. Switch to emergency mode
        intersection.setMode(ControlMode.EMERGENCY);
        
        // 2. Transition safely to green for emergency vehicle
        transitionToEmergencyGreen(intersection, approachDirection);
        
        // 3. Hold green for emergency vehicle
        scheduleEmergencyHold(intersection, approachDirection, Duration.ofSeconds(30));
    }
    
    private void transitionToEmergencyGreen(Intersection intersection, 
                                           Direction emergencyDirection) {
        // Phase 1: Set all lights to yellow (if currently green)
        for (Direction dir : Direction.values()) {
            TrafficLight light = intersection.getLight(dir);
            if (light.getCurrentColor() == LightColor.GREEN) {
                light.changeColor(LightColor.YELLOW);
            }
        }
        
        // Wait for yellow phase
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            // Handle
        }
        
        // Phase 2: All red for clearance
        for (Direction dir : Direction.values()) {
            intersection.getLight(dir).changeColor(LightColor.RED);
        }
        
        // Wait for clearance
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            // Handle
        }
        
        // Phase 3: Green for emergency direction
        intersection.getLight(emergencyDirection).changeColor(LightColor.GREEN);
        
        // Opposite direction also green (if same axis)
        Direction opposite = getOppositeDirection(emergencyDirection);
        intersection.getLight(opposite).changeColor(LightColor.GREEN);
    }
    
    private void scheduleEmergencyHold(Intersection intersection, 
                                      Direction direction, Duration holdTime) {
        scheduler.schedule(() -> {
            // Return to normal operation
            intersection.setMode(ControlMode.FIXED_TIME);
            logger.info("Emergency preemption ended for {}", intersection.getId());
        }, holdTime.toMillis(), TimeUnit.MILLISECONDS);
    }
}
```

## Design Patterns

### 1. State Pattern (Traffic Light States)
```java
interface LightState {
    void handle(TrafficLight light);
    LightColor getColor();
    int getDuration();
}

class RedState implements LightState {
    public void handle(TrafficLight light) {
        // Red light logic
    }
    public LightColor getColor() { return LightColor.RED; }
    public int getDuration() { return 30; }
}

class GreenState implements LightState {
    public void handle(TrafficLight light) {
        // Green light logic
    }
    public LightColor getColor() { return LightColor.GREEN; }
    public int getDuration() { return 30; }
}
```

### 2. Strategy Pattern (Control Modes)
```java
interface ControlStrategy {
    void control(Intersection intersection);
}

class FixedTimeStrategy implements ControlStrategy {
    public void control(Intersection intersection) {
        // Fixed-time cycle logic
    }
}

class ActuatedStrategy implements ControlStrategy {
    public void control(Intersection intersection) {
        // Sensor-based logic
    }
}
```

## Source Code

📄 **[View Complete Source Code](/problems/trafficcontrol/CODE)**

**Total Lines of Code:** ~600 lines

## Usage Example

```java
// Create intersection
Intersection intersection = new Intersection("Main & 1st");

// Add traffic lights
intersection.addLight(Direction.NORTH, new TrafficLight());
intersection.addLight(Direction.SOUTH, new TrafficLight());
intersection.addLight(Direction.EAST, new TrafficLight());
intersection.addLight(Direction.WEST, new TrafficLight());

// Set fixed-time control
FixedTimeController controller = new FixedTimeController();
controller.start(intersection);

// Handle emergency vehicle
emergencyService.handleEmergencyVehicle(
    intersection.getId(), 
    Direction.NORTH
);
```

## Key Takeaways

### What Interviewers Look For
1. ✅ **Safety validation** (no conflicts)
2. ✅ **State machine** for lights
3. ✅ **Timing control**
4. ✅ **Emergency handling**

### Common Mistakes
1. ❌ Allowing conflicting greens
2. ❌ No yellow/clearance phase
3. ❌ Poor emergency handling

---

*Traffic signal control with fixed-time cycles, emergency preemption, and safety validation.*

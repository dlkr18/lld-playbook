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

---

## Advanced Traffic Control Algorithms

### 1. Adaptive Traffic Control

Adjust signal timing based on real-time traffic conditions:

```java
public class AdaptiveTrafficControl {
    private static final int MIN_GREEN = 10;  // seconds
    private static final int MAX_GREEN = 120; // seconds
    
    public int calculateGreenTime(Direction direction, TrafficData data) {
        int vehicleCount = data.getVehicleCount(direction);
        int queueLength = data.getQueueLength(direction);
        double avgSpeed = data.getAverageSpeed(direction);
        
        // Base time proportional to demand
        int baseTime = MIN_GREEN + (vehicleCount * 2);
        
        // Adjust for queue length
        int queueAdjustment = Math.min(queueLength * 3, 60);
        
        // Adjust for congestion (slower speed = more time)
        double congestionFactor = avgSpeed < 20 ? 1.5 : 1.0;
        
        int greenTime = (int) ((baseTime + queueAdjustment) * congestionFactor);
        
        return Math.min(Math.max(greenTime, MIN_GREEN), MAX_GREEN);
    }
}
```

**Benefits**:
- 20-30% reduction in average wait time
- Better traffic flow during peak hours
- Responds to changing conditions

### 2. Predictive Traffic Management

Use ML to predict traffic patterns and pre-adjust signals:

```java
public class PredictiveTrafficControl {
    private TrafficPredictor mlModel;
    
    public void optimizeSignals(Intersection intersection, LocalTime currentTime) {
        // Predict traffic for next 15 minutes
        TrafficPrediction prediction = mlModel.predict(
            intersection.getId(),
            currentTime,
            Duration.ofMinutes(15)
        );
        
        // Pre-adjust timing
        for (Direction dir : Direction.values()) {
            int predictedVolume = prediction.getVolume(dir);
            int adjustedGreen = calculateOptimalGreen(predictedVolume);
            intersection.setGreenDuration(dir, adjustedGreen);
        }
    }
    
    private int calculateOptimalGreen(int predictedVolume) {
        // Volume-based green time calculation
        if (predictedVolume > 100) return 90;  // Heavy traffic
        if (predictedVolume > 50) return 60;   // Moderate traffic
        return 30;                              // Light traffic
    }
}
```

**ML Features**:
- Historical traffic patterns
- Time of day / day of week
- Weather conditions
- Special events (sports, concerts)
- Holiday calendars

### 3. Multi-Intersection Coordination (Green Wave)

Synchronize adjacent signals for smooth traffic flow:

```java
public class GreenWaveCoordination {
    public void coordinateIntersections(List<Intersection> corridor) {
        double distanceBetween = 200.0;  // meters
        double targetSpeed = 50.0;       // km/h (13.89 m/s)
        
        // Calculate offset between signals
        double travelTime = distanceBetween / (targetSpeed / 3.6);
        int offset = (int) travelTime;  // seconds
        
        // Set staggered start times
        for (int i = 0; i < corridor.size(); i++) {
            Intersection intersection = corridor.get(i);
            int startDelay = i * offset;
            intersection.setCycleStartOffset(startDelay);
        }
    }
}
```

**Example**:
```
Intersection A: Green at 0s, 90s, 180s...
Intersection B (200m): Green at 15s, 105s, 195s...
Intersection C (400m): Green at 30s, 120s, 210s...
Result: Vehicles traveling at 50 km/h hit all green lights
```

### 4. Emergency Vehicle Preemption with Prediction

```java
public class SmartEmergencyPreemption {
    public void handleEmergencyVehicle(EmergencyVehicle vehicle) {
        // Get vehicle location and route
        Location currentLocation = vehicle.getLocation();
        Route route = vehicle.getRoute();
        
        // Predict affected intersections
        List<Intersection> affectedIntersections = 
            predictAffectedIntersections(currentLocation, route);
        
        // Preempt intersections along route
        for (Intersection intersection : affectedIntersections) {
            int eta = calculateETA(vehicle, intersection);
            
            // Start preemption 30 seconds before arrival
            if (eta <= 30) {
                intersection.startEmergencyPreemption(
                    vehicle.getDirection()
                );
            }
        }
    }
    
    private int calculateETA(EmergencyVehicle vehicle, Intersection intersection) {
        double distance = calculateDistance(vehicle.getLocation(), 
                                           intersection.getLocation());
        double speed = vehicle.getCurrentSpeed();
        return (int) (distance / speed);
    }
}
```

---

## IoT Sensor Integration

### 1. Inductive Loop Detectors

```java
public class LoopDetector {
    private boolean vehiclePresent = false;
    private int vehicleCount = 0;
    private long lastDetectionTime = 0;
    
    public void onMagneticFieldChange(double fieldStrength) {
        if (fieldStrength > THRESHOLD && !vehiclePresent) {
            // Vehicle enters loop
            vehiclePresent = true;
            vehicleCount++;
            lastDetectionTime = System.currentTimeMillis();
        } else if (fieldStrength <= THRESHOLD && vehiclePresent) {
            // Vehicle exits loop
            vehiclePresent = false;
        }
    }
    
    public int getVehicleCount() {
        return vehicleCount;
    }
    
    public boolean isOccupied() {
        return vehiclePresent;
    }
}
```

### 2. Video-Based Detection (Computer Vision)

```java
public class VideoDetection {
    private ObjectDetector yoloModel;
    
    public TrafficMetrics analyzeVideo(VideoFrame frame) {
        // Detect vehicles using YOLO
        List<BoundingBox> detections = yoloModel.detect(frame);
        
        TrafficMetrics metrics = new TrafficMetrics();
        
        for (BoundingBox box : detections) {
            // Classify vehicle type
            VehicleType type = classifyVehicle(box);
            metrics.addVehicle(type);
            
            // Estimate speed using optical flow
            double speed = estimateSpeed(box, previousFrame);
            metrics.addSpeed(speed);
        }
        
        return metrics;
    }
    
    private VehicleType classifyVehicle(BoundingBox box) {
        double area = box.width * box.height;
        if (area > 50000) return VehicleType.TRUCK;
        if (area > 30000) return VehicleType.CAR;
        return VehicleType.MOTORCYCLE;
    }
}
```

### 3. V2I (Vehicle-to-Infrastructure) Communication

```java
public class V2ICommunication {
    public void handleV2IMessage(V2IMessage message) {
        switch (message.getType()) {
            case SIGNAL_PHASE_REQUEST:
                // Connected vehicle requests green light
                handlePhaseRequest(message);
                break;
                
            case SPEED_ADVISORY_REQUEST:
                // Provide speed to catch next green
                sendSpeedAdvisory(message);
                break;
                
            case VEHICLE_LOCATION_UPDATE:
                // Update traffic map
                updateTrafficMap(message);
                break;
        }
    }
    
    private void sendSpeedAdvisory(V2IMessage message) {
        Intersection nextIntersection = getNextIntersection(message.getRoute());
        int timeToGreen = nextIntersection.getTimeToGreen(message.getDirection());
        double distance = calculateDistance(message.getLocation(), 
                                           nextIntersection.getLocation());
        
        // Calculate optimal speed to arrive at green
        double advisedSpeed = distance / timeToGreen;
        
        sendMessage(message.getVehicleId(), 
                   new SpeedAdvisory(advisedSpeed));
    }
}
```

---

## Traffic Analytics & Optimization

### 1. Performance Metrics

```java
public class TrafficAnalytics {
    public IntersectionPerformance analyzePerformance(String intersectionId, 
                                                     Duration timeWindow) {
        List<VehicleEvent> events = getEvents(intersectionId, timeWindow);
        
        // Calculate key metrics
        double avgWaitTime = calculateAverageWaitTime(events);
        double avgQueueLength = calculateAverageQueueLength(events);
        double throughput = calculateThroughput(events);
        double levelOfService = calculateLevelOfService(avgWaitTime, avgQueueLength);
        
        return IntersectionPerformance.builder()
            .intersectionId(intersectionId)
            .avgWaitTime(avgWaitTime)
            .avgQueueLength(avgQueueLength)
            .throughput(throughput)
            .levelOfService(levelOfService)
            .build();
    }
    
    private double calculateLevelOfService(double waitTime, double queueLength) {
        // A = Excellent (0-10s), B = Good (10-20s), C = Fair (20-35s),
        // D = Poor (35-55s), E = Bad (55-80s), F = Failure (>80s)
        if (waitTime < 10) return 5.0;  // Level A
        if (waitTime < 20) return 4.0;  // Level B
        if (waitTime < 35) return 3.0;  // Level C
        if (waitTime < 55) return 2.0;  // Level D
        if (waitTime < 80) return 1.0;  // Level E
        return 0.0;  // Level F
    }
}
```

### 2. Genetic Algorithm for Signal Optimization

```java
public class GeneticOptimizer {
    public SignalTiming optimizeTimings(Intersection intersection) {
        // Initialize population of random timings
        List<SignalTiming> population = initializePopulation(100);
        
        for (int generation = 0; generation < 100; generation++) {
            // Evaluate fitness (minimize average wait time)
            List<ScoredTiming> scored = population.stream()
                .map(timing -> new ScoredTiming(timing, evaluateFitness(timing)))
                .sorted(Comparator.comparingDouble(ScoredTiming::getScore))
                .collect(Collectors.toList());
            
            // Select top 20% as parents
            List<SignalTiming> parents = scored.subList(0, 20).stream()
                .map(ScoredTiming::getTiming)
                .collect(Collectors.toList());
            
            // Create next generation
            population = createNextGeneration(parents);
        }
        
        // Return best timing
        return population.get(0);
    }
    
    private double evaluateFitness(SignalTiming timing) {
        // Simulate traffic flow and return average wait time
        TrafficSimulation sim = new TrafficSimulation(timing);
        return sim.simulate(Duration.ofHours(1)).getAvgWaitTime();
    }
}
```

---

## Interview Deep Dive

### Advanced Questions

**Q1: How do you handle a power outage at an intersection?**

**Answer**:
```java
public class PowerOutageHandler {
    public void onPowerLoss(Intersection intersection) {
        // Enter flash mode (all lights flashing red/yellow)
        intersection.enterFlashMode();
        
        // Notify traffic control center
        notifyControlCenter(intersection.getId(), "POWER_OUTAGE");
        
        // Switch to battery backup
        if (intersection.hasBatteryBackup()) {
            intersection.activateBatteryMode();
        }
        
        // Deploy portable signals if outage persists
        if (outageTime > Duration.ofHours(2)) {
            deployPortableSignals(intersection);
        }
    }
}
```

**Q2: Design a system to prioritize public buses**

**Answer**:
```java
public class BusPrioritySystem {
    public void handleBusApproach(Bus bus, Intersection intersection) {
        // Check if bus is behind schedule
        int delay = bus.getScheduleDelay();
        
        if (delay > 5) {  // More than 5 minutes late
            // Extend green or shorten red
            Direction busDirection = bus.getDirection();
            
            if (intersection.getCurrentGreen() == busDirection) {
                // Extend green by 15 seconds
                intersection.extendGreen(Duration.ofSeconds(15));
            } else {
                // Reduce red time
                intersection.shortenRed(busDirection, Duration.ofSeconds(10));
            }
        }
    }
}
```

---

## Related Problems
- 🚗 **[Parking Lot](/problems/parkinglot/README)** - Vehicle management
- 🏬 **[Elevator System](/problems/elevator/README)** - Resource scheduling
- 🚖 **[Ride Hailing](/problems/ridehailing/README)** - Route optimization

---

*Advanced traffic control system with adaptive algorithms, IoT integration, and ML-based prediction. Essential for smart city and IoT interviews!*

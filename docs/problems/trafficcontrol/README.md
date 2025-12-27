# Traffic Control System

## Overview
Traffic signal management system coordinating multiple intersections with timing optimization, emergency vehicle priority, and adaptive control based on traffic density.

**Difficulty:** Medium  
**Interview Frequency:** Medium (IoT, smart city)

## Key Components

### Traffic Light States
```java
enum SignalState {
    GREEN(30_000),   // 30 seconds
    YELLOW(5_000),   // 5 seconds
    RED(35_000);     // 35 seconds
    
    private final long durationMs;
}
```

### State Transitions
```java
public class TrafficLight {
    private SignalState state = SignalState.RED;
    
    public void nextState() {
        switch (state) {
            case GREEN -> state = SignalState.YELLOW;
            case YELLOW -> state = SignalState.RED;
            case RED -> state = SignalState.GREEN;
        }
    }
}
```

### Adaptive Timing
```java
public void adjustTiming(int vehicleCount) {
    if (vehicleCount > 50) {
        greenDuration = 45_000; // Extended green
    } else if (vehicleCount < 10) {
        greenDuration = 20_000; // Shorter green
    }
}
```

## Design Patterns
- **State Pattern**: Signal state management
- **Observer Pattern**: Emergency vehicle alerts
- **Strategy Pattern**: Timing algorithms

## Source Code
📄 **[View Complete Source Code](/problems/trafficcontrol/CODE)**

*Smart traffic management with adaptive control.*

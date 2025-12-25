# Traffic Control System

## Problem: Design a Traffic Light Control System

**Difficulty**: Medium  
**Pattern**: State Machine, Observer  
**Time**: 45-60 min

---

## Key Classes

```java
enum LightState { RED, YELLOW, GREEN }

class TrafficLight {
    private String id;
    private LightState currentState;
    private int duration;
    
    void changeState(LightState newState);
}

class Intersection {
    private List<TrafficLight> lights;
    private TrafficController controller;
    
    void manageLights();
}

class TrafficController {
    private Map<String, Intersection> intersections;
    
    void coordinateIntersections();
    void handleEmergency(String intersectionId);
}
```

---

**Status**: ✅ Documented

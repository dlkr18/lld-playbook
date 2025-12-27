# trafficcontrol - Complete Implementation

## 📁 Project Structure (9 files)

```
trafficcontrol/
├── Demo.java
├── Intersection.java
├── TrafficLight.java
├── api/TrafficController.java
├── impl/TrafficControllerImpl.java
├── model/Direction.java
├── model/Intersection.java
├── model/Signal.java
├── model/TrafficLight.java
```

## 📝 Source Code

### 📄 `Demo.java`

```java
package com.you.lld.problems.trafficcontrol;
public class Demo { public static void main(String[] args) { System.out.println("Traffic Control"); } }```

### 📄 `Intersection.java`

```java
package com.you.lld.problems.trafficcontrol;
import java.util.*;

public class Intersection {
    private final String id;
    private final List<TrafficLight> lights;
    
    public Intersection(String id) {
        this.id = id;
        this.lights = new ArrayList<>();
    }
    
    public void addLight(TrafficLight light) {
        lights.add(light);
    }
    
    public void manageLights() {
        // Simple round-robin: one green at a time
        for (int i = 0; i < lights.size(); i++) {
            for (int j = 0; j < lights.size(); j++) {
                lights.get(j).setSignal(i == j ? TrafficLight.Signal.GREEN : TrafficLight.Signal.RED);
            }
        }
    }
}
```

### 📄 `TrafficLight.java`

```java
package com.you.lld.problems.trafficcontrol;
public class TrafficLight {
    public enum Signal { RED, YELLOW, GREEN }
    
    private final String id;
    private Signal currentSignal;
    private int duration;
    
    public TrafficLight(String id) {
        this.id = id;
        this.currentSignal = Signal.RED;
        this.duration = 30;
    }
    
    public String getId() { return id; }
    public Signal getCurrentSignal() { return currentSignal; }
    public void setSignal(Signal signal) { this.currentSignal = signal; }
    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
}
```

### 📄 `api/TrafficController.java`

```java
package com.you.lld.problems.trafficcontrol.api;

import com.you.lld.problems.trafficcontrol.model.*;

public interface TrafficController {
    void startCycle();
    void stopCycle();
    void enableEmergencyMode(String intersectionId);
    void disableEmergencyMode(String intersectionId);
    Intersection getIntersection(String intersectionId);
}
```

### 📄 `impl/TrafficControllerImpl.java`

```java
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
```

### 📄 `model/Direction.java`

```java
package com.you.lld.problems.trafficcontrol.model;

public enum Direction {
    NORTH, SOUTH, EAST, WEST
}
```

### 📄 `model/Intersection.java`

```java
package com.you.lld.problems.trafficcontrol.model;

import java.util.*;

public class Intersection {
    private final String id;
    private final String name;
    private final Map<Direction, TrafficLight> lights;
    private boolean emergencyMode;
    
    public Intersection(String id, String name) {
        this.id = id;
        this.name = name;
        this.lights = new HashMap<>();
        this.emergencyMode = false;
        initializeLights();
    }
    
    private void initializeLights() {
        for (Direction direction : Direction.values()) {
            String lightId = id + "_" + direction;
            lights.put(direction, new TrafficLight(lightId, id, direction));
        }
    }
    
    public void setEmergencyMode(boolean emergency) {
        this.emergencyMode = emergency;
        if (emergency) {
            for (TrafficLight light : lights.values()) {
                light.changeSignal(Signal.RED);
            }
        }
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
    public Map<Direction, TrafficLight> getLights() { return new HashMap<>(lights); }
    public boolean isEmergencyMode() { return emergencyMode; }
    
    @Override
    public String toString() {
        return "Intersection{id='" + id + "', name='" + name + "', emergency=" + emergencyMode + "}";
    }
}
```

### 📄 `model/Signal.java`

```java
package com.you.lld.problems.trafficcontrol.model;

public enum Signal {
    RED, YELLOW, GREEN
}
```

### 📄 `model/TrafficLight.java`

```java
package com.you.lld.problems.trafficcontrol.model;

public class TrafficLight {
    private final String id;
    private final String intersectionId;
    private final Direction direction;
    private Signal currentSignal;
    private int greenDuration;
    private int yellowDuration;
    private int redDuration;
    
    public TrafficLight(String id, String intersectionId, Direction direction) {
        this.id = id;
        this.intersectionId = intersectionId;
        this.direction = direction;
        this.currentSignal = Signal.RED;
        this.greenDuration = 30;
        this.yellowDuration = 5;
        this.redDuration = 35;
    }
    
    public void changeSignal(Signal signal) {
        this.currentSignal = signal;
        System.out.println("Light " + id + " (" + direction + "): " + signal);
    }
    
    public String getId() { return id; }
    public Direction getDirection() { return direction; }
    public Signal getCurrentSignal() { return currentSignal; }
    public int getGreenDuration() { return greenDuration; }
    public int getYellowDuration() { return yellowDuration; }
    public int getRedDuration() { return redDuration; }
    
    @Override
    public String toString() {
        return "TrafficLight{id='" + id + "', direction=" + direction + 
               ", signal=" + currentSignal + "}";
    }
}
```


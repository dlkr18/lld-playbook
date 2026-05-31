# trafficcontrol - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/trafficcontrol/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py trafficcontrol`.

## Project Structure (10 files)

```
trafficcontrol/
├── Demo.java
├── TrafficControlDemo.java
├── Intersection.java
├── TrafficLight.java
├── api/TrafficController.java
├── model/Direction.java
├── model/Intersection.java
├── model/Signal.java
├── model/TrafficLight.java
├── impl/TrafficControllerImpl.java
```

## Source Code

### `Demo.java`

<details>
<summary>Click to view Demo.java</summary>

```java
package com.you.lld.problems.trafficcontrol;
public class Demo { public static void main(String[] args) { System.out.println("Traffic Control"); } }
```

</details>

### `TrafficControlDemo.java`

<details>
<summary>Click to view TrafficControlDemo.java</summary>

```java
package com.you.lld.problems.trafficcontrol;

import com.you.lld.problems.trafficcontrol.impl.TrafficControllerImpl;
import com.you.lld.problems.trafficcontrol.model.Direction;
import com.you.lld.problems.trafficcontrol.model.TrafficLight;

import java.util.Map;

/**
 * Demo: Traffic Control system with signal cycles, emergency mode, intersections.
 */
public class TrafficControlDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Traffic Control Demo ===\n");

        TrafficControllerImpl controller = new TrafficControllerImpl();

        // Add intersections
        System.out.println("--- Setup ---");
        com.you.lld.problems.trafficcontrol.model.Intersection i1 = 
            new com.you.lld.problems.trafficcontrol.model.Intersection("INT-1", "Main St & 1st Ave");
        com.you.lld.problems.trafficcontrol.model.Intersection i2 = 
            new com.you.lld.problems.trafficcontrol.model.Intersection("INT-2", "Broadway & 5th Ave");
        controller.addIntersection(i1);
        controller.addIntersection(i2);
        System.out.println("Added 2 intersections");

        // Print initial light state
        printLights(controller, "INT-1");

        // Start traffic cycle
        System.out.println("\n--- Start cycle ---");
        controller.startCycle();
        System.out.println("Cycle started, waiting 3 seconds...");
        Thread.sleep(3000);
        printLights(controller, "INT-1");

        // Emergency mode
        System.out.println("\n--- Emergency mode ---");
        controller.enableEmergencyMode("INT-1");
        com.you.lld.problems.trafficcontrol.model.Intersection after = 
            controller.getIntersection("INT-1");
        System.out.println("INT-1 emergency: " + after.isEmergencyMode());
        printLights(controller, "INT-1");

        // Disable emergency
        controller.disableEmergencyMode("INT-1");
        System.out.println("Emergency disabled");

        Thread.sleep(2000);
        printLights(controller, "INT-2");

        // Stop cycle
        System.out.println("\n--- Stop ---");
        controller.stopCycle();
        controller.shutdown();
        System.out.println("Cycle stopped");

        System.out.println("\n=== Demo complete ===");
    }

    private static void printLights(TrafficControllerImpl controller, String intersectionId) {
        com.you.lld.problems.trafficcontrol.model.Intersection inter = 
            controller.getIntersection(intersectionId);
        if (inter == null) return;
        System.out.println("  " + inter.getName() + ":");
        Map<Direction, TrafficLight> lights = inter.getLights();
        for (Map.Entry<Direction, TrafficLight> e : lights.entrySet()) {
            System.out.println("    " + e.getKey() + ": " + e.getValue().getCurrentSignal());
        }
    }
}
```

</details>

### `Intersection.java`

<details>
<summary>Click to view Intersection.java</summary>

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

</details>

### `TrafficLight.java`

<details>
<summary>Click to view TrafficLight.java</summary>

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

</details>

### `api/TrafficController.java`

<details>
<summary>Click to view api/TrafficController.java</summary>

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

</details>

### `model/Direction.java`

<details>
<summary>Click to view model/Direction.java</summary>

```java
package com.you.lld.problems.trafficcontrol.model;

public enum Direction {
    NORTH, SOUTH, EAST, WEST
}
```

</details>

### `model/Intersection.java`

<details>
<summary>Click to view model/Intersection.java</summary>

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

</details>

### `model/Signal.java`

<details>
<summary>Click to view model/Signal.java</summary>

```java
package com.you.lld.problems.trafficcontrol.model;

public enum Signal {
    RED, YELLOW, GREEN
}
```

</details>

### `model/TrafficLight.java`

<details>
<summary>Click to view model/TrafficLight.java</summary>

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

</details>

### `impl/TrafficControllerImpl.java`

<details>
<summary>Click to view impl/TrafficControllerImpl.java</summary>

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
    
    /**
     * Non-blocking light cycle: toggles between N-S and E-W green on each invocation.
     * No Thread.sleep() -- relies on the scheduler's fixed-rate interval.
     * Light changes are synchronized on the intersection to prevent concurrent modification.
     */
    private void cycleLights(Intersection intersection) {
        Map<Direction, TrafficLight> lights = intersection.getLights();
        synchronized (intersection) {
            Signal northSignal = lights.get(Direction.NORTH).getCurrentSignal();
            if (northSignal == Signal.GREEN || northSignal == Signal.YELLOW) {
                // Switch to East-West green
                lights.get(Direction.NORTH).changeSignal(Signal.RED);
                lights.get(Direction.SOUTH).changeSignal(Signal.RED);
                lights.get(Direction.EAST).changeSignal(Signal.GREEN);
                lights.get(Direction.WEST).changeSignal(Signal.GREEN);
            } else {
                // Switch to North-South green
                lights.get(Direction.NORTH).changeSignal(Signal.GREEN);
                lights.get(Direction.SOUTH).changeSignal(Signal.GREEN);
                lights.get(Direction.EAST).changeSignal(Signal.RED);
                lights.get(Direction.WEST).changeSignal(Signal.RED);
            }
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

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.trafficcontrol.Demo"
```

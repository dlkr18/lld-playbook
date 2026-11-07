# trafficcontrol - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/trafficcontrol/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py trafficcontrol`.

## Project Structure (10 files)

```
trafficcontrol/
├── TrafficControlDemo.java
├── TrafficControl.java
├── model/Direction.java
├── model/Intersection.java
├── model/Signal.java
├── model/TrafficLight.java
├── service/TrafficComponent.java
├── service/TrafficController.java
├── service/impl/IntersectionGroup.java
├── service/impl/TrafficControllerImpl.java
```

## Source Code

### `TrafficControlDemo.java`

<details>
<summary>Click to view TrafficControlDemo.java</summary>

```java
package com.you.lld.problems.trafficcontrol;

import com.you.lld.problems.trafficcontrol.model.Direction;
import com.you.lld.problems.trafficcontrol.model.Intersection;
import com.you.lld.problems.trafficcontrol.model.Signal;
import com.you.lld.problems.trafficcontrol.service.impl.IntersectionGroup;

public class TrafficControlDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Traffic Control Demo ===\n");
        demoPhaseCycle();
        demoYellowTransition();
        demoEmergency();
        demoCompositeGroup();
        demoShutdown();
        System.out.println("\n=== Demo complete ===");
    }

    private static void demoPhaseCycle() {
        System.out.println("--- 1. N-S GREEN → YELLOW → E-W GREEN → YELLOW ---");
        Intersection intersection = new Intersection("A1");
        for (int i = 0; i < 4; i++) {
            printSignals(intersection);
            intersection.tick();
        }
    }

    private static void demoYellowTransition() {
        System.out.println("\n--- 2. Yellow transition ---");
        Intersection intersection = new Intersection("A2");
        intersection.tick();
        System.out.println("  NORTH after N-S green: " + intersection.getLight(Direction.NORTH).getSignal());
        intersection.tick();
        System.out.println("  NORTH after N-S yellow: " + intersection.getLight(Direction.NORTH).getSignal());
    }

    private static void demoEmergency() {
        System.out.println("\n--- 3. Emergency all-red ---");
        Intersection intersection = new Intersection("A3");
        intersection.enterEmergency();
        printSignals(intersection);
        intersection.exitEmergency();
        System.out.println("  restored:");
        printSignals(intersection);
    }

    private static void demoCompositeGroup() {
        System.out.println("\n--- 4. Composite intersection group ---");
        IntersectionGroup group = new IntersectionGroup("downtown");
        group.add(new Intersection("1st-Main"));
        group.add(new Intersection("2nd-Main"));
        group.tick();
        System.out.println("  coordinated intersections=" + group.getChildren().size());
    }

    private static void demoShutdown() throws InterruptedException {
        System.out.println("\n--- 5. Controller start/stop ---");
        TrafficControl control = new TrafficControl();
        control.register(new Intersection("A4"));
        control.getController().start();
        Thread.sleep(1500);
        control.getController().stop();
        System.out.println("  scheduler stopped cleanly");
    }

    private static void printSignals(Intersection intersection) {
        StringBuilder sb = new StringBuilder("  ");
        for (Direction d : Direction.values()) {
            sb.append(d.name()).append('=')
                    .append(intersection.getLight(d).getSignal()).append(' ');
        }
        System.out.println(sb.toString());
    }
}
```

</details>

### `TrafficControl.java`

<details>
<summary>Click to view TrafficControl.java</summary>

```java
package com.you.lld.problems.trafficcontrol;

import com.you.lld.problems.trafficcontrol.service.TrafficComponent;
import com.you.lld.problems.trafficcontrol.service.TrafficController;
import com.you.lld.problems.trafficcontrol.service.impl.TrafficControllerImpl;

public final class TrafficControl {

    private final TrafficController controller;

    public TrafficControl() {
        this.controller = new TrafficControllerImpl();
    }

    public void register(TrafficComponent component) {
        controller.register(component);
    }

    public TrafficController getController() {
        return controller;
    }
}
```

</details>

### `model/Direction.java`

<details>
<summary>Click to view model/Direction.java</summary>

```java
package com.you.lld.problems.trafficcontrol.model;

public enum Direction {
    NORTH,
    SOUTH,
    EAST,
    WEST
}
```

</details>

### `model/Intersection.java`

<details>
<summary>Click to view model/Intersection.java</summary>

```java
package com.you.lld.problems.trafficcontrol.model;

import com.you.lld.problems.trafficcontrol.service.TrafficComponent;

/**
 * Leaf composite node — four-way intersection cycling N-S and E-W phases.
 *
 * <p>The cycle is six phases, not four, because <b>every green must be preceded by
 * an all-red clearance interval</b>. Going straight from one direction's yellow to
 * the opposing green gives vehicles still inside the box no time to leave it — that
 * is the safety invariant of a signalled intersection, and the reason real
 * controllers are specified in terms of clearance time.
 */
public final class Intersection implements TrafficComponent {

    private final String id;
    private final TrafficLight north = new TrafficLight(Direction.NORTH);
    private final TrafficLight south = new TrafficLight(Direction.SOUTH);
    private final TrafficLight east = new TrafficLight(Direction.EAST);
    private final TrafficLight west = new TrafficLight(Direction.WEST);
    /** GREEN -> YELLOW -> ALL-RED -> (opposing) GREEN -> YELLOW -> ALL-RED. */
    private static final int PHASE_COUNT = 6;
    private static final int PHASE_NS_GREEN = 0;
    private static final int PHASE_NS_YELLOW = 1;
    private static final int PHASE_CLEAR_AFTER_NS = 2;
    private static final int PHASE_EW_GREEN = 3;
    private static final int PHASE_EW_YELLOW = 4;
    private static final int PHASE_CLEAR_AFTER_EW = 5;

    private int phase;
    private boolean emergency;

    public Intersection(String id) {
        this.id = id;
        applyPhase();
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public synchronized void tick() {
        if (emergency) {
            return;
        }
        phase = (phase + 1) % PHASE_COUNT;
        applyPhase();
    }

    @Override
    public synchronized void enterEmergency() {
        emergency = true;
        setAll(Signal.RED);
    }

    /**
     * Leaves the intersection in the all-red clearance phase rather than jumping
     * straight to a green. Coming out of an emergency hold is exactly when cross
     * traffic may still be moving through the box.
     */
    @Override
    public synchronized void exitEmergency() {
        emergency = false;
        phase = PHASE_CLEAR_AFTER_EW;
        applyPhase();
    }

    /** True while all four approaches are red — the clearance interval. */
    public synchronized boolean isAllRed() {
        return north.getSignal() == Signal.RED && south.getSignal() == Signal.RED
                && east.getSignal() == Signal.RED && west.getSignal() == Signal.RED;
    }

    public TrafficLight getLight(Direction direction) {
        if (direction == Direction.NORTH) {
            return north;
        }
        if (direction == Direction.SOUTH) {
            return south;
        }
        if (direction == Direction.EAST) {
            return east;
        }
        return west;
    }

    private void applyPhase() {
        if (phase == PHASE_NS_GREEN) {
            setPair(Signal.GREEN, north, south);
            setPair(Signal.RED, east, west);
        } else if (phase == PHASE_NS_YELLOW) {
            setPair(Signal.YELLOW, north, south);
            setPair(Signal.RED, east, west);
        } else if (phase == PHASE_EW_GREEN) {
            setPair(Signal.RED, north, south);
            setPair(Signal.GREEN, east, west);
        } else if (phase == PHASE_EW_YELLOW) {
            setPair(Signal.RED, north, south);
            setPair(Signal.YELLOW, east, west);
        } else {
            // PHASE_CLEAR_AFTER_NS / PHASE_CLEAR_AFTER_EW
            setAll(Signal.RED);
        }
    }

    private void setPair(Signal signal, TrafficLight a, TrafficLight b) {
        a.setSignal(signal);
        b.setSignal(signal);
    }

    private void setAll(Signal signal) {
        north.setSignal(signal);
        south.setSignal(signal);
        east.setSignal(signal);
        west.setSignal(signal);
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
    RED,
    YELLOW,
    GREEN
}
```

</details>

### `model/TrafficLight.java`

<details>
<summary>Click to view model/TrafficLight.java</summary>

```java
package com.you.lld.problems.trafficcontrol.model;

/**
 * One approach's lamp. Holds a {@link Signal} and nothing else.
 *
 * <p>This used to carry a per-light State machine ({@code SignalState} with
 * GREEN -> YELLOW -> RED -> GREEN and a duration per state). It was dead: nothing
 * ever called {@code advance()}, the durations were never read, and
 * {@link Intersection} drove the lamps directly via {@code setSignal}, replacing the
 * state object wholesale.
 *
 * <p>It was also the <b>wrong seam</b>, which is why it was bypassed. A per-light
 * machine cannot express the constraint that actually matters — "N-S may turn green
 * only once E-W has been red for the clearance interval" — because that is a
 * property of the intersection, not of any one lamp. Safety lives where the
 * conflicting directions are visible together, so the phase cycle on
 * {@code Intersection} is the real state machine.
 */
public final class TrafficLight {

    private final Direction direction;
    private Signal signal = Signal.RED;

    public TrafficLight(Direction direction) {
        this.direction = direction;
    }

    public Direction getDirection() {
        return direction;
    }

    public Signal getSignal() {
        return signal;
    }

    void setSignal(Signal signal) {
        this.signal = signal;
    }

    @Override
    public String toString() {
        return direction + "=" + signal;
    }
}
```

</details>

### `service/TrafficComponent.java`

<details>
<summary>Click to view service/TrafficComponent.java</summary>

```java
package com.you.lld.problems.trafficcontrol.service;

public interface TrafficComponent {

    String getId();

    void tick();

    void enterEmergency();

    void exitEmergency();
}
```

</details>

### `service/TrafficController.java`

<details>
<summary>Click to view service/TrafficController.java</summary>

```java
package com.you.lld.problems.trafficcontrol.service;

public interface TrafficController {

    void register(TrafficComponent component);

    void start();

    void stop();

    void tickOnce();

    void enterEmergency(String componentId);

    void exitEmergency(String componentId);

    TrafficComponent get(String componentId);
}
```

</details>

### `service/impl/IntersectionGroup.java`

<details>
<summary>Click to view service/impl/IntersectionGroup.java</summary>

```java
package com.you.lld.problems.trafficcontrol.service.impl;

import com.you.lld.problems.trafficcontrol.service.TrafficComponent;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Composite node — coordinates multiple intersections in sequence.
 */
public final class IntersectionGroup implements TrafficComponent {

    private final String id;
    private final List<TrafficComponent> children = new ArrayList<TrafficComponent>();
    private int activeIndex;

    public IntersectionGroup(String id) {
        this.id = id;
    }

    public void add(TrafficComponent component) {
        children.add(component);
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public synchronized void tick() {
        if (children.isEmpty()) {
            return;
        }
        children.get(activeIndex).tick();
        activeIndex = (activeIndex + 1) % children.size();
    }

    @Override
    public synchronized void enterEmergency() {
        for (TrafficComponent child : children) {
            child.enterEmergency();
        }
    }

    @Override
    public synchronized void exitEmergency() {
        for (TrafficComponent child : children) {
            child.exitEmergency();
        }
    }

    public List<TrafficComponent> getChildren() {
        return Collections.unmodifiableList(children);
    }
}
```

</details>

### `service/impl/TrafficControllerImpl.java`

<details>
<summary>Click to view service/impl/TrafficControllerImpl.java</summary>

```java
package com.you.lld.problems.trafficcontrol.service.impl;

import com.you.lld.problems.trafficcontrol.service.TrafficComponent;
import com.you.lld.problems.trafficcontrol.service.TrafficController;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public final class TrafficControllerImpl implements TrafficController {

    /** Concurrent: the scheduler thread iterates this while callers register. */
    private final Map<String, TrafficComponent> components = new ConcurrentHashMap<String, TrafficComponent>();
    private ScheduledExecutorService scheduler;

    @Override
    public void register(TrafficComponent component) {
        components.put(component.getId(), component);
    }

    @Override
    public synchronized void start() {
        if (scheduler != null) {
            return;
        }
        scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
                tickOnce();
            }
        }, 0, 1, TimeUnit.SECONDS);
    }

    @Override
    public synchronized void stop() {
        if (scheduler != null) {
            scheduler.shutdownNow();
            scheduler = null;
        }
    }

    @Override
    public void tickOnce() {
        for (TrafficComponent component : components.values()) {
            component.tick();
        }
    }

    @Override
    public void enterEmergency(String componentId) {
        TrafficComponent component = components.get(componentId);
        if (component != null) {
            component.enterEmergency();
        }
    }

    @Override
    public void exitEmergency(String componentId) {
        TrafficComponent component = components.get(componentId);
        if (component != null) {
            component.exitEmergency();
        }
    }

    @Override
    public TrafficComponent get(String componentId) {
        return components.get(componentId);
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.trafficcontrol.TrafficControlDemo"
```

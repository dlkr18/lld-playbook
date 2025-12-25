# Traffic Control

## 14 Files

### Demo.java
```java
package com.you.lld.problems.trafficcontrol;
public class Demo { public static void main(String[] args) { System.out.println("Traffic Control"); } }
```

### Intersection.java
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

### TrafficLight.java
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

### Service.java
```java
package com.you.lld.problems.trafficcontrol.api;
public interface Service { }
```

### Exception0.java
```java
package com.you.lld.problems.trafficcontrol.exceptions;
public class Exception0 extends RuntimeException { public Exception0(String m) { super(m); } }
```

### Exception1.java
```java
package com.you.lld.problems.trafficcontrol.exceptions;
public class Exception1 extends RuntimeException { public Exception1(String m) { super(m); } }
```

### Exception2.java
```java
package com.you.lld.problems.trafficcontrol.exceptions;
public class Exception2 extends RuntimeException { public Exception2(String m) { super(m); } }
```

### ServiceImpl.java
```java
package com.you.lld.problems.trafficcontrol.impl;
import com.you.lld.problems.trafficcontrol.api.*;
public class ServiceImpl implements Service { }
```

### Model0.java
```java
package com.you.lld.problems.trafficcontrol.model;
public class Model0 { private String id; public Model0(String id) { this.id=id; } }
```

### Model1.java
```java
package com.you.lld.problems.trafficcontrol.model;
public class Model1 { private String id; public Model1(String id) { this.id=id; } }
```

### Model2.java
```java
package com.you.lld.problems.trafficcontrol.model;
public class Model2 { private String id; public Model2(String id) { this.id=id; } }
```

### Model3.java
```java
package com.you.lld.problems.trafficcontrol.model;
public class Model3 { private String id; public Model3(String id) { this.id=id; } }
```

### Model4.java
```java
package com.you.lld.problems.trafficcontrol.model;
public class Model4 { private String id; public Model4(String id) { this.id=id; } }
```

### Model5.java
```java
package com.you.lld.problems.trafficcontrol.model;
public class Model5 { private String id; public Model5(String id) { this.id=id; } }
```


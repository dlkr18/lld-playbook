# featureflags - Complete Implementation

## Project Structure (10 files)

```
featureflags/
├── FeatureFlagsDemo.java
├── api/FeatureFlagService.java
├── audit/AuditLog.java
├── impl/FeatureFlagServiceImpl.java
├── model/Feature.java
├── model/FeatureToggle.java
├── model/RolloutStrategy.java
├── model/User.java
├── targeting/GroupTargetingRule.java
├── targeting/TargetingRule.java
```

## Source Code

### `FeatureFlagsDemo.java`

<details>
<summary>Click to view FeatureFlagsDemo.java</summary>

```java
package com.you.lld.problems.featureflags;

import com.you.lld.problems.featureflags.impl.FeatureFlagServiceImpl;
import com.you.lld.problems.featureflags.model.*;

public class FeatureFlagsDemo {
    public static void main(String[] args) {
        System.out.println(" Feature Flags Demo");
        System.out.println(String.format("%70s", "").replace(" ", "="));
        System.out.println();

        FeatureFlagServiceImpl service = new FeatureFlagServiceImpl();

        service.createFeature("new-ui", "New UI Design");
        service.enableFeature("new-ui");

        service.addRolloutStrategy("new-ui", "beta",
            new RolloutStrategy("percentage", 50, "beta-users"));

        User user1 = new User("U1", "alice@test.com", "beta-users");
        User user2 = new User("U2", "bob@test.com", "regular");

        System.out.println();
        System.out.println("Feature enabled for user1: " +
            service.isFeatureEnabled("new-ui", user1));
        System.out.println("Feature enabled for user2: " +
            service.isFeatureEnabled("new-ui", user2));

        System.out.println("\n Demo complete!");
    }
}
```

</details>

### `api/FeatureFlagService.java`

<details>
<summary>Click to view api/FeatureFlagService.java</summary>

```java
package com.you.lld.problems.featureflags.api;

import com.you.lld.problems.featureflags.model.*;
import java.util.List;

public interface FeatureFlagService {
    void createFeature(String id, String name);
    void enableFeature(String featureId);
    void disableFeature(String featureId);
    boolean isFeatureEnabled(String featureId, User user);
    void addRolloutStrategy(String featureId, String key, RolloutStrategy strategy);
    List<Feature> getAllFeatures();
}
```

</details>

### `audit/AuditLog.java`

<details>
<summary>Click to view audit/AuditLog.java</summary>

```java
package com.you.lld.problems.featureflags.audit;

import java.time.LocalDateTime;

public class AuditLog {
    private final String featureId;
    private final String userId;
    private final boolean enabled;
    private final LocalDateTime timestamp;

    public AuditLog(String featureId, String userId, boolean enabled) {
        this.featureId = featureId;
        this.userId = userId;
        this.enabled = enabled;
        this.timestamp = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return String.format("[%s] Feature %s: %s for user %s",
            timestamp, featureId, enabled ? "ENABLED" : "DISABLED", userId);
    }
}
```

</details>

### `impl/FeatureFlagServiceImpl.java`

<details>
<summary>Click to view impl/FeatureFlagServiceImpl.java</summary>

```java
package com.you.lld.problems.featureflags.impl;

import com.you.lld.problems.featureflags.api.FeatureFlagService;
import com.you.lld.problems.featureflags.model.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class FeatureFlagServiceImpl implements FeatureFlagService {
    private final Map<String, Feature> features = new ConcurrentHashMap<>();

    @Override
    public void createFeature(String id, String name) {
        features.put(id, new Feature(id, name));
        System.out.println("Feature created: " + name);
    }

    @Override
    public void enableFeature(String featureId) {
        Feature feature = features.get(featureId);
        if (feature != null) {
            feature.enable();
            System.out.println("Feature enabled: " + feature.getName());
        }
    }

    @Override
    public void disableFeature(String featureId) {
        Feature feature = features.get(featureId);
        if (feature != null) {
            feature.disable();
            System.out.println("Feature disabled: " + feature.getName());
        }
    }

    @Override
    public boolean isFeatureEnabled(String featureId, User user) {
        Feature feature = features.get(featureId);
        if (feature == null || !feature.isEnabled()) {
            return false;
        }

        for (RolloutStrategy strategy : feature.getStrategies().values()) {
            if (strategy.getTargetGroup().equals(user.getGroup())) {
                int hash = Math.abs(user.getId().hashCode() % 100);
                return hash < strategy.getPercentage();
            }
        }

        return true;
    }

    @Override
    public void addRolloutStrategy(String featureId, String key, RolloutStrategy strategy) {
        Feature feature = features.get(featureId);
        if (feature != null) {
            feature.addStrategy(key, strategy);
            System.out.println("Rollout strategy added: " + key);
        }
    }

    @Override
    public List<Feature> getAllFeatures() {
        return new ArrayList<>(features.values());
    }
}
```

</details>

### `model/Feature.java`

<details>
<summary>Click to view model/Feature.java</summary>

```java
package com.you.lld.problems.featureflags.model;

import java.util.*;

public class Feature {
    private final String id;
    private final String name;
    private boolean enabled;
    private final Map<String, RolloutStrategy> strategies;

    public Feature(String id, String name) {
        this.id = id;
        this.name = name;
        this.enabled = false;
        this.strategies = new HashMap<>();
    }

    public void enable() { this.enabled = true; }
    public void disable() { this.enabled = false; }

    public void addStrategy(String key, RolloutStrategy strategy) {
        strategies.put(key, strategy);
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public boolean isEnabled() { return enabled; }
    public Map<String, RolloutStrategy> getStrategies() { return strategies; }

    @Override
    public String toString() {
        return name + " (enabled=" + enabled + ")";
    }
}
```

</details>

### `model/FeatureToggle.java`

<details>
<summary>Click to view model/FeatureToggle.java</summary>

```java
package com.you.lld.problems.featureflags.model;

import java.time.LocalDateTime;

public class FeatureToggle {
    private final String id;
    private final String name;
    private boolean enabled;
    private LocalDateTime enabledAt;
    private LocalDateTime disabledAt;

    public FeatureToggle(String id, String name) {
        this.id = id;
        this.name = name;
        this.enabled = false;
    }

    public void enable() {
        this.enabled = true;
        this.enabledAt = LocalDateTime.now();
    }

    public void disable() {
        this.enabled = false;
        this.disabledAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public boolean isEnabled() { return enabled; }
}
```

</details>

### `model/RolloutStrategy.java`

<details>
<summary>Click to view model/RolloutStrategy.java</summary>

```java
package com.you.lld.problems.featureflags.model;

public class RolloutStrategy {
    private final String type;
    private final int percentage;
    private final String targetGroup;

    public RolloutStrategy(String type, int percentage, String targetGroup) {
        this.type = type;
        this.percentage = percentage;
        this.targetGroup = targetGroup;
    }

    public String getType() { return type; }
    public int getPercentage() { return percentage; }
    public String getTargetGroup() { return targetGroup; }
}
```

</details>

### `model/User.java`

<details>
<summary>Click to view model/User.java</summary>

```java
package com.you.lld.problems.featureflags.model;

public class User {
    private final String id;
    private final String email;
    private final String group;

    public User(String id, String email, String group) {
        this.id = id;
        this.email = email;
        this.group = group;
    }

    public String getId() { return id; }
    public String getGroup() { return group; }
}
```

</details>

### `targeting/GroupTargetingRule.java`

<details>
<summary>Click to view targeting/GroupTargetingRule.java</summary>

```java
package com.you.lld.problems.featureflags.targeting;

import com.you.lld.problems.featureflags.model.User;

public class GroupTargetingRule implements TargetingRule {
    private final String targetGroup;

    public GroupTargetingRule(String targetGroup) {
        this.targetGroup = targetGroup;
    }

    @Override
    public boolean matches(User user) {
        return user.getGroup().equals(targetGroup);
    }
}
```

</details>

### `targeting/TargetingRule.java`

<details>
<summary>Click to view targeting/TargetingRule.java</summary>

```java
package com.you.lld.problems.featureflags.targeting;

import com.you.lld.problems.featureflags.model.User;

public interface TargetingRule {
    boolean matches(User user);
}
```

</details>


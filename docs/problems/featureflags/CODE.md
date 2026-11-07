# featureflags - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/featureflags/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py featureflags`.

## Project Structure (12 files)

```
featureflags/
├── FeatureFlagsDemo.java
├── FeatureFlags.java
├── model/Feature.java
├── model/User.java
├── service/EvaluationStrategy.java
├── service/FeatureFlagService.java
├── service/impl/FeatureFlagServiceImpl.java
├── service/impl/PercentageRolloutStrategy.java
├── service/impl/TargetingEvaluationStrategy.java
├── targeting/EmailDomainTargetingRule.java
├── targeting/GroupTargetingRule.java
├── targeting/TargetingRule.java
```

## Source Code

### `FeatureFlagsDemo.java`

<details>
<summary>Click to view FeatureFlagsDemo.java</summary>

```java
package com.you.lld.problems.featureflags;

import com.you.lld.problems.featureflags.model.User;
import com.you.lld.problems.featureflags.service.FeatureFlagService;
import com.you.lld.problems.featureflags.service.impl.FeatureFlagServiceImpl;
import com.you.lld.problems.featureflags.service.impl.PercentageRolloutStrategy;
import com.you.lld.problems.featureflags.targeting.EmailDomainTargetingRule;
import com.you.lld.problems.featureflags.targeting.GroupTargetingRule;

/**
 * Interview-style demo: kill switch, targeting, percentage rollout, stable buckets.
 */
public class FeatureFlagsDemo {

    public static void main(String[] args) {
        System.out.println("=== Feature Flags Demo ===\n");

        FeatureFlagService service = new FeatureFlagServiceImpl();

        demoKillSwitch(service);
        demoGroupTargeting(service);
        demoPercentageRollout(service);
        demoStableBuckets(service);
        demoEmailDomainRule(service);

        System.out.println("=== Demo complete ===");
    }

    private static void demoKillSwitch(FeatureFlagService service) {
        System.out.println("--- Demo 1: Kill switch ---");
        service.createFeature("new-ui", "New UI Design");
        User user = new User("U1", "alice@test.com", "regular");

        System.out.println("Disabled: " + service.isFeatureEnabled("new-ui", user));
        service.enableFeature("new-ui");
        System.out.println("Enabled (100% rollout): " + service.isFeatureEnabled("new-ui", user));
        service.disableFeature("new-ui");
        System.out.println("Kill switch off: " + service.isFeatureEnabled("new-ui", user));
        System.out.println();
    }

    private static void demoGroupTargeting(FeatureFlagService service) {
        System.out.println("--- Demo 2: Group targeting ---");
        service.createFeature("beta-feature", "Beta Feature");
        service.enableFeature("beta-feature");
        service.addTargetingRule("beta-feature", new GroupTargetingRule("beta-users"));

        User beta = new User("U2", "beta@test.com", "beta-users");
        User regular = new User("U3", "regular@test.com", "regular");
        System.out.println("Beta user: " + service.isFeatureEnabled("beta-feature", beta));
        System.out.println("Regular user: " + service.isFeatureEnabled("beta-feature", regular));
        System.out.println();
    }

    private static void demoPercentageRollout(FeatureFlagService service) {
        System.out.println("--- Demo 3: Percentage rollout ---");
        service.createFeature("gradual-rollout", "Gradual Rollout");
        service.enableFeature("gradual-rollout");
        service.setRolloutPercentage("gradual-rollout", 50);

        int enabled = 0;
        for (int i = 0; i < 100; i++) {
            User u = new User("user-" + i, "u" + i + "@test.com", "regular");
            if (service.isFeatureEnabled("gradual-rollout", u)) {
                enabled++;
            }
        }
        System.out.println("~50% rollout: " + enabled + "/100 users enabled");
        System.out.println();
    }

    private static void demoStableBuckets(FeatureFlagService service) {
        System.out.println("--- Demo 4: Stable bucket (same user, same result) ---");
        User u = new User("stable-user", "stable@test.com", "regular");
        boolean first = service.isFeatureEnabled("gradual-rollout", u);
        boolean second = service.isFeatureEnabled("gradual-rollout", u);
        int bucket = PercentageRolloutStrategy.stableBucket("gradual-rollout", "stable-user");
        System.out.println("Bucket=" + bucket + ", consistent=" + (first == second));
        System.out.println();
    }

    private static void demoEmailDomainRule(FeatureFlagService service) {
        System.out.println("--- Demo 5: Email domain targeting + rollout ---");
        service.createFeature("employee-only", "Employee Dashboard");
        service.enableFeature("employee-only");
        service.addTargetingRule("employee-only", new EmailDomainTargetingRule("company.com"));
        service.setRolloutPercentage("employee-only", 100);

        User employee = new User("E1", "dev@company.com", "regular");
        User outsider = new User("O1", "dev@gmail.com", "regular");
        System.out.println("@company.com: " + service.isFeatureEnabled("employee-only", employee));
        System.out.println("@gmail.com: " + service.isFeatureEnabled("employee-only", outsider));
        System.out.println();
    }
}
```

</details>

### `FeatureFlags.java`

<details>
<summary>Click to view FeatureFlags.java</summary>

```java
package com.you.lld.problems.featureflags;

import com.you.lld.problems.featureflags.service.FeatureFlagService;
import com.you.lld.problems.featureflags.service.impl.FeatureFlagServiceImpl;

/**
 * Facade for feature flag evaluation.
 */
public final class FeatureFlags {

    private final FeatureFlagService service;

    public FeatureFlags() {
        this(new FeatureFlagServiceImpl());
    }

    public FeatureFlags(FeatureFlagService service) {
        this.service = service;
    }

    public FeatureFlagService service() {
        return service;
    }
}
```

</details>

### `model/Feature.java`

<details>
<summary>Click to view model/Feature.java</summary>

```java
package com.you.lld.problems.featureflags.model;

import com.you.lld.problems.featureflags.targeting.TargetingRule;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * A flag's configuration.
 *
 * <p><b>Thread-safety:</b> flags are written rarely (an operator toggling them) and
 * read constantly (every request), so the mutable scalars are {@code volatile} and
 * the rule list is a {@link CopyOnWriteArrayList} — the one case COW is exactly
 * right. A plain {@code ArrayList} here meant a rule added during a request could
 * be seen half-published, or throw {@code ConcurrentModificationException} mid-
 * evaluation.
 */
public class Feature {
    private final String id;
    private final String name;
    private volatile boolean enabled;
    private volatile int rolloutPercentage;
    private final List<TargetingRule> targetingRules;

    public Feature(String id, String name) {
        this.id = id;
        this.name = name;
        this.enabled = false;
        this.rolloutPercentage = 100;
        this.targetingRules = new CopyOnWriteArrayList<TargetingRule>();
    }

    public void enable() {
        this.enabled = true;
    }

    public void disable() {
        this.enabled = false;
    }

    /**
     * Rejects an out-of-range percentage <b>here</b>, at configuration time.
     *
     * <p>Validation used to live only in {@code PercentageRolloutStrategy}'s
     * constructor, which is built per evaluation — so {@code setRolloutPercentage(150)}
     * was accepted silently and then threw on every subsequent flag check, turning a
     * typo into a hot-path outage.
     */
    public void setRolloutPercentage(int percentage) {
        if (percentage < 0 || percentage > 100) {
            throw new IllegalArgumentException("Rollout percentage must be 0-100, got " + percentage);
        }
        this.rolloutPercentage = percentage;
    }

    public void addTargetingRule(TargetingRule rule) {
        targetingRules.add(rule);
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public int getRolloutPercentage() {
        return rolloutPercentage;
    }

    public List<TargetingRule> getTargetingRules() {
        return Collections.unmodifiableList(targetingRules);
    }

    @Override
    public String toString() {
        return name + " (enabled=" + enabled + ", rollout=" + rolloutPercentage + "%)";
    }
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
    public String getEmail() { return email; }
    public String getGroup() { return group; }
}
```

</details>

### `service/EvaluationStrategy.java`

<details>
<summary>Click to view service/EvaluationStrategy.java</summary>

```java
package com.you.lld.problems.featureflags.service;

import com.you.lld.problems.featureflags.model.Feature;
import com.you.lld.problems.featureflags.model.User;

/**
 * Strategy for evaluating whether a feature is enabled for a user.
 */
public interface EvaluationStrategy {

    boolean evaluate(Feature feature, User user);
}
```

</details>

### `service/FeatureFlagService.java`

<details>
<summary>Click to view service/FeatureFlagService.java</summary>

```java
package com.you.lld.problems.featureflags.service;

import com.you.lld.problems.featureflags.model.Feature;
import com.you.lld.problems.featureflags.model.User;

import java.util.List;

public interface FeatureFlagService {

    void createFeature(String id, String name);

    void enableFeature(String featureId);

    void disableFeature(String featureId);

    void addTargetingRule(String featureId, com.you.lld.problems.featureflags.targeting.TargetingRule rule);

    void setRolloutPercentage(String featureId, int percentage);

    boolean isFeatureEnabled(String featureId, User user);

    List<Feature> getAllFeatures();
}
```

</details>

### `service/impl/FeatureFlagServiceImpl.java`

<details>
<summary>Click to view service/impl/FeatureFlagServiceImpl.java</summary>

```java
package com.you.lld.problems.featureflags.service.impl;

import com.you.lld.problems.featureflags.model.Feature;
import com.you.lld.problems.featureflags.model.User;
import com.you.lld.problems.featureflags.service.EvaluationStrategy;
import com.you.lld.problems.featureflags.service.FeatureFlagService;
import com.you.lld.problems.featureflags.targeting.TargetingRule;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe feature flag service with targeting rules and percentage rollout.
 */
public final class FeatureFlagServiceImpl implements FeatureFlagService {

    private final ConcurrentHashMap<String, Feature> features = new ConcurrentHashMap<String, Feature>();

    @Override
    public void createFeature(String id, String name) {
        features.put(id, new Feature(id, name));
    }

    @Override
    public void enableFeature(String featureId) {
        requireFeature(featureId).enable();
    }

    @Override
    public void disableFeature(String featureId) {
        requireFeature(featureId).disable();
    }

    @Override
    public void addTargetingRule(String featureId, TargetingRule rule) {
        if (rule == null) {
            throw new IllegalArgumentException("Targeting rule required");
        }
        requireFeature(featureId).addTargetingRule(rule);
    }

    @Override
    public void setRolloutPercentage(String featureId, int percentage) {
        requireFeature(featureId).setRolloutPercentage(percentage);
    }

    /**
     * Configuration calls fail loudly on an unknown id.
     *
     * <p>These used to be {@code if (feature != null)} no-ops, so a typo'd flag id
     * meant "enable the feature" silently did nothing — the flag stays off, the
     * rollout never happens, and there is no signal anywhere that it was asked for.
     */
    private Feature requireFeature(String featureId) {
        Feature feature = features.get(featureId);
        if (feature == null) {
            throw new IllegalArgumentException("Feature not found: " + featureId);
        }
        return feature;
    }

    @Override
    public boolean isFeatureEnabled(String featureId, User user) {
        // Read path: an unknown flag is OFF rather than an error, so a stale client
        // asking about a deleted flag degrades gracefully. That is the opposite of
        // the configuration path above, deliberately.
        Feature feature = features.get(featureId);
        if (feature == null || !feature.isEnabled()) {
            return false;
        }
        // Previously allocated two strategy objects on EVERY evaluation — and flag
        // checks run on every request. Both are stateless given the feature, so the
        // rollout decision is a static call and targeting is a plain loop.
        for (TargetingRule rule : feature.getTargetingRules()) {
            if (rule.matches(user)) {
                return withinRollout(feature, user);
            }
        }
        return feature.getTargetingRules().isEmpty() && withinRollout(feature, user);
    }

    private static boolean withinRollout(Feature feature, User user) {
        return PercentageRolloutStrategy.stableBucket(feature.getId(), user.getId())
                < feature.getRolloutPercentage();
    }

    @Override
    public List<Feature> getAllFeatures() {
        return new ArrayList<Feature>(features.values());
    }
}
```

</details>

### `service/impl/PercentageRolloutStrategy.java`

<details>
<summary>Click to view service/impl/PercentageRolloutStrategy.java</summary>

```java
package com.you.lld.problems.featureflags.service.impl;

import com.you.lld.problems.featureflags.model.Feature;
import com.you.lld.problems.featureflags.model.User;
import com.you.lld.problems.featureflags.service.EvaluationStrategy;
import com.you.lld.problems.featureflags.targeting.TargetingRule;

/**
 * Percentage rollout with stable bucket: same user always gets same result for a feature.
 */
public final class PercentageRolloutStrategy implements EvaluationStrategy {

    private final int percentage;

    public PercentageRolloutStrategy(int percentage) {
        if (percentage < 0 || percentage > 100) {
            throw new IllegalArgumentException("Percentage must be 0-100");
        }
        this.percentage = percentage;
    }

    @Override
    public boolean evaluate(Feature feature, User user) {
        int bucket = stableBucket(feature.getId(), user.getId());
        return bucket < percentage;
    }

    /**
     * Stable bucket in [0, 100).
     *
     * <p>{@link Math#floorMod}, not {@code Math.abs(h) % 100}: {@code Math.abs(
     * Integer.MIN_VALUE)} is still {@code Integer.MIN_VALUE} (two's complement has no
     * positive counterpart), so that idiom yields a <em>negative</em> bucket for one
     * key in 2^32 — and {@code bucket < percentage} is then true even at 0%, silently
     * enabling a flag that is fully off.
     */
    public static int stableBucket(String featureId, String userId) {
        String key = featureId + ":" + userId;
        return Math.floorMod(key.hashCode(), 100);
    }
}
```

</details>

### `service/impl/TargetingEvaluationStrategy.java`

<details>
<summary>Click to view service/impl/TargetingEvaluationStrategy.java</summary>

```java
package com.you.lld.problems.featureflags.service.impl;

import com.you.lld.problems.featureflags.model.Feature;
import com.you.lld.problems.featureflags.model.User;
import com.you.lld.problems.featureflags.service.EvaluationStrategy;
import com.you.lld.problems.featureflags.targeting.TargetingRule;

import java.util.List;

/**
 * Evaluates targeting rules first; if any match, applies rollout strategy.
 * If no rules, applies rollout to all users.
 */
public final class TargetingEvaluationStrategy implements EvaluationStrategy {

    private final List<TargetingRule> rules;
    private final EvaluationStrategy rollout;

    public TargetingEvaluationStrategy(List<TargetingRule> rules, EvaluationStrategy rollout) {
        this.rules = rules;
        this.rollout = rollout;
    }

    @Override
    public boolean evaluate(Feature feature, User user) {
        if (!rules.isEmpty()) {
            boolean matched = false;
            for (TargetingRule rule : rules) {
                if (rule.matches(user)) {
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                return false;
            }
        }
        return rollout.evaluate(feature, user);
    }
}
```

</details>

### `targeting/EmailDomainTargetingRule.java`

<details>
<summary>Click to view targeting/EmailDomainTargetingRule.java</summary>

```java
package com.you.lld.problems.featureflags.targeting;

import com.you.lld.problems.featureflags.model.User;

/**
 * Matches users by email domain (e.g. "@company.com" for employees).
 */
public final class EmailDomainTargetingRule implements TargetingRule {

    private final String domain;

    public EmailDomainTargetingRule(String domain) {
        this.domain = domain.startsWith("@") ? domain : "@" + domain;
    }

    @Override
    public boolean matches(User user) {
        return user.getEmail() != null && user.getEmail().endsWith(domain);
    }
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

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.featureflags.FeatureFlagsDemo"
```

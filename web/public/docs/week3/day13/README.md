# Day 13: Feature Flags & Configuration 🚩

**Focus**: Implement feature flag systems with rollout strategies and dynamic configuration.

---

## 🎯 **Learning Objectives**

By the end of Day 13, you will:
- **Design** a feature flag system
- **Implement** various rollout strategies
- **Handle** flag evaluation efficiently
- **Build** configuration management

---

## 📚 **Feature Flag Types**

### **1. Boolean Flags**
Simple on/off toggles
```java
if (featureFlags.isEnabled("dark-mode")) {
    renderDarkTheme();
}
```

### **2. Variant Flags**
Multiple variations for A/B testing
```java
String variant = featureFlags.getVariant("checkout-button-color");
// "blue", "green", "red"
```

### **3. Percentage Rollout**
Gradual feature release
```java
// Enable for 10% of users, then 25%, 50%, 100%
```

### **4. User Segment Targeting**
Target specific user groups
```java
// Enable for beta users, premium users, specific regions
```

---

## 🏗️ **Core Components**

### **Feature Flag Model**

```java
public class FeatureFlag {
    private final String key;
    private final String name;
    private final String description;
    private final FlagType type;
    private final Object defaultValue;
    private final boolean enabled;
    private final List<Rule> rules;
    private final RolloutStrategy rolloutStrategy;
    private final Instant createdAt;
    private final Instant updatedAt;
    
    public enum FlagType {
        BOOLEAN, STRING, NUMBER, JSON
    }
}

public class Rule {
    private final int priority;
    private final List<Condition> conditions;
    private final Object value;
    private final int percentage; // For partial rollout within rule
}

public class Condition {
    private final String attribute;
    private final Operator operator;
    private final Object value;
    
    public enum Operator {
        EQUALS, NOT_EQUALS, CONTAINS, IN, NOT_IN,
        GREATER_THAN, LESS_THAN, REGEX, SEMVER_GT, SEMVER_LT
    }
}
```

### **Evaluation Context**

```java
public class EvaluationContext {
    private final String userId;
    private final Map<String, Object> attributes;
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private String userId;
        private Map<String, Object> attributes = new HashMap<>();
        
        public Builder userId(String userId) {
            this.userId = userId;
            return this;
        }
        
        public Builder attribute(String key, Object value) {
            this.attributes.put(key, value);
            return this;
        }
        
        public Builder userAgent(String userAgent) {
            return attribute("userAgent", userAgent);
        }
        
        public Builder country(String country) {
            return attribute("country", country);
        }
        
        public Builder isPremium(boolean premium) {
            return attribute("isPremium", premium);
        }
        
        public Builder betaUser(boolean beta) {
            return attribute("betaUser", beta);
        }
        
        public EvaluationContext build() {
            return new EvaluationContext(userId, attributes);
        }
    }
}
```

---

## 📊 **Rollout Strategies**

```java
public interface RolloutStrategy {
    boolean shouldEnable(FeatureFlag flag, EvaluationContext context);
}

// Percentage-based rollout
public class PercentageRollout implements RolloutStrategy {
    
    private final int percentage;
    
    @Override
    public boolean shouldEnable(FeatureFlag flag, EvaluationContext context) {
        // Use consistent hashing so same user always gets same result
        int hash = Math.abs((flag.getKey() + context.getUserId()).hashCode());
        int bucket = hash % 100;
        return bucket < percentage;
    }
}

// Gradual rollout
public class GradualRollout implements RolloutStrategy {
    
    private final List<RolloutStage> stages;
    private final Instant startTime;
    
    @Override
    public boolean shouldEnable(FeatureFlag flag, EvaluationContext context) {
        Instant now = Instant.now();
        
        for (RolloutStage stage : stages) {
            if (now.isAfter(stage.getStartTime())) {
                int hash = Math.abs((flag.getKey() + context.getUserId()).hashCode());
                if (hash % 100 < stage.getPercentage()) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    public static class RolloutStage {
        private final Instant startTime;
        private final int percentage;
    }
}

// User segment targeting
public class SegmentRollout implements RolloutStrategy {
    
    private final List<Segment> enabledSegments;
    
    @Override
    public boolean shouldEnable(FeatureFlag flag, EvaluationContext context) {
        return enabledSegments.stream()
            .anyMatch(segment -> segment.matches(context));
    }
}

public class Segment {
    private final String name;
    private final List<Condition> conditions;
    
    public boolean matches(EvaluationContext context) {
        return conditions.stream()
            .allMatch(condition -> condition.evaluate(context));
    }
}
```

---

## 🔄 **Flag Evaluation Engine**

```java
public class FeatureFlagEvaluator {
    
    private final FlagRepository repository;
    private final Cache<String, FeatureFlag> cache;
    
    public boolean isEnabled(String flagKey, EvaluationContext context) {
        FeatureFlag flag = getFlag(flagKey);
        
        if (flag == null || !flag.isEnabled()) {
            return false;
        }
        
        // Evaluate rules in priority order
        for (Rule rule : flag.getRules()) {
            if (evaluateRule(rule, context)) {
                return true;
            }
        }
        
        // Fall back to rollout strategy
        RolloutStrategy strategy = flag.getRolloutStrategy();
        if (strategy != null) {
            return strategy.shouldEnable(flag, context);
        }
        
        return (Boolean) flag.getDefaultValue();
    }
    
    public <T> T getValue(String flagKey, EvaluationContext context, Class<T> type) {
        FeatureFlag flag = getFlag(flagKey);
        
        if (flag == null) {
            throw new FlagNotFoundException(flagKey);
        }
        
        // Evaluate rules
        for (Rule rule : flag.getRules()) {
            if (evaluateRule(rule, context)) {
                return type.cast(rule.getValue());
            }
        }
        
        return type.cast(flag.getDefaultValue());
    }
    
    private boolean evaluateRule(Rule rule, EvaluationContext context) {
        // Check percentage first
        if (rule.getPercentage() < 100) {
            int hash = Math.abs(context.getUserId().hashCode());
            if (hash % 100 >= rule.getPercentage()) {
                return false;
            }
        }
        
        // All conditions must match
        return rule.getConditions().stream()
            .allMatch(condition -> evaluateCondition(condition, context));
    }
    
    private boolean evaluateCondition(Condition condition, EvaluationContext context) {
        Object contextValue = context.getAttribute(condition.getAttribute());
        Object conditionValue = condition.getValue();
        
        switch (condition.getOperator()) {
            case EQUALS:
                return Objects.equals(contextValue, conditionValue);
            case NOT_EQUALS:
                return !Objects.equals(contextValue, conditionValue);
            case CONTAINS:
                return String.valueOf(contextValue).contains(String.valueOf(conditionValue));
            case IN:
                return ((Collection<?>) conditionValue).contains(contextValue);
            case GREATER_THAN:
                return compare(contextValue, conditionValue) > 0;
            case LESS_THAN:
                return compare(contextValue, conditionValue) < 0;
            case REGEX:
                return Pattern.matches(String.valueOf(conditionValue), String.valueOf(contextValue));
            default:
                return false;
        }
    }
}
```

---

## 🌐 **Feature Flag Service**

```java
public interface FeatureFlagService {
    
    // Evaluation
    boolean isEnabled(String flagKey);
    boolean isEnabled(String flagKey, EvaluationContext context);
    <T> T getValue(String flagKey, EvaluationContext context, Class<T> type);
    
    // Management
    FeatureFlag createFlag(CreateFlagRequest request);
    FeatureFlag updateFlag(String flagKey, UpdateFlagRequest request);
    void deleteFlag(String flagKey);
    void enableFlag(String flagKey);
    void disableFlag(String flagKey);
    
    // Query
    List<FeatureFlag> getAllFlags();
    FeatureFlag getFlag(String flagKey);
    List<FeatureFlag> getFlagsByTag(String tag);
    
    // Audit
    List<FlagChange> getChangeHistory(String flagKey);
}

public class FeatureFlagServiceImpl implements FeatureFlagService {
    
    private final FlagRepository repository;
    private final FeatureFlagEvaluator evaluator;
    private final EventPublisher eventPublisher;
    private final AuditLogger auditLogger;
    
    @Override
    public boolean isEnabled(String flagKey, EvaluationContext context) {
        boolean result = evaluator.isEnabled(flagKey, context);
        
        // Track evaluation for analytics
        eventPublisher.publish(new FlagEvaluatedEvent(flagKey, context, result));
        
        return result;
    }
    
    @Override
    public FeatureFlag updateFlag(String flagKey, UpdateFlagRequest request) {
        FeatureFlag existing = repository.findByKey(flagKey)
            .orElseThrow(() -> new FlagNotFoundException(flagKey));
        
        FeatureFlag updated = existing.toBuilder()
            .name(request.getName())
            .description(request.getDescription())
            .rules(request.getRules())
            .rolloutStrategy(request.getRolloutStrategy())
            .build();
        
        repository.save(updated);
        
        // Audit trail
        auditLogger.log(new FlagUpdatedEvent(flagKey, existing, updated));
        
        // Invalidate cache
        evaluator.invalidateCache(flagKey);
        
        return updated;
    }
}
```

---

## 🎯 **Best Practices**

1. **Default to off**: New flags should be disabled by default
2. **Clean up**: Remove flags after full rollout
3. **Document flags**: Track purpose and ownership
4. **Monitor**: Track flag evaluations and performance
5. **Kill switch**: Critical flags should be instantly toggleable

---

**Next**: [Day 14 - KV Store](week3/day14/README.md) →

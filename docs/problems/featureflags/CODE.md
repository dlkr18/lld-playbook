# Feature Flags - Configuration System 🚩

Production-ready **feature flag system** with **gradual rollouts**, **targeting rules**, **A/B testing**, and **real-time updates**. Essential for continuous delivery.

---

## 🎯 **Core Features**

✅ **Feature Toggles** - Enable/disable features  
✅ **Gradual Rollouts** - 0% → 100% rollout  
✅ **User Targeting** - Target specific users/groups  
✅ **A/B Testing** - Multiple variants  
✅ **Real-Time Updates** - No deployment needed  

---

## 💻 **Implementation**

```java
public class FeatureFlagService {
    
    private final Map<String, FeatureFlag> flags = new ConcurrentHashMap<>();
    
    public boolean isEnabled(String flagName, User user) {
        FeatureFlag flag = flags.get(flagName);
        if (flag == null) return false;
        
        // 1. Check if globally enabled
        if (!flag.isEnabled()) return false;
        
        // 2. Check user targeting rules
        if (!flag.matchesTargeting(user)) return false;
        
        // 3. Check rollout percentage
        return flag.isInRollout(user);
    }
    
    public String getVariant(String flagName, User user) {
        if (!isEnabled(flagName, user)) {
            return "control";
        }
        
        FeatureFlag flag = flags.get(flagName);
        return flag.getVariantFor(user);
    }
}

public class FeatureFlag {
    
    private final String name;
    private boolean enabled;
    private int rolloutPercentage;
    private List<TargetingRule> targetingRules;
    private Map<String, Integer> variantWeights;
    
    public boolean isInRollout(User user) {
        // Consistent hashing for stable assignment
        int hash = Math.abs((name + user.getId()).hashCode() % 100);
        return hash < rolloutPercentage;
    }
    
    public String getVariantFor(User user) {
        // Weighted random selection
        int hash = Math.abs((name + user.getId()).hashCode() % 100);
        int cumulative = 0;
        
        for (Map.Entry<String, Integer> entry : variantWeights.entrySet()) {
            cumulative += entry.getValue();
            if (hash < cumulative) {
                return entry.getKey();
            }
        }
        
        return "control";
    }
}
```

---

## 🔗 **Related Resources**

- [Day 13: Feature Flags](week3/day13/README.md)

---

✨ **Safe feature releases with gradual rollouts!** 🚩


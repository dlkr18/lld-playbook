# Feature Flag System

## Overview
Feature toggle system for gradual rollouts, A/B testing, and emergency killswitches with targeting rules.

## Key Features
- Boolean flags (on/off)
- Percentage rollouts
- User targeting
- A/B testing
- Remote configuration

## Key Algorithms
```java
public boolean isEnabled(String flagName, User user) {
    FeatureFlag flag = flags.get(flagName);
    if (flag == null) return false;
    
    // Check targeting rules
    if (flag.hasTargeting() && flag.getTargetUsers().contains(user.getId())) {
        return true;
    }
    
    // Percentage rollout
    if (flag.getRolloutPercentage() > 0) {
        int hash = Math.abs(user.getId().hashCode() % 100);
        return hash < flag.getRolloutPercentage();
    }
    
    return flag.isEnabled();
}
```

## Source Code
📄 **[View Complete Source Code](/problems/featureflags/CODE)**

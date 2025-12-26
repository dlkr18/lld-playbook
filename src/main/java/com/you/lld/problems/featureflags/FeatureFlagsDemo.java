package com.you.lld.problems.featureflags;

import com.you.lld.problems.featureflags.impl.FeatureFlagServiceImpl;
import com.you.lld.problems.featureflags.model.*;

public class FeatureFlagsDemo {
    public static void main(String[] args) {
        System.out.println("🚩 Feature Flags Demo");
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
        
        System.out.println("\n✅ Demo complete!");
    }
}

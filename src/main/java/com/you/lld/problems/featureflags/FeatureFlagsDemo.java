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

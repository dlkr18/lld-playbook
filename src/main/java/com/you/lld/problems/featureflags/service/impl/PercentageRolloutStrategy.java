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

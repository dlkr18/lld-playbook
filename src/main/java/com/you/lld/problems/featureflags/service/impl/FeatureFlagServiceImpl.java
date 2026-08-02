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

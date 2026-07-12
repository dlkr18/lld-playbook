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
        Feature feature = features.get(featureId);
        if (feature != null) {
            feature.enable();
        }
    }

    @Override
    public void disableFeature(String featureId) {
        Feature feature = features.get(featureId);
        if (feature != null) {
            feature.disable();
        }
    }

    @Override
    public void addTargetingRule(String featureId, TargetingRule rule) {
        Feature feature = features.get(featureId);
        if (feature != null && rule != null) {
            feature.addTargetingRule(rule);
        }
    }

    @Override
    public void setRolloutPercentage(String featureId, int percentage) {
        Feature feature = features.get(featureId);
        if (feature != null) {
            feature.setRolloutPercentage(percentage);
        }
    }

    @Override
    public boolean isFeatureEnabled(String featureId, User user) {
        Feature feature = features.get(featureId);
        if (feature == null || !feature.isEnabled()) {
            return false;
        }
        EvaluationStrategy strategy = new TargetingEvaluationStrategy(
                feature.getTargetingRules(),
                new PercentageRolloutStrategy(feature.getRolloutPercentage()));
        return strategy.evaluate(feature, user);
    }

    @Override
    public List<Feature> getAllFeatures() {
        return new ArrayList<Feature>(features.values());
    }
}

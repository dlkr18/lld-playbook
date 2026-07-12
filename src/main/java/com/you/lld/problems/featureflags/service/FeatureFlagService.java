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

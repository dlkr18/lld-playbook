package com.you.lld.problems.featureflags.api;

import com.you.lld.problems.featureflags.model.*;
import java.util.List;

public interface FeatureFlagService {
    void createFeature(String id, String name);
    void enableFeature(String featureId);
    void disableFeature(String featureId);
    boolean isFeatureEnabled(String featureId, User user);
    void addRolloutStrategy(String featureId, String key, RolloutStrategy strategy);
    List<Feature> getAllFeatures();
}

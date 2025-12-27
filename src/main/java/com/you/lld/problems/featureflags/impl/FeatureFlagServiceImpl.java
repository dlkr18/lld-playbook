package com.you.lld.problems.featureflags.impl;

import com.you.lld.problems.featureflags.api.FeatureFlagService;
import com.you.lld.problems.featureflags.model.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class FeatureFlagServiceImpl implements FeatureFlagService {
    private final Map<String, Feature> features = new ConcurrentHashMap<>();
    
    @Override
    public void createFeature(String id, String name) {
        features.put(id, new Feature(id, name));
        System.out.println("Feature created: " + name);
    }
    
    @Override
    public void enableFeature(String featureId) {
        Feature feature = features.get(featureId);
        if (feature != null) {
            feature.enable();
            System.out.println("Feature enabled: " + feature.getName());
        }
    }
    
    @Override
    public void disableFeature(String featureId) {
        Feature feature = features.get(featureId);
        if (feature != null) {
            feature.disable();
            System.out.println("Feature disabled: " + feature.getName());
        }
    }
    
    @Override
    public boolean isFeatureEnabled(String featureId, User user) {
        Feature feature = features.get(featureId);
        if (feature == null || !feature.isEnabled()) {
            return false;
        }
        
        for (RolloutStrategy strategy : feature.getStrategies().values()) {
            if (strategy.getTargetGroup().equals(user.getGroup())) {
                int hash = Math.abs(user.getId().hashCode() % 100);
                return hash < strategy.getPercentage();
            }
        }
        
        return true;
    }
    
    @Override
    public void addRolloutStrategy(String featureId, String key, RolloutStrategy strategy) {
        Feature feature = features.get(featureId);
        if (feature != null) {
            feature.addStrategy(key, strategy);
            System.out.println("Rollout strategy added: " + key);
        }
    }
    
    @Override
    public List<Feature> getAllFeatures() {
        return new ArrayList<>(features.values());
    }
}

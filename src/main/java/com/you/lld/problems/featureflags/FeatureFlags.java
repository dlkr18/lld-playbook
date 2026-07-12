package com.you.lld.problems.featureflags;

import com.you.lld.problems.featureflags.service.FeatureFlagService;
import com.you.lld.problems.featureflags.service.impl.FeatureFlagServiceImpl;

/**
 * Facade for feature flag evaluation.
 */
public final class FeatureFlags {

    private final FeatureFlagService service;

    public FeatureFlags() {
        this(new FeatureFlagServiceImpl());
    }

    public FeatureFlags(FeatureFlagService service) {
        this.service = service;
    }

    public FeatureFlagService service() {
        return service;
    }
}

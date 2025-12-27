package com.you.lld.problems.featureflags.targeting;

import com.you.lld.problems.featureflags.model.User;

public interface TargetingRule {
    boolean matches(User user);
}

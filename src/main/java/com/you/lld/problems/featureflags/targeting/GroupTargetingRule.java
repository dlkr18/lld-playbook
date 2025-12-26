package com.you.lld.problems.featureflags.targeting;

import com.you.lld.problems.featureflags.model.User;

public class GroupTargetingRule implements TargetingRule {
    private final String targetGroup;
    
    public GroupTargetingRule(String targetGroup) {
        this.targetGroup = targetGroup;
    }
    
    @Override
    public boolean matches(User user) {
        return user.getGroup().equals(targetGroup);
    }
}

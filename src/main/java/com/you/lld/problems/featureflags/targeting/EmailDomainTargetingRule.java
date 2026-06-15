package com.you.lld.problems.featureflags.targeting;

import com.you.lld.problems.featureflags.model.User;

/**
 * Matches users by email domain (e.g. "@company.com" for employees).
 */
public final class EmailDomainTargetingRule implements TargetingRule {

    private final String domain;

    public EmailDomainTargetingRule(String domain) {
        this.domain = domain.startsWith("@") ? domain : "@" + domain;
    }

    @Override
    public boolean matches(User user) {
        return user.getEmail() != null && user.getEmail().endsWith(domain);
    }
}

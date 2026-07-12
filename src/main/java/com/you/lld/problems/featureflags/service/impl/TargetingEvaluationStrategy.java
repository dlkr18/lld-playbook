package com.you.lld.problems.featureflags.service.impl;

import com.you.lld.problems.featureflags.model.Feature;
import com.you.lld.problems.featureflags.model.User;
import com.you.lld.problems.featureflags.service.EvaluationStrategy;
import com.you.lld.problems.featureflags.targeting.TargetingRule;

import java.util.List;

/**
 * Evaluates targeting rules first; if any match, applies rollout strategy.
 * If no rules, applies rollout to all users.
 */
public final class TargetingEvaluationStrategy implements EvaluationStrategy {

    private final List<TargetingRule> rules;
    private final EvaluationStrategy rollout;

    public TargetingEvaluationStrategy(List<TargetingRule> rules, EvaluationStrategy rollout) {
        this.rules = rules;
        this.rollout = rollout;
    }

    @Override
    public boolean evaluate(Feature feature, User user) {
        if (!rules.isEmpty()) {
            boolean matched = false;
            for (TargetingRule rule : rules) {
                if (rule.matches(user)) {
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                return false;
            }
        }
        return rollout.evaluate(feature, user);
    }
}

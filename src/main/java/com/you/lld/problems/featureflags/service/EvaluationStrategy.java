package com.you.lld.problems.featureflags.service;

import com.you.lld.problems.featureflags.model.Feature;
import com.you.lld.problems.featureflags.model.User;

/**
 * Strategy for evaluating whether a feature is enabled for a user.
 */
public interface EvaluationStrategy {

    boolean evaluate(Feature feature, User user);
}

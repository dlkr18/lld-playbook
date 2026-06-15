package com.you.lld.problems.splitwise.service.impl;

import com.you.lld.problems.splitwise.model.SplitType;
import com.you.lld.problems.splitwise.service.SplitStrategy;

public final class SplitStrategyFactory {
    private SplitStrategyFactory() {}

    public static SplitStrategy forType(SplitType type) {
        switch (type) {
            case EQUAL:
                return new EqualSplitStrategy();
            case EXACT:
                return new ExactSplitStrategy();
            case PERCENTAGE:
                return new PercentageSplitStrategy();
            default:
                throw new IllegalArgumentException("Unsupported split type: " + type);
        }
    }
}

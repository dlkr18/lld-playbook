package com.you.lld.problems.splitwise.service.impl;

import com.you.lld.problems.splitwise.service.SplitStrategy;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PercentageSplitStrategy implements SplitStrategy {
    @Override
    public Map<String, BigDecimal> compute(BigDecimal total, List<String> participants, Map<String, BigDecimal> details) {
        if (details == null || details.isEmpty()) {
            throw new IllegalArgumentException("Percentage split requires percent per participant");
        }
        BigDecimal pctSum = BigDecimal.ZERO;
        Map<String, BigDecimal> splits = new HashMap<String, BigDecimal>();
        for (String userId : participants) {
            BigDecimal pct = details.getOrDefault(userId, BigDecimal.ZERO);
            pctSum = pctSum.add(pct);
            BigDecimal share = total.multiply(pct).divide(new BigDecimal("100"), 2, RoundingMode.HALF_EVEN);
            splits.put(userId, share);
        }
        if (pctSum.compareTo(new BigDecimal("100")) != 0) {
            throw new IllegalArgumentException("Percentages must sum to 100, got " + pctSum);
        }
        return splits;
    }
}

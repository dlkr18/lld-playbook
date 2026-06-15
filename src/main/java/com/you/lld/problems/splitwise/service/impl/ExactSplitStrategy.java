package com.you.lld.problems.splitwise.service.impl;

import com.you.lld.problems.splitwise.service.SplitStrategy;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExactSplitStrategy implements SplitStrategy {
    @Override
    public Map<String, BigDecimal> compute(BigDecimal total, List<String> participants, Map<String, BigDecimal> details) {
        if (details == null || details.isEmpty()) {
            throw new IllegalArgumentException("Exact split requires amount per participant");
        }
        BigDecimal sum = BigDecimal.ZERO;
        Map<String, BigDecimal> splits = new HashMap<String, BigDecimal>();
        for (String userId : participants) {
            BigDecimal amt = details.getOrDefault(userId, BigDecimal.ZERO);
            splits.put(userId, amt);
            sum = sum.add(amt);
        }
        if (sum.compareTo(total) != 0) {
            throw new IllegalArgumentException("Exact amounts (" + sum + ") must equal total (" + total + ")");
        }
        return splits;
    }
}

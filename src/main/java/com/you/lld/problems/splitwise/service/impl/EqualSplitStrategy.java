package com.you.lld.problems.splitwise.service.impl;

import com.you.lld.problems.splitwise.service.SplitStrategy;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EqualSplitStrategy implements SplitStrategy {
    @Override
    public Map<String, BigDecimal> compute(BigDecimal total, List<String> participants, Map<String, BigDecimal> details) {
        if (participants == null || participants.isEmpty()) {
            throw new IllegalArgumentException("At least one participant required");
        }
        int n = participants.size();
        BigDecimal base = total.divide(BigDecimal.valueOf(n), 2, RoundingMode.HALF_EVEN);
        BigDecimal allocated = base.multiply(BigDecimal.valueOf(n));
        BigDecimal remainder = total.subtract(allocated);

        Map<String, BigDecimal> splits = new HashMap<String, BigDecimal>();
        for (int i = 0; i < n; i++) {
            BigDecimal share = base;
            if (i == 0 && remainder.compareTo(BigDecimal.ZERO) != 0) {
                share = share.add(remainder);
            }
            splits.put(participants.get(i), share);
        }
        return splits;
    }
}

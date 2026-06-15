package com.you.lld.problems.splitwise.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/** Strategy for computing per-user shares of an expense. */
public interface SplitStrategy {
    Map<String, BigDecimal> compute(BigDecimal total, List<String> participants, Map<String, BigDecimal> details);
}

package com.you.lld.problems.splitwise.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * Calculates expense splits using different strategies.
 * 
 * <p>All calculations ensure:
 * <ul>
 *   <li>No money is lost or gained (sum equals total)</li>
 *   <li>Proper rounding to 2 decimal places</li>
 *   <li>Remainder assigned to first participant</li>
 * </ul>
 */
public final class SplitCalculator {
    
    private static final int SCALE = 2;
    private static final RoundingMode ROUNDING = RoundingMode.HALF_UP;
    
    private SplitCalculator() {} // Utility class
    
    /**
     * Splits amount equally among participants.
     * 
     * <p>Handles rounding by assigning remainder to first participant.
     * Example: $100 split 3 ways = $33.34, $33.33, $33.33
     */
    public static Map<UserId, BigDecimal> calculateEqual(
            BigDecimal total, 
            List<UserId> participants) {
        
        if (participants == null || participants.isEmpty()) {
            throw new IllegalArgumentException("At least one participant required");
        }
        if (total == null || total.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Total must be positive");
        }
        
        Map<UserId, BigDecimal> splits = new LinkedHashMap<>();
        int count = participants.size();
        
        // Calculate base share
        BigDecimal share = total.divide(BigDecimal.valueOf(count), SCALE, ROUNDING);
        
        // Calculate actual sum
        BigDecimal baseSum = share.multiply(BigDecimal.valueOf(count));
        BigDecimal remainder = total.subtract(baseSum);
        
        // Assign shares
        boolean remainderAssigned = false;
        for (UserId userId : participants) {
            if (!remainderAssigned && remainder.compareTo(BigDecimal.ZERO) != 0) {
                splits.put(userId, share.add(remainder));
                remainderAssigned = true;
            } else {
                splits.put(userId, share);
            }
        }
        
        return splits;
    }
    
    /**
     * Splits amount by exact specified amounts.
     * 
     * <p>Validates that splits sum to total.
     */
    public static Map<UserId, BigDecimal> calculateExact(
            BigDecimal total,
            Map<UserId, BigDecimal> exactSplits) {
        
        BigDecimal sum = exactSplits.values().stream()
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (sum.compareTo(total) != 0) {
            throw new IllegalArgumentException(
                "Exact splits (" + sum + ") must equal total (" + total + ")");
        }
        
        return new LinkedHashMap<>(exactSplits);
    }
    
    /**
     * Splits amount by percentages.
     * 
     * <p>Percentages should sum to 100.
     * Example: {A: 50, B: 30, C: 20} for 50%, 30%, 20%
     */
    public static Map<UserId, BigDecimal> calculateByPercentage(
            BigDecimal total,
            Map<UserId, BigDecimal> percentages) {
        
        BigDecimal percentSum = percentages.values().stream()
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (percentSum.compareTo(BigDecimal.valueOf(100)) != 0) {
            throw new IllegalArgumentException(
                "Percentages must sum to 100, got: " + percentSum);
        }
        
        Map<UserId, BigDecimal> splits = new LinkedHashMap<>();
        BigDecimal assigned = BigDecimal.ZERO;
        
        List<UserId> users = new ArrayList<>(percentages.keySet());
        for (int i = 0; i < users.size(); i++) {
            UserId userId = users.get(i);
            BigDecimal percent = percentages.get(userId);
            
            if (i == users.size() - 1) {
                // Last participant gets remainder to avoid rounding errors
                splits.put(userId, total.subtract(assigned));
            } else {
                BigDecimal share = total.multiply(percent)
                    .divide(BigDecimal.valueOf(100), SCALE, ROUNDING);
                splits.put(userId, share);
                assigned = assigned.add(share);
            }
        }
        
        return splits;
    }
    
    /**
     * Splits amount by shares/weights.
     * 
     * <p>Example: {A: 2, B: 1, C: 1} for 50%, 25%, 25%
     */
    public static Map<UserId, BigDecimal> calculateByShares(
            BigDecimal total,
            Map<UserId, Integer> shares) {
        
        int totalShares = shares.values().stream()
            .mapToInt(Integer::intValue)
            .sum();
        
        if (totalShares <= 0) {
            throw new IllegalArgumentException("Total shares must be positive");
        }
        
        // Convert shares to percentages
        Map<UserId, BigDecimal> percentages = new LinkedHashMap<>();
        for (Map.Entry<UserId, Integer> entry : shares.entrySet()) {
            BigDecimal percent = BigDecimal.valueOf(entry.getValue())
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(totalShares), 4, ROUNDING);
            percentages.put(entry.getKey(), percent);
        }
        
        // Use percentage calculation (handles rounding)
        Map<UserId, BigDecimal> splits = new LinkedHashMap<>();
        BigDecimal assigned = BigDecimal.ZERO;
        
        List<UserId> users = new ArrayList<>(shares.keySet());
        for (int i = 0; i < users.size(); i++) {
            UserId userId = users.get(i);
            
            if (i == users.size() - 1) {
                splits.put(userId, total.subtract(assigned));
            } else {
                int share = shares.get(userId);
                BigDecimal amount = total.multiply(BigDecimal.valueOf(share))
                    .divide(BigDecimal.valueOf(totalShares), SCALE, ROUNDING);
                splits.put(userId, amount);
                assigned = assigned.add(amount);
            }
        }
        
        return splits;
    }
    
    /**
     * Validates that splits are correct for the total.
     */
    public static boolean validateSplits(BigDecimal total, Map<UserId, BigDecimal> splits) {
        BigDecimal sum = splits.values().stream()
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        return sum.compareTo(total) == 0;
    }
}

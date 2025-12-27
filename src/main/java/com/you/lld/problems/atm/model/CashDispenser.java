package com.you.lld.problems.atm.model;

import java.math.BigDecimal;
import java.util.*;

public class CashDispenser {
    private final Map<Integer, Integer> denominations;
    
    public CashDispenser() {
        this.denominations = new HashMap<>();
        denominations.put(100, 100);
        denominations.put(50, 100);
        denominations.put(20, 200);
        denominations.put(10, 200);
    }
    
    public synchronized boolean dispenseCash(BigDecimal amount) {
        int amountInt = amount.intValue();
        Map<Integer, Integer> required = new HashMap<>();
        
        List<Integer> denoms = new ArrayList<>(denominations.keySet());
        Collections.sort(denoms, Collections.reverseOrder());
        
        for (int denom : denoms) {
            int count = Math.min(amountInt / denom, denominations.get(denom));
            if (count > 0) {
                required.put(denom, count);
                amountInt -= (count * denom);
            }
        }
        
        if (amountInt > 0) {
            return false;
        }
        
        for (Map.Entry<Integer, Integer> entry : required.entrySet()) {
            denominations.put(entry.getKey(), 
                            denominations.get(entry.getKey()) - entry.getValue());
        }
        
        System.out.println("Dispensed: " + required);
        return true;
    }
    
    public BigDecimal getTotalCash() {
        return denominations.entrySet().stream()
            .map(e -> BigDecimal.valueOf(e.getKey() * e.getValue()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

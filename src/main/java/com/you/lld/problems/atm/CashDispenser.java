package com.you.lld.problems.atm;

import java.util.*;

public class CashDispenser {
    private Map<Integer, Integer> cashInventory; // denomination -> count
    
    public CashDispenser() {
        cashInventory = new HashMap<>();
        cashInventory.put(100, 100);
        cashInventory.put(50, 100);
        cashInventory.put(20, 100);
        cashInventory.put(10, 100);
    }
    
    public boolean canDispense(double amount) {
        return amount > 0 && amount % 10 == 0;
    }
    
    public Map<Integer, Integer> dispenseCash(double amount) {
        Map<Integer, Integer> dispensed = new HashMap<>();
        int remaining = (int) amount;
        
        Integer[] denoms = {100, 50, 20, 10};
        for (int denom : denoms) {
            if (remaining >= denom && cashInventory.get(denom) > 0) {
                int notes = Math.min(remaining / denom, cashInventory.get(denom));
                if (notes > 0) {
                    dispensed.put(denom, notes);
                    cashInventory.put(denom, cashInventory.get(denom) - notes);
                    remaining -= notes * denom;
                }
            }
        }
        
        return remaining == 0 ? dispensed : null;
    }
}

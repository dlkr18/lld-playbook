package com.you.lld.problems.atm.service.impl;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

/**
 * Manages physical cash denominations and dispenses using a greedy algorithm.
 *
 * Greedy: try largest denomination first, use as many as possible, then
 * move to the next. Works correctly when denominations are standard
 * (100, 50, 20, 10). For exotic denominations, you'd need DP — mention
 * verbally if asked.
 */
public final class CashDispenser {

    private final TreeMap<Integer, Integer> stock;

    public CashDispenser(Map<Integer, Integer> initialStock) {
        this.stock = new TreeMap<>(Collections.reverseOrder());
        this.stock.putAll(initialStock);
    }

    /** Default ATM load: 100×50, 50×50, 20×100, 10×100. */
    public static CashDispenser withDefaultStock() {
        Map<Integer, Integer> s = new LinkedHashMap<>();
        s.put(100, 50);
        s.put(50, 50);
        s.put(20, 100);
        s.put(10, 100);
        return new CashDispenser(s);
    }

    /**
     * Try to dispense {@code amount} using available denominations.
     * Returns a denomination→count map on success, or null if not possible.
     * Does NOT modify stock — call {@link #deduct} after confirming the account debit.
     */
    public Map<Integer, Integer> tryDispense(int amount) {
        if (amount <= 0) return null;
        Map<Integer, Integer> plan = new LinkedHashMap<>();
        int remaining = amount;

        for (Map.Entry<Integer, Integer> e : stock.entrySet()) {
            int denom = e.getKey();
            int available = e.getValue();
            int count = Math.min(remaining / denom, available);
            if (count > 0) {
                plan.put(denom, count);
                remaining -= count * denom;
            }
        }
        return remaining == 0 ? plan : null;
    }

    /** Deduct notes after a successful dispense. */
    public void deduct(Map<Integer, Integer> plan) {
        for (Map.Entry<Integer, Integer> e : plan.entrySet()) {
            stock.merge(e.getKey(), -e.getValue(), Integer::sum);
        }
    }

    public int totalCash() {
        return stock.entrySet().stream()
            .mapToInt(e -> e.getKey() * e.getValue())
            .sum();
    }

    @Override
    public String toString() {
        return "CashDispenser{total=$" + totalCash() + ", stock=" + stock + "}";
    }
}

package com.you.lld.problems.restaurant.service.impl;

import com.you.lld.problems.restaurant.model.Table;
import com.you.lld.problems.restaurant.model.TableStatus;
import com.you.lld.problems.restaurant.service.TableAllocationStrategy;

import java.util.Collection;

/**
 * Best-fit: smallest available table that fits the party (minimize wasted seats).
 */
public final class BestFitTableAllocation implements TableAllocationStrategy {

    @Override
    public Table allocate(Collection<Table> tables, int partySize) {
        if (partySize <= 0) {
            throw new IllegalArgumentException("Party size must be positive");
        }
        Table best = null;
        for (Table t : tables) {
            if (t.getStatus() == TableStatus.AVAILABLE && t.getCapacity() >= partySize) {
                if (best == null || t.getCapacity() < best.getCapacity()) {
                    best = t;
                }
            }
        }
        return best;
    }
}

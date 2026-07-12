package com.you.lld.problems.meetingscheduler.service.impl;

import com.you.lld.problems.meetingscheduler.model.RoomSlot;
import com.you.lld.problems.meetingscheduler.service.AllocationStrategy;

import java.util.List;
import java.util.Optional;

/**
 * Best-fit by capacity: among viable candidates pick the room with the SMALLEST
 * capacity (that still fits, which the caller already guaranteed). This preserves
 * big rooms for big meetings — a classic bin-packing-style heuristic.
 *
 * <p>Ties broken by earliest slot start, then room id, for determinism.
 */
public class SmallestSufficientCapacityAllocation implements AllocationStrategy {

    @Override
    public Optional<RoomSlot> select(List<RoomSlot> candidates) {
        RoomSlot best = null;
        for (RoomSlot candidate : candidates) {
            if (best == null || isBetter(candidate, best)) {
                best = candidate;
            }
        }
        return Optional.ofNullable(best);
    }

    private boolean isBetter(RoomSlot a, RoomSlot b) {
        int capCmp = Integer.compare(a.getRoom().getCapacity(), b.getRoom().getCapacity());
        if (capCmp != 0) {
            return capCmp < 0;
        }
        int startCmp = a.getSlot().getStart().compareTo(b.getSlot().getStart());
        if (startCmp != 0) {
            return startCmp < 0;
        }
        return a.getRoom().getId().compareTo(b.getRoom().getId()) < 0;
    }

    @Override
    public String name() {
        return "SmallestSufficientCapacity";
    }
}

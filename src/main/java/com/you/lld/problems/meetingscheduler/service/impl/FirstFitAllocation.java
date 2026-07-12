package com.you.lld.problems.meetingscheduler.service.impl;

import com.you.lld.problems.meetingscheduler.model.RoomSlot;
import com.you.lld.problems.meetingscheduler.service.AllocationStrategy;

import java.util.List;
import java.util.Optional;

/**
 * First-fit: take the first viable candidate. The orchestrator hands candidates
 * in a deterministic order (earliest slot start, then room id), so "first" means
 * "soonest available, stable tie-break". Cheap and predictable.
 */
public class FirstFitAllocation implements AllocationStrategy {

    @Override
    public Optional<RoomSlot> select(List<RoomSlot> candidates) {
        if (candidates.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(candidates.get(0));
    }

    @Override
    public String name() {
        return "FirstFit";
    }
}

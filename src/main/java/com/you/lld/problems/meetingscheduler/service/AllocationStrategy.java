package com.you.lld.problems.meetingscheduler.service;

import com.you.lld.problems.meetingscheduler.model.RoomSlot;

import java.util.List;
import java.util.Optional;

/**
 * Strategy pattern: given the rooms that CAN satisfy a request (already filtered
 * for capacity and availability), decide WHICH one to use. Swapping the policy
 * (first-fit vs best-fit-by-capacity vs cost-based) never touches the
 * orchestrator or the calendar.
 */
public interface AllocationStrategy {

    /**
     * @param candidates non-null list of viable (room, slot) pairs. May be empty.
     * @return the chosen candidate, or empty if {@code candidates} is empty.
     */
    Optional<RoomSlot> select(List<RoomSlot> candidates);

    /** Human-readable name for logging/demo output. */
    String name();
}

package com.you.lld.problems.airlinebooking.service.impl;

import com.you.lld.problems.airlinebooking.model.Seat;
import com.you.lld.problems.airlinebooking.service.SeatAllocationStrategy;

import java.util.List;
import java.util.Optional;

/**
 * Auto-assign strategy that fills the cabin from the front row backwards (the
 * candidate list arrives already sorted front-to-back by the inventory).
 * Deterministic and cache-friendly for airlines that prefer forward seating.
 */
public final class FrontToBackSeatAllocationStrategy implements SeatAllocationStrategy {

    @Override
    public Optional<Seat> pick(List<Seat> availableSeatsInClass) {
        if (availableSeatsInClass == null || availableSeatsInClass.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(availableSeatsInClass.get(0));
    }
}

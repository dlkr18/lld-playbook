package com.you.lld.problems.airlinebooking.service.impl;

import com.you.lld.problems.airlinebooking.model.Seat;
import com.you.lld.problems.airlinebooking.service.SeatAllocationStrategy;

import java.util.List;
import java.util.Optional;

/**
 * Auto-assign strategy that prefers an A-column window seat, falling back to the
 * first available seat when no window remains. Demonstrates that seat-allocation
 * policy is pluggable independently of the booking flow.
 */
public final class WindowPreferredSeatAllocationStrategy implements SeatAllocationStrategy {

    @Override
    public Optional<Seat> pick(List<Seat> availableSeatsInClass) {
        if (availableSeatsInClass == null || availableSeatsInClass.isEmpty()) {
            return Optional.empty();
        }
        for (int i = 0; i < availableSeatsInClass.size(); i++) {
            Seat seat = availableSeatsInClass.get(i);
            if (seat.column() == 'A') {
                return Optional.of(seat);
            }
        }
        return Optional.of(availableSeatsInClass.get(0));
    }
}

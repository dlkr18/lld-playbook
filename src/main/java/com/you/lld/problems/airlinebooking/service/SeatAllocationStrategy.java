package com.you.lld.problems.airlinebooking.service;

import com.you.lld.problems.airlinebooking.model.Seat;

import java.util.List;
import java.util.Optional;

/**
 * Strategy: chooses which seat to auto-assign when a passenger asks for "any
 * seat in class X" rather than naming a specific seat.
 *
 * <p>The candidate list passed in has already been filtered to seats that were
 * available at the time of the snapshot; the strategy only decides preference
 * (window-first, front-first, etc.). The final allocation is still guarded by
 * the per-seat compare-and-set, so a strategy choice that loses a race simply
 * falls through to the next candidate.
 */
public interface SeatAllocationStrategy {

    /**
     * Picks a preferred seat from the candidates, or {@link Optional#empty()} if
     * the list is empty.
     */
    Optional<Seat> pick(List<Seat> availableSeatsInClass);
}

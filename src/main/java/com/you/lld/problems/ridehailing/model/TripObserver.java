package com.you.lld.problems.ridehailing.model;

/**
 * Observer for Trip lifecycle events.
 * Rider and Driver implement this to receive automatic updates
 * when a Trip they're subscribed to changes state.
 */
public interface TripObserver {
    void update(Trip trip);
}

package com.you.lld.problems.parkinglot.event;

/**
 * Listener interface for parking events.
 */
public interface ParkingEventListener {
    
    /**
     * Called when a parking event occurs.
     */
    void onEvent(ParkingEvent event);
    
    /**
     * Check if listener handles this event type.
     */
    default boolean canHandle(ParkingEvent event) {
        return true;
    }
}

package com.you.lld.problems.bookmyshow.event;

/**
 * Listener interface for booking events.
 * Implements Observer pattern for event-driven architecture.
 */
public interface BookingEventListener {
    
    /**
     * Called when a booking event occurs.
     */
    void onEvent(BookingEvent event);
    
    /**
     * Check if listener handles this event type.
     */
    default boolean canHandle(BookingEvent event) {
        return true;
    }
}

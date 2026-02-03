package com.you.lld.problems.bookmyshow.event;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Event publisher for booking events.
 * Implements Publisher-Subscriber pattern.
 */
public class BookingEventPublisher {
    
    private final List<BookingEventListener> listeners = new ArrayList<>();
    private final ExecutorService executorService;
    private final boolean asyncMode;
    
    public BookingEventPublisher(boolean asyncMode) {
        this.asyncMode = asyncMode;
        this.executorService = asyncMode ? 
            Executors.newFixedThreadPool(4) : null;
    }
    
    /**
     * Register a listener.
     */
    public void addListener(BookingEventListener listener) {
        listeners.add(listener);
    }
    
    /**
     * Unregister a listener.
     */
    public void removeListener(BookingEventListener listener) {
        listeners.remove(listener);
    }
    
    /**
     * Publish an event to all listeners.
     */
    public void publish(BookingEvent event) {
        for (BookingEventListener listener : listeners) {
            if (listener.canHandle(event)) {
                if (asyncMode) {
                    executorService.submit(() -> notifyListener(listener, event));
                } else {
                    notifyListener(listener, event);
                }
            }
        }
    }
    
    /**
     * Notify a single listener (with error handling).
     */
    private void notifyListener(BookingEventListener listener, BookingEvent event) {
        try {
            listener.onEvent(event);
        } catch (Exception e) {
            System.err.println("Error notifying listener: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Shutdown publisher.
     */
    public void shutdown() {
        if (executorService != null) {
            executorService.shutdown();
        }
    }
}

package com.you.lld.problems.parkinglot.event;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Event publisher for parking events.
 */
public class ParkingEventPublisher {
    
    private final List<ParkingEventListener> listeners = new ArrayList<>();
    private final ExecutorService executorService;
    private final boolean asyncMode;
    
    public ParkingEventPublisher(boolean asyncMode) {
        this.asyncMode = asyncMode;
        this.executorService = asyncMode ? 
            Executors.newFixedThreadPool(4) : null;
    }
    
    /**
     * Register a listener.
     */
    public void addListener(ParkingEventListener listener) {
        listeners.add(listener);
    }
    
    /**
     * Unregister a listener.
     */
    public void removeListener(ParkingEventListener listener) {
        listeners.remove(listener);
    }
    
    /**
     * Publish an event to all listeners.
     */
    public void publish(ParkingEvent event) {
        for (ParkingEventListener listener : listeners) {
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
    private void notifyListener(ParkingEventListener listener, ParkingEvent event) {
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

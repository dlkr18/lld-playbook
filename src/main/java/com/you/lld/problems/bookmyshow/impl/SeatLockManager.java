package com.you.lld.problems.bookmyshow.impl;

import java.util.*;
import java.util.concurrent.*;

/**
 * Seat Lock Manager with fine-grained per-seat locking for high throughput.
 * Uses seat-level locks instead of show-level locks to allow concurrent bookings.
 * 
 * Key Design Decisions:
 * - Per-seat locking (showId:seatId) NOT per-show locking
 * - Sorted locking to prevent deadlocks
 * - Atomic putIfAbsent operations
 * - Automatic rollback on failures
 * - 5-minute lock timeouts
 */
public class SeatLockManager {
    // Key: "showId:seatId" -> LockInfo
    private final ConcurrentHashMap<String, LockInfo> seatLocks = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);
    private static final long LOCK_TIMEOUT_MS = 300000; // 5 minutes
    
    private static class LockInfo {
        final String userId;
        final long expiryTime;
        final ScheduledFuture<?> unlockTask;
        
        LockInfo(String userId, long expiryTime, ScheduledFuture<?> task) {
            this.userId = userId;
            this.expiryTime = expiryTime;
            this.unlockTask = task;
        }
    }
    
    /**
     * Locks multiple seats atomically. Uses sorted locking to prevent deadlock.
     * @return true if all seats were locked successfully, false otherwise
     */
    public boolean lockSeats(String showId, List<String> seatIds, String userId) {
        if (seatIds == null || seatIds.isEmpty()) {
            return false;
        }
        
        // Sort seat IDs to prevent deadlock (always acquire locks in same order)
        List<String> sortedSeatIds = new ArrayList<>(seatIds);
        Collections.sort(sortedSeatIds);
        
        // Generate keys
        List<String> seatKeys = new ArrayList<>();
        for (String seatId : sortedSeatIds) {
            seatKeys.add(getSeatKey(showId, seatId));
        }
        
        // Phase 1: Check all seats are available
        long now = System.currentTimeMillis();
        List<String> unavailableSeats = new ArrayList<>();
        
        for (String seatKey : seatKeys) {
            LockInfo existing = seatLocks.get(seatKey);
            
            if (existing != null) {
                // Check if expired
                if (existing.expiryTime > now) {
                    unavailableSeats.add(seatKey);
                } else {
                    // Clean up expired lock
                    existing.unlockTask.cancel(false);
                    seatLocks.remove(seatKey);
                }
            }
        }
        
        if (!unavailableSeats.isEmpty()) {
            System.out.println("Seats unavailable: " + unavailableSeats);
            return false;
        }
        
        // Phase 2: Lock all seats atomically
        long expiryTime = now + LOCK_TIMEOUT_MS;
        List<LockInfo> createdLocks = new ArrayList<>();
        
        try {
            for (int i = 0; i < seatKeys.size(); i++) {
                String seatKey = seatKeys.get(i);
                String seatId = sortedSeatIds.get(i);
                
                ScheduledFuture<?> task = scheduler.schedule(
                    () -> unlockSeat(showId, seatId, userId),
                    LOCK_TIMEOUT_MS,
                    TimeUnit.MILLISECONDS
                );
                
                LockInfo lockInfo = new LockInfo(userId, expiryTime, task);
                
                // Use putIfAbsent for atomicity
                LockInfo previous = seatLocks.putIfAbsent(seatKey, lockInfo);
                
                if (previous != null) {
                    // Race condition - someone locked it between check and lock
                    task.cancel(false);
                    throw new IllegalStateException("Seat locked by another user: " + seatKey);
                }
                
                createdLocks.add(lockInfo);
            }
            
            System.out.println("✅ Locked " + seatIds.size() + " seats for user " + userId);
            return true;
            
        } catch (Exception e) {
            // Rollback: unlock all seats we've locked so far
            System.out.println("❌ Failed to lock seats, rolling back: " + e.getMessage());
            for (int i = 0; i < createdLocks.size(); i++) {
                String seatKey = seatKeys.get(i);
                LockInfo lockInfo = createdLocks.get(i);
                lockInfo.unlockTask.cancel(false);
                seatLocks.remove(seatKey, lockInfo); // Atomic remove only if same object
            }
            return false;
        }
    }
    
    public void unlockSeats(String showId, List<String> seatIds, String userId) {
        for (String seatId : seatIds) {
            unlockSeat(showId, seatId, userId);
        }
    }
    
    private void unlockSeat(String showId, String seatId, String userId) {
        String seatKey = getSeatKey(showId, seatId);
        LockInfo lockInfo = seatLocks.get(seatKey);
        
        if (lockInfo != null && lockInfo.userId.equals(userId)) {
            lockInfo.unlockTask.cancel(false);
            seatLocks.remove(seatKey, lockInfo);
            System.out.println("🔓 Unlocked seat: " + seatId + " for user " + userId);
        }
    }
    
    public boolean isLocked(String showId, String seatId) {
        String seatKey = getSeatKey(showId, seatId);
        LockInfo lockInfo = seatLocks.get(seatKey);
        
        if (lockInfo == null) {
            return false;
        }
        
        // Check if expired
        if (lockInfo.expiryTime <= System.currentTimeMillis()) {
            unlockSeat(showId, seatId, lockInfo.userId);
            return false;
        }
        
        return true;
    }
    
    private String getSeatKey(String showId, String seatId) {
        return showId + ":" + seatId;
    }
    
    public void shutdown() {
        System.out.println("Shutting down SeatLockManager...");
        scheduler.shutdown();
        try {
            if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}

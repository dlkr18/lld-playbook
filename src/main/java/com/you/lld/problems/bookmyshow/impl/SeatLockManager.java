package com.you.lld.problems.bookmyshow.impl;

import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Fine-grained per-seat locking with automatic expiry.
 *
 * Concurrency approach:
 *   - ConcurrentHashMap for lock storage (no global lock)
 *   - putIfAbsent for atomic lock acquisition (avoids TOCTOU)
 *   - Sorted seat IDs to prevent deadlock when locking multiple seats
 *   - ScheduledExecutorService for auto-expiry after timeout
 *   - Rollback on partial failure (all-or-nothing semantics)
 */
public class SeatLockManager {

    private final ConcurrentHashMap<String, LockInfo> seatLocks = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    private static final long LOCK_TIMEOUT_MS = 300_000; // 5 minutes

    static class LockInfo {
        final String userId;
        final long expiryTime;
        final ScheduledFuture<?> unlockTask;

        LockInfo(String userId, long expiryTime, ScheduledFuture<?> task) {
            this.userId = userId;
            this.expiryTime = expiryTime;
            this.unlockTask = task;
        }

        boolean isExpired() {
            return System.currentTimeMillis() >= expiryTime;
        }
    }

    /**
     * Atomically lock multiple seats for a user.
     * Uses putIfAbsent per seat (no separate check-then-act),
     * and rolls back all acquired locks on partial failure.
     */
    public boolean lockSeats(String showId, List<String> seatIds, String userId) {
        if (seatIds == null || seatIds.isEmpty()) return false;

        List<String> sorted = new ArrayList<>(seatIds);
        Collections.sort(sorted);

        long expiry = System.currentTimeMillis() + LOCK_TIMEOUT_MS;
        List<String> acquiredKeys = new ArrayList<>();

        try {
            for (String seatId : sorted) {
                String key = seatKey(showId, seatId);

                cleanExpiredLock(key);

                // The timer must expire *this* lock only, so it gets the LockInfo
                // once that exists (it can't before: LockInfo holds the timer).
                final AtomicReference<LockInfo> self = new AtomicReference<>();
                ScheduledFuture<?> task = scheduler.schedule(
                    () -> forceUnlock(showId, seatId, self.get()),
                    LOCK_TIMEOUT_MS, TimeUnit.MILLISECONDS
                );

                LockInfo lock = new LockInfo(userId, expiry, task);
                self.set(lock);
                LockInfo existing = seatLocks.putIfAbsent(key, lock);

                if (existing != null) {
                    task.cancel(false);
                    throw new IllegalStateException("Seat " + seatId + " is locked by another user");
                }
                acquiredKeys.add(key);
            }
            return true;

        } catch (Exception e) {
            for (String key : acquiredKeys) {
                LockInfo lock = seatLocks.get(key);
                if (lock != null && lock.userId.equals(userId)) {
                    lock.unlockTask.cancel(false);
                    seatLocks.remove(key, lock);
                }
            }
            return false;
        }
    }

    public void unlockSeats(String showId, List<String> seatIds, String userId) {
        for (String seatId : seatIds) {
            String key = seatKey(showId, seatId);
            LockInfo lock = seatLocks.get(key);
            if (lock != null && lock.userId.equals(userId)) {
                lock.unlockTask.cancel(false);
                seatLocks.remove(key, lock);
            }
        }
    }

    public boolean isLocked(String showId, String seatId) {
        String key = seatKey(showId, seatId);
        LockInfo lock = seatLocks.get(key);
        if (lock == null) return false;
        if (lock.isExpired()) {
            cleanExpiredLock(key);
            return false;
        }
        return true;
    }

    /**
     * Returns true only if the seat is locked AND owned by the given user.
     * The service uses this to verify the caller locked the seat before creating a booking.
     */
    public boolean isLockedByUser(String showId, String seatId, String userId) {
        String key = seatKey(showId, seatId);
        LockInfo lock = seatLocks.get(key);
        if (lock == null) return false;
        if (lock.isExpired()) {
            cleanExpiredLock(key);
            return false;
        }
        return lock.userId.equals(userId);
    }

    public void shutdown() {
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

    // ────────────────────── internals ──────────────────────

    private String seatKey(String showId, String seatId) {
        return showId + ":" + seatId;
    }

    private void cleanExpiredLock(String key) {
        LockInfo lock = seatLocks.get(key);
        if (lock != null && lock.isExpired()) {
            lock.unlockTask.cancel(false);
            seatLocks.remove(key, lock);
        }
    }

    /** Package-private for tests: the current lock on a seat, or null. */
    LockInfo currentLock(String showId, String seatId) {
        return seatLocks.get(seatKey(showId, seatId));
    }

    /**
     * Expiry timer callback. Removes the seat lock only if it is still the
     * lock this timer was created for: remove(key, expected), not remove(key).
     * A timer that fires late must not delete a newer lock another user took.
     */
    void forceUnlock(String showId, String seatId, LockInfo expected) {
        if (expected == null) return;
        if (seatLocks.remove(seatKey(showId, seatId), expected)) {
            System.out.println("[SeatLockManager] Lock expired for " + seatId + " (user " + expected.userId + ")");
        }
    }
}

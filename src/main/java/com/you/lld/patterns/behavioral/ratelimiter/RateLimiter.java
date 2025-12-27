package com.you.lld.patterns.behavioral.ratelimiter;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * Rate limiter interface for controlling request throughput.
 *
 * <p>Implementations include:
 * <ul>
 *   <li>Token Bucket - Allows burst up to capacity</li>
 *   <li>Leaky Bucket - Constant output rate</li>
 *   <li>Sliding Window - Accurate time-based limiting</li>
 * </ul>
 */
public interface RateLimiter {

    /**
     * Attempts to acquire a single permit.
     *
     * @return true if permit acquired, false otherwise
     */
    boolean tryAcquire();

    /**
     * Attempts to acquire multiple permits.
     *
     * @param permits Number of permits to acquire
     * @return true if all permits acquired, false otherwise
     */
    boolean tryAcquire(int permits);

    /**
     * Acquires a permit, blocking until available.
     *
     * @throws InterruptedException if interrupted while waiting
     */
    void acquire() throws InterruptedException;

    /**
     * Attempts to acquire a permit within the given timeout.
     *
     * @param timeout Maximum time to wait
     * @param unit    Time unit
     * @return true if permit acquired within timeout
     * @throws InterruptedException if interrupted while waiting
     */
    boolean tryAcquire(long timeout, TimeUnit unit) throws InterruptedException;

    /**
     * Returns current rate limit info.
     */
    RateLimitInfo getInfo();

    /**
     * Information about current rate limit state.
     */
    class RateLimitInfo {
        private final int remaining;
        private final int limit;
        private final long resetTimeMillis;

        public RateLimitInfo(int remaining, int limit, long resetTimeMillis) {
            this.remaining = remaining;
            this.limit = limit;
            this.resetTimeMillis = resetTimeMillis;
        }

        public int getRemaining() {
            return remaining;
        }

        public int getLimit() {
            return limit;
        }

        public long getResetTimeMillis() {
            return resetTimeMillis;
        }

        public Duration getTimeUntilReset() {
            long now = System.currentTimeMillis();
            return Duration.ofMillis(Math.max(0, resetTimeMillis - now));
        }
    }
}

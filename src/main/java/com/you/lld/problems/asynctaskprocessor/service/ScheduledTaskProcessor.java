package com.you.lld.problems.asynctaskprocessor.service;

import java.time.Instant;

/**
 * PART 2 — extends the async processor with scheduling. Same worker pool executes;
 * a scheduler decides WHEN. Three ways to schedule:
 *   - after a delay        (run once, later)
 *   - at a specific time   (run once, at an instant)
 *   - at a fixed rate      (run repeatedly, every period)
 */
public interface ScheduledTaskProcessor extends TaskProcessor {

    /** Run once, {@code delayMillis} from now. */
    TaskHandle<Void> scheduleAfter(String name, Runnable task, long delayMillis);

    /** Run once, at the given wall-clock instant. */
    TaskHandle<Void> scheduleAt(String name, Runnable task, Instant when);

    /**
     * Run repeatedly: first at {@code initialDelayMillis}, then every {@code periodMillis}
     * measured from each scheduled start (fixed-rate, not fixed-delay). Cancel via the handle.
     */
    TaskHandle<Void> scheduleAtFixedRate(String name, Runnable task, long initialDelayMillis, long periodMillis);
}

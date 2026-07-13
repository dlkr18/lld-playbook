package com.you.lld.problems.asynctaskprocessor;

import com.you.lld.problems.asynctaskprocessor.service.ScheduledTaskProcessor;
import com.you.lld.problems.asynctaskprocessor.service.TaskHandle;
import com.you.lld.problems.asynctaskprocessor.service.impl.ScheduledTaskEntry;
import com.you.lld.problems.asynctaskprocessor.service.impl.WorkerPoolTaskProcessor;

import java.time.Instant;
import java.util.concurrent.DelayQueue;

/**
 * The full processor — the class an interviewer reads first.
 *
 * It literally IS "async processor, EXTENDED to schedule": it {@code extends} the
 * {@link WorkerPoolTaskProcessor} (Part 1 — the worker pool + submit) and adds Part 2 —
 * a single scheduler thread over a {@link DelayQueue}.
 *
 * Division of labour (the key design point): the scheduler thread only DECIDES WHEN and
 * DISPATCHES; it never runs task bodies. When an entry comes due it hands the work to
 * the inherited worker pool via {@code execute(...)}. So one slow task can never delay
 * the firing of the next scheduled task.
 */
public final class AsyncTaskProcessor extends WorkerPoolTaskProcessor implements ScheduledTaskProcessor {

    private final DelayQueue<ScheduledTaskEntry> schedule = new DelayQueue<ScheduledTaskEntry>();
    private final Thread schedulerThread;
    private volatile boolean schedulerRunning = true;

    public AsyncTaskProcessor(int poolSize) {
        super(poolSize);
        schedulerThread = new Thread(new SchedulerLoop(), "atp-scheduler");
        schedulerThread.start();
    }

    private final class SchedulerLoop implements Runnable {
        public void run() {
            while (schedulerRunning) {
                ScheduledTaskEntry entry;
                try {
                    entry = schedule.take();          // blocks until the earliest task is DUE
                } catch (InterruptedException e) {
                    break;                            // shutdown interrupted us
                }
                if (entry.isCancelled()) continue;
                try {
                    execute(entry::runOnce);          // dispatch to the worker pool
                } catch (IllegalStateException shuttingDown) {
                    break;
                }
                if (entry.isPeriodic() && !entry.isCancelled()) {
                    entry.reschedule();               // next fire = scheduledTime + period
                    schedule.put(entry);
                }
            }
        }
    }

    @Override
    public TaskHandle<Void> scheduleAfter(String name, Runnable task, long delayMillis) {
        ScheduledTaskEntry entry = new ScheduledTaskEntry(
            nextId(name), task, 0, System.currentTimeMillis() + Math.max(0, delayMillis));
        schedule.put(entry);
        return entry;
    }

    @Override
    public TaskHandle<Void> scheduleAt(String name, Runnable task, Instant when) {
        return scheduleAfter(name, task, when.toEpochMilli() - System.currentTimeMillis());
    }

    @Override
    public TaskHandle<Void> scheduleAtFixedRate(String name, Runnable task,
                                                long initialDelayMillis, long periodMillis) {
        if (periodMillis <= 0) throw new IllegalArgumentException("period must be positive");
        ScheduledTaskEntry entry = new ScheduledTaskEntry(
            nextId(name), task, periodMillis, System.currentTimeMillis() + Math.max(0, initialDelayMillis));
        schedule.put(entry);
        return entry;
    }

    /** Stop the scheduler first, then drain + stop the workers (order matters). */
    @Override
    public void shutdown() {
        schedulerRunning = false;
        schedulerThread.interrupt();
        try { schedulerThread.join(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        super.shutdown();
    }
}

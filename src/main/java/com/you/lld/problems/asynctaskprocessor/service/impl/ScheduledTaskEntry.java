package com.you.lld.problems.asynctaskprocessor.service.impl;

import com.you.lld.problems.asynctaskprocessor.model.TaskExecutionException;
import com.you.lld.problems.asynctaskprocessor.model.TaskStatus;
import com.you.lld.problems.asynctaskprocessor.service.TaskHandle;

import java.util.concurrent.CancellationException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * A scheduled unit of work. It plays two roles at once:
 *  - {@link Delayed}: so a {@code DelayQueue} orders entries by next-run-time and
 *    {@code take()} blocks until the earliest one is actually due (O(log n), no polling).
 *  - {@link TaskHandle}: so the caller can cancel it / await a one-shot's completion.
 *
 * period == 0 means one-shot; period > 0 means fixed-rate (next fire = scheduled time +
 * period, so cadence doesn't drift with how long a run takes).
 */
public final class ScheduledTaskEntry implements Delayed, TaskHandle<Void> {

    private final String taskId;
    private final Runnable task;
    private final long periodMillis;          // 0 => one-shot
    private volatile long nextRunMillis;
    private volatile TaskStatus status = TaskStatus.PENDING;
    private volatile Throwable lastError;
    private volatile boolean cancelled;
    private final CountDownLatch done = new CountDownLatch(1);   // for one-shot get()

    public ScheduledTaskEntry(String taskId, Runnable task, long periodMillis, long firstRunMillis) {
        this.taskId = taskId;
        this.task = task;
        this.periodMillis = periodMillis;
        this.nextRunMillis = firstRunMillis;
    }

    public boolean isPeriodic() { return periodMillis > 0; }
    public boolean isCancelled() { return cancelled; }
    public void reschedule() { nextRunMillis += periodMillis; }   // fixed-rate

    // ── Delayed ──────────────────────────────────────────────────────────────
    @Override
    public long getDelay(TimeUnit unit) {
        return unit.convert(nextRunMillis - System.currentTimeMillis(), TimeUnit.MILLISECONDS);
    }
    @Override
    public int compareTo(Delayed other) {
        return Long.compare(this.nextRunMillis, ((ScheduledTaskEntry) other).nextRunMillis);
    }

    /** Runs on a WORKER thread (dispatched by the scheduler). */
    public void runOnce() {
        if (cancelled) return;
        if (isPeriodic()) {
            status = TaskStatus.RUNNING;
            try { task.run(); }
            catch (Throwable t) { lastError = t; }
            status = cancelled ? TaskStatus.CANCELLED : TaskStatus.PENDING;   // waiting for next tick
        } else {
            synchronized (this) {
                if (cancelled) return;
                status = TaskStatus.RUNNING;
            }
            try { task.run(); status = TaskStatus.COMPLETED; }
            catch (Throwable t) { lastError = t; status = TaskStatus.FAILED; }
            finally { done.countDown(); }
        }
    }

    // ── TaskHandle ───────────────────────────────────────────────────────────
    @Override public String taskId() { return taskId; }
    @Override public TaskStatus status() { return status; }
    @Override public boolean isDone() { return isPeriodic() ? cancelled : done.getCount() == 0; }

    @Override
    public synchronized boolean cancel() {
        if (isPeriodic()) {                       // stop all future runs, anytime
            cancelled = true;
            if (status == TaskStatus.PENDING) status = TaskStatus.CANCELLED;
            return true;
        }
        if (status == TaskStatus.PENDING) {       // one-shot: only before it starts
            cancelled = true;
            status = TaskStatus.CANCELLED;
            done.countDown();
            return true;
        }
        return false;
    }

    @Override
    public Void get() throws InterruptedException {
        if (isPeriodic()) throw new UnsupportedOperationException("periodic task has no single result; use status()/cancel()");
        done.await();
        return throwIfBad();
    }

    @Override
    public Void get(long timeout, TimeUnit unit) throws InterruptedException, TimeoutException {
        if (isPeriodic()) throw new UnsupportedOperationException("periodic task has no single result; use status()/cancel()");
        if (!done.await(timeout, unit)) throw new TimeoutException("task '" + taskId + "' not done in time");
        return throwIfBad();
    }

    private Void throwIfBad() {
        if (status == TaskStatus.CANCELLED) throw new CancellationException("task '" + taskId + "' was cancelled");
        if (status == TaskStatus.FAILED) throw new TaskExecutionException(taskId, lastError);
        return null;
    }
}

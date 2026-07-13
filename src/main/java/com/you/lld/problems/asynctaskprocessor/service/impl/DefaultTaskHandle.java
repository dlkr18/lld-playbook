package com.you.lld.problems.asynctaskprocessor.service.impl;

import com.you.lld.problems.asynctaskprocessor.model.TaskExecutionException;
import com.you.lld.problems.asynctaskprocessor.model.TaskStatus;
import com.you.lld.problems.asynctaskprocessor.service.TaskHandle;

import java.util.concurrent.CancellationException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * The promise behind an async task. A {@link CountDownLatch} is the whole trick:
 * get() awaits it; the worker counts it down exactly once when it completes/fails/is
 * cancelled. State transitions are synchronized so exactly one terminal outcome wins
 * (a cancel racing a start can't both "win"): result fields are only published under
 * the lock, and readers see them via the latch's happens-before.
 */
final class DefaultTaskHandle<T> implements TaskHandle<T> {

    private final String taskId;
    private final CountDownLatch done = new CountDownLatch(1);
    private volatile TaskStatus status = TaskStatus.PENDING;
    private T result;
    private Throwable error;

    DefaultTaskHandle(String taskId) { this.taskId = taskId; }

    /** Worker calls this before running. Returns false if the task was cancelled first. */
    synchronized boolean start() {
        if (status == TaskStatus.CANCELLED) return false;
        status = TaskStatus.RUNNING;
        return true;
    }

    synchronized void complete(T value) {
        if (status != TaskStatus.RUNNING) return;   // ignore if already terminal
        this.result = value;
        this.status = TaskStatus.COMPLETED;
        done.countDown();
    }

    synchronized void fail(Throwable t) {
        if (status != TaskStatus.RUNNING) return;
        this.error = t;
        this.status = TaskStatus.FAILED;
        done.countDown();
    }

    @Override
    public synchronized boolean cancel() {
        if (status == TaskStatus.PENDING) {
            status = TaskStatus.CANCELLED;
            done.countDown();
            return true;
        }
        return false;   // already running / finished — too late
    }

    @Override public String taskId() { return taskId; }
    @Override public TaskStatus status() { return status; }
    @Override public boolean isDone() { return done.getCount() == 0; }

    @Override
    public T get() throws InterruptedException {
        done.await();
        return resultOrThrow();
    }

    @Override
    public T get(long timeout, TimeUnit unit) throws InterruptedException, TimeoutException {
        if (!done.await(timeout, unit)) {
            throw new TimeoutException("task '" + taskId + "' not done within " + timeout + " " + unit);
        }
        return resultOrThrow();
    }

    private T resultOrThrow() {
        if (status == TaskStatus.CANCELLED) throw new CancellationException("task '" + taskId + "' was cancelled");
        if (status == TaskStatus.FAILED) throw new TaskExecutionException(taskId, error);
        return result;
    }
}

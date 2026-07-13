package com.you.lld.problems.asynctaskprocessor.service;

import com.you.lld.problems.asynctaskprocessor.model.TaskStatus;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * The async result handle (a Future/promise). Returned immediately from submit/schedule
 * so the caller never blocks on the calling thread; they later {@link #get()} the result,
 * poll {@link #status()}, or {@link #cancel()}.
 *
 * @param <T> the task's result type (Void for scheduled Runnables)
 */
public interface TaskHandle<T> {

    String taskId();

    TaskStatus status();

    boolean isDone();

    /** Best-effort: succeeds only if the task hasn't started yet. Returns true if cancelled. */
    boolean cancel();

    /** Block until the task finishes; throws TaskExecutionException on failure, CancellationException if cancelled. */
    T get() throws InterruptedException;

    /** Block up to the timeout; throws TimeoutException if not finished in time. */
    T get(long timeout, TimeUnit unit) throws InterruptedException, TimeoutException;
}

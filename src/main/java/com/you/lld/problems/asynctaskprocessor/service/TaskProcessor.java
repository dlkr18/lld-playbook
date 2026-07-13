package com.you.lld.problems.asynctaskprocessor.service;

import java.util.concurrent.Callable;

/**
 * PART 1 — the async task processor. Submit work; it runs on a worker pool off the
 * calling thread; you get a {@link TaskHandle} back immediately.
 */
public interface TaskProcessor {

    /** Submit work that returns a value. Non-blocking; the handle resolves later. */
    <T> TaskHandle<T> submit(String name, Callable<T> task);

    /** Submit fire-and-forget work (no result to await). */
    TaskHandle<Void> submit(String name, Runnable task);

    /** Stop accepting new work, drain what's queued, then stop the workers. */
    void shutdown();
}

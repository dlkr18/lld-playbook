package com.you.lld.problems.asynctaskprocessor.service.impl;

import com.you.lld.problems.asynctaskprocessor.service.TaskHandle;
import com.you.lld.problems.asynctaskprocessor.service.TaskProcessor;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Callable;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.atomic.AtomicLong;

/**
 * PART 1 — the async engine. A fixed pool of worker threads pulls {@link Runnable}
 * "boxes" off a shared {@link BlockingQueue} and runs them. This is the classic
 * producer/consumer thread pool — essentially a hand-rolled ExecutorService.
 *
 * Concurrency, stated explicitly:
 *  - The queue is the ONLY shared mutable state; LinkedBlockingQueue is thread-safe,
 *    so submit() (producers) and workers (consumers) need no extra locking.
 *  - Each result is published through its own DefaultTaskHandle's latch.
 *  - Shutdown is graceful: stop accepting, enqueue one POISON pill per worker so each
 *    exits AFTER draining the real work ahead of it, then join. No thread is interrupted
 *    mid-task, so no half-done work.
 */
public class WorkerPoolTaskProcessor implements TaskProcessor {

    /** Sentinel that tells a worker to stop once it reaches it. */
    private static final Runnable POISON = new Runnable() { public void run() {} };

    private final BlockingQueue<Runnable> queue = new LinkedBlockingQueue<Runnable>();
    private final List<Thread> workers = new ArrayList<Thread>();
    private final AtomicLong seq = new AtomicLong();
    private volatile boolean accepting = true;

    public WorkerPoolTaskProcessor(int poolSize) {
        if (poolSize < 1) throw new IllegalArgumentException("poolSize must be >= 1");
        for (int i = 0; i < poolSize; i++) {
            Thread w = new Thread(new Worker(), "atp-worker-" + i);
            workers.add(w);
            w.start();
        }
    }

    private final class Worker implements Runnable {
        public void run() {
            try {
                while (true) {
                    Runnable r = queue.take();          // blocks until work arrives
                    if (r == POISON) return;            // graceful stop after draining
                    try { r.run(); } catch (Throwable ignored) { /* box records its own failure */ }
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    @Override
    public <T> TaskHandle<T> submit(String name, Callable<T> task) {
        ensureAccepting();
        DefaultTaskHandle<T> handle = new DefaultTaskHandle<T>(nextId(name));
        queue.add(box(task, handle));
        return handle;
    }

    @Override
    public TaskHandle<Void> submit(String name, final Runnable task) {
        return submit(name, new Callable<Void>() {
            public Void call() { task.run(); return null; }
        });
    }

    // ── hooks used by the scheduling subclass (same package) ─────────────────────

    /** Enqueue a pre-built box onto the pool (used by the scheduler subclass to dispatch due tasks). */
    protected void execute(Runnable box) {
        ensureAccepting();
        queue.add(box);
    }

    /** Wrap a Callable + handle into a self-completing box. */
    static <T> Runnable box(final Callable<T> task, final DefaultTaskHandle<T> handle) {
        return new Runnable() {
            public void run() {
                if (!handle.start()) return;            // was cancelled before we started
                try { handle.complete(task.call()); }
                catch (Throwable t) { handle.fail(t); }
            }
        };
    }

    protected String nextId(String name) { return name + "#" + seq.incrementAndGet(); }

    boolean accepting() { return accepting; }

    private void ensureAccepting() {
        if (!accepting) throw new IllegalStateException("processor is shut down");
    }

    @Override
    public void shutdown() {
        accepting = false;
        for (int i = 0; i < workers.size(); i++) queue.add(POISON);
        for (Thread w : workers) {
            try { w.join(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        }
    }
}

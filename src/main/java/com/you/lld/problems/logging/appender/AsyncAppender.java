package com.you.lld.problems.logging.appender;

import com.you.lld.problems.logging.filter.LogFilter;
import com.you.lld.problems.logging.model.LogEvent;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * Decorator that offloads appending to a background worker thread.
 *
 * Pattern: Decorator -- wraps any LogAppender and inherits its format/filters.
 *
 * Producer (logging thread) -- event -> bounded queue -> non-blocking offer
 * Consumer (worker thread)  -- drain queue -> delegate.append(event)
 *
 * On close():
 *   1. Signal the worker to stop after draining.
 *   2. Wait up to 5s for the queue to drain.
 *   3. Close the wrapped appender.
 *
 * If the queue is full (slow consumer, bounded capacity) we drop the event
 * and print a warning -- prevents the app from blocking on logging.
 */
public class AsyncAppender implements LogAppender {

    private static final int DEFAULT_CAPACITY = 1024;
    private static final LogEvent POISON = null; // we use a flag instead

    private final LogAppender delegate;
    private final BlockingQueue<LogEvent> queue;
    private final Thread worker;
    private volatile boolean running = true;

    public AsyncAppender(LogAppender delegate) {
        this(delegate, DEFAULT_CAPACITY);
    }

    public AsyncAppender(LogAppender delegate, int capacity) {
        if (delegate == null) throw new IllegalArgumentException("delegate required");
        this.delegate = delegate;
        this.queue = new LinkedBlockingQueue<>(capacity);
        this.worker = new Thread(this::drain, "async-appender-" + delegate.getName());
        this.worker.setDaemon(true);
        this.worker.start();
    }

    @Override
    public void append(LogEvent event) {
        if (!running) return;
        if (!queue.offer(event)) {
            System.err.println("[AsyncAppender] queue full, dropping event for " + delegate.getName());
        }
    }

    @Override
    public void addFilter(LogFilter filter) {
        delegate.addFilter(filter);
    }

    private void drain() {
        while (running || !queue.isEmpty()) {
            try {
                LogEvent event = queue.poll(100, TimeUnit.MILLISECONDS);
                if (event != null) delegate.append(event);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                System.err.println("[AsyncAppender] delegate failed: " + e.getMessage());
            }
        }
    }

    @Override
    public void close() {
        running = false;
        try {
            worker.join(5000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        delegate.close();
    }

    @Override
    public String getName() {
        return "async:" + delegate.getName();
    }
}

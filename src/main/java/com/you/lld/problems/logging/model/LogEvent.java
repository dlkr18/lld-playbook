package com.you.lld.problems.logging.model;

import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Immutable log event.
 *
 * Captures everything an appender/formatter needs:
 *   - level, message, logger name
 *   - timestamp + thread name (captured at emit time)
 *   - optional Throwable (exception logging)
 *   - MDC snapshot (ThreadLocal diagnostic context copied at emit time so
 *     async appenders see the caller's context, not the worker thread's)
 */
public final class LogEvent {

    private final LogLevel level;
    private final String message;
    private final String loggerName;
    private final Instant timestamp;
    private final String threadName;
    private final Throwable throwable;
    private final Map<String, String> context;

    public LogEvent(LogLevel level, String message, String loggerName, Throwable throwable,
                    Map<String, String> context) {
        this.level = level;
        this.message = message;
        this.loggerName = loggerName;
        this.timestamp = Instant.now();
        this.threadName = Thread.currentThread().getName();
        this.throwable = throwable;
        this.context = context == null || context.isEmpty()
            ? Collections.emptyMap()
            : Collections.unmodifiableMap(new HashMap<>(context));
    }

    public LogLevel getLevel()              { return level; }
    public String getMessage()              { return message; }
    public String getLoggerName()           { return loggerName; }
    public Instant getTimestamp()           { return timestamp; }
    public String getThreadName()           { return threadName; }
    public Throwable getThrowable()         { return throwable; }
    public Map<String, String> getContext() { return context; }
}

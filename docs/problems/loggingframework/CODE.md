# loggingframework - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/logging/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py loggingframework`.

## Project Structure (18 files)

```
logging/
├── LoggingDemo.java
├── api/Logger.java
├── api/LoggerFactory.java
├── model/LogEvent.java
├── model/LogLevel.java
├── model/MDC.java
├── appender/AbstractAppender.java
├── appender/AsyncAppender.java
├── appender/ConsoleAppender.java
├── appender/FileAppender.java
├── appender/LogAppender.java
├── filter/KeywordFilter.java
├── filter/LevelFilter.java
├── filter/LogFilter.java
├── formatter/JsonFormatter.java
├── formatter/LogFormatter.java
├── formatter/SimpleFormatter.java
├── impl/LoggerImpl.java
```

## Source Code

### `LoggingDemo.java`

<details>
<summary>Click to view LoggingDemo.java</summary>

```java
package com.you.lld.problems.logging;

import com.you.lld.problems.logging.api.Logger;
import com.you.lld.problems.logging.api.LoggerFactory;
import com.you.lld.problems.logging.appender.AsyncAppender;
import com.you.lld.problems.logging.appender.ConsoleAppender;
import com.you.lld.problems.logging.appender.FileAppender;
import com.you.lld.problems.logging.filter.KeywordFilter;
import com.you.lld.problems.logging.filter.LevelFilter;
import com.you.lld.problems.logging.formatter.JsonFormatter;
import com.you.lld.problems.logging.formatter.SimpleFormatter;
import com.you.lld.problems.logging.impl.LoggerImpl;
import com.you.lld.problems.logging.model.LogLevel;
import com.you.lld.problems.logging.model.MDC;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * End-to-end demo of the Logging System exercising:
 *
 *   1. LoggerFactory       -- named-logger registry, caches instances
 *   2. Level filtering     -- events below threshold dropped
 *   3. Multiple appenders  -- one logger fans out to console + file (JSON)
 *   4. Filter chain        -- LevelFilter + KeywordFilter on an appender
 *   5. Exception logging   -- Throwable captured into LogEvent
 *   6. MDC (diagnostic ctx)-- per-thread request-id flows into events
 *   7. AsyncAppender       -- Decorator wraps any appender for async I/O
 *   8. Concurrent logging  -- 5 threads log simultaneously with own MDC
 *   9. Graceful shutdown   -- flushes async queues, closes file handles
 */
public class LoggingDemo {

    public static void main(String[] args) throws Exception {
        System.out.println("========================================");
        System.out.println("  Logging System -- Full LLD Demo");
        System.out.println("========================================\n");

        Path logFile = Files.createTempFile("lld-logging-", ".log");
        System.out.println("[Setup] File appender path: " + logFile + "\n");

        demoLoggerFactoryAndLevels();
        demoFanOutConsoleAndFile(logFile);
        demoFilterChain();
        demoExceptionLogging();
        demoMdcContext();
        demoAsyncAppender();
        demoConcurrentLogging();

        LoggerFactory.shutdown();

        System.out.println("\n--- File contents (JSON from demo 2) ---");
        Files.readAllLines(logFile).forEach(line -> System.out.println("  " + line));
        Files.deleteIfExists(logFile);

        System.out.println("\n========================================");
        System.out.println("  All demos completed.");
        System.out.println("========================================");
    }

    // ──────────── 1. Factory + levels ────────────

    private static void demoLoggerFactoryAndLevels() {
        System.out.println("--- Demo 1: LoggerFactory + Level Filtering ---\n");

        LoggerFactory.setDefaultLevel(LogLevel.INFO);
        LoggerFactory.setDefaultAppender(new ConsoleAppender(new SimpleFormatter()));

        Logger log = LoggerFactory.getLogger("com.app.OrderService");
        log.debug("Debug below INFO -- dropped");
        log.info("Service started");
        log.warn("Cache miss for key=user-42");

        Logger sameInstance = LoggerFactory.getLogger("com.app.OrderService");
        System.out.println("  Cached? " + (log == sameInstance));

        log.setLevel(LogLevel.WARN);
        log.info("Info after raising threshold -- dropped");
        log.warn("Still visible");
        System.out.println();
    }

    // ──────────── 2. Fan-out: console + JSON file ────────────

    private static void demoFanOutConsoleAndFile(Path logFile) throws IOException {
        System.out.println("--- Demo 2: Fan-out to Console (text) + File (JSON) ---\n");

        Logger log = LoggerFactory.getLogger("com.app.BillingService");
        log.addAppender(new FileAppender(logFile.toString(), new JsonFormatter()));

        log.info("Invoice generated INV-001");
        log.warn("Retrying charge for order=ORD-42");
        System.out.println();
    }

    // ──────────── 3. Filter chain ────────────

    private static void demoFilterChain() {
        System.out.println("--- Demo 3: Appender Filter Chain (INFO+ AND not 'secret') ---\n");

        ConsoleAppender filtered = new ConsoleAppender(new SimpleFormatter());
        filtered.addFilter(new LevelFilter(LogLevel.INFO));
        filtered.addFilter(new KeywordFilter("secret", KeywordFilter.Mode.EXCLUDES));

        Logger log = new LoggerImpl("com.app.AuthService", LogLevel.TRACE);
        log.addAppender(filtered);

        log.debug("Debug -- blocked by LevelFilter");
        log.info("User logged in");
        log.info("password=secret123 -- blocked by KeywordFilter");
        log.warn("Rate limit hit");
        System.out.println();
    }

    // ──────────── 4. Exception logging ────────────

    private static void demoExceptionLogging() {
        System.out.println("--- Demo 4: Exception with Stack Trace ---\n");

        Logger log = new LoggerImpl("com.app.DatabaseService", LogLevel.INFO);
        log.addAppender(new ConsoleAppender(new SimpleFormatter()));

        try {
            Integer.parseInt("not-a-number");
        } catch (NumberFormatException e) {
            log.error("Failed to parse id", e);
        }
        System.out.println();
    }

    // ──────────── 5. MDC ────────────

    private static void demoMdcContext() {
        System.out.println("--- Demo 5: MDC (per-thread diagnostic context) ---\n");

        Logger log = new LoggerImpl("com.app.ApiHandler", LogLevel.INFO);
        log.addAppender(new ConsoleAppender(new SimpleFormatter()));

        try {
            MDC.put("requestId", "req-7f3c");
            MDC.put("userId", "u-42");
            log.info("Handling GET /orders");
            log.info("Returning 200 OK");
        } finally {
            MDC.clear();
        }
        log.info("Request context cleared (no MDC now)");
        System.out.println();
    }

    // ──────────── 6. Async appender ────────────

    private static void demoAsyncAppender() throws InterruptedException {
        System.out.println("--- Demo 6: AsyncAppender (Decorator offloads I/O) ---\n");

        ConsoleAppender underlying = new ConsoleAppender(new SimpleFormatter());
        AsyncAppender async = new AsyncAppender(underlying);

        Logger log = new LoggerImpl("com.app.AsyncService", LogLevel.INFO);
        log.addAppender(async);

        for (int i = 1; i <= 3; i++) {
            log.info("Async event " + i + " (producer returns immediately)");
        }
        Thread.sleep(300);
        async.close();
        System.out.println();
    }

    // ──────────── 7. Concurrent ────────────

    private static void demoConcurrentLogging() throws InterruptedException {
        System.out.println("--- Demo 7: Concurrent Logging (5 threads, per-thread MDC) ---\n");

        Logger log = new LoggerImpl("com.app.ConcurrentService", LogLevel.INFO);
        log.addAppender(new ConsoleAppender(new SimpleFormatter()));

        Thread[] threads = new Thread[5];
        for (int i = 0; i < 5; i++) {
            final int idx = i;
            threads[i] = new Thread(() -> {
                try {
                    MDC.put("worker", "w-" + idx);
                    log.info("Doing work");
                } finally {
                    MDC.clear();
                }
            }, "worker-" + i);
        }
        for (Thread t : threads) t.start();
        for (Thread t : threads) t.join();
        System.out.println();
    }
}
```

</details>

### `api/Logger.java`

<details>
<summary>Click to view api/Logger.java</summary>

```java
package com.you.lld.problems.logging.api;

import com.you.lld.problems.logging.appender.LogAppender;
import com.you.lld.problems.logging.model.LogLevel;

/**
 * Public logging API.
 *
 * Every logger has:
 *   - A name (usually a class/package)
 *   - A level threshold (events below are dropped before appending)
 *   - A list of appenders (output sinks with their own formatters + filters)
 *
 * Shortcut methods (trace/debug/info/warn/error/fatal) delegate to log().
 * Throwable variants attach an exception to the LogEvent for stack traces.
 */
public interface Logger {

    String getName();
    LogLevel getLevel();
    void setLevel(LogLevel level);

    void addAppender(LogAppender appender);
    void removeAppender(LogAppender appender);

    void trace(String message);
    void debug(String message);
    void info(String message);
    void warn(String message);
    void error(String message);
    void error(String message, Throwable t);
    void fatal(String message);
    void fatal(String message, Throwable t);

    void log(LogLevel level, String message, Throwable t);
}
```

</details>

### `api/LoggerFactory.java`

<details>
<summary>Click to view api/LoggerFactory.java</summary>

```java
package com.you.lld.problems.logging.api;

import com.you.lld.problems.logging.appender.LogAppender;
import com.you.lld.problems.logging.impl.LoggerImpl;
import com.you.lld.problems.logging.model.LogLevel;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Registry (and Singleton) for named loggers.
 *
 * Two guarantees:
 *   1. getLogger(name) always returns the same Logger instance for a given name,
 *      so different parts of the app share config for the same logger.
 *   2. Default level + default appenders can be set once and auto-applied to
 *      every new logger created afterwards.
 *
 * Thread safety: ConcurrentHashMap + computeIfAbsent for atomic creation.
 */
public final class LoggerFactory {

    private static final Map<String, LoggerImpl> loggers = new ConcurrentHashMap<>();
    private static volatile LogLevel defaultLevel = LogLevel.INFO;
    private static volatile LogAppender defaultAppender;

    private LoggerFactory() {}

    public static Logger getLogger(String name) {
        return loggers.computeIfAbsent(name, n -> {
            LoggerImpl logger = new LoggerImpl(n, defaultLevel);
            if (defaultAppender != null) logger.addAppender(defaultAppender);
            return logger;
        });
    }

    public static Logger getLogger(Class<?> clazz) {
        return getLogger(clazz.getName());
    }

    public static void setDefaultLevel(LogLevel level) {
        defaultLevel = level;
    }

    public static void setDefaultAppender(LogAppender appender) {
        defaultAppender = appender;
    }

    /** Shutdown all registered loggers' appenders (flushes async queues, closes files). */
    public static void shutdown() {
        for (LoggerImpl logger : loggers.values()) {
            logger.closeAppenders();
        }
        loggers.clear();
    }
}
```

</details>

### `model/LogEvent.java`

<details>
<summary>Click to view model/LogEvent.java</summary>

```java
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
```

</details>

### `model/LogLevel.java`

<details>
<summary>Click to view model/LogLevel.java</summary>

```java
package com.you.lld.problems.logging.model;

public enum LogLevel {
    TRACE(0), DEBUG(1), INFO(2), WARN(3), ERROR(4), FATAL(5);
    
    private final int priority;
    
    LogLevel(int priority) {
        this.priority = priority;
    }
    
    public int getPriority() {
        return priority;
    }
}
```

</details>

### `model/MDC.java`

<details>
<summary>Click to view model/MDC.java</summary>

```java
package com.you.lld.problems.logging.model;

import java.util.HashMap;
import java.util.Map;

/**
 * Mapped Diagnostic Context (per-thread key/value map).
 * <p>
 * Typical use:
 * MDC.put("requestId", "abc-123");
 * MDC.put("userId", "u42");
 * try { logger.info("Processing order"); } finally { MDC.clear(); }
 * <p>
 * Each log call snapshots the current thread's MDC into the LogEvent so
 * async appenders see the caller's context, not the worker thread's empty one.
 * <p>
 * Thread safety: a plain HashMap per thread; never shared across threads.
 */
public final class MDC {

    private static final ThreadLocal<Map<String, String>> CONTEXT =
            ThreadLocal.withInitial(HashMap::new);

    private MDC() {
    }

    public static void put(String key, String value) {
        CONTEXT.get().put(key, value);
    }

    public static String get(String key) {
        return CONTEXT.get().get(key);
    }

    public static void remove(String key) {
        CONTEXT.get().remove(key);
    }

    public static void clear() {
        CONTEXT.get().clear();
    }

    /**
     * Snapshot used by Logger to populate LogEvent.
     */
    public static Map<String, String> snapshot() {
        Map<String, String> ctx = CONTEXT.get();
        return ctx.isEmpty() ? new HashMap<>() : new HashMap<>(ctx);
    }
}
```

</details>

### `appender/AbstractAppender.java`

<details>
<summary>Click to view appender/AbstractAppender.java</summary>

```java
package com.you.lld.problems.logging.appender;

import com.you.lld.problems.logging.filter.LogFilter;
import com.you.lld.problems.logging.formatter.LogFormatter;
import com.you.lld.problems.logging.formatter.SimpleFormatter;
import com.you.lld.problems.logging.model.LogEvent;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Base class with the filter chain + formatter boilerplate.
 * Subclasses only implement {@link #doAppend(String)} -- the actual write.
 * <p>
 * CopyOnWriteArrayList is used for the filter list so subscribers adding
 * filters during logging don't need extra synchronization.
 */
public abstract class AbstractAppender implements LogAppender {

    private final String name;
    private volatile LogFormatter formatter;
    private final List<LogFilter> filters = new CopyOnWriteArrayList<>();

    protected AbstractAppender(String name, LogFormatter formatter) {
        if (name == null) throw new IllegalArgumentException("appender name required");
        this.name = name;
        this.formatter = formatter != null ? formatter : new SimpleFormatter();
    }

    public void setFormatter(LogFormatter formatter) {
        if (formatter != null) this.formatter = formatter;
    }

    @Override
    public void addFilter(LogFilter filter) {
        if (filter != null) filters.add(filter);
    }

    @Override
    public final void append(LogEvent event) {
        for (LogFilter f : filters) {
            if (!f.accept(event)) return;
        }
        doAppend(formatter.format(event));
    }

    @Override
    public String getName() {
        return name;
    }

    /**
     * Subclass performs the actual I/O (stdout, file, remote, etc.).
     */
    protected abstract void doAppend(String formatted);

    @Override
    public void close() { /* no-op for memory-only appenders */ }
}
```

</details>

### `appender/AsyncAppender.java`

<details>
<summary>Click to view appender/AsyncAppender.java</summary>

```java
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
```

</details>

### `appender/ConsoleAppender.java`

<details>
<summary>Click to view appender/ConsoleAppender.java</summary>

```java
package com.you.lld.problems.logging.appender;

import com.you.lld.problems.logging.formatter.LogFormatter;

/**
 * Writes formatted events to System.out (or System.err for ERROR+).
 */
public class ConsoleAppender extends AbstractAppender {

    public ConsoleAppender() {
        super("console", null);
    }

    public ConsoleAppender(LogFormatter formatter) {
        super("console", formatter);
    }

    @Override
    protected void doAppend(String formatted) {
        System.out.println(formatted);
    }
}
```

</details>

### `appender/FileAppender.java`

<details>
<summary>Click to view appender/FileAppender.java</summary>

```java
package com.you.lld.problems.logging.appender;

import com.you.lld.problems.logging.formatter.LogFormatter;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

/**
 * Writes formatted events to a file.
 *
 * doAppend() is synchronized so concurrent log calls don't interleave bytes.
 * Close must be called on shutdown to flush the buffer and release the fd.
 */
public class FileAppender extends AbstractAppender {

    private final String filePath;
    private final BufferedWriter writer;

    public FileAppender(String filePath) throws IOException {
        this(filePath, null);
    }

    public FileAppender(String filePath, LogFormatter formatter) throws IOException {
        super("file:" + filePath, formatter);
        this.filePath = filePath;
        this.writer = new BufferedWriter(new FileWriter(filePath, true));
    }

    @Override
    protected synchronized void doAppend(String formatted) {
        try {
            writer.write(formatted);
            writer.newLine();
            writer.flush();
        } catch (IOException e) {
            System.err.println("[FileAppender] Failed to write to " + filePath + ": " + e.getMessage());
        }
    }

    @Override
    public synchronized void close() {
        try {
            writer.close();
        } catch (IOException e) {
            System.err.println("[FileAppender] Failed to close " + filePath + ": " + e.getMessage());
        }
    }
}
```

</details>

### `appender/LogAppender.java`

<details>
<summary>Click to view appender/LogAppender.java</summary>

```java
package com.you.lld.problems.logging.appender;

import com.you.lld.problems.logging.filter.LogFilter;
import com.you.lld.problems.logging.model.LogEvent;

/**
 * Output sink for LogEvents. Loggers fan out each event to every appender.
 *
 * Each appender has its own formatter (how to render) and filter chain
 * (what to accept) -- so you can send JSON to stdout and plain text to a file
 * with different level thresholds on each.
 *
 * close() allows async/file appenders to flush and release resources.
 */
public interface LogAppender {
    void append(LogEvent event);
    void addFilter(LogFilter filter);
    void close();
    String getName();
}
```

</details>

### `filter/KeywordFilter.java`

<details>
<summary>Click to view filter/KeywordFilter.java</summary>

```java
package com.you.lld.problems.logging.filter;

import com.you.lld.problems.logging.model.LogEvent;

/**
 * Accepts events whose message contains (or, in deny mode, does NOT contain) the keyword.
 * Useful for routing, e.g. "only audit events to the audit appender".
 */
public class KeywordFilter implements LogFilter {

    public enum Mode { CONTAINS, EXCLUDES }

    private final String keyword;
    private final Mode mode;

    public KeywordFilter(String keyword, Mode mode) {
        if (keyword == null) throw new IllegalArgumentException("keyword required");
        this.keyword = keyword;
        this.mode = mode;
    }

    @Override
    public boolean accept(LogEvent event) {
        boolean has = event.getMessage() != null && event.getMessage().contains(keyword);
        return mode == Mode.CONTAINS ? has : !has;
    }
}
```

</details>

### `filter/LevelFilter.java`

<details>
<summary>Click to view filter/LevelFilter.java</summary>

```java
package com.you.lld.problems.logging.filter;

import com.you.lld.problems.logging.model.LogEvent;
import com.you.lld.problems.logging.model.LogLevel;

/**
 * Accepts only events at or above the threshold level.
 *
 * Uses LogLevel.getPriority() instead of enum.ordinal() so adding a new level
 * in the middle of the enum doesn't break thresholds.
 */
public class LevelFilter implements LogFilter {

    private final LogLevel threshold;

    public LevelFilter(LogLevel threshold) {
        if (threshold == null) throw new IllegalArgumentException("threshold required");
        this.threshold = threshold;
    }

    @Override
    public boolean accept(LogEvent event) {
        return event.getLevel().getPriority() >= threshold.getPriority();
    }
}
```

</details>

### `filter/LogFilter.java`

<details>
<summary>Click to view filter/LogFilter.java</summary>

```java
package com.you.lld.problems.logging.filter;

import com.you.lld.problems.logging.model.LogEvent;

/**
 * Strategy for deciding whether an event should reach an appender.
 * An appender owns a list of filters; event is accepted only if ALL return true.
 */
@FunctionalInterface
public interface LogFilter {
    boolean accept(LogEvent event);
}
```

</details>

### `formatter/JsonFormatter.java`

<details>
<summary>Click to view formatter/JsonFormatter.java</summary>

```java
package com.you.lld.problems.logging.formatter;

import com.you.lld.problems.logging.model.LogEvent;

import java.util.Map;

/**
 * JSON formatter with proper escaping for quotes, backslashes, and control chars.
 * No dependency on Jackson/Gson -- minimal hand-rolled emitter sufficient for LLD demo.
 */
public class JsonFormatter implements LogFormatter {

    @Override
    public String format(LogEvent event) {
        StringBuilder sb = new StringBuilder(128);
        sb.append('{');
        appendField(sb, "timestamp", event.getTimestamp().toString(), true);
        appendField(sb, "level", event.getLevel().name(), false);
        appendField(sb, "logger", event.getLoggerName(), false);
        appendField(sb, "thread", event.getThreadName(), false);
        appendField(sb, "message", event.getMessage(), false);

        if (!event.getContext().isEmpty()) {
            sb.append(",\"context\":{");
            boolean first = true;
            for (Map.Entry<String, String> e : event.getContext().entrySet()) {
                if (!first) sb.append(',');
                sb.append('"').append(escape(e.getKey())).append("\":\"")
                  .append(escape(e.getValue())).append('"');
                first = false;
            }
            sb.append('}');
        }

        if (event.getThrowable() != null) {
            appendField(sb, "exception", event.getThrowable().toString(), false);
        }

        sb.append('}');
        return sb.toString();
    }

    private static void appendField(StringBuilder sb, String key, String value, boolean first) {
        if (!first) sb.append(',');
        sb.append('"').append(key).append("\":\"").append(escape(value)).append('"');
    }

    private static String escape(String s) {
        if (s == null) return "";
        StringBuilder out = new StringBuilder(s.length() + 8);
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"':  out.append("\\\""); break;
                case '\\': out.append("\\\\"); break;
                case '\n': out.append("\\n");  break;
                case '\r': out.append("\\r");  break;
                case '\t': out.append("\\t");  break;
                case '\b': out.append("\\b");  break;
                case '\f': out.append("\\f");  break;
                default:
                    if (c < 0x20) out.append(String.format("\\u%04x", (int) c));
                    else          out.append(c);
            }
        }
        return out.toString();
    }
}
```

</details>

### `formatter/LogFormatter.java`

<details>
<summary>Click to view formatter/LogFormatter.java</summary>

```java
package com.you.lld.problems.logging.formatter;

import com.you.lld.problems.logging.model.LogEvent;

/**
 * Strategy for turning a LogEvent into a printable string.
 * Each appender owns a formatter (dependency injection).
 */
@FunctionalInterface
public interface LogFormatter {
    String format(LogEvent event);
}
```

</details>

### `formatter/SimpleFormatter.java`

<details>
<summary>Click to view formatter/SimpleFormatter.java</summary>

```java
package com.you.lld.problems.logging.formatter;

import com.you.lld.problems.logging.model.LogEvent;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

/**
 * Human-readable formatter: [timestamp] [LEVEL] [thread] logger {mdc} - message\n  stacktrace?
 */
public class SimpleFormatter implements LogFormatter {

    private static final DateTimeFormatter TS =
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS").withZone(ZoneId.systemDefault());

    @Override
    public String format(LogEvent event) {
        StringBuilder sb = new StringBuilder(128);
        sb.append('[').append(TS.format(event.getTimestamp())).append("] ")
          .append('[').append(event.getLevel()).append("] ")
          .append('[').append(event.getThreadName()).append("] ")
          .append(event.getLoggerName());

        if (!event.getContext().isEmpty()) {
            sb.append(' ').append(event.getContext());
        }
        sb.append(" - ").append(event.getMessage());

        if (event.getThrowable() != null) {
            StringWriter sw = new StringWriter();
            event.getThrowable().printStackTrace(new PrintWriter(sw));
            sb.append(System.lineSeparator()).append(sw);
        }
        return sb.toString();
    }
}
```

</details>

### `impl/LoggerImpl.java`

<details>
<summary>Click to view impl/LoggerImpl.java</summary>

```java
package com.you.lld.problems.logging.impl;

import com.you.lld.problems.logging.api.Logger;
import com.you.lld.problems.logging.appender.LogAppender;
import com.you.lld.problems.logging.model.LogEvent;
import com.you.lld.problems.logging.model.LogLevel;
import com.you.lld.problems.logging.model.MDC;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Thread-safe Logger implementation.
 * <p>
 * Concurrency:
 * - level is volatile so reads see the latest setLevel() without locking
 * - appenders uses CopyOnWriteArrayList: cheap concurrent reads during
 * log(), safe add/remove during runtime, no locking on the hot path
 * - Each appender is responsible for its own internal sync (Console: none
 * needed; File: synchronized write; Async: bounded queue)
 * <p>
 * Hot path:
 * log(level, msg) -> level check -> build LogEvent (snapshot MDC) -> fan out to appenders
 */
public class LoggerImpl implements Logger {

    private final String name;
    private volatile LogLevel level;
    private final List<LogAppender> appenders = new CopyOnWriteArrayList<>();

    public LoggerImpl(String name, LogLevel initialLevel) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("logger name required");
        }
        this.name = name;
        this.level = initialLevel != null ? initialLevel : LogLevel.INFO;
    }

    // ─────────── config ───────────

    @Override
    public String getName() {
        return name;
    }

    @Override
    public LogLevel getLevel() {
        return level;
    }

    @Override
    public void setLevel(LogLevel l) {
        if (l != null) this.level = l;
    }

    @Override
    public void addAppender(LogAppender a) {
        if (a != null) appenders.add(a);
    }

    @Override
    public void removeAppender(LogAppender a) {
        appenders.remove(a);
    }

    public void closeAppenders() {
        for (LogAppender a : appenders) {
            try {
                a.close();
            } catch (Exception ignored) {
            }
        }
        appenders.clear();
    }

    // ─────────── level shortcuts ───────────

    @Override
    public void trace(String m) {
        log(LogLevel.TRACE, m, null);
    }

    @Override
    public void debug(String m) {
        log(LogLevel.DEBUG, m, null);
    }

    @Override
    public void info(String m) {
        log(LogLevel.INFO, m, null);
    }

    @Override
    public void warn(String m) {
        log(LogLevel.WARN, m, null);
    }

    @Override
    public void error(String m) {
        log(LogLevel.ERROR, m, null);
    }

    @Override
    public void error(String m, Throwable t) {
        log(LogLevel.ERROR, m, t);
    }

    @Override
    public void fatal(String m) {
        log(LogLevel.FATAL, m, null);
    }

    @Override
    public void fatal(String m, Throwable t) {
        log(LogLevel.FATAL, m, t);
    }

    // ─────────── hot path ───────────

    @Override
    public void log(LogLevel eventLevel, String message, Throwable t) {
        if (eventLevel == null) return;
        if (eventLevel.getPriority() < this.level.getPriority()) return;

        LogEvent event = new LogEvent(eventLevel, message, name, t, MDC.snapshot());
        for (LogAppender appender : appenders) {
            try {
                appender.append(event);
            } catch (Exception e) {
                System.err.println("[Logger] appender " + appender.getName() + " failed: " + e.getMessage());
            }
        }
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.logging.LoggingDemo"
```

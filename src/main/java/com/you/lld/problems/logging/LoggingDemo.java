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

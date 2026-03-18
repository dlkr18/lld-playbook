package com.you.lld.problems.loggingframework;

import com.you.lld.problems.loggingframework.impl.LoggerImpl;
import com.you.lld.problems.loggingframework.model.LogLevel;

/**
 * Demo: Logging Framework with async processing, log levels, filtering.
 */
public class LoggingDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Logging Framework Demo ===\n");

        // Logger with INFO minimum level
        LoggerImpl appLogger = new LoggerImpl("AppService", LogLevel.INFO);
        LoggerImpl dbLogger = new LoggerImpl("DatabaseLayer", LogLevel.DEBUG);

        System.out.println("--- App logger (min=INFO) ---");
        appLogger.debug("This should be filtered out"); // below INFO
        appLogger.info("Application started");
        appLogger.warn("Disk space running low");
        appLogger.error("Failed to connect to payment gateway");

        System.out.println("\n--- DB logger (min=DEBUG) ---");
        dbLogger.debug("SELECT * FROM users WHERE id=42");
        dbLogger.info("Connection pool initialized: 10 connections");
        dbLogger.warn("Slow query detected: 3200ms");
        dbLogger.error("Deadlock detected in transaction T-100");

        // Wait for async processing to complete
        Thread.sleep(500);

        // Multi-threaded logging
        System.out.println("\n--- Concurrent logging ---");
        Thread[] threads = new Thread[5];
        for (int i = 0; i < 5; i++) {
            final int idx = i;
            threads[i] = new Thread(() -> {
                appLogger.info("Request from thread-" + idx);
            });
        }
        for (Thread t : threads) t.start();
        for (Thread t : threads) {
            try { t.join(); } catch (InterruptedException ignored) {}
        }

        Thread.sleep(500);
        appLogger.shutdown();
        dbLogger.shutdown();

        System.out.println("\n=== Demo complete ===");
    }
}

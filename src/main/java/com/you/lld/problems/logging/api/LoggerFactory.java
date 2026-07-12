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

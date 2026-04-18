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

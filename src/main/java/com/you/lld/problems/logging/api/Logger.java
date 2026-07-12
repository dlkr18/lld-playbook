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

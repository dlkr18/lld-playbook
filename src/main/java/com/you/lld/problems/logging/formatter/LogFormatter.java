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

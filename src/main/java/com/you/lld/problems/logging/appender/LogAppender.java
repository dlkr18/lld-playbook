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

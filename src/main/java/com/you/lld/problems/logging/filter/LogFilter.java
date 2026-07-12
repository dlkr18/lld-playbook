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

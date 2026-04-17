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

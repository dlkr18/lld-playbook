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

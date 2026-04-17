package com.you.lld.problems.logging.appender;

import com.you.lld.problems.logging.filter.LogFilter;
import com.you.lld.problems.logging.formatter.LogFormatter;
import com.you.lld.problems.logging.formatter.SimpleFormatter;
import com.you.lld.problems.logging.model.LogEvent;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Base class with the filter chain + formatter boilerplate.
 * Subclasses only implement {@link #doAppend(String)} -- the actual write.
 *
 * CopyOnWriteArrayList is used for the filter list so subscribers adding
 * filters during logging don't need extra synchronization.
 */
public abstract class AbstractAppender implements LogAppender {

    private final String name;
    private volatile LogFormatter formatter;
    private final List<LogFilter> filters = new CopyOnWriteArrayList<>();

    protected AbstractAppender(String name, LogFormatter formatter) {
        if (name == null) throw new IllegalArgumentException("appender name required");
        this.name = name;
        this.formatter = formatter != null ? formatter : new SimpleFormatter();
    }

    public void setFormatter(LogFormatter formatter) {
        if (formatter != null) this.formatter = formatter;
    }

    @Override
    public void addFilter(LogFilter filter) {
        if (filter != null) filters.add(filter);
    }

    @Override
    public final void append(LogEvent event) {
        for (LogFilter f : filters) {
            if (!f.accept(event)) return;
        }
        doAppend(formatter.format(event));
    }

    @Override
    public String getName() { return name; }

    /** Subclass performs the actual I/O (stdout, file, remote, etc.). */
    protected abstract void doAppend(String formatted);

    @Override
    public void close() { /* no-op for memory-only appenders */ }
}

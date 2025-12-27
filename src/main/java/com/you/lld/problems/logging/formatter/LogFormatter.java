package com.you.lld.problems.logging.formatter;

import com.you.lld.problems.logging.model.LogEntry;

public interface LogFormatter {
    String format(LogEntry entry);
}

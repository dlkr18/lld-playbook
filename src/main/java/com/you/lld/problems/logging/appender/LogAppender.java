package com.you.lld.problems.logging.appender;

import com.you.lld.problems.logging.model.LogEntry;

public interface LogAppender {
    void append(LogEntry entry);
}

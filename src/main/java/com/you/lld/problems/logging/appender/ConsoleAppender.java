package com.you.lld.problems.logging.appender;

import com.you.lld.problems.logging.model.LogEntry;

public class ConsoleAppender implements LogAppender {
    @Override
    public void append(LogEntry entry) {
        System.out.println(entry);
    }
}

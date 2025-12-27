package com.you.lld.problems.loggingframework.formatter;

import com.you.lld.problems.loggingframework.model.LogMessage;

public class JsonFormatter implements LogFormatter {
    @Override
    public String format(LogMessage message) {
        return String.format("{\"level\":\"%s\",\"message\":\"%s\",\"timestamp\":\"%s\"}",
            message.getLevel(), message.getMessage(), message.getTimestamp());
    }
}

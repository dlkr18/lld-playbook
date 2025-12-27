package com.you.lld.problems.loggingframework.formatter;

import com.you.lld.problems.loggingframework.model.LogMessage;

public interface LogFormatter {
    String format(LogMessage message);
}

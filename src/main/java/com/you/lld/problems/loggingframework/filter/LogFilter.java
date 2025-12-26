package com.you.lld.problems.loggingframework.filter;

import com.you.lld.problems.loggingframework.model.LogMessage;

public interface LogFilter {
    boolean shouldLog(LogMessage message);
}

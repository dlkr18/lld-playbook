package com.you.lld.problems.loggingframework.filter;

import com.you.lld.problems.loggingframework.model.*;

public class LevelFilter implements LogFilter {
    private final LogLevel minLevel;
    
    public LevelFilter(LogLevel minLevel) {
        this.minLevel = minLevel;
    }
    
    @Override
    public boolean shouldLog(LogMessage message) {
        return message.getLevel().ordinal() >= minLevel.ordinal();
    }
}

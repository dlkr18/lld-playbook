package com.you.lld.problems.logging.impl;

import com.you.lld.problems.logging.api.Logger;
import com.you.lld.problems.logging.appender.LogAppender;
import com.you.lld.problems.logging.model.*;
import java.util.*;

public class LoggerImpl implements Logger {
    private final String name;
    private LogLevel level;
    private final List<LogAppender> appenders;
    
    public LoggerImpl(String name) {
        this.name = name;
        this.level = LogLevel.INFO;
        this.appenders = new ArrayList<>();
    }
    
    public void addAppender(LogAppender appender) {
        appenders.add(appender);
    }
    
    private void log(LogLevel level, String message) {
        if (level.getPriority() >= this.level.getPriority()) {
            LogEntry entry = new LogEntry(level, message, name);
            for (LogAppender appender : appenders) {
                appender.append(entry);
            }
        }
    }
    
    @Override
    public void trace(String message) { log(LogLevel.TRACE, message); }
    
    @Override
    public void debug(String message) { log(LogLevel.DEBUG, message); }
    
    @Override
    public void info(String message) { log(LogLevel.INFO, message); }
    
    @Override
    public void warn(String message) { log(LogLevel.WARN, message); }
    
    @Override
    public void error(String message) { log(LogLevel.ERROR, message); }
    
    @Override
    public void fatal(String message) { log(LogLevel.FATAL, message); }
    
    @Override
    public void setLevel(LogLevel level) { this.level = level; }
}

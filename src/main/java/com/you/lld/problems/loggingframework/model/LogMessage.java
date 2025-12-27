package com.you.lld.problems.loggingframework.model;

import java.time.LocalDateTime;

public class LogMessage {
    private final LogLevel level;
    private final String message;
    private final String className;
    private final LocalDateTime timestamp;
    
    public LogMessage(LogLevel level, String message, String className) {
        this.level = level;
        this.message = message;
        this.className = className;
        this.timestamp = LocalDateTime.now();
    }
    
    public LogLevel getLevel() { return level; }
    public String getMessage() { return message; }
    public String getClassName() { return className; }
    public LocalDateTime getTimestamp() { return timestamp; }
    
    @Override
    public String toString() {
        return "[" + timestamp + "] [" + level + "] [" + className + "] " + message;
    }
}

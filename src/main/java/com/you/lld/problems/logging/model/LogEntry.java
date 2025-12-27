package com.you.lld.problems.logging.model;

import java.time.LocalDateTime;

public class LogEntry {
    private final LogLevel level;
    private final String message;
    private final LocalDateTime timestamp;
    private final String thread;
    private final String logger;
    
    public LogEntry(LogLevel level, String message, String logger) {
        this.level = level;
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.thread = Thread.currentThread().getName();
        this.logger = logger;
    }
    
    public LogLevel getLevel() { return level; }
    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getLogger() { return logger; }
    public String getSource() { return logger; } // Alias for logger
    
    @Override
    public String toString() {
        return String.format("[%s] %s [%s] %s - %s", 
            timestamp, level, thread, logger, message);
    }
}

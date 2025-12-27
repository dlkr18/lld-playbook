package com.you.lld.problems.logging.impl;

import com.you.lld.problems.logging.api.LoggingService;
import com.you.lld.problems.logging.model.LogLevel;
import com.you.lld.problems.logging.model.LogEntry;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.stream.Collectors;

/**
 * Thread-safe centralized logging service implementation.
 */
public class CentralizedLoggingService implements LoggingService {
    
    private final Queue<LogEntry> logs;
    private final int maxLogSize;
    
    public CentralizedLoggingService() {
        this(10000); // Default max 10K logs
    }
    
    public CentralizedLoggingService(int maxLogSize) {
        this.logs = new ConcurrentLinkedQueue<>();
        this.maxLogSize = maxLogSize;
    }
    
    @Override
    public void log(LogLevel level, String message, String source) {
        LogEntry entry = new LogEntry(level, message, source);
        logs.offer(entry);
        
        // Remove oldest logs if exceeding max size
        while (logs.size() > maxLogSize) {
            logs.poll();
        }
    }
    
    @Override
    public List<LogEntry> getLogsByLevel(LogLevel level) {
        return logs.stream()
            .filter(log -> log.getLevel() == level)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<LogEntry> getLogsBySource(String source) {
        return logs.stream()
            .filter(log -> log.getSource().equals(source))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<LogEntry> getRecentLogs(int count) {
        List<LogEntry> allLogs = new ArrayList<>(logs);
        int size = allLogs.size();
        int startIndex = Math.max(0, size - count);
        return allLogs.subList(startIndex, size);
    }
    
    @Override
    public List<LogEntry> searchLogs(String keyword) {
        String lowerKeyword = keyword.toLowerCase();
        return logs.stream()
            .filter(log -> log.getMessage().toLowerCase().contains(lowerKeyword) ||
                          log.getSource().toLowerCase().contains(lowerKeyword))
            .collect(Collectors.toList());
    }
    
    @Override
    public void clearLogs() {
        logs.clear();
    }
    
    @Override
    public long getLogCount() {
        return logs.size();
    }
}


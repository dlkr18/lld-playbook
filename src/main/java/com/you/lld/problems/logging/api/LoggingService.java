package com.you.lld.problems.logging.api;

import com.you.lld.problems.logging.model.LogLevel;
import com.you.lld.problems.logging.model.LogEntry;

import java.util.List;

/**
 * Service interface for centralized logging system.
 * Supports log collection, filtering, and aggregation.
 */
public interface LoggingService {
    
    /**
     * Logs a message at the specified level.
     * 
     * @param level Log level
     * @param message Log message
     * @param source Source of the log (e.g., class name)
     */
    void log(LogLevel level, String message, String source);
    
    /**
     * Gets all logs for a specific level.
     * 
     * @param level Log level to filter by
     * @return List of matching log entries
     */
    List<LogEntry> getLogsByLevel(LogLevel level);
    
    /**
     * Gets all logs from a specific source.
     * 
     * @param source Source identifier
     * @return List of matching log entries
     */
    List<LogEntry> getLogsBySource(String source);
    
    /**
     * Gets recent logs.
     * 
     * @param count Number of recent logs to retrieve
     * @return List of recent log entries
     */
    List<LogEntry> getRecentLogs(int count);
    
    /**
     * Searches logs by keyword.
     * 
     * @param keyword Search keyword
     * @return List of matching log entries
     */
    List<LogEntry> searchLogs(String keyword);
    
    /**
     * Clears all logs.
     */
    void clearLogs();
    
    /**
     * Gets total log count.
     * 
     * @return Total number of logs
     */
    long getLogCount();
}


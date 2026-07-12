# Source Code

This page contains the complete source code for this problem.

## 📁 Directory Structure

```
├── LoggingDemo.java
├── api/LogAggregator.java
├── api/Logger.java
├── api/LoggingService.java
├── appender/ConsoleAppender.java
├── appender/LogAppender.java
├── formatter/LogFormatter.java
├── impl/CentralizedLoggingService.java
├── impl/LoggerImpl.java
├── model/LogEntry.java
├── model/LogLevel.java
```

## LoggingDemo.java

```java
package com.you.lld.problems.logging;

import com.you.lld.problems.logging.impl.LoggerImpl;
import com.you.lld.problems.logging.appender.ConsoleAppender;
import com.you.lld.problems.logging.model.LogLevel;

public class LoggingDemo {
    public static void main(String[] args) {
        System.out.println("📝 Logging System Demo");
        System.out.println(String.format("%70s", "").replace(" ", "="));
        System.out.println();
        
        LoggerImpl logger = new LoggerImpl("MyApp");
        logger.addAppender(new ConsoleAppender());
        logger.setLevel(LogLevel.DEBUG);
        
        logger.debug("Debug message");
        logger.info("Application started");
        logger.warn("Warning message");
        logger.error("Error occurred");
        
        System.out.println("\n✅ Demo complete!");
    }
}
```

## LogAggregator.java

```java
package com.you.lld.problems.logging.api;

import com.you.lld.problems.logging.model.LogEntry;
import java.util.List;

public interface LogAggregator {
    void ingestLog(String service, String level, String message);
    List<LogEntry> search(String service, String level);
    List<LogEntry> getRecentLogs(int count);
}
```

## Logger.java

```java
package com.you.lld.problems.logging.api;

import com.you.lld.problems.logging.model.LogLevel;

public interface Logger {
    void trace(String message);
    void debug(String message);
    void info(String message);
    void warn(String message);
    void error(String message);
    void fatal(String message);
    void setLevel(LogLevel level);
}
```

## LoggingService.java

```java
package com.you.lld.problems.logging.api;

import com.you.lld.problems.logging.LogLevel;
import com.you.lld.problems.logging.LogEntry;

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

```

## ConsoleAppender.java

```java
package com.you.lld.problems.logging.appender;

import com.you.lld.problems.logging.model.LogEntry;

public class ConsoleAppender implements LogAppender {
    @Override
    public void append(LogEntry entry) {
        System.out.println(entry);
    }
}
```

## LogAppender.java

```java
package com.you.lld.problems.logging.appender;

import com.you.lld.problems.logging.model.LogEntry;

public interface LogAppender {
    void append(LogEntry entry);
}
```

## LogFormatter.java

```java
package com.you.lld.problems.logging.formatter;

import com.you.lld.problems.logging.model.LogEntry;

public interface LogFormatter {
    String format(LogEntry entry);
}
```

## CentralizedLoggingService.java

```java
package com.you.lld.problems.logging.impl;

import com.you.lld.problems.logging.api.LoggingService;
import com.you.lld.problems.logging.LogLevel;
import com.you.lld.problems.logging.LogEntry;

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
        LogEntry entry = new LogEntry(level, message, source, LocalDateTime.now());
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

```

## LoggerImpl.java

```java
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
```

## LogEntry.java

```java
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
    
    @Override
    public String toString() {
        return String.format("[%s] %s [%s] %s - %s", 
            timestamp, level, thread, logger, message);
    }
}
```

## LogLevel.java

```java
package com.you.lld.problems.logging.model;

public enum LogLevel {
    TRACE(0), DEBUG(1), INFO(2), WARN(3), ERROR(4), FATAL(5);
    
    private final int priority;
    
    LogLevel(int priority) {
        this.priority = priority;
    }
    
    public int getPriority() {
        return priority;
    }
}
```


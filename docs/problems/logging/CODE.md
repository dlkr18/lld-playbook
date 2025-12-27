# logging - Complete Implementation

## 📁 Project Structure

```
logging/
├── LoggingDemo.java
├── api/LogAggregator.java
├── api/Logger.java
├── appender/ConsoleAppender.java
├── appender/LogAppender.java
├── formatter/LogFormatter.java
├── impl/LoggerImpl.java
├── model/LogEntry.java
├── model/LogLevel.java
```

## 📝 Source Code

### 📄 `LoggingDemo.java`

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

### 📄 `api/LogAggregator.java`

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

### 📄 `api/Logger.java`

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

### 📄 `appender/ConsoleAppender.java`

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

### 📄 `appender/LogAppender.java`

```java
package com.you.lld.problems.logging.appender;

import com.you.lld.problems.logging.model.LogEntry;

public interface LogAppender {
    void append(LogEntry entry);
}
```

### 📄 `formatter/LogFormatter.java`

```java
package com.you.lld.problems.logging.formatter;

import com.you.lld.problems.logging.model.LogEntry;

public interface LogFormatter {
    String format(LogEntry entry);
}
```

### 📄 `impl/LoggerImpl.java`

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

### 📄 `model/LogEntry.java`

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

### 📄 `model/LogLevel.java`

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


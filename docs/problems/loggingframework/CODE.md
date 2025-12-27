# loggingframework - Complete Implementation

## 📁 Project Structure

```
loggingframework/
├── api/Logger.java
├── filter/LevelFilter.java
├── filter/LogFilter.java
├── formatter/JsonFormatter.java
├── formatter/LogFormatter.java
├── impl/LoggerImpl.java
├── model/LogContext.java
├── model/LogLevel.java
├── model/LogMessage.java
```

## 📝 Source Code

### 📄 `api/Logger.java`

```java
package com.you.lld.problems.loggingframework.api;

import com.you.lld.problems.loggingframework.model.LogLevel;

public interface Logger {
    void log(LogLevel level, String message);
    void debug(String message);
    void info(String message);
    void warn(String message);
    void error(String message);
}
```

### 📄 `filter/LevelFilter.java`

```java
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
```

### 📄 `filter/LogFilter.java`

```java
package com.you.lld.problems.loggingframework.filter;

import com.you.lld.problems.loggingframework.model.LogMessage;

public interface LogFilter {
    boolean shouldLog(LogMessage message);
}
```

### 📄 `formatter/JsonFormatter.java`

```java
package com.you.lld.problems.loggingframework.formatter;

import com.you.lld.problems.loggingframework.model.LogMessage;

public class JsonFormatter implements LogFormatter {
    @Override
    public String format(LogMessage message) {
        return String.format("{\"level\":\"%s\",\"message\":\"%s\",\"timestamp\":\"%s\"}",
            message.getLevel(), message.getMessage(), message.getTimestamp());
    }
}
```

### 📄 `formatter/LogFormatter.java`

```java
package com.you.lld.problems.loggingframework.formatter;

import com.you.lld.problems.loggingframework.model.LogMessage;

public interface LogFormatter {
    String format(LogMessage message);
}
```

### 📄 `impl/LoggerImpl.java`

```java
package com.you.lld.problems.loggingframework.impl;

import com.you.lld.problems.loggingframework.api.Logger;
import com.you.lld.problems.loggingframework.model.*;
import java.util.concurrent.*;

public class LoggerImpl implements Logger {
    private final String className;
    private final LogLevel minLevel;
    private final BlockingQueue<LogMessage> queue = new LinkedBlockingQueue<>();
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    
    public LoggerImpl(String className, LogLevel minLevel) {
        this.className = className;
        this.minLevel = minLevel;
        executor.submit(this::processLogs);
    }
    
    @Override
    public void log(LogLevel level, String message) {
        if (level.getValue() >= minLevel.getValue()) {
            queue.offer(new LogMessage(level, message, className));
        }
    }
    
    @Override
    public void debug(String message) { log(LogLevel.DEBUG, message); }
    
    @Override
    public void info(String message) { log(LogLevel.INFO, message); }
    
    @Override
    public void warn(String message) { log(LogLevel.WARN, message); }
    
    @Override
    public void error(String message) { log(LogLevel.ERROR, message); }
    
    private void processLogs() {
        while (true) {
            try {
                LogMessage msg = queue.take();
                System.out.println(msg);
            } catch (InterruptedException e) {
                return;
            }
        }
    }
    
    public void shutdown() {
        executor.shutdown();
    }
}
```

### 📄 `model/LogContext.java`

```java
package com.you.lld.problems.loggingframework.model;

import java.util.*;

public class LogContext {
    private final Map<String, String> context = new HashMap<>();
    
    public void put(String key, String value) {
        context.put(key, value);
    }
    
    public String get(String key) {
        return context.get(key);
    }
    
    public Map<String, String> getAll() {
        return new HashMap<>(context);
    }
    
    public void clear() {
        context.clear();
    }
}
```

### 📄 `model/LogLevel.java`

```java
package com.you.lld.problems.loggingframework.model;

public enum LogLevel {
    DEBUG(1), INFO(2), WARN(3), ERROR(4), FATAL(5);
    
    private final int value;
    LogLevel(int value) { this.value = value; }
    public int getValue() { return value; }
}
```

### 📄 `model/LogMessage.java`

```java
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
```


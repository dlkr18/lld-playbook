# Logging Framework

## Overview
A flexible, configurable logging framework supporting multiple log levels, output destinations, formatting options, and filtering capabilities. Designed for application debugging, monitoring, and audit trails with minimal performance overhead.

**Difficulty:** Medium  
**Domain:** Infrastructure, Observability  
**Interview Frequency:** Very High (All companies)

## Requirements

### Functional Requirements
1. **Log Levels**: DEBUG, INFO, WARN, ERROR, FATAL
2. **Multiple Appenders**: Console, File, Database, Network
3. **Formatters**: JSON, Plain Text, Custom formats
4. **Filtering**: Level-based, Pattern-based, Custom filters
5. **Configuration**: Programmatic and file-based
6. **Thread-Safety**: Concurrent logging support

### Key Features
- Hierarchical logger names (com.app.service)
- Configurable log rotation (size/time based)
- Asynchronous logging for performance
- Context/MDC for request tracking
- Log sampling for high-volume scenarios

## Core Design

### Log Levels
```
FATAL (500) - System crash
ERROR (400) - Operation failure
WARN  (300) - Potential issue
INFO  (200) - Important events
DEBUG (100) - Detailed diagnostics
TRACE (50)  - Very detailed
```

### Architecture
```java
Logger logger = LoggerFactory.getLogger("com.app.UserService");

logger.debug("User query started");
logger.info("User {} logged in", userId);
logger.warn("High memory usage: {}%", memUsage);
logger.error("Failed to process order {}", orderId, exception);
```

### Key Algorithms

#### Thread-Safe Logging
```java
public class Logger {
    private final BlockingQueue<LogEvent> queue;
    private final ExecutorService executor;
    
    public void log(LogLevel level, String message, Object... args) {
        LogEvent event = new LogEvent(level, format(message, args));
        queue.offer(event); // Non-blocking
        // Background thread processes queue
    }
}
```

**Time Complexity:** O(1)  
**Space Complexity:** O(N) for queue

#### Log Rotation
```java
public class RotatingFileAppender {
    private long maxFileSize = 10 * 1024 * 1024; // 10MB
    private int maxBackups = 5;
    
    public void append(LogEvent event) {
        if (currentFile.length() > maxFileSize) {
            rotate();
        }
        write(event);
    }
    
    private void rotate() {
        // app.log -> app.log.1
        // app.log.1 -> app.log.2
        // app.log.4 -> deleted
    }
}
```

## Design Patterns

### 1. Singleton Pattern
```java
public class LoggerFactory {
    private static final Map<String, Logger> loggers = new ConcurrentHashMap<>();
    
    public static Logger getLogger(String name) {
        return loggers.computeIfAbsent(name, Logger::new);
    }
}
```

### 2. Chain of Responsibility
```java
abstract class Filter {
    protected Filter next;
    
    public void setNext(Filter next) { this.next = next; }
    
    public boolean filter(LogEvent event) {
        if (!doFilter(event)) return false;
        return next == null || next.filter(event);
    }
    
    protected abstract boolean doFilter(LogEvent event);
}
```

### 3. Builder Pattern
```java
Logger logger = Logger.builder()
    .name("com.app")
    .level(LogLevel.DEBUG)
    .addAppender(new ConsoleAppender())
    .addAppender(new FileAppender("app.log"))
    .formatter(new JsonFormatter())
    .async(true)
    .build();
```

## Source Code
📄 **[View Complete Source Code](/problems/loggingframework/CODE)**

## Usage Example
```java
Logger logger = LoggerFactory.getLogger("com.app.OrderService");

logger.debug("Processing order: {}", orderId);
logger.info("Order {} placed by user {}", orderId, userId);
logger.warn("Low inventory for product {}", productId);
logger.error("Payment failed for order {}", orderId, exception);

// MDC for request tracking
MDC.put("requestId", uuid);
logger.info("Request processed");
MDC.clear();
```

## Common Interview Questions

1. **How do you make logging thread-safe?**
   - Lock-free queue (ConcurrentLinkedQueue)
   - Single background thread for writes
   - Thread-local buffers

2. **How do you handle high-volume logging (1M logs/sec)?**
   - Asynchronous logging with queue
   - Log sampling (log 1 in 100)
   - Circuit breaker to prevent overflow

3. **How do you implement log levels efficiently?**
   - Compare integer values (DEBUG=100, INFO=200)
   - Early return if level < configured level
   - No string formatting if not logged

## Performance Optimizations

1. **Lazy Evaluation**
   ```java
   logger.debug(() -> "Expensive: " + expensiveOperation());
   // Only evaluates if DEBUG enabled
   ```

2. **Structured Logging**
   ```java
   logger.info("event", "order_placed",
               "orderId", orderId,
               "userId", userId,
               "amount", amount);
   ```

3. **Batching**
   ```java
   List<LogEvent> batch = new ArrayList<>();
   while (batch.size() < 100 && (event = queue.poll()) != null) {
       batch.add(event);
   }
   fileWriter.writeBatch(batch);
   ```

## Key Takeaways

### What Interviewers Look For
1. ✅ Thread-safe implementation
2. ✅ Configurable log levels
3. ✅ Multiple output destinations
4. ✅ Performance considerations
5. ✅ Log rotation strategy
6. ✅ Error handling

### Common Mistakes
1. ❌ Synchronous logging in critical path
2. ❌ String concatenation before level check
3. ❌ No log rotation (disk fills up)
4. ❌ Not handling appender failures
5. ❌ No buffering for I/O

### Production Checklist
- [x] Multiple log levels
- [x] Console and file appenders
- [x] Thread-safe operations
- [x] Configurable formatting
- [ ] Asynchronous logging
- [ ] Log rotation
- [ ] Structured logging
- [ ] MDC/Context support
- [ ] Performance monitoring

---

## Related Problems
- 📊 **Monitoring System** - Metrics collection
- 🔍 **Search Engine** - Log analysis
- 📈 **Analytics** - Log aggregation
- 🚨 **Alerting** - Log-based alerts

*Production-ready logging framework with thread-safety, multiple appenders, and performance optimizations. Essential for all software engineering interviews.*

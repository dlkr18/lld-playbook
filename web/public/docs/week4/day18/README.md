# Day 18: Logging & Metrics Library 📊

**Focus**: Design a production-ready logging library with MDC, multiple sinks, and backpressure handling.

---

## 🎯 **Learning Objectives**

By the end of Day 18, you will:
- **Design** a flexible logging API
- **Implement** MDC (Mapped Diagnostic Context)
- **Create** multiple log sinks (console, file, async)
- **Handle** backpressure in high-throughput scenarios

---

## 📚 **Logging API Design**

### **Logger Interface**

```java
public interface Logger {
    
    void trace(String message);
    void trace(String message, Object... args);
    void trace(String message, Throwable throwable);
    
    void debug(String message);
    void debug(String message, Object... args);
    void debug(String message, Throwable throwable);
    
    void info(String message);
    void info(String message, Object... args);
    void info(String message, Throwable throwable);
    
    void warn(String message);
    void warn(String message, Object... args);
    void warn(String message, Throwable throwable);
    
    void error(String message);
    void error(String message, Object... args);
    void error(String message, Throwable throwable);
    
    boolean isTraceEnabled();
    boolean isDebugEnabled();
    boolean isInfoEnabled();
    boolean isWarnEnabled();
    boolean isErrorEnabled();
}

public enum LogLevel {
    TRACE(0), DEBUG(1), INFO(2), WARN(3), ERROR(4), OFF(5);
    
    private final int severity;
    
    LogLevel(int severity) { this.severity = severity; }
    
    public boolean isEnabled(LogLevel threshold) {
        return this.severity >= threshold.severity;
    }
}
```

### **Log Event**

```java
public class LogEvent {
    private final Instant timestamp;
    private final LogLevel level;
    private final String loggerName;
    private final String message;
    private final Object[] arguments;
    private final Throwable throwable;
    private final String threadName;
    private final Map<String, String> mdc;
    
    public String getFormattedMessage() {
        if (arguments == null || arguments.length == 0) {
            return message;
        }
        // Simple placeholder replacement: {} → value
        return formatMessage(message, arguments);
    }
    
    private String formatMessage(String pattern, Object[] args) {
        StringBuilder result = new StringBuilder();
        int argIndex = 0;
        int i = 0;
        
        while (i < pattern.length()) {
            if (i < pattern.length() - 1 && 
                pattern.charAt(i) == '{' && 
                pattern.charAt(i + 1) == '}') {
                if (argIndex < args.length) {
                    result.append(args[argIndex++]);
                } else {
                    result.append("{}");
                }
                i += 2;
            } else {
                result.append(pattern.charAt(i));
                i++;
            }
        }
        
        return result.toString();
    }
}
```

---

## 🗂️ **MDC (Mapped Diagnostic Context)**

```java
public class MDC {
    
    private static final ThreadLocal<Map<String, String>> context = 
        ThreadLocal.withInitial(HashMap::new);
    
    public static void put(String key, String value) {
        context.get().put(key, value);
    }
    
    public static String get(String key) {
        return context.get().get(key);
    }
    
    public static void remove(String key) {
        context.get().remove(key);
    }
    
    public static void clear() {
        context.get().clear();
    }
    
    public static Map<String, String> getCopyOfContextMap() {
        return new HashMap<>(context.get());
    }
    
    public static void setContextMap(Map<String, String> contextMap) {
        context.set(new HashMap<>(contextMap));
    }
    
    // Auto-closeable for try-with-resources
    public static CloseableContext putCloseable(String key, String value) {
        String oldValue = context.get().put(key, value);
        return () -> {
            if (oldValue == null) {
                context.get().remove(key);
            } else {
                context.get().put(key, oldValue);
            }
        };
    }
    
    @FunctionalInterface
    public interface CloseableContext extends AutoCloseable {
        void close();
    }
}

// Usage
try (MDC.CloseableContext ctx = MDC.putCloseable("requestId", requestId)) {
    logger.info("Processing request");
    // All logs within this block will have requestId in MDC
}
```

---

## 📤 **Log Sinks (Appenders)**

```java
public interface LogSink {
    void append(LogEvent event);
    void flush();
    void close();
}

public class ConsoleLogSink implements LogSink {
    
    private final LogFormatter formatter;
    private final PrintStream out;
    private final PrintStream err;
    
    public ConsoleLogSink(LogFormatter formatter) {
        this.formatter = formatter;
        this.out = System.out;
        this.err = System.err;
    }
    
    @Override
    public void append(LogEvent event) {
        String formatted = formatter.format(event);
        PrintStream stream = event.getLevel().ordinal() >= LogLevel.WARN.ordinal() ? err : out;
        stream.println(formatted);
    }
    
    @Override
    public void flush() {
        out.flush();
        err.flush();
    }
    
    @Override
    public void close() {
        // Don't close System.out/err
    }
}

public class FileLogSink implements LogSink {
    
    private final LogFormatter formatter;
    private final Path logFile;
    private BufferedWriter writer;
    private final long maxFileSize;
    private final int maxBackups;
    private long currentSize;
    
    public FileLogSink(Path logFile, LogFormatter formatter, long maxFileSize, int maxBackups) {
        this.logFile = logFile;
        this.formatter = formatter;
        this.maxFileSize = maxFileSize;
        this.maxBackups = maxBackups;
        openWriter();
    }
    
    @Override
    public synchronized void append(LogEvent event) {
        try {
            String formatted = formatter.format(event) + System.lineSeparator();
            
            if (currentSize + formatted.length() > maxFileSize) {
                rotate();
            }
            
            writer.write(formatted);
            currentSize += formatted.length();
        } catch (IOException e) {
            System.err.println("Failed to write log: " + e.getMessage());
        }
    }
    
    private void rotate() throws IOException {
        writer.close();
        
        // Rotate existing backups
        for (int i = maxBackups - 1; i >= 1; i--) {
            Path from = getBackupPath(i);
            Path to = getBackupPath(i + 1);
            if (Files.exists(from)) {
                Files.move(from, to, StandardCopyOption.REPLACE_EXISTING);
            }
        }
        
        // Move current to backup 1
        Files.move(logFile, getBackupPath(1), StandardCopyOption.REPLACE_EXISTING);
        
        openWriter();
    }
    
    private Path getBackupPath(int index) {
        return logFile.resolveSibling(logFile.getFileName() + "." + index);
    }
    
    private void openWriter() {
        try {
            writer = Files.newBufferedWriter(logFile, 
                StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            currentSize = Files.exists(logFile) ? Files.size(logFile) : 0;
        } catch (IOException e) {
            throw new RuntimeException("Cannot open log file", e);
        }
    }
}
```

---

## 🔄 **Async Logging with Backpressure**

```java
public class AsyncLogSink implements LogSink {
    
    private final LogSink delegate;
    private final BlockingQueue<LogEvent> queue;
    private final Thread workerThread;
    private volatile boolean running = true;
    private final OverflowPolicy overflowPolicy;
    
    public enum OverflowPolicy {
        BLOCK,      // Block caller until space available
        DROP_OLD,   // Drop oldest events
        DROP_NEW    // Drop new events
    }
    
    public AsyncLogSink(LogSink delegate, int queueSize, OverflowPolicy policy) {
        this.delegate = delegate;
        this.queue = new ArrayBlockingQueue<>(queueSize);
        this.overflowPolicy = policy;
        this.workerThread = new Thread(this::processLoop, "async-log-worker");
        this.workerThread.setDaemon(true);
        this.workerThread.start();
    }
    
    @Override
    public void append(LogEvent event) {
        boolean added = false;
        
        switch (overflowPolicy) {
            case BLOCK:
                try {
                    queue.put(event);
                    added = true;
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                break;
                
            case DROP_NEW:
                added = queue.offer(event);
                if (!added) {
                    // Optionally log dropped event count
                }
                break;
                
            case DROP_OLD:
                while (!queue.offer(event)) {
                    queue.poll(); // Remove oldest
                }
                added = true;
                break;
        }
    }
    
    private void processLoop() {
        List<LogEvent> batch = new ArrayList<>();
        
        while (running || !queue.isEmpty()) {
            try {
                LogEvent event = queue.poll(100, TimeUnit.MILLISECONDS);
                if (event != null) {
                    batch.add(event);
                    queue.drainTo(batch, 99); // Batch up to 100 events
                    
                    for (LogEvent e : batch) {
                        delegate.append(e);
                    }
                    batch.clear();
                    delegate.flush();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
    
    @Override
    public void close() {
        running = false;
        try {
            workerThread.join(5000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        delegate.close();
    }
}
```

---

## 📐 **Log Formatters**

```java
public interface LogFormatter {
    String format(LogEvent event);
}

public class PatternLogFormatter implements LogFormatter {
    
    private final String pattern;
    // Pattern: %d{yyyy-MM-dd HH:mm:ss} [%t] %level %logger - %msg%n%ex
    
    @Override
    public String format(LogEvent event) {
        StringBuilder sb = new StringBuilder();
        
        // Timestamp
        sb.append(formatTimestamp(event.getTimestamp()));
        sb.append(" [").append(event.getThreadName()).append("] ");
        sb.append(String.format("%-5s", event.getLevel().name()));
        sb.append(" ").append(event.getLoggerName());
        sb.append(" - ").append(event.getFormattedMessage());
        
        // MDC
        if (!event.getMdc().isEmpty()) {
            sb.append(" ").append(event.getMdc());
        }
        
        // Exception
        if (event.getThrowable() != null) {
            sb.append(System.lineSeparator());
            StringWriter sw = new StringWriter();
            event.getThrowable().printStackTrace(new PrintWriter(sw));
            sb.append(sw.toString());
        }
        
        return sb.toString();
    }
}

public class JsonLogFormatter implements LogFormatter {
    
    private final ObjectMapper mapper = new ObjectMapper();
    
    @Override
    public String format(LogEvent event) {
        Map<String, Object> json = new LinkedHashMap<>();
        json.put("timestamp", event.getTimestamp().toString());
        json.put("level", event.getLevel().name());
        json.put("logger", event.getLoggerName());
        json.put("thread", event.getThreadName());
        json.put("message", event.getFormattedMessage());
        
        if (!event.getMdc().isEmpty()) {
            json.put("mdc", event.getMdc());
        }
        
        if (event.getThrowable() != null) {
            json.put("exception", formatException(event.getThrowable()));
        }
        
        try {
            return mapper.writeValueAsString(json);
        } catch (Exception e) {
            return "{\"error\":\"Failed to format log\"}";
        }
    }
}
```

---

## 🏭 **Logger Factory**

```java
public class LoggerFactory {
    
    private static final LoggerContext context = new LoggerContext();
    
    public static Logger getLogger(Class<?> clazz) {
        return getLogger(clazz.getName());
    }
    
    public static Logger getLogger(String name) {
        return context.getLogger(name);
    }
    
    public static void configure(LoggerConfiguration config) {
        context.configure(config);
    }
}

public class LoggerContext {
    
    private final Map<String, Logger> loggers = new ConcurrentHashMap<>();
    private LogLevel rootLevel = LogLevel.INFO;
    private final List<LogSink> sinks = new CopyOnWriteArrayList<>();
    
    public Logger getLogger(String name) {
        return loggers.computeIfAbsent(name, n -> new LoggerImpl(n, this));
    }
    
    void log(LogEvent event) {
        if (event.getLevel().isEnabled(rootLevel)) {
            for (LogSink sink : sinks) {
                sink.append(event);
            }
        }
    }
}
```

---

## 🎯 **Best Practices**

1. **Use placeholders**: `logger.info("User {} logged in", userId)` not concatenation
2. **Check level**: `if (logger.isDebugEnabled())` for expensive operations
3. **Include context**: Use MDC for request IDs, user IDs
4. **Async for production**: Avoid blocking on I/O
5. **Structured logging**: JSON for log aggregation systems

---

**Next**: [Day 19 - Review & Refactor](week4/day19/README.md) →

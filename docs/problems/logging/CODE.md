# Logging Library - Structured Logging 📝

Production-ready **logging library** with **multiple levels**, **structured logging**, **MDC (Mapped Diagnostic Context)**, and **async appenders**. Foundation for observability.

---

## 🎯 **Core Features**

✅ **Log Levels** - TRACE, DEBUG, INFO, WARN, ERROR  
✅ **Structured Logging** - JSON format  
✅ **MDC** - Request-scoped context  
✅ **Async Appenders** - Non-blocking I/O  
✅ **Multiple Outputs** - Console, File, Network  

---

## 💻 **Implementation**

```java
public class Logger {
    
    private final String name;
    private LogLevel level = LogLevel.INFO;
    private final List<Appender> appenders = new ArrayList<>();
    
    public void info(String message, Object... args) {
        log(LogLevel.INFO, message, args);
    }
    
    public void error(String message, Throwable t) {
        log(LogLevel.ERROR, message, t);
    }
    
    private void log(LogLevel level, String message, Object... args) {
        if (level.ordinal() < this.level.ordinal()) {
            return;  // Below configured level
        }
        
        LogEvent event = LogEvent.builder()
            .timestamp(Instant.now())
            .level(level)
            .logger(name)
            .message(format(message, args))
            .mdc(MDC.getContext())
            .build();
        
        for (Appender appender : appenders) {
            appender.append(event);
        }
    }
}

// MDC for request context
public class MDC {
    private static final ThreadLocal<Map<String, String>> context = 
        ThreadLocal.withInitial(HashMap::new);
    
    public static void put(String key, String value) {
        context.get().put(key, value);
    }
    
    public static void clear() {
        context.remove();
    }
    
    public static Map<String, String> getContext() {
        return new HashMap<>(context.get());
    }
}
```

---

## 🔗 **Related Resources**

- [Day 18: Logging/Metrics](week4/day18/README.md)

---

✨ **Production-grade logging with context tracking!** 📝


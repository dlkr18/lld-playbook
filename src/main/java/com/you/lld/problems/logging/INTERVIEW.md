# Logging Framework — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a mini log4j-style framework with log levels, appenders, formatters, filters, MDC, and async output.

---

## 1. Clarifying Questions

- Log levels? (TRACE → ERROR hierarchy.)
- Outputs? (Console, file, async wrapper.)
- Format? (Simple text, JSON.)
- Filtering? (Level threshold, keyword filter — chainable.)
- Logger hierarchy? (Named loggers via `LoggerFactory`.)
- Thread context? (`MDC` map snapshotted per event.)
- Performance? (Level check before building heavy messages; async appender queue.)

---

## 2. Functional Requirements

1. **Log at level** — trace/debug/info/warn/error methods.
2. **Level gating** — skip events below logger threshold.
3. **Appenders** — fan-out `LogEvent` to console/file/async.
4. **Formatters** — transform event to string (simple/JSON).
5. **Filters** — drop events matching filter rules before append.
6. **MDC** — attach contextual key-values to events.
7. **Runtime config** — add/remove appenders, change level.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Concurrency** | `volatile` level; `CopyOnWriteArrayList` appenders; per-appender sync |
| **Hot path** | Early level check; lazy message build |
| **Extensibility** | New appender/formatter/filter without changing `LoggerImpl` |
| **Async isolation** | `AsyncAppender` bounded queue + worker thread |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `Logger` | service | API | log methods, level, appenders |
| `LoggerImpl` | impl | Core logger | Fan-out to appenders |
| `LoggerFactory` | service | Registry | Named logger singletons |
| `LogEvent` | model | Immutable event | Level, message, timestamp, MDC snapshot |
| `LogLevel` | model | Enum | Ordered severity |
| `LogAppender` | service | Output sink | `append(LogEvent)` |
| `AbstractAppender` | impl | Base appender | Filter + formatter pipeline |
| `ConsoleAppender` / `FileAppender` | impl | Sync sinks | Formatted write |
| `AsyncAppender` | impl | Decorator | Queue + background flush |
| `LogFormatter` | service | Serialization | Simple, JSON |
| `LogFilter` | service | Chain link | LevelFilter, KeywordFilter |
| `MDC` | model | Thread context | ThreadLocal map |

---

## 5. Relationships

- `LoggerFactory` **creates/caches** `LoggerImpl` by name.
- `LoggerImpl` **owns** list of `LogAppender`; builds `LogEvent` from `MDC`.
- `AbstractAppender` **uses** `LogFormatter` and optional `LogFilter` chain.
- `AsyncAppender` **wraps** another appender — producer/consumer pattern.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **Chain of Responsibility** (`LogFilter`) | Compose level + keyword filters without subclass explosion |
| **Strategy** (`LogFormatter`, `LogAppender`) | Swap JSON vs text, file vs console |
| **Decorator** (`AsyncAppender`) | Add async without duplicating console/file logic |
| **Singleton** (`LoggerFactory` registry) | One logger instance per name — standard logging semantics |

---

## 7. Key Implementation Details

### 7.1 Hot path in LoggerImpl

```text
if (level < eventLevel) return;
LogEvent e = new LogEvent(..., MDC.getCopy());
for (appender : appenders) appender.append(e);
```

### 7.2 CopyOnWriteArrayList for appenders

Reads on log() path lock-free; rare addAppender copies array — acceptable for config changes.

### 7.3 AsyncAppender

Bounded queue; on full drop or block policy; worker drains to delegate appender — isolates I/O latency from caller thread.

---

## 8. Likely Follow-Up Q&A

**Q: Logger parent hierarchy inheritance?**  
A: Factory can resolve effective level from parent name prefix — extension on `LoggerFactory`.

**Q: Structured logging?**  
A: `JsonFormatter` + fields on `LogEvent`; MDC for traceId.

**Q: File rotation?**  
A: RollingFileAppender with size/date policy — new class.

**Q: Thread-safe MDC?**  
A: ThreadLocal; snapshot at log time for async correctness.

**Q: Why not singleton Logger?**  
A: Per-class loggers enable fine-grained level config.

**Q: Performance of level check?**  
A: Integer compare on enum ordinal — nanoseconds.

**Q: Distributed tracing?**  
A: MDC carries spanId; appenders forward to OpenTelemetry.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| CopyOnWrite appenders | Fast log(); slow reconfiguration |
| Sync file append | Simple; contended lock under high QPS |
| Async queue | Better throughput; risk of loss on crash |
| Custom framework | Learning value; prod uses SLF4J + Logback |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.logging.LoggingDemo"`

# Logging Framework — LLD

Log levels, appenders, formatters, filters — mini log4j/slf4j.

## Patterns

| Pattern | Why |
|---------|-----|
| **Chain of Responsibility** | Level filters |
| **Strategy** | Console / file / async appenders |
| **Singleton** | LogManager registry |

## Run

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.logging.LoggingDemo"
```

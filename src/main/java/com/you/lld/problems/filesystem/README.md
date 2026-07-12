# File System — LLD

In-memory file/directory tree with path normalization and concurrent access.

## Patterns

| Pattern | Why |
|---------|-----|
| **Composite** | File and Directory implement common FSNode |
| **ReadWriteLock** | Concurrent reads, exclusive writes on tree |

## Run

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.filesystem.FileSystemDemo"
```

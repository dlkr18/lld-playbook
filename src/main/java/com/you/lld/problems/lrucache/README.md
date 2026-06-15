# LRU Cache — LLD

O(1) get/put cache with eviction strategies and optional decorators.

## Patterns

| Pattern | Why |
|---------|-----|
| **Strategy** | LRU / LFU / FIFO / TTL eviction |
| **Decorator** | Concurrent wrapper, TTL overlay, logging listener |

## Run

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.lrucache.LRUCacheDemo"
```

## Key Detail

HashMap + doubly linked list for O(1) touch and eviction.

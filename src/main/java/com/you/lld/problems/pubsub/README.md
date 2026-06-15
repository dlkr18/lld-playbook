# Pub/Sub — LLD

Topic-based message broker with push/pull delivery and subscriber fan-out.

## Patterns

| Pattern | Why |
|---------|-----|
| **Observer** | Subscribers notified on publish |
| **Strategy** | Push vs pull delivery |

## Run

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.pubsub.PubSubDemo"
```

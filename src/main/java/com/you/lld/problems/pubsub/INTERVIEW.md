# Pub/Sub — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a topic-based message broker with subscriber registration, publish fan-out, and push vs pull delivery modes.

---

## 1. Clarifying Questions

- Delivery model? (Push immediate vs pull on demand.)
- Topics? (Named channels; multiple subscribers per topic.)
- Message format? (Opaque payload + metadata in `Message`.)
- Subscription lifecycle? (Subscribe, unsubscribe, list.)
- Ordering? (Per-topic FIFO in single-process demo.)
- Durability? (In-memory only — mention Kafka persistence follow-up.)
- Error handling? (Handler exceptions logged; no retry in baseline.)

---

## 2. Functional Requirements

1. **Create topic** — register named `Topic`.
2. **Subscribe** — attach `MessageHandler` to topic (push or pull mode).
3. **Publish** — deliver message to all subscribers on topic.
4. **Pull** — subscriber fetches pending messages (pull mode).
5. **Unsubscribe** — remove subscription by ID.
6. **List topics/subscriptions** — introspection for admin.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Decoupling** | Publishers don't know subscribers — Observer fan-out |
| **Extensibility** | `PubSubService` interface; swap in-memory vs distributed |
| **Thread-safety** | Concurrent topic and subscription maps |
| **Delivery choice** | Strategy per subscription — push vs pull |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `Topic` | model | Channel | Name, subscription list |
| `Subscription` | model | Consumer binding | ID, handler, delivery mode |
| `Message` | model | Payload | ID, topic, body, timestamp |
| `MessageHandler` | model | Callback | `onMessage(Message)` |
| `PubSubService` | service | API | createTopic, subscribe, publish, pull |
| `InMemoryPubSubService` | impl | Broker | HashMap topics; fan-out on publish |

---

## 5. Relationships

- `Topic` **aggregates** `Subscription` instances.
- `InMemoryPubSubService` **owns** topic name → `Topic` map.
- **Publish** iterates subscriptions — push calls handler immediately; pull enqueues per subscription queue.
- `MessageHandler` **implemented by** client/demo consumers.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **Observer** (handlers on publish) | Classic pub/sub decoupling |
| **Strategy** (push vs pull delivery) | Per-subscriber delivery preference without broker fork |

---

## 7. Key Implementation Details

### 7.1 Push delivery

On `publish(topic, msg)`: for each subscription with PUSH mode, invoke `handler.onMessage(msg)` synchronously in caller thread.

### 7.2 Pull delivery

Messages appended to per-subscription queue; `pull(subscriptionId)` drains batch.

### 7.3 Topic isolation

Unknown topic on publish throws `TopicNotFoundException` — explicit failure vs silent drop.

---

## 8. Likely Follow-Up Q&A

**Q: At-least-once delivery?**  
A: Ack + retry queue; idempotent handlers.

**Q: Ordering guarantees?**  
A: Single partition FIFO; Kafka partition key for scale.

**Q: Slow subscriber?**  
A: Async executor per handler or backpressure queue with max size.

**Q: Fan-out scale?**  
A: Shard topics; dedicated consumer groups.

**Q: Dead letter queue?**  
A: After N failures route to DLQ topic.

**Q: Persistence?**  
A: Append-only log (Kafka model) before ack to publisher.

**Q: Filtered subscriptions?**  
A: Subscription carries predicate on message attributes.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| In-memory | Fast; no survival across restarts |
| Sync push | Simple; subscriber slowness blocks publisher |
| Pull mode | Consumer-paced; higher latency |
| Topic-per-entity | Clear boundaries; topic explosion risk |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.pubsub.PubSubDemo"`

# Notification Service — SDE2/SDE3 Interview Walkthrough

**Problem:** Design a multi-channel notification system (Email, SMS, Push, In-App) with priority queuing, templates, and retry with exponential backoff.

---

## 1. Clarifying Questions

- Channels? (Email, SMS, Push, In-App.)
- Priority levels? (URGENT dequeued before LOW.)
- Retry policy? (Max 3 attempts, exponential backoff.)
- Multi-channel send? (One API fans out to N channels.)
- Templates? (Registry maps template ID → formatted body.)
- Delivery guarantee? (At-least-once with retry; no exactly-once in demo.)
- Status tracking? (PENDING → SENT / FAILED per notification ID.)

---

## 2. Functional Requirements

1. **Send** — enqueue single notification with channel + payload.
2. **Multi-channel** — duplicate event to Email + SMS + Push in one call.
3. **Templated send** — resolve template, merge variables.
4. **Priority queue** — worker processes higher priority first.
5. **Per-channel delivery** — validate → format → deliver pipeline.
6. **Retry failed** — re-queue with backoff delay.
7. **Status query** — lookup by notification ID.

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Concurrency** | `PriorityBlockingQueue`; `ConcurrentHashMap` status registry |
| **Reliability** | Retry with cap; mark FAILED after exhaustion |
| **Extensibility** | New channel = new `ChannelSender` + factory registration |
| **Isolation** | Channel failures don't block other channels in multi-send |

---

## 4. Core Entities

| Class | Layer | Purpose | Internal Summary |
|-------|-------|---------|------------------|
| `Notification` | model | Message unit | ID, channel, body, priority, status |
| `NotificationChannel` / `Priority` | model | Enums | Channel type, urgency |
| `NotificationService` | service | API | send, multi-send, retryFailed |
| `NotificationServiceImpl` | impl | Queue worker | PriorityBlockingQueue + executor |
| `ChannelSender` | service | Delivery contract | channel(), send() |
| `AbstractChannelSender` | impl | Template Method | validate → format → deliver |
| `EmailChannelSender` / `SmsChannelSender` / etc. | impl | Channels | Channel-specific deliver() |
| `ChannelSenderFactory` | impl | Factory | Enum → sender instance |
| `NotificationTemplateRegistry` | impl | Templates | ID → template strings |
| `RetryPolicy` | retry | Backoff | baseDelay × 2^attempt |
| `NotificationGateway` | orchestrator | Facade | Public demo API |

---

## 5. Relationships

- `NotificationGateway` **delegates** to `NotificationServiceImpl`.
- Service **enqueues** `Notification` and **dispatches** via `ChannelSenderFactory`.
- `AbstractChannelSender` **implements** shared pipeline; subclasses override `deliver()`.
- `RetryPolicy` **used by** service on delivery failure.

---

## 6. Design Patterns

| Pattern | Why over alternatives |
|---------|----------------------|
| **Template Method** (`AbstractChannelSender`) | Shared validation/format; channel-specific deliver only |
| **Strategy** (`ChannelSender`) | Mock vs real SMTP/FCM per channel |
| **Factory** (`ChannelSenderFactory`) | Central mapping from enum to impl |
| **Composite fan-out** (`sendMultiChannel`) | One event → N queue entries without duplicating queue logic |

---

## 7. Key Implementation Details

### 7.1 PriorityBlockingQueue

Notifications ordered by `Priority` ordinal — URGENT processed before LOW without manual wait/notify.

### 7.2 Template Method pipeline

`send()` is final in abstract base: `validate()` → `formatMessage()` → `deliver()` — SMS truncates 160 chars in format step.

### 7.3 Exponential backoff

`getDelayForAttempt(n) = baseDelayMs * (1 << n)`; re-schedule or sleep before retry; after max → FAILED status.

---

## 8. Likely Follow-Up Q&A

**Q: Exactly-once delivery?**  
A: Idempotency keys at provider + dedup store; hard across channels.

**Q: Rate limits per channel?**  
A: Token bucket per channel sender before deliver().

**Q: Bulk send?**  
A: Batch dequeue; provider batch APIs.

**Q: User preferences?**  
A: Filter channels before fan-out — opt-out registry.

**Q: DLQ?**  
A: Move to dead letter after max retries for manual replay.

**Q: Scheduled send?**  
A: Delay queue keyed by `scheduledAt`.

**Q: Template i18n?**  
A: Template registry per locale key.

---

## 9. Trade-offs & Alternatives

| Choice | Trade-off |
|--------|-----------|
| In-process queue | Simple; Redis/SQS for multi-node |
| Sync deliver in worker | Backpressure visible; async provider SDK in prod |
| Per-channel retry | Resilient; duplicate user alerts if one channel succeeds |
| Template Method | Inheritance; composition alternative for pipeline steps |

**Demo:** `mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.notification.NotificationDemo"`

# Notification System

## Overview
A multi-channel notification delivery system supporting email, SMS, push notifications, and in-app messages. Handles millions of notifications per day with prioritization, rate limiting, retry logic, and delivery guarantees.

**Difficulty:** Hard  
**Domain:** Messaging, Distributed Systems  
**Interview Frequency:** High (Facebook, LinkedIn, Slack, WhatsApp)

## Requirements

### Functional Requirements
1. **Multi-Channel**: Email, SMS, Push, In-App, Webhook
2. **Delivery**: Immediate, Scheduled, Batched
3. **Prioritization**: Critical, High, Medium, Low
4. **Templates**: Customizable message templates
5. **User Preferences**: Channel preferences, quiet hours
6. **Tracking**: Delivery status, read receipts, clicks

### Non-Functional Requirements
1. **Scalability**: 10M+ notifications/hour
2. **Reliability**: 99.9% delivery rate
3. **Performance**: Send < 100ms, deliver < 5s
4. **Fault Tolerance**: Retry failed deliveries
5. **Rate Limiting**: Per user, per channel

## System Design

### Notification Types
```
- Transactional: Order confirmation, password reset
- Promotional: Marketing campaigns, announcements
- System: Alerts, warnings, reminders
- Social: Likes, comments, mentions
```

### Architecture
```
Producer → Queue (Kafka) → Workers → Channels → Users
                              ↓
                          Priority Queue
                              ↓
                        Rate Limiter
                              ↓
                        Retry Handler
```

### Key Algorithms

#### 1. Priority Queue Processing
```java
public class NotificationProcessor {
    private PriorityQueue<Notification> queue = new PriorityQueue<>(
        (a, b) -> b.getPriority().getValue() - a.getPriority().getValue()
    );
    
    public void process() {
        while (true) {
            Notification notif = queue.poll();
            if (notif != null) {
                send(notif);
            }
        }
    }
}
```

**Time Complexity:** O(log N) per notification  
**Space Complexity:** O(N)

#### 2. Exponential Backoff Retry
```java
public class RetryHandler {
    private static final int MAX_RETRIES = 3;
    private static final long INITIAL_DELAY = 1000; // 1s
    
    public void sendWithRetry(Notification notif) {
        int attempt = 0;
        while (attempt < MAX_RETRIES) {
            try {
                send(notif);
                return;
            } catch (Exception e) {
                attempt++;
                long delay = INITIAL_DELAY * (long)Math.pow(2, attempt);
                Thread.sleep(delay);
            }
        }
        // Move to dead letter queue
        dlq.add(notif);
    }
}
```

#### 3. Rate Limiting (Token Bucket)
```java
public class NotificationRateLimiter {
    private Map<String, TokenBucket> userBuckets = new HashMap<>();
    
    public boolean allowSend(String userId, NotificationChannel channel) {
        TokenBucket bucket = userBuckets.computeIfAbsent(
            userId + ":" + channel,
            k -> new TokenBucket(10, Duration.ofMinutes(1))
        );
        return bucket.tryConsume();
    }
}
```

## Design Patterns

### 1. Strategy Pattern (Channel Selection)
```java
interface NotificationChannel {
    void send(Notification notification);
}

class EmailChannel implements NotificationChannel {
    public void send(Notification n) { /* Send email */ }
}

class SMSChannel implements NotificationChannel {
    public void send(Notification n) { /* Send SMS */ }
}

class PushChannel implements NotificationChannel {
    public void send(Notification n) { /* Send push */ }
}
```

### 2. Template Method Pattern
```java
abstract class NotificationSender {
    public final void send(Notification n) {
        validate(n);
        format(n);
        deliver(n);
        track(n);
    }
    
    protected abstract void deliver(Notification n);
}
```

### 3. Observer Pattern (Delivery Status)
```java
interface DeliveryObserver {
    void onSent(Notification n);
    void onDelivered(Notification n);
    void onFailed(Notification n);
}
```

## Source Code
📄 **[View Complete Source Code](/problems/notification/CODE)**

## Usage Example
```java
NotificationService service = new NotificationServiceImpl();

// Send email
Notification email = Notification.builder()
    .userId("user123")
    .channel(NotificationChannel.EMAIL)
    .subject("Order Confirmation")
    .body("Your order #12345 has been confirmed")
    .priority(Priority.HIGH)
    .build();
    
service.send(email);

// Send push notification
Notification push = Notification.builder()
    .userId("user123")
    .channel(NotificationChannel.PUSH)
    .title("New Message")
    .body("You have a new message from John")
    .build();
    
service.send(push);

// Schedule notification
service.schedule(notification, LocalDateTime.now().plusHours(1));

// Get delivery status
DeliveryStatus status = service.getStatus(notification.getId());
```

## Common Interview Questions

1. **How do you handle millions of notifications per hour?**
   - Message queue (Kafka, RabbitMQ)
   - Worker pool (1000+ workers)
   - Batch processing
   - Async delivery

2. **How do you ensure delivery?**
   - At-least-once semantics
   - Retry with exponential backoff
   - Dead letter queue
   - Delivery confirmation tracking

3. **How do you prevent spam?**
   - Rate limiting per user
   - Opt-out/unsubscribe
   - Quiet hours respect
   - Preference center

4. **How do you prioritize notifications?**
   - Priority queue (4 levels)
   - Separate queues per priority
   - SLA-based processing

## Key Takeaways

### What Interviewers Look For
1. ✅ Multi-channel support
2. ✅ Scalability architecture
3. ✅ Retry logic
4. ✅ Rate limiting
5. ✅ Priority handling
6. ✅ Delivery tracking

### Common Mistakes
1. ❌ Synchronous sending (blocks)
2. ❌ No retry mechanism
3. ❌ Single point of failure
4. ❌ No rate limiting
5. ❌ Ignoring user preferences
6. ❌ No delivery tracking

### Production Checklist
- [x] Multi-channel delivery
- [x] Priority queue
- [x] Message templating
- [ ] Kafka integration
- [ ] Retry with backoff
- [ ] Rate limiting
- [ ] Delivery tracking
- [ ] User preferences
- [ ] Analytics dashboard

---

## Related Problems
- 📧 **Email Service** - Email delivery
- 💬 **Chat System** - Real-time messaging
- 🔔 **Push Notifications** - Mobile delivery
- 📱 **SMS Gateway** - SMS delivery

*Production-ready notification system with multi-channel delivery, priority queue, and retry logic. Critical for user engagement platforms.*

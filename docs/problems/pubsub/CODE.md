# pubsub - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/pubsub/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py pubsub`.

## Project Structure (9 files)

```
pubsub/
├── PubSubDemo.java
├── api/PubSubService.java
├── model/Message.java
├── model/MessageHandler.java
├── model/Subscription.java
├── model/Topic.java
├── impl/InMemoryPubSubService.java
├── exceptions/SubscriptionNotFoundException.java
├── exceptions/TopicNotFoundException.java
```

## Source Code

### `PubSubDemo.java`

<details>
<summary>Click to view PubSubDemo.java</summary>

```java
package com.you.lld.problems.pubsub;

import com.you.lld.problems.pubsub.api.PubSubService;
import com.you.lld.problems.pubsub.exceptions.SubscriptionNotFoundException;
import com.you.lld.problems.pubsub.exceptions.TopicNotFoundException;
import com.you.lld.problems.pubsub.impl.InMemoryPubSubService;
import com.you.lld.problems.pubsub.model.Message;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * End-to-end demo of the Pub/Sub system exercising:
 *
 *   1. Topic management       -- create, delete
 *   2. Observer pattern (push) -- MessageHandler callback on publish
 *   3. Pull consumption       -- poll inbox + ack
 *   4. Fan-out                -- one publish reaches all subscribers
 *   5. Unsubscribe            -- no more deliveries after unsub
 *   6. Message attributes     -- key-value metadata on messages
 *   7. Error handling         -- TopicNotFoundException, SubscriptionNotFoundException
 *   8. Concurrent publish     -- multiple threads publishing simultaneously
 *   9. Graceful shutdown      -- push executor drained
 */
public class PubSubDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("========================================");
        System.out.println("  Pub/Sub System -- Full LLD Demo");
        System.out.println("========================================\n");

        InMemoryPubSubService service = new InMemoryPubSubService();

        demoTopicAndSubscribe(service);
        demoFanOutPublish(service);
        demoPullAndAck(service);
        demoPushObserver(service);
        demoUnsubscribe(service);
        demoMessageAttributes(service);
        demoErrorHandling(service);
        demoConcurrentPublish(service);
        demoDeleteTopic(service);

        service.shutdown();

        System.out.println("========================================");
        System.out.println("  All demos completed.");
        System.out.println("========================================");
    }

    // ──────────── 1. Topics & Subscribe ────────────

    static String pullSubId;
    static String pushSubId;
    static String billingSubId;

    private static void demoTopicAndSubscribe(PubSubService service) {
        System.out.println("--- Demo 1: Topic Creation & Subscription ---\n");
        service.createTopic("orders");
        service.createTopic("notifications");

        pullSubId = service.subscribe("orders", "warehouse-service");
        billingSubId = service.subscribe("orders", "billing-service");
        System.out.println();
    }

    // ──────────── 2. Fan-out publish ────────────

    private static void demoFanOutPublish(PubSubService service) {
        System.out.println("--- Demo 2: Fan-out Publish ---\n");
        service.publish("orders", new Message("m1", "New order: ORD-1001"));
        service.publish("orders", new Message("m2", "New order: ORD-1002"));

        List<Message> warehouseInbox = service.pull(pullSubId);
        List<Message> billingInbox = service.pull(billingSubId);
        System.out.println("warehouse-service inbox: " + warehouseInbox.size() + " messages");
        System.out.println("billing-service inbox:   " + billingInbox.size() + " messages");
        for (Message m : warehouseInbox) {
            System.out.println("  " + m);
        }
        System.out.println();
    }

    // ──────────── 3. Pull & Ack ────────────

    private static void demoPullAndAck(PubSubService service) {
        System.out.println("--- Demo 3: Pull & Acknowledge ---\n");

        System.out.println("Before ack: " + service.pull(pullSubId).size() + " pending");
        service.acknowledge(pullSubId, "m1");
        System.out.println("Acked m1 -> " + service.pull(pullSubId).size() + " pending");
        service.acknowledge(pullSubId, "m2");
        System.out.println("Acked m2 -> " + service.pull(pullSubId).size() + " pending");
        System.out.println();
    }

    // ──────────── 4. Push (Observer pattern) ────────────

    private static void demoPushObserver(PubSubService service) throws InterruptedException {
        System.out.println("--- Demo 4: Push Delivery (Observer Pattern) ---\n");

        pushSubId = service.subscribe("notifications", "email-service",
            (subId, msg) -> System.out.println("  [PUSH -> email-service] " + msg.getContent()));

        service.publish("notifications", new Message("m3", "Welcome user-42!"));
        service.publish("notifications", new Message("m4", "Password reset for user-99"));

        Thread.sleep(200);
        System.out.println();
    }

    // ──────────── 5. Unsubscribe ────────────

    private static void demoUnsubscribe(PubSubService service) {
        System.out.println("--- Demo 5: Unsubscribe ---\n");

        service.unsubscribe(billingSubId);
        service.publish("orders", new Message("m5", "New order: ORD-1003"));

        try {
            service.pull(billingSubId);
        } catch (SubscriptionNotFoundException e) {
            System.out.println("billing-service pull after unsub: " + e.getMessage());
        }

        List<Message> warehouse = service.pull(pullSubId);
        System.out.println("warehouse-service still receives: " + warehouse.size() + " pending (m5)");
        service.acknowledge(pullSubId, "m5");
        System.out.println();
    }

    // ──────────── 6. Message attributes ────────────

    private static void demoMessageAttributes(PubSubService service) {
        System.out.println("--- Demo 6: Message Attributes ---\n");

        Map<String, String> attrs = new HashMap<>();
        attrs.put("orderId", "ORD-1001");
        attrs.put("carrier", "FedEx");
        attrs.put("tracking", "FX123456");
        Message rich = new Message("m6", "Order shipped", attrs);
        service.publish("orders", rich);

        List<Message> msgs = service.pull(pullSubId);
        Message last = msgs.get(msgs.size() - 1);
        System.out.println("Message: " + last.getContent());
        System.out.println("Attributes: " + last.getAttributes());
        service.acknowledge(pullSubId, "m6");
        System.out.println();
    }

    // ──────────── 7. Error handling ────────────

    private static void demoErrorHandling(PubSubService service) {
        System.out.println("--- Demo 7: Error Handling ---\n");

        try {
            service.publish("nonexistent", new Message("x", "test"));
        } catch (TopicNotFoundException e) {
            System.out.println("Publish to missing topic: " + e.getMessage());
        }

        try {
            service.subscribe("nonexistent", "someone");
        } catch (TopicNotFoundException e) {
            System.out.println("Subscribe to missing topic: " + e.getMessage());
        }

        try {
            service.pull("SUB-999");
        } catch (SubscriptionNotFoundException e) {
            System.out.println("Pull from missing sub: " + e.getMessage());
        }

        try {
            service.createTopic("orders");
        } catch (IllegalStateException e) {
            System.out.println("Duplicate topic: " + e.getMessage());
        }
        System.out.println();
    }

    // ──────────── 8. Concurrent publish ────────────

    private static void demoConcurrentPublish(PubSubService service) throws InterruptedException {
        System.out.println("--- Demo 8: Concurrent Publish ---\n");

        service.createTopic("events");
        String concSubId = service.subscribe("events", "analytics-service");

        Thread[] threads = new Thread[5];
        for (int i = 0; i < 5; i++) {
            final int idx = i;
            threads[i] = new Thread(() ->
                service.publish("events", new Message("ev-" + idx, "Event from thread-" + idx)));
        }
        for (Thread t : threads) t.start();
        for (Thread t : threads) {
            t.join();
        }

        List<Message> events = service.pull(concSubId);
        System.out.println("analytics-service received " + events.size() + " events from 5 threads:");
        for (Message m : events) {
            System.out.println("  " + m);
        }
        System.out.println();
    }

    // ──────────── 9. Delete topic ────────────

    private static void demoDeleteTopic(PubSubService service) {
        System.out.println("--- Demo 9: Delete Topic ---\n");

        service.deleteTopic("notifications");

        try {
            service.publish("notifications", new Message("x", "after delete"));
        } catch (TopicNotFoundException e) {
            System.out.println("Publish after delete: " + e.getMessage());
        }
        System.out.println();
    }
}
```

</details>

### `api/PubSubService.java`

<details>
<summary>Click to view api/PubSubService.java</summary>

```java
package com.you.lld.problems.pubsub.api;

import com.you.lld.problems.pubsub.model.Message;
import com.you.lld.problems.pubsub.model.MessageHandler;

import java.util.List;

/**
 * Pub/Sub messaging service API.
 *
 * Patterns:
 *   Observer  -- push subscribers provide a MessageHandler (callback)
 *   Fan-out   -- one publish delivers to all topic subscriptions
 *   Pull      -- subscribers without a handler poll via {@link #pull}
 *   Ack       -- messages stay in the inbox until acknowledged
 *
 * Exceptions are thrown for missing topics/subscriptions instead of
 * silent boolean/null returns so callers can distinguish "not found"
 * from "nothing to do".
 */
public interface PubSubService {

    void createTopic(String topicName);
    void deleteTopic(String topicName);

    /** Publish a message to all subscriptions on a topic. */
    void publish(String topicName, Message message);

    /** Subscribe with push delivery (Observer pattern). */
    String subscribe(String topicName, String subscriberId, MessageHandler handler);

    /** Subscribe for pull-only consumption (no push callback). */
    String subscribe(String topicName, String subscriberId);

    void unsubscribe(String subscriptionId);

    /** Pull pending messages for a subscription (non-destructive peek). */
    List<Message> pull(String subscriptionId);

    /** Acknowledge and remove a message from the subscription inbox. */
    void acknowledge(String subscriptionId, String messageId);

    void shutdown();
}
```

</details>

### `model/Message.java`

<details>
<summary>Click to view model/Message.java</summary>

```java
package com.you.lld.problems.pubsub.model;

import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Immutable message published to a topic.
 * Shared by reference across subscriber queues (safe because immutable).
 */
public final class Message {

    private final String id;
    private final String content;
    private final Map<String, String> attributes;
    private final Instant timestamp;

    public Message(String id, String content) {
        this(id, content, Collections.emptyMap());
    }

    public Message(String id, String content, Map<String, String> attributes) {
        if (id == null || id.trim().isEmpty()) throw new IllegalArgumentException("Message id required");
        if (content == null)            throw new IllegalArgumentException("Content required");
        this.id = id;
        this.content = content;
        this.attributes = Collections.unmodifiableMap(new HashMap<>(attributes));
        this.timestamp = Instant.now();
    }

    public String getId()                     { return id; }
    public String getContent()                { return content; }
    public Map<String, String> getAttributes(){ return attributes; }
    public Instant getTimestamp()              { return timestamp; }

    @Override
    public String toString() {
        return String.format("Message{id='%s', content='%s'}", id, content);
    }
}
```

</details>

### `model/MessageHandler.java`

<details>
<summary>Click to view model/MessageHandler.java</summary>

```java
package com.you.lld.problems.pubsub.model;

/**
 * Observer interface for push-based message delivery.
 *
 * Subscribers provide a MessageHandler when subscribing to a topic.
 * On publish, the service fans out and invokes each handler asynchronously.
 * Pull-only subscribers can subscribe without a handler and poll instead.
 */
@FunctionalInterface
public interface MessageHandler {
    void onMessage(String subscriptionId, Message message);
}
```

</details>

### `model/Subscription.java`

<details>
<summary>Click to view model/Subscription.java</summary>

```java
package com.you.lld.problems.pubsub.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * A subscription binds a subscriber to a topic.
 *
 * Each subscription has:
 *   - An inbox queue (per-subscriber fan-out buffer)
 *   - An optional MessageHandler for push delivery (Observer pattern)
 *   - Pull consumers read from the inbox and ack messages
 *
 * Thread safety: inbox is a ConcurrentLinkedQueue; the service
 * synchronizes higher-level operations that span multiple fields.
 */
public class Subscription {

    private final String id;
    private final String topicName;
    private final String subscriberId;
    private final MessageHandler handler;    // null for pull-only subscribers
    private final Instant createdAt;
    private final Queue<Message> inbox = new ConcurrentLinkedQueue<>();

    public Subscription(String id, String topicName, String subscriberId, MessageHandler handler) {
        this.id = id;
        this.topicName = topicName;
        this.subscriberId = subscriberId;
        this.handler = handler;
        this.createdAt = Instant.now();
    }

    public String getId()            { return id; }
    public String getTopicName()     { return topicName; }
    public String getSubscriberId()  { return subscriberId; }
    public MessageHandler getHandler() { return handler; }
    public Instant getCreatedAt()    { return createdAt; }
    public boolean hasPushHandler()  { return handler != null; }

    public void enqueue(Message message) {
        inbox.offer(message);
    }

    public List<Message> peekAll() {
        return new ArrayList<>(inbox);
    }

    public boolean ack(String messageId) {
        return inbox.removeIf(m -> m.getId().equals(messageId));
    }

    public int pendingCount() {
        return inbox.size();
    }

    @Override
    public String toString() {
        return String.format("Subscription{id='%s', topic='%s', subscriber='%s', pending=%d}",
            id, topicName, subscriberId, inbox.size());
    }
}
```

</details>

### `model/Topic.java`

<details>
<summary>Click to view model/Topic.java</summary>

```java
package com.you.lld.problems.pubsub.model;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * A named topic that holds the set of active subscription IDs.
 * Thread-safe via ConcurrentHashMap-backed key set.
 */
public class Topic {

    private final String name;
    private final Set<String> subscriptionIds = ConcurrentHashMap.newKeySet();

    public Topic(String name) {
        if (name == null || name.trim().isEmpty()) throw new IllegalArgumentException("Topic name required");
        this.name = name;
    }

    public String getName()                        { return name; }
    public Set<String> getSubscriptionIds()        { return subscriptionIds; }
    public void addSubscription(String subId)      { subscriptionIds.add(subId); }
    public void removeSubscription(String subId)   { subscriptionIds.remove(subId); }

    @Override
    public String toString() {
        return String.format("Topic{name='%s', subscribers=%d}", name, subscriptionIds.size());
    }
}
```

</details>

### `impl/InMemoryPubSubService.java`

<details>
<summary>Click to view impl/InMemoryPubSubService.java</summary>

```java
package com.you.lld.problems.pubsub.impl;

import com.you.lld.problems.pubsub.api.PubSubService;
import com.you.lld.problems.pubsub.exceptions.SubscriptionNotFoundException;
import com.you.lld.problems.pubsub.exceptions.TopicNotFoundException;
import com.you.lld.problems.pubsub.model.Message;
import com.you.lld.problems.pubsub.model.MessageHandler;
import com.you.lld.problems.pubsub.model.Subscription;
import com.you.lld.problems.pubsub.model.Topic;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Thread-safe in-memory Pub/Sub implementation.
 *
 * Patterns:
 *   Observer   -- push subscribers get MessageHandler.onMessage() invoked
 *                 asynchronously via a thread pool on each publish.
 *   Fan-out    -- publish delivers to EVERY subscription on the topic.
 *   Pull       -- subscribers without a handler poll via pull() and ack.
 *   Per-sub queue -- each Subscription has its own ConcurrentLinkedQueue
 *                    inbox, so one slow consumer doesn't block others.
 *
 * Concurrency:
 *   - ConcurrentHashMap for topics and subscriptions.
 *   - Topic.subscriptionIds is a ConcurrentHashMap.newKeySet().
 *   - Subscription.inbox is a ConcurrentLinkedQueue.
 *   - Push delivery happens on a dedicated thread pool (non-blocking publish).
 */
public class InMemoryPubSubService implements PubSubService {

    private final Map<String, Topic> topics = new ConcurrentHashMap<>();
    private final Map<String, Subscription> subscriptions = new ConcurrentHashMap<>();
    private final AtomicLong subIdGen = new AtomicLong(0);
    private final ExecutorService pushExecutor;

    public InMemoryPubSubService() {
        this(4);
    }

    public InMemoryPubSubService(int pushThreads) {
        this.pushExecutor = Executors.newFixedThreadPool(pushThreads, r -> {
            Thread t = new Thread(r, "pubsub-push-" + r.hashCode());
            t.setDaemon(true);
            return t;
        });
    }

    // ======================== Topic management ========================

    @Override
    public void createTopic(String topicName) {
        if (topicName == null || topicName.trim().isEmpty()) {
            throw new IllegalArgumentException("Topic name required");
        }
        if (topics.putIfAbsent(topicName, new Topic(topicName)) != null) {
            throw new IllegalStateException("Topic already exists: " + topicName);
        }
        System.out.println("[PubSub] Topic created: " + topicName);
    }

    @Override
    public void deleteTopic(String topicName) {
        Topic topic = topics.remove(topicName);
        if (topic == null) throw new TopicNotFoundException(topicName);

        for (String subId : topic.getSubscriptionIds()) {
            subscriptions.remove(subId);
        }
        System.out.println("[PubSub] Topic deleted: " + topicName + " (" + topic.getSubscriptionIds().size() + " subs removed)");
    }

    // ======================== Publish (fan-out) ========================

    @Override
    public void publish(String topicName, Message message) {
        Topic topic = topics.get(topicName);
        if (topic == null) throw new TopicNotFoundException(topicName);

        for (String subId : topic.getSubscriptionIds()) {
            Subscription sub = subscriptions.get(subId);
            if (sub == null) continue;

            sub.enqueue(message);

            if (sub.hasPushHandler()) {
                pushExecutor.submit(() -> {
                    try {
                        sub.getHandler().onMessage(sub.getId(), message);
                    } catch (Exception e) {
                        System.err.println("[PubSub] Push delivery failed for " + sub.getId() + ": " + e.getMessage());
                    }
                });
            }
        }
    }

    // ======================== Subscribe ========================

    @Override
    public String subscribe(String topicName, String subscriberId, MessageHandler handler) {
        return doSubscribe(topicName, subscriberId, handler);
    }

    @Override
    public String subscribe(String topicName, String subscriberId) {
        return doSubscribe(topicName, subscriberId, null);
    }

    private String doSubscribe(String topicName, String subscriberId, MessageHandler handler) {
        Topic topic = topics.get(topicName);
        if (topic == null) throw new TopicNotFoundException(topicName);

        String subId = "SUB-" + subIdGen.incrementAndGet();
        Subscription sub = new Subscription(subId, topicName, subscriberId, handler);
        subscriptions.put(subId, sub);
        topic.addSubscription(subId);

        System.out.println("[PubSub] Subscribed: " + subscriberId + " -> " + topicName
            + " (id=" + subId + ", push=" + sub.hasPushHandler() + ")");
        return subId;
    }

    // ======================== Unsubscribe ========================

    @Override
    public void unsubscribe(String subscriptionId) {
        Subscription sub = subscriptions.remove(subscriptionId);
        if (sub == null) throw new SubscriptionNotFoundException(subscriptionId);

        Topic topic = topics.get(sub.getTopicName());
        if (topic != null) {
            topic.removeSubscription(subscriptionId);
        }
        System.out.println("[PubSub] Unsubscribed: " + sub.getSubscriberId() + " from " + sub.getTopicName());
    }

    // ======================== Pull + Ack ========================

    @Override
    public List<Message> pull(String subscriptionId) {
        Subscription sub = subscriptions.get(subscriptionId);
        if (sub == null) throw new SubscriptionNotFoundException(subscriptionId);
        return sub.peekAll();
    }

    @Override
    public void acknowledge(String subscriptionId, String messageId) {
        Subscription sub = subscriptions.get(subscriptionId);
        if (sub == null) throw new SubscriptionNotFoundException(subscriptionId);

        if (!sub.ack(messageId)) {
            System.out.println("[PubSub] Ack no-op: message " + messageId + " not found in " + subscriptionId);
        }
    }

    // ======================== Shutdown ========================

    @Override
    public void shutdown() {
        pushExecutor.shutdown();
        try {
            if (!pushExecutor.awaitTermination(5, TimeUnit.SECONDS)) {
                pushExecutor.shutdownNow();
            }
        } catch (InterruptedException e) {
            pushExecutor.shutdownNow();
            Thread.currentThread().interrupt();
        }
        System.out.println("[PubSub] Service shut down.");
    }
}
```

</details>

### `exceptions/SubscriptionNotFoundException.java`

<details>
<summary>Click to view exceptions/SubscriptionNotFoundException.java</summary>

```java
package com.you.lld.problems.pubsub.exceptions;

public class SubscriptionNotFoundException extends RuntimeException {
    public SubscriptionNotFoundException(String subscriptionId) {
        super("Subscription not found: " + subscriptionId);
    }
}
```

</details>

### `exceptions/TopicNotFoundException.java`

<details>
<summary>Click to view exceptions/TopicNotFoundException.java</summary>

```java
package com.you.lld.problems.pubsub.exceptions;

public class TopicNotFoundException extends RuntimeException {
    public TopicNotFoundException(String topicName) {
        super("Topic not found: " + topicName);
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.pubsub.PubSubDemo"
```

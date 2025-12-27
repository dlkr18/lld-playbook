# Source Code

This page contains the complete source code for this problem.

## 📁 Directory Structure

```
├── Message.java
├── PubSubSystem.java
├── Subscriber.java
├── api/PubSubService.java
├── exceptions/SubscriptionNotFoundException.java
├── exceptions/TopicNotFoundException.java
├── impl/InMemoryPubSubService.java
├── model/Message.java
├── model/MessageStatus.java
├── model/Publisher.java
├── model/Subscriber.java
├── model/Subscription.java
├── model/Topic.java
```

## Message.java

```java
package com.you.lld.problems.pubsub;

import java.time.LocalDateTime;
import java.util.*;

public class Message {
    private final String id;
    private final String topic;
    private final Object payload;
    private final Map<String, String> metadata;
    private final LocalDateTime timestamp;
    
    public Message(String id, String topic, Object payload) {
        this.id = id;
        this.topic = topic;
        this.payload = payload;
        this.metadata = new HashMap<>();
        this.timestamp = LocalDateTime.now();
    }
    
    public String getId() { return id; }
    public String getTopic() { return topic; }
    public Object getPayload() { return payload; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
```

## PubSubSystem.java

```java
package com.you.lld.problems.pubsub;

import java.util.*;
import java.util.concurrent.*;

public class PubSubSystem {
    private final Map<String, List<Subscriber>> topicSubscribers;
    private final BlockingQueue<Message> messageQueue;
    private final ExecutorService executor;
    
    public PubSubSystem() {
        this.topicSubscribers = new ConcurrentHashMap<>();
        this.messageQueue = new LinkedBlockingQueue<>();
        this.executor = Executors.newFixedThreadPool(4);
        startMessageProcessor();
    }
    
    public void subscribe(String topic, Subscriber subscriber) {
        topicSubscribers.computeIfAbsent(topic, k -> new ArrayList<>()).add(subscriber);
    }
    
    public void unsubscribe(String topic, Subscriber subscriber) {
        List<Subscriber> subscribers = topicSubscribers.get(topic);
        if (subscribers != null) {
            subscribers.remove(subscriber);
        }
    }
    
    public void publish(String topic, Message message) {
        messageQueue.offer(message);
    }
    
    private void startMessageProcessor() {
        executor.submit(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    Message message = messageQueue.take();
                    deliverMessage(message);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        });
    }
    
    private void deliverMessage(Message message) {
        List<Subscriber> subscribers = topicSubscribers.get(message.getTopic());
        if (subscribers != null) {
            for (Subscriber subscriber : subscribers) {
                executor.submit(() -> subscriber.onMessage(message));
            }
        }
    }
    
    public void shutdown() {
        executor.shutdown();
    }
}
```

## Subscriber.java

```java
package com.you.lld.problems.pubsub;

public interface Subscriber {
    void onMessage(Message message);
    String getSubscriberId();
}
```

## PubSubService.java

```java
package com.you.lld.problems.pubsub.api;

import com.you.lld.problems.pubsub.model.Message;
import com.you.lld.problems.pubsub.model.Subscriber;

import java.util.List;

/**
 * Service interface for Publish-Subscribe messaging system.
 * Supports topics, publishers, subscribers, and message delivery.
 */
public interface PubSubService {
    
    /**
     * Creates a new topic.
     * 
     * @param topicName Name of the topic
     * @return true if created successfully
     */
    boolean createTopic(String topicName);
    
    /**
     * Deletes a topic.
     * 
     * @param topicName Name of the topic
     * @return true if deleted successfully
     */
    boolean deleteTopic(String topicName);
    
    /**
     * Publishes a message to a topic.
     * 
     * @param topicName Topic to publish to
     * @param message Message to publish
     * @return true if published successfully
     */
    boolean publish(String topicName, Message message);
    
    /**
     * Subscribes to a topic.
     * 
     * @param topicName Topic to subscribe to
     * @param subscriber Subscriber to add
     * @return Subscription ID
     */
    String subscribe(String topicName, Subscriber subscriber);
    
    /**
     * Unsubscribes from a topic.
     * 
     * @param topicName Topic to unsubscribe from
     * @param subscriptionId Subscription ID to remove
     * @return true if unsubscribed successfully
     */
    boolean unsubscribe(String topicName, String subscriptionId);
    
    /**
     * Gets all messages for a subscriber.
     * 
     * @param subscriptionId Subscription ID
     * @return List of messages
     */
    List<Message> getMessages(String subscriptionId);
    
    /**
     * Acknowledges message receipt.
     * 
     * @param subscriptionId Subscription ID
     * @param messageId Message ID to acknowledge
     * @return true if acknowledged successfully
     */
    boolean acknowledgeMessage(String subscriptionId, String messageId);
}

```

## SubscriptionNotFoundException.java

```java
package com.you.lld.problems.pubsub.exceptions;
public class SubscriptionNotFoundException extends RuntimeException { public SubscriptionNotFoundException(String m) { super(m); } }```

## TopicNotFoundException.java

```java
package com.you.lld.problems.pubsub.exceptions;
public class TopicNotFoundException extends RuntimeException { public TopicNotFoundException(String m) { super(m); } }```

## InMemoryPubSubService.java

```java
package com.you.lld.problems.pubsub.impl;

import com.you.lld.problems.pubsub.api.PubSubService;
import com.you.lld.problems.pubsub.model.Message;
import com.you.lld.problems.pubsub.model.Subscriber;
import com.you.lld.problems.pubsub.model.Topic;
import com.you.lld.problems.pubsub.model.Subscription;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Thread-safe in-memory Pub/Sub implementation.
 */
public class InMemoryPubSubService implements PubSubService {
    
    private final Map<String, Topic> topics;
    private final Map<String, Subscription> subscriptions;
    private final Map<String, Queue<Message>> subscriberMessages;
    private final AtomicLong subscriptionIdGenerator;
    
    public InMemoryPubSubService() {
        this.topics = new ConcurrentHashMap<>();
        this.subscriptions = new ConcurrentHashMap<>();
        this.subscriberMessages = new ConcurrentHashMap<>();
        this.subscriptionIdGenerator = new AtomicLong(0);
    }
    
    @Override
    public boolean createTopic(String topicName) {
        if (topics.containsKey(topicName)) {
            return false;
        }
        topics.put(topicName, new Topic(topicName));
        return true;
    }
    
    @Override
    public boolean deleteTopic(String topicName) {
        Topic topic = topics.remove(topicName);
        if (topic == null) {
            return false;
        }
        
        // Remove all subscriptions to this topic
        for (String subId : topic.getSubscriptionIds()) {
            subscriptions.remove(subId);
            subscriberMessages.remove(subId);
        }
        
        return true;
    }
    
    @Override
    public boolean publish(String topicName, Message message) {
        Topic topic = topics.get(topicName);
        if (topic == null) {
            return false;
        }
        
        // Deliver message to all subscribers
        for (String subscriptionId : topic.getSubscriptionIds()) {
            Queue<Message> queue = subscriberMessages.computeIfAbsent(
                subscriptionId,
                k -> new ConcurrentLinkedQueue<>()
            );
            queue.offer(message);
        }
        
        return true;
    }
    
    @Override
    public String subscribe(String topicName, Subscriber subscriber) {
        Topic topic = topics.get(topicName);
        if (topic == null) {
            return null;
        }
        
        String subscriptionId = "SUB-" + subscriptionIdGenerator.incrementAndGet();
        Subscription subscription = new Subscription(subscriptionId, topicName, subscriber);
        
        subscriptions.put(subscriptionId, subscription);
        topic.addSubscription(subscriptionId);
        subscriberMessages.put(subscriptionId, new ConcurrentLinkedQueue<>());
        
        return subscriptionId;
    }
    
    @Override
    public boolean unsubscribe(String topicName, String subscriptionId) {
        Topic topic = topics.get(topicName);
        if (topic == null) {
            return false;
        }
        
        topic.removeSubscription(subscriptionId);
        subscriptions.remove(subscriptionId);
        subscriberMessages.remove(subscriptionId);
        
        return true;
    }
    
    @Override
    public List<Message> getMessages(String subscriptionId) {
        Queue<Message> queue = subscriberMessages.get(subscriptionId);
        if (queue == null) {
            return new ArrayList<>();
        }
        return new ArrayList<>(queue);
    }
    
    @Override
    public boolean acknowledgeMessage(String subscriptionId, String messageId) {
        Queue<Message> queue = subscriberMessages.get(subscriptionId);
        if (queue == null) {
            return false;
        }
        
        return queue.removeIf(m -> m.getId().equals(messageId));
    }
}

```

## Message.java

```java
package com.you.lld.problems.pubsub.model;
import java.util.*;
public
class Message  {
    private String messageId;
    public Message(String id)  {
        messageId=id;
    }
    public String getMessageId()  {
        return messageId;
    }
}
```

## MessageStatus.java

```java
package com.you.lld.problems.pubsub.model;
public enum MessageStatus { ACTIVE, INACTIVE, PENDING, COMPLETED }```

## Publisher.java

```java
package com.you.lld.problems.pubsub.model;
import java.util.*;
public
class Publisher  {
    private String publisherId;
    public Publisher(String id)  {
        publisherId=id;
    }
    public String getPublisherId()  {
        return publisherId;
    }
}
```

## Subscriber.java

```java
package com.you.lld.problems.pubsub.model;
import java.util.*;
public
class Subscriber  {
    private String subscriberId;
    public Subscriber(String id)  {
        subscriberId=id;
    }
    public String getSubscriberId()  {
        return subscriberId;
    }
}
```

## Subscription.java

```java
package com.you.lld.problems.pubsub.model;
import java.util.*;
public
class Subscription  {
    private String subscriptionId;
    public Subscription(String id)  {
        subscriptionId=id;
    }
    public String getSubscriptionId()  {
        return subscriptionId;
    }
}
```

## Topic.java

```java
package com.you.lld.problems.pubsub.model;
import java.util.*;
public class Topic { private String topicId; public Topic(String id) { topicId=id; } public String getTopicId() { return topicId; } }```


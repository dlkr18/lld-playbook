# Pub/Sub Messaging System

## Overview
A publish-subscribe messaging system enabling asynchronous communication between services. Supports topics, subscriptions, message filtering, delivery guarantees, and dead letter queues for scalable, decoupled architecture.

**Difficulty:** Hard  
**Domain:** Messaging, Distributed Systems  
**Interview Frequency:** Very High (Google Cloud Pub/Sub, AWS SNS/SQS, Kafka)

## Core Concepts

### Architecture
```
Publishers → Topics → Subscriptions → Subscribers

Topic: "order-events"
  ├─ Subscription: "email-service" (filter: type='placed')
  ├─ Subscription: "analytics" (all messages)
  └─ Subscription: "fraud-detection" (filter: amount>1000)
```

### Key Algorithms

#### Message Routing
```java
public void publish(String topic, Message message) {
    List<Subscription> subs = topicSubscriptions.get(topic);
    for (Subscription sub : subs) {
        if (sub.getFilter().matches(message)) {
            sub.enqueue(message);
        }
    }
}
```

**Time Complexity:** O(S*F) where S=subscriptions, F=filter complexity  
**Space Complexity:** O(M) where M=messages

#### At-Least-Once Delivery
```java
public void deliver(Message msg, Subscriber sub) {
    String ackId = UUID.randomUUID().toString();
    pendingAcks.put(ackId, msg);
    
    sub.receive(msg, ackId);
    
    // Wait for ack with timeout
    scheduleAckTimeout(ackId, 30_000); // 30s
}

public void ack(String ackId) {
    pendingAcks.remove(ackId);
}

private void onAckTimeout(String ackId) {
    Message msg = pendingAcks.get(ackId);
    if (msg != null) {
        // Redeliver
        deliver(msg, subscriber);
    }
}
```

## Design Patterns

### 1. Observer Pattern
```java
interface MessageObserver {
    void onMessage(Message message);
}

class Topic {
    private List<MessageObserver> observers;
    
    public void publish(Message msg) {
        for (MessageObserver obs : observers) {
            obs.onMessage(msg);
        }
    }
}
```

### 2. Message Filter Pattern
```java
interface MessageFilter {
    boolean matches(Message message);
}

class AttributeFilter implements MessageFilter {
    public boolean matches(Message msg) {
        return msg.getAttribute("type").equals("order");
    }
}
```

## Usage Example
```java
PubSubService pubsub = new PubSubServiceImpl();

// Create topic
String topicId = pubsub.createTopic("order-events");

// Subscribe
String subId = pubsub.subscribe(topicId, "email-service", 
    msg -> msg.getAttribute("type").equals("placed"));

// Publish
Message msg = Message.builder()
    .data("Order #123 placed")
    .attribute("type", "placed")
    .attribute("amount", "99.99")
    .build();
    
pubsub.publish(topicId, msg);

// Pull messages
List<Message> messages = pubsub.pull(subId, 10);
for (Message m : messages) {
    process(m);
    pubsub.ack(subId, m.getAckId());
}
```

## Key Features
- **Topics**: Named channels for messages
- **Subscriptions**: Consumer registrations
- **Filtering**: Message attribute filtering
- **Delivery**: At-least-once, exactly-once
- **Ordering**: FIFO within partition
- **DLQ**: Dead letter queue for failed messages

## Source Code
📄 **[View Complete Source Code](/problems/pubsub/CODE)**

---

*Essential distributed messaging pattern for microservices architecture.*

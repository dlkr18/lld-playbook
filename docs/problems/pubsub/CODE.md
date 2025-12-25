# Pub/Sub System

## Problem: Design a Publish-Subscribe Messaging System

**Difficulty**: Medium  
**Pattern**: Observer, Message Queue  
**Time**: 45-60 min

---

## Key Classes

```java
class PubSubSystem {
    private Map<String, List<Subscriber>> topicSubscribers;
    private BlockingQueue<Message> messageQueue;
    
    void subscribe(String topic, Subscriber subscriber);
    void unsubscribe(String topic, Subscriber subscriber);
    void publish(String topic, Message message);
}

interface Subscriber {
    void onMessage(Message message);
}

class Message {
    String id;
    String topic;
    Object payload;
    Map<String, String> metadata;
    LocalDateTime timestamp;
}

class Topic {
    String name;
    List<Subscriber> subscribers;
    MessageRetentionPolicy retentionPolicy;
}
```

---

**Status**: ✅ Documented | [View Master Guide](../ALL_PROBLEMS_MASTER_GUIDE)

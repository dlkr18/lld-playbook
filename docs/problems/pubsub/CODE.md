# pubsub - Complete Implementation

## 📁 Project Structure (11 files)

```
pubsub/
├── Message.java
├── PubSubSystem.java
├── Subscriber.java
├── exceptions/SubscriptionNotFoundException.java
├── exceptions/TopicNotFoundException.java
├── model/Message.java
├── model/MessageStatus.java
├── model/Publisher.java
├── model/Subscriber.java
├── model/Subscription.java
├── model/Topic.java
```

## 📝 Source Code

### 📄 `Message.java`

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

### 📄 `PubSubSystem.java`

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

### 📄 `Subscriber.java`

```java
package com.you.lld.problems.pubsub;

public interface Subscriber {
    void onMessage(Message message);
    String getSubscriberId();
}
```

### 📄 `exceptions/SubscriptionNotFoundException.java`

```java
package com.you.lld.problems.pubsub.exceptions;
public class SubscriptionNotFoundException extends RuntimeException { public SubscriptionNotFoundException(String m) { super(m); } }```

### 📄 `exceptions/TopicNotFoundException.java`

```java
package com.you.lld.problems.pubsub.exceptions;
public class TopicNotFoundException extends RuntimeException { public TopicNotFoundException(String m) { super(m); } }```

### 📄 `model/Message.java`

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

### 📄 `model/MessageStatus.java`

```java
package com.you.lld.problems.pubsub.model;
public enum MessageStatus { ACTIVE, INACTIVE, PENDING, COMPLETED }```

### 📄 `model/Publisher.java`

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

### 📄 `model/Subscriber.java`

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

### 📄 `model/Subscription.java`

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

### 📄 `model/Topic.java`

```java
package com.you.lld.problems.pubsub.model;
import java.util.*;
public class Topic { private String topicId; public Topic(String id) { topicId=id; } public String getTopicId() { return topicId; } }```


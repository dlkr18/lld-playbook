# notification - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/notification/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py notification`.

## Project Structure (17 files)

```
notification/
├── NotificationDemo.java
├── NotificationGateway.java
├── model/Notification.java
├── model/NotificationChannel.java
├── model/NotificationStatus.java
├── model/Priority.java
├── service/ChannelSender.java
├── service/NotificationService.java
├── service/impl/AbstractChannelSender.java
├── service/impl/ChannelSenderFactory.java
├── service/impl/EmailChannelSender.java
├── service/impl/InAppChannelSender.java
├── service/impl/NotificationServiceImpl.java
├── service/impl/NotificationTemplateRegistry.java
├── service/impl/PushChannelSender.java
├── service/impl/SmsChannelSender.java
├── retry/RetryPolicy.java
```

## Source Code

### `NotificationDemo.java`

<details>
<summary>Click to view NotificationDemo.java</summary>

```java
package com.you.lld.problems.notification;

import com.you.lld.problems.notification.model.NotificationChannel;
import com.you.lld.problems.notification.model.Priority;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NotificationDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Notification Service Demo ===\n");
        NotificationGateway gateway = new NotificationGateway();

        // 1. Single-channel send with priority queue
        System.out.println("--- Scenario 1: Priority queue (URGENT before LOW) ---");
        String lowId = gateway.send("user-1", "Newsletter digest", NotificationChannel.EMAIL, Priority.LOW);
        String urgentId = gateway.send("user-2", "Payment failed!", NotificationChannel.SMS, Priority.URGENT);
        Thread.sleep(800);
        printStatus(gateway, urgentId, "Urgent SMS");
        printStatus(gateway, lowId, "Low email");

        // 2. Template method + templated message
        System.out.println("\n--- Scenario 2: Template rendering ---");
        Map<String, String> vars = new HashMap<>();
        vars.put("name", "Alice");
        vars.put("orderId", "ORD-42");
        String tplId = gateway.sendTemplated("user-1", "order-shipped", vars,
            NotificationChannel.EMAIL, Priority.MEDIUM);
        Thread.sleep(500);
        printStatus(gateway, tplId, "Templated email");

        // 3. Composite multi-channel fan-out
        System.out.println("\n--- Scenario 3: Multi-channel (Composite fan-out) ---");
        List<NotificationChannel> channels = Arrays.asList(
            NotificationChannel.EMAIL, NotificationChannel.SMS, NotificationChannel.PUSH);
        List<String> batchIds = gateway.sendMultiChannel("user-3",
            "Your password was changed", channels, Priority.HIGH);
        Thread.sleep(1000);
        System.out.println("  Fan-out count: " + batchIds.size());

        // 4. Retry with exponential backoff
        System.out.println("\n--- Scenario 4: Retry failed with backoff ---");
        gateway.retryFailed();
        Thread.sleep(1500);

        // 5. Status inspection
        System.out.println("\n--- Scenario 5: Final statuses ---");
        for (String id : batchIds) {
            com.you.lld.problems.notification.model.Notification n = gateway.getStatus(id);
            if (n != null) {
                System.out.println("  " + n.getChannel() + ": " + n.getStatus()
                    + " (retries=" + n.getRetryCount() + ")");
            }
        }

        gateway.shutdown();
        System.out.println("\n=== Demo complete ===");
    }

    private static void printStatus(NotificationGateway gateway, String id, String label) {
        com.you.lld.problems.notification.model.Notification n = gateway.getStatus(id);
        if (n != null) {
            System.out.println("  " + label + ": " + n.getStatus());
        }
    }
}
```

</details>

### `NotificationGateway.java`

<details>
<summary>Click to view NotificationGateway.java</summary>

```java
package com.you.lld.problems.notification;

import com.you.lld.problems.notification.model.Notification;
import com.you.lld.problems.notification.model.NotificationChannel;
import com.you.lld.problems.notification.model.Priority;
import com.you.lld.problems.notification.service.NotificationService;
import com.you.lld.problems.notification.service.impl.NotificationServiceImpl;

import java.util.List;
import java.util.Map;

/** Facade over {@link NotificationService}. */
public class NotificationGateway {

    private final NotificationService service;

    public NotificationGateway() {
        this(new NotificationServiceImpl());
    }

    public NotificationGateway(NotificationService service) {
        this.service = service;
    }

    public String send(String userId, String message, NotificationChannel channel, Priority priority) {
        return service.send(userId, message, channel, priority);
    }

    public String sendTemplated(String userId, String templateId, Map<String, String> variables,
                                NotificationChannel channel, Priority priority) {
        return service.sendTemplated(userId, templateId, variables, channel, priority);
    }

    public List<String> sendMultiChannel(String userId, String message, List<NotificationChannel> channels,
                                         Priority priority) {
        return service.sendMultiChannel(userId, message, channels, priority);
    }

    public Notification getStatus(String id) {
        return service.getStatus(id);
    }

    public void retryFailed() {
        service.retryFailed();
    }

    public void shutdown() {
        service.shutdown();
    }

    public NotificationService unwrap() {
        return service;
    }
}
```

</details>

### `model/Notification.java`

<details>
<summary>Click to view model/Notification.java</summary>

```java
package com.you.lld.problems.notification.model;

import java.time.LocalDateTime;

public class Notification {
    private final String id;
    private final String userId;
    private final String message;
    private final NotificationChannel channel;
    private final Priority priority;
    private final LocalDateTime createdAt;
    private NotificationStatus status;
    private int retryCount;
    
    public Notification(String id, String userId, String message, 
                       NotificationChannel channel, Priority priority) {
        this.id = id;
        this.userId = userId;
        this.message = message;
        this.channel = channel;
        this.priority = priority;
        this.createdAt = LocalDateTime.now();
        this.status = NotificationStatus.PENDING;
        this.retryCount = 0;
    }
    
    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getMessage() { return message; }
    public NotificationChannel getChannel() { return channel; }
    public Priority getPriority() { return priority; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public NotificationStatus getStatus() { return status; }
    public int getRetryCount() { return retryCount; }
    
    public void setStatus(NotificationStatus status) {
        this.status = status;
    }
    
    public void incrementRetry() {
        this.retryCount++;
    }
    
    @Override
    public String toString() {
        return "Notification{id='" + id + "', channel=" + channel + 
               ", priority=" + priority + ", status=" + status + "}";
    }
}
```

</details>

### `model/NotificationChannel.java`

<details>
<summary>Click to view model/NotificationChannel.java</summary>

```java
package com.you.lld.problems.notification.model;

public enum NotificationChannel {
    EMAIL, SMS, PUSH, IN_APP
}
```

</details>

### `model/NotificationStatus.java`

<details>
<summary>Click to view model/NotificationStatus.java</summary>

```java
package com.you.lld.problems.notification.model;

public enum NotificationStatus {
    PENDING, SENT, FAILED, RETRYING
}
```

</details>

### `model/Priority.java`

<details>
<summary>Click to view model/Priority.java</summary>

```java
package com.you.lld.problems.notification.model;

public enum Priority {
    LOW(1), MEDIUM(2), HIGH(3), URGENT(4);
    
    private final int value;
    Priority(int value) { this.value = value; }
    public int getValue() { return value; }
}
```

</details>

### `service/ChannelSender.java`

<details>
<summary>Click to view service/ChannelSender.java</summary>

```java
package com.you.lld.problems.notification.service;

import com.you.lld.problems.notification.model.Notification;
import com.you.lld.problems.notification.model.NotificationChannel;

public interface ChannelSender {

    NotificationChannel channel();

    void send(Notification notification) throws Exception;
}
```

</details>

### `service/NotificationService.java`

<details>
<summary>Click to view service/NotificationService.java</summary>

```java
package com.you.lld.problems.notification.service;

import com.you.lld.problems.notification.model.Notification;
import com.you.lld.problems.notification.model.NotificationChannel;
import com.you.lld.problems.notification.model.Priority;

import java.util.List;
import java.util.Map;

public interface NotificationService {

    String send(String userId, String message, NotificationChannel channel, Priority priority);

    String sendTemplated(String userId, String templateId, Map<String, String> variables,
                         NotificationChannel channel, Priority priority);

    List<String> sendMultiChannel(String userId, String message, List<NotificationChannel> channels,
                                  Priority priority);

    Notification getStatus(String notificationId);

    void retryFailed();

    void shutdown();
}
```

</details>

### `service/impl/AbstractChannelSender.java`

<details>
<summary>Click to view service/impl/AbstractChannelSender.java</summary>

```java
package com.you.lld.problems.notification.service.impl;

import com.you.lld.problems.notification.model.Notification;
import com.you.lld.problems.notification.service.ChannelSender;

/**
 * Template Method — shared validate → format → deliver pipeline; subclasses override deliver().
 */
public abstract class AbstractChannelSender implements ChannelSender {

    @Override
    public final void send(Notification notification) throws Exception {
        validate(notification);
        String payload = formatMessage(notification);
        deliver(notification.getUserId(), payload);
    }

    protected void validate(Notification notification) {
        if (notification.getUserId() == null || notification.getUserId().trim().isEmpty()) {
            throw new IllegalArgumentException("userId required");
        }
        if (notification.getMessage() == null || notification.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("message required");
        }
    }

    protected String formatMessage(Notification notification) {
        return notification.getMessage();
    }

    protected abstract void deliver(String userId, String payload) throws Exception;
}
```

</details>

### `service/impl/ChannelSenderFactory.java`

<details>
<summary>Click to view service/impl/ChannelSenderFactory.java</summary>

```java
package com.you.lld.problems.notification.service.impl;

import com.you.lld.problems.notification.model.NotificationChannel;
import com.you.lld.problems.notification.service.ChannelSender;

import java.util.EnumMap;
import java.util.Map;

public final class ChannelSenderFactory {

    private final Map<NotificationChannel, ChannelSender> senders = new EnumMap<>(NotificationChannel.class);

    public ChannelSenderFactory() {
        register(new EmailChannelSender());
        register(new SmsChannelSender());
        register(new PushChannelSender());
        register(new InAppChannelSender());
    }

    public void register(ChannelSender sender) {
        senders.put(sender.channel(), sender);
    }

    public ChannelSender get(NotificationChannel channel) {
        ChannelSender sender = senders.get(channel);
        if (sender == null) {
            throw new IllegalArgumentException("No sender for channel: " + channel);
        }
        return sender;
    }
}
```

</details>

### `service/impl/EmailChannelSender.java`

<details>
<summary>Click to view service/impl/EmailChannelSender.java</summary>

```java
package com.you.lld.problems.notification.service.impl;

import com.you.lld.problems.notification.model.NotificationChannel;

public class EmailChannelSender extends AbstractChannelSender {

    private final double failureRate;

    public EmailChannelSender() {
        this(0.05);
    }

    public EmailChannelSender(double failureRate) {
        this.failureRate = failureRate;
    }

    @Override
    public NotificationChannel channel() {
        return NotificationChannel.EMAIL;
    }

    @Override
    protected String formatMessage(com.you.lld.problems.notification.model.Notification notification) {
        return "[EMAIL] Subject: Notification\n" + notification.getMessage();
    }

    @Override
    protected void deliver(String userId, String payload) throws Exception {
        Thread.sleep(50);
        if (Math.random() < failureRate) {
            throw new RuntimeException("SMTP gateway unavailable");
        }
        System.out.println("  EMAIL -> " + userId + ": " + payload);
    }
}
```

</details>

### `service/impl/InAppChannelSender.java`

<details>
<summary>Click to view service/impl/InAppChannelSender.java</summary>

```java
package com.you.lld.problems.notification.service.impl;

import com.you.lld.problems.notification.model.NotificationChannel;

public class InAppChannelSender extends AbstractChannelSender {

    @Override
    public NotificationChannel channel() {
        return NotificationChannel.IN_APP;
    }

    @Override
    protected void deliver(String userId, String payload) throws Exception {
        System.out.println("  IN_APP -> " + userId + ": " + payload);
    }
}
```

</details>

### `service/impl/NotificationServiceImpl.java`

<details>
<summary>Click to view service/impl/NotificationServiceImpl.java</summary>

```java
package com.you.lld.problems.notification.service.impl;

import com.you.lld.problems.notification.model.Notification;
import com.you.lld.problems.notification.model.NotificationChannel;
import com.you.lld.problems.notification.model.NotificationStatus;
import com.you.lld.problems.notification.model.Priority;
import com.you.lld.problems.notification.retry.RetryPolicy;
import com.you.lld.problems.notification.service.ChannelSender;
import com.you.lld.problems.notification.service.NotificationService;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

public class NotificationServiceImpl implements NotificationService {

    private final Map<String, Notification> notifications = new ConcurrentHashMap<>();
    private final PriorityBlockingQueue<Notification> pendingQueue;
    private final ChannelSenderFactory senderFactory;
    private final NotificationTemplateRegistry templates;
    private final RetryPolicy retryPolicy;
    private final ExecutorService executor;
    private final AtomicBoolean running = new AtomicBoolean(true);

    public NotificationServiceImpl() {
        this(new RetryPolicy(3, 100L), new ChannelSenderFactory(), new NotificationTemplateRegistry());
    }

    public NotificationServiceImpl(RetryPolicy retryPolicy, ChannelSenderFactory senderFactory,
                                   NotificationTemplateRegistry templates) {
        this.retryPolicy = retryPolicy;
        this.senderFactory = senderFactory;
        this.templates = templates;
        this.pendingQueue = new PriorityBlockingQueue<>(64, Comparator
            .comparing(Notification::getPriority, Comparator.comparingInt(Priority::getValue).reversed())
            .thenComparing(Notification::getCreatedAt));
        this.executor = Executors.newFixedThreadPool(4);
        executor.submit(new QueueWorker());
    }

    @Override
    public String send(String userId, String message, NotificationChannel channel, Priority priority) {
        return enqueue(userId, message, channel, priority);
    }

    @Override
    public String sendTemplated(String userId, String templateId, Map<String, String> variables,
                                NotificationChannel channel, Priority priority) {
        String message = templates.render(templateId, variables);
        return enqueue(userId, message, channel, priority);
    }

    @Override
    public List<String> sendMultiChannel(String userId, String message, List<NotificationChannel> channels,
                                         Priority priority) {
        List<String> ids = new ArrayList<>();
        for (NotificationChannel channel : channels) {
            ids.add(enqueue(userId, message, channel, priority));
        }
        return ids;
    }

    @Override
    public Notification getStatus(String notificationId) {
        return notifications.get(notificationId);
    }

    @Override
    public void retryFailed() {
        for (Notification notification : notifications.values()) {
            if (notification.getStatus() == NotificationStatus.FAILED
                && notification.getRetryCount() < retryPolicy.getMaxRetries()) {
                notification.setStatus(NotificationStatus.RETRYING);
                notification.incrementRetry();
                pendingQueue.offer(notification);
            }
        }
    }

    @Override
    public void shutdown() {
        running.set(false);
        executor.shutdownNow();
        try {
            executor.awaitTermination(5, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private String enqueue(String userId, String message, NotificationChannel channel, Priority priority) {
        String id = UUID.randomUUID().toString();
        Notification notification = new Notification(id, userId, message, channel, priority);
        notifications.put(id, notification);
        pendingQueue.offer(notification);
        return id;
    }

    private void dispatch(Notification notification) {
        ChannelSender sender = senderFactory.get(notification.getChannel());
        int attempt = notification.getRetryCount();
        while (attempt <= retryPolicy.getMaxRetries()) {
            try {
                if (attempt > 0) {
                    long delay = retryPolicy.getDelayForAttempt(attempt - 1);
                    Thread.sleep(delay);
                }
                sender.send(notification);
                notification.setStatus(NotificationStatus.SENT);
                return;
            } catch (Exception e) {
                attempt++;
                notification.incrementRetry();
                if (attempt > retryPolicy.getMaxRetries()) {
                    notification.setStatus(NotificationStatus.FAILED);
                    System.out.println("FAILED " + notification.getChannel() + " to " + notification.getUserId()
                        + ": " + e.getMessage());
                }
            }
        }
    }

    private class QueueWorker implements Runnable {
        @Override
        public void run() {
            while (running.get()) {
                try {
                    Notification notification = pendingQueue.poll(500, TimeUnit.MILLISECONDS);
                    if (notification != null) {
                        dispatch(notification);
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }
    }
}
```

</details>

### `service/impl/NotificationTemplateRegistry.java`

<details>
<summary>Click to view service/impl/NotificationTemplateRegistry.java</summary>

```java
package com.you.lld.problems.notification.service.impl;

import java.util.HashMap;
import java.util.Map;

public class NotificationTemplateRegistry {

    private final Map<String, String> templates = new HashMap<>();

    public NotificationTemplateRegistry() {
        templates.put("order-shipped", "Hi {{name}}, your order {{orderId}} has shipped!");
        templates.put("security-alert", "URGENT: {{event}} detected on account {{accountId}}.");
        templates.put("welcome", "Welcome {{name}}! Start exploring the platform.");
    }

    public void register(String id, String template) {
        templates.put(id, template);
    }

    public String render(String templateId, Map<String, String> variables) {
        String template = templates.get(templateId);
        if (template == null) {
            throw new IllegalArgumentException("Unknown template: " + templateId);
        }
        String result = template;
        if (variables != null) {
            for (Map.Entry<String, String> entry : variables.entrySet()) {
                result = result.replace("{{" + entry.getKey() + "}}", entry.getValue());
            }
        }
        return result;
    }
}
```

</details>

### `service/impl/PushChannelSender.java`

<details>
<summary>Click to view service/impl/PushChannelSender.java</summary>

```java
package com.you.lld.problems.notification.service.impl;

import com.you.lld.problems.notification.model.NotificationChannel;

public class PushChannelSender extends AbstractChannelSender {

    private final double failureRate;

    public PushChannelSender() {
        this(0.03);
    }

    public PushChannelSender(double failureRate) {
        this.failureRate = failureRate;
    }

    @Override
    public NotificationChannel channel() {
        return NotificationChannel.PUSH;
    }

    @Override
    protected void deliver(String userId, String payload) throws Exception {
        Thread.sleep(20);
        if (Math.random() < failureRate) {
            throw new RuntimeException("Push token expired");
        }
        System.out.println("  PUSH -> " + userId + ": " + payload);
    }
}
```

</details>

### `service/impl/SmsChannelSender.java`

<details>
<summary>Click to view service/impl/SmsChannelSender.java</summary>

```java
package com.you.lld.problems.notification.service.impl;

import com.you.lld.problems.notification.model.NotificationChannel;

public class SmsChannelSender extends AbstractChannelSender {

    private final double failureRate;

    public SmsChannelSender() {
        this(0.08);
    }

    public SmsChannelSender(double failureRate) {
        this.failureRate = failureRate;
    }

    @Override
    public NotificationChannel channel() {
        return NotificationChannel.SMS;
    }

    @Override
    protected String formatMessage(com.you.lld.problems.notification.model.Notification notification) {
        String body = notification.getMessage();
        if (body.length() > 160) {
            body = body.substring(0, 157) + "...";
        }
        return body;
    }

    @Override
    protected void deliver(String userId, String payload) throws Exception {
        Thread.sleep(30);
        if (Math.random() < failureRate) {
            throw new RuntimeException("SMS carrier timeout");
        }
        System.out.println("  SMS -> " + userId + ": " + payload);
    }
}
```

</details>

### `retry/RetryPolicy.java`

<details>
<summary>Click to view retry/RetryPolicy.java</summary>

```java
package com.you.lld.problems.notification.retry;

public class RetryPolicy {
    private final int maxRetries;
    private final long retryDelayMs;
    
    public RetryPolicy(int maxRetries, long retryDelayMs) {
        this.maxRetries = maxRetries;
        this.retryDelayMs = retryDelayMs;
    }
    
    public int getMaxRetries() { return maxRetries; }
    public long getRetryDelayMs() { return retryDelayMs; }
    
    public long getDelayForAttempt(int attempt) {
        return retryDelayMs * (1L << attempt);
    }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.notification.NotificationDemo"
```

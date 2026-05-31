# notification - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/notification/` on 2026-05-31. Re-run `python3 scripts/generate-code-md.py notification`.

## Project Structure (10 files)

```
notification/
├── NotificationDemo.java
├── api/NotificationService.java
├── model/Notification.java
├── model/NotificationBatch.java
├── model/NotificationChannel.java
├── model/NotificationStatus.java
├── model/Priority.java
├── impl/NotificationServiceImpl.java
├── retry/RetryPolicy.java
├── template/NotificationTemplate.java
```

## Source Code

### `NotificationDemo.java`

<details>
<summary>Click to view NotificationDemo.java</summary>

```java
package com.you.lld.problems.notification;

import com.you.lld.problems.notification.impl.NotificationServiceImpl;
import com.you.lld.problems.notification.model.*;

/**
 * Demo: Notification Service with multi-channel, priority queue, retry mechanism.
 */
public class NotificationDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Notification Service Demo ===\n");

        NotificationServiceImpl service = new NotificationServiceImpl();

        // Send various notifications
        System.out.println("--- Sending notifications ---");
        String id1 = service.sendNotification("user-1", "Your order has shipped!", 
            NotificationChannel.EMAIL, Priority.MEDIUM);
        String id2 = service.sendNotification("user-2", "URGENT: Security alert!", 
            NotificationChannel.SMS, Priority.URGENT);
        String id3 = service.sendNotification("user-1", "New message from Bob", 
            NotificationChannel.PUSH, Priority.LOW);
        String id4 = service.sendNotification("user-3", "Welcome to the platform!", 
            NotificationChannel.IN_APP, Priority.HIGH);

        // Wait for async processing
        System.out.println("\nWaiting for processing...");
        Thread.sleep(2000);

        // Check statuses
        System.out.println("\n--- Notification statuses ---");
        printStatus(service, id1, "Order shipped email");
        printStatus(service, id2, "Security alert SMS");
        printStatus(service, id3, "Push notification");
        printStatus(service, id4, "Welcome in-app");

        // Retry failed notifications
        System.out.println("\n--- Retry failed ---");
        service.retryFailed();
        Thread.sleep(1000);

        System.out.println("\n--- Final statuses ---");
        printStatus(service, id1, "Email");
        printStatus(service, id2, "SMS");
        printStatus(service, id3, "Push");
        printStatus(service, id4, "In-app");

        System.out.println("\n=== Demo complete ===");
        System.exit(0); // Force exit worker threads
    }

    private static void printStatus(NotificationServiceImpl service, String id, String label) {
        Notification n = service.getNotificationStatus(id);
        if (n != null) {
            System.out.println("  " + label + ": " + n.getStatus() + 
                " (retries: " + n.getRetryCount() + ")");
        }
    }
}
```

</details>

### `api/NotificationService.java`

<details>
<summary>Click to view api/NotificationService.java</summary>

```java
package com.you.lld.problems.notification.api;

import com.you.lld.problems.notification.model.*;

public interface NotificationService {
    String sendNotification(String userId, String message, 
                          NotificationChannel channel, Priority priority);
    Notification getNotificationStatus(String notificationId);
    void retryFailed();
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

### `model/NotificationBatch.java`

<details>
<summary>Click to view model/NotificationBatch.java</summary>

```java
package com.you.lld.problems.notification.model;

import java.util.*;

public class NotificationBatch {
    private final String id;
    private final List<Notification> notifications;
    private final String batchType;
    
    public NotificationBatch(String id, String batchType) {
        this.id = id;
        this.batchType = batchType;
        this.notifications = new ArrayList<>();
    }
    
    public void addNotification(Notification notification) {
        notifications.add(notification);
    }
    
    public List<Notification> getNotifications() {
        return new ArrayList<>(notifications);
    }
    
    public int size() {
        return notifications.size();
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

### `impl/NotificationServiceImpl.java`

<details>
<summary>Click to view impl/NotificationServiceImpl.java</summary>

```java
package com.you.lld.problems.notification.impl;

import com.you.lld.problems.notification.api.NotificationService;
import com.you.lld.problems.notification.model.*;
import java.util.*;
import java.util.concurrent.*;

public class NotificationServiceImpl implements NotificationService {
    
    private final Map<String, Notification> notifications = new ConcurrentHashMap<>();
    private final PriorityQueue<Notification> pendingQueue = new PriorityQueue<>(
        Comparator.comparing(Notification::getPriority, 
                           Comparator.comparingInt(Priority::getValue).reversed())
    );
    private final ExecutorService executorService = Executors.newFixedThreadPool(4);
    private final int MAX_RETRIES = 3;
    
    public NotificationServiceImpl() {
        // Start worker thread
        executorService.submit(this::processQueue);
    }
    
    @Override
    public String sendNotification(String userId, String message, 
                                  NotificationChannel channel, Priority priority) {
        String id = UUID.randomUUID().toString();
        Notification notification = new Notification(id, userId, message, channel, priority);
        
        notifications.put(id, notification);
        synchronized (pendingQueue) {
            pendingQueue.offer(notification);
            pendingQueue.notifyAll();
        }
        
        System.out.println("📨 Queued: " + notification);
        return id;
    }
    
    @Override
    public Notification getNotificationStatus(String notificationId) {
        return notifications.get(notificationId);
    }
    
    @Override
    public void retryFailed() {
        List<Notification> failed = new ArrayList<>();
        for (Notification n : notifications.values()) {
            if (n.getStatus() == NotificationStatus.FAILED && 
                n.getRetryCount() < MAX_RETRIES) {
                failed.add(n);
            }
        }
        
        for (Notification n : failed) {
            n.setStatus(NotificationStatus.RETRYING);
            n.incrementRetry();
            synchronized (pendingQueue) {
                pendingQueue.offer(n);
                pendingQueue.notifyAll();
            }
        }
        
        System.out.println("🔄 Retrying " + failed.size() + " failed notifications");
    }
    
    private void processQueue() {
        while (true) {
            Notification notification = null;
            
            synchronized (pendingQueue) {
                while (pendingQueue.isEmpty()) {
                    try {
                        pendingQueue.wait();
                    } catch (InterruptedException e) {
                        return;
                    }
                }
                notification = pendingQueue.poll();
            }
            
            if (notification != null) {
                sendViaChannel(notification);
            }
        }
    }
    
    private void sendViaChannel(Notification notification) {
        try {
            // Simulate sending
            Thread.sleep(100);
            
            // Simulate 10% failure rate
            if (Math.random() < 0.1) {
                throw new RuntimeException("Channel unavailable");
            }
            
            notification.setStatus(NotificationStatus.SENT);
            System.out.println("✅ Sent: " + notification);
            
        } catch (Exception e) {
            notification.setStatus(NotificationStatus.FAILED);
            System.out.println("❌ Failed: " + notification);
        }
    }
    
    public void shutdown() {
        System.out.println("Shutting down notification service...");
        executorService.shutdownNow(); // Interrupt the processing thread
        try {
            if (!executorService.awaitTermination(10, TimeUnit.SECONDS)) {
                System.out.println("Force shutdown -- some notifications may be lost");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        // Drain remaining pending notifications
        synchronized (pendingQueue) {
            int remaining = pendingQueue.size();
            if (remaining > 0) {
                System.out.println("Draining " + remaining + " pending notifications");
                while (!pendingQueue.isEmpty()) {
                    Notification n = pendingQueue.poll();
                    n.setStatus(NotificationStatus.FAILED);
                }
            }
        }
        System.out.println("Notification service shutdown complete");
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

### `template/NotificationTemplate.java`

<details>
<summary>Click to view template/NotificationTemplate.java</summary>

```java
package com.you.lld.problems.notification.template;

import java.util.Map;

public class NotificationTemplate {
    private final String id;
    private final String name;
    private final String template;
    
    public NotificationTemplate(String id, String name, String template) {
        this.id = id;
        this.name = name;
        this.template = template;
    }
    
    public String render(Map<String, String> variables) {
        String result = template;
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            result = result.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return result;
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
}
```

</details>

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.notification.NotificationDemo"
```

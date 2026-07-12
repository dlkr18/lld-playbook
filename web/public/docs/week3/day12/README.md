# Day 12: Notification Service 📬

**Focus**: Design a multi-channel notification service with retries, templates, and audit trail.

---

## 🎯 **Learning Objectives**

By the end of Day 12, you will:
- **Design** a multi-channel notification system
- **Implement** retry mechanisms with exponential backoff
- **Create** template engines for notifications
- **Build** audit and delivery tracking

---

## 📚 **System Design**

### **Requirements**

**Functional:**
- Support multiple channels (Email, SMS, Push, In-App)
- Template-based message rendering
- Priority-based delivery
- Delivery status tracking
- Retry failed deliveries

**Non-Functional:**
- High throughput (100K+ notifications/minute)
- Low latency for high-priority notifications
- At-least-once delivery guarantee
- Audit trail for compliance

---

## 🏗️ **Core Components**

### **Notification Model**

```java
public class Notification {
    private final NotificationId id;
    private final UserId recipientId;
    private final NotificationType type;
    private final Channel channel;
    private final Priority priority;
    private final String templateId;
    private final Map<String, Object> templateParams;
    private NotificationStatus status;
    private int attemptCount;
    private Instant createdAt;
    private Instant sentAt;
    private Instant deliveredAt;
    private String errorMessage;
    
    public enum Channel {
        EMAIL, SMS, PUSH, IN_APP, WEBHOOK
    }
    
    public enum Priority {
        LOW(3), MEDIUM(2), HIGH(1), CRITICAL(0);
        
        private final int order;
        Priority(int order) { this.order = order; }
        public int getOrder() { return order; }
    }
    
    public enum NotificationStatus {
        PENDING, QUEUED, SENDING, SENT, DELIVERED, FAILED, CANCELLED
    }
}
```

### **Notification Service Interface**

```java
public interface NotificationService {
    
    /**
     * Send a notification asynchronously.
     */
    NotificationId send(SendNotificationRequest request);
    
    /**
     * Send notification and wait for result.
     */
    NotificationResult sendSync(SendNotificationRequest request);
    
    /**
     * Batch send notifications.
     */
    List<NotificationId> sendBatch(List<SendNotificationRequest> requests);
    
    /**
     * Get notification status.
     */
    NotificationStatus getStatus(NotificationId id);
    
    /**
     * Cancel a pending notification.
     */
    boolean cancel(NotificationId id);
    
    /**
     * Get delivery history for a user.
     */
    List<Notification> getHistory(UserId userId, Channel channel, 
                                  Instant from, Instant to);
}
```

---

## 📧 **Channel Providers**

```java
public interface ChannelProvider {
    Channel getChannel();
    DeliveryResult deliver(Notification notification, RenderedContent content);
    boolean isAvailable();
    int getMaxRetries();
    Duration getRetryDelay(int attemptCount);
}

public class EmailProvider implements ChannelProvider {
    
    private final EmailClient emailClient;
    private final CircuitBreaker circuitBreaker;
    
    @Override
    public Channel getChannel() {
        return Channel.EMAIL;
    }
    
    @Override
    public DeliveryResult deliver(Notification notification, RenderedContent content) {
        if (!circuitBreaker.allowRequest()) {
            return DeliveryResult.failure("Circuit breaker open");
        }
        
        try {
            EmailRequest email = EmailRequest.builder()
                .to(notification.getRecipientEmail())
                .subject(content.getSubject())
                .body(content.getBody())
                .contentType(content.isHtml() ? "text/html" : "text/plain")
                .build();
            
            EmailResponse response = emailClient.send(email);
            circuitBreaker.recordSuccess();
            
            return DeliveryResult.success(response.getMessageId());
        } catch (Exception e) {
            circuitBreaker.recordFailure();
            return DeliveryResult.failure(e.getMessage());
        }
    }
    
    @Override
    public Duration getRetryDelay(int attemptCount) {
        // Exponential backoff: 1s, 2s, 4s, 8s, 16s
        return Duration.ofSeconds((long) Math.pow(2, attemptCount - 1));
    }
    
    @Override
    public int getMaxRetries() {
        return 5;
    }
}

public class SMSProvider implements ChannelProvider {
    
    private final TwilioClient twilioClient;
    
    @Override
    public DeliveryResult deliver(Notification notification, RenderedContent content) {
        try {
            Message message = Message.creator(
                new PhoneNumber(notification.getRecipientPhone()),
                new PhoneNumber(twilioConfig.getSenderNumber()),
                content.getBody()
            ).create();
            
            return DeliveryResult.success(message.getSid());
        } catch (Exception e) {
            return DeliveryResult.failure(e.getMessage());
        }
    }
}
```

---

## 📝 **Template Engine**

```java
public interface TemplateEngine {
    RenderedContent render(String templateId, Map<String, Object> params);
}

public class HandlebarsTemplateEngine implements TemplateEngine {
    
    private final Handlebars handlebars;
    private final Map<String, Template> templateCache;
    private final TemplateRepository templateRepository;
    
    public HandlebarsTemplateEngine(TemplateRepository repository) {
        this.handlebars = new Handlebars();
        this.templateCache = new ConcurrentHashMap<>();
        this.templateRepository = repository;
        
        // Register helpers
        handlebars.registerHelper("formatDate", new DateFormatHelper());
        handlebars.registerHelper("formatMoney", new MoneyFormatHelper());
        handlebars.registerHelper("pluralize", new PluralizeHelper());
    }
    
    @Override
    public RenderedContent render(String templateId, Map<String, Object> params) {
        Template template = getTemplate(templateId);
        
        try {
            String rendered = template.apply(params);
            return parseRenderedContent(rendered);
        } catch (IOException e) {
            throw new TemplateRenderException("Failed to render template: " + templateId, e);
        }
    }
    
    private Template getTemplate(String templateId) {
        return templateCache.computeIfAbsent(templateId, id -> {
            NotificationTemplate nt = templateRepository.findById(id)
                .orElseThrow(() -> new TemplateNotFoundException(id));
            
            try {
                return handlebars.compileInline(nt.getContent());
            } catch (IOException e) {
                throw new TemplateCompileException(id, e);
            }
        });
    }
}

// Template model
public class NotificationTemplate {
    private final String id;
    private final String name;
    private final Channel channel;
    private final String subject;      // For email
    private final String content;
    private final String locale;
    private final boolean active;
}

// Example template
/*
ORDER_CONFIRMATION:
---
Subject: Your order #{{orderId}} has been confirmed!
---
Hi {{customerName}},

Thank you for your order! Here are the details:

Order #: {{orderId}}
Date: {{formatDate orderDate "MMM dd, yyyy"}}
Items:
{{#each items}}
  - {{name}} x {{quantity}} = {{formatMoney price}}
{{/each}}

Total: {{formatMoney total}}

Track your order: {{trackingUrl}}

Thanks,
The {{companyName}} Team
*/
```

---

## 🔄 **Retry Mechanism**

```java
public class RetryableNotificationProcessor {
    
    private final NotificationRepository repository;
    private final Map<Channel, ChannelProvider> providers;
    private final TemplateEngine templateEngine;
    private final ScheduledExecutorService scheduler;
    
    public void processWithRetry(Notification notification) {
        ChannelProvider provider = providers.get(notification.getChannel());
        
        if (notification.getAttemptCount() >= provider.getMaxRetries()) {
            notification.setStatus(NotificationStatus.FAILED);
            notification.setErrorMessage("Max retries exceeded");
            repository.save(notification);
            return;
        }
        
        try {
            RenderedContent content = templateEngine.render(
                notification.getTemplateId(),
                notification.getTemplateParams()
            );
            
            notification.incrementAttemptCount();
            notification.setStatus(NotificationStatus.SENDING);
            repository.save(notification);
            
            DeliveryResult result = provider.deliver(notification, content);
            
            if (result.isSuccess()) {
                notification.setStatus(NotificationStatus.SENT);
                notification.setSentAt(Instant.now());
                notification.setExternalId(result.getExternalId());
            } else {
                scheduleRetry(notification, provider);
            }
        } catch (Exception e) {
            notification.setErrorMessage(e.getMessage());
            scheduleRetry(notification, provider);
        }
        
        repository.save(notification);
    }
    
    private void scheduleRetry(Notification notification, ChannelProvider provider) {
        if (notification.getAttemptCount() < provider.getMaxRetries()) {
            Duration delay = provider.getRetryDelay(notification.getAttemptCount());
            
            scheduler.schedule(
                () -> processWithRetry(notification),
                delay.toMillis(),
                TimeUnit.MILLISECONDS
            );
            
            notification.setStatus(NotificationStatus.QUEUED);
        } else {
            notification.setStatus(NotificationStatus.FAILED);
        }
    }
}
```

---

## 📊 **Priority Queue Processing**

```java
public class PriorityNotificationQueue {
    
    private final PriorityBlockingQueue<Notification> queue;
    private final ExecutorService workers;
    private final NotificationProcessor processor;
    
    public PriorityNotificationQueue(int workerCount, NotificationProcessor processor) {
        this.queue = new PriorityBlockingQueue<>(100, 
            Comparator.comparingInt(n -> n.getPriority().getOrder()));
        this.workers = Executors.newFixedThreadPool(workerCount);
        this.processor = processor;
        
        // Start worker threads
        for (int i = 0; i < workerCount; i++) {
            workers.submit(this::processLoop);
        }
    }
    
    public void enqueue(Notification notification) {
        notification.setStatus(NotificationStatus.QUEUED);
        queue.offer(notification);
    }
    
    private void processLoop() {
        while (!Thread.currentThread().isInterrupted()) {
            try {
                Notification notification = queue.take();
                processor.process(notification);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                // Log and continue
            }
        }
    }
}
```

---

## 📈 **Delivery Tracking**

```java
public class DeliveryTracker {
    
    private final NotificationRepository repository;
    private final MetricsRegistry metrics;
    
    public void trackSent(NotificationId id, String externalId) {
        Notification notification = repository.findById(id);
        notification.setStatus(NotificationStatus.SENT);
        notification.setExternalId(externalId);
        notification.setSentAt(Instant.now());
        repository.save(notification);
        
        metrics.counter("notifications.sent")
            .tag("channel", notification.getChannel().name())
            .increment();
    }
    
    public void trackDelivered(NotificationId id) {
        Notification notification = repository.findById(id);
        notification.setStatus(NotificationStatus.DELIVERED);
        notification.setDeliveredAt(Instant.now());
        repository.save(notification);
        
        Duration deliveryTime = Duration.between(
            notification.getCreatedAt(), 
            notification.getDeliveredAt()
        );
        
        metrics.timer("notifications.delivery_time")
            .tag("channel", notification.getChannel().name())
            .record(deliveryTime);
    }
    
    public void trackFailed(NotificationId id, String reason) {
        Notification notification = repository.findById(id);
        notification.setStatus(NotificationStatus.FAILED);
        notification.setErrorMessage(reason);
        repository.save(notification);
        
        metrics.counter("notifications.failed")
            .tag("channel", notification.getChannel().name())
            .tag("reason", categorizeReason(reason))
            .increment();
    }
}
```

---

## 🎯 **Best Practices**

1. **Idempotency**: Use notification ID to prevent duplicates
2. **Rate limiting**: Per-channel and per-user limits
3. **Monitoring**: Track delivery rates, latencies, failures
4. **Fallback channels**: SMS if email fails for critical alerts
5. **User preferences**: Respect notification settings

---

**Next**: [Day 13 - Feature Flags](week3/day13/README.md) →

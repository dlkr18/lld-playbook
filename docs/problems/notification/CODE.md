# Notification Service - Multi-Channel Delivery 📬

Production-ready **notification system** with **multiple channels** (Email, SMS, Push), **retry logic**, **templates**, and **priority queuing**. Critical infrastructure service.

---

## 🎯 **Core Features**

✅ **Multi-Channel** - Email, SMS, Push, In-App  
✅ **Template Engine** - Personalized messages  
✅ **Retry Logic** - Exponential backoff  
✅ **Priority Queuing** - High/Medium/Low priority  
✅ **Rate Limiting** - Per-channel limits  
✅ **Delivery Tracking** - Status monitoring  

---

## 📚 **System Architecture**

```
NotificationService
 ├── NotificationChannel (Email, SMS, Push)
 ├── TemplateEngine
 ├── RetryManager
 ├── PriorityQueue
 └── DeliveryTracker
```

---

## 💻 **Core Implementation**

### **1. Notification Service Interface:**

```java
public interface NotificationService {
    
    /**
     * Sends notification with retry logic.
     */
    NotificationResult send(Notification notification);
    
    /**
     * Sends using specific template.
     */
    NotificationResult sendFromTemplate(
        String templateId,
        Map<String, String> variables,
        List<String> recipients
    );
    
    /**
     * Gets delivery status.
     */
    DeliveryStatus getStatus(String notificationId);
}
```

### **2. Channel Strategy Pattern:**

```java
public interface NotificationChannel {
    ChannelType getType();
    boolean send(Notification notification);
    int getRateLimit();  // requests per minute
}

// Email Channel
public class EmailChannel implements NotificationChannel {
    
    private final EmailClient emailClient;
    
    @Override
    public boolean send(Notification notification) {
        Email email = Email.builder()
            .to(notification.getRecipients())
            .subject(notification.getSubject())
            .body(notification.getBody())
            .build();
        
        try {
            emailClient.send(email);
            return true;
        } catch (Exception e) {
            logger.error("Email send failed", e);
            return false;
        }
    }
    
    @Override
    public int getRateLimit() {
        return 100;  // 100 emails/min
    }
}

// SMS Channel
public class SMSChannel implements NotificationChannel {
    
    private final SMSProvider smsProvider;
    
    @Override
    public boolean send(Notification notification) {
        for (String recipient : notification.getRecipients()) {
            SMS sms = new SMS(
                recipient,
                notification.getBody()
            );
            
            try {
                smsProvider.send(sms);
            } catch (Exception e) {
                logger.error("SMS send failed for " + recipient, e);
                return false;
            }
        }
        return true;
    }
    
    @Override
    public int getRateLimit() {
        return 50;  // 50 SMS/min
    }
}
```

---

## 🔄 **Retry Logic**

```java
/**
 * Retry manager with exponential backoff.
 */
public class RetryManager {
    
    private static final int MAX_RETRIES = 3;
    private static final long INITIAL_DELAY_MS = 1000;
    
    public boolean sendWithRetry(NotificationChannel channel, Notification notification) {
        int attempt = 0;
        
        while (attempt < MAX_RETRIES) {
            try {
                boolean success = channel.send(notification);
                if (success) {
                    return true;
                }
            } catch (Exception e) {
                logger.warn("Send attempt {} failed", attempt + 1, e);
            }
            
            // Exponential backoff: 1s, 2s, 4s
            long delayMs = INITIAL_DELAY_MS * (1L << attempt);
            Thread.sleep(delayMs);
            attempt++;
        }
        
        logger.error("All retry attempts exhausted for notification {}", 
            notification.getId());
        return false;
    }
}
```

---

## 📝 **Template Engine**

```java
/**
 * Template-based notification generation.
 */
public class TemplateEngine {
    
    private final Map<String, NotificationTemplate> templates = new HashMap<>();
    
    public Notification renderTemplate(
            String templateId,
            Map<String, String> variables) {
        
        NotificationTemplate template = templates.get(templateId);
        if (template == null) {
            throw new TemplateNotFoundException(templateId);
        }
        
        // Replace placeholders with variables
        String subject = replacePlaceholders(template.getSubject(), variables);
        String body = replacePlaceholders(template.getBody(), variables);
        
        return Notification.builder()
            .subject(subject)
            .body(body)
            .channel(template.getDefaultChannel())
            .priority(template.getDefaultPriority())
            .build();
    }
    
    private String replacePlaceholders(String text, Map<String, String> vars) {
        String result = text;
        for (Map.Entry<String, String> entry : vars.entrySet()) {
            result = result.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return result;
    }
}

// Example template
NotificationTemplate welcomeEmail = NotificationTemplate.builder()
    .id("welcome_email")
    .subject("Welcome to {{app_name}}, {{user_name}}!")
    .body("Hi {{user_name}},\n\nThanks for joining {{app_name}}!")
    .defaultChannel(ChannelType.EMAIL)
    .build();
```

---

## 🎯 **Priority Queuing**

```java
/**
 * Priority-based notification queue.
 */
public class NotificationQueue {
    
    private final PriorityQueue<Notification> queue = new PriorityQueue<>(
        Comparator.comparing(Notification::getPriority).reversed()
            .thenComparing(Notification::getCreatedAt)
    );
    
    public void enqueue(Notification notification) {
        queue.offer(notification);
    }
    
    public Notification dequeue() {
        return queue.poll();
    }
}

// Priority levels
public enum Priority {
    HIGH(3),     // Security alerts, OTPs
    MEDIUM(2),   // Transactional notifications
    LOW(1);      // Marketing emails
    
    private final int value;
    
    Priority(int value) { this.value = value; }
    public int getValue() { return value; }
}
```

---

## 📝 **Usage Examples**

### **Example 1: Send Notification**

```java
NotificationService service = new NotificationService();

// Simple notification
Notification notification = Notification.builder()
    .recipients(Arrays.asList("user@example.com"))
    .subject("Account created")
    .body("Your account has been successfully created!")
    .channel(ChannelType.EMAIL)
    .priority(Priority.MEDIUM)
    .build();

NotificationResult result = service.send(notification);

if (result.isSuccess()) {
    System.out.println("Notification sent!");
} else {
    System.err.println("Failed: " + result.getError());
}
```

### **Example 2: Template-Based**

```java
// Send OTP using template
Map<String, String> variables = new HashMap<>();
variables.put("user_name", "Alice");
variables.put("otp_code", "123456");

NotificationResult result = service.sendFromTemplate(
    "otp_template",
    variables,
    Arrays.asList("+1234567890")
);
```

### **Example 3: Multi-Channel**

```java
// Send same notification via multiple channels
Notification notification = Notification.builder()
    .recipients(Arrays.asList("user@example.com", "+1234567890"))
    .subject("Order shipped")
    .body("Your order #12345 has been shipped!")
    .channels(Arrays.asList(
        ChannelType.EMAIL,
        ChannelType.SMS,
        ChannelType.PUSH
    ))
    .build();

service.send(notification);
```

---

## 🎯 **Design Patterns**

- **Strategy**: Different notification channels
- **Template Method**: Common send logic with channel-specific details
- **Observer**: Notify on delivery status changes
- **Chain of Responsibility**: Retry chain

---

## 📊 **Monitoring & Metrics**

```java
public class NotificationMetrics {
    
    // Track key metrics
    public static final Counter SENT = Counter.build()
        .name("notifications_sent_total")
        .help("Total notifications sent")
        .labelNames("channel", "status")
        .register();
    
    public static final Histogram LATENCY = Histogram.build()
        .name("notification_send_duration_seconds")
        .help("Time to send notification")
        .labelNames("channel")
        .register();
    
    public void recordSuccess(ChannelType channel, long durationMs) {
        SENT.labels(channel.name(), "success").inc();
        LATENCY.labels(channel.name()).observe(durationMs / 1000.0);
    }
    
    public void recordFailure(ChannelType channel, String error) {
        SENT.labels(channel.name(), "failure").inc();
    }
}
```

---

## 🔗 **Related Resources**

- [Day 12: Notification Service](week3/day12/README.md)
- [Observer Pattern](week2/day8/README.md)
- [Strategy Pattern](week2/day8/README.md)

---

**Implementation Guide**: Placeholder for future implementation in `src/main/java/com/you/lld/problems/notification/`

---

✨ **Reliable multi-channel notification delivery!** 📬


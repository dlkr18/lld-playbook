# WhatsApp - Messaging Platform 💬

Production-ready **messaging system** with **real-time chat**, **group messaging**, **media sharing**, **end-to-end encryption**, and **status updates**. Complete communication platform.

---

## 🎯 **Core Features**

✅ **1-to-1 Chat** - Real-time messaging  
✅ **Group Chats** - Multi-user conversations  
✅ **Media Sharing** - Images, videos, documents  
✅ **Status Updates** - 24-hour ephemeral content  
✅ **Message States** - Sent, Delivered, Read receipts  
✅ **Encryption** - End-to-end security  

---

## 💻 **Implementation Overview**

**Source Code Location**: `src/main/java/com/you/lld/problems/whatsapp/` (23 Java files)

View complete implementations in your IDE for:
- Message and chat entities
- Group management
- Media handling
- Message delivery tracking
- Status/story features

---

## 📚 **System Architecture**

### **1. Message States**

```
SENT → DELIVERED → READ
  ↓
FAILED (retry logic)
```

### **2. Chat Types**

```java
public enum ChatType {
    ONE_TO_ONE,      // Direct message
    GROUP,           // Group chat
    BROADCAST        // One-to-many (no replies)
}
```

### **3. Message Types**

```java
public enum MessageType {
    TEXT,
    IMAGE,
    VIDEO,
    AUDIO,
    DOCUMENT,
    LOCATION,
    CONTACT
}
```

---

## 📝 **Usage Examples**

### **Example 1: Send Message**

```java
WhatsAppService whatsapp = new WhatsAppService();

// Send text message
Message msg = whatsapp.sendMessage(
    senderId,
    recipientId,
    "Hello, how are you?",
    MessageType.TEXT
);

// Track delivery
MessageStatus status = whatsapp.getMessageStatus(msg.getId());
System.out.println(status);  // SENT, DELIVERED, or READ
```

### **Example 2: Group Chat**

```java
// Create group
Group techTalk = whatsapp.createGroup(
    adminUserId,
    "Tech Talk",
    Arrays.asList(user1, user2, user3)
);

// Send message to group
whatsapp.sendGroupMessage(
    adminUserId,
    techTalk.getId(),
    "Let's discuss the new feature!"
);

// Add member
whatsapp.addGroupMember(techTalk.getId(), newUserId, adminUserId);
```

### **Example 3: Status Update**

```java
// Post status (24-hour ephemeral)
Status status = whatsapp.postStatus(
    userId,
    "Having a great day!",
    statusImageUrl
);

// View status
List<Status> friendStatuses = whatsapp.getStatusUpdates(userId);

// Status auto-expires after 24 hours
```

---

## 🔒 **Message Encryption**

```java
/**
 * End-to-end encryption using Signal Protocol.
 * 
 * Key concepts:
 * - Each user has identity key pair
 * - Session keys for each conversation
 * - Forward secrecy (keys change frequently)
 * - Messages encrypted client-side
 */
public class MessageEncryption {
    
    public EncryptedMessage encrypt(Message message, PublicKey recipientKey) {
        // Generate session key
        // Encrypt message with session key
        // Encrypt session key with recipient's public key
        // Return encrypted payload
    }
    
    public Message decrypt(EncryptedMessage encrypted, PrivateKey myKey) {
        // Decrypt session key with my private key
        // Decrypt message with session key
        // Return plaintext message
    }
}
```

---

## 🎯 **Design Patterns**

- **Observer**: Real-time message notifications
- **State**: Message delivery states
- **Strategy**: Different media compression strategies
- **Factory**: Create different message types
- **Decorator**: Add encryption to messages

---

## 📊 **Delivery Guarantees**

```java
/**
 * Message delivery reliability:
 * 
 * 1. At-least-once delivery (with retries)
 * 2. Idempotent message processing (duplicate detection)
 * 3. Message queue for offline users
 * 4. Acknowledgment-based delivery
 */
public class MessageDelivery {
    
    public void deliverMessage(Message msg, UserId recipient) {
        if (isOnline(recipient)) {
            sendImmediate(msg, recipient);
        } else {
            queueForLater(msg, recipient);
        }
        
        // Retry with exponential backoff
        while (!isDelivered(msg) && retries < MAX_RETRIES) {
            sleep(exponentialBackoff(retries));
            redeliver(msg);
            retries++;
        }
    }
}
```

---

## 🔗 **Related Resources**

- [Day 8: Observer Pattern](week2/day8/README.md)
- [State Pattern](foundations/DESIGN_PATTERNS_CATALOG.md)
- [Notification Service](problems/notification/CODE.md)

---

**View Full Implementation**: `src/main/java/com/you/lld/problems/whatsapp/`

---

✨ **Complete messaging platform with real-time features!** 💬


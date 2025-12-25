# WhatsApp Chat Application - Quick Start Guide

## Overview

This is a complete Low-Level Design (LLD) implementation of a WhatsApp-like chat application with:
- One-on-one messaging
- Group chats with admin controls
- Message status tracking (sent, delivered, read)
- Media attachments
- Message features (reply, forward, star, delete, search)
- Real-time features (typing indicators, online status)
- User blocking

## Project Structure

```
src/main/java/com/you/lld/problems/whatsapp/
├── model/
│   ├── UserId.java              # Value object for user identifier
│   ├── MessageId.java           # Value object for message identifier
│   ├── ChatId.java              # Value object for chat identifier
│   ├── GroupId.java             # Value object for group identifier
│   ├── PhoneNumber.java         # Value object for phone numbers
│   ├── Attachment.java          # Value object for media attachments
│   ├── MessageContent.java      # Value object for message content
│   ├── UserStatus.java          # Enum for user online status
│   ├── MessageStatus.java       # Enum for message delivery status
│   ├── MessageType.java         # Enum for message types
│   ├── ChatType.java            # Enum for chat types
│   ├── ParticipantRole.java    # Enum for group roles
│   ├── User.java                # Aggregate root for users
│   ├── Message.java             # Entity for messages
│   ├── Chat.java                # Interface for chats (Composite pattern)
│   ├── DirectChat.java          # Direct chat implementation
│   ├── GroupChat.java           # Group chat implementation
│   └── Participant.java         # Value object for group participants
├── service/
│   ├── UserService.java         # Interface for user operations
│   ├── ChatService.java         # Interface for chat operations
│   ├── InMemoryUserService.java # In-memory user service
│   └── InMemoryChatService.java # In-memory chat service
└── WhatsAppDemo.java            # Demo application

docs/problems/whatsapp/
└── README.md                    # Detailed design documentation
```

## Running the Demo

### Compile
```bash
mvn compile
```

### Run the Demo
```bash
mvn exec:java -Dexec.mainClass="com.you.lld.problems.whatsapp.WhatsAppDemo"
```

Or using Java directly:
```bash
java -cp target/classes com.you.lld.problems.whatsapp.WhatsAppDemo
```

## Expected Output

The demo showcases:

1. **User Registration**
   - Register 4 users with phone numbers
   - Update profiles and status messages
   - Set online status

2. **Direct Messaging**
   - Create one-on-one chat
   - Send and receive messages
   - Message status updates (sent → delivered → read)
   - Unread count tracking

3. **Group Chat**
   - Create group with multiple participants
   - Admin and member roles
   - Update group metadata
   - Send group messages
   - Promote members to admin
   - Add/remove participants

4. **Message Features**
   - Reply to messages
   - Forward messages to other chats
   - Star important messages
   - Send media attachments
   - Search messages
   - Delete messages

5. **Real-time Features**
   - Online/offline status
   - Last seen timestamp
   - Typing indicators
   - Block/unblock users
   - Chat list with unread counts

## Usage Examples

### User Registration and Management

```java
// Initialize services
UserService userService = new InMemoryUserService();

// Register users
UserId alice = userService.registerUser("Alice", PhoneNumber.of("+1234567890"));
UserId bob = userService.registerUser("Bob", PhoneNumber.of("+0987654321"));

// Update profile
userService.updateProfile(alice, "Alice Wonder", "Hey there!");
userService.updateProfilePicture(alice, "https://example.com/pic.jpg");

// Set online status
userService.goOnline(alice);

// Check user status
UserStatus status = userService.getUserStatus(alice);
LocalDateTime lastSeen = userService.getLastSeen(alice);
```

### Direct Messaging

```java
ChatService chatService = new InMemoryChatService();

// Create direct chat
ChatId chatId = chatService.createDirectChat(alice, bob);

// Send text message
MessageId msgId = chatService.sendMessage(chatId, alice,
    new MessageContent("Hello Bob!"));

// Mark as delivered and read
chatService.markDelivered(msgId, bob);
chatService.markRead(msgId, bob);

// Check message status
Message msg = chatService.getMessage(msgId).get();
System.out.println("Status: " + msg.getStatus()); // READ

// Get chat history
List<Message> messages = chatService.getMessages(chatId);

// Check unread count
int unread = chatService.getUnreadCount(chatId, bob);
```

### Group Chat

```java
// Create group
Set<UserId> members = Set.of(bob, charlie, diana);
GroupId groupId = chatService.createGroup("Friends", members, alice);

// Update group metadata
chatService.updateGroupMetadata(groupId, "Friends Forever",
    "Our group chat", "icon.jpg", alice);

// Send group message
ChatId groupChatId = groupId.toChatId();
chatService.sendMessage(groupChatId, alice,
    new MessageContent("Welcome everyone!"));

// Add participant (admin only)
chatService.addParticipant(groupId, eve, alice);

// Promote to admin (admin only)
chatService.promoteToAdmin(groupId, bob, alice);

// Leave group
chatService.leaveGroup(groupId, charlie);

// Get group info
GroupChat group = (GroupChat) chatService.getChat(groupChatId).get();
int memberCount = group.getParticipantCount();
Set<UserId> admins = group.getAdmins();
```

### Message Features

```java
// Reply to message
MessageId replyId = chatService.replyToMessage(chatId, bob,
    new MessageContent("Got it!"), originalMsgId);

// Forward message
MessageId fwdId = chatService.forwardMessage(anotherChatId, 
    originalMsgId, alice);

// Star message
chatService.starMessage(msgId, alice);
List<Message> starred = chatService.getStarredMessages(alice);

// Send media
Attachment photo = new Attachment("photo.jpg", "image/jpeg",
    1024000, "https://example.com/photo.jpg");
chatService.sendMessage(chatId, alice,
    new MessageContent("Check this out!", photo));

// Search messages
List<Message> results = chatService.searchMessages(chatId, "meeting");

// Delete message (sender only)
chatService.deleteMessage(msgId, alice);
```

### Real-time Features

```java
// Typing indicators
chatService.setTyping(chatId, bob, true);
Set<UserId> typingUsers = chatService.getTypingUsers(chatId);
chatService.setTyping(chatId, bob, false);

// Block user
userService.blockUser(alice, spammer);
boolean isBlocked = userService.isBlocked(alice, spammer);

// Unblock user
userService.unblockUser(alice, spammer);

// Get user chats (sorted by last message)
List<Chat> chats = chatService.getUserChats(alice);
for (Chat chat : chats) {
    String displayName = chat.getDisplayName(alice);
    int unread = chat.getUnreadCount(alice);
    Message lastMsg = chat.getLastMessage();
}
```

## Key Design Patterns

### 1. Composite Pattern
```java
// Treat DirectChat and GroupChat uniformly
Chat chat = chatService.getChat(chatId).get();
chat.addMessage(message);           // Works for both types
List<Message> msgs = chat.getMessages();
int unread = chat.getUnreadCount(userId);
```

### 2. Builder Pattern
```java
// Flexible message construction
Message msg = new Message.Builder(senderId, content)
    .type(MessageType.TEXT)
    .replyTo(repliedToId)
    .forwardFrom(forwardedFromId)
    .build();
```

### 3. Value Objects
```java
// Type-safe identifiers prevent mixing IDs
UserId userId = UserId.generate();
MessageId msgId = MessageId.generate();
ChatId chatId = ChatId.generate();

// Cannot accidentally pass wrong ID type
chatService.sendMessage(chatId, userId, content); // Compile-time safety
```

### 4. Domain-Driven Design
```java
// Rich domain models with business logic
User user = new User(userId, name, phoneNumber);
user.blockUser(otherId);           // Business method
user.goOnline();                    // Encapsulated behavior
boolean isOnline = user.isOnline(); // Domain query
```

## Thread Safety

The in-memory implementations use `ConcurrentHashMap` and `ConcurrentHashMap.newKeySet()` for thread-safe operations:

```java
// Thread-safe storage
private final Map<ChatId, Chat> chats = new ConcurrentHashMap<>();
private final Map<UserId, Set<ChatId>> userChats = new ConcurrentHashMap<>();

// Thread-safe set operations
userChats.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet())
    .add(chatId);
```

## Message Status Flow

```
SENT ──────> DELIVERED ──────> READ
  │                │              │
  │                │              │
  └────────────────┴──────────────┴─────> DELETED
```

Status transitions are validated:
```java
public boolean canTransitionTo(MessageStatus newStatus) {
    if (this == DELETED) return false;
    if (newStatus == DELETED) return true;
    return newStatus.ordinal() > this.ordinal();
}
```

## Testing Ideas

1. **Unit Tests**
   - User creation and profile updates
   - Message creation and status transitions
   - Chat creation (direct and group)
   - Group participant management

2. **Integration Tests**
   - End-to-end messaging flow
   - Group chat with multiple participants
   - Message delivery and read receipts
   - Search and filter functionality

3. **Concurrency Tests**
   - Multiple users sending messages simultaneously
   - Concurrent group operations
   - Race conditions in status updates

## Extensions

### Easy Extensions
1. **Message Reactions**: Add emoji reactions to messages
2. **Voice Messages**: Support audio message type
3. **Message Editing**: Allow editing sent messages
4. **Disappearing Messages**: Auto-delete after timeout
5. **Broadcast Lists**: One-to-many messaging

### Advanced Extensions
1. **End-to-End Encryption**: Add encryption layer
2. **Voice/Video Calls**: WebRTC integration
3. **Stories/Status**: Temporary content sharing
4. **Message Sync**: Multi-device support
5. **Push Notifications**: Real-time notification system

## Performance Considerations

### Current Implementation (In-Memory)
- **Get Message**: O(1) - HashMap lookup
- **Send Message**: O(1) - Add to list
- **Get Chat Messages**: O(n) - Iterate messages
- **Search Messages**: O(n) - Linear scan
- **Get User Chats**: O(m) - m = number of user's chats

### Optimizations for Scale
1. **Pagination**: Implement cursor-based pagination
2. **Indexing**: Add search indices for message content
3. **Caching**: Cache frequently accessed chats
4. **Sharding**: Partition by user or chat ID
5. **Message Queue**: Async message delivery

## Key Learning Points

1. **Composite Pattern**: Unified interface for direct and group chats
2. **Value Objects**: Type safety and immutability
3. **Builder Pattern**: Flexible object construction
4. **Domain-Driven Design**: Rich domain models
5. **Thread Safety**: Concurrent data structures
6. **State Machine**: Message status transitions
7. **SOLID Principles**: Clean, extensible architecture

## Related Resources

- [WhatsApp System Design](https://www.youtube.com/watch?v=vvhC64hQZMk)
- [Composite Pattern](https://refactoring.guru/design-patterns/composite)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Java Concurrency](https://docs.oracle.com/javase/tutorial/essential/concurrency/)

## Troubleshooting

### Common Issues

1. **User not found**
   ```
   IllegalArgumentException: User not found
   ```
   Solution: Ensure user is registered before operations

2. **Not a participant**
   ```
   IllegalArgumentException: Sender is not a participant
   ```
   Solution: Add user to chat before sending messages

3. **Not an admin**
   ```
   IllegalArgumentException: Only admins can add participants
   ```
   Solution: Use admin UserId for group operations

4. **Circular chat lookup**
   - Direct chat between same users already exists
   - Use existing chat instead of creating new one

## Next Steps

1. Review the detailed [design documentation](README.md)
2. Explore the source code in `src/main/java/com/you/lld/problems/whatsapp/`
3. Run the demo and observe the output
4. Implement additional features
5. Add tests for edge cases
6. Consider persistence layer (database)
7. Add REST API layer for client access

## Summary

This implementation demonstrates:
- ✅ Clean separation of concerns (model, service)
- ✅ SOLID principles and design patterns
- ✅ Type-safe domain model
- ✅ Thread-safe operations
- ✅ Comprehensive feature set
- ✅ Production-ready code quality

Perfect for:
- Learning LLD concepts
- Interview preparation
- Portfolio projects
- System design practice






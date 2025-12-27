# whatsapp - Complete Implementation

## 📁 Project Structure (23 files)

```
whatsapp/
├── WhatsAppDemo.java
├── model/Attachment.java
├── model/Chat.java
├── model/ChatId.java
├── model/ChatType.java
├── model/DirectChat.java
├── model/GroupChat.java
├── model/GroupId.java
├── model/Message.java
├── model/MessageContent.java
├── model/MessageId.java
├── model/MessageStatus.java
├── model/MessageType.java
├── model/Participant.java
├── model/ParticipantRole.java
├── model/PhoneNumber.java
├── model/User.java
├── model/UserId.java
├── model/UserStatus.java
├── service/ChatService.java
├── service/InMemoryChatService.java
├── service/InMemoryUserService.java
├── service/UserService.java
```

## 📝 Source Code

### 📄 `WhatsAppDemo.java`

<details>
<summary>📄 Click to view WhatsAppDemo.java</summary>

```java
package com.you.lld.problems.whatsapp;

import com.you.lld.problems.whatsapp.model.*;
import com.you.lld.problems.whatsapp.service.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Demo application showcasing WhatsApp chat functionality.
 */
public class WhatsAppDemo {
    private static final DateTimeFormatter TIME_FORMATTER = 
        DateTimeFormatter.ofPattern("HH:mm");
    
    public static void main(String[] args) {
        System.out.println("=== WhatsApp Chat Application Demo ===\n");
        
        // Initialize services
        UserService userService = new InMemoryUserService();
        ChatService chatService = new InMemoryChatService();
        
        // Demo 1: User Registration
        demonstrateUserRegistration(userService);
        
        // Demo 2: Direct Messaging
        demonstrateDirectMessaging(userService, chatService);
        
        // Demo 3: Group Chat
        demonstrateGroupChat(userService, chatService);
        
        // Demo 4: Message Features
        demonstrateMessageFeatures(userService, chatService);
        
        // Demo 5: Real-time Features
        demonstrateRealTimeFeatures(userService, chatService);
        
        System.out.println("\n=== Demo Complete ===");
    }
    
    private static void demonstrateUserRegistration(UserService userService) {
        System.out.println("--- Demo 1: User Registration ---");
        
        UserId alice = userService.registerUser("Alice", PhoneNumber.of("+1234567890"));
        UserId bob = userService.registerUser("Bob", PhoneNumber.of("+0987654321"));
        UserId charlie = userService.registerUser("Charlie", PhoneNumber.of("+1122334455"));
        UserId diana = userService.registerUser("Diana", PhoneNumber.of("+5544332211"));
        
        System.out.println("Registered 4 users: Alice, Bob, Charlie, Diana");
        
        // Update profiles
        userService.updateProfile(alice, "Alice Wonder", "Living my best life!");
        userService.updateProfilePicture(alice, "https://example.com/alice.jpg");
        
        User aliceUser = userService.getUser(alice).get();
        System.out.println("\nAlice's profile:");
        System.out.println("  Name: " + aliceUser.getName());
        System.out.println("  Phone: " + aliceUser.getPhoneNumber().getFormatted());
        System.out.println("  Status: " + aliceUser.getStatusMessage());
        System.out.println("  Picture: " + aliceUser.getProfilePicture());
        
        // Set online status
        userService.goOnline(alice);
        userService.goOnline(bob);
        System.out.println("\nAlice and Bob are now online");
        System.out.println();
    }
    
    private static void demonstrateDirectMessaging(UserService userService, 
                                                    ChatService chatService) {
        System.out.println("--- Demo 2: Direct Messaging ---");
        
        UserId alice = userService.getUserByPhoneNumber(PhoneNumber.of("+1234567890")).get().getId();
        UserId bob = userService.getUserByPhoneNumber(PhoneNumber.of("+0987654321")).get().getId();
        
        // Create direct chat
        ChatId chatId = chatService.createDirectChat(alice, bob);
        System.out.println("Created direct chat between Alice and Bob");
        
        // Send messages
        MessageId msg1 = chatService.sendMessage(chatId, alice, 
            new MessageContent("Hey Bob! How are you?"));
        System.out.println("\nAlice: Hey Bob! How are you? " + 
            MessageStatus.SENT.getSymbol());
        
        MessageId msg2 = chatService.sendMessage(chatId, bob,
            new MessageContent("Hi Alice! I'm good, thanks!"));
        System.out.println("Bob: Hi Alice! I'm good, thanks! " + 
            MessageStatus.SENT.getSymbol());
        
        // Mark as read
        chatService.markRead(msg1, bob);
        chatService.markRead(msg2, alice);
        
        Message message1 = chatService.getMessage(msg1).get();
        System.out.println("\nMessage status updated to: " + 
            message1.getStatus() + " " + message1.getStatus().getSymbol());
        
        // Check unread count
        int unreadCount = chatService.getUnreadCount(chatId, alice);
        System.out.println("Alice's unread count: " + unreadCount);
        
        // Get all messages
        List<Message> messages = chatService.getMessages(chatId);
        System.out.println("\nChat history (" + messages.size() + " messages):");
        for (Message msg : messages) {
            User sender = userService.getUser(msg.getSenderId()).get();
            String time = msg.getTimestamp().format(TIME_FORMATTER);
            String content = msg.getContent().getText().orElse("[Media]");
            String status = msg.getStatus().getSymbol();
            System.out.println("  [" + time + "] " + sender.getName() + ": " + 
                             content + " " + status);
        }
        System.out.println();
    }
    
    private static void demonstrateGroupChat(UserService userService, 
                                             ChatService chatService) {
        System.out.println("--- Demo 3: Group Chat ---");
        
        UserId alice = userService.getUserByPhoneNumber(PhoneNumber.of("+1234567890")).get().getId();
        UserId bob = userService.getUserByPhoneNumber(PhoneNumber.of("+0987654321")).get().getId();
        UserId charlie = userService.getUserByPhoneNumber(PhoneNumber.of("+1122334455")).get().getId();
        UserId diana = userService.getUserByPhoneNumber(PhoneNumber.of("+5544332211")).get().getId();
        
        // Create group
        Set<UserId> members = new HashSet<>();
        members.add(bob);
        members.add(charlie);
        members.add(diana);
        GroupId groupId = chatService.createGroup("Friends Forever", members, alice);
        System.out.println("Created group 'Friends Forever' with 4 members");
        
        GroupChat group = (GroupChat) chatService.getChat(groupId.toChatId()).get();
        System.out.println("  Admins: " + group.getAdmins().size());
        System.out.println("  Members: " + group.getParticipantCount());
        
        // Update group metadata
        chatService.updateGroupMetadata(groupId, "Friends Forever 🎉", 
            "Best friends group!", "https://example.com/group.jpg", alice);
        System.out.println("\nUpdated group name to: " + group.getName());
        
        // Send group messages
        ChatId groupChatId = groupId.toChatId();
        chatService.sendMessage(groupChatId, alice, 
            new MessageContent("Welcome to the group everyone!"));
        chatService.sendMessage(groupChatId, bob,
            new MessageContent("Thanks Alice! Excited to be here!"));
        chatService.sendMessage(groupChatId, charlie,
            new MessageContent("Hello everyone! 👋"));
        chatService.sendMessage(groupChatId, diana,
            new MessageContent("Hey team!"));
        
        System.out.println("\nGroup chat messages:");
        List<Message> groupMessages = chatService.getMessages(groupChatId);
        for (Message msg : groupMessages) {
            User sender = userService.getUser(msg.getSenderId()).get();
            String content = msg.getContent().getText().orElse("[Media]");
            String status = msg.getStatus().getSymbol();
            System.out.println("  " + sender.getName() + ": " + content + " " + status);
        }
        
        // Promote member to admin
        chatService.promoteToAdmin(groupId, bob, alice);
        System.out.println("\nBob promoted to admin");
        System.out.println("Current admins: " + group.getAdmins().size());
        
        // Add new participant
        UserId eve = userService.registerUser("Eve", PhoneNumber.of("+9876543210"));
        chatService.addParticipant(groupId, eve, alice);
        System.out.println("\nEve added to the group");
        System.out.println("Total members: " + group.getParticipantCount());
        
        // Charlie leaves group
        chatService.leaveGroup(groupId, charlie);
        System.out.println("\nCharlie left the group");
        System.out.println("Remaining members: " + group.getParticipantCount());
        System.out.println();
    }
    
    private static void demonstrateMessageFeatures(UserService userService, 
                                                    ChatService chatService) {
        System.out.println("--- Demo 4: Message Features ---");
        
        UserId alice = userService.getUserByPhoneNumber(PhoneNumber.of("+1234567890")).get().getId();
        UserId bob = userService.getUserByPhoneNumber(PhoneNumber.of("+0987654321")).get().getId();
        UserId diana = userService.getUserByPhoneNumber(PhoneNumber.of("+5544332211")).get().getId();
        
        ChatId aliceBobChat = chatService.createDirectChat(alice, bob);
        ChatId aliceDianaChat = chatService.createDirectChat(alice, diana);
        
        // Reply to message
        MessageId originalMsg = chatService.sendMessage(aliceBobChat, bob,
            new MessageContent("What time is the meeting?"));
        MessageId replyMsg = chatService.replyToMessage(aliceBobChat, alice,
            new MessageContent("It's at 3 PM"), originalMsg);
        
        Message reply = chatService.getMessage(replyMsg).get();
        System.out.println("Reply sent:");
        System.out.println("  Original: What time is the meeting?");
        System.out.println("  Reply: " + reply.getContent().getText().get());
        System.out.println("  Is reply: " + reply.isReply());
        
        // Forward message
        MessageId fwdMsg = chatService.forwardMessage(aliceDianaChat, originalMsg, alice);
        Message forwarded = chatService.getMessage(fwdMsg).get();
        System.out.println("\nMessage forwarded to Diana");
        System.out.println("  Is forwarded: " + forwarded.isForwarded());
        
        // Star message
        chatService.starMessage(originalMsg, alice);
        System.out.println("\nAlice starred a message");
        List<Message> starred = chatService.getStarredMessages(alice);
        System.out.println("Alice's starred messages: " + starred.size());
        
        // Send media message
        Attachment photo = new Attachment("vacation.jpg", "image/jpeg", 
            2048576, "https://example.com/photos/vacation.jpg");
        MessageId mediaMsg = chatService.sendMessage(aliceBobChat, alice,
            new MessageContent("Check out this photo!", photo));
        
        Message media = chatService.getMessage(mediaMsg).get();
        System.out.println("\nMedia message sent:");
        System.out.println("  Type: " + media.getType());
        System.out.println("  Has text: " + media.getContent().hasText());
        System.out.println("  Has attachment: " + media.getContent().hasAttachment());
        if (media.getContent().hasAttachment()) {
            Attachment att = media.getContent().getAttachment().get();
            System.out.println("  File: " + att.getFileName() + 
                             " (" + att.getFormattedSize() + ")");
        }
        
        // Search messages
        chatService.sendMessage(aliceBobChat, bob, 
            new MessageContent("Let's meet for coffee tomorrow"));
        chatService.sendMessage(aliceBobChat, alice,
            new MessageContent("Great! Coffee at the usual place?"));
        
        List<Message> searchResults = chatService.searchMessages(aliceBobChat, "coffee");
        System.out.println("\nSearch results for 'coffee': " + searchResults.size() + " messages");
        for (Message msg : searchResults) {
            User sender = userService.getUser(msg.getSenderId()).get();
            System.out.println("  " + sender.getName() + ": " + 
                             msg.getContent().getText().get());
        }
        
        // Delete message
        MessageId toDelete = chatService.sendMessage(aliceBobChat, alice,
            new MessageContent("Oops, typo!"));
        chatService.deleteMessage(toDelete, alice);
        Message deleted = chatService.getMessage(toDelete).get();
        System.out.println("\nMessage deleted:");
        System.out.println("  Is deleted: " + deleted.isDeleted());
        System.out.println("  Status: " + deleted.getStatus());
        System.out.println();
    }
    
    private static void demonstrateRealTimeFeatures(UserService userService,
                                                     ChatService chatService) {
        System.out.println("--- Demo 5: Real-time Features ---");
        
        UserId alice = userService.getUserByPhoneNumber(PhoneNumber.of("+1234567890")).get().getId();
        UserId bob = userService.getUserByPhoneNumber(PhoneNumber.of("+0987654321")).get().getId();
        
        // Online status
        System.out.println("User status:");
        System.out.println("  Alice: " + userService.getUserStatus(alice));
        System.out.println("  Bob: " + userService.getUserStatus(bob));
        
        userService.goOffline(alice);
        System.out.println("\nAlice went offline");
        System.out.println("  Alice status: " + userService.getUserStatus(alice));
        System.out.println("  Last seen: " + 
            userService.getLastSeen(alice).format(TIME_FORMATTER));
        
        // Typing indicators
        ChatId chatId = chatService.getUserChats(alice).get(0).getId();
        chatService.setTyping(chatId, bob, true);
        System.out.println("\nBob is typing...");
        
        Set<UserId> typingUsers = chatService.getTypingUsers(chatId);
        System.out.println("Typing users: " + typingUsers.size());
        for (UserId userId : typingUsers) {
            User user = userService.getUser(userId).get();
            System.out.println("  " + user.getName() + " is typing...");
        }
        
        chatService.setTyping(chatId, bob, false);
        System.out.println("\nBob stopped typing");
        System.out.println("Typing users: " + chatService.getTypingUsers(chatId).size());
        
        // Blocking
        UserId diana = userService.getUserByPhoneNumber(PhoneNumber.of("+5544332211")).get().getId();
        userService.blockUser(alice, diana);
        System.out.println("\nAlice blocked Diana");
        System.out.println("Is Diana blocked: " + userService.isBlocked(alice, diana));
        System.out.println("Alice's blocked users: " + 
            userService.getBlockedUsers(alice).size());
        
        userService.unblockUser(alice, diana);
        System.out.println("\nAlice unblocked Diana");
        System.out.println("Is Diana blocked: " + userService.isBlocked(alice, diana));
        
        // Chat list
        System.out.println("\nAlice's chats:");
        List<Chat> aliceChats = chatService.getUserChats(alice);
        for (Chat chat : aliceChats) {
            String displayName = chat.getDisplayName(alice);
            int unread = chat.getUnreadCount(alice);
            Message lastMsg = chat.getLastMessage();
            String lastMsgPreview = lastMsg != null ? 
                lastMsg.getContent().getText().orElse("[Media]") : "No messages";
            
            System.out.println("  " + chat.getType() + ": " + displayName);
            System.out.println("    Last message: " + lastMsgPreview);
            System.out.println("    Unread: " + unread);
        }
        System.out.println();
    }
}

```

</details>

### 📄 `model/Attachment.java`

<details>
<summary>📄 Click to view model/Attachment.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

import java.util.Objects;

/**
 * Value object representing a media attachment.
 * Immutable.
 */
public final class Attachment {
    private final String fileName;
    private final String fileType;
    private final long fileSize;
    private final String url;

    public Attachment(String fileName, String fileType, long fileSize, String url) {
        if (fileName == null || fileName.trim().isEmpty()) {
            throw new IllegalArgumentException("File name cannot be null or empty");
        }
        if (fileSize <= 0) {
            throw new IllegalArgumentException("File size must be positive");
        }
        if (url == null || url.trim().isEmpty()) {
            throw new IllegalArgumentException("URL cannot be null or empty");
        }
        
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.url = url;
    }

    public String getFileName() {
        return fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public long getFileSize() {
        return fileSize;
    }

    public String getUrl() {
        return url;
    }

    public String getFormattedSize() {
        if (fileSize < 1024) {
            return fileSize + " B";
        } else if (fileSize < 1024 * 1024) {
            return String.format("%.1f KB", fileSize / 1024.0);
        } else {
            return String.format("%.1f MB", fileSize / (1024.0 * 1024.0));
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Attachment that = (Attachment) o;
        return fileSize == that.fileSize &&
               Objects.equals(fileName, that.fileName) &&
               Objects.equals(fileType, that.fileType) &&
               Objects.equals(url, that.url);
    }

    @Override
    public int hashCode() {
        return Objects.hash(fileName, fileType, fileSize, url);
    }

    @Override
    public String toString() {
        return "Attachment{" +
               "fileName='" + fileName + '\'' +
               ", fileType='" + fileType + '\'' +
               ", fileSize=" + getFormattedSize() +
               '}';
    }
}





```

</details>

### 📄 `model/Chat.java`

<details>
<summary>📄 Click to view model/Chat.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

/**
 * Interface representing a chat/conversation.
 * Uses Composite pattern to treat direct and group chats uniformly.
 */
public interface Chat {
    /**
     * Get the unique identifier for this chat.
     */
    ChatId getId();

    /**
     * Get the type of chat (DIRECT or GROUP).
     */
    ChatType getType();

    /**
     * Get all participants in this chat.
     */
    Set<UserId> getParticipants();

    /**
     * Check if a user is a participant in this chat.
     */
    boolean isParticipant(UserId userId);

    /**
     * Add a message to this chat.
     */
    void addMessage(Message message);

    /**
     * Get all messages in this chat.
     */
    List<Message> getMessages();

    /**
     * Get messages with pagination.
     */
    List<Message> getMessages(int limit, int offset);

    /**
     * Get the last message in this chat.
     */
    Message getLastMessage();

    /**
     * Get unread message count for a specific user.
     */
    int getUnreadCount(UserId userId);

    /**
     * Mark messages as read for a specific user.
     */
    void markMessagesAsRead(UserId userId, LocalDateTime readUntil);

    /**
     * Get when the chat was created.
     */
    LocalDateTime getCreatedAt();

    /**
     * Get the display name for this chat (from perspective of a user).
     */
    String getDisplayName(UserId forUser);
}





```

</details>

### 📄 `model/ChatId.java`

<details>
<summary>📄 Click to view model/ChatId.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Value object representing a unique chat identifier.
 * Immutable and type-safe.
 */
public final class ChatId {
    private final String id;

    private ChatId(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Chat ID cannot be null or empty");
        }
        this.id = id;
    }

    public static ChatId generate() {
        return new ChatId(UUID.randomUUID().toString());
    }

    public static ChatId of(String id) {
        return new ChatId(id);
    }

    public String getValue() {
        return id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatId chatId = (ChatId) o;
        return Objects.equals(id, chatId.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "ChatId{" + id + '}';
    }
}





```

</details>

### 📄 `model/ChatType.java`

<details>
<summary>📄 Click to view model/ChatType.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

/**
 * Enumeration representing types of chats.
 */
public enum ChatType {
    DIRECT("Direct Chat"),
    GROUP("Group Chat");

    private final String displayName;

    ChatType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}




```

</details>

### 📄 `model/DirectChat.java`

<details>
<summary>📄 Click to view model/DirectChat.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Concrete implementation of Chat for one-on-one conversations.
 */
public class DirectChat implements Chat {
    private final ChatId id;
    private final UserId user1;
    private final UserId user2;
    private final List<Message> messages;
    private final LocalDateTime createdAt;
    private final Map<UserId, LocalDateTime> lastReadAt;

    public DirectChat(UserId user1, UserId user2) {
        if (user1 == null || user2 == null) {
            throw new IllegalArgumentException("User IDs cannot be null");
        }
        if (user1.equals(user2)) {
            throw new IllegalArgumentException("Cannot create direct chat with same user");
        }
        
        this.id = ChatId.generate();
        this.user1 = user1;
        this.user2 = user2;
        this.messages = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.lastReadAt = new HashMap<>();
        this.lastReadAt.put(user1, createdAt);
        this.lastReadAt.put(user2, createdAt);
    }

    @Override
    public ChatId getId() {
        return id;
    }

    @Override
    public ChatType getType() {
        return ChatType.DIRECT;
    }

    @Override
    public Set<UserId> getParticipants() {
        Set<UserId> participants = new HashSet<>();
        participants.add(user1);
        participants.add(user2);
        return participants;
    }

    @Override
    public boolean isParticipant(UserId userId) {
        return user1.equals(userId) || user2.equals(userId);
    }

    @Override
    public void addMessage(Message message) {
        if (message == null) {
            throw new IllegalArgumentException("Message cannot be null");
        }
        if (!isParticipant(message.getSenderId())) {
            throw new IllegalArgumentException("Sender is not a participant in this chat");
        }
        
        messages.add(message);
        
        // Auto-deliver to the other user
        UserId recipient = getOtherUser(message.getSenderId());
        message.markDelivered(recipient);
    }

    @Override
    public List<Message> getMessages() {
        return new ArrayList<>(messages);
    }

    @Override
    public List<Message> getMessages(int limit, int offset) {
        if (limit <= 0 || offset < 0) {
            throw new IllegalArgumentException("Invalid limit or offset");
        }
        
        int fromIndex = Math.min(offset, messages.size());
        int toIndex = Math.min(offset + limit, messages.size());
        
        return new ArrayList<>(messages.subList(fromIndex, toIndex));
    }

    @Override
    public Message getLastMessage() {
        if (messages.isEmpty()) {
            return null;
        }
        return messages.get(messages.size() - 1);
    }

    @Override
    public int getUnreadCount(UserId userId) {
        if (!isParticipant(userId)) {
            return 0;
        }
        
        LocalDateTime lastRead = lastReadAt.getOrDefault(userId, createdAt);
        
        return (int) messages.stream()
            .filter(msg -> !msg.getSenderId().equals(userId))
            .filter(msg -> msg.getTimestamp().isAfter(lastRead))
            .filter(msg -> !msg.isDeleted())
            .count();
    }

    @Override
    public void markMessagesAsRead(UserId userId, LocalDateTime readUntil) {
        if (!isParticipant(userId)) {
            throw new IllegalArgumentException("User is not a participant in this chat");
        }
        
        lastReadAt.put(userId, readUntil);
        
        // Mark individual messages as read
        messages.stream()
            .filter(msg -> !msg.getSenderId().equals(userId))
            .filter(msg -> msg.getTimestamp().isBefore(readUntil) || 
                          msg.getTimestamp().equals(readUntil))
            .forEach(msg -> msg.markRead(userId));
    }

    @Override
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @Override
    public String getDisplayName(UserId forUser) {
        // In a real system, would fetch the other user's name
        UserId otherUser = getOtherUser(forUser);
        return "Direct Chat with " + otherUser.getValue().substring(0, 8);
    }

    public UserId getUser1() {
        return user1;
    }

    public UserId getUser2() {
        return user2;
    }

    public UserId getOtherUser(UserId userId) {
        if (user1.equals(userId)) {
            return user2;
        } else if (user2.equals(userId)) {
            return user1;
        }
        throw new IllegalArgumentException("User is not a participant in this chat");
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DirectChat that = (DirectChat) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "DirectChat{" +
               "id=" + id +
               ", participants=[" + user1 + ", " + user2 + "]" +
               ", messageCount=" + messages.size() +
               '}';
    }
}





```

</details>

### 📄 `model/GroupChat.java`

<details>
<summary>📄 Click to view model/GroupChat.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Concrete implementation of Chat for group conversations.
 * Supports multiple participants with roles.
 */
public class GroupChat implements Chat {
    private final GroupId groupId;
    private final ChatId chatId;
    private String name;
    private String description;
    private String groupIcon;
    private final Map<UserId, Participant> participants;
    private final List<Message> messages;
    private final LocalDateTime createdAt;

    public GroupChat(GroupId groupId, String name) {
        if (groupId == null) {
            throw new IllegalArgumentException("Group ID cannot be null");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Group name cannot be null or empty");
        }
        
        this.groupId = groupId;
        this.chatId = groupId.toChatId();
        this.name = name;
        this.description = "";
        this.participants = new HashMap<>();
        this.messages = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
    }

    @Override
    public ChatId getId() {
        return chatId;
    }

    public GroupId getGroupId() {
        return groupId;
    }

    @Override
    public ChatType getType() {
        return ChatType.GROUP;
    }

    @Override
    public Set<UserId> getParticipants() {
        return new HashSet<>(participants.keySet());
    }

    @Override
    public boolean isParticipant(UserId userId) {
        return participants.containsKey(userId);
    }

    public Participant getParticipant(UserId userId) {
        return participants.get(userId);
    }

    public Set<Participant> getAllParticipants() {
        return new HashSet<>(participants.values());
    }

    public Set<UserId> getAdmins() {
        return participants.values().stream()
            .filter(Participant::isAdmin)
            .map(Participant::getUserId)
            .collect(Collectors.toSet());
    }

    public boolean isAdmin(UserId userId) {
        Participant participant = participants.get(userId);
        return participant != null && participant.isAdmin();
    }

    // Group management methods
    public void addParticipant(UserId userId, ParticipantRole role) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (participants.containsKey(userId)) {
            throw new IllegalArgumentException("User is already a participant");
        }
        
        participants.put(userId, new Participant(userId, role));
    }

    public void removeParticipant(UserId userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        
        Participant removed = participants.remove(userId);
        if (removed == null) {
            throw new IllegalArgumentException("User is not a participant");
        }
        
        // Ensure at least one admin remains
        if (removed.isAdmin() && getAdmins().isEmpty() && !participants.isEmpty()) {
            // Promote the first member to admin
            participants.values().iterator().next().promoteToAdmin();
        }
    }

    public void promoteToAdmin(UserId userId) {
        Participant participant = participants.get(userId);
        if (participant == null) {
            throw new IllegalArgumentException("User is not a participant");
        }
        participant.promoteToAdmin();
    }

    public void demoteToMember(UserId userId) {
        Participant participant = participants.get(userId);
        if (participant == null) {
            throw new IllegalArgumentException("User is not a participant");
        }
        
        // Ensure at least one admin remains
        if (participant.isAdmin()) {
            long adminCount = participants.values().stream()
                .filter(Participant::isAdmin)
                .count();
            
            if (adminCount <= 1) {
                throw new IllegalStateException("Cannot demote the last admin");
            }
        }
        
        participant.demoteToMember();
    }

    public void updateMetadata(String name, String description, String groupIcon) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name;
        }
        if (description != null) {
            this.description = description;
        }
        if (groupIcon != null) {
            this.groupIcon = groupIcon;
        }
    }

    // Message methods
    @Override
    public void addMessage(Message message) {
        if (message == null) {
            throw new IllegalArgumentException("Message cannot be null");
        }
        if (!isParticipant(message.getSenderId())) {
            throw new IllegalArgumentException("Sender is not a participant in this group");
        }
        
        messages.add(message);
        
        // Mark as delivered to all participants except sender
        for (UserId userId : participants.keySet()) {
            if (!userId.equals(message.getSenderId())) {
                message.markDelivered(userId);
            }
        }
    }

    @Override
    public List<Message> getMessages() {
        return new ArrayList<>(messages);
    }

    @Override
    public List<Message> getMessages(int limit, int offset) {
        if (limit <= 0 || offset < 0) {
            throw new IllegalArgumentException("Invalid limit or offset");
        }
        
        int fromIndex = Math.min(offset, messages.size());
        int toIndex = Math.min(offset + limit, messages.size());
        
        return new ArrayList<>(messages.subList(fromIndex, toIndex));
    }

    @Override
    public Message getLastMessage() {
        if (messages.isEmpty()) {
            return null;
        }
        return messages.get(messages.size() - 1);
    }

    @Override
    public int getUnreadCount(UserId userId) {
        if (!isParticipant(userId)) {
            return 0;
        }
        
        Participant participant = participants.get(userId);
        LocalDateTime lastRead = participant.getLastReadAt();
        
        return (int) messages.stream()
            .filter(msg -> !msg.getSenderId().equals(userId))
            .filter(msg -> msg.getTimestamp().isAfter(lastRead))
            .filter(msg -> !msg.isDeleted())
            .count();
    }

    @Override
    public void markMessagesAsRead(UserId userId, LocalDateTime readUntil) {
        if (!isParticipant(userId)) {
            throw new IllegalArgumentException("User is not a participant in this group");
        }
        
        Participant participant = participants.get(userId);
        participant.updateLastRead();
        
        // Mark individual messages as read
        messages.stream()
            .filter(msg -> !msg.getSenderId().equals(userId))
            .filter(msg -> msg.getTimestamp().isBefore(readUntil) || 
                          msg.getTimestamp().equals(readUntil))
            .forEach(msg -> msg.markRead(userId));
    }

    @Override
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @Override
    public String getDisplayName(UserId forUser) {
        return name;
    }

    // Getters
    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getGroupIcon() {
        return groupIcon;
    }

    public int getParticipantCount() {
        return participants.size();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GroupChat groupChat = (GroupChat) o;
        return Objects.equals(groupId, groupChat.groupId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(groupId);
    }

    @Override
    public String toString() {
        return "GroupChat{" +
               "id=" + groupId +
               ", name='" + name + '\'' +
               ", participants=" + participants.size() +
               ", messages=" + messages.size() +
               '}';
    }
}





```

</details>

### 📄 `model/GroupId.java`

<details>
<summary>📄 Click to view model/GroupId.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Value object representing a unique group identifier.
 * Immutable and type-safe.
 */
public final class GroupId {
    private final String id;

    private GroupId(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Group ID cannot be null or empty");
        }
        this.id = id;
    }

    public static GroupId generate() {
        return new GroupId(UUID.randomUUID().toString());
    }

    public static GroupId of(String id) {
        return new GroupId(id);
    }

    public String getValue() {
        return id;
    }

    public ChatId toChatId() {
        return ChatId.of(id);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GroupId groupId = (GroupId) o;
        return Objects.equals(id, groupId.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "GroupId{" + id + '}';
    }
}





```

</details>

### 📄 `model/Message.java`

<details>
<summary>📄 Click to view model/Message.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

/**
 * Entity representing a message in the chat application.
 * Tracks message content, status, and metadata.
 */
public class Message {
    private final MessageId id;
    private final UserId senderId;
    private final MessageContent content;
    private final MessageType type;
    private final LocalDateTime timestamp;
    private MessageStatus status;
    private final MessageId repliedToId;
    private final MessageId forwardedFromId;
    private boolean isStarred;
    private boolean isDeleted;
    
    // Track delivery and read status per user (for group chats)
    private final Map<UserId, LocalDateTime> deliveredTo;
    private final Map<UserId, LocalDateTime> readBy;

    private Message(Builder builder) {
        this.id = builder.id;
        this.senderId = builder.senderId;
        this.content = builder.content;
        this.type = builder.type;
        this.timestamp = builder.timestamp;
        this.status = MessageStatus.SENT;
        this.repliedToId = builder.repliedToId;
        this.forwardedFromId = builder.forwardedFromId;
        this.isStarred = false;
        this.isDeleted = false;
        this.deliveredTo = new HashMap<>();
        this.readBy = new HashMap<>();
    }

    // Getters
    public MessageId getId() {
        return id;
    }

    public UserId getSenderId() {
        return senderId;
    }

    public MessageContent getContent() {
        return content;
    }

    public MessageType getType() {
        return type;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public MessageStatus getStatus() {
        return status;
    }

    public Optional<MessageId> getRepliedToId() {
        return Optional.ofNullable(repliedToId);
    }

    public Optional<MessageId> getForwardedFromId() {
        return Optional.ofNullable(forwardedFromId);
    }

    public boolean isStarred() {
        return isStarred;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public Map<UserId, LocalDateTime> getDeliveredTo() {
        return new HashMap<>(deliveredTo);
    }

    public Map<UserId, LocalDateTime> getReadBy() {
        return new HashMap<>(readBy);
    }

    // Business methods
    public void markDelivered(UserId userId) {
        if (!isDeleted) {
            deliveredTo.put(userId, LocalDateTime.now());
            updateOverallStatus();
        }
    }

    public void markRead(UserId userId) {
        if (!isDeleted) {
            readBy.put(userId, LocalDateTime.now());
            deliveredTo.putIfAbsent(userId, LocalDateTime.now());
            updateOverallStatus();
        }
    }

    private void updateOverallStatus() {
        if (!readBy.isEmpty()) {
            status = MessageStatus.READ;
        } else if (!deliveredTo.isEmpty()) {
            status = MessageStatus.DELIVERED;
        }
    }

    public void star() {
        this.isStarred = true;
    }

    public void unstar() {
        this.isStarred = false;
    }

    public void delete() {
        this.isDeleted = true;
        this.status = MessageStatus.DELETED;
    }

    public boolean isReply() {
        return repliedToId != null;
    }

    public boolean isForwarded() {
        return forwardedFromId != null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Message message = (Message) o;
        return Objects.equals(id, message.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Message{" +
               "id=" + id +
               ", senderId=" + senderId +
               ", type=" + type +
               ", status=" + status +
               ", timestamp=" + timestamp +
               '}';
    }

    // Builder pattern for flexible construction
    public static class Builder {
        private final MessageId id;
        private final UserId senderId;
        private final MessageContent content;
        private MessageType type;
        private LocalDateTime timestamp;
        private MessageId repliedToId;
        private MessageId forwardedFromId;

        public Builder(UserId senderId, MessageContent content) {
            if (senderId == null) {
                throw new IllegalArgumentException("Sender ID cannot be null");
            }
            if (content == null) {
                throw new IllegalArgumentException("Content cannot be null");
            }
            
            this.id = MessageId.generate();
            this.senderId = senderId;
            this.content = content;
            this.type = content.inferType();
            this.timestamp = LocalDateTime.now();
        }

        public Builder type(MessageType type) {
            this.type = type;
            return this;
        }

        public Builder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public Builder replyTo(MessageId repliedToId) {
            this.repliedToId = repliedToId;
            return this;
        }

        public Builder forwardFrom(MessageId forwardedFromId) {
            this.forwardedFromId = forwardedFromId;
            return this;
        }

        public Message build() {
            return new Message(this);
        }
    }
}





```

</details>

### 📄 `model/MessageContent.java`

<details>
<summary>📄 Click to view model/MessageContent.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

import java.util.Objects;
import java.util.Optional;

/**
 * Value object representing message content.
 * Can contain text, attachment, or both.
 * Immutable.
 */
public final class MessageContent {
    private final String text;
    private final Attachment attachment;

    public MessageContent(String text) {
        this(text, null);
    }

    public MessageContent(Attachment attachment) {
        this(null, attachment);
    }

    public MessageContent(String text, Attachment attachment) {
        if ((text == null || text.trim().isEmpty()) && attachment == null) {
            throw new IllegalArgumentException("Message must have either text or attachment");
        }
        
        this.text = text;
        this.attachment = attachment;
    }

    public Optional<String> getText() {
        return Optional.ofNullable(text);
    }

    public Optional<Attachment> getAttachment() {
        return Optional.ofNullable(attachment);
    }

    public boolean hasText() {
        return text != null && !text.trim().isEmpty();
    }

    public boolean hasAttachment() {
        return attachment != null;
    }

    public MessageType inferType() {
        if (!hasAttachment()) {
            return MessageType.TEXT;
        }
        
        String fileType = attachment.getFileType();
        if (fileType == null) {
            return MessageType.DOCUMENT;
        }
        
        fileType = fileType.toLowerCase();
        if (fileType.startsWith("image/")) {
            return MessageType.IMAGE;
        } else if (fileType.startsWith("video/")) {
            return MessageType.VIDEO;
        } else if (fileType.startsWith("audio/")) {
            return MessageType.AUDIO;
        } else {
            return MessageType.DOCUMENT;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MessageContent that = (MessageContent) o;
        return Objects.equals(text, that.text) &&
               Objects.equals(attachment, that.attachment);
    }

    @Override
    public int hashCode() {
        return Objects.hash(text, attachment);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("MessageContent{");
        if (hasText()) {
            sb.append("text='").append(text).append('\'');
        }
        if (hasAttachment()) {
            if (hasText()) {
                sb.append(", ");
            }
            sb.append("attachment=").append(attachment);
        }
        sb.append('}');
        return sb.toString();
    }
}





```

</details>

### 📄 `model/MessageId.java`

<details>
<summary>📄 Click to view model/MessageId.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Value object representing a unique message identifier.
 * Immutable and type-safe.
 */
public final class MessageId {
    private final String id;

    private MessageId(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Message ID cannot be null or empty");
        }
        this.id = id;
    }

    public static MessageId generate() {
        return new MessageId(UUID.randomUUID().toString());
    }

    public static MessageId of(String id) {
        return new MessageId(id);
    }

    public String getValue() {
        return id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MessageId messageId = (MessageId) o;
        return Objects.equals(id, messageId.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "MessageId{" + id + '}';
    }
}





```

</details>

### 📄 `model/MessageStatus.java`

<details>
<summary>📄 Click to view model/MessageStatus.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

/**
 * Enumeration representing message delivery status.
 * Follows WhatsApp's status progression: SENT → DELIVERED → READ
 */
public enum MessageStatus {
    SENT("Sent", "✓"),           // Single tick
    DELIVERED("Delivered", "✓✓"), // Double tick
    READ("Read", "✓✓"),          // Blue ticks
    DELETED("Deleted", "🗑");    // Deleted message

    private final String displayName;
    private final String symbol;

    MessageStatus(String displayName, String symbol) {
        this.displayName = displayName;
        this.symbol = symbol;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getSymbol() {
        return symbol;
    }

    public boolean canTransitionTo(MessageStatus newStatus) {
        if (this == DELETED) {
            return false; // Cannot transition from deleted
        }
        
        if (newStatus == DELETED) {
            return true; // Can always delete
        }
        
        // Normal progression: SENT -> DELIVERED -> READ
        return newStatus.ordinal() > this.ordinal();
    }
}





```

</details>

### 📄 `model/MessageType.java`

<details>
<summary>📄 Click to view model/MessageType.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

/**
 * Enumeration representing types of messages.
 */
public enum MessageType {
    TEXT("Text"),
    IMAGE("Image"),
    VIDEO("Video"),
    AUDIO("Audio"),
    DOCUMENT("Document"),
    LOCATION("Location"),
    CONTACT("Contact");

    private final String displayName;

    MessageType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean isMedia() {
        return this == IMAGE || this == VIDEO || this == AUDIO || this == DOCUMENT;
    }
}





```

</details>

### 📄 `model/Participant.java`

<details>
<summary>📄 Click to view model/Participant.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Value object representing a participant in a group chat.
 * Tracks role and activity timestamps.
 */
public class Participant {
    private final UserId userId;
    private ParticipantRole role;
    private final LocalDateTime joinedAt;
    private LocalDateTime lastReadAt;

    public Participant(UserId userId, ParticipantRole role) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (role == null) {
            throw new IllegalArgumentException("Role cannot be null");
        }
        
        this.userId = userId;
        this.role = role;
        this.joinedAt = LocalDateTime.now();
        this.lastReadAt = LocalDateTime.now();
    }

    // Getters
    public UserId getUserId() {
        return userId;
    }

    public ParticipantRole getRole() {
        return role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public LocalDateTime getLastReadAt() {
        return lastReadAt;
    }

    // Business methods
    public void promoteToAdmin() {
        this.role = ParticipantRole.ADMIN;
    }

    public void demoteToMember() {
        this.role = ParticipantRole.MEMBER;
    }

    public void updateLastRead() {
        this.lastReadAt = LocalDateTime.now();
    }

    public boolean isAdmin() {
        return role == ParticipantRole.ADMIN;
    }

    public boolean canManageGroup() {
        return role.canManageGroup();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Participant that = (Participant) o;
        return Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }

    @Override
    public String toString() {
        return "Participant{" +
               "userId=" + userId +
               ", role=" + role +
               ", joinedAt=" + joinedAt +
               '}';
    }
}





```

</details>

### 📄 `model/ParticipantRole.java`

<details>
<summary>📄 Click to view model/ParticipantRole.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

/**
 * Enumeration representing participant roles in a group.
 */
public enum ParticipantRole {
    ADMIN("Admin"),
    MEMBER("Member");

    private final String displayName;

    ParticipantRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean canManageGroup() {
        return this == ADMIN;
    }

    public boolean canAddMembers() {
        return this == ADMIN;
    }

    public boolean canRemoveMembers() {
        return this == ADMIN;
    }
}





```

</details>

### 📄 `model/PhoneNumber.java`

<details>
<summary>📄 Click to view model/PhoneNumber.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

import java.util.Objects;
import java.util.regex.Pattern;

/**
 * Value object representing a phone number.
 * Validates format and ensures immutability.
 */
public final class PhoneNumber {
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+?\\d{8,15}$");
    private final String number;

    private PhoneNumber(String number) {
        if (number == null || number.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }
        
        String normalized = number.replaceAll("[\\s-]", "");
        if (!PHONE_PATTERN.matcher(normalized).matches()) {
            throw new IllegalArgumentException("Invalid phone number format: " + number);
        }
        
        this.number = normalized;
    }

    public static PhoneNumber of(String number) {
        return new PhoneNumber(number);
    }

    public String getValue() {
        return number;
    }

    public String getFormatted() {
        // Simple formatting for display
        if (number.startsWith("+")) {
            return number;
        }
        return "+" + number;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PhoneNumber that = (PhoneNumber) o;
        return Objects.equals(number, that.number);
    }

    @Override
    public int hashCode() {
        return Objects.hash(number);
    }

    @Override
    public String toString() {
        return "PhoneNumber{" + getFormatted() + '}';
    }
}

```

</details>

### 📄 `model/User.java`

<details>
<summary>📄 Click to view model/User.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Aggregate root representing a user in the chat application.
 * Encapsulates user profile, status, and blocking functionality.
 */
public class User {
    private final UserId id;
    private String name;
    private final PhoneNumber phoneNumber;
    private String profilePicture;
    private String statusMessage;
    private UserStatus status;
    private LocalDateTime lastSeen;
    private final Set<UserId> blockedUsers;
    private final LocalDateTime createdAt;

    public User(UserId id, String name, PhoneNumber phoneNumber) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        if (phoneNumber == null) {
            throw new IllegalArgumentException("Phone number cannot be null");
        }
        
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.statusMessage = "Hey there! I'm using WhatsApp";
        this.status = UserStatus.OFFLINE;
        this.lastSeen = LocalDateTime.now();
        this.blockedUsers = new HashSet<>();
        this.createdAt = LocalDateTime.now();
    }

    // Getters
    public UserId getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public PhoneNumber getPhoneNumber() {
        return phoneNumber;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public UserStatus getStatus() {
        return status;
    }

    public LocalDateTime getLastSeen() {
        return lastSeen;
    }

    public Set<UserId> getBlockedUsers() {
        return new HashSet<>(blockedUsers);
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Business methods
    public void updateProfile(String name, String statusMessage) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name;
        }
        if (statusMessage != null) {
            this.statusMessage = statusMessage;
        }
    }

    public void updateProfilePicture(String pictureUrl) {
        this.profilePicture = pictureUrl;
    }

    public void updateStatus(UserStatus newStatus) {
        if (newStatus == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
        this.status = newStatus;
        this.lastSeen = LocalDateTime.now();
    }

    public void goOnline() {
        updateStatus(UserStatus.ONLINE);
    }

    public void goOffline() {
        updateStatus(UserStatus.OFFLINE);
    }

    public void blockUser(UserId userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (userId.equals(this.id)) {
            throw new IllegalArgumentException("Cannot block yourself");
        }
        blockedUsers.add(userId);
    }

    public void unblockUser(UserId userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        blockedUsers.remove(userId);
    }

    public boolean hasBlocked(UserId userId) {
        return blockedUsers.contains(userId);
    }

    public boolean isOnline() {
        return status == UserStatus.ONLINE;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "User{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", phoneNumber=" + phoneNumber +
               ", status=" + status +
               '}';
    }
}





```

</details>

### 📄 `model/UserId.java`

<details>
<summary>📄 Click to view model/UserId.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Value object representing a unique user identifier.
 * Immutable and type-safe.
 */
public final class UserId {
    private final String id;

    private UserId(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }
        this.id = id;
    }

    public static UserId generate() {
        return new UserId(UUID.randomUUID().toString());
    }

    public static UserId of(String id) {
        return new UserId(id);
    }

    public String getValue() {
        return id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserId userId = (UserId) o;
        return Objects.equals(id, userId.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "UserId{" + id + '}';
    }
}





```

</details>

### 📄 `model/UserStatus.java`

<details>
<summary>📄 Click to view model/UserStatus.java</summary>

```java
package com.you.lld.problems.whatsapp.model;

/**
 * Enumeration representing user's online status.
 */
public enum UserStatus {
    ONLINE("Online"),
    OFFLINE("Offline"),
    AWAY("Away");

    private final String displayName;

    UserStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}





```

</details>

### 📄 `service/ChatService.java`

<details>
<summary>📄 Click to view service/ChatService.java</summary>

```java
package com.you.lld.problems.whatsapp.service;

import com.you.lld.problems.whatsapp.model.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Service interface for managing chats and messages.
 */
public interface ChatService {
    // Chat Management
    ChatId createDirectChat(UserId user1, UserId user2);
    GroupId createGroup(String name, Set<UserId> participants, UserId adminId);
    Optional<Chat> getChat(ChatId chatId);
    List<Chat> getUserChats(UserId userId);
    void deleteChat(ChatId chatId, UserId userId);
    
    // Group Operations
    void addParticipant(GroupId groupId, UserId userId, UserId requesterId);
    void removeParticipant(GroupId groupId, UserId userId, UserId requesterId);
    void leaveGroup(GroupId groupId, UserId userId);
    void promoteToAdmin(GroupId groupId, UserId userId, UserId requesterId);
    void demoteToMember(GroupId groupId, UserId userId, UserId requesterId);
    void updateGroupMetadata(GroupId groupId, String name, String description, 
                            String icon, UserId requesterId);
    
    // Message Operations
    MessageId sendMessage(ChatId chatId, UserId senderId, MessageContent content);
    MessageId replyToMessage(ChatId chatId, UserId senderId, MessageContent content, 
                            MessageId repliedToId);
    MessageId forwardMessage(ChatId targetChatId, MessageId messageId, UserId forwarderId);
    
    Optional<Message> getMessage(MessageId messageId);
    void markDelivered(MessageId messageId, UserId userId);
    void markRead(MessageId messageId, UserId userId);
    void deleteMessage(MessageId messageId, UserId userId);
    void starMessage(MessageId messageId, UserId userId);
    void unstarMessage(MessageId messageId, UserId userId);
    
    // Message Retrieval
    List<Message> getMessages(ChatId chatId);
    List<Message> getMessages(ChatId chatId, int limit, int offset);
    List<Message> getStarredMessages(UserId userId);
    List<Message> searchMessages(ChatId chatId, String query);
    int getUnreadCount(ChatId chatId, UserId userId);
    
    // Real-time Features
    void setTyping(ChatId chatId, UserId userId, boolean isTyping);
    Set<UserId> getTypingUsers(ChatId chatId);
}





```

</details>

### 📄 `service/InMemoryChatService.java`

<details>
<summary>📄 Click to view service/InMemoryChatService.java</summary>

```java
package com.you.lld.problems.whatsapp.service;

import com.you.lld.problems.whatsapp.model.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * In-memory implementation of ChatService.
 * Thread-safe using ConcurrentHashMap.
 */
public class InMemoryChatService implements ChatService {
    private final Map<ChatId, Chat> chats;
    private final Map<GroupId, GroupChat> groups;
    private final Map<UserId, Set<ChatId>> userChats;
    private final Map<MessageId, Message> messages;
    private final Map<UserId, Set<MessageId>> starredMessages;
    private final Map<ChatId, Set<UserId>> typingUsers;

    public InMemoryChatService() {
        this.chats = new ConcurrentHashMap<>();
        this.groups = new ConcurrentHashMap<>();
        this.userChats = new ConcurrentHashMap<>();
        this.messages = new ConcurrentHashMap<>();
        this.starredMessages = new ConcurrentHashMap<>();
        this.typingUsers = new ConcurrentHashMap<>();
    }

    @Override
    public ChatId createDirectChat(UserId user1, UserId user2) {
        // Check if chat already exists
        Optional<ChatId> existingChat = findDirectChat(user1, user2);
        if (existingChat.isPresent()) {
            return existingChat.get();
        }
        
        DirectChat chat = new DirectChat(user1, user2);
        ChatId chatId = chat.getId();
        
        chats.put(chatId, chat);
        userChats.computeIfAbsent(user1, k -> ConcurrentHashMap.newKeySet()).add(chatId);
        userChats.computeIfAbsent(user2, k -> ConcurrentHashMap.newKeySet()).add(chatId);
        
        return chatId;
    }

    @Override
    public GroupId createGroup(String name, Set<UserId> participantIds, UserId adminId) {
        GroupId groupId = GroupId.generate();
        GroupChat group = new GroupChat(groupId, name);
        
        // Add admin first
        group.addParticipant(adminId, ParticipantRole.ADMIN);
        
        // Add other participants
        for (UserId userId : participantIds) {
            if (!userId.equals(adminId)) {
                group.addParticipant(userId, ParticipantRole.MEMBER);
            }
        }
        
        ChatId chatId = group.getId();
        chats.put(chatId, group);
        groups.put(groupId, group);
        
        // Update user chats for all participants
        for (UserId userId : group.getParticipants()) {
            userChats.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet()).add(chatId);
        }
        
        return groupId;
    }

    @Override
    public Optional<Chat> getChat(ChatId chatId) {
        return Optional.ofNullable(chats.get(chatId));
    }

    @Override
    public List<Chat> getUserChats(UserId userId) {
        Set<ChatId> chatIds = userChats.getOrDefault(userId, Collections.emptySet());
        return chatIds.stream()
            .map(chats::get)
            .filter(Objects::nonNull)
            .sorted((c1, c2) -> {
                Message m1 = c1.getLastMessage();
                Message m2 = c2.getLastMessage();
                if (m1 == null && m2 == null) return 0;
                if (m1 == null) return 1;
                if (m2 == null) return -1;
                return m2.getTimestamp().compareTo(m1.getTimestamp());
            })
            .collect(Collectors.toList());
    }

    @Override
    public void deleteChat(ChatId chatId, UserId userId) {
        Chat chat = getChatOrThrow(chatId);
        
        if (!chat.isParticipant(userId)) {
            throw new IllegalArgumentException("User is not a participant in this chat");
        }
        
        // For direct chats, just remove from user's chat list
        // For group chats, call leaveGroup
        if (chat.getType() == ChatType.DIRECT) {
            userChats.getOrDefault(userId, Collections.emptySet()).remove(chatId);
        } else {
            GroupChat group = (GroupChat) chat;
            leaveGroup(group.getGroupId(), userId);
        }
    }

    @Override
    public void addParticipant(GroupId groupId, UserId userId, UserId requesterId) {
        GroupChat group = getGroupOrThrow(groupId);
        
        if (!group.isAdmin(requesterId)) {
            throw new IllegalArgumentException("Only admins can add participants");
        }
        
        group.addParticipant(userId, ParticipantRole.MEMBER);
        userChats.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet())
            .add(group.getId());
    }

    @Override
    public void removeParticipant(GroupId groupId, UserId userId, UserId requesterId) {
        GroupChat group = getGroupOrThrow(groupId);
        
        if (!group.isAdmin(requesterId)) {
            throw new IllegalArgumentException("Only admins can remove participants");
        }
        
        if (userId.equals(requesterId)) {
            throw new IllegalArgumentException("Use leaveGroup to remove yourself");
        }
        
        group.removeParticipant(userId);
        userChats.getOrDefault(userId, Collections.emptySet()).remove(group.getId());
    }

    @Override
    public void leaveGroup(GroupId groupId, UserId userId) {
        GroupChat group = getGroupOrThrow(groupId);
        
        if (!group.isParticipant(userId)) {
            throw new IllegalArgumentException("User is not a participant");
        }
        
        group.removeParticipant(userId);
        userChats.getOrDefault(userId, Collections.emptySet()).remove(group.getId());
        
        // If group is empty, remove it completely
        if (group.getParticipantCount() == 0) {
            chats.remove(group.getId());
            groups.remove(groupId);
        }
    }

    @Override
    public void promoteToAdmin(GroupId groupId, UserId userId, UserId requesterId) {
        GroupChat group = getGroupOrThrow(groupId);
        
        if (!group.isAdmin(requesterId)) {
            throw new IllegalArgumentException("Only admins can promote members");
        }
        
        group.promoteToAdmin(userId);
    }

    @Override
    public void demoteToMember(GroupId groupId, UserId userId, UserId requesterId) {
        GroupChat group = getGroupOrThrow(groupId);
        
        if (!group.isAdmin(requesterId)) {
            throw new IllegalArgumentException("Only admins can demote members");
        }
        
        group.demoteToMember(userId);
    }

    @Override
    public void updateGroupMetadata(GroupId groupId, String name, String description, 
                                    String icon, UserId requesterId) {
        GroupChat group = getGroupOrThrow(groupId);
        
        if (!group.isAdmin(requesterId)) {
            throw new IllegalArgumentException("Only admins can update group metadata");
        }
        
        group.updateMetadata(name, description, icon);
    }

    @Override
    public MessageId sendMessage(ChatId chatId, UserId senderId, MessageContent content) {
        Chat chat = getChatOrThrow(chatId);
        
        if (!chat.isParticipant(senderId)) {
            throw new IllegalArgumentException("Sender is not a participant in this chat");
        }
        
        Message message = new Message.Builder(senderId, content).build();
        chat.addMessage(message);
        messages.put(message.getId(), message);
        
        return message.getId();
    }

    @Override
    public MessageId replyToMessage(ChatId chatId, UserId senderId, 
                                    MessageContent content, MessageId repliedToId) {
        Chat chat = getChatOrThrow(chatId);
        
        if (!chat.isParticipant(senderId)) {
            throw new IllegalArgumentException("Sender is not a participant in this chat");
        }
        
        // Verify replied message exists and is in this chat
        Message repliedTo = getMessageOrThrow(repliedToId);
        
        Message message = new Message.Builder(senderId, content)
            .replyTo(repliedToId)
            .build();
        
        chat.addMessage(message);
        messages.put(message.getId(), message);
        
        return message.getId();
    }

    @Override
    public MessageId forwardMessage(ChatId targetChatId, MessageId messageId, 
                                    UserId forwarderId) {
        Chat targetChat = getChatOrThrow(targetChatId);
        Message originalMessage = getMessageOrThrow(messageId);
        
        if (!targetChat.isParticipant(forwarderId)) {
            throw new IllegalArgumentException("Forwarder is not a participant in target chat");
        }
        
        Message forwardedMessage = new Message.Builder(forwarderId, originalMessage.getContent())
            .forwardFrom(messageId)
            .build();
        
        targetChat.addMessage(forwardedMessage);
        messages.put(forwardedMessage.getId(), forwardedMessage);
        
        return forwardedMessage.getId();
    }

    @Override
    public Optional<Message> getMessage(MessageId messageId) {
        return Optional.ofNullable(messages.get(messageId));
    }

    @Override
    public void markDelivered(MessageId messageId, UserId userId) {
        Message message = getMessageOrThrow(messageId);
        message.markDelivered(userId);
    }

    @Override
    public void markRead(MessageId messageId, UserId userId) {
        Message message = getMessageOrThrow(messageId);
        message.markRead(userId);
    }

    @Override
    public void deleteMessage(MessageId messageId, UserId userId) {
        Message message = getMessageOrThrow(messageId);
        
        if (!message.getSenderId().equals(userId)) {
            throw new IllegalArgumentException("Only sender can delete the message");
        }
        
        message.delete();
    }

    @Override
    public void starMessage(MessageId messageId, UserId userId) {
        Message message = getMessageOrThrow(messageId);
        message.star();
        starredMessages.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet())
            .add(messageId);
    }

    @Override
    public void unstarMessage(MessageId messageId, UserId userId) {
        Message message = getMessageOrThrow(messageId);
        message.unstar();
        starredMessages.getOrDefault(userId, Collections.emptySet()).remove(messageId);
    }

    @Override
    public List<Message> getMessages(ChatId chatId) {
        Chat chat = getChatOrThrow(chatId);
        return chat.getMessages();
    }

    @Override
    public List<Message> getMessages(ChatId chatId, int limit, int offset) {
        Chat chat = getChatOrThrow(chatId);
        return chat.getMessages(limit, offset);
    }

    @Override
    public List<Message> getStarredMessages(UserId userId) {
        Set<MessageId> messageIds = starredMessages.getOrDefault(userId, Collections.emptySet());
        return messageIds.stream()
            .map(messages::get)
            .filter(Objects::nonNull)
            .filter(Message::isStarred)
            .sorted(Comparator.comparing(Message::getTimestamp).reversed())
            .collect(Collectors.toList());
    }

    @Override
    public List<Message> searchMessages(ChatId chatId, String query) {
        Chat chat = getChatOrThrow(chatId);
        String lowerQuery = query.toLowerCase();
        
        return chat.getMessages().stream()
            .filter(msg -> !msg.isDeleted())
            .filter(msg -> msg.getContent().getText()
                .map(text -> text.toLowerCase().contains(lowerQuery))
                .orElse(false))
            .collect(Collectors.toList());
    }

    @Override
    public int getUnreadCount(ChatId chatId, UserId userId) {
        Chat chat = getChatOrThrow(chatId);
        return chat.getUnreadCount(userId);
    }

    @Override
    public void setTyping(ChatId chatId, UserId userId, boolean isTyping) {
        Chat chat = getChatOrThrow(chatId);
        
        if (!chat.isParticipant(userId)) {
            throw new IllegalArgumentException("User is not a participant in this chat");
        }
        
        Set<UserId> typing = typingUsers.computeIfAbsent(chatId, 
            k -> ConcurrentHashMap.newKeySet());
        
        if (isTyping) {
            typing.add(userId);
        } else {
            typing.remove(userId);
        }
    }

    @Override
    public Set<UserId> getTypingUsers(ChatId chatId) {
        return new HashSet<>(typingUsers.getOrDefault(chatId, Collections.emptySet()));
    }

    // Helper methods
    private Optional<ChatId> findDirectChat(UserId user1, UserId user2) {
        Set<ChatId> user1Chats = userChats.getOrDefault(user1, Collections.emptySet());
        
        return user1Chats.stream()
            .map(chats::get)
            .filter(chat -> chat instanceof DirectChat)
            .map(chat -> (DirectChat) chat)
            .filter(chat -> (chat.getUser1().equals(user1) && chat.getUser2().equals(user2)) ||
                           (chat.getUser1().equals(user2) && chat.getUser2().equals(user1)))
            .map(Chat::getId)
            .findFirst();
    }

    private Chat getChatOrThrow(ChatId chatId) {
        return getChat(chatId)
            .orElseThrow(() -> new IllegalArgumentException("Chat not found: " + chatId));
    }

    private GroupChat getGroupOrThrow(GroupId groupId) {
        return Optional.ofNullable(groups.get(groupId))
            .orElseThrow(() -> new IllegalArgumentException("Group not found: " + groupId));
    }

    private Message getMessageOrThrow(MessageId messageId) {
        return getMessage(messageId)
            .orElseThrow(() -> new IllegalArgumentException("Message not found: " + messageId));
    }
}





```

</details>

### 📄 `service/InMemoryUserService.java`

<details>
<summary>📄 Click to view service/InMemoryUserService.java</summary>

```java
package com.you.lld.problems.whatsapp.service;

import com.you.lld.problems.whatsapp.model.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory implementation of UserService.
 * Thread-safe using ConcurrentHashMap.
 */
public class InMemoryUserService implements UserService {
    private final Map<UserId, User> users;
    private final Map<PhoneNumber, UserId> phoneToUserId;

    public InMemoryUserService() {
        this.users = new ConcurrentHashMap<>();
        this.phoneToUserId = new ConcurrentHashMap<>();
    }

    @Override
    public UserId registerUser(String name, PhoneNumber phoneNumber) {
        if (phoneToUserId.containsKey(phoneNumber)) {
            throw new IllegalArgumentException("User with this phone number already exists");
        }
        
        UserId userId = UserId.generate();
        User user = new User(userId, name, phoneNumber);
        
        users.put(userId, user);
        phoneToUserId.put(phoneNumber, userId);
        
        return userId;
    }

    @Override
    public Optional<User> getUser(UserId userId) {
        return Optional.ofNullable(users.get(userId));
    }

    @Override
    public Optional<User> getUserByPhoneNumber(PhoneNumber phoneNumber) {
        UserId userId = phoneToUserId.get(phoneNumber);
        return userId != null ? getUser(userId) : Optional.empty();
    }

    @Override
    public void updateProfile(UserId userId, String name, String statusMessage) {
        User user = getUserOrThrow(userId);
        user.updateProfile(name, statusMessage);
    }

    @Override
    public void updateProfilePicture(UserId userId, String pictureUrl) {
        User user = getUserOrThrow(userId);
        user.updateProfilePicture(pictureUrl);
    }

    @Override
    public void updateStatus(UserId userId, UserStatus status) {
        User user = getUserOrThrow(userId);
        user.updateStatus(status);
    }

    @Override
    public UserStatus getUserStatus(UserId userId) {
        User user = getUserOrThrow(userId);
        return user.getStatus();
    }

    @Override
    public LocalDateTime getLastSeen(UserId userId) {
        User user = getUserOrThrow(userId);
        return user.getLastSeen();
    }

    @Override
    public void goOnline(UserId userId) {
        User user = getUserOrThrow(userId);
        user.goOnline();
    }

    @Override
    public void goOffline(UserId userId) {
        User user = getUserOrThrow(userId);
        user.goOffline();
    }

    @Override
    public void blockUser(UserId userId, UserId blockedUserId) {
        User user = getUserOrThrow(userId);
        getUserOrThrow(blockedUserId); // Verify blocked user exists
        user.blockUser(blockedUserId);
    }

    @Override
    public void unblockUser(UserId userId, UserId blockedUserId) {
        User user = getUserOrThrow(userId);
        user.unblockUser(blockedUserId);
    }

    @Override
    public boolean isBlocked(UserId userId, UserId otherUserId) {
        User user = getUserOrThrow(userId);
        return user.hasBlocked(otherUserId);
    }

    @Override
    public Set<UserId> getBlockedUsers(UserId userId) {
        User user = getUserOrThrow(userId);
        return user.getBlockedUsers();
    }

    private User getUserOrThrow(UserId userId) {
        return getUser(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    }
}





```

</details>

### 📄 `service/UserService.java`

<details>
<summary>📄 Click to view service/UserService.java</summary>

```java
package com.you.lld.problems.whatsapp.service;

import com.you.lld.problems.whatsapp.model.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

/**
 * Service interface for managing users.
 */
public interface UserService {
    // User Management
    UserId registerUser(String name, PhoneNumber phoneNumber);
    Optional<User> getUser(UserId userId);
    Optional<User> getUserByPhoneNumber(PhoneNumber phoneNumber);
    void updateProfile(UserId userId, String name, String statusMessage);
    void updateProfilePicture(UserId userId, String pictureUrl);
    
    // Status Management
    void updateStatus(UserId userId, UserStatus status);
    UserStatus getUserStatus(UserId userId);
    LocalDateTime getLastSeen(UserId userId);
    void goOnline(UserId userId);
    void goOffline(UserId userId);
    
    // Contacts & Blocking
    void blockUser(UserId userId, UserId blockedUserId);
    void unblockUser(UserId userId, UserId blockedUserId);
    boolean isBlocked(UserId userId, UserId otherUserId);
    Set<UserId> getBlockedUsers(UserId userId);
}





```

</details>


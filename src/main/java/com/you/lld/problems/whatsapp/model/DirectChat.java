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






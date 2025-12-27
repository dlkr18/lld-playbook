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







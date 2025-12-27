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







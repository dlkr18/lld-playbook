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






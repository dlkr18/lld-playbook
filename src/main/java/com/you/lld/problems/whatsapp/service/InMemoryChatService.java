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






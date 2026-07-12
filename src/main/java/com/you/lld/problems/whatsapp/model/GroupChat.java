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







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






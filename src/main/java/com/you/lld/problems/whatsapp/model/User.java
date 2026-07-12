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







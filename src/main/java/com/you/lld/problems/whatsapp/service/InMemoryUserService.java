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






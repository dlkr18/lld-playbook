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







package com.you.lld.problems.socialnetwork.model;

import java.time.LocalDateTime;
import java.util.*;

public class User {
    private final String userId;
    private String name;
    private String email;
    private String bio;
    private String profilePicture;
    private Set<String> friendIds;
    private Set<String> followerIds;
    private Set<String> followingIds;
    private Set<String> blockedUserIds;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime lastActive;
    
    public User(String userId, String name, String email) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.friendIds = new HashSet<>();
        this.followerIds = new HashSet<>();
        this.followingIds = new HashSet<>();
        this.blockedUserIds = new HashSet<>();
        this.status = UserStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
        this.lastActive = LocalDateTime.now();
    }
    
    // Getters and setters
    public String getUserId() { return userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    
    // Friend management
    public Set<String> getFriendIds() { return new HashSet<>(friendIds); }
    public void addFriend(String friendId) { friendIds.add(friendId); }
    public void removeFriend(String friendId) { friendIds.remove(friendId); }
    public boolean isFriend(String userId) { return friendIds.contains(userId); }
    
    // Follower management
    public Set<String> getFollowerIds() { return new HashSet<>(followerIds); }
    public void addFollower(String followerId) { followerIds.add(followerId); }
    public void removeFollower(String followerId) { followerIds.remove(followerId); }
    
    // Following management
    public Set<String> getFollowingIds() { return new HashSet<>(followingIds); }
    public void follow(String userId) { followingIds.add(userId); }
    public void unfollow(String userId) { followingIds.remove(userId); }
    public boolean isFollowing(String userId) { return followingIds.contains(userId); }
    
    // Block management
    public Set<String> getBlockedUserIds() { return new HashSet<>(blockedUserIds); }
    public void blockUser(String userId) { blockedUserIds.add(userId); }
    public void unblockUser(String userId) { blockedUserIds.remove(userId); }
    public boolean isBlocked(String userId) { return blockedUserIds.contains(userId); }
    
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getLastActive() { return lastActive; }
    public void updateLastActive() { this.lastActive = LocalDateTime.now(); }
}

package com.you.lld.problems.socialnetwork.api;

import com.you.lld.problems.socialnetwork.model.*;
import java.util.List;

public interface SocialNetworkService {
    // User management
    User createUser(String name, String email);
    User getUser(String userId);
    void updateUser(String userId, User updatedUser);
    void deleteUser(String userId);
    
    // Friend management
    FriendRequest sendFriendRequest(String senderId, String receiverId);
    void acceptFriendRequest(String requestId);
    void rejectFriendRequest(String requestId);
    void removeFriend(String userId1, String userId2);
    List<User> getFriends(String userId);
    List<FriendRequest> getPendingFriendRequests(String userId);
    
    // Follow management
    void follow(String followerId, String followingId);
    void unfollow(String followerId, String followingId);
    List<User> getFollowers(String userId);
    List<User> getFollowing(String userId);
    
    // Block management
    void blockUser(String userId, String blockedUserId);
    void unblockUser(String userId, String unblockedUserId);
    
    // Post management
    Post createPost(String authorId, String content, PostVisibility visibility);
    Post getPost(String postId);
    void updatePost(String postId, String newContent);
    void deletePost(String postId);
    Post sharePost(String userId, String postId);
    
    // Interaction management
    void likePost(String userId, String postId);
    void unlikePost(String userId, String postId);
    Comment commentOnPost(String userId, String postId, String content);
    Comment replyToComment(String userId, String commentId, String content);
    void likeComment(String userId, String commentId);
    
    // Feed management
    List<Post> getNewsfeed(String userId, int limit);
    List<Post> getUserPosts(String userId);
    
    // Notification management
    List<Notification> getNotifications(String userId, boolean unreadOnly);
    void markNotificationAsRead(String notificationId);
    
    // Messaging
    Message sendMessage(String senderId, String receiverId, String content);
    List<Message> getConversation(String userId1, String userId2);
    
    // Search
    List<User> searchUsers(String query);
    List<Post> searchPosts(String query);
}

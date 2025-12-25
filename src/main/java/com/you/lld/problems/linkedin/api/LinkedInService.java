package com.you.lld.problems.linkedin.api;
import com.you.lld.problems.linkedin.model.*;
import java.util.List;

public interface LinkedInService {
    // User Management
    User registerUser(String name, String email);
    User getUser(String userId);
    void updateProfile(String userId, User updatedUser);
    
    // Connections
    ConnectionRequest sendConnectionRequest(String senderId, String receiverId, String message);
    void acceptConnection(String requestId);
    void rejectConnection(String requestId);
    List<User> getConnections(String userId);
    List<ConnectionRequest> getPendingRequests(String userId);
    
    // Follow
    void follow(String followerId, String followingId);
    void unfollow(String followerId, String followingId);
    List<User> getFollowers(String userId);
    List<User> getFollowing(String userId);
    
    // Posts
    Post createPost(String authorId, String content, PostType type, PostVisibility visibility);
    Post getPost(String postId);
    void likePost(String userId, String postId);
    void unlikePost(String userId, String postId);
    Comment commentOnPost(String userId, String postId, String text);
    Post sharePost(String userId, String postId);
    List<Post> getUserPosts(String userId);
    List<Post> getFeed(String userId, int limit);
    
    // Jobs
    Job postJob(String companyId, String title, String description);
    Job getJob(String jobId);
    List<Job> searchJobs(String query, String location);
    void closeJob(String jobId);
    
    // Skills & Endorsements
    void addSkill(String userId, Skill skill);
    void endorseSkill(String userId, String skillName, String endorserId);
    
    // Search
    List<User> searchUsers(String query);
}
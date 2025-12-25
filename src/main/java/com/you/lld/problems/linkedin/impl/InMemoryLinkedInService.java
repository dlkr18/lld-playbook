package com.you.lld.problems.linkedin.impl;
import com.you.lld.problems.linkedin.api.*;
import com.you.lld.problems.linkedin.model.*;
import com.you.lld.problems.linkedin.exceptions.*;
import java.util.*;
import java.util.stream.Collectors;

public class InMemoryLinkedInService implements LinkedInService {
    private final Map<String, User> users;
    private final Map<String, Post> posts;
    private final Map<String, Job> jobs;
    private final Map<String, ConnectionRequest> connectionRequests;
    
    public InMemoryLinkedInService() {
        this.users = new HashMap<>();
        this.posts = new HashMap<>();
        this.jobs = new HashMap<>();
        this.connectionRequests = new HashMap<>();
    }
    
    @Override
    public User registerUser(String name, String email) {
        String userId = UUID.randomUUID().toString();
        User user = new User(userId, name, email);
        users.put(userId, user);
        return user;
    }
    
    @Override
    public User getUser(String userId) {
        User user = users.get(userId);
        if (user == null) throw new UserNotFoundException("User not found: " + userId);
        return user;
    }
    
    @Override
    public void updateProfile(String userId, User updatedUser) {
        if (!users.containsKey(userId)) throw new UserNotFoundException("User not found");
        users.put(userId, updatedUser);
    }
    
    @Override
    public ConnectionRequest sendConnectionRequest(String senderId, String receiverId, String message) {
        getUser(senderId);
        getUser(receiverId);
        String requestId = UUID.randomUUID().toString();
        ConnectionRequest request = new ConnectionRequest(requestId, senderId, receiverId);
        request.setMessage(message);
        connectionRequests.put(requestId, request);
        return request;
    }
    
    @Override
    public void acceptConnection(String requestId) {
        ConnectionRequest request = connectionRequests.get(requestId);
        if (request == null) throw new RequestNotFoundException("Request not found");
        request.accept();
        User sender = getUser(request.getSenderId());
        User receiver = getUser(request.getReceiverId());
        sender.addConnection(receiver.getUserId());
        receiver.addConnection(sender.getUserId());
    }
    
    @Override
    public void rejectConnection(String requestId) {
        ConnectionRequest request = connectionRequests.get(requestId);
        if (request != null) request.reject();
    }
    
    @Override
    public List<User> getConnections(String userId) {
        User user = getUser(userId);
        return user.getConnectionIds().stream()
            .map(users::get)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<ConnectionRequest> getPendingRequests(String userId) {
        return connectionRequests.values().stream()
            .filter(r -> r.getReceiverId().equals(userId))
            .filter(r -> r.getStatus() == RequestStatus.PENDING)
            .collect(Collectors.toList());
    }
    
    @Override
    public void follow(String followerId, String followingId) {
        User follower = getUser(followerId);
        User following = getUser(followingId);
        follower.follow(followingId);
        following.addFollower(followerId);
    }
    
    @Override
    public void unfollow(String followerId, String followingId) {
        User follower = getUser(followerId);
        User following = getUser(followingId);
        follower.unfollow(followingId);
    }
    
    @Override
    public List<User> getFollowers(String userId) {
        User user = getUser(userId);
        return user.getFollowerIds().stream()
            .map(users::get)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<User> getFollowing(String userId) {
        User user = getUser(userId);
        return user.getFollowingIds().stream()
            .map(users::get)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }
    
    @Override
    public Post createPost(String authorId, String content, PostType type, PostVisibility visibility) {
        getUser(authorId);
        String postId = UUID.randomUUID().toString();
        Post post = new Post(postId, authorId, content, type);
        post.setVisibility(visibility);
        posts.put(postId, post);
        return post;
    }
    
    @Override
    public Post getPost(String postId) {
        Post post = posts.get(postId);
        if (post == null) throw new PostNotFoundException("Post not found: " + postId);
        return post;
    }
    
    @Override
    public void likePost(String userId, String postId) {
        getUser(userId);
        Post post = getPost(postId);
        post.like(userId);
    }
    
    @Override
    public void unlikePost(String userId, String postId) {
        Post post = getPost(postId);
        post.unlike(userId);
    }
    
    @Override
    public Comment commentOnPost(String userId, String postId, String text) {
        getUser(userId);
        Post post = getPost(postId);
        String commentId = UUID.randomUUID().toString();
        Comment comment = new Comment(commentId, postId, userId, text);
        post.addComment(comment);
        return comment;
    }
    
    @Override
    public Post sharePost(String userId, String postId) {
        getUser(userId);
        Post originalPost = getPost(postId);
        originalPost.incrementShares();
        return createPost(userId, "Shared: " + originalPost.getContent(), PostType.STATUS_UPDATE, PostVisibility.PUBLIC);
    }
    
    @Override
    public List<Post> getUserPosts(String userId) {
        return posts.values().stream()
            .filter(p -> p.getAuthorId().equals(userId))
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .collect(Collectors.toList());
    }
    
    @Override
    public List<Post> getFeed(String userId, int limit) {
        User user = getUser(userId);
        return posts.values().stream()
            .filter(p -> user.getConnectionIds().contains(p.getAuthorId()) || 
                        user.getFollowingIds().contains(p.getAuthorId()) ||
                        p.getVisibility() == PostVisibility.PUBLIC)
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .limit(limit)
            .collect(Collectors.toList());
    }
    
    @Override
    public Job postJob(String companyId, String title, String description) {
        String jobId = UUID.randomUUID().toString();
        Job job = new Job(jobId, companyId, title);
        job.setDescription(description);
        jobs.put(jobId, job);
        return job;
    }
    
    @Override
    public Job getJob(String jobId) {
        Job job = jobs.get(jobId);
        if (job == null) throw new JobNotFoundException("Job not found: " + jobId);
        return job;
    }
    
    @Override
    public List<Job> searchJobs(String query, String location) {
        return jobs.values().stream()
            .filter(j -> j.getStatus() == JobStatus.ACTIVE)
            .filter(j -> query == null || j.getTitle().toLowerCase().contains(query.toLowerCase()))
            .filter(j -> location == null || j.getLocation().toLowerCase().contains(location.toLowerCase()))
            .collect(Collectors.toList());
    }
    
    @Override
    public void closeJob(String jobId) {
        Job job = getJob(jobId);
        job.setStatus(JobStatus.CLOSED);
    }
    
    @Override
    public void addSkill(String userId, Skill skill) {
        User user = getUser(userId);
        user.addSkill(skill);
    }
    
    @Override
    public void endorseSkill(String userId, String skillName, String endorserId) {
        User user = getUser(userId);
        getUser(endorserId);
        user.getSkills().stream()
            .filter(s -> s.getName().equals(skillName))
            .findFirst()
            .ifPresent(Skill::endorse);
    }
    
    @Override
    public List<User> searchUsers(String query) {
        return users.values().stream()
            .filter(u -> u.getName().toLowerCase().contains(query.toLowerCase()) ||
                        (u.getHeadline() != null && u.getHeadline().toLowerCase().contains(query.toLowerCase())))
            .collect(Collectors.toList());
    }
}
package com.you.lld.problems.socialnetwork.model;

import java.util.*;

public class Feed {
    private final String userId;
    private List<Post> posts;
    private LocalDateTime lastUpdated;
    
    public Feed(String userId) {
        this.userId = userId;
        this.posts = new ArrayList<>();
        this.lastUpdated = java.time.LocalDateTime.now();
    }
    
    public String getUserId() { return userId; }
    public List<Post> getPosts() { return new ArrayList<>(posts); }
    
    public void addPost(Post post) {
        posts.add(0, post); // Add to beginning
        updateTimestamp();
    }
    
    public void removePost(String postId) {
        posts.removeIf(p -> p.getPostId().equals(postId));
        updateTimestamp();
    }
    
    public void refresh(List<Post> newPosts) {
        this.posts = new ArrayList<>(newPosts);
        updateTimestamp();
    }
    
    private void updateTimestamp() {
        this.lastUpdated = java.time.LocalDateTime.now();
    }
    
    public java.time.LocalDateTime getLastUpdated() { return lastUpdated; }
}

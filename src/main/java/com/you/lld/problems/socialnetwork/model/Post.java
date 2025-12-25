package com.you.lld.problems.socialnetwork.model;

import java.time.LocalDateTime;
import java.util.*;

public class Post {
    private final String postId;
    private final String authorId;
    private String content;
    private List<String> mediaUrls;
    private Set<String> likeUserIds;
    private List<Comment> comments;
    private PostVisibility visibility;
    private Set<String> taggedUserIds;
    private String location;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean edited;
    private int shareCount;
    
    public Post(String postId, String authorId, String content) {
        this.postId = postId;
        this.authorId = authorId;
        this.content = content;
        this.mediaUrls = new ArrayList<>();
        this.likeUserIds = new HashSet<>();
        this.comments = new ArrayList<>();
        this.visibility = PostVisibility.PUBLIC;
        this.taggedUserIds = new HashSet<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.edited = false;
        this.shareCount = 0;
    }
    
    public String getPostId() { return postId; }
    public String getAuthorId() { return authorId; }
    public String getContent() { return content; }
    
    public void updateContent(String content) {
        this.content = content;
        this.updatedAt = LocalDateTime.now();
        this.edited = true;
    }
    
    public List<String> getMediaUrls() { return new ArrayList<>(mediaUrls); }
    public void addMedia(String url) { mediaUrls.add(url); }
    
    public Set<String> getLikeUserIds() { return new HashSet<>(likeUserIds); }
    public void like(String userId) { likeUserIds.add(userId); }
    public void unlike(String userId) { likeUserIds.remove(userId); }
    public int getLikesCount() { return likeUserIds.size(); }
    public boolean isLikedBy(String userId) { return likeUserIds.contains(userId); }
    
    public List<Comment> getComments() { return new ArrayList<>(comments); }
    public void addComment(Comment comment) { comments.add(comment); }
    public void removeComment(String commentId) {
        comments.removeIf(c -> c.getCommentId().equals(commentId));
    }
    public int getCommentsCount() { return comments.size(); }
    
    public PostVisibility getVisibility() { return visibility; }
    public void setVisibility(PostVisibility visibility) { this.visibility = visibility; }
    
    public Set<String> getTaggedUserIds() { return new HashSet<>(taggedUserIds); }
    public void tagUser(String userId) { taggedUserIds.add(userId); }
    public void untagUser(String userId) { taggedUserIds.remove(userId); }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public boolean isEdited() { return edited; }
    
    public int getShareCount() { return shareCount; }
    public void incrementShareCount() { shareCount++; }
}

package com.you.lld.problems.linkedin.model;
import java.time.LocalDateTime;
import java.util.*;

public class Post {
    private final String postId;
    private final String authorId;
    private String content;
    private PostType type;
    private List<String> mediaUrls;
    private Set<String> likeUserIds;
    private List<Comment> comments;
    private int shares;
    private PostVisibility visibility;
    private LocalDateTime createdAt;
    
    public Post(String postId, String authorId, String content, PostType type) {
        this.postId = postId;
        this.authorId = authorId;
        this.content = content;
        this.type = type;
        this.mediaUrls = new ArrayList<>();
        this.likeUserIds = new HashSet<>();
        this.comments = new ArrayList<>();
        this.shares = 0;
        this.visibility = PostVisibility.PUBLIC;
        this.createdAt = LocalDateTime.now();
    }
    
    public String getPostId() { return postId; }
    public String getAuthorId() { return authorId; }
    public String getContent() { return content; }
    public PostType getType() { return type; }
    public List<String> getMediaUrls() { return new ArrayList<>(mediaUrls); }
    public void addMedia(String url) { mediaUrls.add(url); }
    public Set<String> getLikeUserIds() { return new HashSet<>(likeUserIds); }
    public void like(String userId) { likeUserIds.add(userId); }
    public void unlike(String userId) { likeUserIds.remove(userId); }
    public int getLikesCount() { return likeUserIds.size(); }
    public List<Comment> getComments() { return new ArrayList<>(comments); }
    public void addComment(Comment comment) { comments.add(comment); }
    public int getShares() { return shares; }
    public void incrementShares() { shares++; }
    public PostVisibility getVisibility() { return visibility; }
    public void setVisibility(PostVisibility visibility) { this.visibility = visibility; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
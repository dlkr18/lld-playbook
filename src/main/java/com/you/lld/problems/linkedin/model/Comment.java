package com.you.lld.problems.linkedin.model;
import java.time.LocalDateTime;

public class Comment {
    private final String commentId;
    private final String postId;
    private final String userId;
    private String text;
    private LocalDateTime createdAt;
    
    public Comment(String commentId, String postId, String userId, String text) {
        this.commentId = commentId;
        this.postId = postId;
        this.userId = userId;
        this.text = text;
        this.createdAt = LocalDateTime.now();
    }
    
    public String getCommentId() { return commentId; }
    public String getPostId() { return postId; }
    public String getUserId() { return userId; }
    public String getText() { return text; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
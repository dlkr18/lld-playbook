package com.you.lld.problems.socialnetwork.model;

import java.time.LocalDateTime;
import java.util.*;

public class Comment {
    private final String commentId;
    private final String postId;
    private final String authorId;
    private String content;
    private Set<String> likeUserIds;
    private List<Comment> replies;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean edited;
    
    public Comment(String commentId, String postId, String authorId, String content) {
        this.commentId = commentId;
        this.postId = postId;
        this.authorId = authorId;
        this.content = content;
        this.likeUserIds = new HashSet<>();
        this.replies = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.edited = false;
    }
    
    public String getCommentId() { return commentId; }
    public String getPostId() { return postId; }
    public String getAuthorId() { return authorId; }
    public String getContent() { return content; }
    
    public void updateContent(String content) {
        this.content = content;
        this.updatedAt = LocalDateTime.now();
        this.edited = true;
    }
    
    public Set<String> getLikeUserIds() { return new HashSet<>(likeUserIds); }
    public void like(String userId) { likeUserIds.add(userId); }
    public void unlike(String userId) { likeUserIds.remove(userId); }
    public int getLikesCount() { return likeUserIds.size(); }
    
    public List<Comment> getReplies() { return new ArrayList<>(replies); }
    public void addReply(Comment reply) { replies.add(reply); }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public boolean isEdited() { return edited; }
}

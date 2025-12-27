package com.you.lld.problems.taskmanagement.model;

import java.time.LocalDateTime;

/**
 * Represents a comment on a task.
 */
public class Comment {
    private final String id;
    private final String taskId;
    private final String authorId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Comment(String id, String taskId, String authorId, String content) {
        this.id = id;
        this.taskId = taskId;
        this.authorId = authorId;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getId() {
        return id;
    }
    
    public String getTaskId() {
        return taskId;
    }
    
    public String getAuthorId() {
        return authorId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public boolean isEdited() {
        return !createdAt.equals(updatedAt);
    }
}



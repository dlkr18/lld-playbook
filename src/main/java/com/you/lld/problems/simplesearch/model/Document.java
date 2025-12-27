package com.you.lld.problems.simplesearch.model;

import java.time.LocalDateTime;

/**
 * Represents a searchable document.
 */
public class Document {
    private final String id;
    private final String title;
    private final String content;
    private final LocalDateTime createdAt;
    
    public Document(String id, String title, String content) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = LocalDateTime.now();
    }
    
    public String getId() {
        return id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public String getContent() {
        return content;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}

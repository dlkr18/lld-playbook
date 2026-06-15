package com.you.lld.problems.simplesearch.model;

import java.time.LocalDateTime;

public final class Document {

    private final String id;
    private final String title;
    private final String content;
    private final LocalDateTime createdAt;

    public Document(String id, String title, String content) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("id required");
        }
        if (title == null || content == null) {
            throw new IllegalArgumentException("title and content required");
        }
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

    public String fullText() {
        return title + " " + content;
    }

    @Override
    public String toString() {
        return id + ": " + title;
    }
}

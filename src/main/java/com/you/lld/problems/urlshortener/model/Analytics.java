package com.you.lld.problems.urlshortener.model;

import java.time.LocalDateTime;

public class Analytics {

    private final long accessCount;
    private final LocalDateTime createdAt;
    private final LocalDateTime lastAccessedAt;

    public Analytics(long accessCount, LocalDateTime createdAt, LocalDateTime lastAccessedAt) {
        this.accessCount = accessCount;
        this.createdAt = createdAt;
        this.lastAccessedAt = lastAccessedAt;
    }

    public long getAccessCount() {
        return accessCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLastAccessedAt() {
        return lastAccessedAt;
    }

    @Override
    public String toString() {
        return "Analytics{accessCount=" + accessCount + ", createdAt=" + createdAt + "}";
    }
}

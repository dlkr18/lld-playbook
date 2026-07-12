package com.you.lld.problems.urlshortener.model;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicLong;

public class URLMapping {

    private final String shortCode;
    private final String longURL;
    private final LocalDateTime createdAt;
    private volatile LocalDateTime lastAccessedAt;
    private final AtomicLong accessCount;

    public URLMapping(String shortCode, String longURL) {
        if (shortCode == null || shortCode.isEmpty()) {
            throw new IllegalArgumentException("Short code required");
        }
        if (longURL == null || longURL.isEmpty()) {
            throw new IllegalArgumentException("Long URL required");
        }
        this.shortCode = shortCode;
        this.longURL = longURL;
        this.createdAt = LocalDateTime.now();
        this.lastAccessedAt = createdAt;
        this.accessCount = new AtomicLong(0);
    }

    public void recordAccess() {
        lastAccessedAt = LocalDateTime.now();
        accessCount.incrementAndGet();
    }

    public Analytics getAnalytics() {
        return new Analytics(accessCount.get(), createdAt, lastAccessedAt);
    }

    public String getShortCode() {
        return shortCode;
    }

    public String getLongURL() {
        return longURL;
    }
}

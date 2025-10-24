package com.you.lld.problems.urlshortener;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Represents a mapping between a short code and a long URL.
 * 
 * <p>Contains the URL mapping along with metadata and analytics:
 * <ul>
 *   <li>Creation timestamp</li>
 *   <li>Last accessed timestamp</li>
 *   <li>Access count</li>
 * </ul>
 * 
 * <p>Thread-safe for concurrent access updates.
 */
public class URLMapping {
    private final String shortCode;
    private final String longURL;
    private final LocalDateTime createdAt;
    private volatile LocalDateTime lastAccessedAt;
    private final AtomicLong accessCount;
    
    /**
     * Creates a new URL mapping.
     * 
     * @param shortCode the short code (6-8 characters)
     * @param longURL the original long URL
     */
    public URLMapping(String shortCode, String longURL) {
        if (shortCode == null || shortCode.isEmpty()) {
            throw new IllegalArgumentException("Short code cannot be null or empty");
        }
        if (longURL == null || longURL.isEmpty()) {
            throw new IllegalArgumentException("Long URL cannot be null or empty");
        }
        
        this.shortCode = shortCode;
        this.longURL = longURL;
        this.createdAt = LocalDateTime.now();
        this.lastAccessedAt = this.createdAt;
        this.accessCount = new AtomicLong(0);
    }
    
    /**
     * Records an access to this URL mapping.
     * Updates last accessed time and increments access count.
     * Thread-safe.
     */
    public void recordAccess() {
        this.lastAccessedAt = LocalDateTime.now();
        this.accessCount.incrementAndGet();
    }
    
    /**
     * Gets analytics data for this mapping.
     * 
     * @return Analytics object with access statistics
     */
    public Analytics getAnalytics() {
        return new Analytics(
            accessCount.get(),
            createdAt,
            lastAccessedAt
        );
    }
    
    // Getters
    
    public String getShortCode() {
        return shortCode;
    }
    
    public String getLongURL() {
        return longURL;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getLastAccessedAt() {
        return lastAccessedAt;
    }
    
    public long getAccessCount() {
        return accessCount.get();
    }
    
    @Override
    public String toString() {
        return "URLMapping{" +
                "shortCode='" + shortCode + '\'' +
                ", longURL='" + longURL + '\'' +
                ", accessCount=" + accessCount.get() +
                '}';
    }
}


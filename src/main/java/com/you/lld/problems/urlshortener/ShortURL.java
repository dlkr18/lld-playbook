package com.you.lld.problems.urlshortener;

import java.util.Objects;

/**
 * Value object representing a shortened URL.
 * 
 * <p>Contains both the short code and the full shortened URL.
 * Immutable and thread-safe.
 */
public class ShortURL {
    private final String code;
    private final String fullUrl;
    
    /**
     * Creates a short URL.
     * 
     * @param code the short code (e.g., "abc123")
     * @param baseUrl the base URL (e.g., "https://short.ly")
     */
    public ShortURL(String code, String baseUrl) {
        if (code == null || code.isEmpty()) {
            throw new IllegalArgumentException("Code cannot be null or empty");
        }
        if (baseUrl == null || baseUrl.isEmpty()) {
            throw new IllegalArgumentException("Base URL cannot be null or empty");
        }
        
        this.code = code;
        this.fullUrl = baseUrl + "/" + code;
    }
    
    /**
     * Returns the short code only.
     */
    public String getCode() {
        return code;
    }
    
    /**
     * Returns the full shortened URL.
     */
    public String getFullUrl() {
        return fullUrl;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ShortURL shortURL = (ShortURL) o;
        return code.equals(shortURL.code);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(code);
    }
    
    @Override
    public String toString() {
        return fullUrl;
    }
}


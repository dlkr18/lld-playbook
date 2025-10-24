package com.you.lld.problems.urlshortener;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * In-memory URL Shortener Service.
 * 
 * <p>Provides fast O(1) URL shortening and retrieval using:
 * <ul>
 *   <li>Counter-based ID generation with Base62 encoding</li>
 *   <li>Dual HashMap for bidirectional lookup</li>
 *   <li>ConcurrentHashMap for thread-safety</li>
 * </ul>
 * 
 * <p>Key features:
 * <ul>
 *   <li>Generate unique short URLs from long URLs</li>
 *   <li>Support custom aliases</li>
 *   <li>Fast O(1) redirect lookups</li>
 *   <li>Track access analytics</li>
 *   <li>URL validation and normalization</li>
 * </ul>
 * 
 * <p>Thread-safe for concurrent access.
 */
public class URLShortenerService {
    
    private final ConcurrentHashMap<String, URLMapping> shortToLong;
    private final ConcurrentHashMap<String, String> longToShort;
    private final AtomicLong counter;
    private final String baseUrl;
    private final int shortCodeLength;
    
    /**
     * Creates a new URL shortener service.
     * 
     * @param baseUrl the base URL for shortened links (e.g., "https://short.ly")
     */
    public URLShortenerService(String baseUrl) {
        this(baseUrl, 6); // Default 6 character short codes
    }
    
    /**
     * Creates a new URL shortener service with specified code length.
     * 
     * @param baseUrl the base URL for shortened links
     * @param shortCodeLength length of generated short codes (6-8 recommended)
     */
    public URLShortenerService(String baseUrl, int shortCodeLength) {
        if (baseUrl == null || baseUrl.isEmpty()) {
            throw new IllegalArgumentException("Base URL cannot be null or empty");
        }
        if (shortCodeLength < 4 || shortCodeLength > 10) {
            throw new IllegalArgumentException("Short code length must be 4-10 characters");
        }
        
        this.shortToLong = new ConcurrentHashMap<>();
        this.longToShort = new ConcurrentHashMap<>();
        this.counter = new AtomicLong(1); // Start from 1
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.shortCodeLength = shortCodeLength;
    }
    
    /**
     * Shortens a long URL to a unique short URL.
     * 
     * <p>If the URL has already been shortened, returns the existing short code.
     * Otherwise, generates a new unique short code.
     * 
     * @param longURL the URL to shorten
     * @return ShortURL containing the short code and full URL
     * @throws IllegalArgumentException if URL is invalid
     */
    public ShortURL shortenURL(String longURL) {
        // Validate and normalize URL
        if (!URLValidator.isValid(longURL)) {
            throw new IllegalArgumentException("Invalid URL: " + longURL);
        }
        
        String normalizedURL = URLValidator.normalize(longURL);
        
        // Check if URL already shortened
        String existingCode = longToShort.get(normalizedURL);
        if (existingCode != null) {
            return new ShortURL(existingCode, baseUrl);
        }
        
        // Generate new short code
        String shortCode = generateShortCode();
        
        // Create mapping
        URLMapping mapping = new URLMapping(shortCode, normalizedURL);
        shortToLong.put(shortCode, mapping);
        longToShort.put(normalizedURL, shortCode);
        
        return new ShortURL(shortCode, baseUrl);
    }
    
    /**
     * Shortens a URL with a custom alias.
     * 
     * <p>The custom alias must be available and meet validation criteria.
     * 
     * @param longURL the URL to shorten
     * @param customAlias the desired short code
     * @return ShortURL with the custom alias
     * @throws IllegalArgumentException if URL or alias is invalid
     * @throws AliasUnavailableException if alias is already taken
     */
    public ShortURL shortenURL(String longURL, String customAlias) {
        // Validate URL
        if (!URLValidator.isValid(longURL)) {
            throw new IllegalArgumentException("Invalid URL: " + longURL);
        }
        
        // Validate alias
        if (!URLValidator.isValidAlias(customAlias)) {
            throw new IllegalArgumentException("Invalid alias: " + customAlias + 
                ". Must be 4-8 alphanumeric characters and not a reserved keyword.");
        }
        
        String normalizedURL = URLValidator.normalize(longURL);
        
        // Check if alias is available
        if (shortToLong.containsKey(customAlias)) {
            throw new AliasUnavailableException("Alias '" + customAlias + "' is already taken");
        }
        
        // Check if URL already shortened (remove old mapping if exists)
        String existingCode = longToShort.get(normalizedURL);
        if (existingCode != null) {
            // Remove old mapping
            shortToLong.remove(existingCode);
        }
        
        // Create mapping with custom alias
        URLMapping mapping = new URLMapping(customAlias, normalizedURL);
        shortToLong.put(customAlias, mapping);
        longToShort.put(normalizedURL, customAlias);
        
        return new ShortURL(customAlias, baseUrl);
    }
    
    /**
     * Retrieves the original long URL for a short code.
     * 
     * <p>Records access analytics (access count and timestamp).
     * 
     * @param shortCode the short code
     * @return the original long URL
     * @throws URLNotFoundException if short code doesn't exist
     */
    public String getLongURL(String shortCode) {
        if (shortCode == null || shortCode.isEmpty()) {
            throw new IllegalArgumentException("Short code cannot be null or empty");
        }
        
        URLMapping mapping = shortToLong.get(shortCode);
        if (mapping == null) {
            throw new URLNotFoundException("Short code not found: " + shortCode);
        }
        
        // Record access
        mapping.recordAccess();
        
        return mapping.getLongURL();
    }
    
    /**
     * Gets analytics data for a short URL.
     * 
     * @param shortCode the short code
     * @return Analytics data including access count and timestamps
     * @throws URLNotFoundException if short code doesn't exist
     */
    public Analytics getAnalytics(String shortCode) {
        if (shortCode == null || shortCode.isEmpty()) {
            throw new IllegalArgumentException("Short code cannot be null or empty");
        }
        
        URLMapping mapping = shortToLong.get(shortCode);
        if (mapping == null) {
            throw new URLNotFoundException("Short code not found: " + shortCode);
        }
        
        return mapping.getAnalytics();
    }
    
    /**
     * Deletes a short URL mapping.
     * 
     * @param shortCode the short code to delete
     * @return true if deleted, false if not found
     */
    public boolean deleteURL(String shortCode) {
        if (shortCode == null || shortCode.isEmpty()) {
            return false;
        }
        
        URLMapping mapping = shortToLong.remove(shortCode);
        if (mapping != null) {
            longToShort.remove(mapping.getLongURL());
            return true;
        }
        
        return false;
    }
    
    /**
     * Returns the total number of URLs in the system.
     */
    public int getTotalURLs() {
        return shortToLong.size();
    }
    
    /**
     * Checks if a short code is available.
     * 
     * @param code the code to check
     * @return true if available, false if taken
     */
    public boolean isAvailable(String code) {
        return !shortToLong.containsKey(code);
    }
    
    /**
     * Generates a new unique short code using counter and Base62 encoding.
     */
    private String generateShortCode() {
        long id = counter.getAndIncrement();
        return Base62Encoder.encode(id, shortCodeLength);
    }
    
    /**
     * Returns the base URL for this service.
     */
    public String getBaseUrl() {
        return baseUrl;
    }
}


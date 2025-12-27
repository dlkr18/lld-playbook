# urlshortener - Complete Implementation

## 📁 Project Structure (9 files)

```
urlshortener/
├── AliasUnavailableException.java
├── Analytics.java
├── Base62Encoder.java
├── ShortURL.java
├── URLMapping.java
├── URLNotFoundException.java
├── URLShortenerService.java
├── URLValidator.java
├── analytics/AnalyticsTracker.java
```

## 📝 Source Code

### 📄 `AliasUnavailableException.java`

<details>
<summary>📄 Click to view AliasUnavailableException.java</summary>

```java
package com.you.lld.problems.urlshortener;

/**
 * Exception thrown when a custom alias is already taken.
 */
public class AliasUnavailableException extends RuntimeException {
    
    public AliasUnavailableException(String message) {
        super(message);
    }
    
    public AliasUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}

```

</details>

### 📄 `Analytics.java`

<details>
<summary>📄 Click to view Analytics.java</summary>

```java
package com.you.lld.problems.urlshortener;

import java.time.LocalDateTime;

/**
 * Value object containing analytics data for a shortened URL.
 * 
 * <p>Immutable snapshot of URL statistics at a point in time.
 */
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
        return "Analytics{" +
                "accessCount=" + accessCount +
                ", createdAt=" + createdAt +
                ", lastAccessedAt=" + lastAccessedAt +
                '}';
    }
}

```

</details>

### 📄 `Base62Encoder.java`

<details>
<summary>📄 Click to view Base62Encoder.java</summary>

```java
package com.you.lld.problems.urlshortener;

/**
 * Utility class for Base62 encoding/decoding.
 * 
 * <p>Base62 uses [0-9a-zA-Z] = 62 characters for URL-safe encoding.
 * This provides a good balance between short codes and large namespace.
 * 
 * <p>Character mapping:
 * <ul>
 *   <li>0-9 → '0' to '9' (values 0-9)</li>
 *   <li>10-35 → 'a' to 'z' (values 10-35)</li>
 *   <li>36-61 → 'A' to 'Z' (values 36-61)</li>
 * </ul>
 * 
 * <p>Examples:
 * <ul>
 *   <li>1 → "1"</li>
 *   <li>62 → "10"</li>
 *   <li>123 → "1Z"</li>
 *   <li>123456 → "w7e"</li>
 * </ul>
 */
public class Base62Encoder {
    
    private static final String BASE62_CHARS = 
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    private static final int BASE = 62;
    
    /**
     * Encodes a positive long number to Base62 string.
     * 
     * @param num the number to encode (must be >= 0)
     * @return Base62 encoded string
     * @throws IllegalArgumentException if num is negative
     */
    public static String encode(long num) {
        if (num < 0) {
            throw new IllegalArgumentException("Number must be non-negative");
        }
        
        if (num == 0) {
            return "0";
        }
        
        StringBuilder result = new StringBuilder();
        while (num > 0) {
            int remainder = (int) (num % BASE);
            result.append(BASE62_CHARS.charAt(remainder));
            num /= BASE;
        }
        
        return result.reverse().toString();
    }
    
    /**
     * Encodes a number and pads to specified length.
     * 
     * @param num the number to encode
     * @param minLength minimum length of result (pads with '0' if needed)
     * @return Base62 encoded string with padding
     */
    public static String encode(long num, int minLength) {
        String encoded = encode(num);
        if (encoded.length() >= minLength) {
            return encoded;
        }
        
        // Pad with '0' characters
        StringBuilder padded = new StringBuilder();
        for (int i = 0; i < minLength - encoded.length(); i++) {
            padded.append('0');
        }
        padded.append(encoded);
        return padded.toString();
    }
    
    /**
     * Decodes a Base62 string back to a long number.
     * 
     * @param str the Base62 string to decode
     * @return decoded long number
     * @throws IllegalArgumentException if string contains invalid characters
     */
    public static long decode(String str) {
        if (str == null || str.isEmpty()) {
            throw new IllegalArgumentException("String cannot be null or empty");
        }
        
        long result = 0;
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            int value = BASE62_CHARS.indexOf(c);
            if (value == -1) {
                throw new IllegalArgumentException("Invalid character in Base62 string: " + c);
            }
            result = result * BASE + value;
        }
        
        return result;
    }
    
    /**
     * Calculates the maximum number that can be represented with given length.
     * 
     * @param length the length of Base62 string
     * @return maximum representable number
     */
    public static long maxValue(int length) {
        return (long) Math.pow(BASE, length) - 1;
    }
}

```

</details>

### 📄 `ShortURL.java`

<details>
<summary>📄 Click to view ShortURL.java</summary>

```java
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

```

</details>

### 📄 `URLMapping.java`

<details>
<summary>📄 Click to view URLMapping.java</summary>

```java
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

```

</details>

### 📄 `URLNotFoundException.java`

<details>
<summary>📄 Click to view URLNotFoundException.java</summary>

```java
package com.you.lld.problems.urlshortener;

/**
 * Exception thrown when a short code is not found in the system.
 */
public class URLNotFoundException extends RuntimeException {
    
    public URLNotFoundException(String message) {
        super(message);
    }
    
    public URLNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

```

</details>

### 📄 `URLShortenerService.java`

<details>
<summary>📄 Click to view URLShortenerService.java</summary>

```java
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

```

</details>

### 📄 `URLValidator.java`

<details>
<summary>📄 Click to view URLValidator.java</summary>

```java
package com.you.lld.problems.urlshortener;

import java.net.MalformedURLException;
import java.net.URL;

/**
 * Utility class for URL validation and normalization.
 * 
 * <p>Validates URLs according to common web standards and normalizes
 * them for consistent storage and comparison.
 */
public class URLValidator {
    
    private static final int MAX_URL_LENGTH = 2048;
    private static final int MIN_URL_LENGTH = 10; // http://a.b
    
    /**
     * Validates if a URL is well-formed and acceptable.
     * 
     * @param url the URL to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValid(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        
        String trimmed = url.trim();
        
        // Check length
        if (trimmed.length() < MIN_URL_LENGTH || trimmed.length() > MAX_URL_LENGTH) {
            return false;
        }
        
        // Must start with http:// or https://
        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
            return false;
        }
        
        // Try to parse as URL
        try {
            URL parsedUrl = new URL(trimmed);
            String host = parsedUrl.getHost();
            
            // Host must not be empty and must contain at least one dot
            if (host == null || host.isEmpty() || !host.contains(".")) {
                return false;
            }
            
            return true;
        } catch (MalformedURLException e) {
            return false;
        }
    }
    
    /**
     * Normalizes a URL for consistent storage.
     * 
     * <p>Normalization includes:
     * <ul>
     *   <li>Trim whitespace</li>
     *   <li>Convert domain to lowercase</li>
     *   <li>Remove trailing slash (except for root path)</li>
     *   <li>Remove default ports (80 for HTTP, 443 for HTTPS)</li>
     * </ul>
     * 
     * @param url the URL to normalize
     * @return normalized URL
     * @throws IllegalArgumentException if URL is invalid
     */
    public static String normalize(String url) {
        if (!isValid(url)) {
            throw new IllegalArgumentException("Invalid URL: " + url);
        }
        
        try {
            URL parsedUrl = new URL(url.trim());
            
            String protocol = parsedUrl.getProtocol().toLowerCase();
            String host = parsedUrl.getHost().toLowerCase();
            int port = parsedUrl.getPort();
            String path = parsedUrl.getPath();
            String query = parsedUrl.getQuery();
            
            // Remove default ports
            if ((protocol.equals("http") && port == 80) || 
                (protocol.equals("https") && port == 443)) {
                port = -1;
            }
            
            // Remove trailing slash from path (but keep it for root)
            if (path.length() > 1 && path.endsWith("/")) {
                path = path.substring(0, path.length() - 1);
            }
            
            // Reconstruct URL
            StringBuilder normalized = new StringBuilder();
            normalized.append(protocol).append("://").append(host);
            
            if (port != -1) {
                normalized.append(":").append(port);
            }
            
            if (path.isEmpty()) {
                normalized.append("/");
            } else {
                normalized.append(path);
            }
            
            if (query != null && !query.isEmpty()) {
                normalized.append("?").append(query);
            }
            
            return normalized.toString();
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Invalid URL: " + url, e);
        }
    }
    
    /**
     * Validates if a custom alias is acceptable.
     * 
     * <p>Valid alias must:
     * <ul>
     *   <li>Be 4-8 characters long</li>
     *   <li>Contain only alphanumeric characters [a-zA-Z0-9]</li>
     *   <li>Not be a reserved keyword</li>
     * </ul>
     * 
     * @param alias the alias to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidAlias(String alias) {
        if (alias == null || alias.isEmpty()) {
            return false;
        }
        
        // Length check
        if (alias.length() < 4 || alias.length() > 8) {
            return false;
        }
        
        // Alphanumeric only
        if (!alias.matches("^[a-zA-Z0-9]+$")) {
            return false;
        }
        
        // Not a reserved keyword
        if (isReservedKeyword(alias.toLowerCase())) {
            return false;
        }
        
        return true;
    }
    
    private static boolean isReservedKeyword(String alias) {
        String[] reserved = {
            "admin", "api", "www", "ftp", "mail",
            "create", "delete", "update", "stats", "analytics",
            "help", "about", "terms", "privacy", "contact",
            "login", "signup", "logout", "settings", "account"
        };
        
        for (String keyword : reserved) {
            if (keyword.equals(alias)) {
                return true;
            }
        }
        
        return false;
    }
}

```

</details>

### 📄 `analytics/AnalyticsTracker.java`

<details>
<summary>📄 Click to view analytics/AnalyticsTracker.java</summary>

```java
package com.you.lld.problems.urlshortener.analytics;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class AnalyticsTracker {
    private final Map<String, Integer> clickCounts = new ConcurrentHashMap<>();
    private final Map<String, Set<String>> uniqueVisitors = new ConcurrentHashMap<>();
    
    public void trackClick(String shortUrl, String ipAddress) {
        clickCounts.merge(shortUrl, 1, Integer::sum);
        uniqueVisitors.computeIfAbsent(shortUrl, k -> ConcurrentHashMap.newKeySet()).add(ipAddress);
    }
    
    public int getClickCount(String shortUrl) {
        return clickCounts.getOrDefault(shortUrl, 0);
    }
    
    public int getUniqueVisitors(String shortUrl) {
        Set<String> visitors = uniqueVisitors.get(shortUrl);
        return visitors != null ? visitors.size() : 0;
    }
    
    public Map<String, Integer> getTopUrls(int limit) {
        return clickCounts.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(limit)
            .collect(java.util.stream.Collectors.toMap(
                Map.Entry::getKey, 
                Map.Entry::getValue,
                (e1, e2) -> e1,
                LinkedHashMap::new
            ));
    }
}
```

</details>


# URL Shortener - Complete Implementation 🔗

Production-ready **URL Shortener** system like TinyURL, Bitly with **Base62 encoding**, **custom aliases**, and **analytics tracking**. Essential for system design interviews.

---

## 🎯 **What You'll Learn**

✅ **Base62 Encoding** - Converting numbers to short codes  
✅ **Counter-Based ID Generation** - Unique short codes  
✅ **Bidirectional Lookup** - O(1) short→long and long→short  
✅ **Custom Aliases** - User-defined short codes  
✅ **Analytics Tracking** - Access counts and timestamps  
✅ **Thread-Safe Concurrent Access** - ConcurrentHashMap  

---

## 📊 **System Design**

### **Architecture:**

```
┌────────────────────────────────────────────────────────────┐
│                   URL Shortener Service                     │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Counter (AtomicLong)         Base62 Encoder               │
│       │                              │                      │
│       ▼                              ▼                      │
│   Generate ID                   Encode to                   │
│   (1, 2, 3...)                  Short Code                  │
│                                 ("1", "2", "3")             │
│                                                             │
│  Dual HashMap Storage:                                      │
│  ┌────────────────────┐    ┌─────────────────────┐        │
│  │ ShortCode → Long  │    │  Long → ShortCode   │        │
│  │                    │    │                      │        │
│  │ "abc123" → "https..│←───┤"https.." → "abc123"│        │
│  └────────────────────┘    └─────────────────────┘        │
│         ↑ O(1) lookup            ↑ Dedup check            │
└────────────────────────────────────────────────────────────┘
```

### **Capacity Planning:**

| Code Length | Possible URLs | Use Case |
|-------------|--------------|----------|
| **4 chars** | 62^4 = 14.7M | Startup |
| **6 chars** | 62^6 = 56.8B | Small-Medium (TinyURL) |
| **7 chars** | 62^7 = 3.5T | Large (Bitly) |
| **8 chars** | 62^8 = 218T | Global scale |

---

## 🔢 **Base62 Encoder**

### **Base62Encoder.java** - Core Encoding Logic

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

### **Encoding Examples:**

```
Decimal → Base62 Conversion:

ID: 1        → Base62: "1"
ID: 62       → Base62: "10"
ID: 123      → Base62: "1Z"
ID: 3844     → Base62: "100"
ID: 123456   → Base62: "w7e"
ID: 1000000  → Base62: "4c92"

With 6-character padding:
ID: 1        → "000001"
ID: 123      → "00001Z"
ID: 123456   → "000w7e"
```

---

## 🏗️ **URL Shortener Service**

### **URLShortenerService.java** - Complete Implementation

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

---

## 📦 **Value Objects**

### **ShortURL.java** - Immutable Result

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

---

## 📝 **Usage Examples**

### **Example 1: Basic Shortening**

```java
public class URLShortenerDemo {
    public static void main(String[] args) {
        URLShortenerService service = new URLShortenerService("https://short.ly");
        
        // Shorten a URL
        ShortURL short1 = service.shortenURL("https://www.example.com/very/long/path");
        System.out.println("Shortened: " + short1.getFullUrl());  // https://short.ly/000001
        
        // Shorten same URL again (returns same short code)
        ShortURL short2 = service.shortenURL("https://www.example.com/very/long/path");
        System.out.println("Same code: " + short2.getCode().equals(short1.getCode()));  // true
        
        // Retrieve original URL
        String original = service.getLongURL(short1.getCode());
        System.out.println("Original: " + original);
        
        // Get analytics
        Analytics stats = service.getAnalytics(short1.getCode());
        System.out.println("Access count: " + stats.getAccessCount());  // 1
    }
}
```

### **Example 2: Custom Aliases**

```java
public class CustomAliasDemo {
    public static void main(String[] args) {
        URLShortenerService service = new URLShortenerService("https://short.ly");
        
        // Create custom alias
        try {
            ShortURL custom = service.shortenURL(
                "https://github.com/myrepo", 
                "github"
            );
            System.out.println(custom.getFullUrl());  // https://short.ly/github
        } catch (AliasUnavailableException e) {
            System.err.println("Alias already taken!");
        }
        
        // Check availability first
        if (service.isAvailable("docs")) {
            ShortURL docs = service.shortenURL(
                "https://docs.example.com", 
                "docs"
            );
            System.out.println(docs.getFullUrl());  // https://short.ly/docs
        }
    }
}
```

### **Example 3: REST API Integration**

```java
@RestController
@RequestMapping("/api/urls")
public class URLController {
    
    private final URLShortenerService shortener = 
        new URLShortenerService("https://short.ly");
    
    @PostMapping("/shorten")
    public ResponseEntity<ShortURL> shortenURL(@RequestBody ShortenRequest request) {
        try {
            ShortURL result;
            if (request.getCustomAlias() != null) {
                result = shortener.shortenURL(request.getUrl(), request.getCustomAlias());
            } else {
                result = shortener.shortenURL(request.getUrl());
            }
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (AliasUnavailableException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
    
    @GetMapping("/{code}")
    public ResponseEntity<Void> redirect(@PathVariable String code) {
        try {
            String longURL = shortener.getLongURL(code);
            return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(longURL))
                .build();
        } catch (URLNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{code}/analytics")
    public ResponseEntity<Analytics> getAnalytics(@PathVariable String code) {
        try {
            Analytics analytics = shortener.getAnalytics(code);
            return ResponseEntity.ok(analytics);
        } catch (URLNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
```

---

## 🎯 **System Design Considerations**

### **1. ID Generation Strategies:**

| Strategy | Pros | Cons | Use Case |
|----------|------|------|----------|
| **Counter** | Simple, sequential, predictable | Single point of failure | In-memory prototype |
| **MD5 Hash** | Deterministic, distributed | Collisions, not URL-safe | Academic |
| **Random** | Simple, no coordination | Collisions at scale | Small systems |
| **Range-based** | Distributed, no conflicts | Coordination needed | Production (Twitter Snowflake) |

### **2. Distributed ID Generation (Production):**

```
Shard 1: IDs 0-999,999      → "000000" to "4c91"
Shard 2: IDs 1,000,000+     → "4c92" to ...
Shard 3: IDs 2,000,000+     → "9184" to ...
```

### **3. Persistent Storage (Database):**

```sql
CREATE TABLE url_mappings (
    short_code VARCHAR(10) PRIMARY KEY,
    long_url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP,
    access_count BIGINT DEFAULT 0,
    last_accessed TIMESTAMP,
    INDEX idx_long_url (long_url(100))  -- For dedup
);
```

---

## 🚨 **Common Mistakes to Avoid**

### **1. Not Normalizing URLs**
```java
// BAD: Same URL, different codes
short.ly/abc → "https://example.com"
short.ly/xyz → "https://example.com/"  // Trailing slash!

// GOOD: Normalize before storing
URLValidator.normalize(url)  // Removes trailing slash
```

### **2. Using Base64 Instead of Base62**
```
Base64: Uses '+' and '/' → Not URL-safe!
Base62: Uses [0-9a-zA-Z] → URL-safe ✓
```

### **3. Not Handling Collisions**
```java
// BAD: Assuming no collisions
String code = randomString();
map.put(code, url);

// GOOD: Check availability
while (!service.isAvailable(code)) {
    code = randomString();
}
```

---

## ⚡ **Performance Optimization**

### **1. Caching:**
```java
// Redis cache for hot URLs
@Cacheable(value = "urls", key = "#shortCode")
public String getLongURL(String shortCode) {
    return database.query(shortCode);
}
```

### **2. Bloom Filter (Check Existence):**
```java
// Quick existence check before DB query
if (!bloomFilter.mightContain(shortCode)) {
    throw new URLNotFoundException();
}
```

### **3. CDN Redirect:**
```
User → CDN Edge → (Cache Hit) → 301 Redirect
              ↓ (Cache Miss)
              → Origin Server → Update Cache
```

---

## 📊 **Performance Characteristics**

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| **Shorten URL** | O(1) | O(1) |
| **Get Long URL** | O(1) | O(1) |
| **Custom Alias** | O(1) | O(1) |
| **Storage** | - | O(N) where N = # URLs |

---

## 🔗 **Related Resources**

- [Day 13: Feature Flags](week3/day13/README.md) - Configuration patterns
- [LRU Cache](problems/lrucache/CODE.md) - Caching strategy
- [Rate Limiter](problems/ratelimiter/CODE.md) - API protection

---

**Source Code Location**: `src/main/java/com/you/lld/problems/urlshortener/`

---

✨ **Build your own TinyURL/Bitly clone with production-ready code!** 🔗


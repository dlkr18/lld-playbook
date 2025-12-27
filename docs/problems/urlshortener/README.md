# URL Shortener (bit.ly / TinyURL)

## Overview
A scalable URL shortening service that converts long URLs into short, shareable links. Supports custom aliases, analytics tracking, expiration, and handles billions of URLs with sub-millisecond redirect latency.

**Difficulty:** Medium-Hard  
**Domain:** Web Services, Distributed Systems  
**Interview Frequency:** Very High (Google, Facebook, Amazon, Microsoft)

## Requirements

### Functional Requirements
1. **Shorten URL**: Convert long URL to short code (7 characters)
2. **Redirect**: Resolve short URL to original URL
3. **Custom Aliases**: User-defined short codes
4. **Expiration**: Time-based URL expiration
5. **Analytics**: Click tracking, geolocation, referrer
6. **Delete/Update**: Modify or remove URLs

### Non-Functional Requirements
1. **Scalability**: Billion URLs, million requests/sec
2. **Availability**: 99.99% uptime
3. **Latency**: Redirect < 10ms (P99)
4. **Durability**: No data loss
5. **Collision-Free**: Unique short codes

## System Design

### URL Structure
```
Long:  https://www.example.com/very/long/path?param=value
Short: https://short.ly/aBc1234

Components:
- Domain: short.ly
- Short Code: aBc1234 (7 chars, base62)
- Characters: [a-zA-Z0-9] = 62^7 = 3.5 trillion combinations
```

### Key Algorithms

#### 1. Base62 Encoding
```java
private static final String BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

public String encode(long id) {
    StringBuilder sb = new StringBuilder();
    while (id > 0) {
        sb.append(BASE62.charAt((int)(id % 62)));
        id /= 62;
    }
    return sb.reverse().toString();
}

public long decode(String shortCode) {
    long id = 0;
    for (char c : shortCode.toCharArray()) {
        id = id * 62 + BASE62.indexOf(c);
    }
    return id;
}
```

**Time Complexity:** O(log₆₂(N))  
**Space Complexity:** O(1)

#### 2. Hash-Based Generation
```java
public String generateShortCode(String longUrl) {
    String hash = MD5(longUrl).substring(0, 7);
    
    // Handle collision
    int attempt = 0;
    while (exists(hash)) {
        hash = MD5(longUrl + attempt++).substring(0, 7);
    }
    
    return hash;
}
```

**Collision Probability:** ~0.01% for 10M URLs

#### 3. Counter-Based (Auto-Increment)
```java
public class URLShortener {
    private AtomicLong counter = new AtomicLong(1000000);
    
    public String shorten(String longUrl) {
        long id = counter.getAndIncrement();
        String shortCode = base62Encode(id);
        store(shortCode, longUrl);
        return shortCode;
    }
}
```

**Benefits:** No collisions, predictable  
**Drawbacks:** Sequential (security concern)

#### 4. Distributed ID Generation (Snowflake)
```java
public class SnowflakeIdGenerator {
    private long datacenterId; // 5 bits
    private long machineId;    // 5 bits
    private long sequence = 0; // 12 bits
    private long lastTimestamp = -1L;
    
    public synchronized long nextId() {
        long timestamp = System.currentTimeMillis();
        
        if (timestamp == lastTimestamp) {
            sequence = (sequence + 1) & 4095; // 12 bits
            if (sequence == 0) {
                timestamp = tilNextMillis(lastTimestamp);
            }
        } else {
            sequence = 0;
        }
        
        lastTimestamp = timestamp;
        
        return ((timestamp - EPOCH) << 22) |
               (datacenterId << 17) |
               (machineId << 12) |
               sequence;
    }
}
```

## Design Patterns

### 1. Strategy Pattern (ID Generation)
```java
interface IdGenerator {
    long generate();
}

class SnowflakeGenerator implements IdGenerator {
    public long generate() { /* Snowflake algorithm */ }
}

class CounterGenerator implements IdGenerator {
    public long generate() { return counter.incrementAndGet(); }
}
```

### 2. Cache-Aside Pattern
```java
public String resolve(String shortCode) {
    // Check cache first
    String longUrl = cache.get(shortCode);
    if (longUrl != null) {
        return longUrl;
    }
    
    // Cache miss - query DB
    longUrl = database.get(shortCode);
    if (longUrl != null) {
        cache.put(shortCode, longUrl);
    }
    
    return longUrl;
}
```

## Source Code
📄 **[View Complete Source Code](/problems/urlshortener/CODE)**

## Usage Example
```java
URLShortenerService service = new URLShortenerServiceImpl();

// Shorten URL
String shortCode = service.shorten("https://www.example.com/very/long/url");
System.out.println("Short URL: https://short.ly/" + shortCode);

// Redirect
String originalUrl = service.resolve(shortCode);
// Redirect user to originalUrl

// Custom alias
service.shortenWithAlias("https://example.com", "mylink");

// Analytics
AnalyticsData stats = service.getAnalytics(shortCode);
System.out.println("Clicks: " + stats.getTotalClicks());
```

## Common Interview Questions

1. **How do you generate unique short codes?**
   - Base62 encoding of auto-increment ID
   - MD5 hash (first 7 chars) with collision handling
   - Distributed ID (Snowflake, Twitter)
   - Pre-generate pool of IDs

2. **How do you handle 1M requests/sec?**
   - Redis cache (99%+ hit rate)
   - Read replicas (10+ replicas)
   - CDN for popular links
   - Horizontal scaling

3. **How do you prevent abuse?**
   - Rate limiting per user/IP
   - Captcha for high-volume users
   - Malicious URL detection
   - Expiration for free users

4. **How do you estimate storage?**
   ```
   Assumptions:
   - 100M new URLs per month
   - 100:1 read:write ratio
   - 5 years retention
   
   Storage:
   - Total URLs: 100M * 12 * 5 = 6B
   - Per URL: 500 bytes (URL + metadata)
   - Total: 6B * 500B = 3TB
   
   Cache:
   - 20% of URLs (80/20 rule) = 1.2B URLs
   - Redis: 1.2B * 500B = 600GB
   ```

## Database Schema

```sql
CREATE TABLE urls (
    id BIGINT PRIMARY KEY,
    short_code VARCHAR(10) UNIQUE,
    long_url TEXT NOT NULL,
    created_at TIMESTAMP,
    expires_at TIMESTAMP,
    user_id BIGINT,
    click_count INT DEFAULT 0
);

CREATE INDEX idx_short_code ON urls(short_code);
CREATE INDEX idx_expires_at ON urls(expires_at);
```

## Architecture

```
Client → Load Balancer → App Servers → Redis Cache
                              ↓
                         Database (MySQL)
                              ↓
                         Analytics (Cassandra)
```

## Key Takeaways

### What Interviewers Look For
1. ✅ ID generation algorithm (Base62, Snowflake)
2. ✅ Collision handling
3. ✅ Caching strategy
4. ✅ Scalability (sharding, replication)
5. ✅ Analytics tracking
6. ✅ System design trade-offs

### Common Mistakes
1. ❌ Not considering collisions
2. ❌ Sequential IDs (security issue)
3. ❌ No caching (poor performance)
4. ❌ Single database (bottleneck)
5. ❌ Forgetting expiration
6. ❌ No rate limiting

### Production Checklist
- [x] Base62 encoding
- [x] Collision detection
- [x] Redis caching
- [x] Analytics tracking
- [ ] Distributed ID generation
- [ ] Database sharding
- [ ] Rate limiting
- [ ] CDN integration
- [ ] Malicious URL detection

---

## Related Problems
- 🔐 **OAuth/API Keys** - Token generation
- 🎫 **Ticket Booking** - Unique ID generation
- 📊 **Analytics** - Click tracking
- 🔒 **Rate Limiter** - Abuse prevention

*Production-ready URL shortener with Base62 encoding, caching, and analytics. Essential system design interview problem.*

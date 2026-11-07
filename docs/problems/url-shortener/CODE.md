# url-shortener - Complete Implementation

> Generated from `src/main/java/com/you/lld/problems/urlshortener/` on 2026-11-07. Re-run `python3 scripts/generate-code-md.py url-shortener`.

## Project Structure (16 files)

```
urlshortener/
├── URLShortenerDemo.java
├── URLShortener.java
├── model/AliasUnavailableException.java
├── model/Analytics.java
├── model/ShortURL.java
├── model/URLMapping.java
├── model/URLNotFoundException.java
├── service/URLRepository.java
├── service/URLShortenerService.java
├── service/UrlEncodingStrategy.java
├── service/impl/Base62Encoder.java
├── service/impl/CounterBase62EncodingStrategy.java
├── service/impl/HashBase62EncodingStrategy.java
├── service/impl/InMemoryURLRepository.java
├── service/impl/URLShortenerServiceImpl.java
├── service/impl/URLValidator.java
```

## Source Code

### `URLShortenerDemo.java`

<details>
<summary>Click to view URLShortenerDemo.java</summary>

```java
package com.you.lld.problems.urlshortener;

import com.you.lld.problems.urlshortener.model.AliasUnavailableException;
import com.you.lld.problems.urlshortener.model.Analytics;
import com.you.lld.problems.urlshortener.model.ShortURL;
import com.you.lld.problems.urlshortener.model.URLNotFoundException;

public class URLShortenerDemo {

    public static void main(String[] args) {
        System.out.println("=== URL Shortener Demo ===\n");

        URLShortener counterService = new URLShortener("https://short.ly", URLShortener.EncodingMode.COUNTER);

        System.out.println("--- Scenario 1: Counter-based shortening ---");
        ShortURL s1 = counterService.shorten("https://www.google.com/search?q=java+lld");
        System.out.println("Short: " + s1.getFullUrl());
        ShortURL s2 = counterService.shorten("https://www.example.com/very/long/path");
        System.out.println("Short: " + s2.getFullUrl());

        System.out.println("\n--- Scenario 2: Idempotent (same URL → same code) ---");
        ShortURL again = counterService.shorten("https://www.google.com/search?q=java+lld");
        System.out.println("Codes match: " + s1.getCode().equals(again.getCode()));

        System.out.println("\n--- Scenario 3: Custom alias ---");
        ShortURL custom = counterService.shorten("https://github.com/myrepo", "myrepo");
        System.out.println("Custom: " + custom.getFullUrl());

        System.out.println("\n--- Scenario 4: Hash-based encoding strategy ---");
        URLShortener hashService = new URLShortener("https://h.ly", URLShortener.EncodingMode.HASH);
        ShortURL h1 = hashService.shorten("https://docs.oracle.com/javase/8/docs/api/");
        ShortURL h2 = hashService.shorten("https://maven.apache.org/guides/");
        System.out.println("Hash codes: " + h1.getCode() + ", " + h2.getCode());

        System.out.println("\n--- Scenario 5: Resolve + analytics + errors ---");
        for (int i = 0; i < 3; i++) {
            counterService.resolve(s1.getCode());
        }
        Analytics stats = counterService.analytics(s1.getCode());
        System.out.println("Access count: " + stats.getAccessCount());

        try {
            counterService.shorten("not-a-url");
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid URL caught: " + e.getMessage());
        }
        try {
            counterService.shorten("https://other.com", "myrepo");
        } catch (AliasUnavailableException e) {
            System.out.println("Alias conflict: " + e.getMessage());
        }
        try {
            counterService.resolve("missing");
        } catch (URLNotFoundException e) {
            System.out.println("Not found: " + e.getMessage());
        }

        System.out.println("\n=== Demo complete ===");
    }
}
```

</details>

### `URLShortener.java`

<details>
<summary>Click to view URLShortener.java</summary>

```java
package com.you.lld.problems.urlshortener;

import com.you.lld.problems.urlshortener.model.Analytics;
import com.you.lld.problems.urlshortener.model.ShortURL;
import com.you.lld.problems.urlshortener.service.URLRepository;
import com.you.lld.problems.urlshortener.service.URLShortenerService;
import com.you.lld.problems.urlshortener.service.UrlEncodingStrategy;
import com.you.lld.problems.urlshortener.service.impl.CounterBase62EncodingStrategy;
import com.you.lld.problems.urlshortener.service.impl.HashBase62EncodingStrategy;
import com.you.lld.problems.urlshortener.service.impl.InMemoryURLRepository;
import com.you.lld.problems.urlshortener.service.impl.URLShortenerServiceImpl;

/** Facade — wire repository + encoding strategy at construction time. */
public class URLShortener {

    public enum EncodingMode {
        COUNTER, HASH
    }

    private final URLShortenerService service;

    public URLShortener(String baseUrl) {
        this(baseUrl, EncodingMode.COUNTER);
    }

    public URLShortener(String baseUrl, EncodingMode mode) {
        URLRepository repo = new InMemoryURLRepository();
        UrlEncodingStrategy strategy = mode == EncodingMode.HASH
            ? new HashBase62EncodingStrategy(repo, 6)
            : new CounterBase62EncodingStrategy(repo, 6);
        this.service = new URLShortenerServiceImpl(baseUrl, repo, strategy);
    }

    public URLShortener(URLShortenerService service) {
        this.service = service;
    }

    public ShortURL shorten(String longUrl) {
        return service.shorten(longUrl);
    }

    public ShortURL shorten(String longUrl, String alias) {
        return service.shorten(longUrl, alias);
    }

    public String resolve(String shortCode) {
        return service.resolve(shortCode);
    }

    public Analytics analytics(String shortCode) {
        return service.getAnalytics(shortCode);
    }

    public boolean delete(String shortCode) {
        return service.delete(shortCode);
    }

    public int totalUrls() {
        return service.totalUrls();
    }

    public URLShortenerService unwrap() {
        return service;
    }
}
```

</details>

### `model/AliasUnavailableException.java`

<details>
<summary>Click to view model/AliasUnavailableException.java</summary>

```java
package com.you.lld.problems.urlshortener.model;

public class AliasUnavailableException extends RuntimeException {

    public AliasUnavailableException(String message) {
        super(message);
    }
}
```

</details>

### `model/Analytics.java`

<details>
<summary>Click to view model/Analytics.java</summary>

```java
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
```

</details>

### `model/ShortURL.java`

<details>
<summary>Click to view model/ShortURL.java</summary>

```java
package com.you.lld.problems.urlshortener.model;

import java.util.Objects;

public class ShortURL {

    private final String code;
    private final String fullUrl;

    public ShortURL(String code, String baseUrl) {
        if (code == null || code.isEmpty()) {
            throw new IllegalArgumentException("Code cannot be null or empty");
        }
        if (baseUrl == null || baseUrl.isEmpty()) {
            throw new IllegalArgumentException("Base URL cannot be null or empty");
        }
        this.code = code;
        this.fullUrl = (baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl) + "/" + code;
    }

    public String getCode() {
        return code;
    }

    public String getFullUrl() {
        return fullUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
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

### `model/URLMapping.java`

<details>
<summary>Click to view model/URLMapping.java</summary>

```java
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
```

</details>

### `model/URLNotFoundException.java`

<details>
<summary>Click to view model/URLNotFoundException.java</summary>

```java
package com.you.lld.problems.urlshortener.model;

public class URLNotFoundException extends RuntimeException {

    public URLNotFoundException(String message) {
        super(message);
    }
}
```

</details>

### `service/URLRepository.java`

<details>
<summary>Click to view service/URLRepository.java</summary>

```java
package com.you.lld.problems.urlshortener.service;

import com.you.lld.problems.urlshortener.model.Analytics;
import com.you.lld.problems.urlshortener.model.ShortURL;
import com.you.lld.problems.urlshortener.model.URLMapping;

public interface URLRepository {

    URLMapping findByShortCode(String shortCode);

    String findShortCodeByLongUrl(String longUrl);

    void save(URLMapping mapping);

    boolean delete(String shortCode);

    boolean isShortCodeTaken(String shortCode);

    int count();
}
```

</details>

### `service/URLShortenerService.java`

<details>
<summary>Click to view service/URLShortenerService.java</summary>

```java
package com.you.lld.problems.urlshortener.service;

import com.you.lld.problems.urlshortener.model.Analytics;
import com.you.lld.problems.urlshortener.model.ShortURL;

public interface URLShortenerService {

    ShortURL shorten(String longUrl);

    ShortURL shorten(String longUrl, String customAlias);

    String resolve(String shortCode);

    Analytics getAnalytics(String shortCode);

    boolean delete(String shortCode);

    int totalUrls();
}
```

</details>

### `service/UrlEncodingStrategy.java`

<details>
<summary>Click to view service/UrlEncodingStrategy.java</summary>

```java
package com.you.lld.problems.urlshortener.service;

public interface UrlEncodingStrategy {

    String encode(String longUrl);

    String name();
}
```

</details>

### `service/impl/Base62Encoder.java`

<details>
<summary>Click to view service/impl/Base62Encoder.java</summary>

```java
package com.you.lld.problems.urlshortener.service.impl;

public final class Base62Encoder {

    private static final String BASE62_CHARS =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int BASE = 62;

    private Base62Encoder() {
    }

    public static String encode(long num) {
        if (num < 0) {
            throw new IllegalArgumentException("Number must be non-negative");
        }
        if (num == 0) {
            return "0";
        }
        StringBuilder result = new StringBuilder();
        long value = num;
        while (value > 0) {
            result.append(BASE62_CHARS.charAt((int) (value % BASE)));
            value /= BASE;
        }
        return result.reverse().toString();
    }

    public static String encode(long num, int minLength) {
        String encoded = encode(num);
        if (encoded.length() >= minLength) {
            return encoded;
        }
        StringBuilder padded = new StringBuilder();
        for (int i = 0; i < minLength - encoded.length(); i++) {
            padded.append('0');
        }
        padded.append(encoded);
        return padded.toString();
    }
}
```

</details>

### `service/impl/CounterBase62EncodingStrategy.java`

<details>
<summary>Click to view service/impl/CounterBase62EncodingStrategy.java</summary>

```java
package com.you.lld.problems.urlshortener.service.impl;

import com.you.lld.problems.urlshortener.service.URLRepository;
import com.you.lld.problems.urlshortener.service.UrlEncodingStrategy;

import java.util.concurrent.atomic.AtomicLong;

/** Counter-based Base62 — predictable, monotonic short codes. */
public class CounterBase62EncodingStrategy implements UrlEncodingStrategy {

    private final AtomicLong counter;
    private final int minLength;
    private final URLRepository repository;

    public CounterBase62EncodingStrategy(URLRepository repository, int minLength) {
        this.repository = repository;
        this.minLength = minLength;
        this.counter = new AtomicLong(1);
    }

    @Override
    public String encode(String longUrl) {
        for (int attempt = 0; attempt < 100; attempt++) {
            String code = Base62Encoder.encode(counter.getAndIncrement(), minLength);
            if (!repository.isShortCodeTaken(code)) {
                return code;
            }
        }
        throw new IllegalStateException("Failed to generate unique counter code");
    }

    @Override
    public String name() {
        return "COUNTER_BASE62";
    }
}
```

</details>

### `service/impl/HashBase62EncodingStrategy.java`

<details>
<summary>Click to view service/impl/HashBase62EncodingStrategy.java</summary>

```java
package com.you.lld.problems.urlshortener.service.impl;

import com.you.lld.problems.urlshortener.service.URLRepository;
import com.you.lld.problems.urlshortener.service.UrlEncodingStrategy;

/** Hash-based Base62 — deterministic per URL; linear probing on collision. */
public class HashBase62EncodingStrategy implements UrlEncodingStrategy {

    private final int minLength;
    private final URLRepository repository;

    public HashBase62EncodingStrategy(URLRepository repository, int minLength) {
        this.repository = repository;
        this.minLength = minLength;
    }

    @Override
    public String encode(String longUrl) {
        long hash = Math.abs(longUrl.hashCode());
        for (int probe = 0; probe < 100; probe++) {
            String code = Base62Encoder.encode(hash + probe, minLength);
            if (!repository.isShortCodeTaken(code)) {
                return code;
            }
        }
        throw new IllegalStateException("Hash collision probe limit exceeded for: " + longUrl);
    }

    @Override
    public String name() {
        return "HASH_BASE62";
    }
}
```

</details>

### `service/impl/InMemoryURLRepository.java`

<details>
<summary>Click to view service/impl/InMemoryURLRepository.java</summary>

```java
package com.you.lld.problems.urlshortener.service.impl;

import com.you.lld.problems.urlshortener.model.URLMapping;
import com.you.lld.problems.urlshortener.service.URLRepository;

import java.util.concurrent.ConcurrentHashMap;

public class InMemoryURLRepository implements URLRepository {

    private final ConcurrentHashMap<String, URLMapping> shortToLong = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> longToShort = new ConcurrentHashMap<>();

    @Override
    public URLMapping findByShortCode(String shortCode) {
        return shortToLong.get(shortCode);
    }

    @Override
    public String findShortCodeByLongUrl(String longUrl) {
        return longToShort.get(longUrl);
    }

    @Override
    public void save(URLMapping mapping) {
        String existing = longToShort.get(mapping.getLongURL());
        if (existing != null && !existing.equals(mapping.getShortCode())) {
            shortToLong.remove(existing);
        }
        shortToLong.put(mapping.getShortCode(), mapping);
        longToShort.put(mapping.getLongURL(), mapping.getShortCode());
    }

    @Override
    public boolean delete(String shortCode) {
        URLMapping removed = shortToLong.remove(shortCode);
        if (removed != null) {
            longToShort.remove(removed.getLongURL());
            return true;
        }
        return false;
    }

    @Override
    public boolean isShortCodeTaken(String shortCode) {
        return shortToLong.containsKey(shortCode);
    }

    @Override
    public int count() {
        return shortToLong.size();
    }
}
```

</details>

### `service/impl/URLShortenerServiceImpl.java`

<details>
<summary>Click to view service/impl/URLShortenerServiceImpl.java</summary>

```java
package com.you.lld.problems.urlshortener.service.impl;

import com.you.lld.problems.urlshortener.model.AliasUnavailableException;
import com.you.lld.problems.urlshortener.model.Analytics;
import com.you.lld.problems.urlshortener.model.ShortURL;
import com.you.lld.problems.urlshortener.model.URLMapping;
import com.you.lld.problems.urlshortener.model.URLNotFoundException;
import com.you.lld.problems.urlshortener.service.URLRepository;
import com.you.lld.problems.urlshortener.service.URLShortenerService;
import com.you.lld.problems.urlshortener.service.UrlEncodingStrategy;

public class URLShortenerServiceImpl implements URLShortenerService {

    private final URLRepository repository;
    private final UrlEncodingStrategy encodingStrategy;
    private final String baseUrl;

    public URLShortenerServiceImpl(String baseUrl, URLRepository repository, UrlEncodingStrategy encodingStrategy) {
        if (baseUrl == null || baseUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("baseUrl required");
        }
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.repository = repository;
        this.encodingStrategy = encodingStrategy;
    }

    @Override
    public ShortURL shorten(String longUrl) {
        String normalized = URLValidator.normalize(longUrl);
        String existing = repository.findShortCodeByLongUrl(normalized);
        if (existing != null) {
            return new ShortURL(existing, baseUrl);
        }
        String code = encodingStrategy.encode(normalized);
        URLMapping mapping = new URLMapping(code, normalized);
        repository.save(mapping);
        return new ShortURL(code, baseUrl);
    }

    @Override
    public ShortURL shorten(String longUrl, String customAlias) {
        if (!URLValidator.isValid(longUrl)) {
            throw new IllegalArgumentException("Invalid URL: " + longUrl);
        }
        if (!URLValidator.isValidAlias(customAlias)) {
            throw new IllegalArgumentException("Invalid alias: " + customAlias);
        }
        if (repository.isShortCodeTaken(customAlias)) {
            throw new AliasUnavailableException("Alias '" + customAlias + "' is already taken");
        }
        String normalized = URLValidator.normalize(longUrl);
        URLMapping mapping = new URLMapping(customAlias, normalized);
        repository.save(mapping);
        return new ShortURL(customAlias, baseUrl);
    }

    @Override
    public String resolve(String shortCode) {
        URLMapping mapping = repository.findByShortCode(shortCode);
        if (mapping == null) {
            throw new URLNotFoundException("Short code not found: " + shortCode);
        }
        mapping.recordAccess();
        return mapping.getLongURL();
    }

    @Override
    public Analytics getAnalytics(String shortCode) {
        URLMapping mapping = repository.findByShortCode(shortCode);
        if (mapping == null) {
            throw new URLNotFoundException("Short code not found: " + shortCode);
        }
        return mapping.getAnalytics();
    }

    @Override
    public boolean delete(String shortCode) {
        return repository.delete(shortCode);
    }

    @Override
    public int totalUrls() {
        return repository.count();
    }
}
```

</details>

### `service/impl/URLValidator.java`

<details>
<summary>Click to view service/impl/URLValidator.java</summary>

```java
package com.you.lld.problems.urlshortener.service.impl;

import java.net.MalformedURLException;
import java.net.URL;

public final class URLValidator {

    private static final int MAX_URL_LENGTH = 2048;
    private static final int MIN_URL_LENGTH = 10;

    private URLValidator() {
    }

    public static boolean isValid(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        String trimmed = url.trim();
        if (trimmed.length() < MIN_URL_LENGTH || trimmed.length() > MAX_URL_LENGTH) {
            return false;
        }
        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
            return false;
        }
        try {
            URL parsed = new URL(trimmed);
            String host = parsed.getHost();
            return host != null && !host.isEmpty() && host.contains(".");
        } catch (MalformedURLException e) {
            return false;
        }
    }

    public static String normalize(String url) {
        if (!isValid(url)) {
            throw new IllegalArgumentException("Invalid URL: " + url);
        }
        try {
            URL parsed = new URL(url.trim());
            String protocol = parsed.getProtocol().toLowerCase();
            String host = parsed.getHost().toLowerCase();
            int port = parsed.getPort();
            String path = parsed.getPath();
            String query = parsed.getQuery();

            if ((protocol.equals("http") && port == 80) || (protocol.equals("https") && port == 443)) {
                port = -1;
            }
            if (path.length() > 1 && path.endsWith("/")) {
                path = path.substring(0, path.length() - 1);
            }

            StringBuilder normalized = new StringBuilder();
            normalized.append(protocol).append("://").append(host);
            if (port != -1) {
                normalized.append(":").append(port);
            }
            normalized.append(path.isEmpty() ? "/" : path);
            if (query != null && !query.isEmpty()) {
                normalized.append("?").append(query);
            }
            return normalized.toString();
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Invalid URL: " + url, e);
        }
    }

    public static boolean isValidAlias(String alias) {
        if (alias == null || alias.isEmpty()) {
            return false;
        }
        if (alias.length() < 4 || alias.length() > 8) {
            return false;
        }
        if (!alias.matches("^[a-zA-Z0-9]+$")) {
            return false;
        }
        return !isReserved(alias.toLowerCase());
    }

    private static boolean isReserved(String alias) {
        String[] reserved = {"admin", "api", "www", "login", "stats"};
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

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.urlshortener.URLShortenerDemo"
```

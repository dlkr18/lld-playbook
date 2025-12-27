# Key-Value Store (Redis)

## Overview
In-memory key-value store with string, list, set, hash data structures and TTL support.

## Key Features
- String operations (GET, SET, DEL)
- Lists (LPUSH, RPUSH, LPOP, RPOP)
- Sets (SADD, SREM, SMEMBERS)
- Hashes (HSET, HGET, HDEL)
- TTL (Time To Live) expiration

## Key Operations
```java
public void set(String key, String value, long ttlSeconds) {
    store.put(key, value);
    
    if (ttlSeconds > 0) {
        long expiryTime = System.currentTimeMillis() + (ttlSeconds * 1000);
        expirations.put(key, expiryTime);
    }
}

public String get(String key) {
    // Check expiration
    if (isExpired(key)) {
        store.remove(key);
        expirations.remove(key);
        return null;
    }
    
    return store.get(key);
}
```

## Source Code
📄 **[View Complete Source Code](/problems/kvstore/CODE)**

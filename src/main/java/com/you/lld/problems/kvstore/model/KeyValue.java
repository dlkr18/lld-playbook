package com.you.lld.problems.kvstore.model;

import java.time.LocalDateTime;

public class KeyValue {
    private final String key;
    private String value;
    private LocalDateTime timestamp;
    private Long ttl;
    
    public KeyValue(String key, String value) {
        this.key = key;
        this.value = value;
        this.timestamp = LocalDateTime.now();
    }
    
    public void setValue(String value) {
        this.value = value;
        this.timestamp = LocalDateTime.now();
    }
    
    public void setTtl(Long ttl) {
        this.ttl = ttl;
    }
    
    public boolean isExpired() {
        if (ttl == null) return false;
        return LocalDateTime.now().isAfter(timestamp.plusSeconds(ttl));
    }
    
    public String getKey() { return key; }
    public String getValue() { return value; }
    public LocalDateTime getTimestamp() { return timestamp; }
    
    @Override
    public String toString() {
        return key + "=" + value;
    }
}

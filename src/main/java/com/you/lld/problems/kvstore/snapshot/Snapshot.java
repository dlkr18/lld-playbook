package com.you.lld.problems.kvstore.snapshot;

import java.time.LocalDateTime;
import java.util.*;

public class Snapshot {
    private final String id;
    private final Map<String, String> data;
    private final LocalDateTime timestamp;
    
    public Snapshot(String id, Map<String, String> data) {
        this.id = id;
        this.data = new HashMap<>(data);
        this.timestamp = LocalDateTime.now();
    }
    
    public String getId() { return id; }
    public Map<String, String> getData() { return new HashMap<>(data); }
    public LocalDateTime getTimestamp() { return timestamp; }
}

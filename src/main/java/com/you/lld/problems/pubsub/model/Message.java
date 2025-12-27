package com.you.lld.problems.pubsub.model;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Represents a message in the pub/sub system.
 */
public class Message {
    private final String id;
    private final String content;
    private final Map<String, String> attributes;
    private final LocalDateTime timestamp;
    
    public Message(String id, String content) {
        this.id = id;
        this.content = content;
        this.attributes = new HashMap<>();
        this.timestamp = LocalDateTime.now();
    }
    
    public Message(String id, String content, Map<String, String> attributes) {
        this.id = id;
        this.content = content;
        this.attributes = new HashMap<>(attributes);
        this.timestamp = LocalDateTime.now();
    }
    
    public String getId() {
        return id;
    }
    
    public String getContent() {
        return content;
    }
    
    public Map<String, String> getAttributes() {
        return new HashMap<>(attributes);
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}

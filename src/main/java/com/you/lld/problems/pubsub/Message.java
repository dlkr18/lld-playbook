package com.you.lld.problems.pubsub;

import java.time.LocalDateTime;
import java.util.*;

public class Message {
    private final String id;
    private final String topic;
    private final Object payload;
    private final Map<String, String> metadata;
    private final LocalDateTime timestamp;
    
    public Message(String id, String topic, Object payload) {
        this.id = id;
        this.topic = topic;
        this.payload = payload;
        this.metadata = new HashMap<>();
        this.timestamp = LocalDateTime.now();
    }
    
    public String getId() { return id; }
    public String getTopic() { return topic; }
    public Object getPayload() { return payload; }
    public LocalDateTime getTimestamp() { return timestamp; }
}

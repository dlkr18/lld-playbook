package com.you.lld.problems.pubsub.model;

import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Immutable message published to a topic.
 * Shared by reference across subscriber queues (safe because immutable).
 */
public final class Message {

    private final String id;
    private final String content;
    private final Map<String, String> attributes;
    private final Instant timestamp;

    public Message(String id, String content) {
        this(id, content, Collections.emptyMap());
    }

    public Message(String id, String content, Map<String, String> attributes) {
        if (id == null || id.trim().isEmpty()) throw new IllegalArgumentException("Message id required");
        if (content == null)            throw new IllegalArgumentException("Content required");
        this.id = id;
        this.content = content;
        this.attributes = Collections.unmodifiableMap(new HashMap<>(attributes));
        this.timestamp = Instant.now();
    }

    public String getId()                     { return id; }
    public String getContent()                { return content; }
    public Map<String, String> getAttributes(){ return attributes; }
    public Instant getTimestamp()              { return timestamp; }

    @Override
    public String toString() {
        return String.format("Message{id='%s', content='%s'}", id, content);
    }
}

package com.you.lld.problems.pubsub.model;

import java.time.LocalDateTime;

/**
 * Represents a subscription to a topic.
 */
public class Subscription {
    private final String id;
    private final String topicName;
    private final Subscriber subscriber;
    private final LocalDateTime createdAt;
    
    public Subscription(String id, String topicName, Subscriber subscriber) {
        this.id = id;
        this.topicName = topicName;
        this.subscriber = subscriber;
        this.createdAt = LocalDateTime.now();
    }
    
    public String getId() {
        return id;
    }
    
    public String getTopicName() {
        return topicName;
    }
    
    public Subscriber getSubscriber() {
        return subscriber;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}

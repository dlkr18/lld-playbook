package com.you.lld.problems.pubsub.exceptions;

public class TopicNotFoundException extends RuntimeException {
    public TopicNotFoundException(String topicName) {
        super("Topic not found: " + topicName);
    }
}

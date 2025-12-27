package com.you.lld.problems.pubsub.impl;

import com.you.lld.problems.pubsub.api.PubSubService;
import com.you.lld.problems.pubsub.model.Message;
import com.you.lld.problems.pubsub.model.Subscriber;
import com.you.lld.problems.pubsub.model.Topic;
import com.you.lld.problems.pubsub.model.Subscription;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Thread-safe in-memory Pub/Sub implementation.
 */
public class InMemoryPubSubService implements PubSubService {
    
    private final Map<String, Topic> topics;
    private final Map<String, Subscription> subscriptions;
    private final Map<String, Queue<Message>> subscriberMessages;
    private final AtomicLong subscriptionIdGenerator;
    
    public InMemoryPubSubService() {
        this.topics = new ConcurrentHashMap<>();
        this.subscriptions = new ConcurrentHashMap<>();
        this.subscriberMessages = new ConcurrentHashMap<>();
        this.subscriptionIdGenerator = new AtomicLong(0);
    }
    
    @Override
    public boolean createTopic(String topicName) {
        if (topics.containsKey(topicName)) {
            return false;
        }
        topics.put(topicName, new Topic(topicName));
        return true;
    }
    
    @Override
    public boolean deleteTopic(String topicName) {
        Topic topic = topics.remove(topicName);
        if (topic == null) {
            return false;
        }
        
        // Remove all subscriptions to this topic
        for (String subId : topic.getSubscriptionIds()) {
            subscriptions.remove(subId);
            subscriberMessages.remove(subId);
        }
        
        return true;
    }
    
    @Override
    public boolean publish(String topicName, Message message) {
        Topic topic = topics.get(topicName);
        if (topic == null) {
            return false;
        }
        
        // Deliver message to all subscribers
        for (String subscriptionId : topic.getSubscriptionIds()) {
            Queue<Message> queue = subscriberMessages.computeIfAbsent(
                subscriptionId,
                k -> new ConcurrentLinkedQueue<>()
            );
            queue.offer(message);
        }
        
        return true;
    }
    
    @Override
    public String subscribe(String topicName, Subscriber subscriber) {
        Topic topic = topics.get(topicName);
        if (topic == null) {
            return null;
        }
        
        String subscriptionId = "SUB-" + subscriptionIdGenerator.incrementAndGet();
        Subscription subscription = new Subscription(subscriptionId, topicName, subscriber);
        
        subscriptions.put(subscriptionId, subscription);
        topic.addSubscription(subscriptionId);
        subscriberMessages.put(subscriptionId, new ConcurrentLinkedQueue<>());
        
        return subscriptionId;
    }
    
    @Override
    public boolean unsubscribe(String topicName, String subscriptionId) {
        Topic topic = topics.get(topicName);
        if (topic == null) {
            return false;
        }
        
        topic.removeSubscription(subscriptionId);
        subscriptions.remove(subscriptionId);
        subscriberMessages.remove(subscriptionId);
        
        return true;
    }
    
    @Override
    public List<Message> getMessages(String subscriptionId) {
        Queue<Message> queue = subscriberMessages.get(subscriptionId);
        if (queue == null) {
            return new ArrayList<>();
        }
        return new ArrayList<>(queue);
    }
    
    @Override
    public boolean acknowledgeMessage(String subscriptionId, String messageId) {
        Queue<Message> queue = subscriberMessages.get(subscriptionId);
        if (queue == null) {
            return false;
        }
        
        return queue.removeIf(m -> m.getId().equals(messageId));
    }
}


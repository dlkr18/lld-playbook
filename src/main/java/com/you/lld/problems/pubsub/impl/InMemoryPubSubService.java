package com.you.lld.problems.pubsub.impl;

import com.you.lld.problems.pubsub.api.PubSubService;
import com.you.lld.problems.pubsub.model.Message;
import com.you.lld.problems.pubsub.model.Subscriber;
import com.you.lld.problems.pubsub.model.Topic;
import com.you.lld.problems.pubsub.model.Subscription;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Thread-safe in-memory Pub/Sub implementation with acknowledgment timeout.
 */
public class InMemoryPubSubService implements PubSubService {
    
    private final Map<String, Topic> topics;
    private final Map<String, Subscription> subscriptions;
    private final Map<String, Queue<Message>> subscriberMessages;
    private final AtomicLong subscriptionIdGenerator;
    
    /** Tracks delivery time: subscriptionId -> (messageId -> deliveryTimestamp) */
    private final Map<String, Map<String, Long>> deliveryTimestamps;
    private static final long ACK_TIMEOUT_MS = 30_000; // 30 seconds
    private final ScheduledExecutorService ackTimeoutScheduler;
    
    public InMemoryPubSubService() {
        this.topics = new ConcurrentHashMap<>();
        this.subscriptions = new ConcurrentHashMap<>();
        this.subscriberMessages = new ConcurrentHashMap<>();
        this.subscriptionIdGenerator = new AtomicLong(0);
        this.deliveryTimestamps = new ConcurrentHashMap<>();
        this.ackTimeoutScheduler = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "pubsub-ack-timeout");
            t.setDaemon(true);
            return t;
        });
        ackTimeoutScheduler.scheduleAtFixedRate(this::checkAckTimeouts, 10, 10, TimeUnit.SECONDS);
    }
    
    /**
     * Check for messages that have exceeded the acknowledgment timeout.
     * Logs a warning for each timed-out message (in production, could redeliver or dead-letter).
     */
    private void checkAckTimeouts() {
        long now = System.currentTimeMillis();
        for (Map.Entry<String, Map<String, Long>> subEntry : deliveryTimestamps.entrySet()) {
            String subscriptionId = subEntry.getKey();
            Map<String, Long> timestamps = subEntry.getValue();
            Iterator<Map.Entry<String, Long>> it = timestamps.entrySet().iterator();
            while (it.hasNext()) {
                Map.Entry<String, Long> entry = it.next();
                if (now - entry.getValue() > ACK_TIMEOUT_MS) {
                    System.out.println("ACK timeout: message " + entry.getKey()
                            + " on subscription " + subscriptionId + " not acknowledged in time");
                    it.remove();
                }
            }
        }
    }
    
    public void shutdown() {
        ackTimeoutScheduler.shutdown();
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
        
        // Deliver message to all subscribers and track delivery time
        long now = System.currentTimeMillis();
        for (String subscriptionId : topic.getSubscriptionIds()) {
            Queue<Message> queue = subscriberMessages.computeIfAbsent(
                subscriptionId,
                k -> new ConcurrentLinkedQueue<>()
            );
            queue.offer(message);
            deliveryTimestamps.computeIfAbsent(subscriptionId, k -> new ConcurrentHashMap<>())
                    .put(message.getId(), now);
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
        deliveryTimestamps.remove(subscriptionId);
        
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
        
        boolean removed = queue.removeIf(m -> m.getId().equals(messageId));
        // Clear delivery tracking on acknowledgment
        if (removed) {
            Map<String, Long> timestamps = deliveryTimestamps.get(subscriptionId);
            if (timestamps != null) {
                timestamps.remove(messageId);
            }
        }
        return removed;
    }
}


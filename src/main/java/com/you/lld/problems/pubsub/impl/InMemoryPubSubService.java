package com.you.lld.problems.pubsub.impl;

import com.you.lld.problems.pubsub.api.PubSubService;
import com.you.lld.problems.pubsub.exceptions.SubscriptionNotFoundException;
import com.you.lld.problems.pubsub.exceptions.TopicNotFoundException;
import com.you.lld.problems.pubsub.model.Message;
import com.you.lld.problems.pubsub.model.MessageHandler;
import com.you.lld.problems.pubsub.model.Subscription;
import com.you.lld.problems.pubsub.model.Topic;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Thread-safe in-memory Pub/Sub implementation.
 *
 * Patterns:
 *   Observer   -- push subscribers get MessageHandler.onMessage() invoked
 *                 asynchronously via a thread pool on each publish.
 *   Fan-out    -- publish delivers to EVERY subscription on the topic.
 *   Pull       -- subscribers without a handler poll via pull() and ack.
 *   Per-sub queue -- each Subscription has its own ConcurrentLinkedQueue
 *                    inbox, so one slow consumer doesn't block others.
 *
 * Concurrency:
 *   - ConcurrentHashMap for topics and subscriptions.
 *   - Topic.subscriptionIds is a ConcurrentHashMap.newKeySet().
 *   - Subscription.inbox is a ConcurrentLinkedQueue.
 *   - Push delivery happens on a dedicated thread pool (non-blocking publish).
 */
public class InMemoryPubSubService implements PubSubService {

    private final Map<String, Topic> topics = new ConcurrentHashMap<>();
    private final Map<String, Subscription> subscriptions = new ConcurrentHashMap<>();
    private final AtomicLong subIdGen = new AtomicLong(0);
    private final ExecutorService pushExecutor;

    public InMemoryPubSubService() {
        this(4);
    }

    public InMemoryPubSubService(int pushThreads) {
        this.pushExecutor = Executors.newFixedThreadPool(pushThreads, r -> {
            Thread t = new Thread(r, "pubsub-push-" + r.hashCode());
            t.setDaemon(true);
            return t;
        });
    }

    // ======================== Topic management ========================

    @Override
    public void createTopic(String topicName) {
        if (topicName == null || topicName.trim().isEmpty()) {
            throw new IllegalArgumentException("Topic name required");
        }
        if (topics.putIfAbsent(topicName, new Topic(topicName)) != null) {
            throw new IllegalStateException("Topic already exists: " + topicName);
        }
        System.out.println("[PubSub] Topic created: " + topicName);
    }

    @Override
    public void deleteTopic(String topicName) {
        Topic topic = topics.remove(topicName);
        if (topic == null) throw new TopicNotFoundException(topicName);

        for (String subId : topic.getSubscriptionIds()) {
            subscriptions.remove(subId);
        }
        System.out.println("[PubSub] Topic deleted: " + topicName + " (" + topic.getSubscriptionIds().size() + " subs removed)");
    }

    // ======================== Publish (fan-out) ========================

    @Override
    public void publish(String topicName, Message message) {
        Topic topic = topics.get(topicName);
        if (topic == null) throw new TopicNotFoundException(topicName);

        for (String subId : topic.getSubscriptionIds()) {
            Subscription sub = subscriptions.get(subId);
            if (sub == null) continue;

            sub.enqueue(message);

            if (sub.hasPushHandler()) {
                pushExecutor.submit(() -> {
                    try {
                        sub.getHandler().onMessage(sub.getId(), message);
                    } catch (Exception e) {
                        System.err.println("[PubSub] Push delivery failed for " + sub.getId() + ": " + e.getMessage());
                    }
                });
            }
        }
    }

    // ======================== Subscribe ========================

    @Override
    public String subscribe(String topicName, String subscriberId, MessageHandler handler) {
        return doSubscribe(topicName, subscriberId, handler);
    }

    @Override
    public String subscribe(String topicName, String subscriberId) {
        return doSubscribe(topicName, subscriberId, null);
    }

    private String doSubscribe(String topicName, String subscriberId, MessageHandler handler) {
        Topic topic = topics.get(topicName);
        if (topic == null) throw new TopicNotFoundException(topicName);

        String subId = "SUB-" + subIdGen.incrementAndGet();
        Subscription sub = new Subscription(subId, topicName, subscriberId, handler);
        subscriptions.put(subId, sub);
        topic.addSubscription(subId);

        System.out.println("[PubSub] Subscribed: " + subscriberId + " -> " + topicName
            + " (id=" + subId + ", push=" + sub.hasPushHandler() + ")");
        return subId;
    }

    // ======================== Unsubscribe ========================

    @Override
    public void unsubscribe(String subscriptionId) {
        Subscription sub = subscriptions.remove(subscriptionId);
        if (sub == null) throw new SubscriptionNotFoundException(subscriptionId);

        Topic topic = topics.get(sub.getTopicName());
        if (topic != null) {
            topic.removeSubscription(subscriptionId);
        }
        System.out.println("[PubSub] Unsubscribed: " + sub.getSubscriberId() + " from " + sub.getTopicName());
    }

    // ======================== Pull + Ack ========================

    @Override
    public List<Message> pull(String subscriptionId) {
        Subscription sub = subscriptions.get(subscriptionId);
        if (sub == null) throw new SubscriptionNotFoundException(subscriptionId);
        return sub.peekAll();
    }

    @Override
    public void acknowledge(String subscriptionId, String messageId) {
        Subscription sub = subscriptions.get(subscriptionId);
        if (sub == null) throw new SubscriptionNotFoundException(subscriptionId);

        if (!sub.ack(messageId)) {
            System.out.println("[PubSub] Ack no-op: message " + messageId + " not found in " + subscriptionId);
        }
    }

    // ======================== Shutdown ========================

    @Override
    public void shutdown() {
        pushExecutor.shutdown();
        try {
            if (!pushExecutor.awaitTermination(5, TimeUnit.SECONDS)) {
                pushExecutor.shutdownNow();
            }
        } catch (InterruptedException e) {
            pushExecutor.shutdownNow();
            Thread.currentThread().interrupt();
        }
        System.out.println("[PubSub] Service shut down.");
    }
}

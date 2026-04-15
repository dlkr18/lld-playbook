package com.you.lld.problems.pubsub.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * A subscription binds a subscriber to a topic.
 *
 * Each subscription has:
 *   - An inbox queue (per-subscriber fan-out buffer)
 *   - An optional MessageHandler for push delivery (Observer pattern)
 *   - Pull consumers read from the inbox and ack messages
 *
 * Thread safety: inbox is a ConcurrentLinkedQueue; the service
 * synchronizes higher-level operations that span multiple fields.
 */
public class Subscription {

    private final String id;
    private final String topicName;
    private final String subscriberId;
    private final MessageHandler handler;    // null for pull-only subscribers
    private final Instant createdAt;
    private final Queue<Message> inbox = new ConcurrentLinkedQueue<>();

    public Subscription(String id, String topicName, String subscriberId, MessageHandler handler) {
        this.id = id;
        this.topicName = topicName;
        this.subscriberId = subscriberId;
        this.handler = handler;
        this.createdAt = Instant.now();
    }

    public String getId()            { return id; }
    public String getTopicName()     { return topicName; }
    public String getSubscriberId()  { return subscriberId; }
    public MessageHandler getHandler() { return handler; }
    public Instant getCreatedAt()    { return createdAt; }
    public boolean hasPushHandler()  { return handler != null; }

    public void enqueue(Message message) {
        inbox.offer(message);
    }

    public List<Message> peekAll() {
        return new ArrayList<>(inbox);
    }

    public boolean ack(String messageId) {
        return inbox.removeIf(m -> m.getId().equals(messageId));
    }

    public int pendingCount() {
        return inbox.size();
    }

    @Override
    public String toString() {
        return String.format("Subscription{id='%s', topic='%s', subscriber='%s', pending=%d}",
            id, topicName, subscriberId, inbox.size());
    }
}

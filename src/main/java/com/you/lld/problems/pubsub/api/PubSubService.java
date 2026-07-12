package com.you.lld.problems.pubsub.api;

import com.you.lld.problems.pubsub.model.Message;
import com.you.lld.problems.pubsub.model.MessageHandler;

import java.util.List;

/**
 * Pub/Sub messaging service API.
 *
 * Patterns:
 *   Observer  -- push subscribers provide a MessageHandler (callback)
 *   Fan-out   -- one publish delivers to all topic subscriptions
 *   Pull      -- subscribers without a handler poll via {@link #pull}
 *   Ack       -- messages stay in the inbox until acknowledged
 *
 * Exceptions are thrown for missing topics/subscriptions instead of
 * silent boolean/null returns so callers can distinguish "not found"
 * from "nothing to do".
 */
public interface PubSubService {

    void createTopic(String topicName);
    void deleteTopic(String topicName);

    /** Publish a message to all subscriptions on a topic. */
    void publish(String topicName, Message message);

    /** Subscribe with push delivery (Observer pattern). */
    String subscribe(String topicName, String subscriberId, MessageHandler handler);

    /** Subscribe for pull-only consumption (no push callback). */
    String subscribe(String topicName, String subscriberId);

    void unsubscribe(String subscriptionId);

    /** Pull pending messages for a subscription (non-destructive peek). */
    List<Message> pull(String subscriptionId);

    /** Acknowledge and remove a message from the subscription inbox. */
    void acknowledge(String subscriptionId, String messageId);

    void shutdown();
}

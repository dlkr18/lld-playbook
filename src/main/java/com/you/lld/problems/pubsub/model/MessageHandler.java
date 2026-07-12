package com.you.lld.problems.pubsub.model;

/**
 * Observer interface for push-based message delivery.
 *
 * Subscribers provide a MessageHandler when subscribing to a topic.
 * On publish, the service fans out and invokes each handler asynchronously.
 * Pull-only subscribers can subscribe without a handler and poll instead.
 */
@FunctionalInterface
public interface MessageHandler {
    void onMessage(String subscriptionId, Message message);
}

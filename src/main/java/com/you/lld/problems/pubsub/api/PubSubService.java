package com.you.lld.problems.pubsub.api;

import com.you.lld.problems.pubsub.model.Message;
import com.you.lld.problems.pubsub.model.Subscriber;

import java.util.List;

/**
 * Service interface for Publish-Subscribe messaging system.
 * Supports topics, publishers, subscribers, and message delivery.
 */
public interface PubSubService {
    
    /**
     * Creates a new topic.
     * 
     * @param topicName Name of the topic
     * @return true if created successfully
     */
    boolean createTopic(String topicName);
    
    /**
     * Deletes a topic.
     * 
     * @param topicName Name of the topic
     * @return true if deleted successfully
     */
    boolean deleteTopic(String topicName);
    
    /**
     * Publishes a message to a topic.
     * 
     * @param topicName Topic to publish to
     * @param message Message to publish
     * @return true if published successfully
     */
    boolean publish(String topicName, Message message);
    
    /**
     * Subscribes to a topic.
     * 
     * @param topicName Topic to subscribe to
     * @param subscriber Subscriber to add
     * @return Subscription ID
     */
    String subscribe(String topicName, Subscriber subscriber);
    
    /**
     * Unsubscribes from a topic.
     * 
     * @param topicName Topic to unsubscribe from
     * @param subscriptionId Subscription ID to remove
     * @return true if unsubscribed successfully
     */
    boolean unsubscribe(String topicName, String subscriptionId);
    
    /**
     * Gets all messages for a subscriber.
     * 
     * @param subscriptionId Subscription ID
     * @return List of messages
     */
    List<Message> getMessages(String subscriptionId);
    
    /**
     * Acknowledges message receipt.
     * 
     * @param subscriptionId Subscription ID
     * @param messageId Message ID to acknowledge
     * @return true if acknowledged successfully
     */
    boolean acknowledgeMessage(String subscriptionId, String messageId);
}



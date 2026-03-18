package com.you.lld.problems.pubsub;

import com.you.lld.problems.pubsub.impl.InMemoryPubSubService;
import com.you.lld.problems.pubsub.model.Message;
import com.you.lld.problems.pubsub.model.Subscriber;

import java.util.List;

/**
 * Demo: Pub/Sub system with topics, subscribers, message delivery, acknowledgment.
 */
public class PubSubDemo {

    public static void main(String[] args) {
        System.out.println("=== Pub/Sub Demo ===\n");

        InMemoryPubSubService service = new InMemoryPubSubService();

        // Create topics
        service.createTopic("orders");
        service.createTopic("notifications");
        System.out.println("Created topics: orders, notifications");

        // Subscribe
        Subscriber sub1 = new Subscriber("warehouse-service");
        Subscriber sub2 = new Subscriber("billing-service");
        Subscriber sub3 = new Subscriber("email-service");

        String subId1 = service.subscribe("orders", sub1);
        String subId2 = service.subscribe("orders", sub2);
        String subId3 = service.subscribe("notifications", sub3);
        System.out.println("Subscribed: warehouse=" + subId1 + ", billing=" + subId2 + ", email=" + subId3);

        // Publish messages
        System.out.println("\n--- Publishing ---");
        service.publish("orders", new Message("m1", "New order: ORD-1001"));
        service.publish("orders", new Message("m2", "New order: ORD-1002"));
        service.publish("notifications", new Message("m3", "Welcome email for user-42"));

        // Consume messages
        System.out.println("\n--- Consuming ---");
        List<Message> warehouseMessages = service.getMessages(subId1);
        System.out.println("warehouse-service received " + warehouseMessages.size() + " messages:");
        for (Message m : warehouseMessages) {
            System.out.println("  " + m.getId() + ": " + m.getContent());
        }

        List<Message> billingMessages = service.getMessages(subId2);
        System.out.println("billing-service received " + billingMessages.size() + " messages");

        List<Message> emailMessages = service.getMessages(subId3);
        System.out.println("email-service received " + emailMessages.size() + " messages:");
        for (Message m : emailMessages) {
            System.out.println("  " + m.getId() + ": " + m.getContent());
        }

        // Acknowledge
        System.out.println("\n--- Acknowledgment ---");
        boolean acked = service.acknowledgeMessage(subId1, "m1");
        System.out.println("Acknowledged m1: " + acked);

        // Unsubscribe
        System.out.println("\n--- Unsubscribe ---");
        service.unsubscribe("orders", subId2);
        service.publish("orders", new Message("m4", "New order: ORD-1003"));
        List<Message> afterUnsub = service.getMessages(subId2);
        System.out.println("billing-service messages after unsubscribe: " + afterUnsub.size());

        // Delete topic
        service.deleteTopic("notifications");
        System.out.println("Deleted topic: notifications");

        System.out.println("\n=== Demo complete ===");
    }
}

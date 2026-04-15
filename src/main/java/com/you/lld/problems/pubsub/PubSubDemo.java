package com.you.lld.problems.pubsub;

import com.you.lld.problems.pubsub.api.PubSubService;
import com.you.lld.problems.pubsub.exceptions.SubscriptionNotFoundException;
import com.you.lld.problems.pubsub.exceptions.TopicNotFoundException;
import com.you.lld.problems.pubsub.impl.InMemoryPubSubService;
import com.you.lld.problems.pubsub.model.Message;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * End-to-end demo of the Pub/Sub system exercising:
 *
 *   1. Topic management       -- create, delete
 *   2. Observer pattern (push) -- MessageHandler callback on publish
 *   3. Pull consumption       -- poll inbox + ack
 *   4. Fan-out                -- one publish reaches all subscribers
 *   5. Unsubscribe            -- no more deliveries after unsub
 *   6. Message attributes     -- key-value metadata on messages
 *   7. Error handling         -- TopicNotFoundException, SubscriptionNotFoundException
 *   8. Concurrent publish     -- multiple threads publishing simultaneously
 *   9. Graceful shutdown      -- push executor drained
 */
public class PubSubDemo {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("========================================");
        System.out.println("  Pub/Sub System -- Full LLD Demo");
        System.out.println("========================================\n");

        InMemoryPubSubService service = new InMemoryPubSubService();

        demoTopicAndSubscribe(service);
        demoFanOutPublish(service);
        demoPullAndAck(service);
        demoPushObserver(service);
        demoUnsubscribe(service);
        demoMessageAttributes(service);
        demoErrorHandling(service);
        demoConcurrentPublish(service);
        demoDeleteTopic(service);

        service.shutdown();

        System.out.println("========================================");
        System.out.println("  All demos completed.");
        System.out.println("========================================");
    }

    // ──────────── 1. Topics & Subscribe ────────────

    static String pullSubId;
    static String pushSubId;
    static String billingSubId;

    private static void demoTopicAndSubscribe(PubSubService service) {
        System.out.println("--- Demo 1: Topic Creation & Subscription ---\n");
        service.createTopic("orders");
        service.createTopic("notifications");

        pullSubId = service.subscribe("orders", "warehouse-service");
        billingSubId = service.subscribe("orders", "billing-service");
        System.out.println();
    }

    // ──────────── 2. Fan-out publish ────────────

    private static void demoFanOutPublish(PubSubService service) {
        System.out.println("--- Demo 2: Fan-out Publish ---\n");
        service.publish("orders", new Message("m1", "New order: ORD-1001"));
        service.publish("orders", new Message("m2", "New order: ORD-1002"));

        List<Message> warehouseInbox = service.pull(pullSubId);
        List<Message> billingInbox = service.pull(billingSubId);
        System.out.println("warehouse-service inbox: " + warehouseInbox.size() + " messages");
        System.out.println("billing-service inbox:   " + billingInbox.size() + " messages");
        for (Message m : warehouseInbox) {
            System.out.println("  " + m);
        }
        System.out.println();
    }

    // ──────────── 3. Pull & Ack ────────────

    private static void demoPullAndAck(PubSubService service) {
        System.out.println("--- Demo 3: Pull & Acknowledge ---\n");

        System.out.println("Before ack: " + service.pull(pullSubId).size() + " pending");
        service.acknowledge(pullSubId, "m1");
        System.out.println("Acked m1 -> " + service.pull(pullSubId).size() + " pending");
        service.acknowledge(pullSubId, "m2");
        System.out.println("Acked m2 -> " + service.pull(pullSubId).size() + " pending");
        System.out.println();
    }

    // ──────────── 4. Push (Observer pattern) ────────────

    private static void demoPushObserver(PubSubService service) throws InterruptedException {
        System.out.println("--- Demo 4: Push Delivery (Observer Pattern) ---\n");

        pushSubId = service.subscribe("notifications", "email-service",
            (subId, msg) -> System.out.println("  [PUSH -> email-service] " + msg.getContent()));

        service.publish("notifications", new Message("m3", "Welcome user-42!"));
        service.publish("notifications", new Message("m4", "Password reset for user-99"));

        Thread.sleep(200);
        System.out.println();
    }

    // ──────────── 5. Unsubscribe ────────────

    private static void demoUnsubscribe(PubSubService service) {
        System.out.println("--- Demo 5: Unsubscribe ---\n");

        service.unsubscribe(billingSubId);
        service.publish("orders", new Message("m5", "New order: ORD-1003"));

        try {
            service.pull(billingSubId);
        } catch (SubscriptionNotFoundException e) {
            System.out.println("billing-service pull after unsub: " + e.getMessage());
        }

        List<Message> warehouse = service.pull(pullSubId);
        System.out.println("warehouse-service still receives: " + warehouse.size() + " pending (m5)");
        service.acknowledge(pullSubId, "m5");
        System.out.println();
    }

    // ──────────── 6. Message attributes ────────────

    private static void demoMessageAttributes(PubSubService service) {
        System.out.println("--- Demo 6: Message Attributes ---\n");

        Map<String, String> attrs = new HashMap<>();
        attrs.put("orderId", "ORD-1001");
        attrs.put("carrier", "FedEx");
        attrs.put("tracking", "FX123456");
        Message rich = new Message("m6", "Order shipped", attrs);
        service.publish("orders", rich);

        List<Message> msgs = service.pull(pullSubId);
        Message last = msgs.get(msgs.size() - 1);
        System.out.println("Message: " + last.getContent());
        System.out.println("Attributes: " + last.getAttributes());
        service.acknowledge(pullSubId, "m6");
        System.out.println();
    }

    // ──────────── 7. Error handling ────────────

    private static void demoErrorHandling(PubSubService service) {
        System.out.println("--- Demo 7: Error Handling ---\n");

        try {
            service.publish("nonexistent", new Message("x", "test"));
        } catch (TopicNotFoundException e) {
            System.out.println("Publish to missing topic: " + e.getMessage());
        }

        try {
            service.subscribe("nonexistent", "someone");
        } catch (TopicNotFoundException e) {
            System.out.println("Subscribe to missing topic: " + e.getMessage());
        }

        try {
            service.pull("SUB-999");
        } catch (SubscriptionNotFoundException e) {
            System.out.println("Pull from missing sub: " + e.getMessage());
        }

        try {
            service.createTopic("orders");
        } catch (IllegalStateException e) {
            System.out.println("Duplicate topic: " + e.getMessage());
        }
        System.out.println();
    }

    // ──────────── 8. Concurrent publish ────────────

    private static void demoConcurrentPublish(PubSubService service) throws InterruptedException {
        System.out.println("--- Demo 8: Concurrent Publish ---\n");

        service.createTopic("events");
        String concSubId = service.subscribe("events", "analytics-service");

        Thread[] threads = new Thread[5];
        for (int i = 0; i < 5; i++) {
            final int idx = i;
            threads[i] = new Thread(() ->
                service.publish("events", new Message("ev-" + idx, "Event from thread-" + idx)));
        }
        for (Thread t : threads) t.start();
        for (Thread t : threads) {
            t.join();
        }

        List<Message> events = service.pull(concSubId);
        System.out.println("analytics-service received " + events.size() + " events from 5 threads:");
        for (Message m : events) {
            System.out.println("  " + m);
        }
        System.out.println();
    }

    // ──────────── 9. Delete topic ────────────

    private static void demoDeleteTopic(PubSubService service) {
        System.out.println("--- Demo 9: Delete Topic ---\n");

        service.deleteTopic("notifications");

        try {
            service.publish("notifications", new Message("x", "after delete"));
        } catch (TopicNotFoundException e) {
            System.out.println("Publish after delete: " + e.getMessage());
        }
        System.out.println();
    }
}

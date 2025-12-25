package com.you.lld.problems.pubsub;

import java.util.*;
import java.util.concurrent.*;

public class PubSubSystem {
    private final Map<String, List<Subscriber>> topicSubscribers;
    private final BlockingQueue<Message> messageQueue;
    private final ExecutorService executor;
    
    public PubSubSystem() {
        this.topicSubscribers = new ConcurrentHashMap<>();
        this.messageQueue = new LinkedBlockingQueue<>();
        this.executor = Executors.newFixedThreadPool(4);
        startMessageProcessor();
    }
    
    public void subscribe(String topic, Subscriber subscriber) {
        topicSubscribers.computeIfAbsent(topic, k -> new ArrayList<>()).add(subscriber);
    }
    
    public void unsubscribe(String topic, Subscriber subscriber) {
        List<Subscriber> subscribers = topicSubscribers.get(topic);
        if (subscribers != null) {
            subscribers.remove(subscriber);
        }
    }
    
    public void publish(String topic, Message message) {
        messageQueue.offer(message);
    }
    
    private void startMessageProcessor() {
        executor.submit(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    Message message = messageQueue.take();
                    deliverMessage(message);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        });
    }
    
    private void deliverMessage(Message message) {
        List<Subscriber> subscribers = topicSubscribers.get(message.getTopic());
        if (subscribers != null) {
            for (Subscriber subscriber : subscribers) {
                executor.submit(() -> subscriber.onMessage(message));
            }
        }
    }
    
    public void shutdown() {
        executor.shutdown();
    }
}

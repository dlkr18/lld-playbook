package com.you.lld.problems.notification.impl;

import com.you.lld.problems.notification.api.NotificationService;
import com.you.lld.problems.notification.model.*;
import java.util.*;
import java.util.concurrent.*;

public class NotificationServiceImpl implements NotificationService {
    
    private final Map<String, Notification> notifications = new ConcurrentHashMap<>();
    private final PriorityQueue<Notification> pendingQueue = new PriorityQueue<>(
        Comparator.comparing(Notification::getPriority, 
                           Comparator.comparingInt(Priority::getValue).reversed())
    );
    private final ExecutorService executorService = Executors.newFixedThreadPool(4);
    private final int MAX_RETRIES = 3;
    
    public NotificationServiceImpl() {
        // Start worker thread
        executorService.submit(this::processQueue);
    }
    
    @Override
    public String sendNotification(String userId, String message, 
                                  NotificationChannel channel, Priority priority) {
        String id = UUID.randomUUID().toString();
        Notification notification = new Notification(id, userId, message, channel, priority);
        
        notifications.put(id, notification);
        synchronized (pendingQueue) {
            pendingQueue.offer(notification);
            pendingQueue.notifyAll();
        }
        
        System.out.println("📨 Queued: " + notification);
        return id;
    }
    
    @Override
    public Notification getNotificationStatus(String notificationId) {
        return notifications.get(notificationId);
    }
    
    @Override
    public void retryFailed() {
        List<Notification> failed = new ArrayList<>();
        for (Notification n : notifications.values()) {
            if (n.getStatus() == NotificationStatus.FAILED && 
                n.getRetryCount() < MAX_RETRIES) {
                failed.add(n);
            }
        }
        
        for (Notification n : failed) {
            n.setStatus(NotificationStatus.RETRYING);
            n.incrementRetry();
            synchronized (pendingQueue) {
                pendingQueue.offer(n);
                pendingQueue.notifyAll();
            }
        }
        
        System.out.println("🔄 Retrying " + failed.size() + " failed notifications");
    }
    
    private void processQueue() {
        while (true) {
            Notification notification = null;
            
            synchronized (pendingQueue) {
                while (pendingQueue.isEmpty()) {
                    try {
                        pendingQueue.wait();
                    } catch (InterruptedException e) {
                        return;
                    }
                }
                notification = pendingQueue.poll();
            }
            
            if (notification != null) {
                sendViaChannel(notification);
            }
        }
    }
    
    private void sendViaChannel(Notification notification) {
        try {
            // Simulate sending
            Thread.sleep(100);
            
            // Simulate 10% failure rate
            if (Math.random() < 0.1) {
                throw new RuntimeException("Channel unavailable");
            }
            
            notification.setStatus(NotificationStatus.SENT);
            System.out.println("✅ Sent: " + notification);
            
        } catch (Exception e) {
            notification.setStatus(NotificationStatus.FAILED);
            System.out.println("❌ Failed: " + notification);
        }
    }
    
    public void shutdown() {
        executorService.shutdown();
    }
}

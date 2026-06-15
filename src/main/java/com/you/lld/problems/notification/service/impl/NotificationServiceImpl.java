package com.you.lld.problems.notification.service.impl;

import com.you.lld.problems.notification.model.Notification;
import com.you.lld.problems.notification.model.NotificationChannel;
import com.you.lld.problems.notification.model.NotificationStatus;
import com.you.lld.problems.notification.model.Priority;
import com.you.lld.problems.notification.retry.RetryPolicy;
import com.you.lld.problems.notification.service.ChannelSender;
import com.you.lld.problems.notification.service.NotificationService;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

public class NotificationServiceImpl implements NotificationService {

    private final Map<String, Notification> notifications = new ConcurrentHashMap<>();
    private final PriorityBlockingQueue<Notification> pendingQueue;
    private final ChannelSenderFactory senderFactory;
    private final NotificationTemplateRegistry templates;
    private final RetryPolicy retryPolicy;
    private final ExecutorService executor;
    private final AtomicBoolean running = new AtomicBoolean(true);

    public NotificationServiceImpl() {
        this(new RetryPolicy(3, 100L), new ChannelSenderFactory(), new NotificationTemplateRegistry());
    }

    public NotificationServiceImpl(RetryPolicy retryPolicy, ChannelSenderFactory senderFactory,
                                   NotificationTemplateRegistry templates) {
        this.retryPolicy = retryPolicy;
        this.senderFactory = senderFactory;
        this.templates = templates;
        this.pendingQueue = new PriorityBlockingQueue<>(64, Comparator
            .comparing(Notification::getPriority, Comparator.comparingInt(Priority::getValue).reversed())
            .thenComparing(Notification::getCreatedAt));
        this.executor = Executors.newFixedThreadPool(4);
        executor.submit(new QueueWorker());
    }

    @Override
    public String send(String userId, String message, NotificationChannel channel, Priority priority) {
        return enqueue(userId, message, channel, priority);
    }

    @Override
    public String sendTemplated(String userId, String templateId, Map<String, String> variables,
                                NotificationChannel channel, Priority priority) {
        String message = templates.render(templateId, variables);
        return enqueue(userId, message, channel, priority);
    }

    @Override
    public List<String> sendMultiChannel(String userId, String message, List<NotificationChannel> channels,
                                         Priority priority) {
        List<String> ids = new ArrayList<>();
        for (NotificationChannel channel : channels) {
            ids.add(enqueue(userId, message, channel, priority));
        }
        return ids;
    }

    @Override
    public Notification getStatus(String notificationId) {
        return notifications.get(notificationId);
    }

    @Override
    public void retryFailed() {
        for (Notification notification : notifications.values()) {
            if (notification.getStatus() == NotificationStatus.FAILED
                && notification.getRetryCount() < retryPolicy.getMaxRetries()) {
                notification.setStatus(NotificationStatus.RETRYING);
                notification.incrementRetry();
                pendingQueue.offer(notification);
            }
        }
    }

    @Override
    public void shutdown() {
        running.set(false);
        executor.shutdownNow();
        try {
            executor.awaitTermination(5, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private String enqueue(String userId, String message, NotificationChannel channel, Priority priority) {
        String id = UUID.randomUUID().toString();
        Notification notification = new Notification(id, userId, message, channel, priority);
        notifications.put(id, notification);
        pendingQueue.offer(notification);
        return id;
    }

    private void dispatch(Notification notification) {
        ChannelSender sender = senderFactory.get(notification.getChannel());
        int attempt = notification.getRetryCount();
        while (attempt <= retryPolicy.getMaxRetries()) {
            try {
                if (attempt > 0) {
                    long delay = retryPolicy.getDelayForAttempt(attempt - 1);
                    Thread.sleep(delay);
                }
                sender.send(notification);
                notification.setStatus(NotificationStatus.SENT);
                return;
            } catch (Exception e) {
                attempt++;
                notification.incrementRetry();
                if (attempt > retryPolicy.getMaxRetries()) {
                    notification.setStatus(NotificationStatus.FAILED);
                    System.out.println("FAILED " + notification.getChannel() + " to " + notification.getUserId()
                        + ": " + e.getMessage());
                }
            }
        }
    }

    private class QueueWorker implements Runnable {
        @Override
        public void run() {
            while (running.get()) {
                try {
                    Notification notification = pendingQueue.poll(500, TimeUnit.MILLISECONDS);
                    if (notification != null) {
                        dispatch(notification);
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }
    }
}

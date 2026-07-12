package com.you.lld.problems.notification;

import com.you.lld.problems.notification.model.Notification;
import com.you.lld.problems.notification.model.NotificationChannel;
import com.you.lld.problems.notification.model.Priority;
import com.you.lld.problems.notification.service.NotificationService;
import com.you.lld.problems.notification.service.impl.NotificationServiceImpl;

import java.util.List;
import java.util.Map;

/** Facade over {@link NotificationService}. */
public class NotificationGateway {

    private final NotificationService service;

    public NotificationGateway() {
        this(new NotificationServiceImpl());
    }

    public NotificationGateway(NotificationService service) {
        this.service = service;
    }

    public String send(String userId, String message, NotificationChannel channel, Priority priority) {
        return service.send(userId, message, channel, priority);
    }

    public String sendTemplated(String userId, String templateId, Map<String, String> variables,
                                NotificationChannel channel, Priority priority) {
        return service.sendTemplated(userId, templateId, variables, channel, priority);
    }

    public List<String> sendMultiChannel(String userId, String message, List<NotificationChannel> channels,
                                         Priority priority) {
        return service.sendMultiChannel(userId, message, channels, priority);
    }

    public Notification getStatus(String id) {
        return service.getStatus(id);
    }

    public void retryFailed() {
        service.retryFailed();
    }

    public void shutdown() {
        service.shutdown();
    }

    public NotificationService unwrap() {
        return service;
    }
}

package com.you.lld.problems.notification.service.impl;

import com.you.lld.problems.notification.model.Notification;
import com.you.lld.problems.notification.service.ChannelSender;

/**
 * Template Method — shared validate → format → deliver pipeline; subclasses override deliver().
 */
public abstract class AbstractChannelSender implements ChannelSender {

    @Override
    public final void send(Notification notification) throws Exception {
        validate(notification);
        String payload = formatMessage(notification);
        deliver(notification.getUserId(), payload);
    }

    protected void validate(Notification notification) {
        if (notification.getUserId() == null || notification.getUserId().trim().isEmpty()) {
            throw new IllegalArgumentException("userId required");
        }
        if (notification.getMessage() == null || notification.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("message required");
        }
    }

    protected String formatMessage(Notification notification) {
        return notification.getMessage();
    }

    protected abstract void deliver(String userId, String payload) throws Exception;
}

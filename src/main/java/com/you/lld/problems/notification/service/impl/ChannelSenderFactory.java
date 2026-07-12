package com.you.lld.problems.notification.service.impl;

import com.you.lld.problems.notification.model.NotificationChannel;
import com.you.lld.problems.notification.service.ChannelSender;

import java.util.EnumMap;
import java.util.Map;

public final class ChannelSenderFactory {

    private final Map<NotificationChannel, ChannelSender> senders = new EnumMap<>(NotificationChannel.class);

    public ChannelSenderFactory() {
        register(new EmailChannelSender());
        register(new SmsChannelSender());
        register(new PushChannelSender());
        register(new InAppChannelSender());
    }

    public void register(ChannelSender sender) {
        senders.put(sender.channel(), sender);
    }

    public ChannelSender get(NotificationChannel channel) {
        ChannelSender sender = senders.get(channel);
        if (sender == null) {
            throw new IllegalArgumentException("No sender for channel: " + channel);
        }
        return sender;
    }
}

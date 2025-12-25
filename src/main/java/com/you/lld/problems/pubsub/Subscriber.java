package com.you.lld.problems.pubsub;

public interface Subscriber {
    void onMessage(Message message);
    String getSubscriberId();
}

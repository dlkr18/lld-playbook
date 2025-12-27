package com.you.lld.problems.pubsub.model;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Represents a topic in the pub/sub system.
 */
public class Topic {
    private final String name;
    private final Set<String> subscriptionIds;
    
    public Topic(String name) {
        this.name = name;
        this.subscriptionIds = ConcurrentHashMap.newKeySet();
    }
    
    public String getName() {
        return name;
    }
    
    public Set<String> getSubscriptionIds() {
        return new HashSet<>(subscriptionIds);
    }
    
    public void addSubscription(String subscriptionId) {
        subscriptionIds.add(subscriptionId);
    }
    
    public void removeSubscription(String subscriptionId) {
        subscriptionIds.remove(subscriptionId);
    }
}

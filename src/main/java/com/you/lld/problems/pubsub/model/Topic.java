package com.you.lld.problems.pubsub.model;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * A named topic that holds the set of active subscription IDs.
 * Thread-safe via ConcurrentHashMap-backed key set.
 */
public class Topic {

    private final String name;
    private final Set<String> subscriptionIds = ConcurrentHashMap.newKeySet();

    public Topic(String name) {
        if (name == null || name.trim().isEmpty()) throw new IllegalArgumentException("Topic name required");
        this.name = name;
    }

    public String getName()                        { return name; }
    public Set<String> getSubscriptionIds()        { return subscriptionIds; }
    public void addSubscription(String subId)      { subscriptionIds.add(subId); }
    public void removeSubscription(String subId)   { subscriptionIds.remove(subId); }

    @Override
    public String toString() {
        return String.format("Topic{name='%s', subscribers=%d}", name, subscriptionIds.size());
    }
}

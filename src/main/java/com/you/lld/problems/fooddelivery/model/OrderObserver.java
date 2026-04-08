package com.you.lld.problems.fooddelivery.model;

/**
 * Observer for Order lifecycle events.
 * Implementations (e.g. OrderNotifier) handle notification formatting/delivery.
 * Keeps Order entity pure -- SRP.
 */
public interface OrderObserver {
    void update(Order order);
}

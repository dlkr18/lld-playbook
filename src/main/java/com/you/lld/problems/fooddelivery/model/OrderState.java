package com.you.lld.problems.fooddelivery.model;

/**
 * State pattern for Order lifecycle.
 *
 *   Placed → Confirmed → Preparing → ReadyForPickup → OutForDelivery → Delivered
 *   Placed / Confirmed / Preparing → Cancelled
 *
 * States are STATELESS singletons. All mutable data lives on Order.
 * Side effects (partner release, notifications) are handled by the service.
 */
public interface OrderState {
    OrderState confirm(Order order);
    OrderState startPreparing(Order order);
    OrderState markReady(Order order);
    OrderState pickUp(Order order);
    OrderState deliver(Order order);
    OrderState cancel(Order order);
    OrderStatus getStatus();
}

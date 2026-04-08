package com.you.lld.problems.fooddelivery.impl;

import com.you.lld.problems.fooddelivery.api.NotificationService;
import com.you.lld.problems.fooddelivery.model.Order;
import com.you.lld.problems.fooddelivery.model.OrderObserver;

/**
 * Observer that bridges Order state changes -> NotificationService delivery.
 *
 * One OrderNotifier per stakeholder per order. The service registers:
 *   - Customer notifier on placeOrder
 *   - Restaurant notifier on placeOrder
 *   - Partner notifier on assignDeliveryPartner
 *
 * Keeps Order and all entity classes pure (no notification logic in entities -- SRP).
 */
public class OrderNotifier implements OrderObserver {

    private final String recipientId;
    private final String role;
    private final NotificationService notificationService;

    public OrderNotifier(String recipientId, String role, NotificationService notificationService) {
        this.recipientId = recipientId;
        this.role = role;
        this.notificationService = notificationService;
    }

    @Override
    public void update(Order order) {
        String msg;
        switch (order.getStatus()) {
            case CONFIRMED:
                msg = "Order " + order.getOrderId() + " confirmed by restaurant.";
                break;
            case PREPARING:
                msg = "Order " + order.getOrderId() + " is being prepared.";
                break;
            case READY_FOR_PICKUP:
                msg = "Order " + order.getOrderId() + " is ready for pickup.";
                break;
            case OUT_FOR_DELIVERY:
                msg = "Order " + order.getOrderId() + " is out for delivery.";
                break;
            case DELIVERED:
                msg = "Order " + order.getOrderId() + " delivered! Total: $"
                    + String.format("%.2f", order.getTotalAmount());
                break;
            case CANCELLED:
                msg = "Order " + order.getOrderId() + " has been cancelled.";
                break;
            default:
                return;
        }
        notificationService.notify(recipientId + " (" + role + ")", msg);
    }
}

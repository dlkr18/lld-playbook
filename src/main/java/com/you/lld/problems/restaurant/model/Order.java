package com.you.lld.problems.restaurant.model;

import java.util.*;

/**
 * Order with explicit state-machine transitions.
 */
public class Order {
    private final String orderId;
    private final List<MenuItem> items = new ArrayList<MenuItem>();
    private OrderStatus status;

    public Order(String id) {
        this.orderId = id;
        this.status = OrderStatus.PENDING;
    }

    public String getOrderId() {
        return orderId;
    }

    public void addItem(MenuItem item) {
        if (status != OrderStatus.PENDING) {
            throw new IllegalStateException("Cannot add items in state: " + status);
        }
        items.add(item);
    }

    public List<MenuItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void transitionTo(OrderStatus next) {
        if (!isValidTransition(status, next)) {
            throw new IllegalStateException("Invalid transition: " + status + " → " + next);
        }
        status = next;
    }

    private static boolean isValidTransition(OrderStatus from, OrderStatus to) {
        if (from == to) {
            return true;
        }
        switch (from) {
            case PENDING:
                return to == OrderStatus.PREPARING || to == OrderStatus.CANCELLED;
            case PREPARING:
                return to == OrderStatus.READY || to == OrderStatus.CANCELLED;
            case READY:
                return to == OrderStatus.SERVED || to == OrderStatus.CANCELLED;
            case SERVED:
                return to == OrderStatus.PAID;
            case PAID:
            case CANCELLED:
                return false;
            default:
                return false;
        }
    }
}

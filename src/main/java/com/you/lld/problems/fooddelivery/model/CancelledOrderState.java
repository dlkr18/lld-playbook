package com.you.lld.problems.fooddelivery.model;

public class CancelledOrderState implements OrderState {
    public static final CancelledOrderState INSTANCE = new CancelledOrderState();
    private CancelledOrderState() {}

    @Override public OrderState confirm(Order order)        { throw terminal(); }
    @Override public OrderState startPreparing(Order order) { throw terminal(); }
    @Override public OrderState markReady(Order order)      { throw terminal(); }
    @Override public OrderState pickUp(Order order)         { throw terminal(); }
    @Override public OrderState deliver(Order order)        { throw terminal(); }
    @Override public OrderState cancel(Order order)         { throw terminal(); }

    @Override public OrderStatus getStatus() { return OrderStatus.CANCELLED; }

    private IllegalStateException terminal() {
        return new IllegalStateException("Order is already CANCELLED (terminal)");
    }
}

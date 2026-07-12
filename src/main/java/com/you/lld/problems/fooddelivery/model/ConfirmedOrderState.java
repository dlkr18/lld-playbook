package com.you.lld.problems.fooddelivery.model;

public class ConfirmedOrderState implements OrderState {
    public static final ConfirmedOrderState INSTANCE = new ConfirmedOrderState();
    private ConfirmedOrderState() {}

    @Override public OrderState startPreparing(Order order) { return PreparingOrderState.INSTANCE; }
    @Override public OrderState cancel(Order order)         { return CancelledOrderState.INSTANCE; }

    @Override public OrderState confirm(Order order)        { throw invalid("already confirmed"); }
    @Override public OrderState markReady(Order order)      { throw invalid("not preparing yet"); }
    @Override public OrderState pickUp(Order order)         { throw invalid("not ready yet"); }
    @Override public OrderState deliver(Order order)        { throw invalid("not out for delivery yet"); }

    @Override public OrderStatus getStatus() { return OrderStatus.CONFIRMED; }

    private IllegalStateException invalid(String reason) {
        return new IllegalStateException("Order is CONFIRMED -- " + reason);
    }
}

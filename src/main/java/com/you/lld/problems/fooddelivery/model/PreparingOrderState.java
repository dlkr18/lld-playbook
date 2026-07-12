package com.you.lld.problems.fooddelivery.model;

public class PreparingOrderState implements OrderState {
    public static final PreparingOrderState INSTANCE = new PreparingOrderState();
    private PreparingOrderState() {}

    @Override public OrderState markReady(Order order)      { return ReadyForPickupState.INSTANCE; }
    @Override public OrderState cancel(Order order)         { return CancelledOrderState.INSTANCE; }

    @Override public OrderState confirm(Order order)        { throw invalid("already confirmed"); }
    @Override public OrderState startPreparing(Order order) { throw invalid("already preparing"); }
    @Override public OrderState pickUp(Order order)         { throw invalid("not ready yet"); }
    @Override public OrderState deliver(Order order)        { throw invalid("not out for delivery yet"); }

    @Override public OrderStatus getStatus() { return OrderStatus.PREPARING; }

    private IllegalStateException invalid(String reason) {
        return new IllegalStateException("Order is PREPARING -- " + reason);
    }
}

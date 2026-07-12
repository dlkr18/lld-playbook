package com.you.lld.problems.fooddelivery.model;

public class PlacedOrderState implements OrderState {
    public static final PlacedOrderState INSTANCE = new PlacedOrderState();
    private PlacedOrderState() {}

    @Override public OrderState confirm(Order order)        { return ConfirmedOrderState.INSTANCE; }
    @Override public OrderState cancel(Order order)         { return CancelledOrderState.INSTANCE; }

    @Override public OrderState startPreparing(Order order) { throw invalid("confirm before preparing"); }
    @Override public OrderState markReady(Order order)      { throw invalid("not preparing yet"); }
    @Override public OrderState pickUp(Order order)         { throw invalid("not ready yet"); }
    @Override public OrderState deliver(Order order)        { throw invalid("not out for delivery yet"); }

    @Override public OrderStatus getStatus() { return OrderStatus.PLACED; }

    private IllegalStateException invalid(String reason) {
        return new IllegalStateException("Order is PLACED -- " + reason);
    }
}

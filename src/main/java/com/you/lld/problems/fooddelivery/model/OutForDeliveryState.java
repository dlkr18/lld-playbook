package com.you.lld.problems.fooddelivery.model;

public class OutForDeliveryState implements OrderState {
    public static final OutForDeliveryState INSTANCE = new OutForDeliveryState();
    private OutForDeliveryState() {}

    @Override public OrderState deliver(Order order) { return DeliveredOrderState.INSTANCE; }

    @Override public OrderState confirm(Order order)        { throw invalid("already past confirmation"); }
    @Override public OrderState startPreparing(Order order) { throw invalid("already prepared"); }
    @Override public OrderState markReady(Order order)      { throw invalid("already picked up"); }
    @Override public OrderState pickUp(Order order)         { throw invalid("already picked up"); }
    @Override public OrderState cancel(Order order)         { throw invalid("order is en route, cannot cancel"); }

    @Override public OrderStatus getStatus() { return OrderStatus.OUT_FOR_DELIVERY; }

    private IllegalStateException invalid(String reason) {
        return new IllegalStateException("Order is OUT_FOR_DELIVERY -- " + reason);
    }
}

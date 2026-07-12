package com.you.lld.problems.fooddelivery.model;

public class ReadyForPickupState implements OrderState {
    public static final ReadyForPickupState INSTANCE = new ReadyForPickupState();
    private ReadyForPickupState() {}

    @Override public OrderState pickUp(Order order) { return OutForDeliveryState.INSTANCE; }

    @Override public OrderState confirm(Order order)        { throw invalid("already past confirmation"); }
    @Override public OrderState startPreparing(Order order) { throw invalid("already prepared"); }
    @Override public OrderState markReady(Order order)      { throw invalid("already ready"); }
    @Override public OrderState deliver(Order order)        { throw invalid("not picked up yet"); }
    @Override public OrderState cancel(Order order)         { throw invalid("food already prepared, cannot cancel"); }

    @Override public OrderStatus getStatus() { return OrderStatus.READY_FOR_PICKUP; }

    private IllegalStateException invalid(String reason) {
        return new IllegalStateException("Order is READY_FOR_PICKUP -- " + reason);
    }
}

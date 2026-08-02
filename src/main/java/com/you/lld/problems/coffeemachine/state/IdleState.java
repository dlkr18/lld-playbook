package com.you.lld.problems.coffeemachine.state;

import com.you.lld.problems.coffeemachine.model.Beverage;
import com.you.lld.problems.coffeemachine.model.BeverageType;
import com.you.lld.problems.coffeemachine.model.Order;
import com.you.lld.problems.coffeemachine.model.Payment;
import com.you.lld.problems.coffeemachine.service.impl.CoffeeMachineImpl;

/**
 * Idle — accepts a beverage selection; transitions to AwaitingPayment.
 */
public class IdleState implements CoffeeMachineState {
    private static final IdleState INSTANCE = new IdleState();

    private IdleState() {}

    public static IdleState getInstance() {
        return INSTANCE;
    }

    @Override
    public Order placeOrder(CoffeeMachineImpl machine, BeverageType type) {
        Beverage beverage = machine.getBeverage(type);
        if (beverage == null) {
            throw new IllegalArgumentException("Beverage not available: " + type);
        }
        // Selection only: check stock, reserve nothing, consume nothing. The drink
        // is not made until it has been paid for.
        Order order = machine.doSelect(beverage);
        machine.setState(AwaitingPaymentState.getInstance());
        return order;
    }

    @Override
    public boolean processPayment(CoffeeMachineImpl machine, String orderId, Payment payment) {
        throw new IllegalStateException("No order is awaiting payment — select a beverage first");
    }

    @Override
    public void cancelOrder(CoffeeMachineImpl machine) {
        throw new IllegalStateException("Nothing to cancel");
    }

    @Override
    public String getStateName() {
        return "IDLE";
    }
}

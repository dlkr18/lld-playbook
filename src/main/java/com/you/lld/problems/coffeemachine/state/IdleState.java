package com.you.lld.problems.coffeemachine.state;

import com.you.lld.problems.coffeemachine.model.Beverage;
import com.you.lld.problems.coffeemachine.model.BeverageType;
import com.you.lld.problems.coffeemachine.model.Order;
import com.you.lld.problems.coffeemachine.model.Payment;
import com.you.lld.problems.coffeemachine.service.impl.CoffeeMachineImpl;

/**
 * Idle — accepts new orders; transitions to Dispensing on placeOrder.
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
        machine.setState(DispensingState.getInstance());
        Order order = machine.brewOrder(beverage);
        machine.setState(IdleState.getInstance());
        return order;
    }

    @Override
    public boolean processPayment(CoffeeMachineImpl machine, String orderId, Payment payment) {
        return machine.doProcessPayment(orderId, payment);
    }

    @Override
    public String getStateName() {
        return "IDLE";
    }
}

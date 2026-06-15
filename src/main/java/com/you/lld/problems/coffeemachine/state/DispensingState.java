package com.you.lld.problems.coffeemachine.state;

import com.you.lld.problems.coffeemachine.model.BeverageType;
import com.you.lld.problems.coffeemachine.model.Order;
import com.you.lld.problems.coffeemachine.model.Payment;
import com.you.lld.problems.coffeemachine.service.impl.CoffeeMachineImpl;

/**
 * Dispensing — machine is brewing; rejects concurrent orders.
 */
public class DispensingState implements CoffeeMachineState {
    private static final DispensingState INSTANCE = new DispensingState();

    private DispensingState() {}

    public static DispensingState getInstance() {
        return INSTANCE;
    }

    @Override
    public Order placeOrder(CoffeeMachineImpl machine, BeverageType type) {
        throw new IllegalStateException("Machine is dispensing — please wait");
    }

    @Override
    public boolean processPayment(CoffeeMachineImpl machine, String orderId, Payment payment) {
        throw new IllegalStateException("Cannot pay while dispensing");
    }

    @Override
    public String getStateName() {
        return "DISPENSING";
    }
}

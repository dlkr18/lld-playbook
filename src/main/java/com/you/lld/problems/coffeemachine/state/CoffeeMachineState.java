package com.you.lld.problems.coffeemachine.state;

import com.you.lld.problems.coffeemachine.service.impl.CoffeeMachineImpl;
import com.you.lld.problems.coffeemachine.model.BeverageType;
import com.you.lld.problems.coffeemachine.model.Order;
import com.you.lld.problems.coffeemachine.model.Payment;

/**
 * State pattern for coffee machine lifecycle: Idle → Dispensing → Idle.
 */
public interface CoffeeMachineState {
    Order placeOrder(CoffeeMachineImpl machine, BeverageType type);
    boolean processPayment(CoffeeMachineImpl machine, String orderId, Payment payment);
    String getStateName();
}

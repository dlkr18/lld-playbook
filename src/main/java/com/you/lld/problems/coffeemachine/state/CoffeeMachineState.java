package com.you.lld.problems.coffeemachine.state;

import com.you.lld.problems.coffeemachine.service.impl.CoffeeMachineImpl;
import com.you.lld.problems.coffeemachine.model.BeverageType;
import com.you.lld.problems.coffeemachine.model.Order;
import com.you.lld.problems.coffeemachine.model.Payment;

/**
 * State pattern for the machine lifecycle:
 * {@code IDLE -> AWAITING_PAYMENT -> DISPENSING -> IDLE}.
 *
 * <p>The old comment described {@code IDLE -> DISPENSING -> IDLE}, but both
 * transitions happened inside one synchronized call, so no caller could observe
 * anything but IDLE — and payment was checked only after the drink was made.
 */
public interface CoffeeMachineState {
    Order placeOrder(CoffeeMachineImpl machine, BeverageType type);

    boolean processPayment(CoffeeMachineImpl machine, String orderId, Payment payment);

    /** Abandon the selected order. Legal only while awaiting payment. */
    void cancelOrder(CoffeeMachineImpl machine);

    String getStateName();
}

package com.you.lld.problems.coffeemachine.state;

import com.you.lld.problems.coffeemachine.model.BeverageType;
import com.you.lld.problems.coffeemachine.model.Order;
import com.you.lld.problems.coffeemachine.model.Payment;
import com.you.lld.problems.coffeemachine.service.impl.CoffeeMachineImpl;

/**
 * A beverage is selected and the machine is waiting to be paid.
 *
 * <p>This state is what makes the machine's lifecycle real. Previously the flow was
 * IDLE → (brew, consuming ingredients) → IDLE inside a single call, with payment
 * checked afterwards and ignored — so a customer got the drink whether or not they
 * paid, and no caller could ever observe a state other than IDLE.
 */
public class AwaitingPaymentState implements CoffeeMachineState {

    private static final AwaitingPaymentState INSTANCE = new AwaitingPaymentState();

    private AwaitingPaymentState() {
    }

    public static AwaitingPaymentState getInstance() {
        return INSTANCE;
    }

    @Override
    public Order placeOrder(CoffeeMachineImpl machine, BeverageType type) {
        throw new IllegalStateException(
                "Machine is awaiting payment for the current order — pay or cancel first");
    }

    @Override
    public boolean processPayment(CoffeeMachineImpl machine, String orderId, Payment payment) {
        return machine.doPayAndDispense(orderId, payment);
    }

    @Override
    public void cancelOrder(CoffeeMachineImpl machine) {
        machine.doCancel();
    }

    @Override
    public String getStateName() {
        return "AWAITING_PAYMENT";
    }
}

package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.impl.VendingMachineImpl;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;

/**
 * Idle -- machine waiting for money. Only insertMoney is valid.
 */
public class IdleState implements VendingMachineState {

    private static final IdleState INSTANCE = new IdleState();
    private IdleState() {}
    public static IdleState getInstance() { return INSTANCE; }

    @Override
    public void insertMoney(VendingMachineImpl machine, Money money) {
        if (money == null || money.isZero()) {
            throw new IllegalArgumentException("Money amount must be positive");
        }
        machine.addToBalance(money);
        machine.setState(HasMoneyState.getInstance());
    }

    @Override
    public Product selectProduct(VendingMachineImpl machine, String slotCode) {
        throw new IllegalStateException("Please insert money first");
    }

    @Override
    public Product dispense(VendingMachineImpl machine) {
        throw new IllegalStateException("Please insert money and select a product first");
    }

    @Override
    public Money cancel(VendingMachineImpl machine) {
        return Money.ZERO;
    }

    @Override
    public String getStateName() { return "IDLE"; }
}

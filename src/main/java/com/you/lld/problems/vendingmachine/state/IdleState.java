package com.you.lld.problems.vendingmachine.state;

import com.you.lld.problems.vendingmachine.api.VendingMachine;
import com.you.lld.problems.vendingmachine.model.Money;
import com.you.lld.problems.vendingmachine.model.Product;

/**
 * Idle state - machine is waiting for money insertion.
 */
public class IdleState implements VendingMachineState {
    
    private static final IdleState INSTANCE = new IdleState();
    
    private IdleState() {}
    
    public static IdleState getInstance() {
        return INSTANCE;
    }
    
    @Override
    public void insertMoney(VendingMachine machine, Money money) {
        if (money == null || money.isZero()) {
            throw new IllegalArgumentException("Money amount must be positive");
        }
        
        machine.addToBalance(money);
        machine.setState(HasMoneyState.getInstance());
    }
    
    @Override
    public Product selectProduct(VendingMachine machine, String slotCode) {
        throw new IllegalStateException("Please insert money first");
    }
    
    @Override
    public Product dispense(VendingMachine machine) {
        throw new IllegalStateException("Please insert money and select a product first");
    }
    
    @Override
    public Money cancel(VendingMachine machine) {
        return Money.ZERO; // Nothing to refund
    }
    
    @Override
    public String getStateName() {
        return "IDLE";
    }
}
